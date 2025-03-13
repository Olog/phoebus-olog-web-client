import { Stack, Typography } from "@mui/material";
import ReplyIcon from "@mui/icons-material/Reply";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import EditIcon from "@mui/icons-material/Edit";
import { FormattedDate } from "components/shared/FormattedDate";
import { LogbookChip } from "beta/components/log/LogbookChip";
import { TagChip } from "beta/components/log/TagChip";
import { CommonMark } from "components/shared/CommonMark";

export const SearchResultSingleItem = ({
  log,
  selected,
  onClick,
  isReply,
  expandIcon,
  handleKeyDown,
  isNestedReply,
  isParentNestedLog
}) => {
  return (
    <Stack
      px={4}
      pb={1.2}
      pt={0.8}
      sx={{
        position: "relative",
        borderBottom: "1px solid #dedede",
        borderRadius: "1px",
        "&:focus": {
          outline: "none"
        },
        ...(!selected && {
          "&:hover": {
            cursor: "pointer",
            backgroundColor: "#ECF0F3"
          }
        }),
        ...(selected && {
          "&:hover": {
            cursor: "pointer"
          },
          borderRadius: "1px",
          backgroundColor: "#0099dc24"
        }),
        ...(isNestedReply && {
          paddingLeft: "55px"
        }),
        "&:last-child": {
          borderBottom: "none"
        }
      }}
      onClick={() => onClick(log.id)}
      tabIndex={-1}
      onKeyDown={handleKeyDown}
      data-id={log.id}
    >
      <Stack
        flexDirection="row"
        alignItems="center"
        justifyContent="space-between"
        pb="4px"
      >
        <Typography
          noWrap
          fontSize=".75rem"
          variant="body2"
        >
          {log.owner}
        </Typography>

        <FormattedDate
          date={log.createdDate}
          whiteSpace="nowrap"
          variant="body2"
          fontSize={isNestedReply ? "0.7rem" : "0.8rem"}
          mt={0.2}
        />
      </Stack>
      <Stack
        maxHeight="22px"
        flexDirection="row"
        justifyContent="space-between"
        alignItems="center"
        pb={0.2}
      >
        <Typography
          fontSize={isNestedReply ? ".75rem" : ".85rem"}
          noWrap
          fontWeight="bold"
        >
          {log.title}
        </Typography>
        <Stack
          flexDirection="row"
          alignItems="center"
          gap={0.5}
          sx={{ "& > svg": { color: "#616161" } }}
        >
          {log?.attachments?.length > 0 && (
            <AttachFileIcon
              fontSize="small"
              sx={{
                fontSize: isNestedReply ? "1.1rem" : "1.25rem"
              }}
            />
          )}
          {log?.modifyDate && (
            <EditIcon sx={{ fontSize: isNestedReply ? "1rem" : "1.3rem" }} />
          )}
          {!isParentNestedLog && (isReply || isNestedReply) && (
            <ReplyIcon sx={{ fontSize: isNestedReply ? "1.1rem" : "1.5rem" }} />
          )}
        </Stack>
      </Stack>

      <CommonMark
        commonmarkSrc={log.source}
        isSummary
        sx={{
          fontSize: isNestedReply ? ".8rem" : ".9rem"
        }}
      />

      {!isNestedReply && (
        <Stack
          mt={1}
          flexDirection="row"
          gap={0.5}
          flexWrap="wrap"
          gridColumn="span 2"
          sx={{ "& > div": { cursor: "pointer" } }}
        >
          {log?.logbooks?.map((it) => (
            <LogbookChip
              sx={{ fontSize: ".65rem", height: "20px" }}
              key={it.name}
              value={it.name}
            />
          ))}
          {log?.tags?.map((it) => (
            <TagChip
              sx={{ fontSize: ".65rem", height: "20px" }}
              iconProps={{ width: "12px" }}
              key={it.name}
              value={it.name}
            />
          ))}
        </Stack>
      )}
      {expandIcon}
    </Stack>
  );
};
