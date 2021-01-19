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

const DeleteIcon = () => {
  return (
    <SvgIcon>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10.402 13">
        <path
          d="M6.761 1V0H3.64v1H.004v1h10.4V1zM.004 2.998l1.672 10h7.052l1.673-10zm3.412 8.243l-.552-6.478h.653l.553 6.472zm3.569 0h-.653l.551-6.472h.654z"
          className="a"
        ></path>
      </svg>
    </SvgIcon>
  );
};

export default DeleteIcon;
