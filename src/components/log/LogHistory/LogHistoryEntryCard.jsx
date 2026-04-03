import { Box, Stack, Typography } from "@mui/material";
import LogDetails from "src/components/log/LogDetails/LogDetails";
import { FormattedDate } from "src/components/shared/FormattedDate";

const HEADER_BG = "#f2f5f7";

const LogHistoryEntryCard = ({ log }) => {
  const displayDate = log.modifyDate || log.createdDate;
  const dateLabel = log.modifyDate ? "Edited at:" : "Created at:";

  return (
    <Box
      sx={{
        margin: "0 0 10px 0",
        borderRadius: "4px",
        overflow: "hidden"
      }}
    >
      <Box
        sx={{
          borderRadius: "4px 4px 0 0",
          bgcolor: HEADER_BG,
          pt: 1.25,
          pb: 1,
          px: 3
        }}
      >
        <Stack
          flexDirection="row"
          justifyContent="space-between"
          width="100%"
        >
          <Stack>
            <Typography
              fontSize=".85rem"
              noWrap
              sx={{ lineHeight: "100%" }}
            >
              {log.owner}
            </Typography>
            <Typography
              sx={{
                fontSize: ".975rem",
                fontWeight: 500,
                mt: 0.8
              }}
            >
              {log.title}
            </Typography>
          </Stack>

          <Stack
            minWidth="130px"
            alignItems="flex-end"
          >
            <Stack
              direction="row"
              alignItems="center"
              mr={1.5}
              gap={1.25}
            >
              <Typography
                component="span"
                sx={{ fontSize: ".75rem", color: "text.secondary" }}
              >
                {dateLabel}
              </Typography>
              <FormattedDate
                date={displayDate}
                expanded
                sx={{ fontSize: ".8rem" }}
              />
            </Stack>
          </Stack>
        </Stack>
      </Box>
      <Box
        sx={{
          padding: 0,
          borderWidth: "0 2px 2px 2px",
          borderStyle: "solid",
          borderColor: HEADER_BG,
          borderRadius: "0 0 4px 4px"
        }}
      >
        <LogDetails log={log} />
      </Box>
    </Box>
  );
};

export default LogHistoryEntryCard;
