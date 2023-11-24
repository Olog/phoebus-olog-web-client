import { Stack, Typography, styled } from "@mui/material";
import React from "react";

const SearchResultList = styled(({className}) => {
    return (
        <Stack className={`SearchResultList ${className}`} >
            <Typography>SearchResultList</Typography>
        </Stack>
    )
})({})

export default SearchResultList;