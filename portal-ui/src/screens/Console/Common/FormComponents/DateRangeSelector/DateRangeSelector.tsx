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
import { Theme } from "@mui/material/styles";
import createStyles from "@mui/styles/createStyles";
import withStyles from "@mui/styles/withStyles";
import { Grid, Button } from "@mui/material";
import ScheduleIcon from "@mui/icons-material/Schedule";
import WatchLaterIcon from "@mui/icons-material/WatchLater";
import { actionsTray, widgetContainerCommon } from "../common/styleLibrary";
import DateTimePickerWrapper from "../DateTimePickerWrapper/DateTimePickerWrapper";
import SyncIcon from "../../../../../icons/SyncIcon";

interface IDateRangeSelector {
  classes: any;
  timeStart: any;
  setTimeStart: (date: any) => void;
  timeEnd: any;
  setTimeEnd: (date: any) => void;
  triggerSync?: () => void;
}

const styles = (theme: Theme) =>
  createStyles({
    ...actionsTray,
    ...widgetContainerCommon,
    syncButton: {
      "&.MuiButton-root .MuiButton-iconSizeMedium > *:first-of-type": {
        fontSize: 18,
      },
    },
    schedulerIcon: {
      opacity: 0.4,
      fontSize: 10,
      "& svg": {
        width: 18,
        height: 18,
      },
    },
    selectorLabel: {
      color: "#9D9E9D",
      fontWeight: "bold",
      whiteSpace: "nowrap",
      marginLeft: 10,
      fontSize: 12,
    },
  });

const DateRangeSelector = ({
  classes,
  timeStart,
  setTimeStart,
  timeEnd,
  setTimeEnd,
  triggerSync,
}: IDateRangeSelector) => {
  return (
    <Fragment>
      <Grid item xs={12} className={classes.timeContainers}>
        <span className={classes.filterTitle}>Filter:</span>
        <div className={classes.filterContainer}>
          <span className={`${classes.filterTitle} ${classes.schedulerIcon}`}>
            <ScheduleIcon />
          </span>
          <span className={classes.selectorLabel}>Start Time:</span>
          <DateTimePickerWrapper
            value={timeStart}
            onChange={setTimeStart}
            forFilterContained
            id="stTime"
            noInputIcon
          />
          <span className={classes.divisorLine}>&nbsp;</span>
          <span className={`${classes.filterTitle} ${classes.schedulerIcon}`}>
            <WatchLaterIcon />
          </span>
          <span className={classes.selectorLabel}>End Time:</span>
          <DateTimePickerWrapper
            value={timeEnd}
            onChange={setTimeEnd}
            forFilterContained
            id="endTime"
            noInputIcon
          />
        </div>
        {triggerSync && (
          <Button
            type="button"
            variant="contained"
            color="primary"
            onClick={triggerSync}
            endIcon={<SyncIcon />}
            className={classes.syncButton}
          >
            Sync
          </Button>
        )}
      </Grid>
    </Fragment>
  );
};

export default withStyles(styles)(DateRangeSelector);
