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
import ModalWrapper from "../Common/ModalWrapper/ModalWrapper";

import { AGPLV3DarkLogo, Box, Button, InformativeMessage } from "mds";
import LicenseLink from "./LicenseLink";
import LicenseFAQ from "./LicenseFAQ";
import { useSelector } from "react-redux";
import { AppState, useAppDispatch } from "../../../store";
import { setAcknowledgeLicense } from "../../../systemSlice";
import { useTheme } from "styled-components";
import get from "lodash/get";
import { setLicenseConsent } from "./utils";

const LicenseConsentModal = () => {
  const dispatch = useAppDispatch();
  const theme = useTheme();

  const [displayForceAcknowledge, setDisplayForceAcknowledge] =
    useState<boolean>(false);
  const [acknowledgeDisabled, setAcknowledgeDisabled] =
    useState<boolean>(false);

  const licenseAcknowledged = useSelector(
    (state: AppState) => state.system.licenseAcknowledged,
  );

  const recordAgplConsent = () => {
    setAcknowledgeDisabled(true);

    fetch("https://dl.min.io/server/minio/agplv3-ack", {
      mode: "no-cors",
    })
      .then(() => {
        setLicenseConsent(); //to Local storage.
        dispatch(setAcknowledgeLicense(true));
        setAcknowledgeDisabled(false);
      })
      .catch(() => {
        setAcknowledgeDisabled(false);
        console.error("Error while trying to Acknowledge the license");
        dispatch(setAcknowledgeLicense(true));
      });
  };

  if (licenseAcknowledged) {
    return null;
  }

  return (
    <Box
      sx={{
        "& #close": {
          display: "none",
        },
      }}
    >
      <ModalWrapper
        modalOpen={!licenseAcknowledged}
        title="License"
        onClose={() => {
          setDisplayForceAcknowledge(true);
        }}
        sx={{
          backgroundColor: "red",
          "& #close": {
            width: 0,
            height: 0,
            display: "none",
            visibility: "hidden",
          },
        }}
      >
        {displayForceAcknowledge && (
          <Box sx={{ marginBottom: 15 }}>
            <InformativeMessage
              title={"Please read the license statement"}
              message={"Click on the Acknowledge button to continue"}
              variant={"warning"}
            />
          </Box>
        )}
        <Box
          sx={{
            display: "flex",
            flexFlow: "column",
            "& .link-text": {
              color: "#2781B0",
              fontWeight: 600,
            },
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              marginBottom: "20px",
              justifyContent: "center",
              "& .min-icon": {
                width: "188px",
                height: "62px",
                "& path": {
                  fill: `${get(theme, "signalColors.main", "blue")}!important`,
                },
              },
            }}
          >
            <AGPLV3DarkLogo
              style={{
                color: `${get(theme, "signalColors.main", "blue")}!important`,
              }}
            />
          </Box>
          <Box
            sx={{
              overflowY: "auto",
              maxHeight: 500,
            }}
          >
            <Box
              sx={{
                marginBottom: "27px",
              }}
            >
              By using this software, you acknowledge that MinIO software is
              licensed under the <LicenseLink />, for which, the full text can
              be found here:{" "}
              <a
                href={`https://www.gnu.org/licenses/agpl-3.0.html`}
                rel="noopener"
                className={"link-text"}
              >
                https://www.gnu.org/licenses/agpl-3.0.html.
              </a>
            </Box>
            <Box
              sx={{
                paddingBottom: "23px",
              }}
            >
              Please review the terms carefully and ensure you are in compliance
              with the obligations of the license. If you are not able to
              satisfy the license obligations, we offer a commercial license
              which is available here:{" "}
              <a
                href={`https://min.io/signup?ref=con`}
                rel="noopener"
                className={"link-text"}
              >
                https://min.io/signup.
              </a>
            </Box>
            <LicenseFAQ />
          </Box>
          <Box
            sx={{
              marginTop: "19px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Button
              id={"acknowledge-confirm"}
              type="button"
              variant="callAction"
              onClick={recordAgplConsent}
              label={"Acknowledge"}
              disabled={acknowledgeDisabled}
            />
          </Box>
        </Box>
      </ModalWrapper>
    </Box>
  );
};

export default LicenseConsentModal;
