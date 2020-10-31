// This file is part of MinIO Console Server
// Copyright (c) 2020 MinIO, Inc.
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
import get from "lodash/get";
import { createStyles, Theme, withStyles } from "@material-ui/core/styles";
import { Grid } from "@material-ui/core";
import BrowseBuckets from "./BrowseBuckets";
import { containerForHeader } from "../Common/FormComponents/common/styleLibrary";
import PageHeader from "../Common/PageHeader/PageHeader";

interface IObjectBrowserProps {
  match: any;
  classes: any;
}

const styles = (theme: Theme) =>
  createStyles({
    watchList: {
      background: "white",
      maxHeight: "400",
      overflow: "auto",
      "& ul": {
        margin: "4",
        padding: "0",
      },
      "& ul li": {
        listStyle: "none",
        margin: "0",
        padding: "0",
        borderBottom: "1px solid #dedede",
      },
    },
    actionsTray: {
      textAlign: "right",
      "& button": {
        marginLeft: 10,
      },
    },
    inputField: {
      background: "#FFFFFF",
      padding: 12,
      borderRadius: 5,
      marginLeft: 10,
      boxShadow: "0px 3px 6px #00000012",
    },
    fieldContainer: {
      background: "#FFFFFF",
      padding: 0,
      borderRadius: 5,
      marginLeft: 10,
      textAlign: "left",
      minWidth: "206",
      boxShadow: "0px 3px 6px #00000012",
    },
    lastElementWPadding: {
      paddingRight: "78",
    },
    ...containerForHeader(theme.spacing(4)),
  });

const ObjectBrowser = ({ match, classes }: IObjectBrowserProps) => {
  const pathIn = get(match, "url", "");

  return (
    <React.Fragment>
      <PageHeader label={"Object Browser"} />
      <Grid container>
        <Grid item xs={12} className={classes.container}>
          {pathIn === "/object-browser" && <BrowseBuckets />}
        </Grid>
      </Grid>
    </React.Fragment>
  );
};

export default withStyles(styles)(ObjectBrowser);
