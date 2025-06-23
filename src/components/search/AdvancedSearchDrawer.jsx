import { useEffect } from "react";
import { Box, Button, Stack } from "@mui/material";
import { useForm } from "react-hook-form";
import { useTheme } from "@mui/material/styles";
import { useDispatch } from "react-redux";
import { TextInput } from "components/shared/input/TextInput";
import WizardDateInput from "components/shared/input/WizardDateInput";
import EntryTypeSelect from "components/shared/input/managed/EntryTypeSelect";
import LogbooksMultiSelect from "components/shared/input/managed/LogbooksMultiSelect";
import TagsMultiSelect from "components/shared/input/managed/TagsMultiSelect";
import { Checkbox } from "components/shared/input/Checkbox";
import { defaultSearchParams } from "features/searchParamsReducer";
import { updateAdvancedSearch } from "src/features/advancedSearchThunk";

const toDate = (dateString) => {
  if (dateString) {
    return new Date(dateString);
  } else {
    return null;
  }
};

export const AdvancedSearchDrawer = ({ searchParams, advancedSearchOpen }) => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const form = useForm({
    defaultValues: defaultSearchParams
  });
  const { control, handleSubmit, getValues } = form;

  useEffect(() => {
    form.reset(searchParams);
  }, [form, searchParams]);

  const clearFilters = () => {
    dispatch(updateAdvancedSearch(defaultSearchParams));
    form.reset(defaultSearchParams);
  };

  const applyFilters = () => {
    dispatch(updateAdvancedSearch(getValues()));
  };

  const handleSelectChange = (field, value) => {
    field.onChange(value);
    applyFilters();
  };

  return (
    <Box
      sx={{
        position: "static",
        transition: "width 0.25s ease, padding 0.25s ease",
        width: advancedSearchOpen ? "290px" : 0,
        padding: advancedSearchOpen ? "18px 8px" : "18px 0",
        height: "100vh",
        overflow: "auto",
        [theme.breakpoints.down("md")]: {
          width: advancedSearchOpen ? "240px" : 0,
          position: "fixed",
          zIndex: 3,
          backgroundColor: theme.palette.background.paper
        }
      }}
    >
      <Stack
        component="form"
        onSubmit={handleSubmit(applyFilters)}
        aria-labelledby="advanced-search"
        role="search"
        gap={2}
        px={1}
      >
        <TextInput
          name="title"
          label="Title"
          control={control}
          defaultValue=""
        />
        <TextInput
          name="desc"
          label="Description"
          control={control}
          defaultValue=""
        />
        <TextInput
          name="properties"
          label="Properties"
          control={control}
          defaultValue=""
        />
        <EntryTypeSelect
          onChange={handleSelectChange}
          control={control}
          getOptionLabel={(level) => level?.name || ""}
          isOptionEqualToValue={(option, value) => option?.name === value?.name}
          isMulti
        />
        <LogbooksMultiSelect
          onChange={handleSelectChange}
          control={control}
        />
        <TagsMultiSelect
          onChange={handleSelectChange}
          control={control}
        />
        <TextInput
          name="owner"
          label="Author"
          control={control}
          defaultValue=""
        />
        <WizardDateInput
          name="start"
          label="Start Time"
          form={form}
          defaultValue={getValues("start")}
          applyFilters={applyFilters}
          DatePickerProps={{
            disableFuture: true
          }}
          rules={{
            validate: {
              timeParadox: (val) => {
                const startDate = toDate(val);
                const endDate = toDate(getValues("end"));
                if (startDate && endDate) {
                  return (
                    startDate <= endDate ||
                    "Start date cannot come after end date"
                  );
                } else {
                  return true;
                }
              }
            }
          }}
        />
        <WizardDateInput
          name="end"
          label="End Time"
          form={form}
          defaultValue={getValues("end")}
          applyFilters={applyFilters}
          DatePickerProps={{
            disableFuture: true
          }}
          rules={{
            validate: {
              timeParadox: (val) => {
                const startDate = toDate(getValues("start"));
                const endDate = toDate(val);
                if (startDate && endDate) {
                  return (
                    endDate > startDate ||
                    "End date cannot come before start date"
                  );
                } else {
                  return true;
                }
              }
            }
          }}
        />
        <TextInput
          name="attachments"
          label="Attachments"
          control={control}
          defaultValue=""
        />

        <Stack
          flexDirection="column"
          alignItems="flex-start"
        >
          <Checkbox
            name="groupedReplies"
            label="Grouped replies"
            control={control}
            onChange={handleSelectChange}
          />
          <Checkbox
            name="condensedEntries"
            label="Condensed entries"
            control={control}
            onChange={handleSelectChange}
          />
          <Button
            onClick={clearFilters}
            sx={{ marginRight: "10px", alignSelf: "flex-end" }}
          >
            Reset filters
          </Button>
          <Button
            type="submit"
            sx={{ display: "none" }}
          />
        </Stack>
      </Stack>
    </Box>
  );
};
