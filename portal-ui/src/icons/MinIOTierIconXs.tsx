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

import React, { SVGProps } from "react";

const MinIOTierIconXs = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={`min-icon`}
      fill={"currentcolor"}
      viewBox="0 0 10.868 22"
      {...props}
    >
      <path
        id="minio-logo-color"
        d="M36.179,13.541q-.834-1.379-1.673-2.755c-.29-.476-.585-.949-.88-1.422l-.116-.172a2.047,2.047,0,0,0-2.624-.836,1.84,1.84,0,0,0-.846,2.481,4.385,4.385,0,0,0,.749.931c.841.894,1.709,1.762,2.544,2.662a2.626,2.626,0,0,1-.915,4.225l-.056.023V14.492a13.556,13.556,0,0,0-3.918,3.036,13.227,13.227,0,0,0-3.075,6.117L28.2,22.2c.942-.479,1.878-.95,2.856-1.446V28.83l1.3,1.323V20.076s.03-.014.127-.067a10.787,10.787,0,0,0,1.143-.633,3.862,3.862,0,0,0,.567-5.84c-.969-1.013-1.942-2.022-2.91-3.037a.623.623,0,0,1,0-.93.643.643,0,0,1,.935.053c.135.136,1.043,1.1,1.367,1.435q1.228,1.286,2.459,2.567a1.752,1.752,0,0,0,.136.116l.051-.03A.815.815,0,0,0,36.179,13.541Zm-5.124,5.715a.235.235,0,0,1-.119.159c-.519.275-1.042.543-1.564.811l-1.9.976a12.318,12.318,0,0,1,3.568-4.421l.023-.019C31.06,17.572,31.063,18.448,31.055,19.257Z"
        transform="translate(-25.369 -8.153)"
      />
    </svg>
  );
};

export default MinIOTierIconXs;
