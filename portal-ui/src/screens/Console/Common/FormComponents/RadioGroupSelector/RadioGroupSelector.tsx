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
import clsx from "clsx";
import Grid from "@material-ui/core/Grid";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Radio, { RadioProps } from "@material-ui/core/Radio";
import { InputLabel, Tooltip } from "@material-ui/core";
import {
  createStyles,
  Theme,
  withStyles,
  makeStyles,
} from "@material-ui/core/styles";
import { fieldBasic, radioIcons, tooltipHelper } from "../common/styleLibrary";
import HelpIcon from "@material-ui/icons/Help";

export interface SelectorTypes {
  label: string;
  value: string;
}

interface RadioGroupProps {
  selectorOptions: SelectorTypes[];
  currentSelection: string;
  label: string;
  id: string;
  name: string;
  tooltip?: string;
  disableOptions?: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  classes: any;
  displayInColumn?: boolean;
}

const styles = (theme: Theme) =>
  createStyles({
    ...fieldBasic,
    ...tooltipHelper,
    radioBoxContainer: {},
    fieldContainer: {
      ...fieldBasic.fieldContainer,
      display: "flex",
      justifyContent: "space-between",
      borderBottom: "#9c9c9c 1px solid",
      paddingBottom: 10,
      marginTop: 11,
    },
    optionLabel: {
      "&.Mui-disabled": {
        "& .MuiFormControlLabel-label": {
          color: "#9c9c9c",
        },
      },
      "&:last-child": {
        marginRight: 0,
      },
      "& .MuiFormControlLabel-label": {
        fontSize: 12,
        color: "#000",
      },
    },
    checkedOption: {
      "& .MuiFormControlLabel-label": {
        fontSize: 12,
        color: "#000",
        fontWeight: 700,
      },
    },
  });

const radioStyles = makeStyles({
  root: {
    "&:hover": {
      backgroundColor: "transparent",
    },
  },
  ...radioIcons,
});

const RadioButton = (props: RadioProps) => {
  const classes = radioStyles();

  return (
    <Radio
      className={classes.root}
      disableRipple
      color="default"
      checkedIcon={<span className={classes.radioSelectedIcon} />}
      icon={<span className={classes.radioUnselectedIcon} />}
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
  tooltip = "",
  disableOptions = false,
  classes,
  displayInColumn = false,
}: RadioGroupProps) => {
  return (
    <React.Fragment>
      <Grid item xs={12} className={classes.fieldContainer}>
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

        <div className={classes.radioBoxContainer}>
          <RadioGroup
            aria-label={id}
            id={id}
            name={name}
            value={currentSelection}
            onChange={onChange}
            row={!displayInColumn}
          >
            {selectorOptions.map((selectorOption) => {
              return (
                <FormControlLabel
                  key={`rd-${name}-${selectorOption.value}`}
                  value={selectorOption.value}
                  control={<RadioButton />}
                  label={selectorOption.label}
                  disabled={disableOptions}
                  className={clsx(classes.optionLabel, {
                    [classes.checkedOption]:
                      selectorOption.value === currentSelection,
                  })}
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
