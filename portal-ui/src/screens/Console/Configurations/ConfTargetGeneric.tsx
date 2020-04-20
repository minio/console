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
import { KVField } from "./types";

interface IConfGenericProps {
  onChange: (newValue: Map<string, string>) => void;
  fields: KVField[];
  classes: any;
}

const styles = (theme: Theme) => createStyles({});

const ConfTargetGeneric = ({
  onChange,
  fields,
  classes
}: IConfGenericProps) => {
  //Local States

  const [keyValues, setKeyValues] = useState<Map<string, string>>(new Map());

  useEffect(() => {
    if (keyValues.size > 0) {
      onChange(keyValues);
    }
  }, [keyValues, onChange]);

  const val = (key: string): string => {
    return keyValues.get(key) === undefined ? "" : keyValues.get(key) + "";
  };
  const valFall = (key: string, fallback: string): string => {
    return keyValues.get(key) === undefined
      ? fallback
      : keyValues.get(key) + "";
  };

  return (
    <Grid container>
      {fields.map(field => (
        <React.Fragment key={field.name}>
          {field.type === "on|off" ? (
            <Grid item xs={12}>
              <RadioGroupSelector
                currentSelection={valFall(field.name, "false")}
                id={field.name}
                name={field.name}
                label={field.label}
                tooltip={field.tooltip}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setKeyValues(keyValues.set(field.name, e.target.value));
                }}
                selectorOptions={[
                  { label: "On", value: "true" },
                  { label: "Off", value: "false" }
                ]}
              />
            </Grid>
          ) : (
            <Grid item xs={12}>
              <InputBoxWrapper
                id={field.name}
                name={field.name}
                label={field.label}
                tooltip={field.tooltip}
                value={val(field.name)}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setKeyValues(keyValues.set(field.name, e.target.value));
                }}
              />
            </Grid>
          )}
        </React.Fragment>
      ))}

      <Grid item xs={12}>
        <InputBoxWrapper
          id="queue-dir"
          name="queue_dir"
          label="Queue Dir"
          value={val("queue_dir")}
          tooltip="staging dir for undelivered messages e.g. '/home/events'"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            setKeyValues(keyValues.set("queue_dir", e.target.value));
          }}
        />
      </Grid>
      <Grid item xs={12}>
        <InputBoxWrapper
          id="queue-limit"
          name="queue_limit"
          label="Queue Limit"
          type="number"
          value={val("queue_limit")}
          tooltip="maximum limit for undelivered messages, defaults to '10000'"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            setKeyValues(keyValues.set("queue_limit", e.target.value));
          }}
        />
      </Grid>
      <Grid item xs={12}>
        <InputBoxWrapper
          id="comment"
          name="comment"
          label="Comment"
          multiline={true}
          value={val("comment")}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            setKeyValues(keyValues.set("comment", e.target.value));
          }}
        />
      </Grid>
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
