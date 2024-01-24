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

import React, { Fragment, useState } from "react";
import {
  Box,
  Button,
  CommentBox,
  CopyIcon,
  FormLayout,
  OfflineRegistrationIcon,
} from "mds";
import { ClusterRegistered } from "./utils";
import { AppState, useAppDispatch } from "../../../store";
import { useSelector } from "react-redux";
import { fetchLicenseInfo } from "./registerThunks";
import {
  setErrorSnackMessage,
  setServerNeedsRestart,
} from "../../../systemSlice";
import { modalStyleUtils } from "../Common/FormComponents/common/styleLibrary";
import TooltipWrapper from "../Common/TooltipWrapper/TooltipWrapper";
import CopyToClipboard from "react-copy-to-clipboard";
import RegisterHelpBox from "./RegisterHelpBox";
import { api } from "api";
import { ApiError, HttpResponse, SetConfigResponse } from "api/consoleApi";
import { errorToHandler } from "api/errors";

const OfflineRegistration = () => {
  const dispatch = useAppDispatch();
  const subnetRegToken = useSelector(
    (state: AppState) => state.register.subnetRegToken,
  );
  const clusterRegistered = useSelector(
    (state: AppState) => state.register.clusterRegistered,
  );
  const licenseInfo = useSelector(
    (state: AppState) => state.register.licenseInfo,
  );

  const offlineRegUrl = `https://subnet.min.io/cluster/register?token=${subnetRegToken}`;

  const [licenseKey, setLicenseKey] = useState("");
  const [loadingSave, setLoadingSave] = useState<boolean>(false);

  const applyAirGapLicense = () => {
    setLoadingSave(true);
    api.configs
      .setConfig("subnet", {
        key_values: [{ key: "license", value: licenseKey }],
      })
      .then((_) => {
        dispatch(fetchLicenseInfo());
        dispatch(setServerNeedsRestart(true));
      })
      .catch((res: HttpResponse<SetConfigResponse, ApiError>) => {
        dispatch(setErrorSnackMessage(errorToHandler(res.error)));
      })
      .finally(() => setLoadingSave(false));
  };

  return (
    <Fragment>
      <Box
        withBorders
        sx={{
          display: "flex",
          flexFlow: "column",
          padding: "43px",
        }}
      >
        {clusterRegistered && licenseInfo ? (
          <ClusterRegistered email={licenseInfo.email} />
        ) : (
          <FormLayout
            title={"Register cluster in an Air-gap environment"}
            icon={<OfflineRegistrationIcon />}
            helpBox={<RegisterHelpBox />}
            withBorders={false}
            containerPadding={false}
          >
            <Box
              sx={{
                display: "flex",
                flexFlow: "column",
                flex: "2",
                marginTop: "15px",
                "& .step-row": {
                  fontSize: 14,
                  display: "flex",
                  marginTop: "15px",
                  marginBottom: "15px",
                },
              }}
            >
              <Box>
                <Box className="step-row">
                  <Box className="step-text">
                    Click on the link to register this cluster in SUBNET and get
                    a License Key for this Air-Gap deployment
                  </Box>
                </Box>

                <Box
                  sx={{
                    flex: "1",
                    display: "flex",
                    alignItems: "center",
                    gap: 3,
                  }}
                >
                  <a href={offlineRegUrl} target="_blank">
                    https://subnet.min.io/cluster/register
                  </a>

                  <TooltipWrapper tooltip={"Copy to Clipboard"}>
                    <CopyToClipboard text={offlineRegUrl}>
                      <Button
                        type={"button"}
                        id={"copy-ult-to-clip-board"}
                        icon={<CopyIcon />}
                        color={"primary"}
                        variant={"regular"}
                      />
                    </CopyToClipboard>
                  </TooltipWrapper>
                </Box>

                <Box
                  className={"muted"}
                  sx={{
                    marginTop: "25px",
                  }}
                >
                  Note: If this machine does not have internet connection, Copy
                  paste the following URL in a browser where you access SUBNET
                  and follow the instructions to complete the registration
                </Box>

                <Box
                  sx={{
                    marginTop: "25px",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <label style={{ fontWeight: "bold", marginBottom: "10px" }}>
                    Paste the License Key{" "}
                  </label>
                  <CommentBox
                    value={licenseKey}
                    disabled={loadingSave}
                    label={""}
                    id={"licenseKey"}
                    name={"licenseKey"}
                    placeholder={"License Key"}
                    onChange={(e) => {
                      setLicenseKey(e.target.value);
                    }}
                  />
                </Box>
                <Box sx={modalStyleUtils.modalButtonBar}>
                  <Button
                    id={"apply-license-key"}
                    onClick={applyAirGapLicense}
                    variant={"callAction"}
                    disabled={!licenseKey || loadingSave}
                    label={"Apply Cluster License"}
                  />
                </Box>
              </Box>
            </Box>
          </FormLayout>
        )}
      </Box>
    </Fragment>
  );
};

export default OfflineRegistration;
