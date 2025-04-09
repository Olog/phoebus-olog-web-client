import { Stack, Typography } from "@mui/material";
import { EntryTypeChip } from "../EntryTypeChip";
import { LogbookChip } from "../LogbookChip";
import { TagChip } from "../TagChip";

const Key = ({ name, children }) => (
  <Stack
    flexDirection="row"
    gap={0.5}
    alignItems="center"
  >
    <Typography
      fontSize="0.75rem"
      fontWeight="bold"
      mr={0.5}
    >
      {name}
    </Typography>
    {children}
  </Stack>
);

const MetadataTable = ({ log }) => (
  <Stack
    direction="row"
    flexWrap="wrap"
    gap={2}
  >
    <Key name="Logbooks">
      {log?.logbooks?.map((it) => (
        <LogbookChip
          sx={{ fontSize: ".7rem" }}
          key={it.name}
          value={it.name}
        />
      ))}
    </Key>

    <Key name="Tags">
      {log?.tags?.map((it) => (
        <TagChip
          sx={{ fontSize: ".7rem" }}
          key={it.name}
          value={it.name}
        />
      ))}
    </Key>

    {log?.level && (
      <Key
        name="Entry type"
        value
      >
        <EntryTypeChip
          sx={{ fontSize: ".7rem" }}
          value={log?.level}
        />
      </Key>
    )}
  </Stack>
);

export default MetadataTable;
