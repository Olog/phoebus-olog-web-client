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
import { useEffect } from "react";
import TextInput from "components/shared/input/TextInput";
import { useRef } from "react";
import { Box, Button, Stack, Typography } from "@mui/material";
import Description from "./Description";
import LogbooksMultiSelect from "components/shared/input/managed/LogbooksMultiSelect";
import TagsMultiSelect from "components/shared/input/managed/TagsMultiSelect";
import EntryTypeSelect from "components/shared/input/managed/EntryTypeSelect";
import PropertyCollectionInput from "components/shared/input/managed/PropertyCollectionInput";

export const EntryEditor = ({
  form,
  title,
  onSubmit,
  submitDisabled,
  attachmentsDisabled,
}) => {
  const topElem = useRef();
  const { control, handleSubmit, formState } = form;

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

  return (
    <Stack gap={1} px={4} pb={4} pt={2} height="fit-content">
      <Typography component="h2" variant="h3">
        {title}
      </Typography>
      <Stack component="form" onSubmit={handleSubmit(onSubmit)} gap={2}>
        <span ref={topElem}></span>
        <LogbooksMultiSelect
          control={control}
          rules={{
            validate: {
              notEmpty: (val) =>
                val?.length > 0 || "Select at least one logbook",
            },
          }}
        />
        <TagsMultiSelect control={control} />
        <EntryTypeSelect
          rules={{
            validate: {
              notEmpty: (val) =>
                val?.length > 0 || "Please select an Entry Type",
            },
          }}
          control={control}
        />
        <TextInput
          name="title"
          label="Title"
          control={control}
          defaultValue=""
          rules={{
            required: {
              value: true,
              message: "Please specify a title.",
            },
          }}
        />
        <Description form={form} attachmentsDisabled={attachmentsDisabled} />
        <PropertyCollectionInput control={control} />
        <Button type="submit" variant="contained" disabled={submitDisabled}>
          Submit
        </Button>
      </Stack>
    </Stack>
  );
};
