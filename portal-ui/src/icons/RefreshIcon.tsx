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

const RefreshIcon = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      {...props}
      className={`min-icon`}
      fill={"currentcolor"}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="-1.475 0 21.107 21.107"
    >
      <path d="M0 12.028a9.086 9.086 0 018.968-9.073l-1.071-1.07A1.1 1.1 0 019.449.333l3.11 3.11a1.1 1.1 0 010 1.565l-3.11 3.11a1.1 1.1 0 01-1.552-1.552l1.161-1.161a6.632 6.632 0 00-6.6 6.624 6.633 6.633 0 006.625 6.625 6.633 6.633 0 006.625-6.625 1.227 1.227 0 011.227-1.227 1.227 1.227 0 011.227 1.227 9.089 9.089 0 01-9.079 9.079A9.089 9.089 0 010 12.028z" />
    </svg>
  );
};

export default RefreshIcon;
