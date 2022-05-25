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

import * as React from "react";
import { SVGProps } from "react";

const HealthMenuIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={`min-icon`}
    fill={"currentcolor"}
    viewBox="0 0 256 256"
    {...props}
  >
    <g id="health-icon" transform="translate(-7440.898 -155.188)">
      <path
        id="Unión_51"
        data-name="Unión 51"
        d="M29.764,256A29.756,29.756,0,0,1,0,226.113V74.364H32.285V223.717H181.242V256Zm189.61-6.664V219.62h29.721v29.716Zm4.342-68.343V32.283H74.76V0H226.227A29.815,29.815,0,0,1,256,29.713v151.28Zm-72.251-.018V151.259h29.8v29.716Zm-76.706,0V151.259h29.8v29.716Zm76.706-76.9V74.364h29.8V104.08Zm-76.649,0V74.364h29.72V104.08ZM6.9,36.867V7.151h29.72V36.867Z"
        transform="translate(7440.898 155.188)"
      />
    </g>
  </svg>
);

export default HealthMenuIcon;
