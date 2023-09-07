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

import React, { Fragment } from "react";
import {
  CallHomeFeatureIcon,
  DiagnosticsFeatureIcon,
  ExtraFeaturesIcon,
  HelpIconFilled,
  PerformanceFeatureIcon,
  Box,
  HelpBox,
} from "mds";

const FeatureItem = ({
  icon,
  description,
}: {
  icon: any;
  description: string | React.ReactNode;
}) => {
  return (
    <Box
      sx={{
        display: "flex",
        "& .min-icon": {
          marginRight: "10px",
          height: "23px",
          width: "23px",
          marginBottom: "10px",
        },
      }}
    >
      {icon}{" "}
      <Box className="muted" style={{ fontSize: "14px", fontStyle: "italic" }}>
        {description}
      </Box>
    </Box>
  );
};
const RegisterHelpBox = () => {
  return (
    <HelpBox
      title={"Why should I register?"}
      iconComponent={<HelpIconFilled />}
      help={
        <Fragment>
          <Box sx={{ fontSize: "14px", marginBottom: "15px" }}>
            Registering this cluster with the MinIO Subscription Network
            (SUBNET) provides the following benefits in addition to the
            commercial license and SLA backed support.
          </Box>

          <Box
            sx={{
              display: "flex",
              flexFlow: "column",
            }}
          >
            <FeatureItem
              icon={<CallHomeFeatureIcon />}
              description={`Call Home Monitoring`}
            />
            <FeatureItem
              icon={<DiagnosticsFeatureIcon />}
              description={`Health Diagnostics`}
            />
            <FeatureItem
              icon={<PerformanceFeatureIcon />}
              description={`Performance Analysis`}
            />
            <FeatureItem
              icon={<ExtraFeaturesIcon />}
              description={
                <a href="https://min.io/signup?ref=con" target="_blank">
                  More Features
                </a>
              }
            />
          </Box>
        </Fragment>
      }
    />
  );
};

export default RegisterHelpBox;
