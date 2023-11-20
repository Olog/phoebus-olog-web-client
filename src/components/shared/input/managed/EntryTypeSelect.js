import React from "react";
import MultiSelect from "../MultiSelect";
import { styled } from "@mui/material";
import customization from "config/customization";

const EntryTypeSelect = styled(({control, className, ...props}) => {

    return (
        <MultiSelect 
            className={className}
            name='level'
            label='Entry Type'
            control={control}
            defaultValue={customization.defaultLevel}
            options={customization.levelValues}
            {...props}
        />
    )
})({});

export default EntryTypeSelect;