import { useState } from "react";
import { useParams } from "react-router-dom";
import {
  Box,
  IconButton,
  LinearProgress,
  Stack,
  Typography,
  styled
} from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import { SearchResultSingleItem } from "..";
import { getLogEntryGroupId } from "components/Properties";
import { ologApi } from "api/ologApi";
import { sortByCreatedDate } from "src/components/log/sort";

export const SearchResultGroupItem = styled(
  ({ log, onClick = () => {}, handleKeyDown, dateDescending }) => {
    const [expanded, setExpanded] = useState(true);

    const { id: paramLogId } = useParams();
    const currentLogEntryId = Number(paramLogId);

    const { data: groupOfLogs, isLoading: repliesLoading } =
      ologApi.endpoints.getLogGroup.useQuery({
        groupId: getLogEntryGroupId(log?.properties ?? [])
      });

    const sortedGroup = groupOfLogs?.toSorted(
      sortByCreatedDate(dateDescending)
    );

    const parentLog = sortedGroup?.[0];
    const nestedLogsCount = sortedGroup?.length - 1;
    const nestedLogs = sortedGroup?.slice(1);

    const onExpandClick = (e) => {
      e.stopPropagation();
      setExpanded(!expanded);
    };

    const ExpandIcon = () => (
      <Stack
        mt={1.5}
        flexDirection="row"
        alignItems="center"
        onClick={onExpandClick}
        sx={{ cursor: "pointer", width: "fit-content" }}
      >
        <IconButton
          sx={{ color: "#0099db", padding: "0 5px 0 0" }}
          size="small"
          aria-expanded={expanded ? "true" : "false"}
        >
          {expanded ? (
            <RemoveCircleOutlineIcon fontSize="inherit" />
          ) : (
            <AddCircleOutlineIcon fontSize="inherit" />
          )}
        </IconButton>
        <Typography
          color="#0099db"
          variant="body2"
        >
          ({nestedLogsCount}) {expanded ? "Hide" : "Show"} group
        </Typography>
      </Stack>
    );

    return (
      <>
        {parentLog && (
          <SearchResultSingleItem
            log={parentLog}
            selected={currentLogEntryId === parentLog.id}
            onClick={onClick}
            expandIcon={<ExpandIcon />}
            handleKeyDown={handleKeyDown}
            isReply
          />
        )}
        {repliesLoading && (
          <Box
            px={8}
            py={2}
          >
            <LinearProgress sx={{ height: "4px", width: "100%" }} />
          </Box>
        )}
        {expanded &&
          nestedLogs?.map((reply, i) => (
            <SearchResultSingleItem
              key={reply.id}
              log={reply}
              selected={currentLogEntryId === reply.id}
              onClick={onClick}
              isNestedReply
              isParentNestedLog={i === nestedLogs.length - 1}
              handleKeyDown={handleKeyDown}
            />
          ))}
      </>
    );
  }
)({});
