import React from "react";
import { Stack, styled } from "@mui/material";
import MetadataTable from "./MetadataTable";
import LogDetailActionButton from "./LogDetailActionButton";
import { CreatedDate } from "./CreatedDate";

const StyledMetadataTable = styled(MetadataTable)({
  gridTemplateColumns: "max-content max-content"
})

const LogHeader = styled(({log, className}) => {

    return (
      <Stack 
        flexDirection="row" 
        justifyContent="space-between" 
        alignItems="center" 
        className={className}
      >
        <StyledMetadataTable data={{
            "Author": log.owner,
            "Created": <CreatedDate log={log} />  
        }} />                
        <LogDetailActionButton log={log} />
      </Stack>
    );
})({})

export default LogHeader;