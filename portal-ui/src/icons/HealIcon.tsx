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
const HealIcon = () => {
  return (
    <SvgIcon>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10.014 9.993">
        <path
          className="a"
          d="M9.162,5.971h0L8.192,5,9.346,3.846a2.257,2.257,0,0,0,0-3.192,2.311,2.311,0,0,0-3.192,0L5,1.808,4.029.837,3.846.654a2.311,2.311,0,0,0-3.192,0,2.257,2.257,0,0,0,0,3.192l.184.183h0L1.808,5,.654,6.154A2.257,2.257,0,0,0,3.846,9.346L5,8.192l.971.971.183.183A2.257,2.257,0,0,0,9.346,6.154Zm-2.29-4.6a1.27,1.27,0,0,1,1.757,0,1.242,1.242,0,0,1,0,1.757L7.475,4.283,5.717,2.525Zm-5.5,1.757A1.243,1.243,0,0,1,3.129,1.371l.183.183L1.555,3.312Zm1.757,5.5a1.27,1.27,0,0,1-1.757,0,1.242,1.242,0,0,1,0-1.757L2.525,5.717,4.283,7.475Zm2.843-.9-.254-.253L2.525,4.283l-.253-.254L4.029,2.272l.254.253L7.475,5.717l.253.254Zm2.657.9a1.271,1.271,0,0,1-1.757,0l-.183-.183L8.446,6.688l.183.183h0a1.241,1.241,0,0,1,0,1.757Z"
          transform="translate(0.007 -0.014)"
        />
        <circle cx="0.5" cy="0.5" r="0.5" transform="translate(4.507 4.486)" />
        <circle cx="0.5" cy="0.5" r="0.5" transform="translate(3.507 3.486)" />
        <circle cx="0.5" cy="0.5" r="0.5" transform="translate(5.507 5.486)" />
      </svg>
    </SvgIcon>
  );
};

export default HealIcon;
