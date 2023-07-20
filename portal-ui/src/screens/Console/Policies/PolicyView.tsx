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

import React, { Fragment, useState } from "react";
import SearchBox from "../Common/SearchBox";
import { Theme } from "@mui/material/styles";
import { searchField } from "../Common/FormComponents/common/styleLibrary";
import { DisabledIcon, EnabledIcon, Box, Grid } from "mds";
import { STATUS_COLORS } from "../Dashboard/BasicDashboard/Utils";
import makeStyles from "@mui/styles/makeStyles";
import { IAMStatement } from "./types";

const useStyles = makeStyles((theme: Theme) => ({
  searchField: {
    ...searchField.searchField,
    maxWidth: 380,
  },
}));

const rowGridStyle = {
  display: "grid",
  gridTemplateColumns: "70px 1fr",
  gap: 15,
};

const escapeRegExp = (str = "") =>
  str.replace(/([.?*+^$[\]\\(){}|-])/g, "\\$1");

const Highlight = ({ search = "", children = "" }): any => {
  const txtParts = new RegExp(`(${escapeRegExp(search)})`, "i");
  const parts = String(children).split(txtParts);

  if (search) {
    return parts.map((part, index) =>
      txtParts.test(part) ? <mark key={index}>{part}</mark> : part,
    );
  } else {
    return children;
  }
};

const PolicyView = ({
  policyStatements,
}: {
  policyStatements: IAMStatement[];
}) => {
  const classes = useStyles();

  const [filter, setFilter] = useState<string>("");

  return (
    <Grid container>
      <Grid item xs={12}>
        <Grid container sx={{ display: "flex", alignItems: "center" }}>
          <Grid item xs={12} sm={6} sx={{ fontWeight: "bold" }}>
            Statements
          </Grid>
          <Grid
            item
            xs={12}
            sm={6}
            sx={{ display: "flex", justifyContent: "flex-end" }}
          >
            <SearchBox
              placeholder={"Search"}
              onChange={setFilter}
              overrideClass={classes.searchField}
              value={filter}
            />
          </Grid>
        </Grid>
      </Grid>
      {!policyStatements && <Fragment>Policy has no statements</Fragment>}
      {policyStatements && (
        <Grid
          item
          xs={12}
          sx={{
            "& .policy-row": {
              borderBottom: "1px solid #eaeaea",
            },
            "& .policy-row:first-child": {
              borderTop: "1px solid #eaeaea",
            },
            "& .policy-row:last-child": {
              borderBottom: "0px",
            },
            paddingTop: "15px",
            "& mark": {
              color: "#000000",
              fontWeight: 500,
            },
          }}
        >
          {policyStatements.map((stmt, i) => {
            const effect = stmt.Effect;
            const isAllow = effect === "Allow";
            return (
              <Box
                className="policy-row"
                key={`${i}`}
                sx={{
                  display: "grid",
                  gridTemplateColumns: "1fr",
                  gap: "15px",
                  fontSize: "14px",
                  padding: "10px 0 10px 0",
                  "& .label": {
                    fontWeight: 600,
                  },
                }}
              >
                <Box sx={rowGridStyle}>
                  <Box className="label">Effect:</Box>
                  <Box
                    sx={{
                      display: "flex",

                      alignItems: "center",
                      "& .min-icon": {
                        marginRight: "5px",
                        fill: isAllow ? STATUS_COLORS.GREEN : STATUS_COLORS.RED,
                        height: "14px",
                        width: "14px",
                      },
                    }}
                  >
                    {isAllow ? <EnabledIcon /> : <DisabledIcon />}
                    {effect}
                  </Box>
                </Box>
                <Grid container sx={{ gap: 15 }}>
                  <Grid item xs={12} sm={6} sx={rowGridStyle}>
                    <Box className="label">Actions:</Box>
                    <Box>
                      {stmt.Action &&
                        stmt.Action.map((act, actIndex) => (
                          <div key={`${i}-r-${actIndex}`}>
                            <Highlight search={filter}>{act}</Highlight>
                          </div>
                        ))}
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6} sx={rowGridStyle}>
                    <Box className="label">Resources:</Box>
                    <Box>
                      {stmt.Resource &&
                        stmt.Resource.map((res, resIndex) => (
                          <div key={`${i}-r-${resIndex}`}>
                            {" "}
                            <Highlight search={filter}>{res}</Highlight>
                          </div>
                        ))}
                    </Box>
                  </Grid>
                </Grid>
              </Box>
            );
          })}
        </Grid>
      )}
    </Grid>
  );
};

export default PolicyView;
