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
import { Theme } from "@mui/material/styles";
import createStyles from "@mui/styles/createStyles";
import withStyles from "@mui/styles/withStyles";
import { containerForHeader } from "../../../Common/FormComponents/common/styleLibrary";
import Grid from "@mui/material/Grid";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { Link } from "react-router-dom";
import { setErrorSnackMessage } from "../../../../../actions";
import PodLogs from "./PodLogs";
import PodEvents from "./PodEvents";

interface IPodDetailsProps {
  classes: any;
  match: any;
  setErrorSnackMessage: typeof setErrorSnackMessage;
}

const styles = (theme: Theme) =>
  createStyles({
    breadcrumLink: {
      textDecoration: "none",
      color: "black",
    },
    ...containerForHeader(theme.spacing(4)),
  });

const PodDetails = ({ classes, match }: IPodDetailsProps) => {
  const [curTab, setCurTab] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const tenantNamespace = match.params["tenantNamespace"];
  const tenantName = match.params["tenantName"];
  const podName = match.params["podName"];

  function a11yProps(index: any) {
    return {
      id: `simple-tab-${index}`,
      "aria-controls": `simple-tabpanel-${index}`,
    };
  }

  useEffect(() => {
    if (loading) {
      setLoading(false);
    }
  }, [loading]);

  return (
    <Fragment>
      <Grid item xs={12}>
        <h1 className={classes.sectionTitle}>
          <Link
            to={`/namespaces/${tenantNamespace}/tenants/${tenantName}/pods`}
            className={classes.breadcrumLink}
          >
            Pods
          </Link>{" "}
          &gt; {podName}
        </h1>
      </Grid>
      <Grid container>
        <Grid item xs={9}>
          <Tabs
            value={curTab}
            onChange={(e: React.ChangeEvent<{}>, newValue: number) => {
              setCurTab(newValue);
            }}
            indicatorColor="primary"
            textColor="primary"
            aria-label="cluster-tabs"
            variant="scrollable"
            scrollButtons="auto"
          >
            <Tab label="Events" {...a11yProps(0)} />
            <Tab label="Logs" {...a11yProps(1)} />
          </Tabs>
        </Grid>
        {curTab === 0 && (
          <PodEvents
            tenant={tenantName}
            namespace={tenantNamespace}
            podName={podName}
            propLoading={loading}
          />
        )}
        {curTab === 1 && (
          <PodLogs
            tenant={tenantName}
            namespace={tenantNamespace}
            podName={podName}
            propLoading={loading}
          />
        )}
      </Grid>
    </Fragment>
  );
};

export default withStyles(styles)(PodDetails);
