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

import React from "react";
import MomentUtils from "@date-io/moment";
import { DateTimePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import InputAdornment from "@material-ui/core/InputAdornment";
import ScheduleIcon from "@material-ui/icons/Schedule";
import { createStyles, Theme, withStyles } from "@material-ui/core/styles";

interface IDateTimePicker {
  value: any;
  onChange: (value: any) => any;
  classes: any;
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
    parentDateOverride: {
      flexGrow: 1,
    },
  });

const DateTimePickerWrapper = ({
  value,
  onChange,
  classes,
}: IDateTimePicker) => {
  return (
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
          className: classes.dateSelectorOverride,
        }}
        label=""
        ampm={false}
        variant={"inline"}
        className={classes.parentDateOverride}
        format="MMMM Do YYYY, h:mm a"
      />
    </MuiPickersUtilsProvider>
  );
};

export default withStyles(styles)(DateTimePickerWrapper);
