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
import clsx from "clsx";
import { Box, Grid, HelpIcon, InputLabel, Select, Switch, Tooltip } from "mds";
import { Theme } from "@mui/material/styles";
import createStyles from "@mui/styles/createStyles";
import withStyles from "@mui/styles/withStyles";
import { fieldBasic, tooltipHelper } from "../common/styleLibrary";
import { days, months, validDate, years } from "./utils";

const styles = (theme: Theme) =>
  createStyles({
    ...fieldBasic,
    ...tooltipHelper,
    fieldContainer: {
      ...fieldBasic.fieldContainer,
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      paddingBottom: 10,
      marginTop: 11,
      marginBottom: 6,
    },
  });

interface IDateSelectorProps {
  classes: any;
  id: string;
  label: string;
  disableOptions?: boolean;
  addSwitch?: boolean;
  tooltip?: string;
  borderBottom?: boolean;
  value?: string;
  onDateChange: (date: string, isValid: boolean) => any;
}

const DateSelector = forwardRef(
  (
    {
      classes,
      id,
      label,
      disableOptions = false,
      addSwitch = false,
      tooltip = "",
      borderBottom = false,
      onDateChange,
      value = "",
    }: IDateSelectorProps,
    ref: any
  ) => {
    useImperativeHandle(ref, () => ({ resetDate }));

    const [dateEnabled, setDateEnabled] = useState<boolean>(false);
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
      } else if (addSwitch) {
        return !dateEnabled;
      } else {
        return false;
      }
    };

    const monthForDropDown = [{ value: "", label: "<Month>" }, ...months];
    const daysForDrop = [{ value: "", label: "<Day>" }, ...days];
    const yearsForDrop = [{ value: "", label: "<Year>" }, ...years];

    return (
      <Grid
        item
        xs={12}
        className={clsx(classes.fieldContainer, {
          [classes.fieldContainerBorder]: borderBottom,
        })}
      >
        <div className={classes.labelContainer}>
          <Grid container>
            <InputLabel htmlFor={id}>
              <span>{label}</span>
              {tooltip !== "" && (
                <div className={classes.tooltipContainer}>
                  <Tooltip tooltip={tooltip} placement="top">
                    <div className={classes.tooltip}>
                      <HelpIcon />
                    </div>
                  </Tooltip>
                </div>
              )}
            </InputLabel>
            {addSwitch && (
              <Switch
                indicatorLabels={["Specific Date", "Default (7 Days)"]}
                checked={dateEnabled}
                value={"date_enabled"}
                id="date-status"
                name="date-status"
                onChange={(e) => {
                  setDateEnabled(e.target.checked);
                  if (!e.target.checked) {
                    onDateChange("", true);
                  }
                }}
                switchOnly
              />
            )}
          </Grid>
        </div>
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
          />
        </Box>
      </Grid>
    );
  }
);

export default withStyles(styles)(DateSelector);
