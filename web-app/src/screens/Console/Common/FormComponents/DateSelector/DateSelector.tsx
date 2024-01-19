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

import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
import { Box, HelpIcon, InputLabel, Select, Tooltip } from "mds";
import { days, months, validDate, years } from "./utils";

interface IDateSelectorProps {
  id: string;
  label: string;
  disableOptions?: boolean;
  tooltip?: string;
  borderBottom?: boolean;
  value?: string;
  onDateChange: (date: string, isValid: boolean) => any;
}

const DateSelector = forwardRef(
  (
    {
      id,
      label,
      disableOptions = false,
      tooltip = "",
      borderBottom = false,
      onDateChange,
      value = "",
    }: IDateSelectorProps,
    ref: any,
  ) => {
    useImperativeHandle(ref, () => ({ resetDate }));

    const [month, setMonth] = useState<string>("");
    const [day, setDay] = useState<string>("");
    const [year, setYear] = useState<string>("");

    useEffect(() => {
      // verify if there is a current value
      // assume is in the format "2021-12-30"
      if (value !== "") {
        const valueSplit = value.split("-");

        setYear(valueSplit[0]);
        setMonth(valueSplit[1]);
        // Turn to single digit to be displayed on dropdown buttons
        setDay(`${parseInt(valueSplit[2])}`);
      }
    }, [value]);

    useEffect(() => {
      const [isValid, dateString] = validDate(year, month, day);
      onDateChange(dateString, isValid);
    }, [month, day, year, onDateChange]);

    const resetDate = () => {
      setMonth("");
      setDay("");
      setYear("");
    };

    const isDateDisabled = () => {
      if (disableOptions) {
        return disableOptions;
      } else {
        return false;
      }
    };

    const monthForDropDown = [{ value: "", label: "<Month>" }, ...months];
    const daysForDrop = [{ value: "", label: "<Day>" }, ...days];
    const yearsForDrop = [{ value: "", label: "<Year>" }, ...years];

    return (
      <Box className={"inputItem"}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 5,
            marginBottom: 5,
          }}
        >
          <InputLabel htmlFor={id}>
            <span>{label}</span>
            {tooltip !== "" && (
              <Box
                sx={{
                  marginLeft: 5,
                  display: "flex",
                  alignItems: "center",
                  "& .min-icon": {
                    width: 13,
                  },
                }}
              >
                <Tooltip tooltip={tooltip} placement="top">
                  <Box
                    sx={{
                      "& .min-icon": {
                        width: 13,
                      },
                    }}
                  >
                    <HelpIcon />
                  </Box>
                </Tooltip>
              </Box>
            )}
          </InputLabel>
        </Box>
        <Box sx={{ display: "flex", gap: 12 }}>
          <Select
            id={`${id}-month`}
            name={`${id}-month`}
            value={month}
            onChange={(newValue) => {
              setMonth(newValue);
            }}
            options={monthForDropDown}
            label={""}
            disabled={isDateDisabled()}
          />

          <Select
            id={`${id}-day`}
            name={`${id}-day`}
            value={day}
            onChange={(newValue) => {
              setDay(newValue);
            }}
            options={daysForDrop}
            label={""}
            disabled={isDateDisabled()}
          />

          <Select
            id={`${id}-year`}
            name={`${id}-year`}
            value={year}
            onChange={(newValue) => {
              setYear(newValue);
            }}
            options={yearsForDrop}
            label={""}
            disabled={isDateDisabled()}
            sx={{
              marginBottom: 12,
            }}
          />
        </Box>
      </Box>
    );
  },
);

export default DateSelector;
