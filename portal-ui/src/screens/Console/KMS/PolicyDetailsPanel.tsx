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
import Grid from "@mui/material/Grid";
import { Theme } from "@mui/material/styles";
import createStyles from "@mui/styles/createStyles";
import withStyles from "@mui/styles/withStyles";
import TableWrapper from "../Common/TableWrapper/TableWrapper";

const styles = (theme: Theme) => createStyles({});

export interface IPolicyDetailsPanelProps {
  allow: string[];
  deny: string[];
  classes: any;
}

const PolicyDetailsPanel = ({ allow, deny }: IPolicyDetailsPanelProps) => {
  const mapAllow = allow.map((a) => {
    return {
      key: a,
    };
  });

  const mapDeny = deny.map((a) => {
    return {
      key: a,
    };
  });

  return (
    <Grid item xs={12} width={"100%"}>
      <TableWrapper
        columns={[{ label: "Allow Actions", elementKey: "key" }]}
        isLoading={false}
        records={mapAllow}
        entityName={"Allow actions"}
        idField={"key"}
        customPaperHeight={"400px"}
      />
      <br />
      <TableWrapper
        columns={[{ label: "Deny Actions", elementKey: "key" }]}
        isLoading={false}
        records={mapDeny}
        entityName={"Deny actions"}
        idField={"key"}
        customPaperHeight={"400px"}
      />
    </Grid>
  );
};

export default withStyles(styles)(PolicyDetailsPanel);
