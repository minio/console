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

const StarIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={`min-icon`}
    fill={"currentcolor"}
    viewBox="0 0 256 256"
    {...props}
  >
    <polygon points="118.6 2.54 154.49 75.25 234.74 86.91 176.67 143.52 190.38 223.44 118.6 185.71 46.82 223.44 60.53 143.52 2.46 86.91 82.71 75.25 118.6 2.54" />
    <path d="M116.44,3.8l12.23,24.78L148,67.83c1.4,2.84,2.64,5.86,4.24,8.59.69,1.18,1.59,1.25,2.73,1.42l4.87.7,41.32,6,32.35,4.7.52.07L233,85.15l-19.79,19.29L181.83,135c-2.28,2.22-4.71,4.36-6.87,6.7-1,1.12-.73,2.31-.51,3.6l.84,4.93,7.06,41.15,5.53,32.22.08.51,3.68-2.82-24.46-12.86-38.75-20.37c-2.83-1.48-5.62-3.07-8.5-4.47-1.43-.69-2.4-.13-3.59.49l-4.42,2.33L75,205.83,46,221l-.47.24,3.67,2.82,4.67-27.23,7.4-43.15c.54-3.15,1.13-6.3,1.63-9.46.26-1.64-.46-2.34-1.44-3.3l-3.58-3.49L28,108.33,4.61,85.51l-.38-.36-1.1,4.17,27.35-4,43.31-6.29,6.44-.94c1-.15,2.06-.21,3-.44,1.26-.3,1.64-1.24,2.13-2.24L87.58,71l18.48-37.44L120.52,4.27l.24-.47a2.57,2.57,0,0,0-.9-3.42,2.52,2.52,0,0,0-3.42.89L104.31,25.84,85,65l-4.44,9,1.5-1.15L54.93,76.78,11.72,83.06,1.8,84.5c-1.92.28-2.33,3-1.11,4.18l19.62,19.13,31.27,30.48,7.18,7-.64-2.43-4.63,27-7.38,43-1.7,9.88a2.54,2.54,0,0,0,3.67,2.82l24.25-12.75L111,192.53l8.87-4.67h-2.52l24.25,12.75,38.65,20.32,8.87,4.67a2.54,2.54,0,0,0,3.68-2.82l-4.64-27-7.38-43-1.69-9.88-.65,2.43,19.62-19.12,31.28-30.48,7.17-7c1.23-1.19.81-3.9-1.1-4.18l-27.11-3.94-43.22-6.28-9.92-1.44,1.5,1.15L144.52,49.42,125.19,10.26l-4.43-9C119.33-1.61,115,.92,116.44,3.8Z" />
  </svg>
);

export default StarIcon;
