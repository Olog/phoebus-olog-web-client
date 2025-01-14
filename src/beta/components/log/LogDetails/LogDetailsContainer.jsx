import { Stack, Typography } from "@mui/material";
import LogContainer from "components/log/LogContainer";
import React from "react";
import LogDetailsWithReplies from "./LogDetailsWithReplies";

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
      <Typography fontWeight="500">Select a log to view its details</Typography>
    </Stack>
  );
};

export default LogDetailsContainer;
