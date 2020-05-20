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
  Checkbox,
  Grid,
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
import {
  checkboxIcons,
  fieldBasic,
  tooltipHelper,
} from "../common/styleLibrary";
import HelpIcon from "@material-ui/icons/Help";

interface CheckBoxProps {
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
    ...fieldBasic,
    ...tooltipHelper,
    ...checkboxIcons,
    labelContainer: {
      flexGrow: 1,
    },
  });

const CheckboxWrapper = ({
  label,
  onChange,
  value,
  id,
  name,
  checked = false,
  disabled = false,
  tooltip = "",
  classes,
}: CheckBoxProps) => {
  return (
    <React.Fragment>
      <Grid item xs={12} className={classes.fieldContainer}>
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
        <div className={classes.labelContainer}>
          <Checkbox
            name={name}
            id={id}
            value={value}
            color="primary"
            inputProps={{ "aria-label": "secondary checkbox" }}
            checked={checked}
            onChange={onChange}
            checkedIcon={<span className={classes.checkedIcon} />}
            icon={<span className={classes.unCheckedIcon} />}
            disabled={disabled}
          />
        </div>
      </Grid>
    </React.Fragment>
  );
};

export default withStyles(styles)(CheckboxWrapper);
