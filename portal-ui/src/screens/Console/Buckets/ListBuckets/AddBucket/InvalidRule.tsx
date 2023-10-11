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
import { ConfirmDeleteIcon, Grid } from "mds";

interface IInvalidRule {
  ruleText: string;
}

const InvalidRule = ({ ruleText }: IInvalidRule) => {
  return (
    <Fragment>
      <Grid
        container
        sx={{
          color: "#C83B51",
          display: "flex",
          justifyContent: "flex-start",
        }}
      >
        <Grid item xs={1} sx={{ paddingRight: 1 }}>
          <ConfirmDeleteIcon width={"16px"} height={"16px"} />
        </Grid>
        <Grid
          item
          xs={9}
          sx={{
            color: "#C83B51",
            display: "flex",
            justifyContent: "flex-start",
            paddingLeft: 1,
          }}
        >
          {ruleText}
        </Grid>
      </Grid>
    </Fragment>
  );
};

export default InvalidRule;
