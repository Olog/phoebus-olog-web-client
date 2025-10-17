import { Box, Stack, Typography } from "@mui/material";
import { LogAttachmentsHeader } from "./LogAttachmentsHeader";
import LogProperty from "./LogProperty";
import MetadataTable from "./MetadataTable";
import { CommonMark } from "components/shared/CommonMark";

const LogDetails = ({ log, className }) => {
  const filteredProperties = log?.properties?.filter(
    (it) =>
      it.name.toLowerCase() !== "log entry group" &&
      it.state.toLowerCase() === "active"
  );
  return (
    <Stack
      className={`LogDetails ${className}`}
      gap={0}
      pt={1}
      pb={1.5}
      px={3}
    >
      <LogAttachmentsHeader log={log} />
      <Typography
        sx={{ fontSize: "1.2rem" }}
        component="h2"
        fontWeight="600"
      >
        {log.title}
      </Typography>
      {log.source && <CommonMark commonmarkSrc={log.source} />}
      <MetadataTable log={log} />
      {log?.properties && filteredProperties.length > 0 && (
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            columnGap: 1,
            rowGap: 1
          }}
          mt={2}
        >
          {filteredProperties.map((it, i) => (
            <LogProperty
              property={it}
              key={`${it.name}-${i}`}
            />
          ))}
        </Box>
      )}
    </Stack>
  );
};

export default LogDetails;
