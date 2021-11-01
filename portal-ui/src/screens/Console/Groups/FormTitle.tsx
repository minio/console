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

import React from "react";
import Grid from "@mui/material/Grid";
import createStyles from "@mui/styles/createStyles";
import { actionsTray } from "../Common/FormComponents/common/styleLibrary";
import withStyles from "@mui/styles/withStyles";

type FormTitleProps = {
  classes: any,
  title?: string,
  rightItems?: null | React.ReactNode | React.ReactNodeArray,
  icon?: null | React.ReactNode
}

const styles = () =>
  createStyles({
    ...actionsTray,
    actionIconColumn: {
      display: "flex",
      alignItems: "center",
      "& span": {
        marginLeft: "1rem"
      }
    }
  });


const FormTitle = ({ classes, title, rightItems, icon = null }: FormTitleProps) => {

  return (
    <Grid item xs={12} className={classes.actionsTray} paddingBottom={"1.9rem"}>
      <Grid item xs={4}>
        <div className={classes.actionIconColumn}>
          {icon}
          <span>{title}</span>
        </div>
      </Grid>
      <Grid item>

      </Grid>
      <Grid item>
        {rightItems}
      </Grid>

    </Grid>
  );
};
export default withStyles(styles)(FormTitle);
