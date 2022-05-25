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

const CreateIcon = (props: SVGProps<SVGSVGElement>) => (
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
      <path data-name="Rect\xE1ngulo 858" fill="none" d="M0 0h256v256H0z" />
      <path
        data-name="Uni\xF3n 20"
        d="M102.405 230.399v-76.79h-76.8a25.607 25.607 0 0 1 0-51.214h76.8V25.601a25.6 25.6 0 1 1 51.2 0v76.792h76.8a25.607 25.607 0 0 1 0 51.214h-76.8v76.792a25.6 25.6 0 1 1-51.2 0Z"
      />
    </g>
  </svg>
);

export default CreateIcon;
