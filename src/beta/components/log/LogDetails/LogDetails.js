import { Divider, Stack, Typography, styled } from "@mui/material";
import React from "react";
import CommonmarkPreview from "components/shared/CommonmarkPreview";
import customization from "config/customization";
import LogProperty from "./LogProperty";
import { LogAttachmentsHeader } from "./LogAttachmentsHeader";
import MetadataTable from "./MetadataTable";
import { LogbookChip } from "../LogbookChip";
import { TagChip } from "../TagChip";
import { EntryTypeChip } from "../EntryTypeChip";

const ChipList = ({children}) => {
  return (
    <Stack flexDirection="row" gap={0.5} flexWrap="wrap">
      {children}
    </Stack>
  )
}

const LogDetails = styled(({log, className}) => {

    return (
        <Stack 
            className={`LogDetails ${className}`} 
            gap={1} 
            padding={1} 
            sx={{ 
                overflow: "scroll"
            }} 
        >
          <LogAttachmentsHeader log={log} />
          <Typography variant="h2">{log.title}</Typography>
          <Divider />
          <CommonmarkPreview commonmarkSrc={log.source} imageUrlPrefix={customization.APP_BASE_URL + "/"} />
          { log?.properties
              ?.filter(it => it.name.toLowerCase() !== "log entry group" && it.state.toLowerCase() === "active")
              ?.map(it => <LogProperty property={it} key={it.name} />)
          }
          <Divider />
          <MetadataTable
            data={{
              Logbooks: <ChipList>{log?.logbooks?.map(it => <LogbookChip key={it.name} name={it.name} />)}</ChipList>,
              Tags: <ChipList>{log?.tags?.map(it => <TagChip key={it.name} name={it.name} />)}</ChipList>,
              "Entry Type": <EntryTypeChip name={log?.level} />
            }}
          />
        </Stack>
    )

})({})

export default LogDetails;