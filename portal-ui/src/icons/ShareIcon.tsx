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

const ShareIcon = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      {...props}
      className={`min-icon`}
      fill={"currentcolor"}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 255.999 243.852"
    >
      <path
        data-name="Trazado 410"
        d="M251.315 67.671L207.79 25.459c-14.279-13.851-35.342 7.862-21.063 21.716l12.959 12.567a156.689 156.689 0 00-82.95 23.182 156.774 156.774 0 00-71.051 97.677 15.547 15.547 0 0011.474 18.755 15.62 15.62 0 003.655.438 15.555 15.555 0 0015.1-11.909c14.6-60.586 70.74-100.461 130.9-96.758l-3.335 4.317-15.767 16.248c-13.849 14.285 7.867 35.345 21.719 21.063l42.214-43.518a15.131 15.131 0 00-.33-21.566z"
      />
      <path
        data-name="Trazado 411"
        d="M229.501 148.665a14.352 14.352 0 00-14.348 14.351v52.134H28.703V28.703h126.71a14.352 14.352 0 0014.351-14.351A14.353 14.353 0 00155.413.001h-130.1A25.34 25.34 0 00.002 25.314v193.228a25.339 25.339 0 0025.311 25.311h193.23a25.339 25.339 0 0025.311-25.311v-55.526a14.353 14.353 0 00-14.353-14.351z"
      />
    </svg>
  );
};

export default ShareIcon;
