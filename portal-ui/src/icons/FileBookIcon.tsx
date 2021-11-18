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

const FileBookIcon = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      {...props}
      className={`min-icon`}
      fill={"currentcolor"}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="-19.281 0 256 256"
    >
      <path
        data-name="Trazado 442"
        d="M216.996 77.195c.388-15.754.958-32.242-.5-47.941-1.094-11.755-6.192-21.735-17.831-25.914a42.569 42.569 0 00-5.016-1.448c-6.551-1.478-13.433-1.6-20.09-1.8-11.727-.343-23.45.366-35.176.314-23.494-.1-46.986.323-70.479.414q-4.228.018-8.456.018H17.242A17.26 17.26 0 00.002 18.079v220.678a17.26 17.26 0 0017.24 17.241h182.541a17.26 17.26 0 0017.241-17.241V128.812c-.002-17.183-.448-34.458-.028-51.617zm-20.92 145.986a14.889 14.889 0 01-14.889 14.888H32.818a14.888 14.888 0 01-14.888-14.888V33.658A14.889 14.889 0 0132.818 18.77h99.549v25.459a37.8 37.8 0 0037.756 37.759h25.952zm0-157.656h-25.952a21.32 21.32 0 01-21.295-21.3V18.766h32.358a14.889 14.889 0 0114.889 14.888z"
      />
      <path
        data-name="Trazado 443"
        d="M171.045 108.247h-2.858v-.481c0-4.811-3.442-8.716-7.847-8.89-3.582-.139-7.333-.09-11.4.146v-8.975a9.1 9.1 0 00-3.651-7.42 7.622 7.622 0 00-8.069-.585 103.463 103.463 0 00-20.433 14.719 146.968 146.968 0 00-10.4 10.7 128.086 128.086 0 00-16.659-5.074 127.918 127.918 0 00-34.506-3.509c-4.378.2-7.8 4.1-7.8 8.888v.483h-2.858c-4.489 0-8.141 3.989-8.141 8.892v71.865c0 8.348 6.119 15.14 13.641 15.14h35.989a17.913 17.913 0 0112.641 5.463 12.747 12.747 0 009.108 3.911h.024a12.907 12.907 0 009.054-3.9 17.918 17.918 0 0112.68-5.474h35.987c7.522 0 13.641-6.792 13.641-15.14v-71.859c-.006-4.908-3.657-8.9-8.143-8.9zm-68.633 79.066a124.193 124.193 0 00-12.692-3.692 127.989 127.989 0 00-28.66-3.509c-1.549 0-2.857-1.653-2.857-3.607v-66.1h2.114a117.179 117.179 0 0142.1 7.847zm54.992-10.809c0 1.955-1.308 3.607-2.88 3.607a129.368 129.368 0 00-26.5 2.984 89.847 89.847 0 0113.362-9.123 15.293 15.293 0 007.55-13.56v-49.836a112.11 112.11 0 018.463-.239zm-19.251-16.057a3.781 3.781 0 01-1.6 3.282A100.833 100.833 0 00116.794 178a113.862 113.862 0 00-3.6 3.464v-64.967a131.394 131.394 0 0110.636-10.965l.011-.009a91.544 91.544 0 0114.314-10.886z"
      />
    </svg>
  );
};

export default FileBookIcon;
