import { Stack } from "@mui/material";
import { useDispatch } from "react-redux";
import SimpleSearch from "components/search/SimpleSearch";
import AISearch from "components/search/AISearch";
import { SearchModeToggle } from "components/search/SearchModeToggle";
import { AIAnalysisSwitch } from "components/search/AIAnalysisSwitch";
import {
  SEARCH_MODES,
  setSearchMode,
  toggleAiAnalysis,
  useSearchMode
} from "features/searchModeReducer";

const SearchBar = ({ actions }) => {
  const dispatch = useDispatch();
  const { mode, aiAnalysisEnabled } = useSearchMode();
  const isAiMode = mode === SEARCH_MODES.AI;

  return (
    <Stack gap={0.5} sx={{ flex: 3 }}>
      {/* row: search input + (in AI mode) the analysis switch */}
      <Stack flexDirection="row" alignItems="center" gap={1}>
        {isAiMode ? <AISearch /> : <SimpleSearch />}
        {isAiMode && (
          <AIAnalysisSwitch
            enabled={aiAnalysisEnabled}
            onToggle={() => dispatch(toggleAiAnalysis())}
          />
        )}
        {actions}
      </Stack>
      {/* rectangles under the input */}
      <Stack 
        alignItems="center"
        sx={{ padding: "0 14px 0 30px" }}
        >
        <SearchModeToggle
          mode={mode}
          onChange={(newMode) => dispatch(setSearchMode(newMode))}
        />
      </Stack>
    </Stack>
  );
};

export default SearchBar;