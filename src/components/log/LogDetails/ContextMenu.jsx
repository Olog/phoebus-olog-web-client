import { useState } from "react";
import { Link } from "react-router-dom";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import EditIcon from "@mui/icons-material/Edit";
import { Stack } from "@mui/material";

export const ContextMenu = ({ log }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <IconButton
        onClick={handleClick}
        color="primary"
        size="small"
        sx={{ width: "34px", height: "34px" }}
      >
        <MoreVertIcon
          fontSize="small"
          sx={{ color: "primary.main" }}
        />
      </IconButton>
      <Menu
        id="long-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left"
        }}
        sx={{
          marginLeft: "-20px"
        }}
      >
        <MenuItem
          component={Link}
          to={`/logs/${log.id}/edit`}
          sx={{ padding: "4px 12px 4px 8px", fontSize: ".8rem" }}
          onClick={handleClose}
        >
          <Stack
            flexDirection={"row"}
            alignItems="center"
            gap={0.5}
            color="primary.main"
          >
            <EditIcon
              fontSize="small"
              sx={{ p: "5px" }}
            />
            Edit log
          </Stack>
        </MenuItem>
      </Menu>
    </>
  );
};
