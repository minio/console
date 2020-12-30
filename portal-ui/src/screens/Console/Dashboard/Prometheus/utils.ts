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

import get from "lodash/get";
import { IDashboardPanel, widgetType } from "./types";
import {
  getTimeFromTimestamp,
  niceBytes,
  niceDays,
} from "../../../../common/utils";

export const widgetsLayout = [
  { w: 1, h: 2, x: 0, y: 0, i: "panel-0", moved: false, static: false },
  { w: 1, h: 1, x: 1, y: 0, i: "panel-1", moved: false, static: false },
  { w: 1, h: 1, x: 1, y: 1, i: "panel-2", moved: false, static: false },
  { w: 1, h: 2, x: 2, y: 0, i: "panel-3", moved: false, static: false },
  { w: 2, h: 2, x: 3, y: 0, i: "panel-4", moved: false, static: false },
  { w: 3, h: 2, x: 5, y: 0, i: "panel-5", moved: false, static: false },
  { w: 1, h: 1, x: 0, y: 2, i: "panel-6", moved: false, static: false },
  { w: 1, h: 1, x: 0, y: 3, i: "panel-7", moved: false, static: false },
  { w: 1, h: 1, x: 1, y: 2, i: "panel-8", moved: false, static: false },
  { w: 1, h: 1, x: 1, y: 3, i: "panel-9", moved: false, static: false },
  { w: 1, h: 1, x: 2, y: 2, i: "panel-10", moved: false, static: false },
  { w: 1, h: 1, x: 2, y: 3, i: "panel-11", moved: false, static: false },
  { w: 4, h: 2, x: 3, y: 2, i: "panel-12", moved: false, static: false },
  { w: 1, h: 1, x: 7, y: 2, i: "panel-13", moved: false, static: false },
  { w: 1, h: 1, x: 7, y: 3, i: "panel-14", moved: false, static: false },
  { w: 8, h: 2, x: 0, y: 4, i: "panel-15", moved: false, static: false },
];

const colorsMain = [
  "#6992B7",
  "#E2AD17",
  "#22B573",
  "#F7655E",
  "#0071BC",
  "#F9E6C5",
  "#A6E8C4",
  "#F4CECE",
  "#ADD5E0",
];

