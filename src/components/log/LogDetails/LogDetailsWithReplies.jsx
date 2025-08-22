import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Alert,
  Box,
  CircularProgress,
  Stack,
  styled
} from "@mui/material";
import LogDetails from "./LogDetails";
import LogHeader from "./LogHeader";
import { ologApi } from "api/ologApi";
import { getLogEntryGroupId } from "components/Properties";
import { sortByCreatedDate } from "components/log/sort";
import { useSearchPageParams } from "features/searchPageParamsReducer";

const LogDetailsAccordion = styled(({ log, className, refProp }) => {
  const { id: paramLogId } = useParams();
  const isSelected = log.id === Number(paramLogId);
  const [expanded, setExpanded] = useState(true);

  const onChange = () => {
    setExpanded((prev) => !prev);
  };

  return (
    <Accordion
      ref={refProp}
      defaultExpanded
      expanded={expanded}
      onChange={onChange}
      variant="outlined"
      className={className}
      square
      sx={{
        "& > .MuiButtonBase-root": { padding: 0 },
        border: isSelected ? "2px solid #0099dc24" : "2px solid #F3F5F7"
      }}
    >
      <AccordionSummary
        aria-controls={`${log.id}-content`}
        id={`${log.id}-header`}
        sx={{
          bgcolor: isSelected ? "#0099dc24" : "#f2f5f7",
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
        <LogHeader log={log} />
      </AccordionSummary>
      <AccordionDetails sx={{ padding: 0 }}>
        <LogDetails log={log} />
      </AccordionDetails>
    </Accordion>
  );
})({
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

  useEffect(() => {
    if (parentRef && logRef) {
      setTimeout(() => {
        const y =
          logRef.getBoundingClientRect().top +
          parentRef.scrollTop -
          parentRef.getBoundingClientRect().top -
          10;
        parentRef.scrollTo({
          top: y,
          behavior: "smooth"
        });
      }, 0.1);
    }
  }, [parentRef, logRef]);

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
    const sortedLogs = [
      log,
      ...replies.filter((it) => it.id !== log.id)
    ].toSorted(sortByCreatedDate(dateDescending));

    return (
      <Stack
        ref={handleParentRef}
        sx={{
          overflow: "auto",
          padding: "10px 15px"
        }}
      >
        {sortedLogs.map((sortedLog) => (
          <LogDetailsAccordion
            refProp={(node) => handleLogRef(node, sortedLog?.id)}
            log={sortedLog}
            key={`current-${log.id}-accordion-${sortedLog.id}`}
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
          <LogHeader log={log} />
        </Box>
        <LogDetails log={log} />
      </Box>
    </Stack>
  );
};

export default LogDetailsWithReplies;
