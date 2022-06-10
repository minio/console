// This file is part of MinIO Console Server
// Copyright (c) 2022 MinIO, Inc.
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

import { Theme } from "@mui/material/styles";
import createStyles from "@mui/styles/createStyles";
import withStyles from "@mui/styles/withStyles";
import { containerForHeader } from "../Common/FormComponents/common/styleLibrary";
import ConfirmDialog from "../Common/ModalWrapper/ConfirmDialog";
import useApi from "../Common/Hooks/useApi";
import React, { Fragment, useState } from "react";
import { ISetEmailModalProps } from "./types";
import { InfoIcon } from "../../../icons";
import { ErrorResponseHandler } from "../../../common/types";
import InputBoxWrapper from "../Common/FormComponents/InputBoxWrapper/InputBoxWrapper";
import { setErrorSnackMessage, setSnackBarMessage } from "../../../systemSlice";
import { useAppDispatch } from "../../../store";

const styles = (theme: Theme) =>
  createStyles({
    pageTitle: {
      fontSize: 18,
      marginBottom: 20,
      textAlign: "center",
    },
    pageSubTitle: {
      textAlign: "center",
    },
    ...containerForHeader(theme.spacing(4)),
  });

// eslint-disable-next-line
const reEmail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

const SetEmailModal = ({ open, closeModal }: ISetEmailModalProps) => {
  const dispatch = useAppDispatch();

  const onError = (err: ErrorResponseHandler) => {
    dispatch(setErrorSnackMessage(err));
    closeModal();
  };
  
  const onSuccess = (res: any) => {
    let msg = `Email ${email} has been saved`;
    dispatch(setSnackBarMessage(msg));
    closeModal();
  };

  const [isLoading, invokeApi] = useApi(onSuccess, onError);
  const [email, setEmail] = useState<string>("");
  const [isEmailSet, setIsEmailSet] = useState<boolean>(false);
  

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    let v = event.target.value;
    setIsEmailSet(reEmail.test(v));
    setEmail(v);
  };

  const onConfirm = () => {
    invokeApi("POST", "/api/v1/mp-integration", { email });
  };

  return open ? (
    <ConfirmDialog
      title={"Register Email"}
      confirmText={"Register"}
      isOpen={open}
      titleIcon={<InfoIcon />}
      isLoading={isLoading}
      cancelText={"Later"}
      onConfirm={onConfirm}
      onClose={closeModal}
      confirmButtonProps={{
        color: "info",
        disabled: !isEmailSet || isLoading,
      }}
      confirmationContent={
        <Fragment>
          Would you like to register an email for your account?
          <InputBoxWrapper
              id="set-mp-email"
              name="set-mp-email"
              onChange={handleInputChange}
              label=""
              type={"email"}
              value={email}
              />
        </Fragment>
      }
    />
  ) : null;
};

export default withStyles(styles)(SetEmailModal);
