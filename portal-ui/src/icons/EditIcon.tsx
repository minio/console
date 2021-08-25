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
import SvgIcon from "@material-ui/core/SvgIcon";
import { IIcon } from "./props";

const EditIcon = ({ width = 24, active = false }: IIcon) => {
  return (
    <SvgIcon style={{ width: width, height: width }}>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 22.376 22.351">
        <path d="M17.638 0a4.936 4.936 0 00-3.4 1.384l-12.58 12.58a1.154 1.154 0 00-.335.629l-1.3 6.332a1.165 1.165 0 00.335 1.09 1.273 1.273 0 00.881.335.532.532 0 00.252-.042l6.292-1.22a1.154 1.154 0 00.629-.335l12.58-12.58a4.809 4.809 0 000-6.751A4.631 4.631 0 0017.638 0zM4.514 19.288a2.609 2.609 0 00-.587-.8 3.551 3.551 0 00-.8-.587l.461-2.181a4.027 4.027 0 012.055 1.048 3.727 3.727 0 011.048 2.055zm14.759-12.83l-11.2 11.154a4.912 4.912 0 00-1.3-2.013 5.732 5.732 0 00-2.013-1.3l11.2-11.2a2.309 2.309 0 011.677-.671 2.493 2.493 0 011.677.671 2.419 2.419 0 01-.041 3.359z" />
      </svg>
    </SvgIcon>
  );
};

export default EditIcon;
