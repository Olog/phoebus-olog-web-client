import { IconButton, InputAdornment, Stack, Tooltip } from "@mui/material";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import ClearIcon from "@mui/icons-material/Clear";
import SearchIcon from "@mui/icons-material/Search";
import { TextInput } from "components/shared/input/TextInput";
import { useEnhancedSearchParams } from "src/hooks/useEnhancedSearchParams";

const SimpleSearch = () => {
  const { searchParams, setSearchParams } = useEnhancedSearchParams();
  const { control, handleSubmit, setValue, getValues, watch } = useForm({});

  const queryValue = watch("query");

  const hasAdvancedTextFilters = !!(
    searchParams.title?.trim() || searchParams.desc?.trim()
  );

  useEffect(() => {
    if (hasAdvancedTextFilters) {
      setValue("query", "");
    } else {
      setValue("query", searchParams.query || "");
    }
  }, [hasAdvancedTextFilters, searchParams.query, setValue]);

  const onSubmit = () => {
    const { query } = getValues();
    const rest = Object.fromEntries(
      Object.entries(searchParams).filter(
        ([key]) => !["title", "desc", "query"].includes(key)
      )
    );

    if (!query) {
      setSearchParams(rest);
    } else {
      setSearchParams({ ...rest, query });
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
      <Tooltip
        title={
          hasAdvancedTextFilters
            ? "Can't use while title/description are active"
            : ""
        }
      >
        <div>
          <TextInput
            sx={
              hasAdvancedTextFilters
                ? { "& *": { cursor: "not-allowed !important" } }
                : undefined
            }
            control={control}
            placeholder="Search"
            name="query"
            defaultValue=""
            fullWidth
            disabled={hasAdvancedTextFilters}
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
                  paddingRight: 0,
                  WebkitTextFillColor: hasAdvancedTextFilters
                    ? "rgba(0, 0, 0, 0.38)"
                    : undefined
                }
              }
            }}
          />
        </div>
      </Tooltip>
    </Stack>
  );
};

export default SimpleSearch;
