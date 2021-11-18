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

const HelpIcon = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox={"0 0 12 12"}
      {...props}
      className={`min-icon`}
      fill={"currentcolor"}
    >
      <path
        d="M357.14,346a5,5,0,1,1-5,5,5,5,0,0,1,5-5m0-1a6,6,0,1,0,6,6,6,6,0,0,0-6-6Z"
        transform="translate(-351.14 -345.03)"
      />
      <path
        d="M356.21,352.42v-1.86h.52c1.23,0,1.92-.45,1.92-1.29s-.68-1.18-1.89-1.18a8.07,8.07,0,0,0-.93.06l-.1-1.25a9.13,9.13,0,0,1,1.08-.08c2,0,3.19.94,3.19,2.4s-.93,2.24-2.64,2.46l-.05.74Zm1.56,1.8a1,1,0,1,1-1-1A1,1,0,0,1,357.77,354.22Z"
        transform="translate(-351.14 -345.03)"
      />
    </svg>
  );
};

export default HelpIcon;
