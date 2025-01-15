import { useEffect } from "react";
import { Box, Button, Drawer, Stack, Typography } from "@mui/material";
import { useForm } from "react-hook-form";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import { useDispatch } from "react-redux";
import { TextInput } from "components/shared/input/TextInput";
import WizardDateInput from "components/shared/input/WizardDateInput";
import EntryTypeSelect from "components/shared/input/managed/EntryTypeSelect";
import LogbooksMultiSelect from "components/shared/input/managed/LogbooksMultiSelect";
import TagsMultiSelect from "components/shared/input/managed/TagsMultiSelect";
import {
  defaultSearchParams,
  updateSearchParams
} from "features/searchParamsReducer";

const isDate = (obj) => {
  return obj instanceof Date && !isNaN(obj);
};
const toDate = (dateString) => {
  if (isDate(dateString)) {
    return new Date(dateString);
  } else {
    return null;
  }
};

export const AdvancedSearchDrawer = ({
  searchParams,
  advancedSearchOpen,
  setAdvancedSearchOpen
}) => {
  const dispatch = useDispatch();
  const form = useForm({
    defaultValues: defaultSearchParams
  });
  const { control, handleSubmit, getValues } = form;

  useEffect(() => {
    form.reset(searchParams);
  }, [form, searchParams]);

  const closeDrawer = () => setAdvancedSearchOpen(false);

  const clearFilters = () => {
    dispatch(updateSearchParams(defaultSearchParams));
    form.reset(defaultSearchParams);
  };

  const onSubmit = () => {
    dispatch(updateSearchParams(getValues()));
    closeDrawer();
  };

  return (
    <Drawer
      open={advancedSearchOpen}
      onClose={closeDrawer}
    >
      <Box padding={1}>
        <Stack>
          <Typography
            component="h2"
            variant="h4"
            id="advanced-search"
          >
            Filters
          </Typography>
          <Stack
            component="form"
            onSubmit={handleSubmit(onSubmit)}
            aria-labelledby="advanced-search"
            role="search"
            gap={1}
          >
            <TextInput
              name="title"
              label="Title"
              control={control}
              defaultValue=""
            />
            <TextInput
              name="desc"
              label="Text"
              control={control}
              defaultValue=""
            />
            <TextInput
              name="properties"
              label="Properties"
              control={control}
              defaultValue=""
            />
            <EntryTypeSelect control={control} />
            <LogbooksMultiSelect control={control} />
            <TagsMultiSelect control={control} />
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
              flexDirection="row"
              justifyContent="flex-end"
            >
              <Button
                onClick={clearFilters}
                sx={{ marginRight: "10px" }}
              >
                Clear filters
              </Button>
              <Button
                type="submit"
                variant="contained"
                startIcon={<FilterAltIcon />}
              >
                Apply
              </Button>
            </Stack>
          </Stack>
        </Stack>
      </Box>
    </Drawer>
  );
};
