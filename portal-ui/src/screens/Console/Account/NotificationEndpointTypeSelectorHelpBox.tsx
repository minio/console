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
import { HelpIconFilled, LambdaNotificationsIcon } from "../../../icons";

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
const NotificationEndpointTypeSelectorHelpBox = () => {
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
          paddingBottom: "20px",

          "& .min-icon": {
            height: "21px",
            width: "21px",
            marginRight: "15px",
          },
        }}
      >
        <HelpIconFilled />
        <div>Learn more about Notification Endpoints</div>
      </Box>
      <Box sx={{ fontSize: "14px", marginBottom: "15px" }}>
        <Box sx={{ paddingBottom: "20px" }}>
          <FeatureItem
            icon={<LambdaNotificationsIcon />}
            description={`What are Lambda Endpoint Notifications?`}
          />
          <Box sx={{ paddingTop: "20px" }}>
            MinIO bucket notifications allow administrators to send
            notifications to supported external services on certain object or
            bucket events. MinIO supports bucket and object-level S3 events
            similar to the Amazon S3 Event Notifications.
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default NotificationEndpointTypeSelectorHelpBox;
