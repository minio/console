// This file is part of MinIO Console Server
// Copyright (c) 2021 MinIO, Inc.
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU Affero General Public License for more details.
//
// You should have received a copy of the GNU Affero General Public License
// along with this program.  If not, see <http://www.gnu.org/licenses/>.

import React, { useState } from "react";

import { Theme } from "@mui/material/styles";
import createStyles from "@mui/styles/createStyles";
import withStyles from "@mui/styles/withStyles";
import ModalWrapper from "../Common/ModalWrapper/ModalWrapper";
import Grid from "@mui/material/Grid";
import InputBoxWrapper from "../Common/FormComponents/InputBoxWrapper/InputBoxWrapper";
import { Button, LinearProgress } from "@mui/material";
import {
  containerForHeader,
  formFieldStyles,
  modalStyleUtils,
  spacingUtils,
} from "../Common/FormComponents/common/styleLibrary";
import { ChangePasswordRequest } from "../Buckets/types";
import { ErrorResponseHandler } from "../../../common/types";
import api from "../../../common/api";
import { ChangePasswordIcon } from "../../../icons";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { setModalErrorSnackMessage } from "../../../systemSlice";
import { useAppDispatch } from "../../../store";

const styles = (theme: Theme) =>
  createStyles({
    ...modalStyleUtils,
    ...formFieldStyles,
    ...spacingUtils,
    ...containerForHeader(theme.spacing(4)),
  });

interface IChangePasswordProps {
  classes: any;
  open: boolean;
  closeModal: () => void;
}

const ChangePassword = ({
  classes,
  open,
  closeModal,
}: IChangePasswordProps) => {
  const dispatch = useAppDispatch();
  const [currentPassword, setCurrentPassword] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [reNewPassword, setReNewPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const userLoggedIn = localStorage.getItem("userLoggedIn") || "";

  const changePassword = (event: React.FormEvent) => {
    event.preventDefault();

    if (newPassword !== reNewPassword) {
      dispatch(
        setModalErrorSnackMessage({
          errorMessage: "New passwords don't match",
          detailedError: "",
        })
      );
      return;
    }

    if (newPassword.length < 8) {
      dispatch(
        setModalErrorSnackMessage({
          errorMessage: "Passwords must be at least 8 characters long",
          detailedError: "",
        })
      );
      return;
    }

    if (loading) {
      return;
    }
    setLoading(true);

    let request: ChangePasswordRequest = {
      current_secret_key: currentPassword,
      new_secret_key: newPassword,
    };

    api
      .invoke("POST", "/api/v1/account/change-password", request)
      .then(() => {
        setLoading(false);
        setNewPassword("");
        setReNewPassword("");
        setCurrentPassword("");
        closeModal();
      })
      .catch((err: ErrorResponseHandler) => {
        setLoading(false);
        setNewPassword("");
        setReNewPassword("");
        setCurrentPassword("");
        dispatch(setModalErrorSnackMessage(err));
      });
  };

  return open ? (
    <ModalWrapper
      title={`Change Password for ${userLoggedIn}`}
      modalOpen={open}
      onClose={() => {
        setNewPassword("");
        setReNewPassword("");
        setCurrentPassword("");
        closeModal();
      }}
      titleIcon={<ChangePasswordIcon />}
    >
      <div>
        This will change your Console password. Please note your new password
        down, as it will be required to log into Console after this session.
      </div>
      <form
        noValidate
        autoComplete="off"
        onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
          changePassword(e);
        }}
      >
        <Grid container>
          <Grid item xs={12} className={classes.modalFormScrollable}>
            <Grid item xs={12} className={classes.formFieldRow}>
              <InputBoxWrapper
                id="current-password"
                name="current-password"
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  setCurrentPassword(event.target.value);
                }}
                label="Current Password"
                type={showPassword ? "text" : "password"}
                value={currentPassword}
                overlayAction={() => setShowPassword(!showPassword)}
                overlayIcon={
                  showPassword ? <VisibilityOffIcon /> : <RemoveRedEyeIcon />
                }
              />
            </Grid>
            <Grid item xs={12} className={classes.formFieldRow}>
              <InputBoxWrapper
                id="new-password"
                name="new-password"
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  setNewPassword(event.target.value);
                }}
                label="New Password"
                type={showPassword ? "text" : "password"}
                value={newPassword}
                overlayAction={() => setShowPassword(!showPassword)}
                overlayIcon={
                  showPassword ? <VisibilityOffIcon /> : <RemoveRedEyeIcon />
                }
              />
            </Grid>
            <Grid item xs={12} className={classes.formFieldRow}>
              <InputBoxWrapper
                id="re-new-password"
                name="re-new-password"
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  setReNewPassword(event.target.value);
                }}
                label="Type New Password Again"
                type={showPassword ? "text" : "password"}
                value={reNewPassword}
                overlayAction={() => setShowPassword(!showPassword)}
                overlayIcon={
                  showPassword ? <VisibilityOffIcon /> : <RemoveRedEyeIcon />
                }
              />
            </Grid>
          </Grid>
          <Grid item xs={12} className={classes.modalButtonBar}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={
                loading ||
                !(
                  currentPassword.length > 0 &&
                  newPassword.length > 0 &&
                  reNewPassword.length > 0
                )
              }
            >
              Save
            </Button>
          </Grid>
          {loading && (
            <Grid item xs={12}>
              <LinearProgress />
            </Grid>
          )}
        </Grid>
      </form>
    </ModalWrapper>
  ) : null;
};

export default withStyles(styles)(ChangePassword);
