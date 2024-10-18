import { Stack, Typography } from "@mui/material";
import React from "react";
import { EntryTypeChip } from "../EntryTypeChip";
import { LogbookChip } from "../LogbookChip";
import { TagChip } from "../TagChip";

const Key = ({ name, children }) => (
  <Stack flexDirection="row" gap={0.5} alignItems="center" flexWrap="wrap">
    <Typography fontSize="0.9rem" fontWeight="bold" mr={0.5}>{name}</Typography>
    {children}
  </Stack>
);

const MetadataTable = ({ log }) => (
  <Stack gap={2}>
    <Key name="Tags">
      {log?.tags?.map(it => <TagChip key={it.name} value={it.name} />)}
    </Key>

    <Key name="Log books">
      {log?.logbooks?.map(it => <LogbookChip key={it.name} value={it.name} />)}
    </Key>

    {log?.level && (
      <Key name="Entry type" value>
        <EntryTypeChip value={log?.level} />
      </Key>
    )}
  </Stack>
)

export default MetadataTable;