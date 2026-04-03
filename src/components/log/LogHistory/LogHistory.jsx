import { Button, Link, Stack, Tooltip, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import LogHistoryEntryCard from "./LogHistoryEntryCard";

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
  const navigate = useNavigate();
  return (
    <Stack
      px={4}
      pb={2}
      width="100%"
      maxWidth={"900px"}
      mx={"auto"}
    >
      <Stack
        flexDirection="row"
        justifyContent="space-between"
        alignItems="center"
        sx={(theme) => ({
          position: "sticky",
          top: 0,
          zIndex: 1,
          py: 2,
          mb: 1,
          backgroundColor: theme.palette.background.paper
        })}
      >
        <Stack
          direction="row"
          alignItems="center"
          gap={3}
        >
          <Tooltip title="Go back">
            <Button
              sx={{
                borderRadius: "100%",
                minWidth: "fit-content",
                color: (theme) => theme.palette.text.primary
              }}
              onClick={() => navigate(-1)}
            >
              <ArrowBackIcon />
            </Button>
          </Tooltip>

          <Stack
            direction="row"
            alignItems="center"
            gap={1.5}
            py={1}
          >
            <Typography
              component="h2"
              variant="h3"
              fontSize="1.75rem"
            >
              Log History
            </Typography>
            <Tooltip title="Log ID">
              <Typography
                component="span"
                sx={{
                  backgroundColor: "#dfdfdf",
                  padding: "6px 10px",
                  borderRadius: "4px",
                  fontSize: "1rem",
                  fontWeight: 500,
                  lineHeight: 1.2
                }}
              >
                {currentLog.id}
              </Typography>
            </Tooltip>
          </Stack>
        </Stack>
        <DownloadButton {...{ currentLog, logHistory }} />
      </Stack>
      <Stack
        mb={4}
        sx={{ "& > *:last-child": { marginBottom: "15px" } }}
      >
        <LogHistoryEntryCard log={currentLog} />

        {logHistory?.hitCount === 0 ? (
          <Typography fontStyle="italic">(No edit history)</Typography>
        ) : (
          logHistory?.logs?.map((log, index) => (
            <LogHistoryEntryCard
              key={`${log.id}-${log.modifyDate ?? log.createdDate ?? ""}-${index}`}
              log={log}
            />
          ))
        )}
      </Stack>
    </Stack>
  );
};
export default LogHistory;
