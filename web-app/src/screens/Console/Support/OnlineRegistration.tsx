// This file is part of MinIO Console Server
// Copyright (c) 2023 MinIO, Inc.
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

import React from "react";
import {
  Box,
  Button,
  FormLayout,
  InputBox,
  OnlineRegistrationIcon,
  UsersIcon,
} from "mds";
import RegisterHelpBox from "./RegisterHelpBox";
import { modalStyleUtils } from "../Common/FormComponents/common/styleLibrary";
import { useSelector } from "react-redux";
import { AppState, useAppDispatch } from "../../../store";
import { setSubnetEmail, setSubnetPassword } from "./registerSlice";
import { subnetLogin } from "./registerThunks";

const OnlineRegistration = () => {
  const dispatch = useAppDispatch();

  const subnetPassword = useSelector(
    (state: AppState) => state.register.subnetPassword,
  );
  const subnetEmail = useSelector(
    (state: AppState) => state.register.subnetEmail,
  );
  const loading = useSelector((state: AppState) => state.register.loading);

  return (
    <FormLayout
      icon={<OnlineRegistrationIcon />}
      title={"Online activation of MinIO Subscription Network License"}
      withBorders={false}
      containerPadding={false}
      helpBox={<RegisterHelpBox />}
    >
      <Box
        sx={{
          fontSize: "14px",
          display: "flex",
          flexFlow: "column",
          marginBottom: "30px",
        }}
      >
        Use your MinIO Subscription Network login credentials to register this
        cluster.
      </Box>
      <Box
        sx={{
          flex: "1",
        }}
      >
        <InputBox
          id="subnet-email"
          name="subnet-email"
          onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
            dispatch(setSubnetEmail(event.target.value))
          }
          label="Email"
          value={subnetEmail}
          overlayIcon={<UsersIcon />}
        />
        <InputBox
          id="subnet-password"
          name="subnet-password"
          onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
            dispatch(setSubnetPassword(event.target.value))
          }
          label="Password"
          type={"password"}
          value={subnetPassword}
        />

        <Box sx={modalStyleUtils.modalButtonBar}>
          <Button
            id={"sign-up"}
            type="submit"
            variant="regular"
            onClick={(e) => {
              e.preventDefault();
              window.open(`https://min.io/signup?ref=con`, "_blank");
            }}
            label={"Sign up"}
          />
          <Button
            id={"register-credentials"}
            type="submit"
            variant="callAction"
            disabled={
              loading ||
              subnetEmail.trim().length === 0 ||
              subnetPassword.trim().length === 0
            }
            onClick={() => dispatch(subnetLogin())}
            label={"Register"}
          />
        </Box>
      </Box>
    </FormLayout>
  );
};

export default OnlineRegistration;
