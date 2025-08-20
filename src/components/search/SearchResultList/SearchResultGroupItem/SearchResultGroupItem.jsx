import { useEffect, useState } from "react";
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
import { useEnhancedSearchParams } from "src/hooks/useEnhancedSearchParams";

export const SearchResultGroupItem = styled(
  ({
    log,
    onClick = () => {},
    handleKeyDown,
    dateDescending,
    shouldToggle,
    onToggleComplete
  }) => {
    const [expanded, setExpanded] = useState(false);

    const { searchParams, isSearchActive } = useEnhancedSearchParams();
    const { start, end } = searchParams;

    const { id: paramLogId } = useParams();
    const currentLogEntryId = Number(paramLogId);

    const { data: groupOfLogs, isLoading: repliesLoading } =
      ologApi.endpoints.getLogGroup.useQuery({
        groupId: getLogEntryGroupId(log?.properties ?? [])
      });

    const sortedGroup = groupOfLogs?.toSorted(
      sortByCreatedDate(dateDescending)
    );

    // Since we do manual grouping of logs on the FE
    // we also need to filter based on date range
    let dateFilteredGroup = sortedGroup;

    if (start) {
      dateFilteredGroup = dateFilteredGroup?.filter(
        (log) => new Date(log.createdDate) >= new Date(start)
      );
    }

    if (end) {
      dateFilteredGroup = dateFilteredGroup?.filter(
        (log) => new Date(log.createdDate) <= new Date(end)
      );
    }

    const parentLog = dateFilteredGroup?.[0];
    const nestedLogsCount = dateFilteredGroup?.length - 1;
    const nestedLogs = dateFilteredGroup?.slice(1);

    const onExpandClick = (e) => {
      e.stopPropagation();
      setExpanded(!expanded);
    };

    useEffect(() => {
      if (isSearchActive) {
        setExpanded(true);
      } else {
        setExpanded(false);
      }
    }, [isSearchActive, searchParams]);

    useEffect(() => {
      if (shouldToggle) {
        setExpanded((prev) => !prev);
        onToggleComplete();
      }
    }, [shouldToggle, onToggleComplete]);

    const ExpandIcon = () => (
      <Stack
        mt={0.3}
        mb={0.6}
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
            expandIcon={nestedLogsCount >= 1 && <ExpandIcon />}
            handleKeyDown={handleKeyDown}
            isReply={dateDescending}
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
              isParentNestedLog={dateDescending && i === nestedLogs.length - 1}
              handleKeyDown={handleKeyDown}
            />
          ))}
      </>
    );
  }
)({});
