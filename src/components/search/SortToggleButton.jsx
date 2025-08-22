import SortIcon from "@mui/icons-material/Sort";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import { Badge, IconButton, Tooltip } from "@mui/material";
import { useSearchPageParams } from "src/features/searchPageParamsReducer";

export const SortToggleButton = ({ onClick, label }) => {
  const dateDescending = useSearchPageParams().sort === "down";
  return (
    <IconButton
      aria-label={`sort by ${label}, ${dateDescending ? "descending" : "ascending"}`}
      sx={{ color: "#616161" }}
      onClick={onClick}
    >
      <Tooltip
        enterDelay={200}
        title="Sort by date"
        sx={{ "& .MuiTooltip-tooltipPlacementBottom": { marginTop: 0 } }}
      >
        <Badge
          badgeContent={
            dateDescending ? <ArrowDropDownIcon /> : <ArrowDropUpIcon />
          }
          sx={{
            "& .MuiBadge-badge": {
              right: 4,
              top: 18
            }
          }}
        >
          <SortIcon />
        </Badge>
      </Tooltip>
    </IconButton>
  );
};
