import React, { useState } from "react";
import { Button, ButtonGroup, Menu, MenuItem } from "@mui/material";
import ReplyIcon from '@mui/icons-material/Reply';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import EditIcon from '@mui/icons-material/Edit';
import { Link } from "react-router-dom";
import { useUser } from "features/authSlice";
import CopyUrlButton from "./CopyUrlButton";

const MenuItemLink = ({children, to}) => {
    return (
        <MenuItem disableRipple component={Link} to={to} sx={{ display: "flex", gap: 1}}>
            {children}
        </MenuItem>
    )
}

const LogDetailActionButton = ({log}) => {

    const user = useUser();

    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const onClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const onClose = () => {
        setAnchorEl(null);
    };

    return (
        <ButtonGroup variant="outlined">
            <CopyUrlButton url={`${window.location.origin}/beta/logs/${log.id}`} />
            {user ? 
                <>
                    <Button
                        id="log-detail-action-button"
                        aria-controls={open ? "log-detail-action-menu" : undefined}
                        aria-haspopup="true"
                        aria-expanded={open ? "true" : undefined}
                        onClick={onClick}
                        variant="outlined"
                    >
                        <ExpandMoreIcon />
                    </Button>
                    <Menu
                        id="log-detail-action-menu"
                        anchorEl={anchorEl}
                        open={open}
                        onClose={onClose}
                    >
                        <MenuItemLink to={`/beta/logs/${log.id}/reply`} >
                            <ReplyIcon />
                            Reply
                        </MenuItemLink>
                        <MenuItemLink to={`/beta/logs/${log.id}/edit`} >
                            <EditIcon />
                            Edit
                        </MenuItemLink>
                    </Menu>
                </> : null
            }
        </ButtonGroup>
    )
}

export default LogDetailActionButton;