import { HorizontalBar } from "react-chartjs-2";
import React, { useEffect, useState } from "react";
import { Button, Grid, TextField, InputBase } from "@material-ui/core";
import { IMessageEvent, w3cwebsocket as W3CWebSocket } from "websocket";
import { createStyles, Theme, withStyles } from "@material-ui/core/styles";
import { wsProtocol } from "../../../utils/wsUtils";
import api from "../../../common/api";
import { FormControl, MenuItem, Select } from "@material-ui/core";
import { BucketList, Bucket } from "../Watch/types";
import { HealStatus, colorH } from "./types";
import { niceBytes } from "../../../common/utils";
import {
  actionsTray,
  containerForHeader,
  searchField,
} from "../Common/FormComponents/common/styleLibrary";
import PageHeader from "../Common/PageHeader/PageHeader";
import CheckboxWrapper from "../Common/FormComponents/CheckboxWrapper/CheckboxWrapper";

const styles = (theme: Theme) =>
  createStyles({
    watchList: {
      background: "white",
      maxHeight: "400",
      overflow: "auto",
      "& ul": {
        margin: "4",
        padding: "0",
      },
      "& ul li": {
        listStyle: "none",
        margin: "0",
        padding: "0",
        borderBottom: "1px solid #dedede",
      },
    },
    graphContainer: {
      backgroundColor: "#fff",
      border: "#EAEDEE 1px solid",
      borderRadius: 3,
      padding: "19px 38px",
    },
    scanInfo: {
      marginTop: 20,
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between",
    },
    scanData: {
      fontSize: 13,
    },
    inlineCheckboxes: {
      display: "flex",
      justifyContent: "flex-start",
    },
    ...actionsTray,
    ...searchField,
    ...containerForHeader(theme.spacing(4)),
  });

interface IHeal {
  classes: any;
}

const SelectStyled = withStyles((theme: Theme) =>
  createStyles({
    root: {
      width: 450,
      lineHeight: 1,
      marginRight: 15,
      "label + &": {
        marginTop: theme.spacing(3),
      },
      "& .MuiSelect-select:focus": {
        backgroundColor: "transparent",
      },
    },
    input: {
      fontSize: 13,
      lineHeight: 15,
    },
  })
)(InputBase);

