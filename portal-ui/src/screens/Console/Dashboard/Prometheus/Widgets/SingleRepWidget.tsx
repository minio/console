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
import { Area, AreaChart, ResponsiveContainer, YAxis } from "recharts";
import { createStyles, Theme, withStyles } from "@material-ui/core/styles";
import { widgetCommon } from "../../../Common/FormComponents/common/styleLibrary";
import { IDataSRep } from "./types";

interface ISingleRepWidget {
  classes: any;
  title: string;
  data: IDataSRep[];
  color: string;
  fillColor: string;
  label: string;
}

const styles = (theme: Theme) =>
  createStyles({
    ...widgetCommon,
  });

const SingleRepWidget = ({
  classes,
  title,
  data,
  color,
  fillColor,
  label,
}: ISingleRepWidget) => {
  return (
    <div className={classes.singleValueContainer}>
      <div className={classes.titleContainer}>{title}</div>
      <div className={classes.contentContainer}>
        <ResponsiveContainer>
          <AreaChart data={data}>
            <YAxis domain={[0, (dataMax) => dataMax * 2]} hide={true} />
            <Area
              type="monotone"
              dataKey={"value"}
              stroke={color}
              fill={fillColor}
              fillOpacity={1}
            />
            <text
              x={"50%"}
              y={"50%"}
              textAnchor="middle"
              dominantBaseline="middle"
              fontWeight={600}
              fontSize={18}
              fill={color}
            >
              {label}
            </text>
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default withStyles(styles)(SingleRepWidget);
