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

import React, { Fragment, useState } from "react";
import {
  Button,
  ChangePasswordIcon,
  InputBox,
  Grid,
  FormLayout,
  ProgressBar,
  InformativeMessage,
} from "mds";
import ModalWrapper from "../Common/ModalWrapper/ModalWrapper";

import { modalStyleUtils } from "../Common/FormComponents/common/styleLibrary";
import {
  setErrorSnackMessage,
  setModalErrorSnackMessage,
  setSnackBarMessage,
} from "../../../systemSlice";
import { useAppDispatch } from "../../../store";
import { api } from "api";
import { AccountChangePasswordRequest, ApiError } from "api/consoleApi";
import { errorToHandler } from "api/errors";

interface IChangePasswordProps {
  open: boolean;
  closeModal: () => void;
}

const ChangePassword = ({ open, closeModal }: IChangePasswordProps) => {
  const dispatch = useAppDispatch();
  const [currentPassword, setCurrentPassword] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [reNewPassword, setReNewPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const userLoggedIn = localStorage.getItem("userLoggedIn") || "";

  const changePassword = (event: React.FormEvent) => {
    event.preventDefault();

    if (newPassword !== reNewPassword) {
      dispatch(
        setModalErrorSnackMessage({
          errorMessage: "New passwords don't match",
          detailedError: "",
        }),
      );
      return;
    }

    if (newPassword.length < 8) {
      dispatch(
        setModalErrorSnackMessage({
          errorMessage: "Passwords must be at least 8 characters long",
          detailedError: "",
        }),
      );
      return;
    }

    if (loading) {
      return;
    }
    setLoading(true);

    let request: AccountChangePasswordRequest = {
      current_secret_key: currentPassword,
      new_secret_key: newPassword,
    };

    api.account
      .accountChangePassword(request)
      .then(() => {
        setLoading(false);
        setNewPassword("");
        setReNewPassword("");
        setCurrentPassword("");
        dispatch(setSnackBarMessage("Successfully updated the password."));
        closeModal();
      })
      .catch(async (res) => {
        setLoading(false);
        setNewPassword("");
        setReNewPassword("");
        setCurrentPassword("");
        const err = (await res.json()) as ApiError;
        dispatch(setErrorSnackMessage(errorToHandler(err)));
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
      <InformativeMessage
        variant={"warning"}
        title={"Warning"}
        message={
          <Fragment>
            If you are looking to change MINIO_ROOT_USER credentials, <br />
            Please refer to{" "}
            <a
              target="_blank"
              rel="noopener"
              href="https://min.io/docs/minio/linux/administration/identity-access-management/minio-user-management.html#id4?ref=con"
            >
              rotating
            </a>{" "}
            credentials.
          </Fragment>
        }
        sx={{ margin: "15px 0" }}
      />
      <form
        noValidate
        autoComplete="off"
        onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
          changePassword(e);
        }}
      >
        <Grid container>
          <Grid item xs={12} sx={{ ...modalStyleUtils.modalFormScrollable }}>
            <FormLayout withBorders={false} containerPadding={false}>
              <InputBox
                id="current-password"
                name="current-password"
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  setCurrentPassword(event.target.value);
                }}
                label="Current Password"
                type={"password"}
                value={currentPassword}
              />
              <InputBox
                id="new-password"
                name="new-password"
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  setNewPassword(event.target.value);
                }}
                label="New Password"
                type={"password"}
                value={newPassword}
              />
              <InputBox
                id="re-new-password"
                name="re-new-password"
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  setReNewPassword(event.target.value);
                }}
                label="Type New Password Again"
                type={"password"}
                value={reNewPassword}
              />
            </FormLayout>
          </Grid>
          <Grid item xs={12} sx={{ ...modalStyleUtils.modalButtonBar }}>
            <Button
              id={"save-password-modal"}
              type="submit"
              variant="callAction"
              color="primary"
              disabled={
                loading ||
                !(
                  currentPassword.length > 0 &&
                  newPassword.length > 0 &&
                  reNewPassword.length > 0
                )
              }
              label="Save"
            />
          </Grid>
          {loading && (
            <Grid item xs={12}>
              <ProgressBar />
            </Grid>
          )}
        </Grid>
      </form>
    </ModalWrapper>
  ) : null;
};

export default ChangePassword;
