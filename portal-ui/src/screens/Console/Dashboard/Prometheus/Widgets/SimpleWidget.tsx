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

interface ISimpleWidget {
  classes: any;
  iconWidget: any;
  label: string;
  value: string;
}

const styles = (theme: Theme) =>
  createStyles({
    mainWidgetContainer: {
      display: "inline-flex",
      color: "#072A4D",
      alignItems: "center",
    },
    icon: {
      color: "#072A4D",
      fill: "#072A4D",
      marginRight: 5,
      marginLeft: 12,
    },
    widgetLabel: {
      fontWeight: "bold",
      textTransform: "uppercase",
      marginRight: 10,
    },
    widgetValue: {
        marginRight: 25,
    }
  });

const SimpleWidget = ({ classes, iconWidget, label, value }: ISimpleWidget) => {
  return (
    <span className={classes.mainWidgetContainer}>
      <span className={classes.icon}>{iconWidget ? iconWidget : null}</span>
      <span className={classes.widgetLabel}>{label}: </span>
      <span className={classes.widgetValue}>{value}</span>
    </span>
  );
};

export default withStyles(styles)(SimpleWidget);
