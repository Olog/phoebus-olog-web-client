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

import Button, { buttonBaseStyle } from '../shared/Button';
import {Link} from "react-router-dom";
import LoginDialog from '../LoginLogout/LoginDialog';
import LogoutDialog from '../LoginLogout/LogoutDialog';
import ologService from '../../api/olog-service';
import packageInfo from '../../../package.json';
import styled from 'styled-components';
import { useEffect } from 'react';
import SkipToContent from 'components/shared/SkipToContent';

const Navbar = styled.nav`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  background-color: #343a40;
  color: #fff;
  padding: 1vh 2vw;
`

const NavHeader = styled.ul`
  display: flex;
  align-items: center;
  gap: 1vw;
`

const NavFooter = styled.ul`
  display: flex;
  align-items: center;
`
const PackageName = styled.div`
  font-size: 1.4em;
`
const PackageVersion = styled.div`
  font-size: 0.8em;
`

const NewLogEntryLinkButton = styled(Link)`
  ${buttonBaseStyle}
  background-color: ${({theme}) => theme.colors.primary};
`

/**
 * Banner component with controls to create log entry, log book or tag. Plus
 * button for signing in/out. 
 */
const Banner = ({userData, setUserData, showLogin, setShowLogin, showLogout, setShowLogout, setReplyAction}) => {

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
    <header>
      <Navbar>
        <SkipToContent href='#app-content'>Skip to Main Content</SkipToContent>
        <NavHeader>
          <li><Link to="/" aria-label='home'>
            <PackageName>{packageInfo.name}</PackageName>
            <PackageVersion>{packageInfo.version}</PackageVersion>
          </Link></li>
          <li><NewLogEntryLinkButton to="/edit" >
              New Log Entry
            </NewLogEntryLinkButton></li>
        </NavHeader>
        <NavFooter>
          <li><Button onClick={handleClick} variant="primary">
            {userData.userName ? userData.userName : 'Sign In'}
          </Button></li>
        </NavFooter>
      </Navbar>

      <LoginDialog setUserData={setUserData} 
              setShowLogin={setShowLogin}
              loginDialogVisible={showLogin}/>

      <LogoutDialog setUserData={setUserData} 
                      setShowLogout={setShowLogout} 
                      logoutDialogVisible={showLogout}/>

    </header>
  )
  
}

export default Banner;