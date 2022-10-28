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

const AccountIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={`min-icon`}
    fill={"currentcolor"}
    viewBox="0 0 256 256"
    {...props}
  >
    <path
      d="M172.07,136.15c-5.91-7.02-8.83-14.66-6.34-24.08,1.2-4.53-1.18-8.5-5.24-10.85-6.26-3.64-9.79-8.84-10.93-16.01-.83-5.19-4.34-8.35-9.52-9.18-6.83-1.09-11.85-4.46-15.38-10.44-2.96-5.02-7.01-6.65-12.76-5.32-8.79,2.04-15.91-1.18-22.42-6.64h-6.88c-7.01,5.93-14.68,8.79-24.06,6.31-4.59-1.21-8.51,1.19-10.87,5.22-3.65,6.26-8.84,9.82-16.02,10.94-5.04,.79-8.27,4.15-9.1,9.1-1.22,7.31-4.86,12.57-11.29,16.27-3.89,2.24-6.09,6.23-4.94,10.58,2.49,9.4-.4,17.07-6.32,24.1v6.88c5.96,7.02,8.77,14.7,6.32,24.1-1.2,4.57,1.26,8.51,5.28,10.85,6.28,3.65,9.75,8.87,10.91,16.02,.84,5.19,4.39,8.31,9.56,9.15,6.81,1.11,11.9,4.44,15.35,10.48,2.41,4.23,6.39,6.8,11.11,5.57,9.42-2.45,17.06,.37,24.06,6.35h6.88c7.01-5.92,14.65-8.83,24.06-6.34,4.57,1.21,8.49-1.22,10.86-5.24,3.67-6.23,8.87-9.81,16.05-10.91,4.85-.74,8.2-3.91,8.99-8.69,1.25-7.64,4.99-13.07,11.71-16.96,3.68-2.12,5.75-6.14,4.61-10.33-2.56-9.4,.36-17.05,6.32-24.06v-6.88Zm-40.57,9.57h-39.33v39.48h-12.27v-39.48H40.57v-12.26h39.33v-39.48h12.27v39.48h39.33v12.26Z"
      style={{ fill: "#07193e" }}
    />
    <g id="Grupo_2537" transform="translate(12.323 0)">
      <g id="Elipse_623" transform="translate(-0.323 -0.249)">
        <circle cx="179.04" cy="66.03" r="66.03" style={{ fill: "#4ccb92" }} />
        <path
          d="M179.05,132.07c-36.42,0-66.04-29.62-66.04-66.03S142.63,0,179.05,0s66.03,29.62,66.03,66.03-29.63,66.03-66.03,66.03Zm0-122.63c-31.21,0-56.61,25.39-56.61,56.6s25.39,56.6,56.61,56.6,56.6-25.39,56.6-56.6-25.39-56.6-56.6-56.6Z"
          style={{ fill: "#fff" }}
        />
      </g>
      <g id="check" transform="translate(2.934 4.069)">
        <g id="Trazado_7261">
          <path d="M197.68,42.49c2.27-2.32,5.99-2.35,8.3-.08s2.35,5.99,.08,8.3l-31.23,39.05c-2.19,2.39-5.9,2.54-8.29,.35-.07-.06-.13-.13-.2-.19l-20.7-20.71c-2.38-2.2-2.52-5.91-.32-8.29,2.2-2.38,5.91-2.52,8.29-.32,.11,.1,.22,.21,.32,.32l16.39,16.38,27.18-34.62,.16-.17h.02Z" />
        </g>
      </g>
    </g>
  </svg>
);
export default AccountIcon;
