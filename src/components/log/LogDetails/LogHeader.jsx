import { Stack, Typography } from "@mui/material";
import LogDetailActionButton from "./LogDetailActionButton";
import { KeyValueTable } from "./KeyValueTable";
import { FormattedDate } from "src/components/shared/FormattedDate";

const LogHeader = ({ log, className }) => (
  <Stack
    flexDirection="row"
    flexWrap="wrap"
    justifyContent="space-between"
    alignItems="center"
    className={className}
    width="100%"
    gap={2}
    px={3}
    py={1}
  >
    <Stack
      direction="row"
      gap={2}
    >
      <KeyValueTable
        data={[
          {
            name: "Author",
            value: log.owner
          },
          {
            name: "Created",
            value: (
              <FormattedDate
                date={log.createdDate}
                component="span"
                sx={{ fontSize: ".875rem", fontWeight: "bold" }}
              />
            )
          }
        ]}
      />
    </Stack>
    <Stack
      sx={{ cursor: "text" }}
      direction="row"
    >
      <Stack
        direction="row"
        gap={1}
        alignItems="center"
        mr={2}
        mt={0.2}
        onClick={(e) => e.stopPropagation()}
      >
        <Typography fontSize=".9rem">ID</Typography>
        <Typography
          fontSize=".9rem"
          fontWeight="bold"
        >
          {log.id}
        </Typography>
      </Stack>
      <LogDetailActionButton log={log} />
    </Stack>
  </Stack>
);

export default LogHeader;
