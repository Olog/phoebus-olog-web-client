import { Typography } from "@mui/material";
import dayjs from "dayjs";

const formatVariants = {
  fullDateTime: "YYYY-MM-DD HH:mm:ss",
  shortDate: "YYYY-MM-DD",
  shortTime: "HH:mm:ss"
};

const FormattedDate = ({
  date,
  formatVariant = "fullDateTime",
  customFormat,
  ...props
}) => {
  const selectedFormat = customFormat ?? formatVariants[formatVariant];

  return (
    <Typography
      {...props}
      component="time"
    >
      {dayjs(date).format(selectedFormat)}
    </Typography>
  );
};

export default FormattedDate;
