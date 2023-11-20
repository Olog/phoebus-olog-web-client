import React from "react";
import MultiSelect from "../MultiSelect";
import { styled } from "@mui/material";
import { useGetTagsQuery } from "api/ologApi";

const TagsMultiSelect = styled(({ control, className, ...props }) => {
  const { data: tags = [], isLoading } = useGetTagsQuery();

  return (
    <MultiSelect
      className={className}
      name="tags"
      label="Tags"
      control={control}
      options={tags}
      getOptionLabel={(tag) => tag.name}
      isOptionEqualToValue={(option, value) => option.name === value.name}
      isMulti
      loading={isLoading}
      {...props}
    />
  );
})({});

export default TagsMultiSelect;
