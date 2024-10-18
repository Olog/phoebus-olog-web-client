import React from "react";
import { Box, Divider, Stack, Typography } from "@mui/material";
import { LogAttachmentsHeader } from "./LogAttachmentsHeader";
import CommonmarkPreview from "components/shared/CommonmarkPreview";
import customization from "config/customization";
import LogProperty from "./LogProperty";
import MetadataTable from "./MetadataTable";

const LogDetails = ({ log, className }) => {
  const filteredProperties = log?.properties?.filter(it => it.name.toLowerCase() !== "log entry group" && it.state.toLowerCase() === "active");
  return (
    <Stack
      className={`LogDetails ${className}`}
      gap={1}
      padding={2}
      pb={4}
      sx={{
        overflow: "scroll"
      }}
    >
      <LogAttachmentsHeader log={log} />
      <Typography component="h2" variant="h4" fontWeight="600" mb={2}>{log.title}</Typography>
      {log.source && (
        <>
          <Divider />
          <CommonmarkPreview commonmarkSrc={log.source} imageUrlPrefix={customization.APP_BASE_URL + "/"} />
        </>
      )}
      {log?.properties && filteredProperties.length > 0 && (
        <Box sx={{
          "& > div:last-child, & > div.Mui-expanded:last-child": {
            marginBottom: "20px"
          },
        }}>
          {filteredProperties.map((it, i) =>
            <LogProperty property={it} key={`${it.name}-${i}`} />
          )}
        </Box>
      )}
      <Divider sx={{ marginBottom: "20px" }} />
      <MetadataTable log={log} />
    </Stack >
  );
}

export default LogDetails;