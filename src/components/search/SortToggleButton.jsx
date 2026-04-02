import SortIcon from "@mui/icons-material/Sort";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import { Badge, IconButton, Tooltip } from "@mui/material";
import { useSearchPageParams } from "src/features/searchPageParamsReducer";

export const SortToggleButton = ({ onClick, label, disabled }) => {
  const dateDescending = useSearchPageParams().sort === "down";
  let tooltipTitle = "Ascending";
  if (disabled) {
    tooltipTitle = "Can't use while search is active";
  } else if (dateDescending) {
    tooltipTitle = "Descending";
  }

  return (
    <Tooltip
      title={tooltipTitle}
      sx={{ "& .MuiTooltip-tooltipPlacementBottom": { marginTop: 0 } }}
    >
      <span style={disabled ? { cursor: "not-allowed" } : undefined}>
        <IconButton
          aria-label={`sort by ${label}, ${dateDescending ? "descending" : "ascending"}`}
          sx={{ color: "#616161" }}
          onClick={onClick}
          disabled={disabled}
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
        </IconButton>
      </span>
    </Tooltip>
  );
};
