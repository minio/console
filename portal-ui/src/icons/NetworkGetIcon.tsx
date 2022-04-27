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

const NetworkGetIcon = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={`min-icon`}
      fill={"currentcolor"}
      viewBox="0 0 15 15"
      {...props}
    >
      <path
        d="M7.5,0h0A7.5,7.5,0,0,0,0,7.5H0A7.5,7.5,0,0,0,7.5,15h0a7.5,7.5,0,0,0,0-15M9.978,9.776l-1.9,1.9a.819.819,0,0,1-1.166,0h0L5.022,9.776a.773.773,0,0,1-.186-.864.875.875,0,0,1,.779-.541.793.793,0,0,1,.565.247l.5.5V3.9a.818.818,0,0,1,1.636,0V9.119l.5-.5a.79.79,0,0,1,.564-.248.872.872,0,0,1,.779.541.772.772,0,0,1-.185.864"
        transform="translate(15 15) rotate(180)"
      />
    </svg>
  );
};

export default NetworkGetIcon;
