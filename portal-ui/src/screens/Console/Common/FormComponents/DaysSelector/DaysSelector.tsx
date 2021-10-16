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

import React, { useState, useEffect, Fragment } from "react";
import Grid from "@mui/material/Grid";
import InputLabel from "@mui/material/InputLabel";
import moment from "moment/moment";
import { Theme } from "@mui/material/styles";
import createStyles from "@mui/styles/createStyles";
import withStyles from "@mui/styles/withStyles";
import { fieldBasic, tooltipHelper } from "../common/styleLibrary";
import InputBoxWrapper from "../InputBoxWrapper/InputBoxWrapper";

interface IDaysSelector {
  classes: any;
  id: string;
  initialDate: Date;
  maxDays?: number;
  label: string;
  entity: string;
  onChange: (newDate: string, isValid: boolean) => void;
}

const styles = (theme: Theme) =>
  createStyles({
    dateInput: {
      "&:not(:last-child)": {
        marginRight: 22,
      },
    },
    ...fieldBasic,
    ...tooltipHelper,
    labelContainer: {
      display: "flex",
      alignItems: "center",
    },
    fieldContainer: {
      ...fieldBasic.fieldContainer,
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      paddingBottom: 10,
      marginTop: 11,
      marginBottom: 6,
    },
    fieldContainerBorder: {
      borderBottom: "#9c9c9c 1px solid",
      marginBottom: 20,
    },
    dateContainer: {
      height: 20,
      textAlign: "right",
      color: "#848484",
    },
    dateInputContainer: {
      margin: "0 10px",
    },
  });

const calculateNewTime = (
  initialDate: Date,
  days: number,
  hours: number,
  minutes: number
) => {
  return moment(initialDate)
    .add(days, "days")
    .add(hours, "hours")
    .add(minutes, "minutes");
};

const DaysSelector = ({
  classes,
  id,
  initialDate,
  label,
  maxDays,
  entity,
  onChange,
}: IDaysSelector) => {
  const [selectedDays, setSelectedDays] = useState<number>(7);
  const [selectedHours, setSelectedHours] = useState<number>(0);
  const [selectedMinutes, setSelectedMinutes] = useState<number>(0);
  const [validDate, setValidDate] = useState<boolean>(true);
  const [dateSelected, setDateSelected] = useState<moment.Moment>(moment());

  useEffect(() => {
    setDateSelected(
      calculateNewTime(
        initialDate,
        selectedDays,
        selectedHours,
        selectedMinutes
      )
    );
  }, [initialDate, selectedDays, selectedHours, selectedMinutes]);

  useEffect(() => {
    if (validDate) {
      onChange(dateSelected.format("YYYY-MM-DDTHH:mm:ss"), true);
    } else {
      onChange("0000-00-00", false);
    }
  }, [dateSelected, onChange, validDate]);

  // Basic validation for inputs
  useEffect(() => {
    let valid = true;
    if (
      selectedDays < 0 ||
      (maxDays && selectedDays > maxDays) ||
      isNaN(selectedDays)
    ) {
      valid = false;
    }

    if (selectedHours < 0 || selectedHours > 23 || isNaN(selectedHours)) {
      valid = false;
    }

    if (selectedMinutes < 0 || selectedMinutes > 59 || isNaN(selectedMinutes)) {
      valid = false;
    }

    if (
      maxDays &&
      selectedDays === maxDays &&
      (selectedHours !== 0 || selectedMinutes !== 0)
    ) {
      valid = false;
    }

    setValidDate(valid);
  }, [
    dateSelected,
    maxDays,
    onChange,
    selectedDays,
    selectedHours,
    selectedMinutes,
  ]);

  const extraInputProps = {
    style: {
      textAlign: "center" as const,
      paddingRight: 10,
      paddingLeft: 10,
      width: 25,
    },
    className: "removeArrows" as const,
  };

  return (
    <Fragment>
      <Grid item xs={12} className={classes.fieldContainer}>
        <Grid container alignItems={"center"} justifyContent={"center"}>
          <Grid item xs={12} className={classes.labelContainer}>
            <InputLabel htmlFor={id} className={classes.inputLabel}>
              <span>{label}</span>
            </InputLabel>
          </Grid>
          <Grid item className={classes.dateInputContainer}>
            <InputBoxWrapper
              id={id}
              type="number"
              min="0"
              max={maxDays ? maxDays.toString() : "999"}
              label="Days"
              name={id}
              onChange={(e) => {
                setSelectedDays(parseInt(e.target.value));
              }}
              value={selectedDays.toString()}
              extraInputProps={extraInputProps}
              noLabelMinWidth
            />
          </Grid>
          <Grid item className={classes.dateInputContainer}>
            <InputBoxWrapper
              id={id}
              type="number"
              min="0"
              max="23"
              label="Hours"
              name={id}
              onChange={(e) => {
                setSelectedHours(parseInt(e.target.value));
              }}
              value={selectedHours.toString()}
              extraInputProps={extraInputProps}
              noLabelMinWidth
            />
          </Grid>
          <Grid item className={classes.dateInputContainer}>
            <InputBoxWrapper
              id={id}
              type="number"
              min="0"
              max="59"
              label="Minutes"
              name={id}
              onChange={(e) => {
                setSelectedMinutes(parseInt(e.target.value));
              }}
              value={selectedMinutes.toString()}
              extraInputProps={extraInputProps}
              noLabelMinWidth
            />
          </Grid>
        </Grid>
      </Grid>
      <Grid container>
        <Grid item xs={12} className={classes.dateContainer}>
          {validDate && (
            <Fragment>
              <strong>{entity} will be available until:</strong>{" "}
              {dateSelected.format("MM/DD/YYYY HH:mm:ss")}
            </Fragment>
          )}
        </Grid>
      </Grid>
      <br />
    </Fragment>
  );
};

export default withStyles(styles)(DaysSelector);
