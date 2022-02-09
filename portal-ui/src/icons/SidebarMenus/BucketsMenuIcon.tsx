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

const BucketsMenuIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={`min-icon`}
    fill={"currentcolor"}
    viewBox="0 0 16 16"
    {...props}
  >
    <defs>
      <clipPath id="clip-path-buckets">
        <rect
          id="Rectángulo_928"
          data-name="Rectángulo 928"
          width="15.957"
          height="15.928"
        />
      </clipPath>
    </defs>
    <g id="BucketsIcons-Full" transform="translate(0.283)">
      <g id="BucketsIcon-full" transform="translate(-0.283)">
        <rect
          id="Rectángulo_884"
          data-name="Rectángulo 884"
          width="15.939"
          height="15.911"
          transform="translate(0.061)"
          fill="none"
        />
        <g
          id="Grupo_2272"
          data-name="Grupo 2272"
          transform="translate(0 0.072)"
        >
          <g
            id="Grupo_2271"
            data-name="Grupo 2271"
            clipPath="url(#clip-path-buckets)"
          >
            <path
              id="Trazado_7002"
              data-name="Trazado 7002"
              d="M15.619.545A1.341,1.341,0,0,0,14.553,0H1.386A1.34,1.34,0,0,0,.32.545a1.606,1.606,0,0,0-.3,1.242c.325,1.888,1.009,5.869,1.557,9.045v.006c.277,1.616.519,3.023.661,3.84A1.422,1.422,0,0,0,3.6,15.911h8.733A1.423,1.423,0,0,0,13.7,14.679l.659-3.836,0-.023.893-5.2,0-.015.658-3.821a1.6,1.6,0,0,0-.3-1.242M13.187,11.3l-10.426,0-.2-1.189H13.383Zm.89-5.216-12.221,0L1.651,4.9H14.273Z"
              transform="translate(0.061 -0.072)"
            />
          </g>
        </g>
      </g>
      <rect
        id="Rectángulo_929"
        data-name="Rectángulo 929"
        width="15.957"
        height="15.928"
        transform="translate(-0.283 0.072)"
        fill="none"
      />
    </g>
  </svg>
);

export default BucketsMenuIcon;
