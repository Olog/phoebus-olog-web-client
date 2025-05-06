import { useEffect, useState } from "react";
import { Alert, Snackbar, styled } from "@mui/material";
import MultiSelect from "../MultiSelect";
import customization from "config/customization";
import { ologApi } from "src/api/ologApi";

const errorText =
  "Misconfigured level values. Please contact your administrator.";

const EntryTypeSelect = styled(({ control, className, isMulti, ...props }) => {
  const [showError, setShowError] = useState(false);
  const {
    data: levels = [],
    isLoading,
    error
  } = ologApi.endpoints.getLevels.useQuery();

  useEffect(() => {
    if (error) {
      setShowError(true);
    }
  }, [error]);

  return (
    <>
      <MultiSelect
        className={className}
        name="level"
        label={customization.level ?? "Entry type"}
        control={control}
        options={isMulti ? levels : levels.map((level) => level.name)}
        loading={isLoading}
        isMulti={isMulti}
        {...props}
      />
      <Snackbar open={showError}>
        <Alert
          severity="error"
          variant="filled"
          onClose={() => setShowError(false)}
        >
          {errorText}
        </Alert>
      </Snackbar>
    </>
  );
})({});

export default EntryTypeSelect;
