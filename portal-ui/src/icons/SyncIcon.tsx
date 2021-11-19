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

const SyncIcon = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      {...props}
      className={`min-icon`}
      fill={"currentcolor"}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 -24.503 257.016 257.016"
    >
      <path
        id="sync-icn"
        d="M18652.848-5631.2c0-.057.006-.114.006-.166l-5.4,6.524-9.992,11.438c-11.006,12.6-30.166-4.136-19.16-16.739l33.545-38.416a12.732,12.732,0,0,1,18.1-1.222l38.41,33.549c12.6,11.006-4.133,30.171-16.74,19.165l-14.342-12.527-2.316-2.123c0,.175.023.346.023.517a73.159,73.159,0,0,0,73.078,73.078,73.28,73.28,0,0,0,59.584-30.763,11.067,11.067,0,0,1,15.432-2.6,11.062,11.062,0,0,1,2.6,15.432,95.45,95.45,0,0,1-77.611,40.059A95.316,95.316,0,0,1,18652.848-5631.2Zm163.207,21.989-38.4-33.549c-12.6-11.011,4.131-30.176,16.738-19.17l14.338,12.532,2.32,2.118c0-.171-.023-.336-.023-.512a73.159,73.159,0,0,0-73.078-73.078,73.289,73.289,0,0,0-59.588,30.759,11.068,11.068,0,0,1-15.432,2.6,11.071,11.071,0,0,1-2.6-15.431,95.439,95.439,0,0,1,77.615-40.06,95.317,95.317,0,0,1,95.209,95.209c0,.057-.01.109-.01.166l5.4-6.529,9.992-11.433c11.006-12.6,30.17,4.136,19.16,16.739l-33.545,38.415a12.894,12.894,0,0,1-9.689,4.43A12.7,12.7,0,0,1,18816.055-5609.21Z"
        transform="translate(-18614.49 5743.5)"
        stroke-miterlimit="10"
        stroke-width="1"
      />
    </svg>
  );
};

export default SyncIcon;
