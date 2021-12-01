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

const ObjectBrowserIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={`min-icon`}
    fill={"currentcolor"}
    viewBox="0 0 256 256"
    {...props}
  >
    <defs>
      <clipPath id="prefix__a">
        <path d="M0 0h256v256H0z" />
      </clipPath>
    </defs>
    <g data-name="Object Browser" clipPath="url(#prefix__a)">
      <path fill="none" d="M0 0h256v256H0z" />
      <path
        data-name="Uni\xF3n 19"
        d="M36.252 256a17.257 17.257 0 0 1-17.25-17.235V18.076A17.261 17.261 0 0 1 36.252.836h42.193c2.83 0 5.654 0 8.461-.015 23.494-.092 47-.514 70.48-.412 4.9.02 9.809-.1 14.711-.208 6.822-.155 13.645-.311 20.467-.107 6.662.194 13.539.315 20.1 1.793a44.27 44.27 0 0 1 5.01 1.444c11.648 4.182 16.736 14.163 17.836 25.918 1.453 15.7.877 32.2.5 47.945-.412 17.158.014 34.432.014 51.618v109.952a17.244 17.244 0 0 1-17.234 17.235Zm.7-222.336v189.523a14.876 14.876 0 0 0 14.875 14.89H200.2a14.9 14.9 0 0 0 14.885-14.89V81.992h-25.957a37.8 37.8 0 0 1-37.754-37.761V18.769H51.823a14.877 14.877 0 0 0-14.874 14.895Zm130.881 10.567a21.33 21.33 0 0 0 21.3 21.3h25.957V33.663a14.9 14.9 0 0 0-14.885-14.9h-32.371ZM65.4 218.152a6.644 6.644 0 0 1-5.756-9.967l24.891-43.139a6.658 6.658 0 0 1 11.527 0l24.906 43.139a6.652 6.652 0 0 1-5.758 9.967Zm65.869-50.693a31.523 31.523 0 0 1 24.992-36.917 31.529 31.529 0 0 1 36.918 24.993 31.53 31.53 0 0 1-24.992 36.917 31.742 31.742 0 0 1-5.994.574 31.536 31.536 0 0 1-30.927-25.567Zm-70.568-40.454a1.894 1.894 0 0 1-1.895-1.895V71.815a1.894 1.894 0 0 1 1.895-1.895h63.533a1.894 1.894 0 0 1 1.895 1.895v53.295a1.894 1.894 0 0 1-1.895 1.895Z"
        stroke="rgba(0,0,0,0)"
        strokeMiterlimit={10}
      />
      <path data-name="Rect\xE1ngulo 882" fill="none" d="M0 0h256v256H0z" />
    </g>
  </svg>
);

export default ObjectBrowserIcon;
