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

function AddFolderIcon({ width = 24 }: IIcon) {
  return (
    <SvgIcon style={{ width: width, height: width }}>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 22.857 18.949">
        <g data-name="add folder-icn">
          <path
            data-name="Trazado 368"
            d="M21.436 4.289a2.64 2.64 0 00-2.637-2.6h-7.277l-.1-.135A3 3 0 009.082.003H4.424A2.64 2.64 0 001.787 2.64a1.773 1.773 0 00.021.276v1.208A2.673 2.673 0 000 6.65c0 .054 0 .108.007.162l.869 9.575a2.671 2.671 0 002.666 2.565h15.751a2.671 2.671 0 002.666-2.563l.89-9.573q.008-.083.008-.166a2.67 2.67 0 00-1.421-2.361zM4.424 1.795h4.658c.59 0 1.223 1.686 1.855 1.686h7.862a.845.845 0 01.843.843v.421H3.602V2.637h-.021a.845.845 0 01.843-.843zm15.743 14.487a.877.877 0 01-.874.874H3.542a.877.877 0 01-.874-.874l-.874-9.634a.877.877 0 01.874-.874h17.521a.877.877 0 01.875.874z"
          />
          <path
            data-name="Trazado 369"
            d="M18.303 10.225h-1.578V8.647a.641.641 0 00-.639-.639h-1.141a.641.641 0 00-.639.639v1.578h-1.578a.641.641 0 00-.639.639v1.141a.641.641 0 00.639.639h1.578v1.578a.641.641 0 00.639.639h1.141a.641.641 0 00.639-.639v-1.578h1.578a.641.641 0 00.639-.639v-1.141a.641.641 0 00-.639-.639z"
          />
        </g>
      </svg>
    </SvgIcon>
  );
}

export default AddFolderIcon;
