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

const EditorThemeSwitchIcon = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={`min-icon`}
      fill={"currentcolor"}
      viewBox="0 0 10.906 10.906"
      {...props}
    >
      <path
        id="Trazado_7002"
        data-name="Trazado 7002"
        d="M8.577,3a5.447,5.447,0,1,0,5.144,4.037,8.109,8.109,0,0,1-.951.783,6.211,6.211,0,0,1-2.174,1,2.252,2.252,0,0,1-2.143-.373,2.252,2.252,0,0,1-.373-2.143,6.234,6.234,0,0,1,1-2.174,8.085,8.085,0,0,1,.783-.951A5.483,5.483,0,0,0,8.577,3Zm2.961,8.536a4.343,4.343,0,0,0,1.228-2.42c-1.934,1.115-3.964,1.225-5.083.106s-1.009-3.149.106-5.083a4.362,4.362,0,1,0,3.75,7.4Z"
        transform="translate(-3.001 -3.001)"
        fill="#969fa8"
      />
    </svg>
  );
};

export default EditorThemeSwitchIcon;
