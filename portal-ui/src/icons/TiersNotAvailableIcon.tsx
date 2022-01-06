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

const TiersNotAvailableIcon = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={`min-icon`}
      fill={"currentcolor"}
      viewBox="0 0 28 28"
      {...props}
    >
      <g id="Tiers-NotAvailable-icon" transform="translate(-340 -149)">
        <circle
          id="Elipse_594"
          data-name="Elipse 594"
          cx="14"
          cy="14"
          r="14"
          transform="translate(340 149)"
          fill="#c83b51"
        />
        <g id="Grupo_2399" data-name="Grupo 2399">
          <g id="TiersIcon" transform="translate(345 154)">
            <rect
              id="Rectángulo_848"
              data-name="Rectángulo 848"
              width="17.95"
              height="17.95"
              transform="translate(0 0.021)"
              fill="none"
            />
            <g id="tiers-icn" transform="translate(-0.001 0)">
              <g id="tiers">
                <path
                  id="Trazado_441"
                  data-name="Trazado 441"
                  d="M13,3a.8.8,0,0,0-.392.092L4.374,7.482a.666.666,0,0,0,0,1.2l2.54,1.354-2.54,1.354a.666.666,0,0,0,0,1.2l2.54,1.353-2.54,1.354a.666.666,0,0,0,0,1.2l8.236,4.39a.8.8,0,0,0,.749,0l8.236-4.39a.666.666,0,0,0,0-1.2l-2.54-1.354,2.54-1.353a.666.666,0,0,0,0-1.2l-2.54-1.354L21.6,8.678a.666.666,0,0,0,0-1.2L13.36,3.092A.8.8,0,0,0,13,3ZM8.414,10.832l4.2,2.237a.8.8,0,0,0,.749,0l4.2-2.237,2.167,1.154-6.739,3.591L6.246,11.986Zm0,3.9,4.2,2.237a.8.8,0,0,0,.749,0l4.2-2.237,2.166,1.154-6.739,3.591L6.246,15.89Z"
                  transform="translate(-4 -3)"
                  fill="#fff"
                />
              </g>
            </g>
          </g>
          <g id="Grupo_2398" data-name="Grupo 2398" transform="translate(-3 5)">
            <circle
              id="Elipse_593"
              data-name="Elipse 593"
              cx="5"
              cy="5"
              r="5"
              transform="translate(358 156)"
              fill="#fff"
            />
            <path
              id="Elipse_593_-_Contorno"
              data-name="Elipse 593 - Contorno"
              d="M5,1A4,4,0,1,0,9,5,4,4,0,0,0,5,1M5,0A5,5,0,1,1,0,5,5,5,0,0,1,5,0Z"
              transform="translate(358 156)"
              fill="#c83b51"
            />
            <g id="Page-1" transform="translate(361.707 159.513)">
              <g id="Fill-2" transform="translate(0 0)">
                <path
                  id="Trazado_6970"
                  data-name="Trazado 6970"
                  d="M2.978.3l-.3-.3L1.489,1.189.3,0,0,.3,1.189,1.489,0,2.678l.3.3L1.489,1.789,2.678,2.978l.3-.3L1.789,1.489Z"
                  transform="translate(0 0)"
                  fill="#c83b51"
                />
                <path
                  id="Trazado_6970_-_Contorno"
                  data-name="Trazado 6970 - Contorno"
                  d="M.3-.354,1.489.835,2.678-.354,3.331.3,2.142,1.489,3.331,2.678l-.653.653L1.489,2.142.3,3.331l-.653-.653L.835,1.489-.354.3Z"
                  transform="translate(0 0)"
                  fill="#c83b51"
                />
              </g>
            </g>
          </g>
        </g>
      </g>
    </svg>
  );
};

export default TiersNotAvailableIcon;
