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

import { HelpBox, LambdaNotificationsIcon, Box } from "mds";

const NotificationEndpointTypeSelectorHelpBox = () => {
  return (
    <HelpBox
      iconComponent={<LambdaNotificationsIcon />}
      title={"What are Event Destinations?"}
      help={
        <Box sx={{ paddingTop: "20px" }}>
          MinIO bucket notifications allow administrators to send notifications
          to supported external services on certain object or bucket events.
          MinIO supports bucket and object-level S3 events similar to the Amazon
          S3 Event Notifications.
        </Box>
      }
    />
  );
};

export default NotificationEndpointTypeSelectorHelpBox;
