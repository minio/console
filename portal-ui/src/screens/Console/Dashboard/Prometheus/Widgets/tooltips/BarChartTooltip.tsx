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
import { Theme } from "@mui/material/styles";
import createStyles from "@mui/styles/createStyles";
import withStyles from "@mui/styles/withStyles";
import { tooltipCommon } from "../../../../Common/FormComponents/common/styleLibrary";

const styles = (theme: Theme) =>
  createStyles({
    ...tooltipCommon,
  });

const BarChartTooltip = ({
  active,
  payload,
  label,
  barChartConfiguration,
  classes,
}: any) => {
  if (active) {
    return (
      <div className={classes.customTooltip}>
        <div className={classes.timeStampTitle}>{label}</div>
        {payload &&
          payload.map((pl: any, index: number) => {
            return (
              <div
                className={classes.labelContainer}
                key={`pltiem-${index}-${label}`}
              >
                <div
                  className={classes.labelColor}
                  style={{
                    backgroundColor: barChartConfiguration[index].color,
                  }}
                />
                <div className={classes.itemValue}>
                  <span className={classes.valueContainer}>{pl.value}</span>
                </div>
              </div>
            );
          })}
      </div>
    );
  }

  return null;
};

export default withStyles(styles)(BarChartTooltip);
