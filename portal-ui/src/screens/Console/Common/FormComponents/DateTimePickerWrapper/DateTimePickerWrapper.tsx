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
import MomentUtils from "@date-io/moment";
import { Grid, InputLabel, Tooltip } from "@material-ui/core";
import { DateTimePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import InputAdornment from "@material-ui/core/InputAdornment";
import ScheduleIcon from "@material-ui/icons/Schedule";
import { createStyles, Theme, withStyles } from "@material-ui/core/styles";
import HelpIcon from "../../../../../icons/HelpIcon";
import { fieldBasic, tooltipHelper } from "../common/styleLibrary";

interface IDateTimePicker {
  value: any;
  onChange: (value: any) => any;
  classes: any;
  forSearchBlock?: boolean;
  label?: string;
  required?: boolean;
  tooltip?: string;
  id: string;
  disabled?: boolean;
}

const styles = (theme: Theme) =>
  createStyles({
    dateSelectorOverride: {
      height: 40,
      border: "#EAEDEE 1px solid",
      marginLeft: 15,
      backgroundColor: "#fff",
      padding: "0 16px",
      borderRadius: 5,
      "&.MuiInput-underline:hover:not(.Mui-disabled):before": {
        borderBottom: 0,
      },
      "&:hover": {
        borderColor: "#000",
        "&:before, &:after": {
          borderColor: "transparent",
          borderBottom: 0,
        },
      },
      "&:before, &:after": {
        borderColor: "transparent",
        borderBottom: 0,
      },
      "& input": {
        fontSize: 12,
        fontWeight: 600,
        color: "#393939",
      },
    },
    dateSelectorFormOverride: {
      width: "100%",
      maxWidth: 840,
    },
    parentDateOverride: {
      flexGrow: 1,
    },
    textBoxContainer: {
      flexGrow: 1,
    },
    textBoxWithIcon: {
      position: "relative",
      paddingRight: 25,
    },
    ...fieldBasic,
    ...tooltipHelper,
  });

const DateTimePickerWrapper = ({
  value,
  onChange,
  classes,
  forSearchBlock = false,
  label,
  tooltip = "",
  required,
  id,
  disabled = false,
}: IDateTimePicker) => {
  const inputItem = (
    <MuiPickersUtilsProvider utils={MomentUtils}>
      <DateTimePicker
        value={value}
        onChange={onChange}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <ScheduleIcon />
            </InputAdornment>
          ),
          className: forSearchBlock ? classes.dateSelectorOverride : "",
        }}
        label=""
        ampm={false}
        variant={"inline"}
        className={
          forSearchBlock
            ? classes.parentDateOverride
            : classes.dateSelectorFormOverride
        }
        format="MMMM Do YYYY, h:mm a"
        id={id}
        disabled={disabled}
      />
    </MuiPickersUtilsProvider>
  );

  if (forSearchBlock) {
    return inputItem;
  }

  return (
    <Fragment>
      <Grid item xs={12} className={`${classes.fieldContainer}`}>
        {label !== "" && (
          <InputLabel htmlFor={id} className={classes.inputLabel}>
            <span>
              {label}
              {required ? "*" : ""}
            </span>
            {tooltip !== "" && (
              <div className={classes.tooltipContainer}>
                <Tooltip title={tooltip} placement="top-start">
                  <div>
                    <HelpIcon className={classes.tooltip} />
                  </div>
                </Tooltip>
              </div>
            )}
          </InputLabel>
        )}

        <div className={classes.textBoxContainer}>{inputItem}</div>
      </Grid>
    </Fragment>
  );
};

export default withStyles(styles)(DateTimePickerWrapper);
