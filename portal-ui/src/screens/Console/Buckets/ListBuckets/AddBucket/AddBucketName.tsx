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
import { InputBox } from "mds";
import { useSelector } from "react-redux";
import { setIsDirty, setName } from "./addBucketsSlice";
import { AppState, useAppDispatch } from "../../../../../store";

const AddBucketName = ({ hasErrors }: { hasErrors: boolean }) => {
  const dispatch = useAppDispatch();

  const bucketName = useSelector((state: AppState) => state.addBucket.name);
  return (
    <InputBox
      id="bucket-name"
      name="bucket-name"
      error={hasErrors ? "Invalid bucket name" : ""}
      onFocus={() => {
        dispatch(setIsDirty(true));
      }}
      onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
        dispatch(setName(event.target.value));
      }}
      label="Bucket Name"
      value={bucketName}
      required
    />
  );
};

export default AddBucketName;
