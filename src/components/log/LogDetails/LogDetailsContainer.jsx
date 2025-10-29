import { Stack, Typography } from "@mui/material";
import LogDetailsWithReplies from "./LogDetailsWithReplies";
import LogContainer from "components/log/LogContainer";

const LogDetailsContainer = ({ id }) => {
  if (id) {
    return (
      <LogContainer
        id={id}
        renderLog={({ log }) => <LogDetailsWithReplies log={log} />}
      />
    );
  }

  return (
    <Stack p={4}>
      <Typography>Select a log to view its details</Typography>
    </Stack>
  );
};

export default LogDetailsContainer;
