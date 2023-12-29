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

import { SpeedTestResponse } from "./types";

export const cleanMetrics = (results: SpeedTestResponse[]) => {
  const cleanRes = results.filter(
    (item) => item.version !== "0" && item.disks !== 0,
  );

  const states = cleanRes.map((itemRes) => {
    return {
      get: itemRes.GETStats?.throughputPerSec || 0,
      put: itemRes.PUTStats?.throughputPerSec || 0,
    };
  });

  return [{ get: 0, put: 0 }, ...states];
};
