import { InputAdornment, Stack } from "@mui/material";
import TextInput from "components/shared/input/TextInput";
import { ButtonDatePicker, DATE_FORMAT } from "components/shared/input/WizardDateInput";
import { useAdvancedSearch } from "features/advancedSearchReducer";
import { defaultSearchParams, updateSearchParams, useSearchParams } from "features/searchParamsReducer";
import React from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";

const SimpleSearch = () => {

  const dispatch = useDispatch();
  const searchParams = useSearchParams();
  const { active: advancedSearchActive } = useAdvancedSearch();

  const { control, handleSubmit, setValue, getValues } = useForm({
    defaultValues: { query: defaultSearchParams.query, start: defaultSearchParams.start },
    values: { query: searchParams?.query, start: searchParams?.start }
  });

  const onAccept = (momentDate) => {
    setValue("start", momentDate.format(DATE_FORMAT));
    onSubmit(getValues());
  }

  const onSubmit = (data) => {
    const params = {
      ...searchParams,
      ...data
    }
    dispatch(updateSearchParams(params));
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
          disabled: advancedSearchActive,
          endAdornment:
            <InputAdornment position="end">
              <ButtonDatePicker 
                onAccept={onAccept} 
                ButtonFieldProps={{
                  inputProps: {
                    "aria-label": `Select start date/time}`
                  }
                }}
                disabled={advancedSearchActive}
              />
            </InputAdornment>
        }}
      />
    </Stack>
  )
};

export default SimpleSearch;