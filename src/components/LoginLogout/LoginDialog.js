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
import Modal from '../shared/Modal';
import Button from 'components/shared/Button';
import ologService from 'api/olog-service';
import { useForm } from 'react-hook-form';
import TextInput from 'components/shared/input/TextInput';
import ErrorMessage from 'components/shared/input/ErrorMessage';
import Submit from 'components/shared/input/Submit';
import { Stack } from '@mui/material';

const LoginDialog = ({setUserData, setShowLogin, loginDialogVisible}) => {

  const {control, handleSubmit, reset, resetField, setFocus} = useForm();
  const [loginError, setLoginError] = useState('');

  const closeAndReset = () => {
      setLoginError("");
      setShowLogin(false);
      // clear form data
      reset();
  }

  const login = (data) => {
    
    const formData = new FormData();
    formData.append("username", data.username);
    formData.append("password", data.password);
    
    ologService.post('/login', formData,  { withCredentials: true })
    .then(res => {
        setLoginError("");
        setUserData(res.data);
        closeAndReset();
    })
    .catch((error) => {
      console.error({error})
      if(!error.response){
        setLoginError("Login failed. Unable to connect to service.");
      }
      if(error.response.status === 401) {
        setLoginError("Login failed, invalid credentials.");
      }
      // clear bad creds field
      resetField("password");
      setFocus('password', {shouldSelect: true});
    });
  }
  
  return(
    <Modal 
      open={loginDialogVisible} 
      onClose={closeAndReset} 
      title="Sign In"
      content={
        <Stack component="form" onSubmit={handleSubmit(login)} gap={1} marginY={2}>
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
            inputProps={{type: "password"}}
          />
          <ErrorMessage error={loginError} />
        </Stack>
      }
      actions={
        <>
          <Button variant="primary" type="submit" onClick={handleSubmit(login)}>
            Login
          </Button>
          <Button variant="secondary" type="button" onClick={closeAndReset}>
            Cancel
          </Button>        
        </>
      }
    />
  )
}

export default LoginDialog;
