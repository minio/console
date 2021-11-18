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

const DiagnosticsIcon = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      {...props}
      className={`min-icon`}
      fill={"currentcolor"}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 10.405 10.405"
    >
      <path
        d="M9.932 4.778a.424.424 0 00-.424.424 4.31 4.31 0 01-4.305 4.3 4.309 4.309 0 01-4.3-4.3A4.311 4.311 0 014.784.918v1.259A3.06 3.06 0 002.15 5.202 3.062 3.062 0 005.208 8.26a3.062 3.062 0 003.058-3.058 3.06 3.06 0 00-2.634-3.025V.049h-.424A5.158 5.158 0 00.055 5.201a5.158 5.158 0 005.153 5.153 5.158 5.158 0 005.153-5.153.424.424 0 00-.429-.423zm-2.519.424a2.213 2.213 0 01-2.21 2.21 2.213 2.213 0 01-2.21-2.21A2.213 2.213 0 014.78 3.035v1.231a1.028 1.028 0 00-.606.936 1.03 1.03 0 001.03 1.03 1.03 1.03 0 001.03-1.03 1.028 1.028 0 00-.605-.936V3.035a2.212 2.212 0 011.784 2.167z"
        stroke="#000"
        strokeWidth={0.1}
      />
    </svg>
  );
};

export default DiagnosticsIcon;
