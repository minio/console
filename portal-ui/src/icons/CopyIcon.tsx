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

const CopyIcon = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      {...props}
      className={`min-icon`}
      fill={"currentcolor"}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 13.677 13.677"
    >
      <path
        d="M41.764,15.9H34.3a1.4,1.4,0,0,0-1.4,1.4v7.46a1.4,1.4,0,0,0,1.4,1.4h7.46a1.4,1.4,0,0,0,1.4-1.4V17.3A1.4,1.4,0,0,0,41.764,15.9Zm.2,8.864a.2.2,0,0,1-.2.2H34.3a.2.2,0,0,1-.2-.2V17.3a.2.2,0,0,1,.2-.2h7.46a.2.2,0,0,1,.2.2Z"
        transform="translate(-29.491 -15.9)"
      />
      <path
        d="M17.3,34.1h.441a.6.6,0,1,0,0-1.2H17.3a1.4,1.4,0,0,0-1.4,1.4v7.46a1.4,1.4,0,0,0,1.4,1.4h7.46a1.4,1.4,0,0,0,1.4-1.4v-.481a.6.6,0,0,0-1.2,0v.481a.2.2,0,0,1-.2.2H17.3a.2.2,0,0,1-.2-.2V34.3A.2.2,0,0,1,17.3,34.1Z"
        transform="translate(-15.9 -29.491)"
      />
    </svg>
  );
};

export default CopyIcon;
