import { useState } from "react";
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

const LogDetailsAccordion = styled(
  ({ log, defaultExpanded = false, className }) => {
    const [expanded, setExpanded] = useState(defaultExpanded);

    const onChange = () => {
      setExpanded((prev) => !prev);
    };

    return (
      <Accordion
        defaultExpanded={false}
        expanded={expanded}
        onChange={onChange}
        variant="outlined"
        className={className}
        square
        sx={{ "& > .MuiButtonBase-root": { padding: 0 } }}
      >
        <AccordionSummary
          aria-controls={`${log.id}-content`}
          id={`${log.id}-header`}
          sx={{
            bgcolor: "#f2f5f7",
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
  }
)({
  border: "2px solid #F3F5F7",
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
  // fetch any groups/conversations
  const groupId = getLogEntryGroupId(log.properties);
  const {
    data: replies = [],
    isLoading: repliesLoading,
    error: repliesError
  } = ologApi.endpoints.getLogGroup.useQuery({ groupId });

  const { dateDescending } = useSearchPageParams();

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
    const parentLog = sortedLogs.pop();
    sortedLogs.unshift(parentLog);
    return (
      <Stack
        sx={{
          overflow: "auto",
          padding: "10px 15px"
        }}
      >
        {sortedLogs.map((sortedLog) => (
          <LogDetailsAccordion
            log={sortedLog}
            defaultExpanded={sortedLog.id === log.id}
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
      <Box
        borderRadius="4px"
        bgcolor="#f2f5f7"
      >
        <LogHeader log={log} />
      </Box>
      <LogDetails log={log} />
    </Stack>
  );
};

export default LogDetailsWithReplies;