export const panelsConfiguration: IDashboardPanel[] = [
  {
    title: "Uptime",
    data: "N/A",
    type: widgetType.singleValue,
    layoutIdentifier: "panel-0",
    labelDisplayFunction: niceDays,
  },
  {
    title: "Total Online disks",
    data: "N/A",
    type: widgetType.singleValue,
    layoutIdentifier: "panel-1",
  },
  {
    title: "Total Offline disks",
    data: "N/A",
    type: widgetType.singleValue,
    layoutIdentifier: "panel-2",
  },
  {
    title: "Total Data",
    data: [],
    dataOuter: [{ name: "outer", value: 100 }],
    widgetConfiguration: {
      outerChart: {
        colorList: ["#9c9c9c"],
        innerRadius: 51,
        outerRadius: 54,
        startAngle: -15,
        endAngle: 195,
      },
      innerChart: {
        colorList: colorsMain,
        innerRadius: 35,
        outerRadius: 50,
        startAngle: -15,
        endAngle: 195,
      },
    },
    type: widgetType.pieChart,
    layoutIdentifier: "panel-3",
    innerLabel: "N/A",
    labelDisplayFunction: niceBytes,
  },
  {
    title: "Data Growth",
    data: [],
    widgetConfiguration: [
      {
        dataKey: "",
        keyLabel: "",
        lineColor: "#000",
        fillColor: "#000",
      },
    ],
    type: widgetType.linearGraph,
    layoutIdentifier: "panel-4",
    yAxisFormatter: niceBytes,
    xAxisFormatter: getTimeFromTimestamp,
  },
  {
    title: "Object size distribution",
    data: [],
    widgetConfiguration: [
      {
        dataKey: "a",
        color: colorsMain[0],
        background: {
          fill: "rgba(0,0,0,0.1)",
        },
      },
    ],
    type: widgetType.barChart,
    layoutIdentifier: "panel-5",
  },
  {
    title: "Total Online Servers",
    data: "N/A",
    type: widgetType.singleValue,
    layoutIdentifier: "panel-6",
  },
  {
    title: "Total Offline Servers",
    data: "N/A",
    type: widgetType.singleValue,
    layoutIdentifier: "panel-7",
  },
  {
    title: "Total S3 Traffic Inbound",
    data: [],
    innerLabel: "N/A",
    type: widgetType.singleRep,
    layoutIdentifier: "panel-8",
    color: "#22B573",
    fillColor: "#A6E8C4",
    labelDisplayFunction: niceBytes,
  },
  {
    title: "Total S3 Traffic Outbound",
    data: [],
    innerLabel: "N/A",
    type: widgetType.singleRep,
    layoutIdentifier: "panel-9",
    color: "#22B573",
    fillColor: "#A6E8C4",
    labelDisplayFunction: niceBytes,
  },
  {
    title: "Number of Buckets",
    data: [],
    innerLabel: "N/A",
    type: widgetType.singleRep,
    color: "#0071BC",
    fillColor: "#ADD5E0",
    layoutIdentifier: "panel-10",
  },
  {
    title: "Number of Objects",
    data: [],
    innerLabel: "N/A",
    type: widgetType.singleRep,
    color: "#0071BC",
    fillColor: "#ADD5E0",
    layoutIdentifier: "panel-11",
  },
  {
    title: "S3 API Request & Error Rate",
    data: [],
    widgetConfiguration: [
      {
        dataKey: "",
        keyLabel: "",
        lineColor: "#000",
        fillColor: "#000",
      },
    ],
    type: widgetType.linearGraph,
    layoutIdentifier: "panel-12",
    disableYAxis: true,
    xAxisFormatter: getTimeFromTimestamp,
  },
  {
    title: "Total Open FDs",
    data: [],
    innerLabel: "N/A",
    type: widgetType.singleRep,
    layoutIdentifier: "panel-13",
    color: "#F7655E",
    fillColor: "#F4CECE",
  },
  {
    title: "Total Goroutines",
    data: [],
    innerLabel: "N/A",
    type: widgetType.singleRep,
    layoutIdentifier: "panel-14",
    color: "#F7655E",
    fillColor: "#F4CECE",
  },
  {
    title: "S3 API Data Transfer",
    data: [],
    widgetConfiguration: [
      {
        dataKey: "",
        keyLabel: "",
        lineColor: "#000",
        fillColor: "#000",
      },
    ],
    type: widgetType.linearGraph,
    layoutIdentifier: "panel-15",
    disableYAxis: true,
    xAxisFormatter: getTimeFromTimestamp,
  },
];

const calculateMainValue = (elements: any[], metricCalc: string) => {
  switch (metricCalc) {
    case "mean":
      const sumValues = elements.reduce((accumulator, currValue) => {
        return accumulator + parseFloat(currValue[1]);
      }, 0);

      const mean = Math.floor(sumValues / elements.length);

      return ["", mean.toString()];
    default:
      const sortResult = elements.sort(
        (value1: any[], value2: any[]) => value1[0] - value2[0]
      );

      return sortResult[sortResult.length - 1];
  }
};

