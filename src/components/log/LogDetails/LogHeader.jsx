import { Stack, Typography } from "@mui/material";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import EditIcon from "@mui/icons-material/Edit";
import LogDetailActionButton from "./LogDetailActionButton";
import { FormattedDate } from "src/components/shared/FormattedDate";
import { CommonMark } from "src/components/shared/CommonMark";

const LogHeader = ({ log, expanded, className }) => (
  <Stack
    flexDirection="row"
    justifyContent={expanded ? "space-between" : "flex-start"}
    alignItems="center"
    className={className}
    width="100%"
    px={3}
    py={1}
  >
    <Stack
      direction="column"
      gap={0.2}
      sx={{ cursor: expanded ? "text" : "pointer", minWidth: "150px" }}
      onClick={expanded ? (e) => e.stopPropagation() : undefined}
    >
      <Stack
        direction="row"
        gap={1}
      >
        <Typography
          fontSize=".825rem"
          maxWidth={expanded ? "none" : "105px"}
          noWrap
        >
          {log.owner}
        </Typography>
        <Typography
          fontSize=".825rem"
          fontWeight={600}
          component="span"
        >
          {log.id}
        </Typography>
      </Stack>
      <FormattedDate
        date={log.createdDate}
        sx={{ fontSize: ".825rem" }}
      />
    </Stack>
    {expanded && <LogDetailActionButton log={log} />}
    {!expanded && (
      <>
        <Stack sx={{ minWidth: 0, flex: 1 }}>
          <Typography
            sx={{
              fontSize: ".825rem",
              fontWeight: 500
            }}
            noWrap
          >
            {log.title}
          </Typography>
          {log.source && (
            <CommonMark
              isSummary
              commonmarkSrc={log.source}
              sx={{
                fontSize: ".825rem",
                m: 0
              }}
              noWrap
            />
          )}
        </Stack>
        <Stack
          direction="row"
          height="100%"
          alignItems="center"
          justifyContent={"flex-end"}
          minWidth="40px"
          sx={{ "& > svg": { color: "#616161", opacity: 0.8 } }}
        >
          {log?.modifyDate && (
            <EditIcon
              sx={{
                cursor: "default",
                fontSize: ".9rem"
              }}
            />
          )}
          {log?.attachments?.length > 0 && (
            <AttachFileIcon
              fontSize="small"
              sx={{
                cursor: "default",
                fontSize: "1rem"
              }}
            />
          )}
        </Stack>
      </>
    )}
  </Stack>
);

export default LogHeader;
