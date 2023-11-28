import { Stack, Typography, styled } from "@mui/material";
import React from "react";

const SearchResultList = styled(({className}) => {
    return (
        <Stack className={`SearchResultList ${className}`} width={300} >
            <Typography>SearchResultList (Stub)</Typography>
        </Stack>
    )
})({})

export default SearchResultList;