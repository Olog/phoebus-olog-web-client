import { Stack, Typography } from "@mui/material";
import dayjs from "dayjs";

const FormattedDate = ({ date, ...props }) => {
  const dateFormatted = dayjs(date).format("YYYY-MM-DD");
  const timeFormatted = dayjs(date).format("HH:mm:ss");

  return (
    <Stack
      direction="row"
      gap={1}
      mr={1}
      onClick={(e) => e.stopPropagation()}
      sx={{ cursor: "auto" }}
    >
      <Typography
        {...props}
        component="time"
      >
        {dateFormatted}
      </Typography>
      <Typography
        {...props}
        component="time"
      >
        {timeFormatted}
      </Typography>
    </Stack>
  );
};

export default FormattedDate;
