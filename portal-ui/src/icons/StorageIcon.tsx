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
const StorageIcon = ({ width = 24 }: IIcon) => {
  return (
    <SvgIcon style={{ width: width, height: width }}>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 17.03 17.305">
        <g transform="translate(.1 .1)" strokeWidth={0.2}>
          <path
            data-name="Trazado 396"
            d="M15.875 0H.955A.956.956 0 000 .955v3.472a.957.957 0 00.955.956h14.92a.957.957 0 00.956-.956V.955A.957.957 0 0015.875 0zm.019 4.427a.019.019 0 01-.019.019L.937 4.427.956.937l14.938.019z"
          />
          <path
            data-name="Trazado 397"
            d="M15.875 5.861H.955A.956.956 0 000 6.816v3.472a.956.956 0 00.955.956h14.92a.957.957 0 00.956-.956V6.816a.957.957 0 00-.956-.955zm.019 4.427a.019.019 0 01-.019.019L.937 10.288l.019-3.49 14.938.019z"
          />
          <path
            data-name="Trazado 398"
            d="M15.875 11.721H.955a.957.957 0 00-.955.956v3.472a.957.957 0 00.955.956h14.92a.957.957 0 00.956-.956v-3.472a.957.957 0 00-.956-.956zm.019 4.428a.018.018 0 01-.019.019L.937 16.149l.019-3.491 14.938.019z"
          />
          <rect
            data-name="Rect\xE1ngulo 813"
            width={1.555}
            height={1.049}
            rx={0.524}
            transform="translate(1.335 1.469)"
          />
          <rect
            data-name="Rect\xE1ngulo 814"
            width={1.555}
            height={1.049}
            rx={0.524}
            transform="translate(1.335 7.42)"
          />
          <rect
            data-name="Rect\xE1ngulo 815"
            width={1.555}
            height={1.049}
            rx={0.524}
            transform="translate(1.335 13.364)"
          />
        </g>
      </svg>
    </SvgIcon>
  );
};

export default StorageIcon;
