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

import React, {useState} from 'react'
import Dropdown from 'react-bootstrap/Dropdown';
import Button from 'react-bootstrap/Button';
import DropdownMenu from 'react-bootstrap/DropdownMenu';
import Navbar from 'react-bootstrap/Navbar';
import Login from './Login';
import Nav from 'react-bootstrap/Nav';
import LoginDialog from './LoginDialog';
import LogoutDialog from './LogoutDialog';
import AddLogbookDialog from './AddLogbookDialog';
import AddTagDialog from './AddTagDialog';
import {
  Link
} from "react-router-dom";

const Banner = (props) => {

  
  const [showLoginDialog, setShowLoginDialog] = useState(false);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const [showAddLogbookDialog, setShowAddLogbookDialog] = useState(false);
  const [showAddTagDialog, setShowAddTagDialog] = useState(false);

  const showLogin = (show) => {
    setShowLoginDialog(show);
  }

  const showLogout = (show) => {
    setShowLogoutDialog(show);
  }

  const showAddLogbook = () => {
    setShowAddLogbookDialog(true);
  }

  const showAddTag = () => {
    setShowAddTagDialog(true);
  }

  const hideAddLogbook = () => {
    setShowAddLogbookDialog(false);
  }

  const hideAddTag = () => {
    setShowAddTagDialog(false);
  }

  return (
    <>
      <Navbar bg="dark" variant="dark">
        <Navbar.Brand href="#home">Olog ES</Navbar.Brand>
        <Link to="/edit">
          <Button disabled={!props.userData.userName} variant="primary">New Log Entry</Button>
        </Link>
        <Dropdown>
          <Dropdown.Toggle disabled={!props.userData.userName}/>
          <DropdownMenu alignRight="true">
            <Dropdown.Item onClick={showAddLogbook}>New Logbook</Dropdown.Item>
            <Dropdown.Item onClick={showAddTag}>New Tag</Dropdown.Item>
          </DropdownMenu>
        </Dropdown>
        <Nav className="justify-content-end" style={{ width: "100%" }}>
          <Login userData={props.userData} showLogin={showLogin} showLogout={showLogout}/>
        </Nav> 
      </Navbar>

      <LoginDialog setUserData={props.setUserData} 
        showLoginDialog={showLoginDialog} 
        showLogin={showLogin}/>
      <LogoutDialog setUserData={props.setUserData} 
        showLogoutDialog={showLogoutDialog} 
        showLogout={showLogout}/>
      <AddLogbookDialog showAddLogbookDialog={showAddLogbookDialog} 
        hideAddLogbook={hideAddLogbook} 
        refreshLogbooks={props.refreshLogbooks}/>
      <AddTagDialog showAddTagDialog={showAddTagDialog} 
        hideAddTag={hideAddTag} 
        refreshTags={props.refreshTags}/>

    </>
  )
}

export default Banner