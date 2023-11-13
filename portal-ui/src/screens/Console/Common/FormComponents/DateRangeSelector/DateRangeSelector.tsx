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
import {
  Button,
  SyncIcon,
  Grid,
  Box,
  breakPoints,
  TimeIcon,
  DateTimeInput,
} from "mds";
import { DateTime } from "luxon";

interface IDateRangeSelector {
  timeStart: DateTime | null;
  setTimeStart: (value: DateTime | null) => void;
  timeEnd: DateTime | null;
  setTimeEnd: (value: DateTime | null) => void;
  triggerSync?: () => void;
  label?: string;
  startLabel?: string;
  endLabel?: string;
}

const DateRangeSelector = ({
  timeStart,
  setTimeStart,
  timeEnd,
  setTimeEnd,
  triggerSync,
  label = "Filter:",
  startLabel = "Start Time:",
  endLabel = "End Time:",
}: IDateRangeSelector) => {
  return (
    <Grid
      item
      xs={12}
      sx={{
        "& .filter-date-input-label, .end-time-input-label": {
          display: "none",
        },
        "& .MuiInputBase-adornedEnd.filter-date-date-time-input": {
          width: "100%",
          border: "1px solid #eaeaea",
          paddingLeft: "8px",
          paddingRight: "8px",
          borderRadius: "1px",
        },

        "& .MuiInputAdornment-root button": {
          height: "20px",
          width: "20px",
          marginRight: "5px",
        },
        "& .filter-date-input-wrapper": {
          height: "30px",
          width: "100%",

          "& .MuiTextField-root": {
            height: "30px",
            width: "90%",

            "& input.Mui-disabled": {
              color: "#000000",
              WebkitTextFillColor: "#101010",
            },
          },
        },
      }}
    >
      <Box
        sx={{
          display: "grid",
          height: 40,
          alignItems: "center",
          gridTemplateColumns: "auto 2fr auto",
          padding: 0,
          [`@media (max-width: ${breakPoints.sm}px)`]: {
            padding: 5,
          },
          [`@media (max-width: ${breakPoints.md}px)`]: {
            gridTemplateColumns: "1fr",
            height: "auto",
          },
          gap: "5px",
        }}
      >
        <Box
          sx={{ fontSize: "14px", fontWeight: 500, marginRight: "5px" }}
          className={"muted"}
        >
          {label}
        </Box>
        <Box
          customBorderPadding={"0px"}
          sx={{
            display: "grid",
            height: 40,
            alignItems: "center",
            gridTemplateColumns: "1fr 1fr",
            gap: "8px",
            paddingLeft: "8px",
            paddingRight: "8px",
            [`@media (max-width: ${breakPoints.md}px)`]: {
              height: "auto",
              gridTemplateColumns: "1fr",
            },
          }}
        >
          <DateTimeInput
            value={timeStart}
            onChange={setTimeStart}
            id="stTime"
            secondsSelector={false}
            pickerStartComponent={
              <Fragment>
                <TimeIcon />
                <span>{startLabel}</span>
              </Fragment>
            }
          />
          <DateTimeInput
            value={timeEnd}
            onChange={setTimeEnd}
            id="endTime"
            secondsSelector={false}
            pickerStartComponent={
              <Fragment>
                <TimeIcon />
                <span>{endLabel}</span>
              </Fragment>
            }
          />
        </Box>

        {triggerSync && (
          <Box
            sx={{
              alignItems: "flex-end",
              display: "flex",
              justifyContent: "flex-end",
            }}
          >
            <Button
              id={"sync"}
              type="button"
              variant="callAction"
              onClick={triggerSync}
              icon={<SyncIcon />}
              label={"Sync"}
            />
          </Box>
        )}
      </Box>
    </Grid>
  );
};

export default DateRangeSelector;
