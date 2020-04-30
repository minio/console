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
  InputLabel,
  TextField,
  TextFieldProps,
  Tooltip
} from "@material-ui/core";
import { OutlinedInputProps } from "@material-ui/core/OutlinedInput";
import {
  createStyles,
  makeStyles,
  Theme,
  withStyles
} from "@material-ui/core/styles";
import { fieldBasic } from "../common/styleLibrary";
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
}

const styles = (theme: Theme) =>
  createStyles({
    ...fieldBasic,
    textBoxContainer: {
      flexGrow: 1
    }
  });

const inputStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      borderColor: "#393939",
      borderRadius: 0
    },
    input: {
      padding: "11px 20px",
      color: "#393939",
      fontSize: 14
    }
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
  classes
}: InputBoxProps) => {
  return (
    <React.Fragment>
      <Grid item xs={12} className={classes.fieldContainer}>
        {label !== "" && (
          <InputLabel htmlFor={id} className={classes.inputLabel}>
            {label}
          </InputLabel>
        )}
        <div className={classes.textBoxContainer}>
          <InputField
            className={classes.boxDesign}
            id={id}
            name={name}
            variant="outlined"
            fullWidth
            value={value}
            disabled={disabled}
            onChange={onChange}
            type={type}
            multiline={multiline}
            autoComplete={autoComplete}
            inputProps={{ "data-index": index }}
          />
        </div>
        {tooltip !== "" && (
          <div className={classes.tooltipContainer}>
            <Tooltip title={tooltip} placement="left">
              <HelpIcon />
            </Tooltip>
          </div>
        )}
      </Grid>
    </React.Fragment>
  );
};

export default withStyles(styles)(InputBoxWrapper);
