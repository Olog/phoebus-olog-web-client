import { IconButton, InputAdornment, Stack } from "@mui/material";
import { useCallback, useEffect } from "react";
import { useForm } from "react-hook-form";
import ClearIcon from "@mui/icons-material/Clear";
import SearchIcon from "@mui/icons-material/Search";
import { DisabledTooltip } from "components/shared/DisabledTooltip";
import { TextInput } from "components/shared/input/TextInput";
import { useEnhancedSearchParams } from "src/hooks/useEnhancedSearchParams";

const SEARCH_DEBOUNCE_MS = 300;

const SimpleSearch = () => {
  const { searchParams, setSearchParams } = useEnhancedSearchParams();

  const hasAdvancedTextFilters = !!(
    searchParams.title?.trim() || searchParams.desc?.trim()
  );
  const urlQuery = hasAdvancedTextFilters ? "" : (searchParams.query ?? "");

  const { control, handleSubmit, setValue, getValues, watch } = useForm({
    defaultValues: { query: urlQuery }
  });

  const queryValue = watch("query");

  const onSubmit = useCallback(() => {
    setSearchParams(
      {
        ...searchParams,
        title: "",
        desc: "",
        query: getValues("query").trim()
      },
      { replace: true }
    );
  }, [getValues, searchParams, setSearchParams]);

  // Sync the input when the URL changes from elsewhere, e.g. back or reset.
  // Compared trimmed to keep a trailing space the user is still typing past.
  useEffect(() => {
    if (getValues("query").trim() !== urlQuery.trim()) {
      setValue("query", urlQuery);
    }
  }, [getValues, setValue, urlQuery]);

  // Must follow the sync above: getValues then sees the synced value, so a URL
  // change isn't mistaken for typing and written back.
  useEffect(() => {
    const query = getValues("query").trim();
    if (hasAdvancedTextFilters || query === urlQuery.trim()) {
      return;
    }
    if (!query) {
      onSubmit();
      return;
    }
    const timeout = setTimeout(onSubmit, SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(timeout);
  }, [getValues, hasAdvancedTextFilters, onSubmit, queryValue, urlQuery]);

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
      <DisabledTooltip
        reason={
          hasAdvancedTextFilters
            ? "Can't use while title/description are active"
            : ""
        }
      >
        <TextInput
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
                    onClick={() => setValue("query", "")}
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
      </DisabledTooltip>
    </Stack>
  );
};

export default SimpleSearch;
