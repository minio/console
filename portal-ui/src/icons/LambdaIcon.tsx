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

const LambdaIcon = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      {...props}
      className={`min-icon`}
      fill={"currentcolor"}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 227.615 256"
    >
      <path
        data-name="Trazado 442"
        d="M35.802 0a15.363 15.363 0 000 30.727c23.352 0 32.017 14.872 40.928 34.353l1.475 3.134c1.229 2.643 3.872 8.542 7.436 16.408L1.757 233.094a15.363 15.363 0 0026.729 15.118l72.823-128.623c19.481 44 44 99.494 44.431 100.415a58.2 58.2 0 0071.046 33.37 15.376 15.376 0 00-9.1-29.375 27.531 27.531 0 01-33.861-16.593c-2.458-5.531-59.856-135.751-67.6-152.282l-1.352-2.95C96.948 35.336 80.786 0 35.802 0z"
      />
    </svg>
  );
};

export default LambdaIcon;
