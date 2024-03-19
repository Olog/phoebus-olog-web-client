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
import { AppBar, Toolbar, Typography, Button, Link as MuiLink, List, ListItem, Stack, Box } from '@mui/material';
import { InternalButtonLink } from "components/shared/InternalLink";
import { useShowLogin, useShowLogout, useUser } from "features/authSlice";
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import customization from "config/customization";

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
      elevation={0}
      sx={{
        backgroundColor: "primary",
        width: "100%"
      }}
    >
      <SkipToContent href='#app-content'>Skip to Main Content</SkipToContent>
      <Toolbar sx={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        flexWrap: "wrap"
      }} >
        <Box component="nav" aria-label="app menu" >
          <List sx={{ 
            display: "flex",
            padding: 0
          }}>
            <ListItem display="flex">
              <MuiLink component={Link} to="/" aria-label='home' sx={{ color: "ologWhite.main", textDecoration: "none !important"}}>
                <Typography variant="h6" component="p">{packageInfo.name}</Typography>
                <Typography variant="body2">{packageInfo.version}</Typography>
              </MuiLink>
            </ListItem>
            <ListItem>
              <InternalButtonLink to="/logs/create" variant="outlined" color="ologWhite">
                New Log Entry
              </InternalButtonLink>
            </ListItem>
          </List>
        </Box>
        <Stack flexDirection="row" alignItems="center" >
          {customization.ENABLE_BETA ? 
            <Box aria-label="beta menu" width="100%">
              <List sx={{ padding: 0 }}>
                <ListItem>
                  <InternalButtonLink
                    to="/beta"
                    variant="outlined"
                    color="ologWhite"
                    aria-label="Navigate to Beta App"
                    endIcon={<AutoAwesomeIcon />}
                  >
                    Try Beta UI! 
                  </InternalButtonLink>
                </ListItem>
              </List>
            </Box> : null
          }
          <nav aria-label="user menu">
            <List>
              <ListItem>
                <Button onClick={handleClick} variant="outlined" color="ologWhite" sx={{ whiteSpace: "nowrap" }} >
                  {user?.userName ? user.userName : 'Sign In'}
                </Button>
              </ListItem>
            </List>
          </nav>
        </Stack>
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