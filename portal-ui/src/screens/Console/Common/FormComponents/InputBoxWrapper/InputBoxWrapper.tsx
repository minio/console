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
import React from "react";
import {
  Grid,
  IconButton,
  InputLabel,
  TextField,
  TextFieldProps,
  Tooltip,
} from "@material-ui/core";
import { OutlinedInputProps } from "@material-ui/core/OutlinedInput";
import {
  createStyles,
  makeStyles,
  Theme,
  withStyles,
} from "@material-ui/core/styles";
import { fieldBasic, tooltipHelper } from "../common/styleLibrary";
import HelpIcon from "@material-ui/icons/Help";

interface InputBoxProps {
  label: string;
  classes: any;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  value: string | boolean;
  id: string;
  name: string;
  disabled?: boolean;
  multiline?: boolean;
  type?: string;
  tooltip?: string;
  autoComplete?: string;
  index?: number;
  error?: string;
  required?: boolean;
  placeholder?: string;
  min?: string;
  max?: string;
  overlayIcon?: any;
  overlayAction?: () => void;
}

const styles = (theme: Theme) =>
  createStyles({
    ...fieldBasic,
    ...tooltipHelper,
    textBoxContainer: {
      flexGrow: 1,
    },
    textBoxWithIcon: {
      position: "relative",
      paddingRight: 25,
    },
    errorState: {
      color: "#b53b4b",
      fontSize: 14,
      position: "absolute",
      top: 7,
      right: 7,
    },
    overlayAction: {
      position: "absolute",
      right: 0,
      top: 15,
      "& svg": {
        maxWidth: 15,
        maxHeight: 15,
      },
    },
  });

const inputStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      borderRadius: 0,
      "&::before": {
        borderColor: "#9c9c9c",
      },
    },
    disabled: {
      "&.MuiInput-underline::before": {
        borderColor: "#eaeaea",
        borderBottomStyle: "solid",
      },
    },
    input: {
      padding: "15px 30px 10px 5px",
      color: "#393939",
      fontSize: 13,
      fontWeight: 600,
      "&:placeholder": {
        color: "#393939",
        opacity: 1,
      },
    },
    error: {
      color: "#b53b4b",
      boxShadow: "inset 0px 0px 1px 1px #b53b4b",
    },
  })
);

function InputField(props: TextFieldProps) {
  const classes = inputStyles();

  return (
    <TextField
      InputProps={{ classes } as Partial<OutlinedInputProps>}
      {...props}
    />
  );
}

const InputBoxWrapper = ({
  label,
  onChange,
  value,
  id,
  name,
  type = "text",
  autoComplete = "off",
  disabled = false,
  multiline = false,
  tooltip = "",
  index = 0,
  error = "",
  required = false,
  placeholder = "",
  min,
  max,
  overlayIcon = null,
  overlayAction,
  classes,
}: InputBoxProps) => {
  let inputProps: any = { "data-index": index };

  if (type === "number" && min) {
    inputProps["min"] = min;
  }

  if (type === "number" && max) {
    inputProps["max"] = max;
  }

  return (
    <React.Fragment>
      <Grid
        item
        xs={12}
        className={`${classes.fieldContainer} ${
          error !== "" ? classes.errorInField : ""
        }`}
      >
        {label !== "" && (
          <InputLabel
            htmlFor={id}
            className={`${error !== "" ? classes.fieldLabelError : ""} ${
              classes.inputLabel
            }`}
          >
            <span>
              {label}
              {required ? "*" : ""}
            </span>
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
          <InputField
            id={id}
            name={name}
            fullWidth
            value={value}
            disabled={disabled}
            onChange={onChange}
            type={type}
            multiline={multiline}
            autoComplete={autoComplete}
            inputProps={inputProps}
            error={error !== ""}
            helperText={error}
            placeholder={placeholder}
            className={classes.inputRebase}
          />
        </div>
        {overlayIcon && (
          <div className={classes.overlayAction}>
            <IconButton
              onClick={
                overlayAction
                  ? () => {
                      overlayAction();
                    }
                  : () => null
              }
              size={"small"}
              disableFocusRipple={false}
              disableRipple={false}
              disableTouchRipple={false}
            >
              {overlayIcon}
            </IconButton>
          </div>
        )}
      </Grid>
    </React.Fragment>
  );
};

export default withStyles(styles)(InputBoxWrapper);
