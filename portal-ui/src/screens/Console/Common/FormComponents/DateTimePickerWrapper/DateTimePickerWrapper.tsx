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
import { Grid, InputLabel, TextField, Tooltip } from "@mui/material";
import DateTimePicker from "@mui/lab/DateTimePicker";
import AdapterMoment from "@mui/lab/AdapterMoment";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import InputAdornment from "@mui/material/InputAdornment";
import ScheduleIcon from "@mui/icons-material/Schedule";
import { Theme } from "@mui/material/styles";
import createStyles from "@mui/styles/createStyles";
import withStyles from "@mui/styles/withStyles";
import HelpIcon from "../../../../../icons/HelpIcon";
import { fieldBasic, tooltipHelper } from "../common/styleLibrary";
import { OpenListIcon } from "../../../../../icons";

interface IDateTimePicker {
  value: any;
  onChange: (value: any) => any;
  classes: any;
  forSearchBlock?: boolean;
  forFilterContained?: boolean;
  label?: string;
  required?: boolean;
  tooltip?: string;
  id: string;
  disabled?: boolean;
  noInputIcon?: boolean;
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
    dateSelectorFilterOverride: {
      width: 180,
      height: 42,
      marginLeft: 20,
      padding: 0,
      borderRadius: 5,
      "&.MuiInput-underline:hover:not(.Mui-disabled):before": {
        borderBottom: 0,
      },
      "&:hover": {
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
        fontWeight: "bold",
        color: "#081C42",
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
    openListIcon: {
      color: "#9D9E9D",
      width: 8,
      marginTop: 2,
    },
    ...fieldBasic,
    ...tooltipHelper,
  });

const DateTimePickerWrapper = ({
  value,
  onChange,
  classes,
  forSearchBlock = false,
  forFilterContained = false,
  label,
  tooltip = "",
  required,
  id,
  disabled = false,
  noInputIcon = false,
}: IDateTimePicker) => {
  let adornment = {};

  if (!noInputIcon) {
    adornment = {
      startAdornment: (
        <InputAdornment position="start">
          <ScheduleIcon />
        </InputAdornment>
      ),
    };
  }

  if (forFilterContained) {
    adornment = {
      endAdornment: (
        <InputAdornment position="end">
          <OpenListIcon className={classes.openListIcon} />
        </InputAdornment>
      ),
    };
  }

  let classOverriden = "";

  if (forSearchBlock) {
    classOverriden = classes.dateSelectorOverride;
  } else if (forFilterContained) {
    classOverriden = classes.dateSelectorFilterOverride;
  }

  const inputItem = (
    <LocalizationProvider dateAdapter={AdapterMoment}>
      <DateTimePicker
        value={value}
        onChange={onChange}
        InputProps={{
          ...adornment,
          className: classOverriden,
        }}
        label=""
        className={
          forSearchBlock
            ? classes.parentDateOverride
            : classes.dateSelectorFormOverride
        }
        disabled={disabled}
        renderInput={(props) => (
          <TextField id={id} variant="standard" {...props} disabled />
        )}
        ampm={false}
      />
    </LocalizationProvider>
  );

  if (forSearchBlock) {
    return inputItem;
  }

  return (
    <Fragment>
      <Grid
        item
        xs={12}
        className={!forFilterContained ? classes.fieldContainer : ""}
      >
        {label !== "" && (
          <InputLabel htmlFor={id} className={classes.inputLabel}>
            <span>
              {label}
              {required ? "*" : ""}
            </span>
            {tooltip !== "" && (
              <div className={classes.tooltipContainer}>
                <Tooltip title={tooltip} placement="top-start">
                  <div className={classes.tooltip}>
                    <HelpIcon />
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
