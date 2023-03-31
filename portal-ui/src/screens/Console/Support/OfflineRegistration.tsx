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
import { Box, Link } from "@mui/material";
import { ClusterRegistered, FormTitle } from "./utils";
import { Button, CopyIcon, OfflineRegistrationIcon } from "mds";
import TooltipWrapper from "../Common/TooltipWrapper/TooltipWrapper";
import CopyToClipboard from "react-copy-to-clipboard";
import RegisterHelpBox from "./RegisterHelpBox";
import { AppState, useAppDispatch } from "../../../store";
import { useSelector } from "react-redux";
import CommentBoxWrapper from "../Common/FormComponents/CommentBoxWrapper/CommentBoxWrapper";
import useApi from "../Common/Hooks/useApi";
import { fetchLicenseInfo } from "./registerThunks";
import {
  setErrorSnackMessage,
  setServerNeedsRestart,
} from "../../../systemSlice";

const OfflineRegistration = () => {
  const dispatch = useAppDispatch();
  const subnetRegToken = useSelector(
    (state: AppState) => state.register.subnetRegToken
  );
  const clusterRegistered = useSelector(
    (state: AppState) => state.register.clusterRegistered
  );
  const licenseInfo = useSelector(
    (state: AppState) => state.register.licenseInfo
  );

  const offlineRegUrl = `https://subnet.min.io/cluster/register?token=${subnetRegToken}`;

  const [licenseKey, setLicenseKey] = useState("");

  const [isSaving, invokeApplyLicenseApi] = useApi(
    () => {
      dispatch(fetchLicenseInfo());
      dispatch(setServerNeedsRestart(true));
    },
    (err) => {
      dispatch(setErrorSnackMessage(err));
    }
  );

  const applyAirGapLicense = () => {
    invokeApplyLicenseApi("PUT", `/api/v1/configs/subnet`, {
      key_values: [{ key: "license", value: licenseKey }],
    });
  };

  return (
    <Fragment>
      <Box
        sx={{
          border: "1px solid #eaeaea",
          borderRadius: "2px",
          display: "flex",
          flexFlow: "column",
          padding: "43px",
        }}
      >
        {clusterRegistered && licenseInfo ? (
          <ClusterRegistered email={licenseInfo.email} />
        ) : (
          <Fragment>
            <Box
              sx={{
                "& .title-text": {
                  marginLeft: "27px",
                  fontWeight: 600,
                },
              }}
            >
              <FormTitle
                icon={<OfflineRegistrationIcon />}
                title={`Register cluster in an Air-gap environment`}
              />
            </Box>

            <Box
              sx={{
                display: "flex",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  flexFlow: "column",
                  flex: "2",
                  marginTop: "15px",
                  "& .step-number": {
                    color: "#ffffff",
                    height: "25px",
                    width: "25px",
                    background: "#081C42",
                    marginRight: "10px",
                    textAlign: "center",
                    fontWeight: 600,
                    borderRadius: "50%",
                  },

                  "& .step-row": {
                    fontSize: "16px",
                    display: "flex",
                    marginTop: "15px",
                    marginBottom: "15px",
                  },
                }}
              >
                <Box>
                  <Box className="step-row">
                    <div className="step-text">
                      Click on the link to register this cluster in SUBNET and
                      get a License Key for this Air-Gap deployment
                    </div>
                  </Box>

                  <Box
                    sx={{
                      flex: "1",
                      display: "flex",
                      alignItems: "center",
                      gap: 3,
                    }}
                  >
                    <Link
                      style={{
                        color: "#2781B0",
                        cursor: "pointer",
                      }}
                      color="inherit"
                      href={offlineRegUrl}
                      target="_blank"
                    >
                      https://subnet.min.io/cluster/register
                    </Link>

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

                  <div
                    style={{
                      marginTop: "25px",
                      fontSize: "14px",
                      fontStyle: "italic",
                      color: "#5E5E5E",
                    }}
                  >
                    Note: If this machine does not have internet connection,
                    Copy paste the following URL in a browser where you access
                    SUBNET and follow the instructions to complete the
                    registration
                  </div>

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
                    <CommentBoxWrapper
                      value={licenseKey}
                      disabled={isSaving}
                      label={""}
                      id={"licenseKey"}
                      name={"licenseKey"}
                      placeholder={"License Key"}
                      onChange={(e) => {
                        setLicenseKey(e.target.value);
                      }}
                    />
                  </Box>
                  <Box
                    sx={{
                      marginTop: "25px",
                    }}
                  >
                    <Button
                      id={"apply-license-key"}
                      onClick={applyAirGapLicense}
                      variant={"callAction"}
                      disabled={!licenseKey || isSaving}
                      label={"Apply Cluster License"}
                    />
                  </Box>
                </Box>
              </Box>
              <RegisterHelpBox />
            </Box>
          </Fragment>
        )}
      </Box>
    </Fragment>
  );
};

export default OfflineRegistration;