const Heal = ({ classes }: IHeal) => {
  const [start, setStart] = useState(false);
  const [bucketName, setBucketName] = useState("Select Bucket");
  const [bucketList, setBucketList] = useState<Bucket[]>([]);
  const [prefix, setPrefix] = useState("");
  const [recursive, setRecursive] = useState(false);
  const [forceStart, setForceStart] = useState(false);
  const [forceStop, setForceStop] = useState(false);
  // healStatus states
  const [hStatus, setHStatus] = useState({
    beforeHeal: [0, 0, 0, 0],
    afterHeal: [0, 0, 0, 0],
    objectsHealed: 0,
    objectsScanned: 0,
    healDuration: 0,
    sizeScanned: "",
  });

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
      .catch((err: any) => {
        console.log(err);
      });
  };

  useEffect(() => {
    fetchBucketList();
  }, []);

  // forceStart and forceStop need to be mutually exclusive
  useEffect(() => {
    if (forceStart === true) {
      setForceStop(false);
    }
  }, [forceStart]);

  useEffect(() => {
    if (forceStop === true) {
      setForceStart(false);
    }
  }, [forceStop]);

  const colorHealthArr = (color: colorH) => {
    return [color.Green, color.Yellow, color.Red, color.Grey];
  };

  useEffect(() => {
    // begin watch if bucketName in bucketList and start pressed
    if (start) {
      // values stored here to update chart
      const cB: colorH = { Green: 0, Yellow: 0, Red: 0, Grey: 0 };
      const cA: colorH = { Green: 0, Yellow: 0, Red: 0, Grey: 0 };

      const url = new URL(window.location.toString());
      const isDev = process.env.NODE_ENV === "development";
      const port = isDev ? "9090" : url.port;

      const wsProt = wsProtocol(url.protocol);
      const c = new W3CWebSocket(
        `${wsProt}://${url.hostname}:${port}/ws/heal/${bucketName}?prefix=${prefix}&recursive=${recursive}&force-start=${forceStart}&force-stop=${forceStop}`
      );

      if (c !== null) {
        c.onopen = () => {
          console.log("WebSocket Client Connected");
          c.send("ok");
        };
        c.onmessage = (message: IMessageEvent) => {
          let m: HealStatus = JSON.parse(message.data.toString());
          // Store percentage per health color
          for (const [key, value] of Object.entries(m.healthAfterCols)) {
            cA[key] = (value * 100) / m.itemsScanned;
          }
          for (const [key, value] of Object.entries(m.healthBeforeCols)) {
            cB[key] = (value * 100) / m.itemsScanned;
          }
          setHStatus({
            beforeHeal: colorHealthArr(cB),
            afterHeal: colorHealthArr(cA),
            objectsHealed: m.objectsHealed,
            objectsScanned: m.objectsScanned,
            healDuration: m.healDuration,
            sizeScanned: niceBytes(m.bytesScanned.toString()),
          });
        };
        c.onclose = () => {
          setStart(false);
          console.log("connection closed by server");
        };
        return () => {
          // close websocket on useEffect cleanup
          c.close(1000);
          console.log("closing websockets");
        };
      }
    }
  }, [start, bucketName, forceStart, forceStop, prefix, recursive]);

  let data = {
    labels: ["Green", "Yellow", "Red", "Grey"],
    datasets: [
      {
        label: "After Healing",
        data: hStatus.afterHeal,
        backgroundColor: "rgba(0, 0, 255, 0.2)",
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 1,
      },
      {
        label: "Before Healing",
        data: hStatus.beforeHeal,
        backgroundColor: "rgba(153, 102, 255, 0.2)",
        borderColor: "rgba(153, 102, 255, 1)",
        borderWidth: 1,
      },
    ],
  };
  const bucketNames = bucketList.map((bucketName) => ({
    label: bucketName.name,
    value: bucketName.name,
  }));
  return (
    <React.Fragment>
      <PageHeader label="Heal" />
      <Grid container>
        <Grid item xs={12} className={classes.container}>
          <Grid item xs={12} className={classes.actionsTray}>
            <FormControl variant="outlined">
              <Select
                id="bucket-name"
                name="bucket-name"
                value={bucketName}
                onChange={(e) => {
                  setBucketName(e.target.value as string);
                }}
                className={classes.searchField}
                input={<SelectStyled />}
              >
                <MenuItem value="" key={`select-bucket-name-default`}>
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
              placeholder="Prefix"
              className={classes.searchField}
              id="prefix-resource"
              label=""
              disabled={false}
              InputProps={{
                disableUnderline: true,
              }}
              onChange={(e) => {
                setPrefix(e.target.value);
              }}
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={start}
              onClick={() => setStart(true)}
            >
              Start
            </Button>
          </Grid>
          <Grid item xs={12} className={classes.inlineCheckboxes}>
            <CheckboxWrapper
              name="recursive"
              id="recursive"
              value="recursive"
              checked={recursive}
              onChange={(e) => {
                setRecursive(e.target.checked);
              }}
              disabled={false}
              label="Recursive"
            />
            <CheckboxWrapper
              name="forceStart"
              id="forceStart"
              value="forceStart"
              checked={forceStart}
              onChange={(e) => {
                setForceStart(e.target.checked);
              }}
              disabled={false}
              label="Force Start"
            />
            <CheckboxWrapper
              name="forceStop"
              id="forceStop"
              value="forceStop"
              checked={forceStop}
              onChange={(e) => {
                setForceStop(e.target.checked);
              }}
              disabled={false}
              label="Force Stop"
            />
          </Grid>
          <Grid item xs={12}>
            <br />
          </Grid>
          <Grid item xs={12} className={classes.graphContainer}>
            <HorizontalBar
              data={data}
              width={80}
              height={30}
              options={{
                title: {
                  display: true,
                  text: "Item's Health Status [%]",
                  fontSize: 20,
                },
                legend: {
                  display: true,
                  position: "right",
                },
              }}
            />
            <Grid item xs={12} className={classes.scanInfo}>
              <div className={classes.scanData}>
                <strong>Size scanned:</strong> {hStatus.sizeScanned}
              </div>
              <div className={classes.scanData}>
                <strong>Objects healed:</strong> {hStatus.objectsHealed} /{" "}
                {hStatus.objectsScanned}
              </div>
              <div className={classes.scanData}>
                <strong>Healing time:</strong> {hStatus.healDuration}s
              </div>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </React.Fragment>
  );
};

export default withStyles(styles)(Heal);
