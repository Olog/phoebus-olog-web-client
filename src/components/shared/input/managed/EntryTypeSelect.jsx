import React, { useEffect, useState } from "react";
import MultiSelect from "../MultiSelect";
import { Alert, Snackbar, styled } from "@mui/material";
import customization from "config/customization";

const errorText =
  "Misconfigured VITE_APP_LEVEL_VALUES. Please contact your administrator.";

const EntryTypeSelect = styled(({ control, className, ...props }) => {
  const [levelValues, setLevelValues] = useState([]);
  const [showError, setShowError] = useState(false);

  useEffect(() => {
    try {
      setLevelValues(JSON.parse(customization.levelValues));
    } catch (e) {
      setShowError(true);
      console.error(errorText, e);
      return;
    }
  }, []);

  return (
    <>
      <MultiSelect
        className={className}
        name="level"
        label={customization.level ?? "Entry Type"}
        control={control}
        defaultValue={customization.defaultLevel}
        options={levelValues}
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
