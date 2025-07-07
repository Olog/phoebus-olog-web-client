import { styled } from "@mui/material";
import MultiSelect from "../MultiSelect";

const LogbooksMultiSelect = styled(({ className, ...props }) => {
  return (
    <MultiSelect
      className={className}
      name="logbooks"
      label="Logbooks"
      isMulti
      {...props}
    />
  );
})({});

export default LogbooksMultiSelect;
