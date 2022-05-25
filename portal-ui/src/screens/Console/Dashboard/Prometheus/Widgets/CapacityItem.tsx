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
import { IDashboardPanel } from "../types";
import { Box } from "@mui/material";
import api from "../../../../../common/api";
import { widgetDetailsToPanel } from "../utils";
import { ErrorResponseHandler } from "../../../../../common/types";
import { useDispatch } from "react-redux";

import { niceBytes } from "../../../../../common/utils";
import { Cell, Pie, PieChart } from "recharts";
import { ReportedUsageIcon } from "../../../../../icons";
import Loader from "../../../Common/Loader/Loader";
import { setErrorSnackMessage } from "../../../../../systemSlice";

const CapacityItem = ({
  value,
  timeStart,
  timeEnd,
  propLoading,
  apiPrefix,
}: {
  value: IDashboardPanel;
  timeStart: any;
  timeEnd: any;
  propLoading: boolean;
  apiPrefix: string;
}) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState<boolean>(true);
  const [dataInner, setDataInner] = useState<Record<string, any>>([]);
  const [result, setResult] = useState<IDashboardPanel | null>(null);

  useEffect(() => {
    if (propLoading) {
      setLoading(true);
    }
  }, [propLoading]);

  useEffect(() => {
    if (loading) {
      let stepCalc = 0;
      if (timeStart !== null && timeEnd !== null) {
        const secondsInPeriod = timeEnd.unix() - timeStart.unix();
        const periods = Math.floor(secondsInPeriod / 60);

        stepCalc = periods < 1 ? 15 : periods;
      }

      api
        .invoke(
          "GET",
          `/api/v1/${apiPrefix}/info/widgets/${value.id}/?step=${stepCalc}&${
            timeStart !== null ? `&start=${timeStart.unix()}` : ""
          }${timeStart !== null && timeEnd !== null ? "&" : ""}${
            timeEnd !== null ? `end=${timeEnd.unix()}` : ""
          }`
        )
        .then((res: any) => {
          const widgetsWithValue = widgetDetailsToPanel(res, value);
          setDataInner(widgetsWithValue.data);
          setResult(widgetsWithValue);

          setLoading(false);
        })
        .catch((err: ErrorResponseHandler) => {
          dispatch(setErrorSnackMessage(err));
          setLoading(false);
        });
    }
  }, [loading, value, timeEnd, timeStart, dispatch, apiPrefix]);

  const [middleLabel, unitValue] = (result?.innerLabel || "").split(" ");

  const usableValueObj = dataInner[0];
  const { value: usableValue = 0 } = usableValueObj || { value: 0 };

  const plotValues = [
    {
      value: parseInt(usableValue),
      color: "#D6D6D6",
      label: "Usable Space",
    },
    {
      value: parseInt(usableValue),
      color: "#073052",
      label: "Usable Space",
    },
  ];
  return (
    <Box
      sx={{
        flex: 1,
        display: "flex",
        alignItems: "center",
        flexFlow: {
          sm: "row",
          xs: "column",
        },
      }}
    >
      <Box
        sx={{
          fontSize: "16px",
          fontWeight: 600,
          alignSelf: {
            xs: "flex-start",
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
          marginLeft: {
            sm: "auto",
            xs: "",
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
            color: "#000",
            fontSize: 12,
          }}
        >
          {niceBytes(usableValue)}
          <br />
          <Box
            sx={{
              color: "#8F9090",
              fontSize: "10px",
              display: "flex",
              flexFlow: "column",
              alignItems: "center",
              textAlign: "center",
            }}
          >
            Current Usable Capacity
          </Box>
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
          marginLeft: {
            sm: "auto",
            xs: "",
          },
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            "& .value": {
              fontSize: "50px",
              fontFamily: "Lato",
              fontWeight: 600,
            },
            "& .unit": {
              color: "#5E5E5E",
              fontSize: "18px",
              marginLeft: "12px",
              marginTop: "10px",
            },
          }}
        >
          <div className="value">{middleLabel}</div>{" "}
          <div className="unit">{unitValue}</div>
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
    </Box>
  );
};

export default CapacityItem;
