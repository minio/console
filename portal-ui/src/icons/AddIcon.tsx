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

const AddIcon = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      {...props}
      className={`min-icon`}
      fill={"currentcolor"}
      viewBox="0 0 256 256"
    >
      <path
        id="Unión_20"
        data-name="Unión 20"
        d="M102.375,230.414v-76.8H25.556a25.61,25.61,0,0,1,0-51.219h76.819v-76.8a25.6,25.6,0,0,1,51.208,0v76.8H230.4a25.609,25.609,0,0,1,0,51.219H153.583v76.8a25.6,25.6,0,0,1-51.208,0Z"
      />
    </svg>
  );
};

export default AddIcon;
