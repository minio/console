// This file is part of MinIO Console Server
// Copyright (c) 2022 MinIO, Inc.
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
import { Grid, IconButton, InputLabel, Tooltip } from "@mui/material";
import { InputProps as StandardInputProps } from "@mui/material/Input";
import { Theme } from "@mui/material/styles";
import createStyles from "@mui/styles/createStyles";
import makeStyles from "@mui/styles/makeStyles";
import withStyles from "@mui/styles/withStyles";
import {
  fieldBasic,
  inputFieldStyles,
  tooltipHelper,
} from "../../Common/FormComponents/common/styleLibrary";
import HelpIcon from "../../../../icons/HelpIcon";
import clsx from "clsx";
import RegionSelect from "./RegionSelect";

interface RegionSelectBoxProps {
  label: string;
  classes?: any;
  onChange: (value: string) => void;
  onKeyPress?: (e: any) => void;
  value?: string | boolean;
  id: string;
  name: string;
  disabled?: boolean;
  type: "minio" | "s3" | "gcs" | "azure";
  tooltip?: string;
  index?: number;
  error?: string;
  required?: boolean;
  placeholder?: string;
  overlayId?: string;
  overlayIcon?: any;
  overlayAction?: () => void;
  overlayObject?: any;
  extraInputProps?: StandardInputProps["inputProps"];
  noLabelMinWidth?: boolean;
  pattern?: string;
  autoFocus?: boolean;
  className?: string;
}

const styles = (theme: Theme) =>
  createStyles({
    ...fieldBasic,
    ...tooltipHelper,
    textBoxContainer: {
      flexGrow: 1,
      position: "relative",
      minWidth: 160,
    },
    overlayAction: {
      position: "absolute",
      right: 5,
      top: 6,
      "& svg": {
        maxWidth: 15,
        maxHeight: 15,
      },
      "&.withLabel": {
        top: 5,
      },
    },
    inputLabel: {
      ...fieldBasic.inputLabel,
      fontWeight: "normal",
    },
  });

const inputStyles = makeStyles((theme: Theme) =>
  createStyles({
    ...inputFieldStyles,
  })
);

const RegionSelectWrapper = ({
  label,
  onChange,
  id,
  name,
  type,
  tooltip = "",
  index = 0,
  error = "",
  required = false,
  overlayId,
  overlayIcon = null,
  overlayObject = null,
  extraInputProps = {},
  overlayAction,
  noLabelMinWidth = false,
  classes,
  className = "",
}: RegionSelectBoxProps) => {
  const inputClasses = inputStyles();

  let inputProps: any = {
    "data-index": index,
    ...extraInputProps,
    name: name,
    id: id,
    classes: inputClasses,
  };

  return (
    <React.Fragment>
      <Grid
        container
        className={clsx(
          className !== "" ? className : "",
          error !== "" ? classes.errorInField : classes.inputBoxContainer
        )}
      >
        {label !== "" && (
          <InputLabel
            htmlFor={id}
            className={
              noLabelMinWidth ? classes.noMinWidthLabel : classes.inputLabel
            }
          >
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

        <div className={classes.textBoxContainer}>
          <RegionSelect
            type={type}
            inputProps={inputProps}
            onChange={onChange}
          />
          {overlayIcon && (
            <div
              className={`${classes.overlayAction} ${
                label !== "" ? "withLabel" : ""
              }`}
            >
              <IconButton
                onClick={
                  overlayAction
                    ? () => {
                        overlayAction();
                      }
                    : () => null
                }
                id={overlayId}
                size={"small"}
                disableFocusRipple={false}
                disableRipple={false}
                disableTouchRipple={false}
              >
                {overlayIcon}
              </IconButton>
            </div>
          )}
          {overlayObject && (
            <div
              className={`${classes.overlayAction} ${
                label !== "" ? "withLabel" : ""
              }`}
            >
              {overlayObject}
            </div>
          )}
        </div>
      </Grid>
    </React.Fragment>
  );
};

export default withStyles(styles)(RegionSelectWrapper);
