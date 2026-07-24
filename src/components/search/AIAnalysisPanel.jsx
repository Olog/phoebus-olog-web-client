import { useMemo } from "react";
import { Alert, Box, Typography } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import MarkdownIt from "markdown-it";
import { ologApi } from "api/ologApi";
import { useSearchMode } from "features/searchModeReducer";

const md = new MarkdownIt();

export const AIAnalysisPanel = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { aiAnalysisEnabled } = useSearchMode();

  // reads the shared mutation state — AISearchResults triggers it,
  // this component only observes via the same fixedCacheKey
  const [, { data, isLoading, error }] =
    ologApi.endpoints.aiAnalyze.useMutation({
      fixedCacheKey: "ai-analysis"
    });

  const analysisHtml = useMemo(() => {
    if (!data?.analysis) return null;
    const hits = data.hits ?? [];
    const linked = data.analysis.replace(/#(\d+)/g, (match, num) => {
      const id = hits[Number(num) - 1]?.metadata?.id;
      return id ? `[${match}](#entry-${id})` : match;
    });
    return md.render(linked);
  }, [data]);

  const onAnalysisClick = (e) => {
    const anchor = e.target.closest("a");
    const href = anchor?.getAttribute("href") ?? "";
    if (href.startsWith("#entry-")) {
      e.preventDefault();
      // exactly what clicking a result does: route to /logs/:id
      navigate(`/logs/${href.replace("#entry-", "")}${location.search}`);
    }
  };

  if (!aiAnalysisEnabled) return null;
  if (!isLoading && !error && !analysisHtml) return null;

  return (
    <Box
      sx={{
        m: 2,
        p: 2,
        backgroundColor: "#f5f9fc",
        borderRadius: "8px",
        border: "1px solid #d6e7f2",
        flexShrink: 0,
        "& a": { color: "#0099dc", fontWeight: 600 }
      }}
    >
      <Typography fontWeight={600} gutterBottom>
        Analysis
      </Typography>
      {isLoading && (
        <Typography variant="body2" color="text.secondary">
          Analyzing results…
        </Typography>
      )}
      {error && <Alert severity="warning">Analysis failed</Alert>}
      {analysisHtml && (
        <Box
          onClick={onAnalysisClick}
          sx={{ fontSize: "0.9rem", "& p": { my: 0.5 } }}
          dangerouslySetInnerHTML={{ __html: analysisHtml }}
        />
      )}
    </Box>
  );
};