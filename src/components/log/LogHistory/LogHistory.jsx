import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Link,
  Stack,
  Typography
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import LogEntrySingleView from "components/LogDetails/LogEntrySingleView";
import { FormattedDate } from "components/shared/FormattedDate";

const DownloadButton = ({ currentLog, logHistory }) => {
  const data = {
    current: currentLog,
    history: logHistory
  };

  const blob = new Blob([JSON.stringify(data, undefined, 2)], {
    type: "text/json"
  });

  return (
    <Button
      component={Link}
      variant="contained"
      sx={{ width: "fit-content", height: "fit-content" }}
      endIcon={<FileDownloadIcon />}
      download={`history-id-${currentLog.id}.json`}
      href={window.URL.createObjectURL(blob)}
    >
      Download History
    </Button>
  );
};

const LogHistory = ({ currentLog, logHistory }) => {
  const renderTitle = (log, title) => {
    return (
      <Typography
        component="h3"
        variant="h6"
      >
        {title ?? (
          <>
            {`${log.modifyDate ? "Edited" : "Created"} `}
            <FormattedDate date={log.modifyDate ?? log.createdDate} />
          </>
        )}
      </Typography>
    );
  };

  const renderLog = (log, title) => {
    const id = log.modifyDate ?? log.createdBy;

    return (
      <Accordion defaultExpanded>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls={`${id}-content`}
          id={`${id}-header`}
        >
          {renderTitle(log, title)}
        </AccordionSummary>
        <AccordionDetails>
          <LogEntrySingleView currentLogEntry={log} />
        </AccordionDetails>
      </Accordion>
    );
  };

  return (
    <Stack padding={1}>
      <Stack
        flexDirection="row"
        justifyContent="space-between"
        alignItems="center"
      >
        <Typography
          component="h1"
          variant="h2"
        >
          Log History
        </Typography>
        <DownloadButton {...{ currentLog, logHistory }} />
      </Stack>
      <Stack>
        <Typography
          component="h2"
          variant="h4"
        >
          Current Entry
        </Typography>
        <Box padding={1}>
          <LogEntrySingleView currentLogEntry={currentLog} />
        </Box>
        <Typography
          component="h2"
          variant="h4"
        >
          Previous Edits
        </Typography>
        <Stack>
          {logHistory?.hitCount === 0 ? (
            <Typography fontStyle="italic">(No edit history)</Typography>
          ) : (
            logHistory?.logs?.map((log) => renderLog(log))
          )}
        </Stack>
      </Stack>
    </Stack>
  );
};
export default LogHistory;
