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
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Radio, { RadioProps } from "@material-ui/core/Radio";
import { InputLabel } from "@material-ui/core";
import {
  createStyles,
  Theme,
  withStyles,
  makeStyles
} from "@material-ui/core/styles";
import { fieldBasic } from "../common/styleLibrary";

interface selectorTypes {
  label: string;
  value: string;
}

interface RadioGroupProps {
  selectorOptions: selectorTypes[];
  currentSelection: string;
  label: string;
  id: string;
  name: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  classes: any;
  displayInColumn?: boolean;
}

const styles = (theme: Theme) =>
  createStyles({
    ...fieldBasic,
    radioBoxContainer: {
      flexGrow: 1
    }
  });

const radioStyles = makeStyles({
  root: {
    "&:hover": {
      backgroundColor: "transparent"
    }
  },
  icon: {
    borderRadius: "100%",
    width: 14,
    height: 14,
    border: "1px solid #000"
  },
  checkedIcon: {
    borderRadius: "100%",
    width: 14,
    height: 14,
    border: "1px solid #000",
    padding: 4,
    position: "relative",
    "&::after": {
      content: '" "',
      width: 8,
      height: 8,
      borderRadius: "100%",
      display: "block",
      position: "absolute",
      backgroundColor: "#000",
      top: 2,
      left: 2
    }
  }
});

const RadioButton = (props: RadioProps) => {
  const classes = radioStyles();

  return (
    <Radio
      className={classes.root}
      disableRipple
      color="default"
      checkedIcon={<span className={classes.checkedIcon} />}
      icon={<span className={classes.icon} />}
      {...props}
    />
  );
};

export const RadioGroupSelector = ({
  selectorOptions = [],
  currentSelection,
  label,
  id,
  name,
  onChange,
  classes,
  displayInColumn = false
}: RadioGroupProps) => {
  return (
    <React.Fragment>
      <Grid item xs={12} className={classes.fieldContainer}>
        <InputLabel htmlFor={id} className={classes.inputLabel}>
          {label}
        </InputLabel>
        <div className={classes.radioBoxContainer}>
          <RadioGroup
            aria-label={id}
            id={id}
            name={name}
            value={currentSelection}
            onChange={onChange}
            row={!displayInColumn}
          >
            {selectorOptions.map(selectorOption => {
              return (
                <FormControlLabel
                  value={selectorOption.value}
                  control={<RadioButton />}
                  label={selectorOption.label}
                />
              );
            })}
          </RadioGroup>
        </div>
      </Grid>
    </React.Fragment>
  );
};

export default withStyles(styles)(RadioGroupSelector);
