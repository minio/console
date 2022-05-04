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

const UploadStatIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={`min-icon`}
    fill={"currentcolor"}
    viewBox="0 0 256 256"
    {...props}
  >
    <path d="M125.65,251.3h0c69.4,0,125.65-56.26,125.65-125.65h0C251.3,56.26,195.05,0,125.65,0h0C56.26,0,0,56.26,0,125.65s56.26,125.65,125.65,125.65M84.14,87.53l31.76-31.76c5.32-5.39,14-5.45,19.39-.13,.04,.04,.09,.09,.13,.13h0l31.74,31.76c3.97,3.69,5.22,9.46,3.14,14.47-2.19,5.32-7.3,8.87-13.05,9.06-3.57-.06-6.97-1.55-9.42-4.15l-8.4-8.4v87.53c0,7.57-6.15,13.71-13.72,13.7-7.57,0-13.7-6.14-13.7-13.7V98.53l-8.4,8.39c-2.45,2.6-5.85,4.1-9.42,4.16-5.76-.18-10.87-3.73-13.05-9.06-2.09-5-.83-10.78,3.14-14.47" />
  </svg>
);

export default UploadStatIcon;
