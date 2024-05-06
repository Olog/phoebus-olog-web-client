import { Chip, InputAdornment, Stack } from "@mui/material";
import TextInput from "components/shared/input/TextInput";
import { ButtonDatePicker, DATE_FORMAT } from "components/shared/input/WizardDateInput";
import { forceUpdateSearchParams, useSearchParams } from "features/searchParamsReducer";
import React from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";

const SimpleSearch = () => {

    const searchParams = useSearchParams();
    const dispatch = useDispatch();

    const { control, handleSubmit, setValue, watch, getValues } = useForm({
        defaultValues: { query: searchParams?.query, start: searchParams?.start },
        values: { query: searchParams?.query, start: searchParams?.start }
    });

    const dateValue = watch("start");

    const onAccept = (momentDate) => {
        console.log({onAccept: momentDate})
        setValue("start", momentDate.format(DATE_FORMAT));
        onSubmit(getValues());
    }
    const onReject = () => {
        setValue("start", null);
        onSubmit(getValues());
    }

    const onSubmit = (data) => {
        console.log({onSubmit: data, searchParams})
        const params = {
            ...searchParams,
            ...data
        }
        dispatch(forceUpdateSearchParams(params));
    }

    return (
        <Stack 
            component="form" 
            gap={1}
            width="100%" 
            onSubmit={handleSubmit(onSubmit)}
        >
            <TextInput 
                control={control}
                name="query"
                label="Search"
                defaultValue=""
                fullWidth
                InputProps={{
                    endAdornment:
                        <InputAdornment position="end">
                            <ButtonDatePicker 
                                onAccept={onAccept} 
                                ButtonFieldProps={{
                                    inputProps: {
                                        "aria-label": `Select start date/time}`
                                    }
                                }}
                            />
                        </InputAdornment>
                }}
            />
            <Stack flexDirection="row" justifyContent="flex-end">
                {
                    dateValue ? <Chip label={dateValue} size="small" onDelete={onReject} /> : null 
                }
            </Stack>
        </Stack>
    )
};

export default SimpleSearch;