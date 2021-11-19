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

import React, { SVGProps } from "react";

const DeleteIcon = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      {...props}
      className={`min-icon`}
      fill={"currentcolor"}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="-1.405 0 12.646 12.646"
    >
      <path
        data-name="Trazado 359"
        d="M9.527.7h-2.5V.305a.308.308 0 00-.308-.308h-3.6a.308.308 0 00-.308.308V.7h-2.5a.309.309 0 00-.309.309v.787a.309.309 0 00.309.309h9.218a.309.309 0 00.309-.309v-.787A.309.309 0 009.527.7z"
      />
      <path
        data-name="Trazado 360"
        d="M.703 11.225a1.425 1.425 0 001.42 1.421h5.59a1.425 1.425 0 001.42-1.421V2.81H.703z"
      />
    </svg>
  );
};

export default DeleteIcon;
