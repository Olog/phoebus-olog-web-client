import React, { useEffect, useState } from "react";
import MultiSelect from "../MultiSelect";
import { styled } from "@mui/material";
import customization from "config/customization";

const EntryTypeSelect = styled(({ control, className, ...props }) => {
  const [levelValues, setLevelValues] = useState([]);

  useEffect(() => {
    try {
      setLevelValues(JSON.parse(customization.levelValues));
    } catch (e) {
      console.error("Failed to parse level values:", e);
      return [];
    }
  }, []);

  return (
    <MultiSelect
      className={className}
      name="level"
      label={customization.level ?? "Entry Type"}
      control={control}
      defaultValue={customization.defaultLevel}
      options={levelValues}
      {...props}
    />
  );
})({});

export default EntryTypeSelect;
