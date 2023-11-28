/**
 * Copyright (C) 2020 European Spallation Source ERIC.
 * <p>
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU General Public License
 * as published by the Free Software Foundation; either version 2
 * of the License, or (at your option) any later version.
 * <p>
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 * <p>
 * You should have received a copy of the GNU General Public License
 * along with this program; if not, write to the Free Software
 * Foundation, Inc., 59 Temple Place - Suite 330, Boston, MA  02111-1307, USA.
 */

import { AppBar, Toolbar, Typography, styled, Button, Stack, IconButton } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import Initialize from "components/Initialize";
import { InternalButtonLink } from "components/shared/InternalLink";
import { useShowLogin, useUser } from "features/authSlice";
import React from "react";
import packageInfo from "../../../../../package.json";
import UserMenu from "./UserMenu";
import LoginDialog from "components/LoginLogout/LoginDialog";
import LogoutDialog from "components/LoginLogout/LogoutDialog";
import LockIcon from '@mui/icons-material/Lock';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import HomeIcon from '@mui/icons-material/Home';

const NavHeader = styled("ul")`
  display: flex;
  align-items: center;
  gap: 2rem;
`
const NavFooter = styled("ul")`
  display: flex;
  align-items: center;
  gap: 1rem;
`

const AppNavBar = () => {

    const user = useUser();
    const { setShowLogin } = useShowLogin();

    return (
        <Initialize>
            <AppBar 
            component={"header"} 
            position="static" 
            >
                <Toolbar component={"nav"} sx={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between"
                }} >
                    <NavHeader>
                        <li>
                            <Stack flexDirection="row" gap={1} alignItems="center" >
                                <IconButton component={RouterLink} to="/beta" color="inherit" >
                                    <HomeIcon titleAccess="home" />
                                </IconButton>
                                <Typography variant="h6" component="span" >
                                    {packageInfo.name}
                                    {" "}
                                    <Typography component="span" variant="body2">
                                        {packageInfo.version}
                                    </Typography>
                                </Typography>
                            </Stack>
                        </li>
                    </NavHeader>
                    <NavFooter>
                        <li>
                            { user ? 
                                <InternalButtonLink to="/beta/logs/create" color="inherit" startIcon={<AddCircleIcon />}>
                                    New Entry
                                </InternalButtonLink> : null
                            }
                        </li>
                        <li>
                            { user?.userName 
                                ? <UserMenu user={user} />
                                : <Button onClick={() => setShowLogin(true)} variant="outlined" color="inherit" startIcon={<LockIcon />} >Sign In</Button>
                            }
                        </li>
                    </NavFooter>
                </Toolbar>
                <LoginDialog />
                <LogoutDialog />
            </AppBar>
        </Initialize>
    )
}
export default AppNavBar;