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

const FilePptIcon = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      {...props}
      className={`min-icon`}
      fill={"currentcolor"}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="-19.208 0 256 256"
    >
      <path
        data-name="Trazado 444"
        d="M216.958 77.225c-.42-38.067 10.409-79.987-43.432-77.084-38.015.09-76.056.657-114.089.743h-42.2A17.258 17.258 0 000 18.125v220.64a17.258 17.258 0 0017.239 17.237h182.507a17.257 17.257 0 0017.237-17.237c.186-53.84-.296-107.719-.025-161.54zM196.04 223.186a14.885 14.885 0 01-14.885 14.885H32.813a14.885 14.885 0 01-14.885-14.885V33.698a14.885 14.885 0 0114.885-14.885h99.53c-1.936 29.6.791 61.322 37.752 63.206h25.946zm0-157.627c-17.937-.276-46.31 4.9-47.237-21.294V18.812c50.266-.527 47.99-3.935 47.237 46.748z"
      />
      <path
        data-name="Trazado 445"
        d="M157.796 143.179h-38.679V104.5a14.6 14.6 0 00-14.583-14.583 67.336 67.336 0 00-47.88 19.964c-.024.025-.05.049-.074.076-14.337 14.727-21.3 32.279-20.122 50.76 1.034 16.3 8.392 32.066 20.717 44.393s28.09 19.689 44.391 20.728q2.015.128 4.01.128c17.006 0 33.1-6.949 46.761-20.245.027-.025.052-.051.077-.077a67.335 67.335 0 0019.965-47.881 14.6 14.6 0 00-14.583-14.584zm-16.552 51.22c-25.22 24.5-55.446 16.923-72.862-.5s-24.991-47.642-.484-72.852a51.594 51.594 0 0135.368-15.27V151.1a7.924 7.924 0 007.925 7.925h45.322a51.61 51.61 0 01-15.269 35.374z"
      />
      <path
        data-name="Trazado 446"
        d="M136.325 89.756a11.919 11.919 0 00-9.153 8.878 7.865 7.865 0 00-.234 2.081c.124 6-.008 10.657-.115 14.4-.229 8.036-.38 13.344 3.644 17.37 3.151 3.152 6.925 3.753 12.42 3.753 1.532 0 3.2-.047 5.02-.1 3.731-.106 8.373-.237 14.344-.116a8.045 8.045 0 002.08-.233 11.921 11.921 0 008.874-9.17c2.028-9.1-5.3-22.075-10.235-26.638-4.575-4.933-17.569-12.261-26.645-10.225zm11.138 30.541c-1.668.045-3.5.076-4.892.1 0-1.416.049-3.18.1-4.827.073-2.561.165-5.778.17-9.627 3.109 1.117 7.123 3.316 8.387 4.679a7.176 7.176 0 001.073 1.079c1.4 1.3 3.612 5.322 4.728 8.433-3.823.001-7.018.086-9.564.163z"
      />
    </svg>
  );
};

export default FilePptIcon;
