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
import {
  Button,
  FormControl,
  Grid,
  InputBase,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { IMessageEvent, w3cwebsocket as W3CWebSocket } from "websocket";
import { connect } from "react-redux";
import { Theme } from "@mui/material/styles";
import createStyles from "@mui/styles/createStyles";
import withStyles from "@mui/styles/withStyles";
import { AppState } from "../../../store";
import { watchMessageReceived, watchResetMessages } from "./actions";
import { Bucket, BucketList, EventInfo } from "./types";
import { niceBytes, timeFromDate } from "../../../common/utils";
import { wsProtocol } from "../../../utils/wsUtils";
import {
  actionsTray,
  containerForHeader,
  searchField,
  tableStyles,
} from "../Common/FormComponents/common/styleLibrary";
import { ErrorResponseHandler } from "../../../common/types";
import TableWrapper from "../Common/TableWrapper/TableWrapper";
import PageHeader from "../Common/PageHeader/PageHeader";
import api from "../../../common/api";
import PageLayout from "../Common/Layout/PageLayout";

const styles = (theme: Theme) =>
  createStyles({
    searchPrefix: {
      flexGrow: 1,
      marginLeft: 15,
    },
    watchTableHeight: {
      height: "calc(100vh - 270px)",
    },
    bucketField: {
      flexGrow: 2,
      minWidth: 200,
    },
    ...tableStyles,
    ...actionsTray,
    ...searchField,
    ...containerForHeader(theme.spacing(4)),
  });

const SelectStyled = withStyles((theme: Theme) =>
  createStyles({
    root: {
      lineHeight: "50px",
      "label + &": {
        marginTop: theme.spacing(3),
      },
      "& .MuiSelect-select:focus": {
        backgroundColor: "transparent",
      },
    },
    input: {
      height: 50,
      fontSize: 13,
      lineHeight: "50px",
    },
  })
)(InputBase);

interface IWatch {
  classes: any;
  watchMessageReceived: typeof watchMessageReceived;
  watchResetMessages: typeof watchResetMessages;
  messages: EventInfo[];
}

const Watch = ({
  classes,
  watchMessageReceived,
  watchResetMessages,
  messages,
}: IWatch) => {
  const [start, setStart] = useState(false);
  const [bucketName, setBucketName] = useState("Select Bucket");
  const [prefix, setPrefix] = useState("");
  const [suffix, setSuffix] = useState("");
  const [bucketList, setBucketList] = useState<Bucket[]>([]);

  const fetchBucketList = () => {
    api
      .invoke("GET", `/api/v1/buckets`)
      .then((res: BucketList) => {
        let buckets: Bucket[] = [];
        if (res.buckets !== null) {
          buckets = res.buckets;
        }
        setBucketList(buckets);
      })
      .catch((err: ErrorResponseHandler) => {
        console.error(err);
      });
  };
  useEffect(() => {
    fetchBucketList();
  }, []);

  useEffect(() => {
    watchResetMessages();
    // begin watch if bucketName in bucketList and start pressed
    if (start && bucketList.some((bucket) => bucket.name === bucketName)) {
      const url = new URL(window.location.toString());
      const isDev = process.env.NODE_ENV === "development";
      const port = isDev ? "9090" : url.port;

      // check if we are using base path, if not this always is `/`
      const baseLocation = new URL(document.baseURI);
      const baseUrl = baseLocation.pathname;

      const wsProt = wsProtocol(url.protocol);
      const c = new W3CWebSocket(
        `${wsProt}://${url.hostname}:${port}${baseUrl}ws/watch/${bucketName}?prefix=${prefix}&suffix=${suffix}`
      );

      let interval: any | null = null;
      if (c !== null) {
        c.onopen = () => {
          console.log("WebSocket Client Connected");
          c.send("ok");
          interval = setInterval(() => {
            c.send("ok");
          }, 10 * 1000);
        };
        c.onmessage = (message: IMessageEvent) => {
          let m: EventInfo = JSON.parse(message.data.toString());
          m.Time = new Date(m.Time.toString());
          m.key = Math.random();
          watchMessageReceived(m);
        };
        c.onclose = () => {
          clearInterval(interval);
          console.log("connection closed by server");
          // reset start status
          setStart(false);
        };
        return () => {
          // close websocket on useEffect cleanup
          c.close(1000);
          clearInterval(interval);
          console.log("closing websockets");
        };
      }
    } else {
      // reset start status
      setStart(false);
    }
  }, [
    watchMessageReceived,
    start,
    bucketList,
    bucketName,
    prefix,
    suffix,
    watchResetMessages,
  ]);

  const bucketNames = bucketList.map((bucketName) => ({
    label: bucketName.name,
    value: bucketName.name,
  }));

  return (
    <React.Fragment>
      <PageHeader label="Watch" />
      <PageLayout>
        <Grid item xs={12}>
          <Grid item xs={12} className={classes.actionsTray}>
            <FormControl variant="outlined" className={classes.bucketField}>
              <Select
                id="bucket-name"
                name="bucket-name"
                value={bucketName}
                onChange={(e) => {
                  setBucketName(e.target.value as string);
                }}
                className={classes.searchField}
                disabled={start}
                input={<SelectStyled />}
              >
                <MenuItem
                  value={bucketName}
                  key={`select-bucket-name-default`}
                  disabled={true}
                >
                  Select Bucket
                </MenuItem>
                {bucketNames.map((option) => (
                  <MenuItem
                    value={option.value}
                    key={`select-bucket-name-${option.label}`}
                  >
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              className={`${classes.searchField} ${classes.searchPrefix}`}
              id="prefix-resource"
              label="Prefix"
              disabled={start}
              InputProps={{
                disableUnderline: true,
              }}
              onChange={(e) => {
                setPrefix(e.target.value);
              }}
              variant="standard"
            />
            <TextField
              className={`${classes.searchField} ${classes.searchPrefix}`}
              id="suffix-resource"
              label="Suffix"
              disabled={start}
              InputProps={{
                disableUnderline: true,
              }}
              onChange={(e) => {
                setSuffix(e.target.value);
              }}
              variant="standard"
            />
            {start ? (
              <Button
                type="submit"
                variant="contained"
                color="primary"
                onClick={() => setStart(false)}
              >
                Stop
              </Button>
            ) : (
              <Button
                type="submit"
                variant="contained"
                color="primary"
                onClick={() => setStart(true)}
              >
                Start
              </Button>
            )}
          </Grid>

          <div className={classes.tableBlock}>
            <TableWrapper
              columns={[
                {
                  label: "Time",
                  elementKey: "Time",
                  renderFunction: timeFromDate,
                },
                {
                  label: "Size",
                  elementKey: "Size",
                  renderFunction: niceBytes,
                },
                { label: "Type", elementKey: "Type" },
                { label: "Path", elementKey: "Path" },
              ]}
              records={messages}
              entityName={"Watch"}
              customEmptyMessage={"No Changes at this time"}
              idField={"watch_table"}
              isLoading={false}
              customPaperHeight={classes.watchTableHeight}
            />
          </div>
        </Grid>
      </PageLayout>
    </React.Fragment>
  );
};

const mapState = (state: AppState) => ({
  messages: state.watch.messages,
});

const connector = connect(mapState, {
  watchMessageReceived: watchMessageReceived,
  watchResetMessages: watchResetMessages,
});

export default connector(withStyles(styles)(Watch));
