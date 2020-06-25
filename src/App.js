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

import React, { Component } from 'react'
import Banner from './Banner'
import Logbooks from './Logbooks'
import Form from 'react-bootstrap/Form'
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
// Need axios for back-end access as the "fetch" API does not support CORS cookies.
import axios from 'axios'

/**
 * Top level component that defines application state. It also handles 
 * login/logout UI and logic.
 */
class App extends Component {

  state = {
    logbooks: [],
    userData: {userName: "", roles: []},
    showLogin: false,
    loginError: "",
    showLogout: false,
    logoutError: "",
    showCreateLogbook: false
  }

  userNameRef = React.createRef();
  passwordRef = React.createRef();

  create = (what, name) => {
    if(what === 'Logbook'){
      this.createLogbook(name);
    }
    else if(what === 'Tag'){
      this.createTag(name);
    }
  };

  createLogbook = (name) => {
    // TODO add error handling if request fails.
   axios.put(`${process.env.REACT_APP_BASE_URL}/Olog/logbooks/` + name, {name: name, state: "Active"}, { withCredentials: true })
    .then(res => {
      this.setState(prevState => ({logbooks: [...prevState.logbooks, res.data]}));
    });
  };

  createTag = (name) => {

  };

  componentDidMount() {

    fetch(`${process.env.REACT_APP_BASE_URL}/Olog/logbooks`)
      .then(response => response.json())
      .then(data => this.setState({logbooks: data}))

    fetch(`${process.env.REACT_APP_BASE_URL}/user`)
      .then(data => this.setState({userData : data}))
  }

  showLogin = () => {
    this.setState({showLogin: true, loginError: ""});
  }

  hideLogin = () => {
    this.setState({showLogin: false});
  }

  showLogout= () => {
    this.setState({showLogout: true, logoutError: ""});
  }

  hideLogout = () => {
    this.setState({showLogout: false});
  }


  login = (event) => {
    event.preventDefault();
    var formData = new FormData();
    formData.append("username", this.userNameRef.current.value);
    formData.append("password", this.passwordRef.current.value);
   
     axios.post(`${process.env.REACT_APP_BASE_URL}/login`, formData,  { withCredentials: true })
     .then(res => {
      console.log(res);
      console.log(res.data);
      this.setState({loginError: "", userData: res.data});
      this.hideLogin();
    });
  }

  logout = (event) => {
    event.preventDefault();
    fetch(`${process.env.REACT_APP_BASE_URL}/logout`)
    .then(response => {
        this.setState({logoutError: "", userData: {}});
        this.hideLogout();
      })
    .catch(error => {
      // In case service is unavaliable...
      this.setState({logoutError: "Logout Failed. Service off-line?"});
    })
  }

  render() {

    const failureStyle = {
      color: "red",
      marginTop: "10px",
      marginLeft: "2px"
    };

    return (
      <div>
        <Banner userData={this.state.userData}  create={this.create} showLogin={this.showLogin} showLogout={this.showLogout} />
        <Logbooks logbooks={this.state.logbooks}/>

        <Modal centered show={this.state.showLogin} onHide={this.hideLogin}>
          <Modal.Body>
            <Form onSubmit={this.login}>
              <Form.Group controlId="formLogin">
                <Form.Control type="text" placeholder="Username" ref={this.userNameRef} />
              </Form.Group>
              <Form.Group controlId="formBasicPassword">
                <Form.Control type="password" placeholder="Password" ref={this.passwordRef}/>
              </Form.Group>
              <Button variant="primary" type="submit">
                Login
              </Button>
              <Button variant="secondary" onClick={this.hideLogin}>
                Cancel
              </Button>
            </Form>
            <Form.Label style={failureStyle}>{this.state.loginError}</Form.Label>
          </Modal.Body>
        </Modal>

        <Modal centered show={this.state.showLogout} onHide={this.hideLogout}>
          <Modal.Body>
            <Form onSubmit={this.logout}>
              <Form.Label>Logout?</Form.Label>
              <Form.Group></Form.Group>
              <Button variant="primary" type="submit">
                Yes
              </Button>
              <Button variant="secondary" onClick={this.hideLogout}>
                No
              </Button>
            </Form>
            <Form.Label style={failureStyle}>{this.state.logoutError}</Form.Label>
          </Modal.Body>
        </Modal>
      </div>
    )
  }
}

export default App