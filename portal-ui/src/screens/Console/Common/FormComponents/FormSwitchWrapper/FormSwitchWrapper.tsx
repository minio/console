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
import { Theme } from "@mui/material/styles";
import createStyles from "@mui/styles/createStyles";
import withStyles from "@mui/styles/withStyles";
import { InputLabel, Switch, Tooltip, Typography } from "@mui/material";
import Grid from "@mui/material/Grid";
import { actionsTray, fieldBasic } from "../common/styleLibrary";
import HelpIcon from "../../../../../icons/HelpIcon";
import clsx from "clsx";

interface IFormSwitch {
  label?: string;
  classes: any;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  value: string | boolean;
  id: string;
  name: string;
  disabled?: boolean;
  tooltip?: string;
  description?: string;
  index?: number;
  checked: boolean;
  switchOnly?: boolean;
  indicatorLabels?: string[];
}

const styles = (theme: Theme) =>
  createStyles({
    seeMore: {
      marginTop: theme.spacing(3),
    },
    paper: {
      display: "flex",
      overflow: "auto",
      flexDirection: "column",
      paddingTop: 15,
      boxShadow: "none",
    },
    addSideBar: {
      width: "320px",
      padding: "20px",
    },
    tableToolbar: {
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(0),
    },
    wrapCell: {
      maxWidth: "200px",
      whiteSpace: "normal",
      wordWrap: "break-word",
    },
    minTableHeader: {
      color: "#393939",
      "& tr": {
        "& th": {
          fontWeight: "bold",
        },
      },
    },
    noFound: {
      textAlign: "center",
      padding: "10px 0",
    },
    tableContainer: {
      maxHeight: 200,
    },
    stickyHeader: {
      backgroundColor: "#fff",
    },
    actionsTitle: {
      fontWeight: 600,
      color: "#081C42",
      fontSize: 16,
      alignSelf: "center",
    },
    tableBlock: {
      marginTop: 15,
    },
    filterField: {
      width: 375,
      fontWeight: 600,
      "& .input": {
        "&::placeholder": {
          fontWeight: 600,
          color: "#081C42",
        },
      },
    },
    divContainer: {
      marginBottom: 20,
    },
    indicatorLabelOn: {
      fontWeight: "bold",
      color: "#081C42 !important",
    },
    indicatorLabel: {
      fontSize: 12,
      color: "#E2E2E2",
      margin: "0 8px 0 10px",
    },
    fieldDescription: {
      marginTop: 4,
      color: "#999999",
    },
    tooltip: {
      fontSize: 16,
    },
    ...actionsTray,
    ...fieldBasic,
  });

const StyledSwitch = withStyles((theme) => ({
  root: {
    width: 50,
    height: 24,
    padding: 0,
    margin: 0,
  },
  switchBase: {
    padding: 1,
    "&$checked": {
      transform: "translateX(24px)",
      color: theme.palette.common.white,
      "& + $track": {
        backgroundColor: "#4CCB92",
        boxShadow: "inset 0px 1px 4px rgba(0,0,0,0.1)",
        opacity: 1,
        border: "none",
      },
    },
    "&$focusVisible $thumb": {
      color: "#4CCB92",
      border: "6px solid #fff",
    },
  },
  thumb: {
    width: 22,
    height: 22,
    backgroundColor: "#FAFAFA",
    border: "2px solid #FFFFFF",
    marginLeft: 1,
  },
  track: {
    borderRadius: 24 / 2,
    backgroundColor: "#E2E2E2",
    boxShadow: "inset 0px 1px 4px rgba(0,0,0,0.1)",
    opacity: 1,
    transition: theme.transitions.create(["background-color", "border"]),
  },
  checked: {},
  focusVisible: {},
}))(Switch);

const FormSwitchWrapper = ({
  label = "",
  onChange,
  value,
  id,
  name,
  checked = false,
  disabled = false,
  switchOnly = false,
  tooltip = "",
  description = "",
  classes,
  indicatorLabels,
}: IFormSwitch) => {
  const switchComponent = (
    <React.Fragment>
      {!switchOnly && (
        <span
          className={clsx(classes.indicatorLabel, {
            [classes.indicatorLabelOn]: !checked,
          })}
        >
          {indicatorLabels && indicatorLabels.length > 1
            ? indicatorLabels[1]
            : "OFF"}
        </span>
      )}
      <StyledSwitch
        checked={checked}
        onChange={onChange}
        color="primary"
        name={name}
        inputProps={{ "aria-label": "primary checkbox" }}
        disabled={disabled}
        disableRipple
        disableFocusRipple
        disableTouchRipple
        value={value}
      />
      {!switchOnly && (
        <span
          className={clsx(classes.indicatorLabel, {
            [classes.indicatorLabelOn]: checked,
          })}
        >
          {indicatorLabels ? indicatorLabels[0] : "ON"}
        </span>
      )}
    </React.Fragment>
  );

  if (switchOnly) {
    return switchComponent;
  }

  return (
    <div className={classes.divContainer}>
      <Grid container alignItems={"center"}>
        <Grid item xs>
          <Grid container>
            <Grid item xs={12} sm={4} md={3}>
              {label !== "" && (
                <InputLabel htmlFor={id} className={classes.inputLabel}>
                  <span>{label}</span>
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
            </Grid>
            <Grid item xs={12} sm textAlign={"left"}>
              {description !== "" && (
                <Typography component="p" className={classes.fieldDescription}>
                  {description}
                </Typography>
              )}
            </Grid>
          </Grid>
        </Grid>

        <Grid
          item
          xs={12}
          sm={2}
          textAlign={"right"}
          className={classes.switchContainer}
        >
          {switchComponent}
        </Grid>
      </Grid>
    </div>
  );
};

export default withStyles(styles)(FormSwitchWrapper);
