import SortIcon from "@mui/icons-material/Sort";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import { Badge, IconButton } from "@mui/material";

export const SortToggleButton = ({ isDescending, onClick, label }) => {
  return (
    <IconButton
      aria-label={`sort by ${label}, ${isDescending ? "descending" : "ascending"}`}
      onClick={onClick}
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
    </IconButton>
  );
};
