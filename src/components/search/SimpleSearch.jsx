import { IconButton, InputAdornment, Stack } from "@mui/material";
// import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useSearchParams } from "react-router-dom";
import ClearIcon from "@mui/icons-material/Clear";
import SearchIcon from "@mui/icons-material/Search";
import { TextInput } from "components/shared/input/TextInput";
import {} from // removeEmptyKeys,
// useEnhancedSearchParams,
// withoutParams
"src/hooks/useEnhancedSearchParams";

const SimpleSearch = () => {
  // const { searchParams } = useEnhancedSearchParams();
  const [, setSearchParams] = useSearchParams();
  // const { toSearchParams, toQueryString /*setSearchParams*/ } =
  // useEnhancedSearchParams();
  const { control, handleSubmit, setValue, getValues, watch } = useForm({});

  const queryValue = watch("query");

  // useEffect(() => {
  //   setValue(
  //     "query",
  //     toQueryString(removeEmptyKeys(withoutParams(searchParams)))
  //   );
  // }, [searchParams, toQueryString, setValue]);

  const onSubmit = () => {
    const { query } = getValues();

    if (!query) {
      setSearchParams({});
    } else {
      setSearchParams("?query=" + query);
    }
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
