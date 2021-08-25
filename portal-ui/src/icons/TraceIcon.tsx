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

import React from "react";
import { SvgIcon } from "@material-ui/core";
import { IIcon } from "./props";
const TraceIcon = ({ width = 24 }: IIcon) => {
  return (
    <SvgIcon style={{ width: width, height: width }}>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 9.998 10.369">
        <path
          data-name="trace-icn"
          d="M1.11 3.014l2.222 2.541v4.495a.32.32 0 01-.319.319h-.472a.321.321 0 01-.32-.319v-4L0 3.333V.319A.32.32 0 01.319 0h.473a.32.32 0 01.319.319zM3.332.32a.32.32 0 00-.319-.319h-.472a.321.321 0 00-.32.319v2.888l2.223 2.717v4.125a.32.32 0 00.319.319h.473a.32.32 0 00.318-.319V5.43L3.332 2.889zm1.9-.319h-.473A.32.32 0 004.44.32v1.583a.32.32 0 00.319.319h.473a.32.32 0 00.318-.319V.32A.32.32 0 005.236 0zm1.749 4.814h.473a.32.32 0 00.319-.319V.32a.32.32 0 00-.319-.319h-.473a.32.32 0 00-.319.319v4.176a.32.32 0 00.323.318zM9.675.001h-.473a.32.32 0 00-.319.319v1.583a.32.32 0 00.319.319h.473a.32.32 0 00.319-.319V.32A.32.32 0 009.679 0zm0 7.036h-.473a.32.32 0 00-.319.319v2.694a.32.32 0 00.319.319h.473a.32.32 0 00.319-.319V7.356a.32.32 0 00-.315-.32zm0-3.333h-.473a.32.32 0 00-.319.319v.718l-2.222 2.3v3.014a.32.32 0 00.319.319h.473a.32.32 0 00.319-.319V7.782l2.222-2.717V4.028a.32.32 0 00-.315-.328zM.788 5.556H.315a.32.32 0 00-.319.319v4.176a.32.32 0 00.319.319h.473a.32.32 0 00.319-.319V5.875a.32.32 0 00-.315-.32z"
        />
      </svg>
    </SvgIcon>
  );
};

export default TraceIcon;
