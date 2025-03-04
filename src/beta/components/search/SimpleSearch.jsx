import { InputAdornment, Stack } from "@mui/material";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import SearchIcon from "@mui/icons-material/Search";
import { removeEmptyKeys } from "api/ologApi";
import { TextInput } from "components/shared/input/TextInput";
import {
  defaultSearchParams,
  useSearchParams
} from "features/searchParamsReducer";
import useSanitizedSearchParams, {
  withoutBetaParams,
  withoutCacheBust
} from "hooks/useSanitizedSearchParams";
import { updateAdvancedSearch } from "src/features/advancedSearchThunk";

const SimpleSearch = () => {
  const dispatch = useDispatch();
  const searchParams = useSearchParams();
  const { toSearchParams, toQueryString } = useSanitizedSearchParams();

  const { control, handleSubmit, setValue, getValues } = useForm({
    defaultValues: {
      query: defaultSearchParams.query
    },
    values: { query: searchParams?.query }
  });

  useEffect(() => {
    if (searchParams) {
      setValue(
        "query",
        toQueryString(
          removeEmptyKeys(withoutCacheBust(withoutBetaParams(searchParams)))
        )
      );
    }
  }, [setValue, searchParams, toQueryString]);

  const onSubmit = () => {
    const { query } = getValues();
    const sanitizedSearchParams = toSearchParams(query);

    const params = {
      ...sanitizedSearchParams
    };
    dispatch(updateAdvancedSearch(params));
  };

  return (
    <Stack
      component="form"
      gap={1}
      width="100%"
      onSubmit={handleSubmit(onSubmit)}
      sx={{
        flex: 3,
        padding: "0 16px 0 30px",
        "& .MuiFormLabel-root[data-shrink='false']": {
          transform: "translate(14px, 14px)"
        }
      }}
    >
      <TextInput
        control={control}
        placeholder="Search"
        name="query"
        defaultValue=""
        fullWidth
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon
                sx={{
                  height: "20px",
                  width: "20px"
                }}
              />
            </InputAdornment>
          ),
          sx: {
            fontSize: ".9rem",
            backgroundColor: "#fafafa",
            "& .MuiInputBase-input": {
              padding: "14px 0"
            },
            "& .MuiOutlinedInput-notchedOutline": {
              border: "1.5px solid #E2E8EE"
            },
            "&:hover .MuiOutlinedInput-notchedOutline": {
              border: "1.5px solid #E2E8EE"
            },
            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
              border: "1.5px solid #E2E8EE" // Custom border color when focused
            }
          }
        }}
      />
    </Stack>
  );
};

export default SimpleSearch;
