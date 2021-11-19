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
import { Button } from "@mui/material";
import { ITenant } from "./types";
import { connect } from "react-redux";
import { setErrorSnackMessage } from "../../../../actions";
import Grid from "@mui/material/Grid";
import { ArrowRightIcon, CircleIcon } from "../../../../icons";
import history from "../../../../history";
import TenantsIcon from "../../../../icons/TenantsIcon";
import { Theme } from "@mui/material/styles";
import createStyles from "@mui/styles/createStyles";
import withStyles from "@mui/styles/withStyles";
import { niceBytes } from "../../../../common/utils";
import UsageBarWrapper from "../../Common/UsageBarWrapper/UsageBarWrapper";
import { tenantIsOnline } from "./utils";

const styles = (theme: Theme) =>
  createStyles({
    redState: {
      color: theme.palette.error.main,
      "& .min-icon": {
        width: 16,
        height: 16,
        float: "left",
        marginRight: 4,
      },
    },
    yellowState: {
      color: theme.palette.warning.main,
      "& .min-icon": {
        width: 16,
        height: 16,
        float: "left",
        marginRight: 4,
      },
    },
    greenState: {
      color: theme.palette.success.main,
      "& .min-icon": {
        width: 16,
        height: 16,
        float: "left",
        marginRight: 4,
      },
    },
    greyState: {
      color: "grey",
      "& .min-icon": {
        width: 16,
        height: 16,
        float: "left",
        marginRight: 4,
      },
    },
    tenantIcon: { width: 40, height: 40, position: "relative" },
    healthStatusIcon: {
      position: "absolute",
      fontSize: 10,
      top: 0,
      right: -20,
      height: 10,
    },
    tenantItem: {
      border: "1px solid #dedede",
      marginBottom: 20,
      paddingLeft: 40,
      paddingRight: 40,
      paddingTop: 30,
      paddingBottom: 30,
    },
    title: {
      fontSize: 22,
      fontWeight: "bold",
    },
    titleSubKey: {
      fontSize: 14,
      paddingRight: 8,
    },
    titleSubValue: {
      fontSize: 14,
      fontWeight: "bold",
      paddingRight: 16,
    },
    boxyTitle: {
      fontWeight: "bold",
    },
    boxyValue: {
      fontSize: 24,
      fontWeight: "bold",
    },
    boxyUnit: {
      fontSize: 12,
      color: "#5E5E5E",
    },
    manageButton: {
      marginRight: 8,
      textTransform: "initial",
    },
  });

interface ITenantListItem {
  tenant: ITenant;
  classes: any;
}

interface ValueUnit {
  value: string;
  unit: string;
}

const TenantListItem = ({ tenant, classes }: ITenantListItem) => {
  const healthStatusToClass = (health_status: string) => {
    switch (health_status) {
      case "red":
        return classes.redState;
      case "yellow":
        return classes.yellowState;
      case "green":
        return classes.greenState;
      default:
        return classes.greyState;
    }
  };

  var raw: ValueUnit = { value: "n/a", unit: "" };
  var capacity: ValueUnit = { value: "n/a", unit: "" };
  var used: ValueUnit = { value: "n/a", unit: "" };

  if (tenant.capacity_raw) {
    const b = niceBytes(`${tenant.capacity_raw}`, true);
    const parts = b.split(" ");
    raw.value = parts[0];
    raw.unit = parts[1];
  }
  if (tenant.capacity) {
    const b = niceBytes(`${tenant.capacity}`, true);
    const parts = b.split(" ");
    capacity.value = parts[0];
    capacity.unit = parts[1];
  }
  if (tenant.capacity_usage) {
    const usageProportion =
      (tenant.capacity! * tenant.capacity_raw_usage!) / tenant.capacity_raw!;
    const b = niceBytes(`${usageProportion}`, true);
    const parts = b.split(" ");
    used.value = parts[0];
    used.unit = parts[1];
  }

  return (
    <Fragment>
      <div className={classes.tenantItem}>
        <Grid container>
          <Grid item xs={8}>
            <div className={classes.title}>{tenant.name}</div>
            <div>
              <span className={classes.titleSubKey}>Namespace:</span>
              <span className={classes.titleSubValue}>{tenant.namespace}</span>
              <span className={classes.titleSubKey}>Pools:</span>
              <span className={classes.titleSubValue}>{tenant.pool_count}</span>
              <span className={classes.titleSubKey}>State:</span>
              <span className={classes.titleSubValue}>
                {tenant.currentState}
              </span>
            </div>
          </Grid>
          <Grid item xs={4} textAlign={"end"}>
            <Button
              size={"small"}
              color={"primary"}
              variant="outlined"
              disabled={!tenantIsOnline(tenant)}
              className={classes.manageButton}
              onClick={() => {
                history.push(
                  `/namespaces/${tenant.namespace}/tenants/${tenant.name}/hop`
                );
              }}
            >
              Manage
            </Button>
            <Button
              endIcon={<ArrowRightIcon />}
              variant="contained"
              onClick={() => {
                history.push(
                  `/namespaces/${tenant.namespace}/tenants/${tenant.name}`
                );
              }}
            >
              View
            </Button>
          </Grid>
          <Grid item xs={12}>
            <hr />
          </Grid>
          <Grid item xs={12}>
            <Grid container alignItems={"center"}>
              <Grid item xs={7}>
                <Grid container>
                  <Grid item xs={3} style={{ textAlign: "center" }}>
                    <div className={classes.tenantIcon}>
                      <TenantsIcon style={{ height: 40, width: 40 }} />
                      <div className={classes.healthStatusIcon}>
                        <span
                          className={healthStatusToClass(tenant.health_status)}
                        >
                          <CircleIcon />
                        </span>
                      </div>
                    </div>
                  </Grid>
                  <Grid item xs={3}>
                    <Grid container>
                      <Grid item xs={12} className={classes.boxyTitle}>
                        Raw Capacity
                      </Grid>
                      <Grid item className={classes.boxyValue}>
                        {raw.value}
                        <span className={classes.boxyUnit}>{raw.unit}</span>
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item xs={3}>
                    <Grid container>
                      <Grid item xs={12} className={classes.boxyTitle}>
                        Capacity
                      </Grid>
                      <Grid item className={classes.boxyValue}>
                        {capacity.value}
                        <span className={classes.boxyUnit}>
                          {capacity.unit}
                        </span>
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item xs={3}>
                    <Grid container>
                      <Grid item xs={12} className={classes.boxyTitle}>
                        Usage
                      </Grid>
                      <Grid item className={classes.boxyValue}>
                        {used.value}
                        <span className={classes.boxyUnit}>{used.unit}</span>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={5}>
                <UsageBarWrapper
                  currValue={tenant.capacity_raw_usage ?? 0}
                  maxValue={tenant.capacity_raw ?? 1}
                  label={""}
                  renderFunction={niceBytes}
                  error={""}
                  loading={false}
                  labels={false}
                />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </div>
    </Fragment>
  );
};

const connector = connect(null, {
  setErrorSnackMessage,
});

export default withStyles(styles)(connector(TenantListItem));
