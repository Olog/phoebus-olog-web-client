import { Stack } from "@mui/material";
import Description from "components/log/EntryEditor/Description";
import React from "react";
import { useForm } from "react-hook-form";

export default {
  title: "inputs/Description",
  component: Description
};

const Template = (props) => {
  const form = useForm();

  return (
    <Stack padding={1}>
      <Description
        {...{ form }}
        {...props}
      />
    </Stack>
  );
};

export const Default = (args) => <Template {...args} />;
Default.args = {
  attachmentsDisabled: false
};
