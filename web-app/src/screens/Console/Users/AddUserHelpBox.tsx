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
  ChangeAccessPolicyIcon,
  GroupsIcon,
  HelpIconFilled,
  UsersIcon,
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
const AddUserHelpBox = () => {
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
      <Box sx={{ fontSize: "14px", marginBottom: "15px" }}>
        A MinIO user consists of a unique access key (username) and
        corresponding secret key (password). Clients must authenticate their
        identity by specifying both a valid access key (username) and the
        corresponding secret key (password) of an existing MinIO user.
        <br />
        <br />
        Each user can have one or more assigned policies that explicitly list
        the actions and resources to which that user has access. Users can also
        inherit policies from the groups in which they have membership.
        <br />
      </Box>

      <Box
        sx={{
          display: "flex",
          flexFlow: "column",
        }}
      >
        <FeatureItem icon={<UsersIcon />} description={`Create Users`} />
        <FeatureItem icon={<GroupsIcon />} description={`Manage Groups`} />
        <FeatureItem
          icon={<ChangeAccessPolicyIcon />}
          description={`Assign Policies`}
        />
      </Box>
    </Box>
  );
};

export default AddUserHelpBox;
