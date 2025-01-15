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
import { Alert, Button, Stack, Typography } from "@mui/material";
import Modal from "components/shared/Modal";
import { ologApi } from "api/ologApi";
import { useShowLogout } from "features/authSlice";

const LogoutDialog = () => {
  const [logoutErrorMessage, setLogoutErrorMessage] = useState("");
  const [logout, { isSuccess, error }] = ologApi.endpoints.logout.useMutation();
  const { showLogout, setShowLogout } = useShowLogout();

  const hideLogout = () => {
    setLogoutErrorMessage("");
    setShowLogout(false);
  };

  // On logout success, close dialog
  useEffect(() => {
    if (isSuccess) {
      setShowLogout(false);
    }
  }, [isSuccess, setShowLogout]);

  // On error, update error message
  useEffect(() => {
    if (error) {
      if (error.status === "FETCH_ERROR") {
        setLogoutErrorMessage("Logout failed. Unable to connect to service.");
      }
    }
  }, [error]);

  return (
    <Modal
      open={showLogout}
      onClose={hideLogout}
      title="Log out?"
      content={
        <Stack
          component="form"
          gap={1}
          paddingY={1}
        >
          <Typography>Would you like to logout?</Typography>
          {logoutErrorMessage ? (
            <Alert severity="error">{logoutErrorMessage}</Alert>
          ) : null}
        </Stack>
      }
      actions={
        <>
          <Button
            variant="outlined"
            onClick={hideLogout}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={logout}
          >
            Logout
          </Button>
        </>
      }
      DialogProps={{
        maxWidth: "sm"
      }}
    />
  );
};

export default LogoutDialog;
