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
import { DisabledIcon, EnabledIcon, Box } from "mds";
import { BucketVersioningResponse } from "api/consoleApi";
import LabelWithIcon from "./BucketDetails/SummaryItems/LabelWithIcon";

const VersioningInfo = ({
  versioningState = {},
}: {
  versioningState?: BucketVersioningResponse;
}) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 2,
      }}
    >
      <Box sx={{ fontWeight: "medium", display: "flex", gap: 2 }}>
        {versioningState.excludeFolders ? (
          <LabelWithIcon
            icon={
              versioningState.excludeFolders ? (
                <EnabledIcon style={{ color: "green" }} />
              ) : (
                <DisabledIcon />
              )
            }
            label={
              <label style={{ textDecoration: "normal" }}>
                Exclude Folders
              </label>
            }
          />
        ) : null}
      </Box>
      {versioningState.excludedPrefixes?.length ? (
        <Box
          sx={{
            fontWeight: "medium",
            display: "flex",
            justifyItems: "end",
            placeItems: "flex-start",
            flexDirection: "column",
            gap: 1,
          }}
        >
          <Box>Excluded Prefixes :</Box>
          <div
            style={{
              maxHeight: "200px",
              overflowY: "auto",
              placeItems: "flex-start",
              justifyItems: "end",
              flexDirection: "column",
              display: "flex",
            }}
          >
            {versioningState.excludedPrefixes?.map((it) => (
              <div>
                <strong>{it.prefix}</strong>
              </div>
            ))}
          </div>
        </Box>
      ) : null}
    </Box>
  );
};

export default VersioningInfo;
