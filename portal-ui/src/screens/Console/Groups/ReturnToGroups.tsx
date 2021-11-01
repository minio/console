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
import { Link } from "@mui/material";
import history from "../../../history";
import BackLinkIcon from "../../../icons/BackLinkIcon";
import createStyles from "@mui/styles/createStyles";
import { actionsTray } from "../Common/FormComponents/common/styleLibrary";
import withStyles from "@mui/styles/withStyles";

const styles = () =>
  createStyles({
    ...actionsTray,

    backLink: {
      display: "flex",
      fontSize: ".8rem",
      alignItems: "center",
      color: "#2781B0"
    },
    backIcon: {
      fontSize: ".8rem",
      marginRight: "1em",
      marginTop: "1px"
    }
  });

type ReturnToGroupsProps = {
  classes?: any,
}

const ReturnToGroups = ({
                          classes = {}
                        }: ReturnToGroupsProps) => {

  return (
    <Grid item xs={12} className={classes.actionsTray} paddingBottom={"1.9rem"}>
      <Grid item xs={3}>
        <Link href="/groups" onClick={(e) => {
          e.preventDefault();
          history.push("/groups");

        }}>
          <div tabIndex={-1} className={classes.backLink}>
            <BackLinkIcon className={classes.backIcon} /> {" "}Return to Groups
          </div>
        </Link>
      </Grid>
      <Grid item />

    </Grid>
  );

};

export default withStyles(styles)(ReturnToGroups);
