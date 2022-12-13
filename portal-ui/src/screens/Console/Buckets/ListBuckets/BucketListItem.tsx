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
import React, { Fragment } from "react";
import get from "lodash/get";
import { Theme } from "@mui/material/styles";
import createStyles from "@mui/styles/createStyles";
import {
  BucketsIcon,
  ReportedUsageIcon,
  TotalObjectsIcon,
} from "../../../../icons";
import { Bucket } from "../types";
import { Box, Grid, Typography } from "@mui/material";
import {
  calculateBytes,
  niceBytes,
  prettyNumber,
} from "../../../../common/utils";
import CheckboxWrapper from "../../Common/FormComponents/CheckboxWrapper/CheckboxWrapper";
import { Link, useNavigate } from "react-router-dom";
import {
  IAM_PERMISSIONS,
  IAM_ROLES,
} from "../../../../common/SecureComponent/permissions";
import { hasPermission } from "../../../../common/SecureComponent";
import clsx from "clsx";
import makeStyles from "@mui/styles/makeStyles";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      marginBottom: 30,
      padding: 20,
      color: theme.palette.primary.main,
      border: "#E5E5E5 1px solid",
      borderRadius: 2,
      textDecoration: "none",
      "&:hover": {
        backgroundColor: "#fafafa",
      },
      "& .min-icon": {
        height: 14,
        width: 14,
      },
      "& .MuiTypography-body2": {
        fontSize: 14,
      },
      "& .MuiCardHeader-content": {
        wordWrap: "break-word",
        overflowWrap: "break-word",
        wordBreak: "break-all",
        font: "normal normal bold 24px/27px Lato",
        color: theme.palette.primary.main,

        "& .MuiTypography-root": {
          fontSize: 19,
          fontWeight: "bold",
          "& .min-icon": {
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
    manageButton: {
      borderRadius: 4,
      width: 111,
      color: theme.palette.grey["700"],
      textTransform: "unset",
      fontSize: 12,
      fontWeight: "normal",
      "& .MuiButton-endIcon": {
        "& .min-icon": {
          fontSize: 18,
        },
      },
    },
    metric: {
      "& .min-icon": {
        color: "#000000",
        width: 13,
        marginRight: 5,
      },
    },
    metricLabel: {
      fontSize: 14,
      fontWeight: "bold",
      color: "#000000",
    },
    metricText: {
      fontSize: 24,
      fontWeight: "bold",
    },
    unit: {
      fontSize: 12,
      fontWeight: "normal",
    },
    bucketName: {
      padding: 0,
      margin: 0,
      fontSize: 22,
    },
    bucketIcon: {
      "& .min-icon": {
        height: 48,
        width: 48,
        color: theme.palette.primary.main,
      },
    },
    bucketInfo: {
      display: "flex",
      "@media (max-width: 900px)": {
        flexFlow: "column-reverse",
      },
    },
    bucketStats: {
      marginTop: 15,
      borderTop: "1px solid rgb(234,234,234, .7)",
      paddingTop: 14,
    },
    bucketActionButtons: {
      display: "flex",
      alignItems: "center",
      justifyContent: "flex-end",

      "& button": {
        marginLeft: 8,
      },

      "@media (max-width: 900px)": {
        marginTop: "-33px",
      },
    },
    disabled: {
      backgroundColor: "red",
    },
  })
);

interface IBucketListItem {
  bucket: Bucket;
  onSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  selected: boolean;
  bulkSelect: boolean;
  noManage?: boolean;
}

const BucketListItem = ({
  bucket,
  onSelect,
  selected,
  bulkSelect,
  noManage = false,
}: IBucketListItem) => {
  const classes = useStyles();
  const navigate = useNavigate();

  const usage = niceBytes(`${bucket.size}` || "0");
  const usageScalar = usage.split(" ")[0];
  const usageUnit = usage.split(" ")[1];

  const quota = get(bucket, "details.quota.quota", "0");
  const quotaForString = calculateBytes(quota, true, false);

  const manageAllowed =
    hasPermission(bucket.name, IAM_PERMISSIONS[IAM_ROLES.BUCKET_ADMIN]) &&
    false;

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
    <Grid
      container
      className={clsx(classes.root, "bucket-item", {
        [classes.disabled]: manageAllowed,
      })}
      onClick={() => {
        navigate(`/buckets/${bucket.name}/admin`);
      }}
      sx={{
        cursor: "pointer",
      }}
      id={`manageBucket-${bucket.name}`}
    >
      <Grid item xs={12}>
        <Grid container justifyContent={"space-between"}>
          <Grid item xs={12} sm={7}>
            <Grid container>
              <Grid item xs={12}>
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
                <h1 className={classes.bucketName}>
                  {bucket.name} {manageAllowed}
                </h1>
              </Grid>
              <Grid item xs={12}>
                <Grid container className={classes.bucketInfo}>
                  <Grid item xs={12} sm paddingRight={5}>
                    <Typography variant="body2">
                      Created: {new Date(bucket.creation_date).toString()}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm>
                    <Typography variant="body2">
                      Access: {accessToStr(bucket)}
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12} sm={5} className={classes.bucketActionButtons}>
            <Box display={{ xs: "none", sm: "block" }}>
              <div style={{ marginBottom: 10 }} />
            </Box>
          </Grid>
        </Grid>
      </Grid>

      <Grid item xs={12} className={classes.bucketStats}>
        <Grid container justifyContent={"flex-start"} spacing={4}>
          <Grid item className={classes.bucketIcon}>
            <Link to={`/buckets/${bucket.name}/browse`}>
              <BucketsIcon />
            </Link>
          </Grid>
          <Grid item textAlign={"left"} className={classes.metric}>
            <ReportedUsageIcon />
            <span className={classes.metricLabel}>Usage</span>
            <div className={classes.metricText}>
              {usageScalar}
              <span className={classes.unit}>{usageUnit}</span>
              {quota !== "0" && (
                <Fragment>
                  {" "}
                  / {quotaForString.total}
                  <span className={classes.unit}>{quotaForString.unit}</span>
                </Fragment>
              )}
            </div>
          </Grid>
          <Grid item textAlign={"left"} className={classes.metric}>
            <TotalObjectsIcon />
            <span className={classes.metricLabel}>Objects</span>
            <div className={classes.metricText}>
              {bucket.objects ? prettyNumber(bucket.objects) : 0}
            </div>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default BucketListItem;
