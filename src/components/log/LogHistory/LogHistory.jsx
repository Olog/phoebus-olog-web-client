import {
  Box,
  Button,
  Divider,
  Link,
  Paper,
  Stack,
  Tooltip,
  Typography
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import { FormattedDate } from "components/shared/FormattedDate";
import LogDetails from "src/components/log/LogDetails/LogDetails";
import { KeyValueTable } from "src/components/log/LogDetails/KeyValueTable";

const LogHistoryHeader = ({ log }) => (
  <Box
    px={3}
    pt={2}
    sx={{ "& p, time": { fontSize: "1rem" } }}
  >
    <KeyValueTable
      data={[
        {
          name: "Author",
          value: log.owner
        },
        {
          name: log.modifyDate ? "Edited" : "Created",
          value: (
            <FormattedDate
              date={log?.modifyDate || log?.createdDate}
              component="span"
              sx={{ fontSize: ".875rem", fontWeight: "bold" }}
            />
          )
        }
      ]}
    />
    <Divider
      sx={{
        marginTop: "15px",
        borderWidth: "1.25px",
        borderColor: "#F3F5F7"
      }}
    />
  </Box>
);

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
      py={2}
      px={4}
      maxWidth={"900px"}
      mx={"auto"}
    >
      <Stack
        flexDirection="row"
        justifyContent="space-between"
        alignItems="center"
        mb={1}
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

          <Typography
            component="h2"
            variant="h3"
            fontSize="1.75rem"
            py={1}
          >
            Log History ({currentLog.id})
          </Typography>
        </Stack>
        <DownloadButton {...{ currentLog, logHistory }} />
      </Stack>
      <Stack mb={4}>
        <Paper
          elevation={3}
          sx={{ margin: "10px 0" }}
        >
          <LogHistoryHeader log={currentLog} />
          <LogDetails log={currentLog} />
        </Paper>

        {logHistory?.hitCount === 0 ? (
          <Typography fontStyle="italic">(No edit history)</Typography>
        ) : (
          logHistory?.logs?.map((log) => {
            const id = log.modifyDate ?? log.createdBy;

            return (
              <Paper
                key={id}
                elevation={3}
                sx={{
                  margin: "10px 0",
                  "&:last-child": { marginBottom: "25px" }
                }}
              >
                <LogHistoryHeader log={log} />
                <LogDetails log={log} />
              </Paper>
            );
          })
        )}
      </Stack>
    </Stack>
  );
};
export default LogHistory;
