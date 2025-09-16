/**
 * Copyright (C) 2019 European Spallation Source ERIC.
 * <p>
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU General Public License
 * as published by the Free Software Foundation; either version 2
 * of the License, or (at your option) any later version.
 * <p>
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 * <p>
 * You should have received a copy of the GNU General Public License
 * along with this program; if not, write to the Free Software
 * Foundation, Inc., 59 Temple Place - Suite 330, Boston, MA  02111-1307, USA.
 */
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Alert,
  Button,
  Snackbar,
  Stack,
  Tooltip,
  Typography
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Description } from "./Description";
import { TextInput } from "components/shared/input/TextInput";
import LogbooksMultiSelect from "components/shared/input/managed/LogbooksMultiSelect";
import TagsMultiSelect from "components/shared/input/managed/TagsMultiSelect";
import EntryTypeSelect from "components/shared/input/managed/EntryTypeSelect";
import { PropertyCollectionInput } from "components/shared/input/managed/PropertyCollectionInput";
import { ologApi } from "src/api/ologApi";
import { useIsAuthenticated } from "src/hooks/useIsAuthenticated";
import { useCustomSnackbar } from "src/hooks/useCustomSnackbar";

const errorText =
  "Misconfigured level values. Please contact your administrator.";

const getOptionLabel = (option) => option.name;
const isOptionEqualToValue = (option, value) => option.name === value.name;

export const EntryEditor = ({
  form,
  title,
  onSubmit,
  submitDisabled,
  attachmentsDisabled
}) => {
  const topElem = useRef();
  const navigate = useNavigate();
  const { control, handleSubmit, formState } = form;

  const { isAuthenticated } = useIsAuthenticated();
  const { enqueueSnackbar } = useCustomSnackbar();

  const { data: logbooks } = ologApi.endpoints.getLogbooks.useQuery();
  const { data: tags } = ologApi.endpoints.getTags.useQuery();
  const { data: levels, error: levelsError } =
    ologApi.endpoints.getLevels.useQuery();
  const [showLevelsError, setShowLevelsError] = useState(false);

  useEffect(() => {
    if (levelsError) {
      setShowLevelsError(true);
    }
  }, [levelsError]);

  // Scroll to top if there are field errors
  useEffect(() => {
    if (Object.keys(formState.errors).length > 0) {
      if (
        topElem.current &&
        typeof topElem.current.scrollIntoView === "function"
      ) {
        topElem.current.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [formState]);

  const handleEntrySubmit = (formData) => {
    if (!formData || !isAuthenticated) {
      return enqueueSnackbar("You must be logged in to submit a log entry", {
        severity: "error"
      });
    }
    handleSubmit(onSubmit)(formData);
  };

  return (
    <Stack
      gap={1}
      px={4}
      pb={4}
      pt={2}
      maxWidth="900px"
      margin="0 auto"
      width="100%"
      height="fit-content"
    >
      <Stack
        direction="row"
        alignItems="center"
        gap={2}
      >
        <Tooltip title="Go back">
          <Button
            sx={{
              borderRadius: "100%",
              minWidth: "fit-content",
              color: (theme) => theme.palette.text.primary
            }}
            onClick={() => navigate(-1)}
          >
            <ArrowBackIcon />
          </Button>
        </Tooltip>
        <Typography
          component="h2"
          variant="h3"
          fontSize="1.75rem"
          py={1}
        >
          {title}
        </Typography>
      </Stack>
      <span ref={topElem} />
      <Alert
        severity="info"
        sx={{ mb: 2 }}
      >
        You&apos;re editing an existing entry
      </Alert>
      <Stack
        component="form"
        onSubmit={handleEntrySubmit}
        gap={2}
        pb={6}
      >
        <Stack
          direction="column"
          flexWrap="wrap"
          gap={2}
        >
          <Stack
            sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}
          >
            <TextInput
              name="title"
              label="Title"
              control={control}
              defaultValue=""
              rules={{
                required: {
                  value: true,
                  message: "Please specify a title."
                }
              }}
            />

            <EntryTypeSelect
              rules={{
                validate: {
                  notEmpty: (val) => {
                    return val || "Please select an Entry Type";
                  }
                }
              }}
              control={control}
              options={levels}
              getOptionLabel={getOptionLabel}
              isOptionEqualToValue={isOptionEqualToValue}
            />
            <Snackbar
              open={showLevelsError}
              autoHideDuration={6000}
            >
              <Alert
                severity="error"
                variant="filled"
                onClose={() => setShowLevelsError(false)}
              >
                {errorText}
              </Alert>
            </Snackbar>
          </Stack>
          <Stack
            sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}
          >
            <LogbooksMultiSelect
              control={control}
              rules={{
                validate: {
                  notEmpty: (val) =>
                    val?.length > 0 || "Select at least one logbook"
                }
              }}
              options={logbooks}
              getOptionLabel={getOptionLabel}
              isOptionEqualToValue={isOptionEqualToValue}
            />
            <TagsMultiSelect
              control={control}
              options={tags}
              getOptionLabel={getOptionLabel}
              isOptionEqualToValue={isOptionEqualToValue}
            />
          </Stack>
        </Stack>
        <Description
          form={form}
          attachmentsDisabled={attachmentsDisabled}
        />
        <PropertyCollectionInput control={control} />
        <Stack
          gap={2}
          direction="row"
          justifyContent="flex-end"
          sx={{ "& button": { minWidth: "90px" } }}
        >
          <Button
            variant="outlined"
            onClick={() => navigate("/")}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={submitDisabled}
          >
            Submit
          </Button>
        </Stack>
      </Stack>
    </Stack>
  );
};
