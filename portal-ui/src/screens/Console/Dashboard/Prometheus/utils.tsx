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

import React, { Fragment } from "react";
import get from "lodash/get";
import { IDashboardPanel, widgetType } from "./types";
import {
  getTimeFromTimestamp,
  niceBytes,
  niceDays,
  representationNumber,
  textToRGBColor,
  units,
} from "../../../../common/utils";
import { DiagnosticsIcon, HealIcon, UptimeIcon } from "mds";

const colorsMain = [
  "#C4D4E9",
  "#DCD1EE",
  "#D1EEE7",
  "#EEDED1",
  "#AAF38F",
  "#F9E6C5",
  "#C83B51",
  "#F4CECE",
  "#D6D6D6",
];

const niceDaysFromNS = (seconds: string) => {
  return niceDays(seconds, "ns");
};

const roundNumber = (value: string) => {
  return parseInt(value).toString(10);
};

export const panelsConfiguration: IDashboardPanel[] = [
  {
    id: 1,
    title: "Uptime",
    data: "N/A",
    type: widgetType.simpleWidget,
    widgetIcon: <UptimeIcon />,
    labelDisplayFunction: niceDays,
  },
  {
    id: 50,
    title: "Capacity",
    data: [],
    dataOuter: [{ name: "outer", value: 100 }],
    widgetConfiguration: {
      outerChart: {
        colorList: ["#9c9c9c"],
        innerRadius: 0,
        outerRadius: 0,
        startAngle: 0,
        endAngle: 0,
      },
      innerChart: {
        colorList: colorsMain,
        innerRadius: 20,
        outerRadius: 50,
        startAngle: 90,
        endAngle: -200,
      },
    },
    type: widgetType.pieChart,
    innerLabel: "N/A",
    labelDisplayFunction: niceBytes,
  },
  {
    id: 51,
    title: "Usable Capacity",
    data: [],
    dataOuter: [{ name: "outer", value: 100 }],
    widgetConfiguration: {
      outerChart: {
        colorList: ["#9c9c9c"],
        innerRadius: 0,
        outerRadius: 0,
        startAngle: 0,
        endAngle: 0,
      },
      innerChart: {
        colorList: colorsMain,
        innerRadius: 20,
        outerRadius: 50,
        startAngle: 90,
        endAngle: -200,
      },
    },
    type: widgetType.pieChart,
    innerLabel: "N/A",
    labelDisplayFunction: niceBytes,
  },
  {
    id: 68,
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
    type: widgetType.areaGraph,
    yAxisFormatter: niceBytes,
    xAxisFormatter: getTimeFromTimestamp,
  },
  {
    id: 52,
    title: "Object size distribution",
    data: [],
    widgetConfiguration: [
      {
        dataKey: "a",
        color: "#2781B0",
        background: {
          fill: "#EEF1F4",
        },
        greatestColor: "#081C42",
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
  },
  {
    id: 66,
    title: "Buckets",
    data: [],
    innerLabel: "N/A",
    type: widgetType.singleRep,
    color: "#0071BC",
    fillColor: "#ADD5E0",
  },
  {
    id: 44,
    title: "Objects",
    data: [],
    innerLabel: "N/A",
    type: widgetType.singleRep,
    color: "#0071BC",
    fillColor: "#ADD5E0",
  },
  {
    id: 63,
    title: "API Data Received Rate",
    data: [],
    widgetConfiguration: [
      {
        dataKey: "",
        keyLabel: "",
        lineColor: "#000",
        fillColor: "#000",
        strokeWidth: 3,
      },
    ],
    type: widgetType.linearGraph,

    xAxisFormatter: getTimeFromTimestamp,
    yAxisFormatter: niceBytes,
  },
  {
    id: 61,
    title: "Total Open FDs",
    data: [],
    innerLabel: "N/A",
    type: widgetType.singleRep,
    color: "#22B573",
    fillColor: "#A6E8C4",
  },
  {
    id: 62,
    title: "Total Goroutines",
    data: [],
    innerLabel: "N/A",
    type: widgetType.singleRep,
    color: "#F7655E",
    fillColor: "#F4CECE",
  },
  {
    id: 77,
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

    yAxisFormatter: roundNumber,
    xAxisFormatter: getTimeFromTimestamp,
  },
  {
    id: 60,
    title: "API Request Rate",
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
    yAxisFormatter: roundNumber,
    xAxisFormatter: getTimeFromTimestamp,
  },
  {
    id: 70,
    title: "API Data Sent Rate",
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

    xAxisFormatter: getTimeFromTimestamp,
    yAxisFormatter: niceBytes,
  },
  {
    id: 17,
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

    yAxisFormatter: niceBytes,
    xAxisFormatter: getTimeFromTimestamp,
  },
  {
    id: 73,
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

    yAxisFormatter: niceBytes,
    xAxisFormatter: getTimeFromTimestamp,
  },
  {
    id: 80,
    title: "Time Since Last Heal Activity",
    data: "N/A",
    type: widgetType.simpleWidget,
    widgetIcon: <HealIcon />,
    labelDisplayFunction: niceDaysFromNS,
  },
  {
    id: 81,
    title: "Time Since Last Scan Activity",
    data: "N/A",
    type: widgetType.simpleWidget,
    widgetIcon: <DiagnosticsIcon />,
    labelDisplayFunction: niceDaysFromNS,
  },
  {
    id: 71,
    title: "API Request Error Rate",
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

    xAxisFormatter: getTimeFromTimestamp,
  },
  {
    id: 76,
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

    xAxisFormatter: getTimeFromTimestamp,
    yAxisFormatter: niceBytes,
  },
  {
    id: 74,
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

    xAxisFormatter: getTimeFromTimestamp,
    yAxisFormatter: niceBytes,
  },
  {
    id: 82,
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

    disableYAxis: true,
    xAxisFormatter: getTimeFromTimestamp,
  },
  {
    id: 11,
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
    yAxisFormatter: roundNumber,
    xAxisFormatter: getTimeFromTimestamp,
  },
  {
    id: 8,
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
    yAxisFormatter: roundNumber,
    xAxisFormatter: getTimeFromTimestamp,
  },
  {
    id: 500,
    mergedPanels: [
      {
        id: 53,
        title: "Online",
        data: "N/A",
        type: widgetType.singleValue,
      },
      {
        id: 69,
        title: "Offline",
        data: "N/A",
        type: widgetType.singleValue,
      },
    ],
    title: "Servers",
  },
  {
    id: 501,
    mergedPanels: [
      {
        id: 9,
        title: "Online",
        data: "N/A",
        type: widgetType.singleValue,
      },
      {
        id: 78,
        title: "Offline",
        data: "N/A",
        type: widgetType.singleValue,
      },
    ],
    title: "Drives",
  },
  {
    id: 502,
    mergedPanels: [
      {
        id: 65,
        title: "Upload",
        data: "N/A",
        type: widgetType.singleValue,

        labelDisplayFunction: niceBytes,
      },
      {
        id: 64,
        title: "Download",
        data: "N/A",
        type: widgetType.singleValue,

        labelDisplayFunction: niceBytes,
      },
    ],
    title: "Network",
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
        (value1: any[], value2: any[]) => value1[0] - value2[0],
      );

      return sortResult[sortResult.length - 1];
  }
};

const constructLabelNames = (metrics: any, legendFormat: string) => {
  const keysToReplace = Object.keys(metrics);
  const expToReplace = new RegExp(`{{(${keysToReplace.join("|")})}}`, "g");

  let replacedLegend = legendFormat.replace(expToReplace, (matchItem) => {
    const nwMatchItem = matchItem.replace(/({{|}})/g, "");
    return metrics[nwMatchItem];
  });

  const countVarsOpen = (replacedLegend.match(/{{/g) || []).length;
  const countVarsClose = (replacedLegend.match(/}}/g) || []).length;

  let cleanLegend = replacedLegend.replace(/{{(.*?)}}/g, "");

  if (
    countVarsOpen === countVarsClose &&
    countVarsOpen !== 0 &&
    countVarsClose !== 0
  ) {
    keysToReplace.forEach((element) => {
      replacedLegend = replacedLegend.replace(element, metrics[element]);
    });

    cleanLegend = replacedLegend;
  }

  // In case not all the legends were replaced, we remove the placeholders.
  return cleanLegend;
};

export const widgetDetailsToPanel = (
  payloadData: any,
  panelItem: IDashboardPanel,
) => {
  if (!payloadData) {
    return panelItem;
  }

  const typeOfPayload = payloadData.type;

  switch (panelItem.type) {
    case widgetType.singleValue:
    case widgetType.simpleWidget:
      if (typeOfPayload === "stat" || typeOfPayload === "singlestat") {
        // We sort values & get the last value
        let elements = get(payloadData, "targets[0].result[0].values", []);

        if (elements === null) {
          elements = [];
        }

        const metricCalc = get(
          payloadData,
          "options.reduceOptions.calcs[0]",
          "lastNotNull",
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
        const metricCalc = get(
          payloadData,
          "options.reduceOptions.calcs[0]",
          "lastNotNull",
        );

        let chartSeries = get(payloadData, "targets", []).filter(
          (seriesItem: any) => seriesItem !== null,
        );

        const values = chartSeries.map((chartTarget: any) => {
          const resultMap =
            chartTarget.result && Array.isArray(chartTarget.result)
              ? chartTarget.result
              : [];

          const values = resultMap.map((elementValue: any) => {
            const values = get(elementValue, "values", []);
            const metricKeyItem = Object.keys(elementValue.metric);
            const sortResult = values.sort(
              (value1: any[], value2: any[]) =>
                parseInt(value1[0][1]) - parseInt(value2[0][1]),
            );

            const metricName = elementValue.metric[metricKeyItem[0]];
            const value = sortResult[sortResult.length - 1];
            return {
              name: metricName,
              value: parseInt(value[1]),
              legend: chartTarget.legendFormat,
            };
          });

          return values;
        });

        const firstTarget =
          chartSeries[0].result && chartSeries[0].result.length > 0
            ? chartSeries[0].result[0].values
            : [];

        const totalValues = calculateMainValue(firstTarget, metricCalc);

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
    case widgetType.areaGraph:
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
            index: number,
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
                legendFormat,
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
                  (element) => element.name === valInfo[0],
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
          },
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
              lineColor: colorsMain[index] || textToRGBColor(serialC.keyLabel),
              fillColor: colorsMain[index] || textToRGBColor(serialC.keyLabel),
            };
          },
        );

        const sortedVals = plotValues.sort(
          (value1: any, value2: any) => value1.name - value2.name,
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
              return element.metric.range === structureItem.originTag;
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
          "lastNotNull",
        );

        const valueDisplay = calculateMainValue(elements, metricCalc);

        const sortResult = elements.sort(
          (value1: any[], value2: any[]) => value1[0] - value2[0],
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
};

const verifyNumeric = (item: string) => {
  return !isNaN(parseFloat(item));
};

export const splitSizeMetric = (val: string) => {
  const splittedText = val.split(" ");
  // Value is not a size metric, we return as common string

  const singleValue = () => {
    let vl = val;

    if (verifyNumeric(val)) {
      vl = representationNumber(parseFloat(val));
    }
    return <Fragment>{vl}</Fragment>;
  };

  if (splittedText.length !== 2) {
    return singleValue();
  }

  if (!units.includes(splittedText[1])) {
    return singleValue();
  }

  return (
    <span className="commonValue">
      {splittedText[0]}
      <span className="unitText">{splittedText[1]}</span>
    </span>
  );
};
