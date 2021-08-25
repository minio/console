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

const FolderIcon = ({ width = 24 }: IIcon) => {
  return (
    <SvgIcon style={{ width: width, height: width }}>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 19.552 16.209">
        <path d="M7.769 1.534c.5 0 1.046 1.443 1.587 1.443h6.725a.723.723 0 01.721.721v.361H3.081v-1.8h-.018a.724.724 0 01.722-.721h3.984m9.5 3.4a.749.749 0 01.747.748l-.765 8.241a.75.75 0 01-.748.747H3.03a.75.75 0 01-.748-.747l-.748-8.241a.75.75 0 01.748-.748h14.987M7.769 0H3.785a2.258 2.258 0 00-2.256 2.256 1.559 1.559 0 00.018.236v1.033A2.287 2.287 0 000 5.686c0 .046 0 .092.007.138l.743 8.19a2.285 2.285 0 002.281 2.194h13.473a2.286 2.286 0 002.281-2.192l.761-8.189a1.383 1.383 0 00.007-.142 2.284 2.284 0 00-1.215-2.017 2.259 2.259 0 00-2.255-2.226H9.858l-.085-.116a2.568 2.568 0 00-2-1.326z" />
      </svg>
    </SvgIcon>
  );
};

export default FolderIcon;
