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
import { Button, ChangePasswordIcon } from "mds";
import { Theme } from "@mui/material/styles";
import createStyles from "@mui/styles/createStyles";
import withStyles from "@mui/styles/withStyles";
import ModalWrapper from "../Common/ModalWrapper/ModalWrapper";
import Grid from "@mui/material/Grid";
import InputBoxWrapper from "../Common/FormComponents/InputBoxWrapper/InputBoxWrapper";
import { LinearProgress } from "@mui/material";
import {
  containerForHeader,
  formFieldStyles,
  modalStyleUtils,
  spacingUtils,
} from "../Common/FormComponents/common/styleLibrary";
import { ChangeUserPasswordRequest } from "../Buckets/types";

import { ErrorResponseHandler } from "../../../common/types";
import api from "../../../common/api";
import { setModalErrorSnackMessage } from "../../../systemSlice";
import { useAppDispatch } from "../../../store";

const styles = (theme: Theme) =>
  createStyles({
    buttonContainer: {
      textAlign: "right",
    },
    ...modalStyleUtils,
    ...formFieldStyles,
    ...spacingUtils,
    ...containerForHeader(theme.spacing(4)),
  });

interface IChangeUserPasswordProps {
  classes: any;
  open: boolean;
  userName: string;
  closeModal: () => void;
}

const ChangeUserPassword = ({
  classes,
  open,
  userName,
  closeModal,
}: IChangeUserPasswordProps) => {
  const dispatch = useAppDispatch();
  const [newPassword, setNewPassword] = useState<string>("");
  const [reNewPassword, setReNewPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const changeUserPassword = (event: React.FormEvent) => {
    event.preventDefault();

    if (loading) {
      return;
    }
    setLoading(true);

    if (newPassword.length < 8) {
      dispatch(
        setModalErrorSnackMessage({
          errorMessage: "Passwords must be at least 8 characters long",
          detailedError: "",
        })
      );
      setLoading(false);
      return;
    }

    let request: ChangeUserPasswordRequest = {
      selectedUser: userName,
      newSecretKey: newPassword,
    };

    api
      .invoke("POST", "/api/v1/account/change-user-password", request)
      .then((res) => {
        setLoading(false);
        setNewPassword("");
        setReNewPassword("");
        closeModal();
      })
      .catch((err: ErrorResponseHandler) => {
        setLoading(false);
        setNewPassword("");
        setReNewPassword("");
        dispatch(setModalErrorSnackMessage(err));
      });
  };

  return open ? (
    <ModalWrapper
      title="Change User Password"
      modalOpen={open}
      onClose={() => {
        setNewPassword("");
        setReNewPassword("");
        closeModal();
      }}
      titleIcon={<ChangePasswordIcon />}
    >
      <form
        noValidate
        autoComplete="off"
        onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
          changeUserPassword(e);
        }}
      >
        <Grid container>
          <Grid item xs={12} className={classes.modalFormScrollable}>
            <div className={classes.spacerBottom}>
              Change password for: {userName}
            </div>
            <Grid item xs={12} className={classes.formFieldRow}>
              <InputBoxWrapper
                id="new-password"
                name="new-password"
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  setNewPassword(event.target.value);
                }}
                label="New Password"
                type="password"
                value={newPassword}
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
                type="password"
                value={reNewPassword}
              />
            </Grid>
          </Grid>
          <Grid item xs={12} className={classes.buttonContainer}>
            <Button
              id={"save-user-password"}
              type="submit"
              variant="callAction"
              color="primary"
              disabled={
                loading ||
                !(reNewPassword.length > 0 && newPassword === reNewPassword)
              }
              label={"Save"}
            />
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

export default withStyles(styles)(ChangeUserPassword);
