import { Stack } from "@mui/material";
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
    <LogDetailActionButton log={log} />
  </Stack>
);

export default LogHeader;
