import SortIcon from "@mui/icons-material/Sort";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import { Badge, IconButton, Tooltip } from "@mui/material";

export const SortToggleButton = ({ isDescending, onClick, label }) => {
  return (
    <IconButton
      aria-label={`sort by ${label}, ${isDescending ? "descending" : "ascending"}`}
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
            isDescending ? <ArrowDropDownIcon /> : <ArrowDropUpIcon />
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
