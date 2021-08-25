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

const LicenseIcon = ({ width = 24 }: IIcon) => {
  return (
    <SvgIcon style={{ width: width, height: width }}>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 11.595 10.953">
        <g transform="translate(.1 .1)" strokeWidth={0.2}>
          <path
            data-name="Trazado 354"
            d="M8.632 0a2.764 2.764 0 00-1.324.338A2.762 2.762 0 005.96 2.074L.671 2.12A.7.7 0 000 2.843v7.186a.7.7 0 00.671.723h7.952a.7.7 0 00.671-.723V5.44a2.765 2.765 0 002.1-2.679A2.766 2.766 0 008.632 0zm-.036 9.376a.6.6 0 01-.58.625H1.277a.6.6 0 01-.58-.625V3.5a.6.6 0 01.58-.624h4.6a2.763 2.763 0 002.721 2.65zm.7-4.652v-.017l-.019.024a2.067 2.067 0 01-.644.1 2.074 2.074 0 01-2.072-2.072A2.072 2.072 0 017.64.94a2.073 2.073 0 01.993-.253 2.074 2.074 0 012.072 2.072 2.074 2.074 0 01-1.411 1.965z"
          />
          <path
            data-name="Trazado 355"
            d="M9.927 2.044a.278.278 0 00-.393 0L8.486 3.09l-.424-.424a.28.28 0 00-.382 0 .28.28 0 00-.014.4l.622.622a.275.275 0 00.2.083.273.273 0 00.2-.083l1.246-1.244h0a.278.278 0 000-.394z"
          />
          <rect
            data-name="Rect\xE1ngulo 798"
            width={4}
            height={1}
            rx={0.5}
            transform="translate(1.999 4)"
          />
          <rect
            data-name="Rect\xE1ngulo 799"
            width={5}
            height={1}
            rx={0.5}
            transform="translate(1.999 6)"
          />
          <rect
            data-name="Rect\xE1ngulo 800"
            width={5}
            height={1}
            rx={0.5}
            transform="translate(1.999 8)"
          />
        </g>
      </svg>
    </SvgIcon>
  );
};

export default LicenseIcon;
