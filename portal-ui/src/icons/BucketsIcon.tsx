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
import { SvgIcon } from "@material-ui/core";
import { IIcon } from "./props";

function BucketsIcon({ width = 24 }: IIcon) {
  return (
    <SvgIcon style={{ width: width, height: width }}>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 13.835 12.685">
        <path d="M13.149 4.508v-.012l.563-3a1.178 1.178 0 00-.253-.975 1.184 1.184 0 00-.912-.428H1.283a1.184 1.184 0 00-.912.428 1.182 1.182 0 00-.253.975l1.331 7.1v.005l.565 3.013a1.184 1.184 0 001.164.967h7.471a1.185 1.185 0 001.164-.967l.564-3.01v-.018zM2.288 8.044c-.191-1.023-.4-2.129-.594-3.171h10.448l-.595 3.171zm10.519-6.716l-.49 2.621h-10.8c-.2-1.055-.373-1.988-.491-2.621a.262.262 0 01.056-.214.26.26 0 01.2-.094h11.265a.26.26 0 01.2.095.261.261 0 01.059.218zm-1.433 7.64l-.464 2.476a.261.261 0 01-.257.213H3.182a.262.262 0 01-.257-.213c-.1-.549-.27-1.437-.464-2.476z" />
        <path
          data-name="buckets-icn - Contorno"
          d="M1.286 0H12.55a1.284 1.284 0 01.989.464 1.277 1.277 0 01.274 1.057l-1.9 10.116a1.286 1.286 0 01-1.262 1.048H3.18a1.284 1.284 0 01-1.262-1.048l-.565-3.013-.717-3.822-.614-3.277A1.281 1.281 0 01.296.468 1.285 1.285 0 011.286 0zm11.769 4.479l.562-3a1.078 1.078 0 00-.232-.892 1.084 1.084 0 00-.835-.392H1.286a1.085 1.085 0 00-.835.392 1.083 1.083 0 00-.231.892l.615 3.277.716 3.821.565 3.014a1.084 1.084 0 001.066.885h7.471a1.086 1.086 0 001.066-.885zM1.285.924H12.55a.36.36 0 01.278.131.36.36 0 01.077.3l-.506 2.7H1.437l-.015-.082-.282-1.505-.209-1.115a.361.361 0 01.077-.3.36.36 0 01.277-.129zm10.948 2.929l.475-2.539a.161.161 0 00-.034-.131.161.161 0 00-.125-.059H1.284a.159.159 0 00-.123.058.16.16 0 00-.034.133l.208 1.114.267 1.424zm-10.66.924h10.689l-.022.118-.61 3.252H2.204l-.015-.082c-.191-1.023-.4-2.129-.594-3.171zm10.448.2H1.814l.556 2.971h9.094zM2.34 8.872h9.153l-.022.118-.464 2.476a.362.362 0 01-.355.295H3.181a.362.362 0 01-.355-.294c-.046-.247-.1-.561-.174-.927l-.29-1.549zm8.912.2H2.581c.1.527.189 1.013.268 1.431l.173.927a.162.162 0 00.159.131h7.471a.162.162 0 00.159-.132z"
        />
      </svg>
    </SvgIcon>
  );
}

export default BucketsIcon;
