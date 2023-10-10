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
import { CircleIcon, Grid } from "mds";

interface INARule {
  ruleText: string;
}

const NARule = ({ ruleText }: INARule) => {
  return (
    <Fragment>
      <Grid container sx={{ display: "flex", justifyContent: "flex-start" }}>
        <Grid item xs={1}>
          <CircleIcon
            width={"12px"}
            height={"12px"}
            style={{ color: "#8f949c" }}
          />
        </Grid>
        <Grid
          item
          xs={9}
          sx={{
            color: "#8f949c",
            display: "flex",
            justifyContent: "flex-start",
          }}
          style={{}}
        >
          {ruleText}
        </Grid>
      </Grid>
    </Fragment>
  );
};

export default NARule;
