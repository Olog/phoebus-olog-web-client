import { styled } from "@mui/material";
import MultiSelect from "../MultiSelect";
import { ologApi } from "api/ologApi";

const LogbooksMultiSelect = styled(({ control, className, ...props }) => {
  const { data: logbooks = [], isLoading } =
    ologApi.endpoints.getLogbooks.useQuery();

  return (
    <MultiSelect
      className={className}
      name="logbooks"
      label="Logbooks"
      control={control}
      options={logbooks}
      getOptionLabel={(logbook) => logbook.name}
      isOptionEqualToValue={(option, value) => option.name === value.name}
      isMulti
      loading={isLoading}
      {...props}
    />
  );
})({});

export default LogbooksMultiSelect;
