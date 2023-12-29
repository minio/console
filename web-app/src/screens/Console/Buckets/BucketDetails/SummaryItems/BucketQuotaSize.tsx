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
import { HardBucketQuotaIcon, Box } from "mds";
import { niceBytes } from "../../../../../common/utils";

const BucketQuotaSize = ({ quota }: { quota: any }) => {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",

        "& .min-icon": {
          height: 37,
          width: 37,
        },
      }}
    >
      <HardBucketQuotaIcon />
      <Box
        sx={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "center",
          flexFlow: "column",
          marginLeft: "20px",
          fontSize: "19px",
        }}
      >
        <label
          style={{
            fontWeight: 600,
            textTransform: "capitalize",
          }}
        >
          {quota?.type} Quota
        </label>
        <label> {niceBytes(`${quota?.quota}`, true)}</label>
      </Box>
    </Box>
  );
};

export default BucketQuotaSize;
