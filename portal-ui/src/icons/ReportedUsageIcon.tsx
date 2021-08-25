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

import React from "react";
import { SvgIcon } from "@material-ui/core";
import { IIcon } from "./props";
const ReportedUsageIcon = ({ width = 24 }: IIcon) => {
  return (
    <SvgIcon style={{ width: width, height: width }}>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20.444 20.444">
        <path
          data-name="Trazado 390"
          d="M10.222 0A10.234 10.234 0 000 10.222a10.234 10.234 0 0010.222 10.222 10.234 10.234 0 0010.222-10.222A10.234 10.234 0 0010.222 0zm0 17.815a7.6 7.6 0 01-7.594-7.593 7.6 7.6 0 017.594-7.594v7.594h7.593a7.6 7.6 0 01-7.593 7.593z"
        />
      </svg>
    </SvgIcon>
  );
};

export default ReportedUsageIcon;
