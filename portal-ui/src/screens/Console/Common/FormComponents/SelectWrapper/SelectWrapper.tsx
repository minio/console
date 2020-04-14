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
import Grid from "@material-ui/core/Grid";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  InputBase
} from "@material-ui/core";
import { createStyles, Theme, withStyles } from "@material-ui/core/styles";
import { fieldBasic } from "../common/styleLibrary";

interface selectorTypes {
  label: string;
  value: string;
}

interface SelectProps {
  options: selectorTypes[];
  value: string;
  label: string;
  id: string;
  name: string;
  onChange: (
    e: React.ChangeEvent<{ name?: string | undefined; value: unknown }>
  ) => void;
  classes: any;
}

const styles = (theme: Theme) =>
  createStyles({
    ...fieldBasic
  });

const SelectStyled = withStyles((theme: Theme) =>
  createStyles({
    root: {
      "label + &": {
        marginTop: theme.spacing(3)
      }
    },
    input: {
      borderRadius: 0,
      position: "relative",
      color: "#393939",
      fontSize: 14,
      padding: "11px 20px",
      border: "1px solid #c4c4c4",
      "&:hover": {
        borderColor: "#393939"
      },
      "&:focus": {
        backgroundColor: "#fff"
      }
    }
  })
)(InputBase);

const SelectWrapper = ({
  classes,
  id,
  name,
  onChange,
  options,
  label,
  value
}: SelectProps) => {
  return (
    <React.Fragment>
      <Grid item xs={12} className={classes.fieldContainer}>
        <InputLabel htmlFor={id} className={classes.inputLabel}>
          {label}
        </InputLabel>
        <FormControl variant="outlined" fullWidth>
          <Select
            id={id}
            name={name}
            value={value}
            onChange={onChange}
            input={<SelectStyled />}
          >
            {options.map(option => (
              <MenuItem
                value={option.value}
                key={`select-${name}-${option.label}`}
              >
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
    </React.Fragment>
  );
};

export default withStyles(styles)(SelectWrapper);
