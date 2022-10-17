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

const EncryptionKeysIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    id="kms-keys"
    xmlns="http://www.w3.org/2000/svg"
    width="256"
    height="256"
    viewBox="0 0 256 256"
    className={`min-icon`}
    fill={"currentcolor"}
    {...props}
  >
    <path
      id="Trazado_7179"
      data-name="Trazado 7179"
      d="M305.4,148.183a82.215,82.215,0,0,0-78.6,106.155l-94.871,94.987v54.857h54.784l94.854-95A82.245,82.245,0,0,0,387.577,237.21a80.278,80.278,0,0,0-15.056-54.857A82.142,82.142,0,0,0,305.4,148.183Zm9.126,91.432a18.286,18.286,0,1,1,18.264-18.281A18.273,18.273,0,0,1,314.529,239.615Z"
      transform="translate(-131.934 -148.182)"
    />
  </svg>
);

export default EncryptionKeysIcon;
