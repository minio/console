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

const LockIcon = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      {...props}
      className={`min-icon`}
      fill={"currentcolor"}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="-13.5 0 256 256"
    >
      <path
        data-name="Trazado 406"
        d="M188.653 75.155h-25.707V48.423A48.48 48.48 0 00114.521-.002a48.48 48.48 0 00-48.425 48.425v26.732h-25.71A40.5 40.5 0 00.001 115.68v85.128a40.506 40.506 0 0039.347 40.512l75.172 14.677 75.172-14.677a40.506 40.506 0 0039.347-40.512V115.68a40.5 40.5 0 00-40.386-40.525zm-102.5-26.732a28.4 28.4 0 0128.364-28.365 28.4 28.4 0 0128.364 28.365v26.732H86.152zm122.822 152.385a20.418 20.418 0 01-20.324 20.465h-.97l-73.164 14.285-73.164-14.285h-.97a20.418 20.418 0 01-20.324-20.465V115.68a20.418 20.418 0 0120.324-20.465h148.269a20.418 20.418 0 0120.324 20.465z"
      />
      <path
        data-name="Trazado 407"
        d="M114.262 140.44a19.085 19.085 0 00-19.085 19.086 19.066 19.066 0 008.4 15.818v15.377a10.1 10.1 0 0010.073 10.073h1.218a10.1 10.1 0 0010.073-10.073v-15.377a19.067 19.067 0 008.4-15.818 19.086 19.086 0 00-19.079-19.086z"
      />
    </svg>
  );
};

export default LockIcon;
