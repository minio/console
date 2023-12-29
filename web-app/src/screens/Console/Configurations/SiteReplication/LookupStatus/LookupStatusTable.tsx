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
import styled from "styled-components";
import get from "lodash/get";
import { Box, CircleIcon } from "mds";

const LookupTableBase = styled.div(({ theme }) => ({
  marginTop: 15,
  table: {
    width: "100%",
    borderCollapse: "collapse",
    "& .feature-cell": {
      fontWeight: 600,
      fontSize: 14,
      paddingLeft: 15,
    },
    "& .status-cell": {
      textAlign: "center",
    },
    "& .header-cell": {
      textAlign: "center",
    },
    "& tr": {
      height: 38,
      "& td": {
        borderBottom: `1px solid ${get(theme, "borderColor", "#E2E2E2")}`,
      },
      "& th": {
        borderBottom: `2px solid ${get(theme, "borderColor", "#E2E2E2")}`,
      },
    },
    "& .indicator": {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      "& .min-icon": {
        height: 15,
        width: 15,
      },
      "&.active": {
        "& .min-icon": {
          fill: get(theme, "signalColors.good", "#4CCB92"),
        },
      },
      "&.deactivated": {
        "& .min-icon": {
          fill: get(theme, "signalColors.danger", "#C51B3F"),
        },
      },
    },
  },
}));

const LookupStatusTable = ({
  matrixData = [],
  entityName = "",
  entityType = "",
}: {
  matrixData: any;
  entityName: string;
  entityType: string;
}) => {
  //Assumes 1st row should be a header row.
  const [header = [], ...rows] = matrixData;

  const tableHeader = header.map((hC: string, hcIdx: number) => {
    return (
      <th className="header-cell" key={`${0}${hcIdx}`}>
        {hC}
      </th>
    );
  });

  const tableRowsToRender = rows.map((r: any, rIdx: number) => {
    return (
      <tr key={`r-${rIdx + 1}`}>
        {r.map((v: any, cIdx: number) => {
          let indicator = null;

          if (cIdx === 0) {
            indicator = v;
          } else if (v === "") {
            indicator = "";
          }
          if (v === true) {
            indicator = (
              <Box className={`indicator active`}>
                <CircleIcon />
              </Box>
            );
          } else if (v === false) {
            indicator = (
              <Box className={`indicator deactivated`}>
                <CircleIcon />
              </Box>
            );
          }

          return (
            <td
              key={`${rIdx + 1}${cIdx}`}
              className={cIdx === 0 ? "feature-cell" : "status-cell"}
            >
              {indicator}
            </td>
          );
        })}
      </tr>
    );
  });

  return (
    <LookupTableBase>
      <Box sx={{ marginTop: 15, marginBottom: 15 }}>
        Replication status for {entityType}: <strong>{entityName}</strong>.
      </Box>
      <table>
        <thead>
          <tr>{tableHeader}</tr>
        </thead>
        <tbody>{tableRowsToRender}</tbody>
      </table>
    </LookupTableBase>
  );
};

export default LookupStatusTable;
