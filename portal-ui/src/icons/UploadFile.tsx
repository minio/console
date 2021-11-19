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

const UploadFile = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      {...props}
      className={`min-icon`}
      fill={"currentcolor"}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 13 12.996"
    >
      <g transform="translate(-63.686 -70.783)">
        <path
          className="a"
          d="M74.736,79.879v1.95h-9.1v-1.95h-1.95v3.9h13v-3.9Z"
        />
        <path
          className="a"
          d="M69.211,80.533h1.95V73.861h1.525l-2.5-3.078-2.5,3.078h1.525Z"
        />
      </g>
    </svg>
  );
};

export default UploadFile;
