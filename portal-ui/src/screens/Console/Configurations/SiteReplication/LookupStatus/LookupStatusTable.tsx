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
import { Box } from "@mui/material";
import { CircleIcon } from "../../../../../icons";

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
      <td className="header-cell" key={`${0}${hcIdx}`}>
        {hC}
      </td>
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
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  "& .min-icon": {
                    fill: "#4CCB92",
                    height: "15px",
                    width: "15px",
                  },
                }}
              >
                <CircleIcon />
              </Box>
            );
          } else if (v === false) {
            indicator = (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  "& .min-icon": {
                    fill: "#C83B51",
                    height: "15px",
                    width: "15px",
                  },
                }}
              >
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
    <Box
      sx={{
        marginTop: "15px",
        table: {
          width: "100%",
          borderCollapse: "collapse",

          "& .feature-cell": {
            fontWeight: 600,
            fontSize: "14px",
            paddingLeft: "15px",
          },
          "& .status-cell": {
            textAlign: "center",
          },
          "& .header-cell": {
            textAlign: "center",
          },
          "& tr": {
            height: "38px",
          },
          "tr td ": {
            border: "1px solid #f1f1f1",
          },
        },
      }}
    >
      <Box sx={{ marginTop: "15px", marginBottom: "15px" }}>
        Replication status for {entityType}: <strong>{entityName}</strong>.
      </Box>
      <table>
        <thead>
          <tr>{tableHeader}</tr>
        </thead>
        <tbody>{tableRowsToRender}</tbody>
      </table>
    </Box>
  );
};

export default LookupStatusTable;
