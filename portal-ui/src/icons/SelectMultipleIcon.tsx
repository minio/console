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

const SelectMultipleIcon = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      {...props}
      className={`min-icon`}
      fill={"currentcolor"}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 18 18"
    >
      <path
        id="bulk-icon"
        d="M16.5,16.5V14.356H14.357V16.5H16.5m-6.429,0V14.356H7.929V16.5h2.143m-6.429,0V14.356H1.5V16.5H3.643M16.5,10.071V7.929H14.357v2.143H16.5m-6.429,0V7.929H7.929v2.143h2.143m-6.429,0V7.929H1.5v2.143H3.643M16.5,3.643V1.5H14.357V3.643H16.5m-6.429,0V1.5H7.929V3.643h2.143m-6.429,0V1.5H1.5V3.643H3.643M17,18H13.857a1,1,0,0,1-1-1V13.857a1,1,0,0,1,1-1H17a1,1,0,0,1,1,1V17A1,1,0,0,1,17,18Zm-6.429,0H7.429a1,1,0,0,1-1-1V13.857a1,1,0,0,1,1-1h3.143a1,1,0,0,1,1,1V17A1,1,0,0,1,10.571,18ZM4.143,18H1a1,1,0,0,1-1-1V13.857a1,1,0,0,1,1-1H4.143a1,1,0,0,1,1,1V17A1,1,0,0,1,4.143,18ZM17,11.571H13.857a1,1,0,0,1-1-1V7.429a1,1,0,0,1,1-1H17a1,1,0,0,1,1,1v3.143A1,1,0,0,1,17,11.571Zm-6.429,0H7.429a1,1,0,0,1-1-1V7.429a1,1,0,0,1,1-1h3.143a1,1,0,0,1,1,1v3.143A1,1,0,0,1,10.571,11.571Zm-6.429,0H1a1,1,0,0,1-1-1V7.429a1,1,0,0,1,1-1H4.143a1,1,0,0,1,1,1v3.143A1,1,0,0,1,4.143,11.571ZM17,5.143H13.857a1,1,0,0,1-1-1V1a1,1,0,0,1,1-1H17a1,1,0,0,1,1,1V4.143A1,1,0,0,1,17,5.143Zm-6.429,0H7.429a1,1,0,0,1-1-1V1a1,1,0,0,1,1-1h3.143a1,1,0,0,1,1,1V4.143A1,1,0,0,1,10.571,5.143Zm-6.429,0H1a1,1,0,0,1-1-1V1A1,1,0,0,1,1,0H4.143a1,1,0,0,1,1,1V4.143A1,1,0,0,1,4.143,5.143Z"
      />
    </svg>
  );
};

export default SelectMultipleIcon;
