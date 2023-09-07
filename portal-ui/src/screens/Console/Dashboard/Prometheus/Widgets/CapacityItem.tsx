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

import React, { useEffect, useState } from "react";
import styled from "styled-components";
import get from "lodash/get";
import { Box, breakPoints, Loader, ReportedUsageIcon } from "mds";
import { Cell, Pie, PieChart } from "recharts";
import { useSelector } from "react-redux";
import api from "../../../../../common/api";
import { IDashboardPanel } from "../types";
import { widgetDetailsToPanel } from "../utils";
import { ErrorResponseHandler } from "../../../../../common/types";
import {
  calculateBytes,
  capacityColors,
  niceBytesInt,
} from "../../../../../common/utils";
import { setErrorSnackMessage } from "../../../../../systemSlice";
import { AppState, useAppDispatch } from "../../../../../store";

const CapacityItemMain = styled.div(({ theme }) => ({
  flex: 1,
  display: "flex",
  alignItems: "center",
  flexFlow: "row",
  "& .usableLabel": {
    color: get(theme, "mutedText", "#87888d"),
    fontSize: "10px",
    display: "flex",
    flexFlow: "column",
    alignItems: "center",
    textAlign: "center",
  },
  "& .usedLabel": {
    color: get(theme, "mutedText", "#87888d"),
    fontWeight: "bold",
    fontSize: "14px",
  },
  "& .totalUsed": {
    display: "flex",
    "& .value": {
      fontSize: "50px",
      fontFamily: "Inter",
      fontWeight: 600,
      alignSelf: "flex-end",
      lineHeight: 1,
    },
    "& .unit": {
      color: get(theme, "mutedText", "#87888d"),
      fontWeight: "bold",
      fontSize: "14px",
      marginLeft: "12px",
      alignSelf: "flex-end",
    },
  },
  "& .ofUsed": {
    marginTop: "5px",
    "& .value": {
      color: get(theme, "mutedText", "#87888d"),
      fontWeight: "bold",
      fontSize: "14px",
      textAlign: "right",
    },
  },
  [`@media (max-width: ${breakPoints.sm}px)`]: {
    flexFlow: "column",
  },
}));

const CapacityItem = ({
  value,
  timeStart,
  timeEnd,
  apiPrefix,
}: {
  value: IDashboardPanel;
  timeStart: any;
  timeEnd: any;
  apiPrefix: string;
}) => {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState<boolean>(false);

  const [totalUsableFree, setTotalUsableFree] = useState<number>(0);
  const [totalUsableFreeRatio, setTotalUsableFreeRatio] = useState<number>(0);
  const [totalUsed, setTotalUsed] = useState<number>(0);
  const [totalUsable, setTotalUsable] = useState<number>(0);
  const widgetVersion = useSelector(
    (state: AppState) => state.dashboard.widgetLoadVersion,
  );

  useEffect(() => {
    setLoading(true);
  }, [widgetVersion]);

  useEffect(() => {
    if (loading) {
      let stepCalc = 0;
      if (timeStart !== null && timeEnd !== null) {
        const secondsInPeriod =
          timeEnd.toUnixInteger() - timeStart.toUnixInteger();
        const periods = Math.floor(secondsInPeriod / 60);

        stepCalc = periods < 1 ? 15 : periods;
      }

      api
        .invoke(
          "GET",
          `/api/v1/${apiPrefix}/info/widgets/${value.id}/?step=${stepCalc}&${
            timeStart !== null ? `&start=${timeStart.toUnixInteger()}` : ""
          }${timeStart !== null && timeEnd !== null ? "&" : ""}${
            timeEnd !== null ? `end=${timeEnd.toUnixInteger()}` : ""
          }`,
        )
        .then((res: any) => {
          const widgetsWithValue = widgetDetailsToPanel(res, value);

          let tUsable = 0;
          let tUsed = 0;
          let tFree = 0;

          widgetsWithValue.data.forEach((eachArray: any[]) => {
            eachArray.forEach((itemSum) => {
              switch (itemSum.legend) {
                case "Total Usable":
                  tUsable += itemSum.value;
                  break;
                case "Used Space":
                  tUsed += itemSum.value;
                  break;
                case "Usable Free":
                  tFree += itemSum.value;
                  break;
              }
            });
          });

          const freeRatio = Math.round((tFree / tUsable) * 100);

          setTotalUsableFree(tFree);
          setTotalUsableFreeRatio(freeRatio);
          setTotalUsed(tUsed);
          setTotalUsable(tUsable);

          setLoading(false);
        })
        .catch((err: ErrorResponseHandler) => {
          dispatch(setErrorSnackMessage(err));
          setLoading(false);
        });
    }
  }, [loading, value, timeEnd, timeStart, dispatch, apiPrefix]);

  const usedConvert = calculateBytes(totalUsed, true, false);

  const plotValues = [
    {
      value: totalUsableFree,
      color: "#D6D6D6",
      label: "Usable Available Space",
    },
    {
      value: totalUsed,
      color: capacityColors(totalUsed, totalUsable),
      label: "Used Space",
    },
  ];
  return (
    <CapacityItemMain>
      <Box
        sx={{
          fontSize: "16px",
          fontWeight: 600,
          [`@media (max-width: ${breakPoints.sm}px)`]: {
            alignSelf: "flex-start",
          },
        }}
      >
        Capacity
      </Box>
      <Box
        sx={{
          position: "relative",
          width: 110,
          height: 110,
          marginLeft: "auto",
          [`@media (max-width: ${breakPoints.sm}px)`]: {
            marginLeft: "",
          },
        }}
      >
        <Box
          sx={{
            position: "absolute",
            display: "flex",
            flexFlow: "column",
            alignItems: "center",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            fontWeight: "bold",
            fontSize: 12,
          }}
        >
          {`${totalUsableFreeRatio}%`}
          <br />
          <Box className={"usableLabel"}>Free</Box>
        </Box>
        <PieChart width={110} height={110}>
          <Pie
            data={plotValues}
            cx={"50%"}
            cy={"50%"}
            dataKey="value"
            outerRadius={50}
            innerRadius={40}
            startAngle={-70}
            endAngle={360}
            animationDuration={1}
          >
            {plotValues.map((entry, index) => (
              <Cell key={`cellCapacity-${index}`} fill={entry.color} />
            ))}
          </Pie>
        </PieChart>
      </Box>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          marginLeft: "auto",
          [`@media (max-width: ${breakPoints.sm}px)`]: {
            marginLeft: "",
          },
        }}
      >
        <Box>
          <Box className={"usedLabel"}>Used:</Box>
          <Box className={"totalUsed"}>
            <div className="value">{usedConvert.total}</div>
            <div className="unit">{usedConvert.unit}</div>
          </Box>
          <Box className={"ofUsed"}>
            <div className="value">Of: {niceBytesInt(totalUsable)}</div>
          </Box>
        </Box>

        <Box
          sx={{
            marginLeft: "15px",
            height: "100%",
            display: "flex",
            alignItems: "flex-start",
          }}
        >
          <Box>
            {loading ? (
              <Loader style={{ width: "26px", height: "26px" }} />
            ) : (
              <ReportedUsageIcon />
            )}
          </Box>
        </Box>
      </Box>
    </CapacityItemMain>
  );
};

export default CapacityItem;
