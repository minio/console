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
import {
  Box,
  HelpIconFilled,
  IAMPoliciesIcon,
  PasswordKeyIcon,
  ServiceAccountIcon,
} from "mds";

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
const AddUserServiceAccountHelpBox = () => {
  return (
    <Box
      sx={{
        flex: 1,
        border: "1px solid #eaeaea",
        borderRadius: "2px",
        display: "flex",
        flexFlow: "column",
        padding: "20px",
        marginTop: 0,
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
        <div>Learn more about Access Keys</div>
      </Box>
      <Box sx={{ fontSize: "14px", marginBottom: "15px" }}>
        <Box sx={{ paddingBottom: "20px" }}>
          <FeatureItem
            icon={<ServiceAccountIcon />}
            description={`Create Access Keys`}
          />
          <Box sx={{ paddingTop: "20px" }}>
            Access Keys inherit the policies explicitly attached to the parent
            user, and the policies attached to each group in which the parent
            user has membership.
          </Box>
        </Box>
        <Box sx={{ paddingBottom: "20px" }}>
          <FeatureItem
            icon={<PasswordKeyIcon />}
            description={`Assign Custom Credentials`}
          />
          <Box sx={{ paddingTop: "10px" }}>
            Randomized access credentials are recommended, and provided by
            default. You may use your own custom Access Key and Secret Key by
            replacing the default values. After creation of any Access Key, you
            will be given the opportunity to view and download the account
            credentials.
          </Box>
          <Box sx={{ paddingTop: "10px" }}>
            Access Keys support programmatic access by applications. You cannot
            use a Access Key to log into the MinIO Console.
          </Box>
        </Box>
        <Box sx={{ paddingBottom: "20px" }}>
          <FeatureItem
            icon={<IAMPoliciesIcon />}
            description={`Assign Access Policies`}
          />
          <Box sx={{ paddingTop: "10px" }}>
            You can specify an optional JSON-formatted IAM policy to further
            restrict Access Key access to a subset of the actions and resources
            explicitly allowed for the parent user. Additional access beyond
            that of the parent user cannot be implemented through these
            policies.
          </Box>
          <Box sx={{ paddingTop: "10px" }}>
            You cannot modify the optional Access Key IAM policy after saving.
          </Box>
        </Box>
      </Box>
      <Box
        sx={{
          display: "flex",
          flexFlow: "column",
        }}
      ></Box>
    </Box>
  );
};

export default AddUserServiceAccountHelpBox;
