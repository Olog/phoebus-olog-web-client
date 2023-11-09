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
import ologService from '../../api/olog-service';
import packageInfo from '../../../package.json';
import { useEffect } from 'react';
import SkipToContent from 'components/shared/SkipToContent';
import { AppBar, Toolbar, Typography, Button, styled, Link as MuiLink } from '@mui/material';
import { InternalButtonLink } from "components/shared/InternalLink";

const NavHeader = styled("ul")`
  display: flex;
  align-items: center;
  gap: 2rem;
`
const NavFooter = styled("ul")`
  display: flex;
  align-items: center;
`
/**
 * Banner component with controls to create log entry, log book or tag. Plus
 * button for signing in/out. 
 */
export const Banner = ({userData, setUserData, showLogin, setShowLogin, showLogout, setShowLogout}) => {

  useEffect(() => {

    // Try to get user data from back-end.
    // If server returns user data with non-null userName, there is a valid session.
    const signal = new AbortController();
    ologService.get('/user', { withCredentials: true, signal})
        .then(res => {
            // As long as there is a session cookie, the response SHOULD contain
            // user data. Check for status just in case...
            if(res.status === 200 && res.data){ 
                setUserData(res.data);
            }
        }).catch(err => {
          if(err.response && err.response.status === 404){
            setUserData({userName: "", roles: []});
          }
        });

    return () => {
      signal.abort();
    }
  }, [setUserData])

  const handleClick = () => {
    if(!userData.userName){
        setShowLogin(true);
    }
    else{
        setShowLogout(true);
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
            <InternalButtonLink to="/logs/create" variant="contained" >
              New Log Entry
            </InternalButtonLink>      
          </li>
        </NavHeader>
        <NavFooter>
          <li>
            <Button onClick={handleClick} variant="contained" >
              {userData?.userName ? userData.userName : 'Sign In'}
            </Button>
          </li>
        </NavFooter>
      </Toolbar>
      <LoginDialog setUserData={setUserData} 
        setShowLogin={setShowLogin}
        loginDialogVisible={showLogin}
      />
      <LogoutDialog setUserData={setUserData} 
        setShowLogout={setShowLogout} 
        logoutDialogVisible={showLogout}
      />
    </AppBar>
  )
  
}