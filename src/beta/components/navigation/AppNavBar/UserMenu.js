import {
  Box,
  Button,
  Chip,
  Menu,
  MenuItem,
  Stack,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import { useShowLogout } from "features/authSlice";
import UserAvatar from "beta/components/common/UserAvatar";
import theme from "config/theme";
const UserMenu = ({ user }) => {
  const { setShowLogout } = useShowLogout();

  return (
    <Box>
      <Button
        onClick={() => setShowLogout(true)}
        variant="outlined"
        color="primary"
      >
        {user.userName}
      </Button>
    </Box>
  );
};

export default UserMenu;
