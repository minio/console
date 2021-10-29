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

import React, { useCallback, useEffect, useState } from "react";
import { Theme } from "@mui/material/styles";
import createStyles from "@mui/styles/createStyles";
import withStyles from "@mui/styles/withStyles";
import Grid from "@mui/material/Grid";
import InputBoxWrapper from "../../Common/FormComponents/InputBoxWrapper/InputBoxWrapper";
import RadioGroupSelector from "../../Common/FormComponents/RadioGroupSelector/RadioGroupSelector";
import { IElementValue } from "../../Configurations/types";
import { modalBasic } from "../../Common/FormComponents/common/styleLibrary";
import CommentBoxWrapper from "../../Common/FormComponents/CommentBoxWrapper/CommentBoxWrapper";
import FormSwitchWrapper from "../../Common/FormComponents/FormSwitchWrapper/FormSwitchWrapper";
import PredefinedList from "../../Common/FormComponents/PredefinedList/PredefinedList";

interface IConfMySqlProps {
  onChange: (newValue: IElementValue[]) => void;
  classes: any;
}

const styles = (theme: Theme) =>
  createStyles({
    ...modalBasic,
  });

const ConfMySql = ({ onChange, classes }: IConfMySqlProps) => {
  //Local States
  const [useDsnString, setUseDsnString] = useState<boolean>(false);
  const [dsnString, setDsnString] = useState<string>("");
  const [host, setHostname] = useState<string>("");
  const [dbName, setDbName] = useState<string>("");
  const [port, setPort] = useState<string>("");
  const [user, setUser] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const [table, setTable] = useState<string>("");
  const [format, setFormat] = useState<string>("namespace");
  const [queueDir, setQueueDir] = useState<string>("");
  const [queueLimit, setQueueLimit] = useState<string>("");
  const [comment, setComment] = useState<string>("");

  // dsn_string*  (string)             MySQL data-source-name connection string e.g. "<user>:<password>@tcp(<host>:<port>)/<database>"
  // table*       (string)             DB table name to store/update events, table is auto-created
  // format*      (namespace*|access)  'namespace' reflects current bucket/object list and 'access' reflects a journal of object operations, defaults to 'namespace'
  // queue_dir    (path)               staging dir for undelivered messages e.g. '/home/events'
  // queue_limit  (number)             maximum limit for undelivered messages, defaults to '100000'
  // comment      (sentence)           optionally add a comment to this setting

  const parseDsnString = (
    input: string,
    keys: string[]
  ): Map<string, string> => {
    let kvFields: Map<string, string> = new Map();
    const regex = /(.*?):(.*?)@tcp\((.*?):(.*?)\)\/(.*?)$/gm;
    let m;

    while ((m = regex.exec(input)) !== null) {
      // This is necessary to avoid infinite loops with zero-width matches
      if (m.index === regex.lastIndex) {
        regex.lastIndex++;
      }

      kvFields.set("user", m[1]);
      kvFields.set("password", m[2]);
      kvFields.set("host", m[3]);
      kvFields.set("port", m[4]);
      kvFields.set("dbname", m[5]);
    }

    return kvFields;
  };

  const configToDsnString = useCallback((): string => {
    return `${user}:${password}@tcp(${host}:${port})/${dbName}`;
  }, [user, password, host, port, dbName]);

  useEffect(() => {
    if (dsnString !== "") {
      const formValues = [
        { key: "dsn_string", value: dsnString },
        { key: "table", value: table },
        { key: "format", value: format },
        { key: "queue_dir", value: queueDir },
        { key: "queue_limit", value: queueLimit },
        { key: "comment", value: comment },
      ];

      onChange(formValues);
    }
  }, [dsnString, table, format, queueDir, queueLimit, comment, onChange]);

  useEffect(() => {
    const cs = configToDsnString();
    setDsnString(cs);
  }, [user, dbName, password, port, host, setDsnString, configToDsnString]);

  const switcherChangeEvt = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      // build dsn_string
      const cs = configToDsnString();
      setDsnString(cs);
    } else {
      // parse dsn_string
      const kv = parseDsnString(dsnString, [
        "host",
        "port",
        "dbname",
        "user",
        "password",
      ]);
      setHostname(kv.get("host") ? kv.get("host") + "" : "");
      setPort(kv.get("port") ? kv.get("port") + "" : "");
      setDbName(kv.get("dbname") ? kv.get("dbname") + "" : "");
      setUser(kv.get("user") ? kv.get("user") + "" : "");
      setPassword(kv.get("password") ? kv.get("password") + "" : "");
    }

    setUseDsnString(event.target.checked);
  };

  return (
    <Grid container>
      <Grid item xs={12}>
        <FormSwitchWrapper
          label={"Enter DNS String"}
          checked={useDsnString}
          id="checkedB"
          name="checkedB"
          onChange={switcherChangeEvt}
          value={"dnsString"}
        />
      </Grid>
      {useDsnString ? (
        <React.Fragment>
          <Grid item xs={12}>
            <InputBoxWrapper
              id="dsn-string"
              name="dsn_string"
              label="DSN String"
              value={dsnString}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setDsnString(e.target.value);
              }}
            />
          </Grid>
        </React.Fragment>
      ) : (
        <React.Fragment>
          <Grid item xs={12}>
            <Grid item xs={12} className={classes.configureString}>
              <Grid item xs={12}>
                <InputBoxWrapper
                  id="host"
                  name="host"
                  label=""
                  placeholder="Enter Host"
                  value={host}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    setHostname(e.target.value);
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <InputBoxWrapper
                  id="db-name"
                  name="db-name"
                  label=""
                  placeholder="Enter DB Name"
                  value={dbName}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    setDbName(e.target.value);
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <InputBoxWrapper
                  id="port"
                  name="port"
                  label=""
                  placeholder="Enter Port"
                  value={port}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    setPort(e.target.value);
                  }}
                />
              </Grid>

              <Grid item xs={12}>
                <InputBoxWrapper
                  id="user"
                  name="user"
                  label=""
                  placeholder="Enter User"
                  value={user}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    setUser(e.target.value);
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <InputBoxWrapper
                  id="password"
                  name="password"
                  label=""
                  placeholder="Enter Password"
                  type="password"
                  value={password}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    setPassword(e.target.value);
                  }}
                />
              </Grid>
            </Grid>
          </Grid>
          <PredefinedList label={"Connection String"} content={dsnString} />
          <Grid item xs={12}>
            <br />
          </Grid>
        </React.Fragment>
      )}
      <Grid item xs={12}>
        <InputBoxWrapper
          id="table"
          name="table"
          label="Table"
          placeholder="Enter Table Name"
          value={table}
          tooltip="DB table name to store/update events, table is auto-created"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            setTable(e.target.value);
          }}
        />
      </Grid>
      <Grid item xs={12}>
        <RadioGroupSelector
          currentSelection={format}
          id="format"
          name="format"
          label="Format"
          onChange={(e) => {
            setFormat(e.target.value);
          }}
          tooltip="'namespace' reflects current bucket/object list and 'access' reflects a journal of object operations, defaults to 'namespace'"
          selectorOptions={[
            { label: "Namespace", value: "namespace" },
            { label: "Access", value: "access" },
          ]}
        />
      </Grid>
      <Grid item xs={12}>
        <InputBoxWrapper
          id="queue-dir"
          name="queue_dir"
          label="Queue Dir"
          placeholder="Enter Queue Dir"
          value={queueDir}
          tooltip="staging dir for undelivered messages e.g. '/home/events'"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            setQueueDir(e.target.value);
          }}
        />
      </Grid>
      <Grid item xs={12}>
        <InputBoxWrapper
          id="queue-limit"
          name="queue_limit"
          label="Queue Limit"
          placeholder="Enter Queue Limit"
          type="number"
          value={queueLimit}
          tooltip="maximum limit for undelivered messages, defaults to '10000'"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            setQueueLimit(e.target.value);
          }}
        />
      </Grid>
      <Grid item xs={12}>
        <CommentBoxWrapper
          id="comment"
          name="comment"
          label="Comment"
          placeholder="Enter Comment"
          value={comment}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            setComment(e.target.value);
          }}
        />
      </Grid>
    </Grid>
  );
};

export default withStyles(styles)(ConfMySql);
