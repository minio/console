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

import { Box, HelpIconFilled, IAMPoliciesIcon } from "mds";

const FeatureItem = ({
  icon,
  description,
}: {
  icon: any;
  description: string;
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
      <div style={{ fontSize: "14px", fontStyle: "italic", color: "#5E5E5E" }}>
        {description}
      </div>
    </Box>
  );
};

const AddPolicyHelpBox = () => {
  return (
    <Box
      sx={{
        flex: 1,
        border: "1px solid #eaeaea",
        borderRadius: "2px",
        display: "flex",
        flexFlow: "column",
        padding: "20px",
      }}
    >
      <Box
        sx={{
          fontSize: "16px",
          fontWeight: 600,
          display: "flex",
          alignItems: "center",
          marginBottom: "16px",
          paddingBottom: "20px",

          "& .min-icon": {
            height: "21px",
            width: "21px",
            marginRight: "15px",
          },
        }}
      >
        <HelpIconFilled />
        <div>Learn more about Policies</div>
      </Box>
      <Box sx={{ fontSize: "14px", marginBottom: "15px" }}>
        <Box sx={{ paddingBottom: "20px" }}>
          <FeatureItem
            icon={<IAMPoliciesIcon />}
            description={`Create Policies`}
          />
          <Box sx={{ paddingTop: "20px" }}>
            MinIO uses Policy-Based Access Control (PBAC) to define the
            authorized actions and resources to which an authenticated user has
            access. Each policy describes one or more actions and conditions
            that outline the permissions of a user or group of users.{" "}
          </Box>
        </Box>
        <Box sx={{ paddingBottom: "20px" }}>
          MinIO PBAC is built for compatibility with AWS IAM policy syntax,
          structure, and behavior.
        </Box>
        <Box sx={{ paddingBottom: "20px" }}>
          Each user can access only those resources and operations which are
          explicitly granted by the built-in role. MinIO denies access to any
          other resource or action by default.
        </Box>
      </Box>
    </Box>
  );
};

export default AddPolicyHelpBox;
