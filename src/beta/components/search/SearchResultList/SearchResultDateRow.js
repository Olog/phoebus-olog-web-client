import React from "react";
import { Typography } from "@mui/material";
import { moment } from "lib/moment";

const SearchResultDateRow = ({createdDate}) => {
    return (
        <Typography color="secondary" fontWeight="bold" borderBottom="1px solid rgba(0, 0, 0, 0.12)" width="100%">
            {moment(createdDate).format("YYYY-MM-DD")}
        </Typography> 
    )
}
export default SearchResultDateRow;