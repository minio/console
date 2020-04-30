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
import Grid from "@material-ui/core/Grid";
import InputBoxWrapper from "../Common/FormComponents/InputBoxWrapper/InputBoxWrapper";
import RadioGroupSelector from "../Common/FormComponents/RadioGroupSelector/RadioGroupSelector";
import { IElementValue, KVField } from "./types";
import CSVMultiSelector from "../Common/FormComponents/CSVMultiSelector/CSVMultiSelector";

interface IConfGenericProps {
  onChange: (newValue: IElementValue[]) => void;
  fields: KVField[];
  classes: any;
}

const styles = (theme: Theme) => createStyles({});

const ConfTargetGeneric = ({
  onChange,
  fields,
  classes
}: IConfGenericProps) => {
  const [valueHolder, setValueHolder] = useState<IElementValue[]>([]);
  const fieldsElements = !fields ? [] : fields;

  // Effect to create all the values to hold
  useEffect(() => {
    const values: IElementValue[] = [];
    fields.forEach(field => {
      const stateInsert: IElementValue = {
        key: field.name,
        value: field.type === "on|off" ? "false" : ""
      };
      values.push(stateInsert);
    });

    setValueHolder(values);
  }, [fields]);

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
        return (
          <RadioGroupSelector
            currentSelection={valueHolder[item] ? valueHolder[item].value : ""}
            id={field.name}
            name={field.name}
            label={field.label}
            tooltip={field.tooltip}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setValueElement(field.name, e.target.value, item)
            }
            selectorOptions={[
              { label: "On", value: "true" },
              { label: "Off", value: "false" }
            ]}
          />
        );
      case "csv":
        return (
          <CSVMultiSelector
            elements={valueHolder[item] ? valueHolder[item].value : ""}
            label={field.label}
            name={field.name}
            onChange={(value: string) =>
              setValueElement(field.name, value, item)
            }
            tooltip={field.tooltip}
          />
        );
      default:
        return (
          <InputBoxWrapper
            id={field.name}
            name={field.name}
            label={field.label}
            tooltip={field.tooltip}
            value={valueHolder[item] ? valueHolder[item].value : ""}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setValueElement(field.name, e.target.value, item)
            }
            multiline={!!field.multiline}
          />
        );
    }
  };

  return (
    <Grid container>
      {fieldsElements.map((field, item) => (
        <React.Fragment key={field.name}>
          <Grid item xs={12}>
            {fieldDefinition(field, item)}
          </Grid>
        </React.Fragment>
      ))}
      <Grid item xs={12}>
        <br />
      </Grid>
      <Grid item xs={12}>
        <br />
      </Grid>
    </Grid>
  );
};

export default withStyles(styles)(ConfTargetGeneric);
