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
import { Box } from "@mui/material";
import {
  HelpIconFilled,
  UsersIcon,
  ChangeAccessPolicyIcon,
  GroupsIcon,
} from "../../../icons";

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
const UsersHelpBox = () => {
  return (
    <Box
      sx={{
        flex: 1,
        border: "1px solid #eaeaea",
        borderRadius: "2px",
        display: "flex",
        flexFlow: "column",
        padding: "20px",
        marginTop: {
          xs: "0px",
        },
      }}
    >
      <Box
        sx={{
          fontSize: "16px",
          fontWeight: 600,
          display: "flex",
          alignItems: "center",
          marginBottom: "16px",

          "& .min-icon": {
            height: "21px",
            width: "21px",
            marginRight: "15px",
          },
        }}
      >
        <HelpIconFilled />
        <div>Learn more about the Users feature</div>
      </Box>
     

      <Box
        sx={{
          display: "flex",
          flexFlow: "column",
        }}
      >
        <FeatureItem icon={<UsersIcon />} description={`Create Users`} />
        <Box sx={{ fontSize: "14px", marginBottom: "15px" }}>
        A MinIO user consists of a unique access key (username) and
        corresponding secret key (password). Clients must authenticate their
        identity by specifying both a valid access key (username) and the
        corresponding secret key (password) of an existing MinIO user.
        <br />       
      </Box>
        <FeatureItem icon={<GroupsIcon />} description={`Manage Groups`} />
        <Box sx={{ fontSize: "14px", marginBottom: "15px" }}>
        Groups provide a simplified method for managing shared permissions among users with common access patterns and workloads. 
        <br />
        <br />
        Users inherit access permissions to data and resources through the groups they belong to.
        <br />
      </Box>
        <FeatureItem
          icon={<ChangeAccessPolicyIcon />}
          description={`Assign Policies`}
        />
         <Box sx={{ fontSize: "14px", marginBottom: "15px" }}>
         MinIO uses Policy-Based Access Control (PBAC) to define the authorized actions and resources to which an authenticated user has access. Each policy describes one or more actions and conditions that outline the permissions of a user or group of users.
        <br />
        <br />
        Each user can access only those resources and operations which are explicitly granted by the built-in role. MinIO denies access to any other resource or action by default.
        <br />
       
      </Box>
      </Box>
    </Box>
  );
};

export default UsersHelpBox;
