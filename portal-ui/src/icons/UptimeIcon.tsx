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

const UptimeIcon = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      {...props}
      className={`min-icon`}
      fill={"currentcolor"}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="-24.187 0 254.417 254.417"
    >
      <path
        data-name="Sustracci\xF3n 3"
        d="M194.711 153.049H184.19c.012-.6.016-1.138.016-1.653a81.643 81.643 0 00-1.061-13.146h-64.129V60.127l25.357 11.174 44.693 33.842 4.191 33.167a52.729 52.729 0 015.316 4.4 22 22 0 013.371 3.923c.928 1.466 1.24 2.7.932 3.672-.575 1.822-3.321 2.744-8.165 2.744z"
        fill="#e3e3e3"
      />
      <path
        data-name="Uni\xF3n 9"
        d="M0 151.401a102.413 102.413 0 016.553-36.173 102.779 102.779 0 0118.063-30.583 103.552 103.552 0 0112.6-12.447 103.819 103.819 0 0114.568-10.149 102.151 102.151 0 0133.875-12.207l.58-.1v22.724l-.393.088a80.116 80.116 0 00-25.221 10.222 81.119 81.119 0 00-20.129 17.684 80.667 80.667 0 00-13.328 23.446 80.291 80.291 0 00-4.822 27.494 80.772 80.772 0 0080.682 80.678 80.772 80.772 0 0080.684-80.678 80.257 80.257 0 00-4.957-27.862 80.6 80.6 0 00-13.686-23.672 81.1 81.1 0 00-20.631-17.694 79.844 79.844 0 00-25.793-9.942l-.4-.083v-22.65l.576.088a101.976 101.976 0 0134.443 11.887 104.181 104.181 0 0114.84 10.109 105.131 105.131 0 0112.836 12.477 102.82 102.82 0 0118.416 30.8 102.374 102.374 0 016.7 36.542 103.136 103.136 0 01-103.02 103.018A103.137 103.137 0 010 151.401zm103.584 9.849a9.94 9.94 0 01-1.012-.054c-4.676-.093-9.285-3.011-9.285-8.749V30.28L82.496 40.331c-8.852 8.248-22.311-4.3-13.459-12.541L96.014 2.649a10.033 10.033 0 0113.582 0l26.982 25.141c8.854 8.243-4.611 20.789-13.469 12.541L112.328 30.28v112.971h41a9 9 0 019 9 9 9 0 01-9 8.994z"
      />
    </svg>
  );
};

export default UptimeIcon;
