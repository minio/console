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
import React from "react";
import { Link } from "react-router-dom";
import { Theme } from "@mui/material/styles";
import createStyles from "@mui/styles/createStyles";
import withStyles from "@mui/styles/withStyles";
import {
  ArrowRightIcon,
  BucketsIcon,
  CalendarIcon,
  LockIcon,
  ReportedUsageIcon,
  SettingsIcon,
  TotalObjectsIcon,
} from "../../../../icons";
import { Bucket } from "../types";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Grid,
  Typography,
} from "@mui/material";
import { niceBytes, prettyNumber } from "../../../../common/utils";
import CheckboxWrapper from "../../Common/FormComponents/CheckboxWrapper/CheckboxWrapper";

const styles = (theme: Theme) =>
  createStyles({
    root: {
      marginBottom: 30,
      border: 0,
      borderRadius: 10,
      color: theme.palette.primary.main,
      boxShadow: "0px 0px 15px #00000029",
      "& .MuiSvgIcon-root": {
        height: 13,
      },
      "& .MuiCardHeader-content": {
        wordWrap: "break-word",
        overflowWrap: "break-word",
        wordBreak: "break-all",
        // height: 90,
        font: "normal normal bold 24px/27px Lato",
        color: theme.palette.primary.main,

        "& .MuiTypography-root": {
          fontSize: 19,
          fontWeight: "bold",
          "& .MuiSvgIcon-root": {
            position: "relative",
            top: 4,
            marginRight: 4,
            height: "24px !important",
          },
        },
      },
      "& .MuiCardHeader-root": {
        background:
          "transparent linear-gradient(0deg, #EEF1F44E 0%, #FFFFFF 100%) 0% 0% no-repeat padding-box",
      },
    },
    checkBoxElement: {
      width: 32,
      height: 32,
      float: "left",
      overflow: "hidden",
      "& div": {
        position: "absolute",
      },
    },
    buttonTray: {
      textAlign: "right",
    },
    viewButton: {
      width: 111,
      color: "white",
      backgroundColor: "#C83B51",
      fontSize: 12,
      fontWeight: "normal",
      boxShadow: "unset",
      borderRadius: 4,
    },
    manageButton: {
      borderRadius: 4,
      width: 111,
      color: theme.palette.grey["700"],
      textTransform: "unset",
      fontSize: 12,
      fontWeight: "normal",
      "& .MuiButton-endIcon": {
        "& .MuiSvgIcon-root": {
          fontSize: 18,
        },
      },
    },
    divider: {
      backgroundColor: theme.palette.grey["200"],
      marginTop: 10,
      marginBottom: 4,
    },
    metricLabel: {
      fontSize: 16,
      fontWeight: "bold",
    },
    metricText: {
      fontSize: 50,
      fontWeight: "bold",
      marginBottom: 10,
    },
    unit: {
      fontSize: 12,
      fontWeight: "normal",
    },
  });

interface IBucketListItem {
  bucket: Bucket;
  classes: any;
  onDelete: (bucketName: string) => void;
  onSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  selected: boolean;
  bulkSelect: boolean;
}

const BucketListItem = ({
  classes,
  bucket,
  onDelete,
  onSelect,
  selected,
  bulkSelect,
}: IBucketListItem) => {
  const usage = niceBytes(`${bucket.size}` || "0");
  const usageScalar = usage.split(" ")[0];
  const usageUnit = usage.split(" ")[1];

  const accessToStr = (bucket: Bucket): string => {
    if (bucket.rw_access?.read && !bucket.rw_access?.write) {
      return "R";
    } else if (!bucket.rw_access?.read && bucket.rw_access?.write) {
      return "W";
    } else if (bucket.rw_access?.read && bucket.rw_access?.write) {
      return "R/W";
    }
    return "";
  };
  const onCheckboxClick = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSelect(e);
  };

  return (
    <Card className={classes.root}>
      <CardHeader
        disableTypography={true}
        title={
          <Typography variant={"body1"}>
            {bulkSelect && (
              <div
                className={classes.checkBoxElement}
                onClick={(e) => {
                  e.stopPropagation();
                }}
              >
                <CheckboxWrapper
                  checked={selected}
                  id={`select-${bucket.name}`}
                  label={""}
                  name={`select-${bucket.name}`}
                  onChange={onCheckboxClick}
                  value={bucket.name}
                />
              </div>
            )}

            <BucketsIcon />
            {bucket.name}
          </Typography>
        }
      />
      <CardContent>
        <Grid container>
          <Grid item xs={12} sm={8} md={10}>
            <Grid container>
              <Grid item xs={12} md={6}>
                <Typography variant="body2">
                  <CalendarIcon /> Created: <b>{bucket.creation_date}</b>
                </Typography>
                <Typography variant="body2">
                  <LockIcon /> Access: <b> {accessToStr(bucket)}</b>
                </Typography>
              </Grid>
              <Grid item xs={6} md={3}>
                <Typography variant="body1" className={classes.metricLabel}>
                  <ReportedUsageIcon /> USAGE
                </Typography>
                <div className={classes.metricText}>
                  {usageScalar}
                  <span className={classes.unit}>{usageUnit}</span>
                </div>
              </Grid>
              <Grid item xs={6} md={3}>
                <Typography variant="body1" className={classes.metricLabel}>
                  <TotalObjectsIcon /> OBJECTS
                </Typography>
                <div className={classes.metricText}>
                  {bucket.objects ? prettyNumber(bucket.objects) : 0}
                </div>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12} sm={4} md={2} className={classes.buttonTray}>
            <Grid container>
              <Grid item xs={6} sm={12} md={12}>
                <Link
                  to={`/buckets/${bucket.name}/browse`}
                  style={{ textDecoration: "none" }}
                >
                  <Button
                    variant="contained"
                    endIcon={<ArrowRightIcon />}
                    className={classes.viewButton}
                  >
                    Browse
                  </Button>
                </Link>
                <Box display={{ xs: "none", sm: "block" }}>
                  <div style={{ marginBottom: 10 }} />
                </Box>
              </Grid>
              <Grid item xs={6} sm={12} md={12}>
                <Link
                  to={`/buckets/${bucket.name}/admin`}
                  style={{ textDecoration: "none" }}
                >
                  <Button
                    variant={"outlined"}
                    endIcon={<SettingsIcon />}
                    className={classes.manageButton}
                  >
                    Manage
                  </Button>
                </Link>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default withStyles(styles)(BucketListItem);
