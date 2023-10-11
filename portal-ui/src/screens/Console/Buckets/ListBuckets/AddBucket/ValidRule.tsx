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
import { ConfirmModalIcon, Grid } from "mds";

interface IValidRule {
  ruleText: string;
}

const ValidRule = ({ ruleText }: IValidRule) => {
  return (
    <Fragment>
      <Grid container style={{ display: "flex", justifyContent: "flex-start" }}>
        <Grid item xs={1}>
          <ConfirmModalIcon
            width={"16px"}
            height={"16px"}
            style={{ color: "#18BF42" }}
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
        >
          {ruleText}
        </Grid>
      </Grid>
    </Fragment>
  );
};

export default ValidRule;
