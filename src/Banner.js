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
//import Dropdown from 'react-bootstrap/Dropdown';
import Button from 'react-bootstrap/Button';
//import DropdownMenu from 'react-bootstrap/DropdownMenu';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import {Link} from "react-router-dom";
import AddLogbookDialog from './AddLogbookDialog';
import AddTagDialog from './AddTagDialog';
import LoginDialog from './LoginDialog';
import LogoutDialog from './LogoutDialog';
import checkSession from './session-check';
// Need axios for back-end access as the "fetch" API does not support CORS cookies.
import axios from 'axios';
import {name, version} from '../package.json';
import Row from 'react-bootstrap/Row';

/**
 * Banner component with controls to create log entry, log book or tag. Plus
 * button for signing in/out. 
 */
class Banner extends Component {

  state = {
    showLogin: false,
    showLogout: false,
    showAddLogbook: false,
    showAddTag: false
  }

  componentDidMount() {

    // Try to get user data from back-end.
    // If server returns user data with non-null userName, there is a valid session.
    axios.get(`${process.env.REACT_APP_BASE_URL}/user`, { withCredentials: true })
        .then(res => {
            // As long as there is a session cookie, the response SHOULD contain
            // user data. Check for status just in case...
            if(res.status === 200 && res.data){ 
                this.props.setUserData(res.data);
            }
            else if(res.status === 404){
              this.props.setUserData({userName: "", roles: []});
            }
        }).catch(err => {/** TODO: handle connection error */});
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

  setShowLogin = (show) => {
    this.setState({showLogin: show});
  } 

  setShowLogout = (show) => {
    this.setState({showLogout: show});
  }   

  handleClick = () => {
    if(!this.props.userData.userName){
        this.setShowLogin(true);
    }
    else{
        this.setShowLogout(true);
    }
  }

  render(){
    return (
      <>
        <Navbar bg="dark" variant="dark">
          <Navbar.Brand href="/">
            <Row style={{marginLeft: "1px", marginRight: "1px"}}>{name}</Row>
            <Row style={{marginLeft: "1px", marginRight: "1px"}}><span style={{fontSize: "10px  "}}>v{version}</span></Row>
          </Navbar.Brand>
          <Link to="/edit">
            <Button disabled={!this.props.userData.userName} 
              variant="primary" 
              onClick={() => this.handleNewLogEntry()}>New Log Entry</Button>
          </Link>
          {/*<Dropdown>
            <Dropdown.Toggle disabled={!this.props.userData.userName}/>
            <DropdownMenu alignRight="true">
              <Dropdown.Item onClick={() => this.setShowAddLogbook(true)}>New Logbook</Dropdown.Item>
              <Dropdown.Item onClick={() => this.setShowAddTag(true)}>New Tag</Dropdown.Item>
            </DropdownMenu>
          </Dropdown>*/}
          <Nav className="justify-content-end" style={{ width: "100%" }}>
            <Button onClick={this.handleClick}>{this.props.userData.userName ? this.props.userData.userName : 'Sign In'}</Button>
          </Nav> 
        </Navbar>

        <LoginDialog setUserData={this.props.setUserData} 
                setShowLogin={this.setShowLogin}
                loginDialogVisible={this.state.showLogin}/>

        <LogoutDialog setUserData={this.props.setUserData} 
                        setShowLogout={this.setShowLogout} 
                        logoutDialogVisible={this.state.showLogout}/>

        <AddLogbookDialog addLogbookDialogVisible={this.state.showAddLogbook} 
                        setShowAddLogbook={this.setShowAddLogbook} 
                        refreshLogbooks={this.props.refreshLogbooks}/>

        <AddTagDialog addTagDialogVisible={this.state.showAddTag} 
                setShowAddTag={this.setShowAddTag} 
                refreshTags={this.props.refreshTags}/>
      </>
    )
  }
}

export default Banner;