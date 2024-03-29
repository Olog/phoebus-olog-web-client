import { Box, Typography, styled } from "@mui/material";
import React from "react";

const Key = styled(Typography)({
    fontWeight: "bold",
    gridColumn: "span / span"
});
const Value = styled(Typography)({
    gridColumn: "span / span"
});

const MetadataTable = ({data}) => {

    return (
        <Box sx={{
            display: "grid",
            gridTemplateColumns: "max-content max-content max-content max-content",
            columnGap: 2
        }}>
            {Object.entries(data).map(entry => 
                <React.Fragment key={entry[0]}>
                    <Key>{entry[0]}</Key>
                    <Value>{entry[1]}</Value>
                </React.Fragment>
            )}
        </Box>
    )
}

export default MetadataTable;