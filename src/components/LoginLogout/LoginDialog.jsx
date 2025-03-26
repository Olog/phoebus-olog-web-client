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

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Alert, Button, Stack } from "@mui/material";
import Modal from "../shared/Modal";
import { TextInput } from "components/shared/input/TextInput";
import { ologApi } from "api/ologApi";
import { useShowLogin } from "features/authSlice";

const LoginDialog = () => {
  const { control, handleSubmit, reset, resetField, setFocus } = useForm();
  const [loginErrorMessage, setLoginErrorMessage] = useState("");
  const [login, { isSuccess, error }] = ologApi.endpoints.login.useMutation();
  const { showLogin, setShowLogin } = useShowLogin();

  const closeAndReset = () => {
    setLoginErrorMessage("");
    setShowLogin(false);
    // clear form data
    reset();
  };

  const handleLogin = (data) => {
    const { username, password } = data;
    login({ username, password });
  };

  // close the window if login was successful
  useEffect(() => {
    if (isSuccess) {
      reset();
      setLoginErrorMessage("");
      setShowLogin(false);
    }
  }, [isSuccess, setShowLogin, reset]);

  // set error message on errors
  useEffect(() => {
    if (error) {
      if (error.status === "FETCH_ERROR") {
        setLoginErrorMessage("Login failed. Unable to connect to service.");
      }
      if (error.status === 401) {
        setLoginErrorMessage("Login failed, invalid credentials.");
      }
      // clear bad creds field & bring focus to it
      resetField("password");
      resetField("username");
    }
  }, [error, resetField, setFocus]);

  // reset the form when re-shown
  useEffect(() => {
    if (showLogin) {
      reset();
    }
  }, [reset, showLogin]);

  return (
    <Modal
      open={showLogin}
      onClose={closeAndReset}
      title="Sign In"
      content={
        <Stack
          component="form"
          onSubmit={handleSubmit(handleLogin)}
          gap={2}
          marginY={2}
        >
          <TextInput
            name="username"
            label="Username"
            control={control}
            defaultValue=""
            sx={{
              "& .MuiFormLabel-root": {
                fontSize: "1rem",
                top: "-4px"
              },
              "& .MuiInputBase-input": {
                padding: "14px 12px",
                fontSize: "1rem"
              }
            }}
          />
          <TextInput
            name="password"
            label="Password"
            control={control}
            defaultValue=""
            inputProps={{ type: "password" }}
            sx={{
              "& .MuiFormLabel-root": {
                fontSize: "1rem",
                top: "-4px"
              },
              "& .MuiInputBase-input": {
                padding: "14px 12px",
                fontSize: "1rem"
              }
            }}
          />
          {/* Hidden button handles submit-on-enter automatically */}
          <Button
            type="submit"
            hidden
            tabIndex={-1}
          />
          {loginErrorMessage ? (
            <Alert severity="error">{loginErrorMessage}</Alert>
          ) : null}
        </Stack>
      }
      actions={
        <>
          <Button
            variant="outlined"
            type="button"
            onClick={closeAndReset}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            type="submit"
            onClick={handleSubmit(handleLogin)}
          >
            Login
          </Button>
        </>
      }
    />
  );
};

export default LoginDialog;
