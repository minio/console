//  This file is part of MinIO Console Server
//  Copyright (c) 2022 MinIO, Inc.
//
//  This program is free software: you can redistribute it and/or modify
//  it under the terms of the GNU Affero General Public License as published by
//  the Free Software Foundation, either version 3 of the License, or
//  (at your option) any later version.
//
//  This program is distributed in the hope that it will be useful,
//  but WITHOUT ANY WARRANTY; without even the implied warranty of
//  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
//  GNU Affero General Public License for more details.
//
//  You should have received a copy of the GNU Affero General Public License
//  along with this program.  If not, see <http://www.gnu.org/licenses/>.

import { Action } from "kbar/lib/types";
import { BucketsIcon } from "mds";
import { Bucket } from "../../api/consoleApi";

export const routesAsKbarActions = (
  buckets: Bucket[],
  navigate: (url: string) => void,
) => {
  const initialActions: Action[] = [];

  if (buckets) {
    buckets.map((buck) => [
      initialActions.push({
        id: buck.name,
        name: buck.name,
        section: "List of Buckets",
        perform: () => {
          navigate(`/browser/${buck.name}`);
        },
        icon: <BucketsIcon />,
      }),
    ]);
  }

  return initialActions;
};
