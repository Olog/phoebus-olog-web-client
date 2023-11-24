import { Stack, styled } from "@mui/material";
import LogDetailsContainer from "beta/components/log/LogDetails/LogDetailsContainer";
import { SearchResultList } from "beta/components/search";
import React from "react";
import { useParams } from "react-router-dom";

const SearchView = styled(({className}) => {

    const { id } = useParams();

    return (
        <Stack flexDirection="row" height="100%" className={`SearchView ${className}`}>
            <SearchResultList />
            <LogDetailsContainer id={id} />
        </Stack>
    )

})({
    "& .SearchResultList": {
        flex: 1
    },
    "& .LogDetailsContainer": {
        flex: 2
    }
})

export default SearchView;