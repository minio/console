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
import { createStyles, Theme, withStyles } from "@material-ui/core/styles";
import { widgetCommon } from "../../../Common/FormComponents/common/styleLibrary";

interface ISingleValueWidget {
  title: string;
  data: string;
  classes: any;
}

const styles = (theme: Theme) =>
  createStyles({
    ...widgetCommon,
    contentContainer: {
      ...widgetCommon.contentContainer,
      fontWeight: 700,
      color: "#072045",
      fontSize: 18,
      textAlign: "center" as const,
    },
  });

const SingleValueWidget = ({ title, data, classes }: ISingleValueWidget) => {
  return (
    <div className={classes.singleValueContainer}>
      <div className={classes.titleContainer}>{title}</div>
      <div className={classes.contentContainer}>{data}</div>
    </div>
  );
};

export default withStyles(styles)(SingleValueWidget);
