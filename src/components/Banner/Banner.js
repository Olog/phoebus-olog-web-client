/**
 * Copyright (C) 2019 European Spallation Source ERIC.
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

import {Link} from "react-router-dom";
import LoginDialog from '../LoginLogout/LoginDialog';
import LogoutDialog from '../LoginLogout/LogoutDialog';
import packageInfo from '../../../package.json';
import SkipToContent from 'components/shared/SkipToContent';
import { AppBar, Toolbar, Typography, Button, styled, Link as MuiLink } from '@mui/material';
import { InternalButtonLink } from "components/shared/InternalLink";
import { useShowLogin, useShowLogout, useUser } from "features/authSlice";
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import customization from "config/customization";

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
/**
 * Banner component with controls to create log entry, log book or tag. Plus
 * button for signing in/out. 
 */
export const Banner = () => {

  const user = useUser();
  const { showLogin, setShowLogin } = useShowLogin();
  const { showLogout, setShowLogout } = useShowLogout();

  const handleClick = () => {
    if(user){
      setShowLogout(true);  
    }
    else{
      setShowLogin(true);
    }
  }

  return (
    <AppBar 
      component={"header"} 
      position="static" 
      sx={{
        backgroundColor: "#343a40"
      }}
    >
      <Toolbar component={"nav"} sx={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between"
      }} >
        <SkipToContent href='#app-content'>Skip to Main Content</SkipToContent>
        <NavHeader>
          <li>
            <MuiLink component={Link} to="/" aria-label='home' sx={{ color: "essWhite.main", textDecoration: "none !important"}}>
              <Typography variant="h6" component="p">{packageInfo.name}</Typography>
              <Typography variant="body2">{packageInfo.version}</Typography>
            </MuiLink>
          </li>
          <li>
            <InternalButtonLink to="/logs/create" variant="contained">
              New Log Entry
            </InternalButtonLink>      
          </li>
        </NavHeader>
        <NavFooter>
          {customization.ENABLE_BETA ? 
            <li>
              <InternalButtonLink
                to="/beta"
                variant="contained"
                aria-label="Navigate to Beta App"
                endIcon={<AutoAwesomeIcon />}
              >
                Try Beta UI! 
              </InternalButtonLink>
            </li> : null
          }
          <li>
            <Button onClick={handleClick} variant="contained" >
              {user?.userName ? user.userName : 'Sign In'}
            </Button>
          </li>
        </NavFooter>
      </Toolbar>
      <LoginDialog 
        setShowLogin={setShowLogin}
        loginDialogVisible={showLogin}
      />
      <LogoutDialog
        setShowLogout={setShowLogout} 
        logoutDialogVisible={showLogout}
      />
    </AppBar>
  )
  
}