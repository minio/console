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

import * as React from "react";
import { SVGProps } from "react";

const NextArrowIcon = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      {...props}
      className={`min-icon`}
      fill={"currentcolor"}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 -2.4905 12.621 12.621"
    >
      <path
        d="M2.821,11.646a.989.989,0,0,0,1.979,0V3.378L5.92,4.5a.99.99,0,0,0,1.4-1.4L4.515.3A.989.989,0,0,0,3.1.3L.3,3.1A.989.989,0,0,0,1.7,4.5L2.821,3.378v8.268Z"
        transform="translate(12.621) rotate(90)"
      />
    </svg>
  );
};

export default NextArrowIcon;
