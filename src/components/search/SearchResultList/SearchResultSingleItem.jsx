import { useSelector } from "react-redux";
import { Stack, Tooltip, Typography } from "@mui/material";
import ReplyIcon from "@mui/icons-material/Reply";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import EditIcon from "@mui/icons-material/Edit";
import { FormattedDate } from "components/shared/FormattedDate";
import { LogbookChip } from "src/components/log/LogbookChip";
import { TagChip } from "src/components/log/TagChip";
import { CommonMark } from "components/shared/CommonMark";
import { EntryTypeChip } from "src/components/log/EntryTypeChip";
import { useAdvancedSearch } from "src/features/advancedSearchReducer";

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
  const { active: advancedSearchActive } = useAdvancedSearch();
  const isCondensed = useSelector(
    (state) => state.advancedSearch.condensedEntries
  );
  return (
    <Stack
      px={4}
      py={!isCondensed ? 0.6 : 0.8}
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
      >
        <Typography
          noWrap
          fontSize=".7rem"
          variant="body2"
        >
          {log.owner}
        </Typography>

        <FormattedDate
          date={log.createdDate}
          whiteSpace="nowrap"
          variant="body2"
          fontSize={isNestedReply ? "0.7rem" : "0.75rem"}
        />
      </Stack>
      <Stack
        maxHeight="20px"
        flexDirection="row"
        justifyContent="space-between"
        alignItems="center"
      >
        <Typography
          fontSize={isNestedReply ? ".7rem" : ".8rem"}
          fontWeight="bold"
          noWrap
          textOverflow="ellipsis"
        >
          {log.title}
        </Typography>
        <Stack
          flexDirection="row"
          alignItems="center"
          gap={0.5}
          sx={{ "& > svg": { color: "#616161" } }}
          mt={0.8}
        >
          {log?.attachments?.length > 0 && (
            <Tooltip
              title="Attachments"
              enterDelay={200}
            >
              <AttachFileIcon
                fontSize="small"
                sx={{
                  cursor: "default",
                  fontSize: isNestedReply ? "1rem" : "1.1rem"
                }}
              />
            </Tooltip>
          )}
          {log?.modifyDate && (
            <Tooltip
              title="Edited"
              enterDelay={200}
            >
              <EditIcon
                sx={{
                  cursor: "default",
                  fontSize: isNestedReply ? ".9rem" : "1.1rem"
                }}
              />
            </Tooltip>
          )}
          {!isParentNestedLog && (isReply || isNestedReply) && (
            <Tooltip
              title="Reply"
              enterDelay={200}
            >
              <ReplyIcon
                sx={{
                  cursor: "default",
                  fontSize: isNestedReply ? ".9rem" : "1.2rem"
                }}
              />
            </Tooltip>
          )}
        </Stack>
      </Stack>

      {!isCondensed && (
        <CommonMark
          commonmarkSrc={log.source}
          isSummary
          sx={{
            fontSize: isNestedReply ? ".75rem" : ".8rem",
            margin: 0
          }}
        />
      )}

      {!isNestedReply && !isCondensed && (
        <Stack
          mt={0.5}
          mb={0.5}
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
          {advancedSearchActive && (
            <EntryTypeChip
              sx={{ fontSize: ".65rem", height: "20px" }}
              iconProps={{ width: "12px" }}
              key={log?.level}
              value={log?.level}
            />
          )}
        </Stack>
      )}
      {expandIcon}
    </Stack>
  );
};
