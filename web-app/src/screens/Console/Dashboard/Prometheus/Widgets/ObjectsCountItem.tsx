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
import NumericStatCard from "./NumericStatCard";
import { TotalObjectsIcon } from "mds";

const ObjectsCountItem = ({
  title,
  value,
  loading,
}: {
  title: string;
  value: string;
  loading?: boolean;
}) => {
  return (
    <NumericStatCard
      label={title}
      icon={<TotalObjectsIcon />}
      value={value}
      loading={loading}
    />
  );
};

export default ObjectsCountItem;
