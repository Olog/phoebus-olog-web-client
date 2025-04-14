import { useState } from "react";
import { Alert, Snackbar, styled } from "@mui/material";
import MultiSelect from "../MultiSelect";
import customization from "config/customization";
import { ologApi } from "src/api/ologApi";

const errorText =
  "Misconfigured level values. Please contact your administrator.";

const EntryTypeSelect = styled(({ control, className, ...props }) => {
  const [showError, setShowError] = useState(false);

  const { data: levels = [], isLoading } =
    ologApi.endpoints.getLevels.useQuery();

  const defaultLevel = levels?.find((level) => level?.defaultLevel);

  return (
    <>
      <MultiSelect
        className={className}
        name="level"
        label={customization.level ?? "Entry type"}
        control={control}
        defaultValue={defaultLevel?.name}
        options={levels?.map((level) => level?.name)}
        loading={isLoading}
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
