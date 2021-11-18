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

const SearchIcon = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      {...props}
      className={`min-icon`}
      fill={"currentcolor"}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 256 256"
    >
      <defs>
        <clipPath id="prefix__a">
          <path d="M0 0h256v256H0z" />
        </clipPath>
      </defs>
      <g clipPath="url(#prefix__a)">
        <path
          data-name="Trazado 399"
          d="M199 179.647a109.961 109.961 0 0023.973-68.662 110.985 110.985 0 10-110.988 110.984 109.957 109.957 0 0065.7-21.605l51.5 51.5a14.865 14.865 0 0010.359 4.439 14.359 14.359 0 0010.359-4.439 14.652 14.652 0 000-21.013zM30.6 110.984a81.389 81.389 0 1181.389 81.389A81.343 81.343 0 0130.6 110.984z"
        />
      </g>
    </svg>
  );
};

export default SearchIcon;
