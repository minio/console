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
import { Box } from "mds";
import { safeDecodeURIComponent } from "../../../../../../common/utils";

interface IObjectMetadata {
  metaData: any;
}

const itemRendererFn = (element: any) => {
  return Array.isArray(element)
    ? element.map(safeDecodeURIComponent).join(", ")
    : safeDecodeURIComponent(element);
};

const ObjectMetaData = ({ metaData }: IObjectMetadata) => {
  const metaKeys = Object.keys(metaData);

  return (
    <Fragment>
      {metaKeys.map((element: string, index: number) => {
        const renderItem = itemRendererFn(metaData[element]);
        return (
          <Box
            sx={{
              marginBottom: 15,
              fontSize: 14,
              maxHeight: 180,
              overflowY: "auto",
            }}
            key={`box-meta-${element}-${index.toString()}`}
          >
            <strong>{element}</strong>
            <br />
            {renderItem}
          </Box>
        );
      })}
    </Fragment>
  );
};

export default ObjectMetaData;
