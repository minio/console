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
const LogsIcon = ({ width = 24 }: IIcon) => {
  return (
    <SvgIcon style={{ width: width, height: width }}>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10.54 10.539">
        <path
          data-name="Trazado 343"
          d="M9.741.1H.799a.7.7 0 00-.7.7v8.942a.7.7 0 00.7.7h8.942a.7.7 0 00.7-.7V.8a.7.7 0 00-.7-.7zM9.11 9.713H1.43a.6.6 0 01-.6-.6V3.725h8.886v5.388a.6.6 0 01-.606.6z"
        />
        <path
          data-name="Trazado 343 - Contorno"
          d="M.799 0h8.942a.8.8 0 01.8.8v8.942a.8.8 0 01-.8.8H.799a.8.8 0 01-.8-.8V.8a.8.8 0 01.8-.8zm8.942 10.339a.6.6 0 00.6-.6V.797a.6.6 0 00-.6-.6H.799a.6.6 0 00-.6.6v8.942a.6.6 0 00.6.6zM.727 3.621h9.086v5.488a.7.7 0 01-.7.7h-7.68a.7.7 0 01-.7-.7zm8.886.2H.927v5.288a.5.5 0 00.5.5h7.68a.5.5 0 00.5-.5z"
        />
        <path
          data-name="Trazado 344"
          d="M5.19 5.076H2.684a.28.28 0 00-.275.285v.655a.281.281 0 00.275.285H5.19a.28.28 0 00.274-.285v-.659a.28.28 0 00-.274-.281z"
        />
        <path
          data-name="Trazado 344 - Contorno"
          d="M2.683 4.976h2.506a.38.38 0 01.375.385v.655a.38.38 0 01-.375.385H2.683a.381.381 0 01-.375-.385v-.659a.381.381 0 01.375-.381zm2.506 1.229a.18.18 0 00.174-.185v-.659a.18.18 0 00-.174-.185H2.683a.18.18 0 00-.175.185v.655a.181.181 0 00.175.185z"
        />
      </svg>
    </SvgIcon>
  );
};

export default LogsIcon;
