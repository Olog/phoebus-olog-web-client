import { IconButton, InputAdornment, Stack } from "@mui/material";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import ClearIcon from "@mui/icons-material/Clear";
import SearchIcon from "@mui/icons-material/Search";
import { removeEmptyKeys } from "api/ologApi";
import { TextInput } from "components/shared/input/TextInput";
import {
  defaultSearchParams,
  useSearchParams
} from "features/searchParamsReducer";
import useSanitizedSearchParams, {
  withoutParams,
  withoutCacheBust
} from "hooks/useSanitizedSearchParams";
import { updateAdvancedSearch } from "src/features/advancedSearchThunk";

const SimpleSearch = () => {
  const dispatch = useDispatch();
  const searchParams = useSearchParams();
  const { toSearchParams, toQueryString } = useSanitizedSearchParams();

  const { control, handleSubmit, setValue, getValues, watch } = useForm({
    defaultValues: {
      query: defaultSearchParams.query
    },
    values: { query: searchParams?.query }
  });

  const queryValue = watch("query");

  useEffect(() => {
    if (searchParams) {
      setValue(
        "query",
        toQueryString(
          removeEmptyKeys(withoutCacheBust(withoutParams(searchParams)))
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
        padding: "0 14px 0 30px",
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
          endAdornment: (
            <>
              {queryValue && (
                <IconButton
                  onClick={() => {
                    setValue("query", "");
                    onSubmit();
                  }}
                  sx={{
                    "&:hover": { backgroundColor: "transparent" },
                    padding: "4px",
                    marginRight: "-4px"
                  }}
                  fontSize="small"
                >
                  <ClearIcon sx={{ fontSize: "18px" }} />
                </IconButton>
              )}
            </>
          ),
          sx: {
            fontSize: ".9rem",
            backgroundColor: "#f5f5f5",
            "& .MuiInputBase-input": {
              padding: "10px 0",
              paddingRight: 0
            }
          }
        }}
      />
    </Stack>
  );
};

export default SimpleSearch;
