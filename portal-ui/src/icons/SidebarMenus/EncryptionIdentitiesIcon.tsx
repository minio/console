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

const EncryptionIdentitiesIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="222.45"
    height="257"
    viewBox="0 0 222.45 257"
    className={`min-icon`}
    fill={"currentcolor"}
    {...props}
  >
    <path
      id="kms-identities"
      d="M110.775,256h-.058a20.679,20.679,0,0,1-8.8-1.979c-13.427-6.3-56.747-31.142-78.913-61.613C-.823,159.768-1.157,93.424.665,46.359A15.106,15.106,0,0,1,15.69,31.875l2.761.025c18.245,0,53.23-3.677,82.543-28.3A15.032,15.032,0,0,1,110.742,0,15.223,15.223,0,0,1,120.6,3.655c29.234,24.568,64.3,28.237,82.6,28.237l2.221-.017h.121a15.369,15.369,0,0,1,15.308,14.38c1.821,47.112,1.487,113.521-22.344,146.169-22.192,30.462-64.467,54.783-78.883,61.584A20.736,20.736,0,0,1,110.775,256Zm-.25-114.83c-.744,0-1.53.018-2.4.054l-.131,0-.139,0a54.16,54.16,0,0,0-5.839.611c-13.791,2.192-26.831,9.651-34.882,19.953-.337.431-.664.869-.911,1.2a17.474,17.474,0,0,0-1.426,18.535,16.3,16.3,0,0,0,2.716,3.7,16.529,16.529,0,0,0,3.589,2.774,17.377,17.377,0,0,0,4.275,1.734,19.074,19.074,0,0,0,4.728.6h61.418a19.2,19.2,0,0,0,4.77-.6,17.4,17.4,0,0,0,4.287-1.759,16.056,16.056,0,0,0,6.242-6.566,17.824,17.824,0,0,0-2.034-19.221,55,55,0,0,0-20.838-15.981,58.975,58.975,0,0,0-11.527-3.763A56.669,56.669,0,0,0,110.525,141.17Zm.283-75.5c-20.025,0-36.317,15.713-36.317,35.027s16.292,35.027,36.317,35.027,36.325-15.713,36.325-35.027S130.838,65.672,110.808,65.672Z"
      transform="translate(0.471 0.5)"
      stroke="rgba(0,0,0,0)"
      strokeMiterlimit="10"
      strokeWidth="1"
    />
  </svg>
);

export default EncryptionIdentitiesIcon;
