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

const DocumentationIcon = ({ width = 24 }: IIcon) => {
  return (
    <SvgIcon style={{ width: width, height: width }}>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10.863 10.437">
        <path
          data-name="Trazado 356"
          d="M10.26 0H2.548a.59.59 0 00-.6.575V7.94a.59.59 0 00.6.575h7.712a.59.59 0 00.6-.575V.576a.59.59 0 00-.6-.576zm-.662 6.893a.424.424 0 01-.434.414H3.643a.424.424 0 01-.434-.414V1.621a.424.424 0 01.434-.414h5.521a.424.424 0 01.434.414z"
        />
        <rect
          data-name="Rect\xE1ngulo 801"
          width={4.828}
          height={1.207}
          rx={0.604}
          transform="translate(4.023 1.987)"
        />
        <rect
          data-name="Rect\xE1ngulo 802"
          width={4.828}
          height={1.207}
          rx={0.604}
          transform="translate(4.023 3.597)"
        />
        <rect
          data-name="Rect\xE1ngulo 803"
          width={4.828}
          height={1.207}
          rx={0.604}
          transform="translate(4.023 5.206)"
        />
        <path
          data-name="Trazado 357"
          d="M6.073 9.23H1.208V3.158a.367.367 0 00-.365-.365H.366a.367.367 0 00-.365.365v6.914a.367.367 0 00.365.365h5.708a.367.367 0 00.365-.365v-.48a.367.367 0 00-.366-.362z"
        />
      </svg>
    </SvgIcon>
  );
};

export default DocumentationIcon;
