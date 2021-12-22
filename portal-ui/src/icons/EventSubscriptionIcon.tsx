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

const EventSubscriptionIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="284.616"
    height="49.568"
    className={"min-icon"}
    viewBox="0 0 256 256"
    {...props}
  >
    <defs>
      <clipPath id="clip-Subscribe_to_event">
        <rect width="256" height="256" />
      </clipPath>
    </defs>
    <g
      id="Subscribe_to_event"
      data-name="Subscribe to event"
      clipPath="url(#clip-Subscribe_to_event)"
    >
      <rect width="256" height="256" fill="#fff" />
      <g
        id="subscribe_to_event_icon"
        data-name="subscribe to event icon"
        transform="translate(-675.16 -286.16)"
      >
        <g
          id="Grupo_2272"
          data-name="Grupo 2272"
          transform="translate(676.2 287.84)"
        >
          <g id="Grupo_2271" data-name="Grupo 2271">
            <path
              id="Trazado_7031"
              data-name="Trazado 7031"
              d="M218.265,151a12.276,12.276,0,0,0-12.37,12.1v3.147H184.5c-17.317,0-31.3,13.678-31.3,30.383v178.3c0,16.7,14.1,30.383,31.3,30.383h191.73c17.318,0,31.3-13.678,31.3-30.383v-178.3c0-16.7-14.1-30.383-31.3-30.383h-24.74V163.1a12.372,12.372,0,0,0-24.739,0v3.147H230.634V163.1A12.275,12.275,0,0,0,218.265,151Zm157.96,229.99H184.5a6.408,6.408,0,0,1-6.556-6.173v-127.7H382.9v127.7A6.6,6.6,0,0,1,376.225,380.99ZM326.746,190.461v3.39a12.372,12.372,0,0,0,24.739,0v-3.39h24.74a6.408,6.408,0,0,1,6.556,6.174v26.388H177.939V196.635a6.408,6.408,0,0,1,6.556-6.174h21.4v3.39a12.373,12.373,0,0,0,24.74,0v-3.39Z"
              transform="translate(-153.2 -151)"
              fill="#4ccb92"
            />
            <path
              id="Trazado_7032"
              data-name="Trazado 7032"
              d="M320.582,251.052l-58.245,57.325-20.692-20.386a15.283,15.283,0,0,0-21.459,21.766L262.337,351.3l79.857-78.478a15.336,15.336,0,1,0-21.612-21.765Z"
              transform="translate(-151.567 -145.725)"
              fill="#4ccb92"
            />
          </g>
        </g>
      </g>
    </g>
  </svg>
);

export default EventSubscriptionIcon;
