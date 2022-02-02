//  This file is part of MinIO Console Server
//  Copyright (c) 2022 MinIO, Inc.
//
//  This program is free software: you can redistribute it and/or modify
//  it under the terms of the GNU Affero General Public License as published by
//  the Free Software Foundation, either version 3 of the License, or
//  (at your option) any later version.
//
//  This program is distributed in the hope that it will be useful,
//  but WITHOUT ANY WARRANTY; without even the implied warranty of
//  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
//  GNU Affero General Public License for more details.
//
//  You should have received a copy of the GNU Affero General Public License
//  along with this program.  If not, see <http://www.gnu.org/licenses/>.

import { calculateBytes } from "../../../common/utils";
import React from "react";
import withStyles from "@mui/styles/withStyles";
import { Theme } from "@mui/material/styles";
import createStyles from "@mui/styles/createStyles";
import clsx from "clsx";

const styles = (theme: Theme) =>
  createStyles({
    objectGeneralTitle: {
      lineHeight: 1,
      fontSize: 50,
      color: "#696969",
    },
    generalUnit: {
      color: "#000",
      fontSize: 12,
      fontWeight: "bold",
    },
    testUnitRes: {
      fontSize: 60,
      color: "#081C42",
      fontWeight: "bold",
      textAlign: "right",
    },
    metricValContainer: {
      lineHeight: 1,
      verticalAlign: "bottom",
    },
    objectsUnitRes: {
      fontSize: 22,
      marginTop: 6,
      color: "#696969",
      fontWeight: "bold",
      textAlign: "right",
    },
    objectsUnit: {
      color: "#696969",
      fontSize: 16,
      fontWeight: "bold",
    },
    iconTd: {
      verticalAlign: "bottom",
    },
  });

const SpeedTestUnit = ({
  classes,
  title,
  icon,
  throughput,
  objects,
}: {
  classes: any;
  title: any;
  icon: any;
  throughput: string;
  objects: number;
}) => {
  const avg = calculateBytes(throughput);

  let total = "0";
  let unit = "";

  if (avg.total !== 0) {
    total = avg.total.toString();
    unit = `${avg.unit}/s`;
  }

  return (
    <table>
      <tr>
        <td className={classes.objectGeneralTitle}>{title}</td>
        <td className={classes.iconTd}>{icon}</td>
      </tr>
      <tr>
        <td className={clsx(classes.metricValContainer, classes.testUnitRes)}>
          {total}
        </td>
        <td className={clsx(classes.metricValContainer, classes.generalUnit)}>
          {unit}
        </td>
      </tr>
      <tr>
        <td
          className={clsx(classes.metricValContainer, classes.objectsUnitRes)}
        >
          {objects}
        </td>
        <td className={clsx(classes.metricValContainer, classes.objectsUnit)}>
          {objects !== 0 && "Objs/S"}
        </td>
      </tr>
    </table>
  );
};
export default withStyles(styles)(SpeedTestUnit);
