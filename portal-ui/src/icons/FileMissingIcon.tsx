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

const FileMissingIcon = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      {...props}
      className={`min-icon`}
      fill={"currentcolor"}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="-19.281 0 256 256"
    >
      <path
        data-name="Trazado 452"
        d="M216.997 77.195c.388-15.754.958-32.243-.5-47.941-1.094-11.756-6.193-21.735-17.831-25.915a42.732 42.732 0 00-5.017-1.448c-6.549-1.478-13.432-1.6-20.09-1.8-11.726-.345-23.448.364-35.175.314-23.493-.1-46.985.322-70.479.414q-4.228.015-8.456.017H17.243A17.26 17.26 0 00.002 18.076v220.679a17.26 17.26 0 0017.241 17.241h182.541a17.26 17.26 0 0017.241-17.241V128.812c-.003-17.183-.45-34.459-.028-51.617zm-20.922 145.986a14.888 14.888 0 01-14.888 14.888H32.819a14.888 14.888 0 01-14.888-14.888V33.658a14.887 14.887 0 0114.888-14.887h99.548v25.458a37.8 37.8 0 0037.758 37.759h25.951zm0-157.656h-25.951a21.321 21.321 0 01-21.3-21.3V18.767h32.359a14.887 14.887 0 0114.888 14.887z"
      />
      <path
        data-name="Trazado 453"
        d="M65.32 135.266l10.527-10.778 10.528 10.778a2.113 2.113 0 001.512.637 2.113 2.113 0 001.512-.637l8.915-9.127a2.114 2.114 0 000-2.954l-10.6-10.849 10.6-10.851a2.114 2.114 0 000-2.954l-8.915-9.126a2.175 2.175 0 00-3.025 0l-10.528 10.778-10.527-10.778a2.109 2.109 0 00-1.511-.637 2.113 2.113 0 00-1.512.637l-8.916 9.126a2.116 2.116 0 000 2.954l10.6 10.851-10.6 10.849a2.116 2.116 0 000 2.954l8.916 9.127a2.174 2.174 0 003.024 0z"
      />
      <path
        data-name="Trazado 454"
        d="M162.542 98.531l-8.915-9.126a2.176 2.176 0 00-3.024 0l-10.523 10.778-10.528-10.778a2.114 2.114 0 00-1.512-.637 2.113 2.113 0 00-1.512.637l-8.915 9.126a2.114 2.114 0 000 2.954l10.6 10.851-10.6 10.849a2.114 2.114 0 000 2.954l8.915 9.127a2.175 2.175 0 003.025 0l10.528-10.778 10.523 10.778a2.113 2.113 0 001.511.637 2.113 2.113 0 001.512-.637l8.915-9.127a2.114 2.114 0 000-2.954l-10.594-10.849 10.594-10.851a2.114 2.114 0 000-2.954z"
      />
      <path
        data-name="Trazado 455"
        d="M150.532 160.897a66.963 66.963 0 00-40.3-13.344 8.529 8.529 0 00-1.513.143 8.505 8.505 0 00-1.513-.143 66.961 66.961 0 00-40.3 13.344 8.455 8.455 0 00-1.729 11.83 8.441 8.441 0 006.786 3.406 8.42 8.42 0 005.046-1.677 50.177 50.177 0 0130.2-9.993 8.482 8.482 0 001.513-.143 8.506 8.506 0 001.513.143 50.183 50.183 0 0130.2 9.993 8.416 8.416 0 005.044 1.677 8.44 8.44 0 006.786-3.406 8.454 8.454 0 00-1.733-11.83z"
      />
    </svg>
  );
};

export default FileMissingIcon;
