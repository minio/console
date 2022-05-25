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

const DownloadIcon = (props: SVGProps<SVGSVGElement>) => (
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
    <g clipPath="url(#prefix__a)">
      <path fill="none" d="M0 0h256v256H0z" />
      <path data-name="Rect\xE1ngulo 870" fill="none" d="M0 0h256v256H0z" />
      <g data-name="download-icn">
        <path
          data-name="Trazado 362"
          d="M0 104.08c0-21.751 32.822-21.751 32.822 0v118.833h190.356V104.08c0-21.751 32.822-21.751 32.822 0v135.381a16.48 16.48 0 0 1-16.4 16.54H16.415a16.485 16.485 0 0 1-16.413-16.54V104.08Zm144.415-87.773c0-21.741-32.826-21.741-32.826 0v138.227l-18.591-18.743c-15.263-15.385-38.474 8.006-23.211 23.391l46.51 46.879a16.339 16.339 0 0 0 23.406 0l46.507-46.879c15.266-15.385-7.945-38.776-23.208-23.391l-18.587 18.743V16.306Z"
        />
      </g>
    </g>
  </svg>
);

export default DownloadIcon;
