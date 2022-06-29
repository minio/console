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
import ModalWrapper from "../Common/ModalWrapper/ModalWrapper";
import { Box, Button } from "@mui/material";
import { AGPLV3DarkLogo } from "../../../icons";
import { setLicenseConsent } from "./utils";

const LicenseConsentModal = ({
  isOpen,
  onClose,
}: {
  onClose: () => void;
  isOpen: boolean;
}) => {
  const recordAgplConsent = () => {
    setLicenseConsent(); //to Local storage.
    onClose();
  };

  return (
    <ModalWrapper
      modalOpen={isOpen}
      title="License"
      onClose={() => {
        onClose();
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexFlow: "column",
          "& .link-text": {
            color: "#2781B0",
            fontSize: "12px",
            fontWeight: 600,
          },
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            marginBottom: "40px",
            justifyContent: "center",
            "& .min-icon": {
              fill: "blue",
              width: "188px",
              height: "62px",
            },
          }}
        >
          <AGPLV3DarkLogo />
        </Box>
        <Box
          sx={{
            marginBottom: "27px",
          }}
        >
          By using this software, you acknowledge that MinIO software is
          licensed under the GNU AGPL v3, for which, the full text can be found
          here:{" "}
          <a
            href={`https://www.gnu.org/licenses/agpl-3.0.html`}
            rel="noreferrer noopener"
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
          with the obligations of the license. If you are not able to satisfy
          the license obligations, we offer a commercial license which is
          available here:{" "}
          <a
            href={`https://min.io/signup?ref=con`}
            rel="noreferrer noopener"
            className={"link-text"}
          >
            https://min.io/signup.
          </a>
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
            type="button"
            variant="contained"
            color="primary"
            onClick={recordAgplConsent}
          >
            Acknowledge
          </Button>
        </Box>
      </Box>
    </ModalWrapper>
  );
};

export default LicenseConsentModal;
