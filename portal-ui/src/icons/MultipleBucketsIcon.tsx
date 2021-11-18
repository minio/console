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

const MultipleBucketsIcon = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      {...props}
      className={`min-icon`}
      fill={"currentcolor"}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 16 16"
    >
      <g id="repliaction-icn" transform="translate(0 0)">
        <g id="Grupo_1696" data-name="Grupo 1696" transform="translate(3.434)">
          <path
            id="Trazado_6841"
            data-name="Trazado 6841"
            d="M-502.661-53.081a1.054,1.054,0,0,0-.84-.432h-10.382a1.055,1.055,0,0,0-.84.432,1.272,1.272,0,0,0-.233.983l.178,1.038h7.843a1.894,1.894,0,0,1,1.509.776,2.21,2.21,0,0,1,.342.661h1.366l-.16.932h-1.107c-.005.058-.013.117-.023.175l-.518,3.021v0h1.1l-.16.932h-1.1l-.546,3.189-.005.032-.072.422h1.06a1.124,1.124,0,0,0,1.073-.975l.52-3.036c0-.006,0-.012,0-.018l.7-4.114,0-.012.518-3.024A1.271,1.271,0,0,0-502.661-53.081Z"
            transform="translate(514.975 53.513)"
          />
        </g>
        <path
          id="Trazado_6842"
          data-name="Trazado 6842"
          d="M-609.21,43.432a1.055,1.055,0,0,0-.84-.432h-10.382a1.054,1.054,0,0,0-.84.432,1.271,1.271,0,0,0-.233.983c.256,1.495.8,4.646,1.226,7.16a.035.035,0,0,0,0,.005l.521,3.04a1.124,1.124,0,0,0,1.073.975h6.886a1.124,1.124,0,0,0,1.073-.975l.52-3.036,0-.018.7-4.114s0-.008,0-.012l.518-3.024A1.271,1.271,0,0,0-609.21,43.432Zm-1.924,8.519-8.214.01-.16-.932,8.534-.01Zm.708-4.131-9.629.01-.16-.932,9.949-.01Z"
          transform="translate(621.524 -39.595)"
        />
      </g>
    </svg>
  );
};

export default MultipleBucketsIcon;
