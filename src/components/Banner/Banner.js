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
import Button from 'react-bootstrap/Button';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import {Link} from "react-router-dom";
import LoginDialog from '../LoginLogout/LoginDialog';
import LogoutDialog from '../LoginLogout/LogoutDialog';
import { checkSession } from '../../api/olog-service';
import ologService from '../../api/olog-service';
import packageInfo from '../../../package.json';
import Row from 'react-bootstrap/Row';

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
        <Navbar bg="dark" variant="dark" >
          <Navbar.Brand href="/">
            <Row style={{marginLeft: "1px", marginRight: "1px"}}>{packageInfo.name}</Row>
            <Row style={{marginLeft: "1px", marginRight: "1px"}}><span style={{fontSize: "10px  "}}>v{packageInfo.version}</span></Row>
          </Navbar.Brand>
          <Link to="/edit">
            <Button disabled={!this.props.userData.userName} 
              variant="primary" 
              onClick={() => this.handleNewLogEntry()}>New Log Entry</Button>
          </Link>
          <Nav className="justify-content-end" style={{ width: "100%" }}>
            <Button onClick={this.handleClick}>{this.props.userData.userName ? this.props.userData.userName : 'Sign In'}</Button>
          </Nav> 
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