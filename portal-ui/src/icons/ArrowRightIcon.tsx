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

const ArrowRightIcon = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      {...props}
      className={`min-icon`}
      fill={"currentcolor"}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 -50.5875 255.338 255.338"
    >
      <path d="M19.745 57.063c-26.326 0-26.326 40.032 0 40.032H187l-22.68 22.669c-18.608 18.622 9.7 46.922 28.308 28.316l56.73-56.732a20.027 20.027 0 000-28.548l-56.73-56.716c-18.608-18.6-46.916 9.684-28.308 28.3L187 57.064H19.745z" />
    </svg>
  );
};

export default ArrowRightIcon;
