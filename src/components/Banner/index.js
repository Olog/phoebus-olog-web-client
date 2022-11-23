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

import React, { Component} from 'react'
// import Button from 'react-bootstrap/Button';
import Button from '../common/Button';
// import Navbar from 'react-bootstrap/Navbar';
// import Nav from 'react-bootstrap/Nav';
import {Link} from "react-router-dom";
import LoginDialog from '../LoginLogout/LoginDialog';
import LogoutDialog from '../LoginLogout/LogoutDialog';
import { checkSession } from '../../api/olog-service';
import ologService from '../../api/olog-service';
import packageInfo from '../../../package.json';
// import Row from 'react-bootstrap/Row';
import styled from 'styled-components';

const Navbar = styled.nav`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  background-color: #343a40;
  color: #fff;
  padding: 1vh 2vw;
`

const NavHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 1vw;
`

const NavFooter = styled.div`
  display: flex;
  align-items: center;
`
const PackageName = styled.h1`
  font-size: 1.4em;
`
const PackageVersion = styled.h2`
  font-size: 0.8em;
`

/**
 * Banner component with controls to create log entry, log book or tag. Plus
 * button for signing in/out. 
 */
class Banner extends Component {

  state = {
    showAddLogbook: false,
    showAddTag: false
  }

  componentDidMount() {

    // Try to get user data from back-end.
    // If server returns user data with non-null userName, there is a valid session.
    ologService.get('/user', { withCredentials: true })
        .then(res => {
            // As long as there is a session cookie, the response SHOULD contain
            // user data. Check for status just in case...
            if(res.status === 200 && res.data){ 
                this.props.setUserData(res.data);
            }
        }).catch(err => {
          if(err.response && err.response.status === 404){
            this.props.setUserData({userName: "", roles: []});
          }
        });
  } 


  handleNewLogEntry = () => {
    
    var promise = checkSession();
    if(!promise){
      this.props.setShowLogin(true);
    }
    else{
      promise.then(data => {
        if(!data){
          this.props.setShowLogin(true);
        }
        else{
          this.props.setReplyAction(false);
        }
      });
    }
  }

  setShowAddLogbook = (show) => {
    this.setState({showAddLogbook: show});
  }

  setShowAddTag = (show) => {
    this.setState({showAddTag: show});
  }

  handleClick = () => {
    if(!this.props.userData.userName){
        this.props.setShowLogin(true);
    }
    else{
        this.props.setShowLogout(true);
    }
  }

  render(){
    return (
      <>
        <Navbar>
          <NavHeader>
            <Link to="/">
              <PackageName>{packageInfo.name}</PackageName>
              <PackageVersion>{packageInfo.version}</PackageVersion>
            </Link>
            <Link to="/edit">
              <Button disabled={!this.props.userData.userName} 
                variant='primary'
                onClick={() => this.handleNewLogEntry()}>New Log Entry</Button>
            </Link>
          </NavHeader>
          <NavFooter>
            <Button onClick={this.handleClick} variant="primary">
              {this.props.userData.userName ? this.props.userData.userName : 'Sign In'}
            </Button>
          </NavFooter>
        </Navbar>

        <LoginDialog setUserData={this.props.setUserData} 
                setShowLogin={this.props.setShowLogin}
                loginDialogVisible={this.props.showLogin}/>

        <LogoutDialog setUserData={this.props.setUserData} 
                        setShowLogout={this.props.setShowLogout} 
                        logoutDialogVisible={this.props.showLogout}/>

      </>
    )
  }
}

export default Banner;