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
    mt={1.5}
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

    {log?.tags.length > 0 && (
      <Key name="Tags">
        {log?.tags?.map((it) => (
          <TagChip
            key={it.name}
            sx={{ fontSize: ".7rem" }}
            value={it.name}
          />
        ))}
      </Key>
    )}

    {log?.level && (
      <Key name="Entry type">
        <EntryTypeChip
          sx={{ fontSize: ".7rem" }}
          key={log?.level}
          value={log?.level}
        />
      </Key>
    )}
  </Stack>
);

export default MetadataTable;
