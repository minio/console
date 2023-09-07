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
import { Box, Button, FormLayout, InputBox, LockIcon } from "mds";
import { useSelector } from "react-redux";
import { setSubnetOTP } from "./registerSlice";
import { AppState, useAppDispatch } from "../../../store";
import { subnetLoginWithMFA } from "./registerThunks";
import { modalStyleUtils } from "../Common/FormComponents/common/styleLibrary";
import RegisterHelpBox from "./RegisterHelpBox";

const SubnetMFAToken = () => {
  const dispatch = useAppDispatch();

  const subnetMFAToken = useSelector(
    (state: AppState) => state.register.subnetMFAToken,
  );
  const subnetOTP = useSelector((state: AppState) => state.register.subnetOTP);
  const loading = useSelector((state: AppState) => state.register.loading);

  return (
    <FormLayout
      title={"Two-Factor Authentication"}
      helpBox={<RegisterHelpBox />}
      withBorders={false}
      containerPadding={false}
    >
      <Box
        sx={{
          fontSize: 14,
          display: "flex",
          flexFlow: "column",
          marginBottom: "30px",
        }}
      >
        Please enter the 6-digit verification code that was sent to your email
        address. This code will be valid for 5 minutes.
      </Box>

      <Box>
        <InputBox
          overlayIcon={<LockIcon />}
          id="subnet-otp"
          name="subnet-otp"
          onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
            dispatch(setSubnetOTP(event.target.value))
          }
          placeholder=""
          label=""
          value={subnetOTP}
        />
      </Box>
      <Box sx={modalStyleUtils.modalButtonBar}>
        <Button
          id={"verify"}
          onClick={() => dispatch(subnetLoginWithMFA())}
          disabled={
            loading ||
            subnetOTP.trim().length === 0 ||
            subnetMFAToken.trim().length === 0
          }
          variant="callAction"
          label={"Verify"}
        />
      </Box>
    </FormLayout>
  );
};
export default SubnetMFAToken;
