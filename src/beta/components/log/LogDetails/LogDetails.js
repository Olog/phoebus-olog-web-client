import React from "react";
import { Box, Divider, Stack, Typography } from "@mui/material";
import { LogAttachmentsHeader } from "./LogAttachmentsHeader";
import CommonMark from "components/shared/CommonMark";
import customization from "config/customization";
import LogProperty from "./LogProperty";
import MetadataTable from "./MetadataTable";

const LogDetails = ({ log, className }) => {
  const filteredProperties = log?.properties?.filter(
    (it) =>
      it.name.toLowerCase() !== "log entry group" &&
      it.state.toLowerCase() === "active"
  );
  return (
    <Stack
      className={`LogDetails ${className}`}
      gap={1}
      py={2}
      px={3}
      sx={{
        overflow: "scroll",
      }}
    >
      <LogAttachmentsHeader log={log} />
      <Typography sx={{ fontSize: "1.4rem" }} component="h2" fontWeight="600">
        {log.title}
      </Typography>
      {log.source && (
        <CommonMark
          commonmarkSrc={log.source}
          imageUrlPrefix={customization.APP_BASE_URL + "/"}
        />
      )}
      {log?.properties && filteredProperties.length > 0 && (
        <Box mt={2}>
          {filteredProperties.map((it, i) => (
            <LogProperty property={it} key={`${it.name}-${i}`} />
          ))}
        </Box>
      )}
      <Divider
        sx={{
          margin: "15px 0",
          borderWidth: "1.25px",
          borderColor: "#F3F5F7",
        }}
      />
      <MetadataTable log={log} />
    </Stack>
  );
};

export default LogDetails;
