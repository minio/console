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

import get from "lodash/get";
import { Layout } from "react-grid-layout";
import { IDashboardPanel, widgetType } from "./types";
import {
  getTimeFromTimestamp,
  niceBytes,
  niceDays,
  textToRGBColor,
} from "../../../../common/utils";

const dLocalStorageV = "dashboardConfig";

export const defaultWidgetsLayout: Layout[] = [
  {
    w: 1,
    h: 2,
    x: 0,
    y: 0,
    i: "panel-0",
    minW: 1,
    moved: false,
    static: false,
  },
  {
    w: 1,
    h: 1,
    x: 1,
    y: 2,
    i: "panel-1",
    minW: 1,
    moved: false,
    static: false,
  },
  {
    w: 1,
    h: 1,
    x: 1,
    y: 3,
    i: "panel-2",
    minW: 1,
    moved: false,
    static: false,
  },
  {
    w: 1,
    h: 2,
    x: 2,
    y: 0,
    i: "panel-3",
    minW: 1,
    moved: false,
    static: false,
  },
  {
    w: 2,
    h: 2,
    x: 3,
    y: 0,
    i: "panel-4",
    minW: 2,
    moved: false,
    static: false,
  },
  {
    w: 2,
    h: 2,
    x: 5,
    y: 0,
    i: "panel-5",
    minW: 2,
    moved: false,
    static: false,
  },
  {
    w: 1,
    h: 1,
    x: 0,
    y: 2,
    i: "panel-6",
    minW: 1,
    moved: false,
    static: false,
  },
  {
    w: 1,
    h: 1,
    x: 0,
    y: 3,
    i: "panel-7",
    minW: 1,
    moved: false,
    static: false,
  },
  {
    w: 1,
    h: 1,
    x: 2,
    y: 2,
    i: "panel-8",
    minW: 1,
    moved: false,
    static: false,
  },
  {
    w: 1,
    h: 1,
    x: 2,
    y: 3,
    i: "panel-9",
    minW: 1,
    moved: false,
    static: false,
  },
  {
    w: 2,
    h: 2,
    x: 3,
    y: 2,
    i: "panel-10",
    minW: 2,
    moved: false,
    static: false,
  },
  {
    w: 1,
    h: 1,
    x: 7,
    y: 0,
    i: "panel-11",
    minW: 1,
    moved: false,
    static: false,
  },
  {
    w: 1,
    h: 1,
    x: 7,
    y: 1,
    i: "panel-12",
    minW: 1,
    moved: false,
    static: false,
  },
  {
    w: 4,
    h: 3,
    x: 0,
    y: 10,
    i: "panel-13",
    minW: 2,
    moved: false,
    static: false,
  },
  {
    w: 4,
    h: 3,
    x: 0,
    y: 4,
    i: "panel-14",
    minW: 2,
    moved: false,
    static: false,
  },
  {
    w: 2,
    h: 2,
    x: 5,
    y: 2,
    i: "panel-15",
    minW: 2,
    moved: false,
    static: false,
  },
  {
    w: 8,
    h: 3,
    x: 0,
    y: 7,
    i: "panel-16",
    minW: 2,
    moved: false,
    static: false,
  },
  {
    w: 8,
    h: 3,
    x: 0,
    y: 19,
    i: "panel-19",
    minW: 2,
    moved: false,
    static: false,
  },
  {
    w: 1,
    h: 1,
    x: 7,
    y: 2,
    i: "panel-20",
    minW: 1,
    moved: false,
    static: false,
  },
  {
    w: 1,
    h: 1,
    x: 7,
    y: 3,
    i: "panel-21",
    minW: 1,
    moved: false,
    static: false,
  },
  {
    w: 4,
    h: 3,
    x: 4,
    y: 4,
    i: "panel-22",
    minW: 2,
    moved: false,
    static: false,
  },
  {
    w: 4,
    h: 3,
    x: 4,
    y: 10,
    i: "panel-23",
    minW: 2,
    moved: false,
    static: false,
  },
  {
    w: 4,
    h: 3,
    x: 0,
    y: 13,
    i: "panel-24",
    minW: 2,
    moved: false,
    static: false,
  },
  {
    w: 4,
    h: 3,
    x: 4,
    y: 13,
    i: "panel-25",
    minW: 2,
    moved: false,
    static: false,
  },
  {
    w: 4,
    h: 3,
    x: 0,
    y: 16,
    i: "panel-26",
    minW: 2,
    moved: false,
    static: false,
  },
  {
    w: 4,
    h: 3,
    x: 4,
    y: 16,
    i: "panel-27",
    minW: 2,
    moved: false,
    static: false,
  },
  {
    w: 1,
    h: 1,
    x: 1,
    y: 0,
    i: "panel-28",
    minW: 1,
    moved: false,
    static: false,
  },
  {
    w: 1,
    h: 1,
    x: 1,
    y: 1,
    i: "panel-29",
    minW: 1,
    moved: false,
    static: false,
  },
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

const niceDaysFromNS = (seconds: string) => {
  return niceDays(seconds, 'ns');
}

export const panelsConfiguration: IDashboardPanel[] = [
  {
    title: "Uptime",
    data: "N/A",
    type: widgetType.singleValue,
    layoutIdentifier: "panel-0",
    labelDisplayFunction: niceDays,
  },
  {
    title: "Total Online Disks",
    data: "N/A",
    type: widgetType.singleValue,
    layoutIdentifier: "panel-1",
  },
  {
    title: "Total Offline Disks",
    data: "N/A",
    type: widgetType.singleValue,
    layoutIdentifier: "panel-2",
  },
  {
    title: "Current Usable Capacity",
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
    title: "Data Usage Growth",
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
    customStructure: [
      { originTag: "LESS_THAN_1024_B", displayTag: "Less than 1024B" },
      {
        originTag: "BETWEEN_1024_B_AND_1_MB",
        displayTag: "Between 1024B and 1MB",
      },
      {
        originTag: "BETWEEN_1_MB_AND_10_MB",
        displayTag: "Between 1MB and 10MB",
      },
      {
        originTag: "BETWEEN_10_MB_AND_64_MB",
        displayTag: "Between 10MB and 64MB",
      },
      {
        originTag: "BETWEEN_64_MB_AND_128_MB",
        displayTag: "Between 64MB and 128MB",
      },
      {
        originTag: "BETWEEN_128_MB_AND_512_MB",
        displayTag: "Between 128MB and 512MB",
      },
      {
        originTag: "GREATER_THAN_512_MB",
        displayTag: "Greater than 512MB",
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
    title: "Number of Buckets",
    data: [],
    innerLabel: "N/A",
    type: widgetType.singleRep,
    color: "#0071BC",
    fillColor: "#ADD5E0",
    layoutIdentifier: "panel-8",
  },
  {
    title: "Number of Objects",
    data: [],
    innerLabel: "N/A",
    type: widgetType.singleRep,
    color: "#0071BC",
    fillColor: "#ADD5E0",
    layoutIdentifier: "panel-9",
  },
  {
    title: "S3 API Data Received Rate",
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
    layoutIdentifier: "panel-10",
    disableYAxis: true,
    xAxisFormatter: getTimeFromTimestamp,
  },
  {
    title: "Total Open FDs",
    data: [],
    innerLabel: "N/A",
    type: widgetType.singleRep,
    layoutIdentifier: "panel-11",
    color: "#22B573",
    fillColor: "#A6E8C4",
  },
  {
    title: "Total Goroutines",
    data: [],
    innerLabel: "N/A",
    type: widgetType.singleRep,
    layoutIdentifier: "panel-12",
    color: "#F7655E",
    fillColor: "#F4CECE",
  },
  {
    title: "Node CPU Usage",
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
    layoutIdentifier: "panel-13",
    disableYAxis: true,
    xAxisFormatter: getTimeFromTimestamp,
  },
  {
    title: "S3 API Request Rate",
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
    layoutIdentifier: "panel-14",
    yAxisFormatter: niceBytes,
    xAxisFormatter: getTimeFromTimestamp,
  },
  {
    title: "S3 API Data Sent Rate",
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
    xAxisFormatter: getTimeFromTimestamp,
  },
  {
    title: "Internode Data Transfer",
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
    layoutIdentifier: "panel-16",
    yAxisFormatter: niceBytes,
    xAxisFormatter: getTimeFromTimestamp,
  },
  {
    title: "Node IO",
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
    layoutIdentifier: "panel-19",
    yAxisFormatter: niceBytes,
    xAxisFormatter: getTimeFromTimestamp,
  },
  {
    title: "Time Since Last Heal Activity",
    data: "N/A",
    type: widgetType.singleValue,
    layoutIdentifier: "panel-20",
    labelDisplayFunction: niceDaysFromNS,
  },
  {
    title: "Time Since Last Scan Activity",
    data: "N/A",
    type: widgetType.singleValue,
    layoutIdentifier: "panel-21",
    labelDisplayFunction: niceDaysFromNS,
  },
  {
    title: "S3 API Request Error Rate",
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
    layoutIdentifier: "panel-22",
    disableYAxis: true,
    xAxisFormatter: getTimeFromTimestamp,
  },
  {
    title: "Node Memory Usage",
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
    layoutIdentifier: "panel-23",
    disableYAxis: true,
    xAxisFormatter: getTimeFromTimestamp,
    yAxisFormatter: niceBytes,
  },
  {
    title: "Drive Used Capacity",
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
    layoutIdentifier: "panel-24",
    disableYAxis: true,
    xAxisFormatter: getTimeFromTimestamp,
    yAxisFormatter: niceBytes,
  },
  {
    title: "Drives Free Inodes",
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
    layoutIdentifier: "panel-25",
    disableYAxis: true,
    xAxisFormatter: getTimeFromTimestamp,
  },
  {
    title: "Node Syscalls",
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
    layoutIdentifier: "panel-26",
    disableYAxis: true,
    xAxisFormatter: getTimeFromTimestamp,
  },
  {
    title: "Node File Descriptors",
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
    layoutIdentifier: "panel-27",
    disableYAxis: true,
    xAxisFormatter: getTimeFromTimestamp,
  },
  {
    title: "Total S3 Traffic Inbound",
    data: "N/A",
    type: widgetType.singleValue,
    layoutIdentifier: "panel-28",
    labelDisplayFunction: niceBytes,
  },
  {
    title: "Total S3 Traffic Outbound",
    data: "N/A",
    type: widgetType.singleValue,
    layoutIdentifier: "panel-29",
    labelDisplayFunction: niceBytes,
  },
];

const calculateMainValue = (elements: any[], metricCalc: string) => {
  if (elements.length === 0) {
    return ["", "0"];
  }

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

const constructLabelNames = (metrics: any, legendFormat: string) => {
  const keysToReplace = Object.keys(metrics);
  const expToReplace = new RegExp(`{{(${keysToReplace.join("|")})}}`, "g");

  const replacedLegend = legendFormat.replace(expToReplace, (matchItem) => {
    const nwMatchItem = matchItem.replace(/({{|}})/g, "");
    return metrics[nwMatchItem];
  });

  // In case not all the legends were replaced, we remove the placeholders.
  return replacedLegend.replace(/{{(.*?)}}/g, "");
};

export const getWidgetsWithValue = (payload: any[]) => {
  return panelsConfiguration.map((panelItem) => {
    const payloadData = payload.find(
      (panelT) => panelT.title.toLowerCase().trim() === panelItem.title.toLowerCase().trim()
    );

    if (!payloadData) {
      return panelItem;
    }

    const typeOfPayload = payloadData.type;

    switch (panelItem.type) {
      case widgetType.singleValue:
        if (typeOfPayload === "stat" || typeOfPayload === "singlestat") {
          // We sort values & get the last value
          let elements = get(payloadData, "targets[0].result[0].values", []);

          if (elements === null) {
            elements = [];
          }

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
          let chartSeries = get(payloadData, "targets[0].result", []);

          if (chartSeries === null) {
            chartSeries = [];
          }

          const metricCalc = get(
            payloadData,
            "options.reduceOptions.calcs[0]",
            "lastNotNull"
          );

          const valuesArray =
            chartSeries.length > 0 ? chartSeries[0].values : [];

          const totalValues = calculateMainValue(valuesArray, metricCalc);

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
            ? panelItem.labelDisplayFunction(totalValues[1])
            : totalValues[1];

          return {
            ...panelItem,
            data: values,
            innerLabel,
          };
        }
        break;
      case widgetType.linearGraph:
        if (typeOfPayload === "graph") {
          let targets = get(payloadData, "targets", []);
          if (targets === null) {
            targets = [];
          }

          const series: any[] = [];
          const plotValues: any[] = [];

          targets.forEach(
            (
              targetMaster: { legendFormat: string; result: any[] },
              index: number
            ) => {
              // Add a new serie to plot variables in case it is not from multiple values
              let results = get(targetMaster, "result", []);
              const legendFormat = targetMaster.legendFormat;
              if (results === null) {
                results = [];
              }

              results.forEach((itemVals: { metric: object; values: any[] }) => {
                // Label Creation
                const labelName = constructLabelNames(
                  itemVals.metric,
                  legendFormat
                );
                const keyName = `key_${index}${labelName}`;

                // series creation with recently created label
                series.push({
                  dataKey: keyName,
                  keyLabel: labelName,
                  lineColor: "",
                  fillColor: "",
                });

                // we iterate over values and create elements
                let values = get(itemVals, "values", []);
                if (values === null) {
                  values = [];
                }

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
              });
            }
          );

          const sortedSeries = series.sort((series1: any, series2: any) => {
            if (series1.keyLabel < series2.keyLabel) {
              return -1;
            }
            if (series1.keyLabel > series2.keyLabel) {
              return 1;
            }
            return 0;
          });

          const seriesWithColors = sortedSeries.map(
            (serialC: any, index: number) => {
              return {
                ...serialC,
                lineColor:
                  colorsMain[index] || textToRGBColor(serialC.keyLabel),
                fillColor:
                  colorsMain[index] || textToRGBColor(serialC.keyLabel),
              };
            }
          );

          const sortedVals = plotValues.sort(
            (value1: any, value2: any) => value1.name - value2.name
          );

          return {
            ...panelItem,
            widgetConfiguration: seriesWithColors,
            data: sortedVals,
          };
        }
        break;
      case widgetType.barChart:
        if (typeOfPayload === "bargauge") {
          let chartBars = get(payloadData, "targets[0].result", []);

          if (chartBars === null) {
            chartBars = [];
          }

          const sortFunction = (value1: any[], value2: any[]) =>
            value1[0] - value2[0];

          let values = [];
          if (panelItem.customStructure) {
            values = panelItem.customStructure.map((structureItem) => {
              const metricTake = chartBars.find((element: any) => {
                const metricKeyItem = Object.keys(element.metric);

                const metricName = element.metric[metricKeyItem[0]];

                return metricName === structureItem.originTag;
              });

              const elements = get(metricTake, "values", []);

              const sortResult = elements.sort(sortFunction);
              const lastValue = sortResult[sortResult.length - 1] || ["", "0"];

              return {
                name: structureItem.displayTag,
                a: parseInt(lastValue[1]),
              };
            });
          } else {
            // If no configuration is set, we construct the series for bar chart and return the element
            values = chartBars.map((elementValue: any) => {
              const metricKeyItem = Object.keys(elementValue.metric);

              const metricName = elementValue.metric[metricKeyItem[0]];

              const elements = get(elementValue, "values", []);

              const sortResult = elements.sort(sortFunction);
              const lastValue = sortResult[sortResult.length - 1] || ["", "0"];
              return { name: metricName, a: parseInt(lastValue[1]) };
            });
          }

          return {
            ...panelItem,
            data: values,
          };
        }
        break;
      case widgetType.singleRep:
        if (typeOfPayload === "stat") {
          // We sort values & get the last value
          let elements = get(payloadData, "targets[0].result[0].values", []);
          if (elements === null) {
            elements = [];
          }
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

export const saveDashboardDistribution = (configuration: Layout[]) => {
  localStorage.setItem(dLocalStorageV, btoa(JSON.stringify(configuration)));
};

export const getDashboardDistribution = (currentItems: number) => {
  const storedConfiguration = localStorage.getItem(dLocalStorageV);

  if (!storedConfiguration) {
    return defaultWidgetsLayout;
  }

  const parsedConfig = JSON.parse(atob(storedConfiguration));

  if (
    parsedConfig.length === 0 ||
    (parsedConfig.length > 0 && !parsedConfig[0].minW)
  ) {
    return defaultWidgetsLayout;
  }

  // Stored Widgets length is not the same as the currentItems, then we return the new configuration
  if (currentItems !== 0 && parsedConfig.length !== currentItems) {
    return defaultWidgetsLayout;
  }

  return parsedConfig;
};
