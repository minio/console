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

import React, { useState } from "react";
import { Box, FormLayout, InfoIcon, InputBox, LockIcon, UsersIcon } from "mds";
import { useAppDispatch } from "../../../store";
import { setErrorSnackMessage } from "../../../systemSlice";
import ConfirmDialog from "../Common/ModalWrapper/ConfirmDialog";
import { api } from "api";
import {
  ApiError,
  ApiKey,
  HttpResponse,
  SubnetLoginResponse,
} from "api/consoleApi";
import { errorToHandler } from "api/errors";

interface IGetApiKeyModalProps {
  open: boolean;
  closeModal: () => void;
  onSet: (apiKey: string) => void;
}

const GetApiKeyModal = ({ open, closeModal, onSet }: IGetApiKeyModalProps) => {
  const dispatch = useAppDispatch();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState("");
  const [mfaToken, setMfaToken] = useState("");
  const [subnetOTP, setSubnetOTP] = useState("");
  const [loadingSave, setLoadingSave] = useState<boolean>(false);

  const onError = (err: ApiError) => {
    dispatch(setErrorSnackMessage(errorToHandler(err)));
    closeModal();
    setEmail("");
    setPassword("");
    setMfaToken("");
    setSubnetOTP("");
  };

  const onConfirm = () => {
    if (mfaToken !== "") {
      submitSubnetMfa();
    } else {
      submitSubnetLogin();
    }
  };

  const submitSubnetMfa = () => {
    setLoadingSave(true);
    api.subnet
      .subnetLoginMfa({
        username: email,
        otp: subnetOTP,
        mfa_token: mfaToken,
      })
      .then((res: HttpResponse<SubnetLoginResponse, ApiError>) => {
        if (res.data && res.data.access_token) {
          getApiKey(res.data.access_token);
        }
      })
      .catch((res: HttpResponse<SubnetLoginResponse, ApiError>) => {
        onError(res.error);
      })
      .finally(() => setLoadingSave(false));
  };

  const getApiKey = (access_token: string) => {
    setLoadingSave(true);
    api.subnet
      .subnetApiKey({
        token: access_token,
      })
      .then((res: HttpResponse<ApiKey, ApiError>) => {
        if (res.data && res.data.apiKey) {
          onSet(res.data.apiKey);
          closeModal();
        }
      })
      .catch((res: HttpResponse<SubnetLoginResponse, ApiError>) => {
        onError(res.error);
      })
      .finally(() => setLoadingSave(false));
  };

  const submitSubnetLogin = () => {
    setLoadingSave(true);
    api.subnet
      .subnetLogin({ username: email, password })
      .then((res: HttpResponse<SubnetLoginResponse, ApiError>) => {
        if (res.data && res.data.mfa_token) {
          setMfaToken(res.data.mfa_token);
        }
      })
      .catch((res: HttpResponse<SubnetLoginResponse, ApiError>) => {
        onError(res.error);
      })
      .finally(() => setLoadingSave(false));
  };

  const getDialogContent = () => {
    if (mfaToken === "") {
      return getCredentialsDialog();
    }
    return getMFADialog();
  };

  const getCredentialsDialog = () => {
    return (
      <FormLayout withBorders={false} containerPadding={false}>
        <InputBox
          id="subnet-email"
          name="subnet-email"
          onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
            setEmail(event.target.value)
          }
          label="Email"
          value={email}
          overlayIcon={<UsersIcon />}
        />
        <InputBox
          id="subnet-password"
          name="subnet-password"
          onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
            setPassword(event.target.value)
          }
          label="Password"
          type={"password"}
          value={password}
        />
      </FormLayout>
    );
  };

  const getMFADialog = () => {
    return (
      <Box sx={{ display: "flex" }}>
        <Box sx={{ display: "flex", flexFlow: "column", flex: "2" }}>
          <Box
            sx={{
              fontSize: 14,
              display: "flex",
              flexFlow: "column",
              marginTop: 20,
              marginBottom: 20,
            }}
          >
            Two-Factor Authentication
          </Box>

          <Box>
            Please enter the 6-digit verification code that was sent to your
            email address. This code will be valid for 5 minutes.
          </Box>

          <Box
            sx={{
              flex: "1",
              marginTop: "30px",
            }}
          >
            <InputBox
              overlayIcon={<LockIcon />}
              id="subnet-otp"
              name="subnet-otp"
              onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                setSubnetOTP(event.target.value)
              }
              placeholder=""
              label=""
              value={subnetOTP}
            />
          </Box>
        </Box>
      </Box>
    );
  };

  return open ? (
    <ConfirmDialog
      title={"Get API Key from SUBNET"}
      confirmText={"Get API Key"}
      isOpen={open}
      titleIcon={<InfoIcon />}
      isLoading={loadingSave}
      cancelText={"Cancel"}
      onConfirm={onConfirm}
      onClose={closeModal}
      confirmButtonProps={{
        variant: "callAction",
        disabled: !email || !password || loadingSave,
        hidden: true,
      }}
      cancelButtonProps={{
        disabled: loadingSave,
      }}
      confirmationContent={getDialogContent()}
    />
  ) : null;
};

export default GetApiKeyModal;
