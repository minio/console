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
import { SvgIcon, SvgIconProps } from "@material-ui/core";

const AddIcon = (props: SvgIconProps) => {
  return (
    <SvgIcon {...props}>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256.003 256">
        <path d="M232.138 92.816h-68.953V23.863A23.937 23.937 0 00139.327.001h-22.623a23.948 23.948 0 00-23.891 23.862v68.953H23.86A23.936 23.936 0 00.001 116.681v22.639a23.934 23.934 0 0023.859 23.859h68.953v68.957a23.951 23.951 0 0023.891 23.865h22.623a23.94 23.94 0 0023.858-23.865v-68.957h68.953a23.931 23.931 0 0023.865-23.859v-22.639a23.933 23.933 0 00-23.865-23.865z" />
      </svg>
    </SvgIcon>
  );
};

export default AddIcon;
