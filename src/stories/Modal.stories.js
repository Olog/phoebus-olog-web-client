import { Button, Stack, Typography } from "@mui/material";
import Modal from "components/shared/Modal";
import React, { useState } from "react";
import AddBoxIcon from "@mui/icons-material/AddBox";

export default {
  title: "Common/Modal"
};

const loremString =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam dignissim aliquam libero, sit amet porttitor felis iaculis a. Nunc consequat urna vitae tellus consequat, a egestas enim dictum. Morbi sodales pharetra sagittis. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed velit ex, venenatis id vulputate egestas, molestie id libero. Curabitur eu tincidunt metus. Mauris ultricies tristique quam, ut cursus tortor. Nullam feugiat elementum nulla, nec faucibus lorem sodales quis. Suspendisse sollicitudin sollicitudin sapien, a bibendum dolor rhoncus consectetur. Nunc interdum et turpis vitae vehicula. Donec egestas vitae mauris id scelerisque. Cras suscipit magna nec purus vehicula ultrices. Fusce quam nibh, iaculis in maximus a, ultrices eget tortor. Etiam ex massa, vulputate condimentum fermentum eu, convallis non metus. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam dignissim aliquam libero, sit amet porttitor felis iaculis a. Nunc consequat urna vitae tellus consequat, a egestas enim dictum. Morbi sodales pharetra sagittis. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed velit ex, venenatis id vulputate egestas, molestie id libero. Curabitur eu tincidunt metus. Mauris ultricies tristique quam, ut cursus tortor. Nullam feugiat elementum nulla, nec faucibus lorem sodales quis. Suspendisse sollicitudin sollicitudin sapien, a bibendum dolor rhoncus consectetur. Nunc interdum et turpis vitae vehicula. Donec egestas vitae mauris id scelerisque. Cras suscipit magna nec purus vehicula ultrices. Fusce quam nibh, iaculis in maximus a, ultrices eget tortor. Etiam ex massa, vulputate condimentum fermentum eu, convallis non metus.";

const CustomTitle = ({ title }) => {
  return (
    <Stack
      flexDirection="row"
      gap={1}
      alignItems="center"
    >
      <AddBoxIcon fontSize="large" />
      <Typography
        variant="button"
        verticalalign="center"
      >
        {title}
      </Typography>
    </Stack>
  );
};

const CustomContent = ({ content }) => {
  return <Typography fontFamily="monospace">{content}</Typography>;
};

export const Default = ({
  title,
  titleIsCustomComponent,
  content,
  contentIsCustomComponent,
  ...props
}) => {
  const [open, setOpen] = useState(true);

  return (
    <>
      <Button
        variant="contained"
        onClick={() => setOpen(true)}
      >
        Show Dialog
      </Button>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title={titleIsCustomComponent ? <CustomTitle title={title} /> : title}
        content={
          contentIsCustomComponent ? (
            <CustomContent content={content} />
          ) : (
            content
          )
        }
        {...props}
      />
    </>
  );
};
Default.args = {
  title: "Some Title",
  titleIsCustomComponent: false,
  content: loremString,
  contentIsCustomComponent: false,
  DialogProps: { fullWidth: true, maxWidth: "md" }
};
