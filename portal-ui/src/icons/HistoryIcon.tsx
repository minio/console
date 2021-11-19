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

const HistoryIcon = (props: SVGProps<SVGSVGElement>) => {
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
          data-name="Trazado 371"
          d="M146.3 18.756A109.776 109.776 0 0036.677 127.108l-12.934-12.937c-12.336-12.326-31.08 6.426-18.75 18.752l37.576 37.581a13.267 13.267 0 0018.908 0l37.566-37.581c12.336-12.326-6.412-31.078-18.746-18.752l-14.031 14.038a80.128 80.128 0 0180.033-79.8 80.135 80.135 0 0180.047 80.044 80.135 80.135 0 01-80.047 80.047 14.824 14.824 0 00-14.824 14.819 14.825 14.825 0 0014.824 14.823 109.818 109.818 0 00109.7-109.689A109.824 109.824 0 00146.3 18.756z"
        />
        <path
          data-name="Trazado 372"
          d="M151.643 80.893c-.021-1.539-.109-3.244-1.205-4.326-1.125-1.122-2.9-1.175-4.482-1.151l-7.51.1a5.162 5.162 0 00-3.354.836c-1.105.946-1.187 2.6-1.187 4.05-.012 19.174.035 38.35-.057 57.525v.957l41.027 41.007a4.829 4.829 0 002.322 1.547 4.551 4.551 0 003.41-1.261 36.529 36.529 0 007.16-7.184 4.6 4.6 0 001.271-3.421 4.917 4.917 0 00-1.605-2.415l-30.076-29.895a20.639 20.639 0 01-4.781-6.135c-1.178-2.729-1.125-5.8-1.062-8.768q.424-20.735.129-41.466z"
        />
        <g data-name="history-icn">
          <path
            data-name="Trazado 371"
            d="M146.301 18.756A109.776 109.776 0 0036.678 127.108l-12.934-12.937c-12.336-12.326-31.08 6.426-18.75 18.752l37.576 37.581a13.267 13.267 0 0018.908 0l37.566-37.581c12.336-12.326-6.412-31.078-18.746-18.752l-14.031 14.038a80.128 80.128 0 0180.033-79.8 80.135 80.135 0 0180.047 80.044A80.135 80.135 0 01146.3 208.5a14.824 14.824 0 00-14.824 14.819 14.825 14.825 0 0014.824 14.823A109.818 109.818 0 00256 128.453 109.824 109.824 0 00146.301 18.756z"
          />
          <path
            data-name="Trazado 372"
            d="M151.644 80.893c-.021-1.539-.109-3.244-1.205-4.326-1.125-1.122-2.9-1.175-4.482-1.151l-7.51.1a5.162 5.162 0 00-3.354.836c-1.105.946-1.187 2.6-1.187 4.05-.012 19.174.035 38.35-.057 57.525v.957l41.027 41.007a4.829 4.829 0 002.322 1.547 4.551 4.551 0 003.41-1.261 36.529 36.529 0 007.16-7.184 4.6 4.6 0 001.271-3.421 4.917 4.917 0 00-1.605-2.415l-30.076-29.895a20.639 20.639 0 01-4.781-6.135c-1.178-2.729-1.125-5.8-1.062-8.768q.424-20.735.129-41.466z"
          />
        </g>
      </g>
    </svg>
  );
};

export default HistoryIcon;
