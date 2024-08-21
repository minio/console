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

import React, { Fragment, useEffect, useState } from "react";
import {
  CommentBox,
  ConsoleIcon,
  FormLayout,
  Grid,
  InputBox,
  ReadBox,
  Switch,
  Tooltip,
} from "mds";
import { IElementValue, IOverrideEnv, KVField } from "../Configurations/types";
import CSVMultiSelector from "../Common/FormComponents/CSVMultiSelector/CSVMultiSelector";

interface IConfGenericProps {
  onChange: (newValue: IElementValue[]) => void;
  fields: KVField[];
  defaultVals?: IElementValue[];
  overrideEnv?: IOverrideEnv;
}

// Function to get defined values,
//we make this because the backed sometimes don't return all the keys when there is an initial configuration
const valueDef = (key: string, type: string, defaults: IElementValue[]) => {
  let defValue = type === "on|off" ? "off" : "";

  if (defaults.length > 0) {
    const storedConfig = defaults.find((element) => element.key === key);

    if (storedConfig) {
      defValue = storedConfig.value || "";
    }
  }

  return defValue;
};

const ConfTargetGeneric = ({
  onChange,
  fields,
  defaultVals,
  overrideEnv,
}: IConfGenericProps) => {
  const [valueHolder, setValueHolder] = useState<IElementValue[]>([]);
  const fieldsElements = !fields ? [] : fields;
  const defValList = !defaultVals ? [] : defaultVals;

  // Effect to create all the values to hold
  useEffect(() => {
    const values: IElementValue[] = fields.map((field) => {
      const stateInsert: IElementValue = {
        key: field.name,
        value: valueDef(field.name, field.type, defValList),
      };
      return stateInsert;
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
    value = value.trim();
    valuesDup[index] = { key, value };

    setValueHolder(valuesDup);
  };

  const fieldDefinition = (field: KVField, item: number) => {
    const holderItem = valueHolder[item];

    if (holderItem) {
      // Override Value with env var, we display generic string component
      const override = overrideEnv?.[`${holderItem.key}`];

      if (override) {
        return (
          <ReadBox
            label={field.label}
            actionButton={
              <Grid
                item
                sx={{
                  display: "flex",
                  justifyContent: "flex-end",
                  paddingRight: "10px",
                }}
              >
                <Tooltip
                  tooltip={`This value is set from the ${override.overrideEnv} environment variable`}
                  placement={"left"}
                >
                  <ConsoleIcon style={{ width: 20 }} />
                </Tooltip>
              </Grid>
            }
            sx={{ width: "100%" }}
          >
            {override.value}
          </ReadBox>
        );
      }
    }

    switch (field.type) {
      case "on|off":
        const value = holderItem ? holderItem.value : "off";

        return (
          <Switch
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              const value = e.target.checked ? "on" : "off";
              setValueElement(field.name, value, item);
            }}
            id={field.name}
            name={field.name}
            label={field.label}
            value={"switch_on"}
            tooltip={field.tooltip}
            checked={value === "on"}
          />
        );
      case "csv":
        return (
          <CSVMultiSelector
            elements={holderItem ? holderItem.value : ""}
            label={field.label}
            name={field.name}
            onChange={(value: string | string[]) => {
              let valCh = "";

              if (Array.isArray(value)) {
                valCh = value.join(",");
              } else {
                valCh = value;
              }

              setValueElement(field.name, valCh, item);
            }}
            tooltip={field.tooltip}
            commonPlaceholder={field.placeholder}
            withBorder={true}
          />
        );
      case "comment":
        return (
          <CommentBox
            id={field.name}
            name={field.name}
            label={field.label}
            tooltip={field.tooltip}
            value={holderItem ? holderItem.value : ""}
            onChange={(e) => setValueElement(field.name, e.target.value, item)}
            placeholder={field.placeholder}
          />
        );
      default:
        return (
          <InputBox
            id={field.name}
            name={field.name}
            label={field.label}
            tooltip={field.tooltip}
            value={holderItem ? holderItem.value : ""}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setValueElement(field.name, e.target.value, item)
            }
            placeholder={field.placeholder}
          />
        );
    }
  };

  return (
    <FormLayout withBorders={false} containerPadding={false}>
      {fieldsElements.map((field, item) => (
        <Fragment key={field.name}>{fieldDefinition(field, item)}</Fragment>
      ))}
    </FormLayout>
  );
};

export default ConfTargetGeneric;
