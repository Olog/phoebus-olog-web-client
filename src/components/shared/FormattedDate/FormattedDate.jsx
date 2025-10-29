import { Stack, Typography } from "@mui/material";
import dayjs from "dayjs";

const FormattedDate = ({ date, expanded, ...props }) => {
  const dateFormatted = dayjs(date).format("YYYY-MM-DD");
  const timeFormatted = dayjs(date).format("HH:mm:ss");

  return (
    <Stack
      direction="row"
      gap={0.7}
      onClick={expanded ? (e) => e.stopPropagation() : undefined}
      sx={{ cursor: expanded ? "auto" : "pointer" }}
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
