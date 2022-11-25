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

import React, { useState } from 'react';
import Modal, { Body, Footer, Header, Title } from '../common/Modal';
import Button from '../common/Button';
import ologService from '../../api/olog-service';
import '../../css/olog.css';
import { useForm } from 'react-hook-form';
import TextInput from '../input/TextInput';
import ErrorMessage from '../input/ErrorMessage';
import styled from 'styled-components';
import Submit from '../input/Submit';

const Form = styled.form`

`

const LoginDialog = ({setUserData, setShowLogin, loginDialogVisible}) => {

  const {control, handleSubmit, reset} = useForm();
  const [loginError, setLoginError] = useState('');

  const hideLogin = () => {
      setLoginError("");
      setShowLogin(false);
      // clear form data
      reset();
  }

  const login = (data) => {
    
    console.log(data)
    const formData = new FormData();
    formData.append("username", data.username);
    formData.append("password", data.password);
    
    ologService.post('/login', formData,  { withCredentials: true })
    .then(res => {
      setLoginError("");
      setUserData(res.data);
      hideLogin();
      }, error => { 
        if(!error.response){
          setLoginError("Login failed. Unable to connect to service.");
        }
        else if(error.response.status === 401) {
          setLoginError("Login failed, invalid credentials.");
        }
        // clear form data
        reset();
    })
    .then(() => {
      // clear form data
      reset();
    })
  }
  
  return(

    <Modal show={loginDialogVisible} onClose={hideLogin}>
      <Header onClose={hideLogin} >
        <Title>Sign In</Title>
      </Header>
      <Body>
        <Form onSubmit={handleSubmit(login)}>
          {/* Hidden button handles submit-on-enter automatically */}
          <Submit hidden />
          <TextInput 
            name='username'
            label='Username'
            control={control}
            defaultValue=''
          />
          <TextInput 
            name='password'
            label='Password'
            control={control}
            defaultValue=''
            password
          />
          <ErrorMessage error={loginError} />
        </Form>
      </Body>
      <Footer>
        <Button variant="primary" type="submit" onClick={handleSubmit(login)}>
          Sign In
        </Button>
        <Button variant="secondary" type="button" onClick={hideLogin}>
          Cancel
        </Button>
      </Footer>
    </Modal>
  )
}

export default LoginDialog;
