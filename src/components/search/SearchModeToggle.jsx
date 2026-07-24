import { ToggleButton, ToggleButtonGroup } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import { SEARCH_MODES } from "features/searchModeReducer";

export const SearchModeToggle = ({ mode, onChange }) => (
  <ToggleButtonGroup
    value={mode}
    exclusive
    aria-label="search mode"
    onChange={(_, newMode) => {
      if (newMode !== null) onChange(newMode);
    }}
    sx={{
      "& .MuiToggleButton-root": {
        textTransform: "none",
        gap: 0.5,
        padding: "2px 12px",
        fontSize: "1.0rem",
        color: "grey.600",
      },
      "& .MuiToggleButton-root.Mui-selected": {
        color: "primary.main",
        fontWeight: 600,
      }
    }}
  >
    <ToggleButton value={SEARCH_MODES.QUERY} aria-label="query search">
      Query search
    </ToggleButton>
    <ToggleButton value={SEARCH_MODES.AI} aria-label="ai search">
      <AutoAwesomeIcon sx={{ fontSize: "16px" }} />
      AI search
    </ToggleButton>
  </ToggleButtonGroup>
);