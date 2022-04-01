// This file is part of MinIO Console Server
// Copyright (c) 2022 MinIO, Inc.
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
import { CapacityValues, ITenant, ValueUnit } from "./types";
import { connect } from "react-redux";
import { setErrorSnackMessage } from "../../../../actions";
import Grid from "@mui/material/Grid";
import history from "../../../../history";
import { Theme } from "@mui/material/styles";
import createStyles from "@mui/styles/createStyles";
import withStyles from "@mui/styles/withStyles";
import {niceBytes, niceBytesInt} from "../../../../common/utils";
import { tenantIsOnline } from "./utils";
import { Button } from "@mui/material";
import InformationItem from "./InformationItem";
import TenantCapacity from "./TenantCapacity";

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
      border: "1px solid #EAEDEE",
      borderRadius: 3,
      marginBottom: 20,
      padding: "15px 30px",
      "&:hover": {
        backgroundColor: "#FAFAFA",
        cursor: "pointer",
      },
    },
    titleContainer: {
      display: "flex",
      justifyContent: "space-between",
      width: "100%",
    },
    title: {
      fontSize: 18,
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
    namespaceLabel: {
      display: "inline-flex",
      backgroundColor: "#EAEDEF",
      borderRadius: 2,
      padding: "4px 8px",
      fontSize: 10,
      marginRight: 20,
    },
    status: {
      fontSize: 12,
      color: "#8F9090",
    },
  });

interface ITenantListItem {
  tenant: ITenant;
  classes: any;
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

  let raw: ValueUnit = { value: "n/a", unit: "" };
  let capacity: ValueUnit = { value: "n/a", unit: "" };
  let used: ValueUnit = { value: "n/a", unit: "" };

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
    const b = niceBytesInt(tenant.capacity_usage, true);
    const parts = b.split(" ");
    used.value = parts[0];
    used.unit = parts[1];
  }

  let spaceVariants: CapacityValues[] = [];

  if (!tenant.tiers || tenant.tiers.length === 0) {
    spaceVariants = [{ value: tenant.capacity_usage || 0, variant: "STANDARD" }];
  } else {
    spaceVariants = tenant.tiers.map((itemTenant) => {
      return { value: itemTenant.size, variant: itemTenant.name };
    });
  }

  const openTenantDetails = () => {
    history.push(`/namespaces/${tenant.namespace}/tenants/${tenant.name}`);
  };

  return (
    <Fragment>
      <div
        className={classes.tenantItem}
        id={`list-tenant-${tenant.name}`}
        onClick={openTenantDetails}
      >
        <Grid container>
          <Grid item xs={12} className={classes.titleContainer}>
            <div className={classes.title}>
              <span>{tenant.name}</span>
            </div>
            <div>
              <span className={classes.namespaceLabel}>
                Namespace:&nbsp;{tenant.namespace}
              </span>
            </div>
          </Grid>
          <Grid item xs={12} sx={{ marginTop: 2 }}>
            <Grid container>
              <Grid item xs={2}>
                <TenantCapacity
                  totalCapacity={tenant.capacity_raw || 0}
                  usedSpaceVariants={spaceVariants}
                  statusClass={healthStatusToClass(tenant.health_status)}
                />
              </Grid>
              <Grid item xs>
                <Grid
                  item
                  xs
                  sx={{
                    display: "flex",
                    justifyContent: "flex-start",
                    alignItems: "center",
                    marginTop: "10px",
                  }}
                >
                  <InformationItem
                    label={"Raw Capacity"}
                    value={raw.value}
                    unit={raw.unit}
                  />
                  <InformationItem
                    label={"Usable Capacity"}
                    value={capacity.value}
                    unit={capacity.unit}
                  />
                  <InformationItem
                    label={"Usage"}
                    value={used.value}
                    unit={used.unit}
                  />
                  <InformationItem
                    label={"Pools"}
                    value={tenant.pool_count.toString()}
                  />
                </Grid>
                <Grid
                  item
                  xs={12}
                  sx={{ paddingLeft: "20px", marginTop: "15px" }}
                >
                  <span className={classes.status}>
                    <strong>State:</strong> {tenant.currentState}
                  </span>
                </Grid>
              </Grid>
              <Grid
                item
                xs={2}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "flex-end",
                }}
              >
                <Button
                  id={"manage-tenant-" + tenant.name}
                  disabled={!tenantIsOnline(tenant)}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();

                    history.push(
                      `/namespaces/${tenant.namespace}/tenants/${tenant.name}/hop`
                    );
                  }}
                  disableTouchRipple
                  disableRipple
                  focusRipple={false}
                  sx={{
                    color: "#5E5E5E",
                    border: "#5E5E5E 1px solid",
                    whiteSpace: "nowrap",
                    paddingLeft: 4.5,
                    paddingRight: 4.5,
                  }}
                  variant={"outlined"}
                >
                  Manage
                </Button>
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
