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

const EncryptionPoliciesIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="222.448"
    height="257"
    viewBox="0 0 222.448 257"
    className={`min-icon`}
    fill={"currentcolor"}
    {...props}
  >
    <path
      id="kms-policies"
      d="M110.775,256h-.057a20.67,20.67,0,0,1-8.8-1.979C88.485,247.72,45.165,222.878,23,192.407-.823,159.767-1.156,93.423.665,46.359A15.107,15.107,0,0,1,15.69,31.875l2.761.025c18.245,0,53.23-3.677,82.543-28.3A15.033,15.033,0,0,1,110.742,0,15.223,15.223,0,0,1,120.6,3.655c29.235,24.568,64.3,28.237,82.6,28.237l2.221-.017h.12a15.37,15.37,0,0,1,15.308,14.381c1.819,47.114,1.483,113.524-22.344,146.169-22.2,30.464-64.468,54.784-78.883,61.584A20.725,20.725,0,0,1,110.775,256ZM67.861,113.308a12.412,12.412,0,0,0-8.715,21.25L93.388,168.3l64.873-63.751a12.46,12.46,0,0,0-17.254-17.982c-.1.1-.208.2-.308.308v0l-.024,0L93.363,133.448,76.579,116.884A12.341,12.341,0,0,0,67.861,113.308Z"
      transform="translate(0.471 0.5)"
      stroke="rgba(0,0,0,0)"
      strokeMiterlimit="10"
      strokeWidth="1"
    />
  </svg>
);

export default EncryptionPoliciesIcon;
