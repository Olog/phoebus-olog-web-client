import { useEffect, useMemo } from "react";
import {
  Alert,
  LinearProgress,
  Stack,
  Typography
} from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import { ologApi } from "api/ologApi";
import { useSearchMode } from "features/searchModeReducer";
import { useEnhancedSearchParams } from "src/hooks/useEnhancedSearchParams";

const formatDate = (ms) =>
  ms ? new Date(Number(ms)).toLocaleString() : null;

export const AISearchResults = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { aiQuery, aiAnalysisEnabled } = useSearchMode();
  const { searchParams } = useEnhancedSearchParams();

  const payload = useMemo(
    () => ({
      query: aiQuery,
      start: searchParams.start,
      end: searchParams.end,
      logbooks: searchParams.logbooks,
      tags: searchParams.tags,
      level: searchParams.level,
      owner: searchParams.owner,
      title: searchParams.title,
      desc: searchParams.desc
    }),
    [aiQuery, searchParams]
  );

  const { data, isFetching, error } = ologApi.endpoints.aiSearch.useQuery(
    payload,
    { skip: !aiQuery }
  );

  const [triggerAnalyze] = ologApi.endpoints.aiAnalyze.useMutation({
    fixedCacheKey: "ai-analysis"
  });

  // request analysis whenever it's enabled and fresh results arrive;
  // AIAnalysisPanel (right side) renders the outcome via the shared cache key
  useEffect(() => {
    if (aiAnalysisEnabled && data?.hits?.length) {
      triggerAnalyze({ query: aiQuery, hits: data.hits });
    }
  }, [aiAnalysisEnabled, data, aiQuery, triggerAnalyze]);

  const navigateToEntry = (logId) =>
    navigate(`/logs/${logId}${location.search}`);

  if (!aiQuery) {
    return (
      <Stack p={4} sx={{ backgroundColor: "#fafafa" }}>
        <Typography color="text.secondary">
          Ask a question above to search with AI
        </Typography>
      </Stack>
    );
  }

  return (
    <Stack
      sx={{
        minWidth: 0,
        minHeight: 0,
        overflow: "auto",
        backgroundColor: "#fafafa"
      }}
    >
      {isFetching && <LinearProgress />}
      {error && (
        <Alert severity="error" sx={{ m: 2 }}>
          AI search failed — please try again
        </Alert>
      )}

      {!isFetching && data?.hits?.length === 0 && (
        <Typography p={4} color="text.secondary">
          No results found
        </Typography>
      )}

      {data?.hits?.map((hit, i) => (
        <Stack
          key={hit.metadata?.id ?? i}
          onClick={() => hit.metadata?.id && navigateToEntry(hit.metadata.id)}
          p={2}
          gap={0.5}
          sx={{
            cursor: "pointer",
            borderBottom: "1px solid #eee",
            "&:hover": { backgroundColor: "#f5f5f5" }
          }}
        >
          <Typography fontWeight={600} fontSize="0.9rem">
            #{i + 1} · {hit.metadata?.title ?? "Untitled"}
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              overflow: "hidden",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical"
            }}
          >
            {hit.content}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {hit.metadata?.owner}
            {formatDate(hit.metadata?.createdDate) &&
              ` • ${formatDate(hit.metadata.createdDate)}`}
          </Typography>
        </Stack>
      ))}
    </Stack>
  );
};