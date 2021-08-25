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
const SettingsIcon = ({ width = 24 }: IIcon) => {
  return (
    <SvgIcon style={{ width: width, height: width }}>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 14.162 14.162">
        <path
          data-name="Trazado 341"
          d="M13.699 5.489l-1.477-.213a5.127 5.127 0 00-.23-.545l.9-1.194a.544.544 0 00-.05-.714l-1.487-1.5a.544.544 0 00-.713-.049l-1.195.9a4.947 4.947 0 00-.545-.229L8.69.468a.545.545 0 00-.545-.469h-2.11a.544.544 0 00-.544.469l-.212 1.477a4.947 4.947 0 00-.545.229l-1.2-.9a.546.546 0 00-.715.049L1.332 2.811a.544.544 0 00-.049.714l.9 1.194a4.845 4.845 0 00-.23.545l-1.476.213a.545.545 0 00-.469.545v2.1a.545.545 0 00.469.545l1.476.212a4.763 4.763 0 00.23.545l-.9 1.2a.545.545 0 00.049.714l1.487 1.488a.547.547 0 00.715.049l1.193-.9a4.758 4.758 0 00.545.229l.212 1.477a.545.545 0 00.545.469h2.1a.546.546 0 00.545-.469l.212-1.477a4.988 4.988 0 00.545-.229l1.193.894a.545.545 0 00.714-.049l1.488-1.488a.545.545 0 00.049-.714l-.889-1.189a4.94 4.94 0 00.229-.545l1.478-.213a.546.546 0 00.469-.545V6.017a.546.546 0 00-.463-.528zm-.622 2.18l-1.352.2a.546.546 0 00-.447.393 4.541 4.541 0 01-.38.965.542.542 0 000 .584l.816 1.09-.816.834-1.091-.834a.545.545 0 00-.579 0 4.19 4.19 0 01-.98.4.543.543 0 00-.393.447l-.2 1.33H6.499l-.2-1.352a.543.543 0 00-.393-.447 4.212 4.212 0 01-.981-.4.544.544 0 00-.578.022l-1.09.817-.834-.817.834-1.09a.545.545 0 000-.584 4.574 4.574 0 01-.4-.976.545.545 0 00-.447-.393l-1.33-.2V6.5l1.352-.2a.544.544 0 00.447-.393 4.577 4.577 0 01.381-.976.545.545 0 000-.583l-.834-1.09.834-.834 1.09.834a.543.543 0 00.578 0 4.217 4.217 0 01.981-.4.543.543 0 00.393-.447l.2-1.33h1.156l.2 1.352a.545.545 0 00.393.447 4.167 4.167 0 01.98.4.546.546 0 00.579-.022l1.091-.818.833.818-.833 1.09a.543.543 0 00-.039.6 4.529 4.529 0 01.4.976.544.544 0 00.447.392l1.352.2z"
        />
        <path
          data-name="Trazado 342"
          d="M7.078 4.355a2.726 2.726 0 00-2.725 2.726 2.726 2.726 0 002.725 2.721 2.726 2.726 0 002.726-2.725 2.726 2.726 0 00-2.726-2.722zm0 4.361a1.635 1.635 0 01-1.635-1.635 1.635 1.635 0 011.635-1.636 1.635 1.635 0 011.635 1.636 1.634 1.634 0 01-1.635 1.635z"
        />
      </svg>
    </SvgIcon>
  );
};

export default SettingsIcon;
