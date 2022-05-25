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

import {
  IBarChartConfiguration,
  IBarChartRelation,
  IDataSRep,
  ILinearGraphConfiguration,
  IPieChartConfiguration,
} from "./Widgets/types";

export enum widgetType {
  singleValue = "singleValue",
  linearGraph = "linearGraph",
  areaGraph = "areaGraph",
  barChart = "barChart",
  pieChart = "pieChart",
  singleRep = "singleRep",
  simpleWidget = "simpleWidget",
}

export interface IDashboardPanel {
  id: number;
  mergedPanels?: IDashboardPanel[];
  title: string;
  data?: string | object[] | IDataSRep[];
  dataOuter?: string | object[];
  type?: widgetType;
  widgetIcon?: any;
  widgetConfiguration?:
    | ILinearGraphConfiguration[]
    | IBarChartConfiguration[]
    | IPieChartConfiguration;
  color?: string;
  fillColor?: string;
  innerLabel?: string;
  labelDisplayFunction?: (value: string) => any;
  disableYAxis?: boolean;
  xAxisFormatter?: (item: string) => string;
  yAxisFormatter?: (item: string) => string;
  customStructure?: IBarChartRelation[];
}
