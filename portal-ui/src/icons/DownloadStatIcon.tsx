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

const DownloadStatIcon = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      {...props}
      className={`min-icon`}
      fill={"currentcolor"}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 13 13"
    >
      <g transform="translate(0)">
        <path
          className="a"
          fill="#4CCB92"
          d="M1.966,8.119a.69.69,0,0,0,1.38,0V2.355l.782.781A.69.69,0,0,0,5.1,2.161L3.148.206a.69.69,0,0,0-.984,0L.21,2.161a.69.69,0,0,0,.975.975l.781-.781V8.119Z"
          transform="translate(9.248 11.151) rotate(180)"
        />
        <g className="b" stroke="#4CCB92" fill="none" transform="translate(0)">
          <circle className="c" stroke="none" cx="6.5" cy="6.5" r="6.5" />
          <circle className="d" fill="none" cx="6.5" cy="6.5" r="6" />
        </g>
      </g>
    </svg>
  );
};

export default DownloadStatIcon;
