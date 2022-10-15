// This file is part of MinIO Console Server
// Copyright (c) 2022 MinIO, Inc.
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

import React, { Fragment } from "react";
import { AppState, useAppDispatch } from "../store";
import { useSelector } from "react-redux";
import { setTooltipsMute } from "../systemSlice";

const MutePermissionTooltips = () => {
  const tooltipsMute = useSelector(
    (state: AppState) => state.system.tooltipsMute
  );
  const dispatch = useAppDispatch();
  return (
    <Fragment>
      <span
        style={{ paddingTop: 10, color: "#081C42" }}
        onClick={() => {
          dispatch(setTooltipsMute(!tooltipsMute));
        }}
      >
        <br />
        <br />
        {tooltipsMute
          ? "Need help discovering the required policies for disabled actions? Enable Permission Tooltips"
          : "Happy with your configured permissions? Disable Permission Tooltips"}
      </span>
    </Fragment>
  );
};

export default MutePermissionTooltips;
