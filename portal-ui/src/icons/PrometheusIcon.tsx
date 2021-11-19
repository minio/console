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

const PrometheusIcon = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      {...props}
      className={`min-icon`}
      fill={"currentcolor"}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 28 27.999"
    >
      <path
        id="prometheus-icon"
        d="M14,.667a14,14,0,1,0,14,14A14,14,0,0,0,14,.667Zm0,26.2c-2.2,0-3.983-1.469-3.983-3.282h7.967C17.983,25.4,16.2,26.869,14,26.869ZM20.579,22.5H7.42V20.114H20.58V22.5h0Zm-.047-3.614H7.458c-.044-.05-.088-.1-.13-.15a9.536,9.536,0,0,1-1.972-3.36c-.005-.029,1.633.335,2.8.6,0,0,.6.138,1.472.3a5.463,5.463,0,0,1-1.338-3.513c0-2.806,2.153-5.259,1.376-7.241.756.061,1.564,1.6,1.619,3.993a8.574,8.574,0,0,0,1.14-4.381c0-1.287.848-2.783,1.7-2.834-.756,1.246.2,2.315,1.042,4.966.317,1,.277,2.671.522,3.734.081-2.207.461-5.427,1.861-6.539-.618,1.4.091,3.152.576,3.994a7.568,7.568,0,0,1,1.257,4.335,5.416,5.416,0,0,1-1.3,3.5c.924-.173,1.563-.33,1.563-.33l3-.586A8.512,8.512,0,0,1,20.532,18.886Z"
        transform="translate(0 -0.667)"
        fill="#07193e"
      />
    </svg>
  );
};

export default PrometheusIcon;
