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
import {
  Box,
  Button,
  ChangePasswordIcon,
  FormLayout,
  InputBox,
  ProgressBar,
} from "mds";
import { modalStyleUtils } from "../Common/FormComponents/common/styleLibrary";
import {
  setErrorSnackMessage,
  setModalErrorSnackMessage,
  setSnackBarMessage,
} from "../../../systemSlice";
import { useAppDispatch } from "../../../store";
import { api } from "api";
import { ApiError, ChangeUserPasswordRequest } from "api/consoleApi";
import { errorToHandler } from "api/errors";
import ModalWrapper from "../Common/ModalWrapper/ModalWrapper";

interface IChangeUserPasswordProps {
  open: boolean;
  userName: string;
  closeModal: () => void;
}

const ChangeUserPassword = ({
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
        }),
      );
      setLoading(false);
      return;
    }

    let request: ChangeUserPasswordRequest = {
      selectedUser: userName,
      newSecretKey: newPassword,
    };

    api.account
      .changeUserPassword(request)
      .then((res) => {
        setLoading(false);
        setNewPassword("");
        setReNewPassword("");
        dispatch(
          setSnackBarMessage(
            `Successfully updated the password for the user ${userName}.`,
          ),
        );
        closeModal();
      })
      .catch(async (res) => {
        setLoading(false);
        setNewPassword("");
        setReNewPassword("");
        const err = (await res.json()) as ApiError;
        dispatch(setErrorSnackMessage(errorToHandler(err)));
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
        <FormLayout withBorders={false} containerPadding={false}>
          <Box sx={{ margin: "10px 0 20px" }}>
            Change password for: <strong>{userName}</strong>
          </Box>
          <InputBox
            id="new-password"
            name="new-password"
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              setNewPassword(event.target.value);
            }}
            label="New Password"
            type="password"
            value={newPassword}
          />
          <InputBox
            id="re-new-password"
            name="re-new-password"
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              setReNewPassword(event.target.value);
            }}
            label="Type New Password Again"
            type="password"
            value={reNewPassword}
          />
          <Box sx={modalStyleUtils.modalButtonBar}>
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
          </Box>
          {loading && (
            <Box>
              <ProgressBar />
            </Box>
          )}
        </FormLayout>
      </form>
    </ModalWrapper>
  ) : null;
};

export default ChangeUserPassword;
