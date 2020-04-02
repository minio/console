// This file is part of MinIO Kubernetes Cloud
// Copyright (c) 2019 MinIO, Inc.
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
import { makeStyles, useTheme } from "@material-ui/core/styles";
import clsx from "clsx";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Legend,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import NetworkCheckIcon from '@material-ui/icons/NetworkCheck';
import PieChartIcon from '@material-ui/icons/PieChart';
import ViewHeadlineIcon from '@material-ui/icons/ViewHeadline';

const useStyles = makeStyles(theme => ({
  root: {
    display: "flex"
  },
  toolbar: {
    paddingRight: 24 // keep right padding when drawer closed
  },
  toolbarIcon: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    padding: "0 8px",
    ...theme.mixins.toolbar
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    })
  },

  menuButton: {
    marginRight: 36
  },
  menuButtonHidden: {
    display: "none"
  },
  title: {
    flexGrow: 1
  },
  drawerPaperClose: {
    overflowX: "hidden",
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    }),
    width: theme.spacing(7),
    [theme.breakpoints.up("sm")]: {
      width: theme.spacing(9)
    }
  },
  appBarSpacer: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    height: "100vh",
    overflow: "auto"
  },
  container: {
    paddingBottom: theme.spacing(4),
    "& h6": {
      color: "#777777",
      fontSize: 14,
    },
    "& p": {
      "& span": {
        fontSize: 16,
      },
    },
  },
  paper: {
    padding: theme.spacing(2),
    display: "flex",
    overflow: "auto",
    flexDirection: "column"
  },
  fixedHeight: {
    minHeight: 240,
  },
  consumptionValue: {
    color: "#000000",
    fontSize: "60px",
    fontWeight: "bold",
  },
  icon: {
    marginRight: 10,
    color: "#777777",
  },
}));

export default function Dashboard() {
  const theme = useTheme();
  const classes = useStyles(theme);
  const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);

  const data = [39,31,37,29,28,31,31,34,39,40,35,40,24,25,30,20,28,38,23,28,22,39,37,37,40,28,28,28,24,31].map((usage, day ) => ({ usage, day }));
  const data2 = [25,32,21,40,31,30,23,40,26,32].map((usage, day ) => ({ usage, day }));

  return (
    <Grid container xs={12}>
      <Grid container xs={12} spacing={3} className={classes.container}>
        <Grid item xs={12} md={4} lg={4}>
          <Paper className={fixedHeightPaper}>
            <Grid container direction="row" alignItems="center">
              <Grid item className={classes.icon}>
                <ViewHeadlineIcon/>
              </Grid>
              <Grid item>
                <Typography variant="h6">All Buckets</Typography>
              </Grid>
            </Grid>
            <Typography className={classes.consumptionValue}>238</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4} lg={4}>
          <Paper className={fixedHeightPaper}>
            <Grid container direction="row" alignItems="center">
              <Grid item className={classes.icon}>
                <PieChartIcon/>
              </Grid>
              <Grid item>
                <Typography variant="h6">Usage</Typography>
              </Grid>
            </Grid>
            <Typography className={classes.consumptionValue}>375<span>TB</span></Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4} lg={4}>
          <Paper className={fixedHeightPaper}>
            <Grid container direction="row" alignItems="center">
              <Grid item className={classes.icon}>
                <NetworkCheckIcon/>
              </Grid>
              <Grid item>
                <Typography variant="h6"> Egress this Month</Typography>
              </Grid>
            </Grid>
            <Typography className={classes.consumptionValue}>1.5<span>TB</span></Typography>
          </Paper>
        </Grid>
      </Grid>
      <Grid container xs={12} spacing={3} className={classes.container}>
        <Grid item xs={8}>
          <Paper className={fixedHeightPaper}>
            <Typography variant="h6">Daily Average Usage</Typography>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart
                data={data}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  type="number"
                  domain={[1, 31]}
                  interval={0}
                  dataKey="day"
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  dataKey="usage"
                  width={80}
                  tick={{ fill: "#737373" }}
                  dx={-5}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip />
                <Legend />
                <Line
                  strokeWidth={2}
                  yAxisId={0}
                  type="monotone"
                  dataKey="usage"
                  stroke="#8884d8"
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
        <Grid item xs={4}>
          <Paper className={fixedHeightPaper}>
            <Typography variant="h6">Daily Network Egress</Typography>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart
                data={data2}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  type="number"
                  dataKey="day"
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  dataKey="usage"
                  tick={{ fill: "#737373" }}
                  dx={-5}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip />
                <Legend />
                <Line
                  strokeWidth={2}
                  yAxisId={0}
                  type="monotone"
                  dataKey="usage"
                  stroke="#8884d8"
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
      </Grid>
    </Grid>
  );
}
