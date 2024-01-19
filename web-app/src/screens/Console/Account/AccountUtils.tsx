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
import { DateTime } from "luxon";

export const ACCOUNT_TABLE_COLUMNS = [
  { label: "Access Key", elementKey: "accessKey" },
  {
    label: "Expiry",
    elementKey: "expiration",
    renderFunction: (expTime: string) => {
      if (expTime) {
        const fmtDate = DateTime.fromISO(expTime)
          .toUTC()
          .toFormat("y/M/d hh:mm:ss z");

        return <span title={fmtDate}>{fmtDate}</span>;
      }
      return "";
    },
  },
  {
    label: "Status",
    elementKey: "accountStatus",
    renderFunction: (status: string) => {
      if (status === "off") {
        return "Disabled";
      } else {
        return "Enabled";
      }
    },
  },
  { label: "Name", elementKey: "name" },
  { label: "Description", elementKey: "description" },
];
