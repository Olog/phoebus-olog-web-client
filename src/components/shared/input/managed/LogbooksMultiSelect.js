import React from "react";
import MultiSelect from "../MultiSelect";
import { styled } from "@mui/material";
import { useGetLogbooksQuery } from "services/ologApi";

const LogbooksMultiSelect = styled(({control, className, ...props}) => {

    const {data: logbooks = [], isLoading} = useGetLogbooksQuery();

    return (
        <MultiSelect
            className={className}
            name='logbooks'
            label='Logbooks'
            control={control}
            options={logbooks}
            getOptionLabel={logbook => logbook.name}
            isOptionEqualToValue={ (option, value) => option.name === value.name }
            isMulti
            loading={isLoading}
            {...props}
        />
    )
})({});

export default LogbooksMultiSelect;