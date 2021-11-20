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

import React, { useEffect, useState } from "react";
import { Theme } from "@mui/material/styles";
import createStyles from "@mui/styles/createStyles";
import withStyles from "@mui/styles/withStyles";
import Grid from "@mui/material/Grid";
import { IElementValue, KVField } from "../Configurations/types";
import {
  fieldBasic,
  formFieldStyles,
  modalBasic,
} from "../Common/FormComponents/common/styleLibrary";
import InputBoxWrapper from "../Common/FormComponents/InputBoxWrapper/InputBoxWrapper";
import CSVMultiSelector from "../Common/FormComponents/CSVMultiSelector/CSVMultiSelector";
import CommentBoxWrapper from "../Common/FormComponents/CommentBoxWrapper/CommentBoxWrapper";
import FormSwitchWrapper from "../Common/FormComponents/FormSwitchWrapper/FormSwitchWrapper";

interface IConfGenericProps {
  onChange: (newValue: IElementValue[]) => void;
  fields: KVField[];
  defaultVals?: IElementValue[];
  classes: any;
}

const styles = (theme: Theme) =>
  createStyles({
    ...formFieldStyles,
    formFieldRow: {
      ...formFieldStyles.formFieldRow,
    },
    inputBoxContainer: {
      marginBottom: 7,
      "& .MuiInputLabel-root": {
        minWidth: 200,
        "& svg": {
          width: 16,
          height: 16,
        },
      },
      "& div[class|='InputBoxWrapper-textBoxContainer']": {
        display: "flex",
      },
    },
    overlayAction: {
      top: 0,
      right: 0,
      position: "relative",
      marginLeft: 10,
      display: "flex",
      alignItems: "center",
      "& button": {
        background: "#EAEAEA",
      },
    },
    fieldContainer: {
      "& .MuiInputLabel-root": {
        flex: 1,
        minWidth: 200,
      },
      "& div[class|='CommentBoxWrapper-textBoxContainer']": {
        flexGrow: 1,
        width: "100%",
      },
    },
    tooltipContainer: {
      ...fieldBasic.tooltipContainer,
      "& svg": {
        width: 16,
        height: 16,
      },
    },

    ...modalBasic,
  });

// Function to get defined values,
//we make this because the backed sometimes don't return all the keys when there is an initial configuration
export const valueDef = (
  key: string,
  type: string,
  defaults: IElementValue[]
) => {
  let defValue = type === "on|off" ? "false" : "";

  if (defaults.length > 0) {
    const storedConfig = defaults.find((element) => element.key === key);

    if (storedConfig) {
      defValue = storedConfig.value;
    }
  }

  return defValue;
};

const ConfTargetGeneric = ({
  onChange,
  fields,
  defaultVals,
  classes,
}: IConfGenericProps) => {
  const [valueHolder, setValueHolder] = useState<IElementValue[]>([]);
  const fieldsElements = !fields ? [] : fields;
  const defValList = !defaultVals ? [] : defaultVals;

  // Effect to create all the values to hold
  useEffect(() => {
    const values: IElementValue[] = [];
    fields.forEach((field) => {
      const stateInsert: IElementValue = {
        key: field.name,
        value: valueDef(field.name, field.type, defValList),
      };
      values.push(stateInsert);
    });

    setValueHolder(values);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fields, defaultVals]);

  useEffect(() => {
    onChange(valueHolder);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [valueHolder]);

  const setValueElement = (key: string, value: string, index: number) => {
    const valuesDup = [...valueHolder];
    valuesDup[index] = { key, value };

    setValueHolder(valuesDup);
  };

  const fieldDefinition = (field: KVField, item: number) => {
    switch (field.type) {
      case "on|off":
        const value = valueHolder[item] ? valueHolder[item].value : "false";

        return (
          <FormSwitchWrapper
            classes={classes}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              const value = e.target.checked ? "true" : "false";
              setValueElement(field.name, value, item);
            }}
            id={field.name}
            name={field.name}
            label={field.label}
            value={"switch_on"}
            tooltip={field.tooltip}
            checked={value === "true"}
          />
        );
      case "csv":
        return (
          <CSVMultiSelector
            classes={classes}
            elements={valueHolder[item] ? valueHolder[item].value : ""}
            label={field.label}
            name={field.name}
            onChange={(value: string) =>
              setValueElement(field.name, value, item)
            }
            tooltip={field.tooltip}
            commonPlaceholder={field.placeholder}
            withBorder={true}
          />
        );
      case "comment":
        return (
          <CommentBoxWrapper
            classes={classes}
            id={field.name}
            name={field.name}
            label={field.label}
            tooltip={field.tooltip}
            value={valueHolder[item] ? valueHolder[item].value : ""}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setValueElement(field.name, e.target.value, item)
            }
            placeholder={field.placeholder}
          />
        );
      default:
        return (
          <InputBoxWrapper
            classes={classes}
            id={field.name}
            name={field.name}
            label={field.label}
            tooltip={field.tooltip}
            value={valueHolder[item] ? valueHolder[item].value : ""}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setValueElement(field.name, e.target.value, item)
            }
            multiline={!!field.multiline}
            placeholder={field.placeholder}
          />
        );
    }
  };

  return (
    <Grid container>
      <Grid xs={12} item className={classes.fieldBox}>
        {fieldsElements.map((field, item) => (
          <Grid item xs={12} key={field.name} className={classes.formFieldRow}>
            {fieldDefinition(field, item)}
          </Grid>
        ))}
      </Grid>
    </Grid>
  );
};

export default withStyles(styles)(ConfTargetGeneric);
