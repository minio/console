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

const GoogleTierIcon = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={`min-icon`}
      fill={"currentcolor"}
      viewBox="0 0 42.239 33.998"
      {...props}
    >
      <g id="google-cloud-logo-color" transform="translate(-526 -141)">
        <g
          id="Grupo_1820"
          data-name="Grupo 1820"
          transform="translate(526 141)"
        >
          <path
            id="Trazado_6946"
            data-name="Trazado 6946"
            d="M78,40.648h1.288l3.671-3.671.18-1.559A16.5,16.5,0,0,0,56.295,43.47a1.988,1.988,0,0,1,1.288-.076l7.343-1.212s.373-.619.568-.581a9.159,9.159,0,0,1,12.535-.953Z"
            transform="translate(-51.201 -31.287)"
            fill="#ea4335"
          />
          <path
            id="Trazado_6947"
            data-name="Trazado 6947"
            d="M238.1,84.8a16.527,16.527,0,0,0-4.985-8.037l-5.152,5.152a9.161,9.161,0,0,1,3.362,7.267V90.1a4.587,4.587,0,0,1,0,9.173h-9.173l-.915.928v5.5l.915.915h9.173A11.932,11.932,0,0,0,238.1,84.8Z"
            transform="translate(-201.103 -72.617)"
            fill="#4285f4"
          />
          <path
            id="Trazado_6948"
            data-name="Trazado 6948"
            d="M12.273,142.319a11.928,11.928,0,0,0-7.2,21.384l5.319-5.319a4.586,4.586,0,1,1,6.067-6.067L21.779,147a11.9,11.9,0,0,0-9.505-4.678Z"
            transform="translate(-0.415 -132.197)"
            fill="#fbbc05"
          />
        </g>
      </g>
    </svg>
  );
};

export default GoogleTierIcon;
