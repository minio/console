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

const AddFolderIcon = (props: SVGProps<SVGSVGElement>) => {
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
      <g data-name="Add Folder" clipPath="url(#prefix__a)">
        <g data-name="add folder-icn">
          <path
            data-name="Trazado 368"
            d="M239.148 69.847a29.456 29.456 0 00-29.418-29.036h-81.186l-1.119-1.512c-5.078-6.886-12.756-17.3-26.105-17.3H49.357A29.455 29.455 0 0019.935 51.42a19.768 19.768 0 00.236 3.081v13.472A29.818 29.818 0 00-.001 96.157c0 .6.023 1.205.076 1.806l9.691 106.824a29.8 29.8 0 0029.742 28.62h175.73a29.8 29.8 0 0029.746-28.593l9.926-106.806c.059-.619.09-1.235.09-1.852a29.791 29.791 0 00-15.852-26.309zM49.357 42.018h51.963c6.586 0 13.645 18.813 20.7 18.813h87.709a9.429 9.429 0 019.4 9.4v4.7H40.176V51.416h-.229a9.431 9.431 0 019.41-9.398zM224.994 203.64a9.78 9.78 0 01-9.754 9.748H39.51a9.779 9.779 0 01-9.75-9.748L20.014 96.157a9.782 9.782 0 019.746-9.755h195.471a9.787 9.787 0 019.758 9.755z"
          />
          <path
            data-name="Trazado 369"
            d="M204.192 136.08h-17.605v-17.605a7.148 7.148 0 00-7.125-7.126h-12.729a7.152 7.152 0 00-7.135 7.126v17.605h-17.605a7.148 7.148 0 00-7.125 7.127v12.733a7.148 7.148 0 007.125 7.125h17.605v17.606a7.153 7.153 0 007.135 7.127h12.729a7.149 7.149 0 007.125-7.127v-17.606h17.605a7.147 7.147 0 007.127-7.125v-12.733a7.147 7.147 0 00-7.127-7.127z"
          />
        </g>
      </g>
    </svg>
  );
};

export default AddFolderIcon;
