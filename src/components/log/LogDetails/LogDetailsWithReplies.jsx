import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Alert,
  Box,
  Button,
  CircularProgress,
  Stack,
  styled
} from "@mui/material";
import UnfoldMoreIcon from "@mui/icons-material/UnfoldMore";
import UnfoldLessIcon from "@mui/icons-material/UnfoldLess";
import LogDetails from "./LogDetails";
import LogHeader from "./LogHeader";
import { ologApi } from "api/ologApi";
import { getLogEntryGroupId } from "components/Properties";
import { sortByCreatedDate } from "components/log/sort";
import { useSearchPageParams } from "features/searchPageParamsReducer";

const LogDetailsAccordion = styled(
  ({ log, className, refProp, handleExpand, expandedLogs }) => {
    const { id: paramLogId } = useParams();
    const isSelected = log.id === Number(paramLogId);
    const isSelectedColor = isSelected ? "#0099dc24" : "#f2f5f7";

    const isExpanded = expandedLogs.includes(log.id);
    return (
      <Accordion
        ref={refProp}
        expanded={isExpanded}
        onChange={() => handleExpand(log.id)}
        variant="outlined"
        className={className}
        square
        transitionProps={{ timeout: 0 }}
        sx={{
          "& > .MuiButtonBase-root": { padding: 0 },
          border: 0,
          opacity: !isExpanded ? 0.7 : 1,
          "-webkit-filter": !isExpanded ? "grayscale(100%)" : "none",
          "&:hover": { opacity: 1, "-webkit-filter": "none" },
          "& .MuiCollapse-root": {
            transition: "none !important"
          }
        }}
      >
        <AccordionSummary
          aria-controls={`${log.id}-content`}
          id={`${log.id}-header`}
          sx={{
            borderRadius: isExpanded ? "4px 4px 0 0" : "4px",
            bgcolor: isSelectedColor,
            display: isExpanded ? "flex" : "block",
            userSelect: "text",
            "&.Mui-expanded": {
              minHeight: 0
            },
            "& .MuiAccordionSummary-content, & .MuiAccordionSummary-content.Mui-expanded":
              {
                padding: "0",
                margin: "0"
              }
          }}
        >
          <LogHeader
            log={log}
            expanded={isExpanded}
          />
        </AccordionSummary>
        <AccordionDetails
          sx={{
            padding: 0,
            borderWidth: "0 2px 2px 2px",
            borderStyle: "solid",
            borderColor: isSelectedColor,
            borderRadius: "0 0 4px 4px"
          }}
        >
          <LogDetails log={log} />
        </AccordionDetails>
      </Accordion>
    );
  }
)({
  margin: "0 0 10px 0",
  borderRadius: "4px",
  "&.Mui-expanded": {
    margin: "0 0 10px 0"
  },
  // Get rid of the small line above the accordion
  "&:before": {
    display: "none"
  }
});

const LogDetailsWithReplies = ({ log }) => {
  const [parentRef, setParentRef] = useState(null);
  const [logRef, setLogRef] = useState(null);
  const { id: paramLogId } = useParams();
  // fetch any groups/conversations
  const groupId = getLogEntryGroupId(log.properties);
  const {
    data: replies = [],
    isLoading: repliesLoading,
    error: repliesError
  } = ologApi.endpoints.getLogGroup.useQuery({ groupId });

  const dateDescending = useSearchPageParams().sort === "down";
  const [expandedLogs, setExpandedLogs] = useState([]);

  const logsWithReplies = useMemo(() => {
    return [log, ...replies.filter((it) => it.id !== log.id)].toSorted(
      sortByCreatedDate(dateDescending)
    );
  }, [dateDescending, log, replies]);

  const isExpandedAll = useMemo(
    () => expandedLogs.length === logsWithReplies.length,
    [expandedLogs, logsWithReplies]
  );

  useEffect(() => {
    if (parentRef && logRef) {
      setTimeout(() => {
        const y =
          logRef.getBoundingClientRect().top +
          parentRef.scrollTop -
          parentRef.getBoundingClientRect().top -
          40;
        parentRef.scrollTo({
          top: y,
          behavior: "smooth"
        });
      }, 0.1);
    }
  }, [parentRef, logRef]);

  useEffect(() => {
    setExpandedLogs((prev) => {
      const numericParamLogId = Number(paramLogId);
      const currentIsExpandedAll = prev.length === logsWithReplies.length;
      return currentIsExpandedAll
        ? [...prev, numericParamLogId]
        : [numericParamLogId];
    });
  }, [paramLogId, logsWithReplies.length]);

  const handleExpandAll = () => {
    setExpandedLogs(() =>
      !isExpandedAll ? logsWithReplies.map((logItem) => logItem.id) : []
    );
  };

  const handleExpand = (logId) => {
    setExpandedLogs((prev) =>
      prev.includes(logId)
        ? prev.filter((id) => id !== logId)
        : [...prev, logId]
    );
  };

  const handleParentRef = (node) => {
    if (node) {
      setParentRef(node);
    }
  };

  const handleLogRef = (node, sortedLogId) => {
    if (node && sortedLogId === Number(paramLogId)) {
      setLogRef(node);
    }
  };

  if (repliesLoading) {
    return <CircularProgress />;
  }

  if (repliesError) {
    console.error(`Unable to fetch replies for log ${log.id}`, repliesError);
    return (
      <Alert color="error">
        Unable to fetch replies, {repliesError.code}: {repliesError.message}
      </Alert>
    );
  }

  // replies view
  if (replies?.length > 0) {
    return (
      <Stack
        ref={handleParentRef}
        sx={{
          overflow: "auto",
          padding: "0px 15px 10px 15px",
          position: "relative"
        }}
      >
        <Box
          sx={{
            backgroundColor: "#fff",
            width: "100%",
            position: "sticky",
            top: "0px",
            zIndex: 1,
            py: 0.8
          }}
        >
          <Button
            startIcon={
              isExpandedAll ? (
                <UnfoldLessIcon sx={{ width: "16px", marginBottom: "2px" }} />
              ) : (
                <UnfoldMoreIcon sx={{ width: "16px", marginBottom: "2px" }} />
              )
            }
            sx={{ fontSize: ".85rem", py: 0.2 }}
            onClick={handleExpandAll}
          >
            {isExpandedAll ? "Collapse all" : "Expand all"}
          </Button>
        </Box>
        {logsWithReplies.map((sortedLog) => (
          <LogDetailsAccordion
            refProp={(node) => handleLogRef(node, sortedLog?.id)}
            log={sortedLog}
            key={`current-${log.id}-accordion-${sortedLog.id}`}
            expandedLogs={expandedLogs}
            handleExpand={handleExpand}
          />
        ))}
      </Stack>
    );
  }

  // no replies view
  return (
    <Stack
      sx={{
        height: "100%",
        overflow: "auto",
        padding: "10px 15px 0 15px"
      }}
    >
      <Box sx={{ border: "2px solid transparent", borderRadius: "4px" }}>
        <Box
          borderRadius="4px"
          bgcolor="#f2f5f7"
        >
          <LogHeader
            log={log}
            expanded
          />
        </Box>
        <LogDetails log={log} />
      </Box>
    </Stack>
  );
};

export default LogDetailsWithReplies;
