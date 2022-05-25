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

import React, { SVGProps } from "react";

const LambdaNotificationsIcon = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      {...props}
      className={`min-icon`}
      fill={"currentcolor"}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 10 10"
    >
      <path
        d="M0,0v10l2.8-2.2H10V0H0z M6.6,6L5.6,6.4l-0.8-2l-1.5,2L2.5,5.9l1.9-2.6L4.1,2.4H3.2v-1h1.5l1.4,3.7l0.9-0.4
	l0.4,0.9L6.6,6z"
      />
    </svg>
  );
};

export default LambdaNotificationsIcon;
