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

import React from "react";
import { InputBox } from "mds";
import { setSecretKey, setShowPassword } from "./AddUsersSlice";
import { useSelector } from "react-redux";
import { AppState, useAppDispatch } from "../../../store";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";

const PasswordSelector = () => {
  const dispatch = useAppDispatch();
  const showPassword = useSelector(
    (state: AppState) => state.createUser.showPassword,
  );
  const secretKey = useSelector(
    (state: AppState) => state.createUser.secretKey,
  );
  return (
    <InputBox
      id="standard-multiline-static"
      name="standard-multiline-static"
      label="Password"
      type={showPassword ? "text" : "password"}
      value={secretKey}
      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
        dispatch(setSecretKey(e.target.value));
      }}
      autoComplete="current-password"
      overlayIcon={showPassword ? <VisibilityOffIcon /> : <RemoveRedEyeIcon />}
      overlayAction={() => dispatch(setShowPassword(!showPassword))}
    />
  );
};
export default PasswordSelector;
