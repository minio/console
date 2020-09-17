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
import { Grid, InputLabel, Tooltip } from "@material-ui/core";
import HelpIcon from "@material-ui/icons/Help";
import { createStyles, Theme, withStyles } from "@material-ui/core/styles";
import { fieldBasic, tooltipHelper } from "../common/styleLibrary";
import { fileProcess } from "./utils";

interface InputBoxProps {
  label: string;
  classes: any;
  onChange: (e: string) => void;
  id: string;
  name: string;
  disabled?: boolean;
  tooltip?: string;
  required?: boolean;
  error?: string;
  accept?: string;
}

const styles = (theme: Theme) =>
  createStyles({
    ...fieldBasic,
    ...tooltipHelper,
    textBoxContainer: {
      flexGrow: 1,
      position: "relative",
    },
    errorState: {
      color: "#b53b4b",
      fontSize: 14,
      position: "absolute",
      top: 7,
      right: 7,
    },
  });

const FileSelector = ({
  label,
  classes,
  onChange,
  id,
  name,
  disabled = false,
  tooltip = "",
  required,
  error = "",
  accept = "",
}: InputBoxProps) => {
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
          <input
            type="file"
            name={name}
            onChange={(e) => {
              fileProcess(e, (data: any) => {
                onChange(data);
              });
            }}
            accept={accept}
            required
          />
        </div>
      </Grid>
    </React.Fragment>
  );
};

export default withStyles(styles)(FileSelector);
