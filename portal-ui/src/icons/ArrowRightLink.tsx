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

import React, { SVGProps } from "react";

const ArrowRightLink = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={`min-icon`}
      fill={"currentcolor"}
      {...props}
      viewBox="0 0 12.621 7.619"
    >
      <path
        d="M2.82.976A.989.989,0,0,1,4.8.976V9.243L5.919,8.122a.989.989,0,0,1,1.4,1.4l-2.8,2.8a.989.989,0,0,1-1.411,0L.3,9.521a.989.989,0,0,1,1.4-1.4L2.82,9.243V.976Z"
        transform="translate(0 7.619) rotate(-90)"
        fill="#2781b0"
      />
    </svg>
  );
};

export default ArrowRightLink;
