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

const CreateIcon = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      {...props}
      className={`min-icon`}
      fill={"currentcolor"}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 12 12"
    >
      <g id="Group_55" data-name="Group 55" transform="translate(1002 -2555)">
        <rect
          id="Rectangle_29"
          width="2"
          height="12"
          transform="translate(-997 2555)"
        />
        <rect
          id="Rectangle_30"
          width="2"
          height="12"
          transform="translate(-990 2560) rotate(90)"
        />
      </g>
    </svg>
  );
};

export default CreateIcon;
