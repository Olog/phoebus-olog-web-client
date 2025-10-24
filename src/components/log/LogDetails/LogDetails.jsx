import { Box, Stack } from "@mui/material";
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
      {log.source && (
        <CommonMark
          sx={{ my: 0.5 }}
          commonmarkSrc={log.source}
        />
      )}
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
