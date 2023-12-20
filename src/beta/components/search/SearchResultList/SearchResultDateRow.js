import React from "react";
import FormattedDate from "components/shared/FormattedDate";

const SearchResultDateRow = ({createdDate}) => {
    return (
        <FormattedDate 
            formatVariant="shortDate"
            date={createdDate}
            color="secondary" 
            fontWeight="bold" 
            borderBottom="1px solid rgba(0, 0, 0, 0.12)" 
            width="100%"
        />
    )
}
export default SearchResultDateRow;