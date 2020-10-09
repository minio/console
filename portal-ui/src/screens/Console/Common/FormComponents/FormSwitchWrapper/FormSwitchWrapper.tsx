// This file is part of MinIO Console Server
// Copyright (c) 2020 MinIO, Inc.
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
import { createStyles, Theme, withStyles } from "@material-ui/core/styles";
import { InputLabel, Switch, Tooltip } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import { actionsTray, fieldBasic } from "../common/styleLibrary";
import HelpIcon from "@material-ui/icons/Help";

interface IFormSwitch {
  label: string;
  classes: any;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  value: string | boolean;
  id: string;
  name: string;
  disabled?: boolean;
  tooltip?: string;
  index?: number;
  checked: boolean;
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
    errorBlock: {
      color: "red",
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
      color: "#000",
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
          color: "#000",
        },
      },
    },
    wrapperContainer: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      borderBottom: "#9c9c9c 1px solid",
      paddingBottom: 14,
      marginBottom: 20,
    },
    ...actionsTray,
    ...fieldBasic,
  });

const StyledSwitch = withStyles({
  root: {
    alignItems: "flex-start",
    height: 18,
    padding: "0 12px",
    display: "flex",
    position: "relative",
  },
  switchBase: {
    color: "#fff",
    padding: 0,
    top: "initial",
    "&$checked": {
      color: "#fff",
    },
    "&$checked + $track": {
      backgroundColor: "#000",
      opacity: 1,
      height: 15,
    },
  },
  checked: {},
  track: {
    height: 15,
    backgroundColor: "#000",
    opacity: 1,
    padding: 0,
    marginTop: 1.5,
  },
  thumb: {
    backgroundColor: "#fff",
    border: "#000 1px solid",
    boxShadow: "none",
    width: 18,
    height: 18,
    padding: 0,
    marginLeft: 10,
  },
})(Switch);

const FormSwitchWrapper = ({
  label,
  onChange,
  value,
  id,
  name,
  checked = false,
  disabled = false,
  tooltip = "",
  classes,
}: IFormSwitch) => {
  return (
    <React.Fragment>
      <Grid item xs={12} className={`${classes.wrapperContainer}`}>
        {label !== "" && (
          <InputLabel htmlFor={id} className={classes.inputLabel}>
            <span>{label}</span>
            {tooltip !== "" && (
              <div className={classes.tooltipContainer}>
                <Tooltip title={tooltip} placement="top-start">
                  <HelpIcon className={classes.tooltip} />
                </Tooltip>
              </div>
            )}
          </InputLabel>
        )}

        <div className={classes.textBoxContainer}>
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
        </div>
      </Grid>
    </React.Fragment>
  );
};

export default withStyles(styles)(FormSwitchWrapper);
