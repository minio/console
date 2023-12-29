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
import { IDashboardPanel, widgetType } from "./types";
import BarChartWidget from "./Widgets/BarChartWidget";
import LinearGraphWidget from "./Widgets/LinearGraphWidget";
import PieChartWidget from "./Widgets/PieChartWidget";
import SimpleWidget from "./Widgets/SimpleWidget";
import SingleRepWidget from "./Widgets/SingleRepWidget";
import SingleValueWidget from "./Widgets/SingleValueWidget";
import CapacityItem from "./Widgets/CapacityItem";
import DashboardItemBox from "../DashboardItemBox";
import HealActivityRenderer, {
  SimpleWidgetRenderProps,
} from "./Widgets/HealActivityRenderer";
import ScanActivityRenderer from "./Widgets/ScanActivityRenderer";
import UptimeActivityRenderer from "./Widgets/UptimeActivityRenderer";

export const componentToUse = (
  value: IDashboardPanel,
  timeStart: any,
  timeEnd: any,
  loading: boolean,
  apiPrefix: string,
  zoomActivated: boolean = false,
) => {
  switch (value.type) {
    case widgetType.singleValue:
      return (
        <SingleValueWidget
          title={value.title}
          panelItem={value}
          timeStart={timeStart}
          timeEnd={timeEnd}
          apiPrefix={apiPrefix}
        />
      );
    case widgetType.simpleWidget:
      let renderFn;
      let CmpToRender: any = null;
      if (value.id === 80) {
        CmpToRender = HealActivityRenderer;
      } else if (value.id === 81) {
        CmpToRender = ScanActivityRenderer;
      } else if (value.id === 1) {
        CmpToRender = UptimeActivityRenderer;
      }

      if ([80, 81, 1].includes(value.id)) {
        renderFn = ({
          valueToRender,
          loading,
          title,
          id,
          iconWidget,
        }: SimpleWidgetRenderProps) => {
          return (
            <CmpToRender
              valueToRender={valueToRender}
              loading={loading}
              title={title}
              id={id}
              iconWidget={iconWidget}
            />
          );
        };
      }
      return (
        <SimpleWidget
          title={value.title}
          panelItem={value}
          timeStart={timeStart}
          timeEnd={timeEnd}
          apiPrefix={apiPrefix}
          iconWidget={value.widgetIcon}
          renderFn={renderFn}
        />
      );
    case widgetType.pieChart:
      if (value.id === 50) {
        return (
          <DashboardItemBox>
            <CapacityItem
              value={value}
              timeStart={timeStart}
              timeEnd={timeEnd}
              apiPrefix={apiPrefix}
            />
          </DashboardItemBox>
        );
      }
      return (
        <PieChartWidget
          title={value.title}
          panelItem={value}
          timeStart={timeStart}
          timeEnd={timeEnd}
          apiPrefix={apiPrefix}
        />
      );
    case widgetType.linearGraph:
    case widgetType.areaGraph:
      return (
        <LinearGraphWidget
          title={value.title}
          panelItem={value}
          timeStart={timeStart}
          timeEnd={timeEnd}
          hideYAxis={value.disableYAxis}
          xAxisFormatter={value.xAxisFormatter}
          yAxisFormatter={value.yAxisFormatter}
          apiPrefix={apiPrefix}
          areaWidget={value.type === widgetType.areaGraph}
          zoomActivated={zoomActivated}
        />
      );
    case widgetType.barChart:
      return (
        <BarChartWidget
          title={value.title}
          panelItem={value}
          timeStart={timeStart}
          timeEnd={timeEnd}
          apiPrefix={apiPrefix}
          zoomActivated={zoomActivated}
        />
      );
    case widgetType.singleRep:
      const fillColor = value.fillColor ? value.fillColor : value.color;
      return (
        <SingleRepWidget
          title={value.title}
          panelItem={value}
          timeStart={timeStart}
          timeEnd={timeEnd}
          propLoading={loading}
          color={value.color as string}
          fillColor={fillColor as string}
          apiPrefix={apiPrefix}
        />
      );
    default:
      return null;
  }
};
