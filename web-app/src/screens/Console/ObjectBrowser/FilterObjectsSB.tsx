// This file is part of MinIO Console Server
// Copyright (c) 2023 MinIO, Inc.
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
import { setSearchObjects } from "./objectBrowserSlice";
import SearchBox from "../Common/SearchBox";
import { AppState, useAppDispatch } from "../../../store";
import { useSelector } from "react-redux";

const FilterObjectsSB = () => {
  const dispatch = useAppDispatch();

  const searchObjects = useSelector(
    (state: AppState) => state.objectBrowser.searchObjects,
  );
  return (
    <SearchBox
      placeholder={"Start typing to filter objects in the bucket"}
      onChange={(value) => {
        dispatch(setSearchObjects(value));
      }}
      value={searchObjects}
    />
  );
};
export default FilterObjectsSB;
