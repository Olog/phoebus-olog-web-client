import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Box,
  IconButton,
  LinearProgress,
  Typography,
  styled
} from "@mui/material";
import ForumIcon from "@mui/icons-material/Forum";
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
    shouldParentToggleExpand,
    onToggleComplete
  }) => {
    const [expanded, setExpanded] = useState(false);
    const initialized = useRef(false);

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
      if (
        !initialized.current &&
        nestedLogs?.some((log) => log?.id === currentLogEntryId)
      ) {
        initialized.current = true;
        setExpanded(true);
      }
    }, [nestedLogs, currentLogEntryId]);

    useEffect(() => {
      if (shouldParentToggleExpand) {
        setExpanded((prev) => !prev);
        onToggleComplete();
      }
    }, [shouldParentToggleExpand, onToggleComplete]);

    const ExpandIcon = () => (
      <IconButton
        onClick={onExpandClick}
        size="small"
        aria-expanded={expanded ? "true" : "false"}
        sx={{
          color: "#0099db",
          padding: "4px 6px",
          marginRight: "-4px",
          gap: "3px",
          borderRadius: "4px",
          flexShrink: 0,
          backgroundColor: expanded ? "rgba(0,153,219,0.12)" : "transparent",
          "&:hover": { backgroundColor: "rgba(0,153,219,0.2)" }
        }}
      >
        <ForumIcon sx={{ fontSize: ".95rem" }} />
        <Typography
          fontSize=".7rem"
          fontWeight="bold"
          lineHeight={1}
        >
          {nestedLogsCount}
        </Typography>
      </IconButton>
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
