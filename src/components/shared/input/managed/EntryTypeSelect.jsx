import { styled } from "@mui/material";
import MultiSelect from "../MultiSelect";
import customization from "config/customization";

const EntryTypeSelect = styled(({ className, ...props }) => {
  return (
    <>
      <MultiSelect
        className={className}
        name="level"
        label={customization.level ?? "Entry type"}
        {...props}
      />
    </>
  );
})({});

export default EntryTypeSelect;
