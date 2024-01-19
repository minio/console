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

import { Box, GroupsIcon, HelpIconFilled, IAMPoliciesIcon } from "mds";

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
const AddGroupHelpBox = () => {
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
        <div>Learn more about Groups</div>
      </Box>
      <Box sx={{ fontSize: "14px", marginBottom: "15px" }}>
        Adding groups lets you assign IAM policies to multiple users at once.
        <Box sx={{ paddingTop: "20px", paddingBottom: "10px" }}>
          Users inherit access permissions to data and resources through the
          groups they belong to.
        </Box>
        <Box sx={{ paddingTop: "10px", paddingBottom: "10px" }}>
          A user can be a member of multiple groups.
        </Box>
        <Box sx={{ paddingTop: "10px", paddingBottom: "10px" }}>
          Groups provide a simplified method for managing shared permissions
          among users with common access patterns and workloads. Client’s cannot
          authenticate to a MinIO deployment using a group as an identity.
        </Box>
      </Box>

      <Box
        sx={{
          display: "flex",
          flexFlow: "column",
        }}
      >
        <FeatureItem icon={<GroupsIcon />} description={`Add Users to Group`} />
        <Box sx={{ paddingTop: "10px", paddingBottom: "10px" }}>
          Select from the list of displayed users to assign users to the new
          group at creation. These users inherit the policies assigned to the
          group.
        </Box>
        <FeatureItem
          icon={<IAMPoliciesIcon />}
          description={`Assign Custom IAM Policies for Group`}
        />
        <Box sx={{ paddingTop: "10px", paddingBottom: "10px" }}>
          You can add policies to the group by selecting it from the Groups view
          after creation. The Policy view lets you manage the assigned policies
          for the group.
        </Box>
      </Box>
    </Box>
  );
};

export default AddGroupHelpBox;
