import { Box, Button, Chip, Menu, MenuItem, Stack, Typography } from "@mui/material";
import React, { useState } from "react";
import UserAvatar from "../UserAvatar";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import { useShowLogout } from "features/authSlice";

const UserMenu = ({user}) => {

    const { setShowLogout } = useShowLogout();

    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const onClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const onClose = () => {
        setAnchorEl(null);
    };

    return (
        <Box>
            <Button onClick={onClick} color="inherit" endIcon={<KeyboardArrowDownIcon />}>
                <UserAvatar user={user} size={36} />
            </Button>
            <Menu open={open} onClose={onClose} anchorEl={anchorEl} >
                <MenuItem>
                    <Stack gap={0.5}>
                        <Typography>Roles</Typography>
                        { user?.roles
                            ? user.roles.map(role => <Chip label={role} color="secondary" />)
                            : <Typography variant="body2" fontStyle="italic">(No roles)</Typography>
                        }
                    </Stack>
                </MenuItem>
                <MenuItem onClick={() => setShowLogout(true)}>
                    <LockOpenIcon />
                    Logout
                </MenuItem>
            </Menu>
        </Box>
    )
}

export default UserMenu;