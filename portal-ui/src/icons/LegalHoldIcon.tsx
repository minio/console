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

const LegalHoldIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={`min-icon`}
    fill={"currentcolor"}
    viewBox="0 0 256 256"
    {...props}
  >
    <path
      d="M253.46,219.34a17.76,17.76,0,0,1-5.37,13L232.57,248a18.57,18.57,0,0,1-13.19,5.38,17.74,17.74,0,0,1-13-5.38l-52.61-52.77a17.23,17.23,0,0,1-5.5-13.05,19.26,19.26,0,0,1,6.27-13.93L117.34,131.2,99.08,149.45a7,7,0,0,1-9.85,0l1.82,1.74a16.14,16.14,0,0,1,1.82,1.88,16.44,16.44,0,0,0,1.44,1.67,7.38,7.38,0,0,1,1.45,2c.19.49.48,1.14.87,2a9.89,9.89,0,0,1,.8,2.41,14.26,14.26,0,0,1-3.85,12.55q-.43.44-2.4,2.61t-2.76,3q-.8.79-2.7,2.4a16.88,16.88,0,0,1-3.2,2.24,28.58,28.58,0,0,1-3.2,1.3,11.22,11.22,0,0,1-3.76.65,13.45,13.45,0,0,1-9.85-4.06L6.6,122.42a13.43,13.43,0,0,1-4.06-9.85,11.4,11.4,0,0,1,.75-3.7,27,27,0,0,1,1.21-3.18,17.84,17.84,0,0,1,2.24-3.2c1.06-1.25,1.86-2.15,2.41-2.68s1.53-1.45,3-2.76l2.61-2.38a14.26,14.26,0,0,1,12.55-3.85,9.68,9.68,0,0,1,2.4.8l2,.87a7.33,7.33,0,0,1,2,1.45,20.77,20.77,0,0,0,1.67,1.44,19.1,19.1,0,0,1,1.89,1.82L38.9,99a7,7,0,0,1,0-9.85L89.21,38.78a7,7,0,0,1,9.85,0L97.24,37a13.64,13.64,0,0,1-1.8-1.92A11,11,0,0,0,94,33.44a6,6,0,0,1-1.44-2,20.39,20.39,0,0,0-.88-2,8.81,8.81,0,0,1-.8-2.4,17.58,17.58,0,0,1-.23-2.61,14.07,14.07,0,0,1,4.06-9.85c.29-.3,1.1-1.17,2.41-2.62s2.23-2.43,2.76-2.95,1.42-1.33,2.67-2.4a16.88,16.88,0,0,1,3.2-2.24,27.73,27.73,0,0,1,3.18-1.21,11.22,11.22,0,0,1,3.76-.65,13.48,13.48,0,0,1,9.79,4L181.7,65.67a13.39,13.39,0,0,1,4.05,9.85,11.22,11.22,0,0,1-.65,3.76,26.74,26.74,0,0,1-1.29,3.2,16.88,16.88,0,0,1-2.24,3.2q-1.59,1.88-2.4,2.67t-3,2.7l-2.62,2.41A14.24,14.24,0,0,1,161,97.3a10.31,10.31,0,0,1-2.41-.79l-1.86-.84a7.3,7.3,0,0,1-2-1.44,19.31,19.31,0,0,0-1.68-1.44A18,18,0,0,1,151.25,91l-1.73-1.82a7,7,0,0,1,0,9.85l-18.28,18.27,37.12,37.12a19.24,19.24,0,0,1,13.92-6.27,18.53,18.53,0,0,1,13.2,5.37l52.61,52.57a18.59,18.59,0,0,1,5.37,13.19Z"
      transform="translate(-2.54 -2.58)"
    />
  </svg>
);

export default LegalHoldIcon;