export const getWidgetsWithValue = (payload: any[]) => {
  return panelsConfiguration.map((panelItem) => {
    const payloadData = payload.find(
      (panelT) => panelT.title === panelItem.title
    );

    if (!payloadData) {
      return panelItem;
    }

    const typeOfPayload = payloadData.type;

    switch (panelItem.type) {
      case widgetType.singleValue:
        if (typeOfPayload === "stat" || typeOfPayload === "singlestat") {
          // We sort values & get the last value
          const elements = get(payloadData, "targets[0].result[0].values", []);
          const metricCalc = get(
            payloadData,
            "options.reduceOptions.calcs[0]",
            "lastNotNull"
          );

          const valueDisplay = calculateMainValue(elements, metricCalc);

          const data = panelItem.labelDisplayFunction
            ? panelItem.labelDisplayFunction(valueDisplay[1])
            : valueDisplay[1];

          return {
            ...panelItem,
            data,
          };
        }
        break;
      case widgetType.pieChart:
        if (typeOfPayload === "gauge") {
          const chartSeries = get(payloadData, "targets[0].result", []);
          const metricCalc = get(
            payloadData,
            "options.reduceOptions.calcs[0]",
            "lastNotNull"
          );

          const totalValues = calculateMainValue(
            chartSeries[0].values,
            metricCalc
          );

          const values = chartSeries.map((elementValue: any) => {
            const values = get(elementValue, "values", []);
            const metricKeyItem = Object.keys(elementValue.metric);

            const sortResult = values.sort(
              (value1: any[], value2: any[]) => value1[0] - value2[0]
            );

            const metricName = elementValue.metric[metricKeyItem[0]];
            const value = sortResult[sortResult.length - 1];
            return { name: metricName, value: parseInt(value) };
          });

          const innerLabel = panelItem.labelDisplayFunction
            ? panelItem.labelDisplayFunction(totalValues)
            : totalValues;

          return {
            ...panelItem,
            data: values,
            innerLabel,
          };
        }
        break;
      case widgetType.linearGraph:
        if (typeOfPayload === "graph") {
          const targets = get(payloadData, "targets", []);

          const series: any[] = [];
          const plotValues: any[] = [];

          targets.forEach(
            (
              targetMaster: { legendFormat: string; result: any[] },
              index: number
            ) => {
              const keyName = `key_${index}`;
              // Add a new serie to plot variables
              series.push({
                dataKey: keyName,
                keyLabel: targetMaster.legendFormat,
                lineColor: colorsMain[index] || colorsMain[0],
                fillColor: colorsMain[index] || colorsMain[0],
              });

              // we iterate over values and create elements
              const values = get(targetMaster, "result[0].values", []);

              values.forEach((valInfo: any[]) => {
                const itemIndex = plotValues.findIndex(
                  (element) => element.name === valInfo[0]
                );

                // Element not exists yet
                if (itemIndex === -1) {
                  let itemToPush: any = { name: valInfo[0] };
                  itemToPush[keyName] = valInfo[1];

                  plotValues.push(itemToPush);
                } else {
                  plotValues[itemIndex][keyName] = valInfo[1];
                }
              });
            }
          );

          const sortedVals = plotValues.sort(
            (value1: any, value2: any) => value1.name - value2.name
          );

          return {
            ...panelItem,
            widgetConfiguration: series,
            data: sortedVals,
          };
        }
        break;
      case widgetType.barChart:
        if (typeOfPayload === "bargauge") {
          const chartBars = get(payloadData, "targets[0].result", []);

          const values = chartBars.map((elementValue: any) => {
            const metricKeyItem = Object.keys(elementValue.metric);

            const metricName = elementValue.metric[metricKeyItem[0]];

            const elements = get(elementValue, "values", []);

            const sortResult = elements.sort(
              (value1: any[], value2: any[]) => value1[0] - value2[0]
            );
            const lastValue = sortResult[sortResult.length - 1];
            return { name: metricName, a: parseInt(lastValue[1]) };
          });

          return {
            ...panelItem,
            data: values,
          };
        }
        break;
      case widgetType.singleRep:
        if (typeOfPayload === "stat") {
          // We sort values & get the last value
          const elements = get(payloadData, "targets[0].result[0].values", []);
          const metricCalc = get(
            payloadData,
            "options.reduceOptions.calcs[0]",
            "lastNotNull"
          );

          const valueDisplay = calculateMainValue(elements, metricCalc);

          const sortResult = elements.sort(
            (value1: any[], value2: any[]) => value1[0] - value2[0]
          );

          let valuesForBackground = [];

          if (sortResult.length === 1) {
            valuesForBackground.push({ value: 0 });
          }

          sortResult.forEach((eachVal: any) => {
            valuesForBackground.push({ value: parseInt(eachVal[1]) });
          });

          const innerLabel = panelItem.labelDisplayFunction
            ? panelItem.labelDisplayFunction(valueDisplay[1])
            : valueDisplay[1];

          return {
            ...panelItem,
            data: valuesForBackground,
            innerLabel,
          };
        }
        break;
    }

    return panelItem;
  });
};
