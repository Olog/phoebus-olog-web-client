import { styled } from "@mui/material";
import MultiSelect from "../MultiSelect";

const TagsMultiSelect = styled(({ className, ...props }) => {
  return (
    <MultiSelect
      className={className}
      name="tags"
      label="Tags"
      isMulti
      {...props}
    />
  );
})({});

export default TagsMultiSelect;
