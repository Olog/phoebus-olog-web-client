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

import React, { Component } from 'react';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

// Need axios for back-end access as the "fetch" API does not support CORS cookies.
import axios from 'axios'

import './css/olog.css';

class LoginDialog extends Component{

    state = {
        loginError: ""
    };

    userNameRef = React.createRef();
    passwordRef = React.createRef();

    hideLogin = () => {
        this.setState({loginError: ""});
        this.props.setShowLogin(false);
    }

    login = (event) => {
        event.preventDefault();
        var formData = new FormData();
        formData.append("username", this.userNameRef.current.value);
        formData.append("password", this.passwordRef.current.value);
       
        axios.post(`${process.env.REACT_APP_BASE_URL}/login`, formData,  { withCredentials: true })
         .then(res => {
            this.setState({loginError: ""});
            this.props.setUserData(res.data);
            this.hideLogin();
           }, error => { 
             if(!error.response){
              this.setState({loginError: "Login failed. Unable to connect to service."})
             }
             else if(error.response.status === 401){
              this.setState({loginError: "Login failed, invalid credentials."})
             }
         });
    }
    
    render(){
        return(
            <Modal show={this.props.loginDialogVisible} centered onHide={this.hideLogin}>
            <Modal.Header closeButton>
              <Modal.Title>Sign In</Modal.Title>
            </Modal.Header>
            <Form>
              <Modal.Body>
                <Form.Group controlId="formLogin">
                  <Form.Control  type="text" placeholder="Username" ref={this.userNameRef} />
                </Form.Group>
                <Form.Group controlId="formBasicPassword">
                  <Form.Control type="password" placeholder="Password" ref={this.passwordRef}/>
                </Form.Group>
                <Form.Label className="failureStyle">{this.state.loginError}</Form.Label>
              </Modal.Body>
              <Modal.Footer>
                <Button variant="primary" type="submit" onClick={this.login}>
                      Sign In
                </Button>
                <Button variant="secondary" type="button" onClick={this.hideLogin}>
                      Cancel
                </Button>
              </Modal.Footer>
            </Form>
          </Modal>
        )
    }
}

export default LoginDialog;
