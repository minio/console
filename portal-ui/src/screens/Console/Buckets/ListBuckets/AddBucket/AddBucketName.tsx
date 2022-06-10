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

import React from "react";
import { setName } from "./addBucketsSlice";
import InputBoxWrapper from "../../../Common/FormComponents/InputBoxWrapper/InputBoxWrapper";
import { useSelector } from "react-redux";
import { AppState, useAppDispatch } from "../../../../../store";

const AddBucketName = () => {
  const dispatch = useAppDispatch();

  const bucketName = useSelector((state: AppState) => state.addBucket.name);
  return (
    <InputBoxWrapper
      id="bucket-name"
      name="bucket-name"
      autoFocus={true}
      onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
        dispatch(setName(event.target.value));
      }}
      label="Bucket Name"
      value={bucketName}
    />
  );
};

export default AddBucketName;
