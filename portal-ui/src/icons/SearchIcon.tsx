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
const SearchIcon = ({ width = 24 }: IIcon) => {
  return (
    <SvgIcon style={{ width: width, height: width }}>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 15.454 15.634">
        <path
          data-name="Trazado 399"
          d="M12.078 10.958A6.708 6.708 0 0013.54 6.77 6.772 6.772 0 006.77 0 6.772 6.772 0 000 6.77a6.772 6.772 0 006.77 6.77 6.707 6.707 0 004.008-1.318l3.141 3.141a.907.907 0 00.632.271.876.876 0 00.632-.271.894.894 0 000-1.282zM1.805 6.77A4.962 4.962 0 016.77 1.805a4.962 4.962 0 014.965 4.965 4.973 4.973 0 01-4.965 4.965A4.973 4.973 0 011.805 6.77z"
          fill="#202020"
        />
      </svg>
    </SvgIcon>
  );
};

export default SearchIcon;
