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

import React, { Fragment } from "react";
import { Theme } from "@mui/material/styles";
import createStyles from "@mui/styles/createStyles";
import withStyles from "@mui/styles/withStyles";
import { IconButtonProps } from "@mui/material";
import HelpTip from "../../HelpTip";
import { Grid } from "mds";

const styles = (theme: Theme) =>
  createStyles({
    root: {
      padding: 0,
      margin: 0,
      fontSize: ".9rem",
    },
  });

interface IPanelTitle extends IconButtonProps {
  classes: any;
  children: any;
  helpTipID?: string;
}

const PanelTitle = ({ classes, children, helpTipID }: IPanelTitle) => {
  return (
    <Fragment>
      <Grid container>
        <Grid data-tooltip-id={helpTipID}>
          <h1 className={classes.root}>{children}</h1>
        </Grid>
        <HelpTip helpTipID={helpTipID} position="right" />
      </Grid>
    </Fragment>
  );
};
export default withStyles(styles)(PanelTitle);
