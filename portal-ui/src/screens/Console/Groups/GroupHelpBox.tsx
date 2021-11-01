// This file is part of MinIO Console Server
// Copyright (c) 2021 MinIO, Inc.
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
import { GroupsIcon } from "../../../icons";
import HelpBox from "../../../common/HelpBox";

const GroupHelpBox = () => {
  return (
    <HelpBox
      title={"Groups"}
      iconComponent={<GroupsIcon />}
      help={
        <Fragment>
          A group can have one attached IAM policy, where all users
          with membership in that group inherit that policy. Groups
          support more simplified management of user permissions on
          the MinIO Tenant.
          <br />
          <br />
          You can learn more at our{" "}
          <a
            href="https://docs.min.io/minio/k8s/tutorials/group-management.html?ref=con"
            target="_blank"
            rel="noreferrer"
          >
            documentation
          </a>
          .
        </Fragment>
      }
    />
  );
};

export default GroupHelpBox;