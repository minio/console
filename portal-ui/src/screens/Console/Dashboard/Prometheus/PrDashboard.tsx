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
import { connect } from "react-redux";
import ReactGridLayout from "react-grid-layout";
import Grid from "@material-ui/core/Grid";
import { createStyles, Theme, withStyles } from "@material-ui/core/styles";
import { Button } from "@material-ui/core";
import {
  actionsTray,
  containerForHeader,
} from "../../Common/FormComponents/common/styleLibrary";

import { AutoSizer } from "react-virtualized";
import { IDashboardPanel, widgetType } from "./types";
import {
  getDashboardDistribution,
  getWidgetsWithValue,
  panelsConfiguration,
  saveDashboardDistribution,
} from "./utils";

import { setErrorSnackMessage } from "../../../../actions";
import SingleValueWidget from "./Widgets/SingleValueWidget";
import LinearGraphWidget from "./Widgets/LinearGraphWidget";
import BarChartWidget from "./Widgets/BarChartWidget";
import PieChartWidget from "./Widgets/PieChartWidget";
import SingleRepWidget from "./Widgets/SingleRepWidget";
import DateTimePickerWrapper from "../../Common/FormComponents/DateTimePickerWrapper/DateTimePickerWrapper";
import api from "../../../../common/api";
import SyncIcon from "../../../../icons/SyncIcon";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import { TabPanel } from "../../../shared/tabs";

interface IPrDashboard {
  classes: any;
  displayErrorMessage: typeof setErrorSnackMessage;
  apiPrefix?: string;
}

const styles = (theme: Theme) =>
  createStyles({
    ...actionsTray,
    ...containerForHeader(theme.spacing(4)),
    widgetsContainer: {
      height: "calc(100vh - 250px)",
      paddingBottom: 235,
    },
    syncButton: {
      "&.MuiButton-root .MuiButton-iconSizeMedium > *:first-child": {
        fontSize: 18,
      },
    },
    actionsTray: {
      ...actionsTray.actionsTray,
      padding: "0 10px",
    },
  });

const PrDashboard = ({
  classes,
  displayErrorMessage,
  apiPrefix = "admin",
}: IPrDashboard) => {
  const [timeStart, setTimeStart] = useState<any>(null);
  const [timeEnd, setTimeEnd] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [panelInformation, setPanelInformation] =
    useState<IDashboardPanel[]>(panelsConfiguration);
  const [curTab, setCurTab] = useState<number>(0);

  const minHeight = 600;
  const colsInGrid = 8;
  const xSpacing = 10;
  const ySpacing = 10;

  const dashboardDistr = getDashboardDistribution(panelInformation.length);

  const autoSizerStyleProp = {
    width: "100%",
    height: "auto",
    paddingBottom: 45,
  };

  const panels = useCallback(
    (width: number, filterPanels?: number[] | null) => {
      const singlePanelWidth = width / colsInGrid + xSpacing / 2;

      const componentToUse = (value: IDashboardPanel, index: number) => {
        switch (value.type) {
          case widgetType.singleValue:
            return (
              <SingleValueWidget
                title={value.title}
                panelItem={value}
                timeStart={timeStart}
                timeEnd={timeEnd}
                propLoading={loading}
                apiPrefix={apiPrefix}
              />
            );
          case widgetType.pieChart:
            return (
              <PieChartWidget
                title={value.title}
                panelItem={value}
                timeStart={timeStart}
                timeEnd={timeEnd}
                propLoading={loading}
                apiPrefix={apiPrefix}
              />
            );
          case widgetType.linearGraph:
            return (
              <LinearGraphWidget
                title={value.title}
                panelItem={value}
                timeStart={timeStart}
                timeEnd={timeEnd}
                propLoading={loading}
                hideYAxis={value.disableYAxis}
                xAxisFormatter={value.xAxisFormatter}
                yAxisFormatter={value.yAxisFormatter}
                panelWidth={
                  dashboardDistr[index]
                    ? singlePanelWidth * dashboardDistr[index].w
                    : singlePanelWidth
                }
                apiPrefix={apiPrefix}
              />
            );
          case widgetType.barChart:
            return (
              <BarChartWidget
                title={value.title}
                panelItem={value}
                timeStart={timeStart}
                timeEnd={timeEnd}
                propLoading={loading}
                apiPrefix={apiPrefix}
              />
            );
          case widgetType.singleRep:
            const fillColor = value.fillColor ? value.fillColor : value.color;
            return (
              <SingleRepWidget
                title={value.title}
                panelItem={value}
                timeStart={timeStart}
                timeEnd={timeEnd}
                propLoading={loading}
                color={value.color as string}
                fillColor={fillColor as string}
                apiPrefix={apiPrefix}
              />
            );
          default:
            return null;
        }
      };

      return panelInformation
        .filter((val) => {
          if (filterPanels) {
            return filterPanels.indexOf(val.id) > -1;
          } else {
            return true;
          }
        })
        .map((val, index) => {
          return (
            <div key={val.layoutIdentifier}>{componentToUse(val, index)}</div>
          );
        });
    },
    [panelInformation, dashboardDistr, timeEnd, timeStart, loading, apiPrefix]
  );

  const fetchUsage = useCallback(() => {
    let stepCalc = 0;

    if (timeStart !== null && timeEnd !== null) {
      const secondsInPeriod = timeEnd.unix() - timeStart.unix();
      const periods = Math.floor(secondsInPeriod / 60);

      stepCalc = periods < 1 ? 15 : periods;
    }

    api
      .invoke(
        "GET",
        `/api/v1/${apiPrefix}/info?step=${stepCalc}&${
          timeStart !== null ? `&start=${timeStart.unix()}` : ""
        }${timeStart !== null && timeEnd !== null ? "&" : ""}${
          timeEnd !== null ? `end=${timeEnd.unix()}` : ""
        }`
      )
      .then((res: any) => {
        if (res.widgets) {
          const widgetsWithValue = getWidgetsWithValue(res.widgets);
          setPanelInformation(widgetsWithValue);
        } else {
          displayErrorMessage(
            "Widget information could not be retrieved at this time. Please try again"
          );
        }

        setLoading(false);
      })
      .catch((err) => {
        displayErrorMessage(err);
        setLoading(false);
      });
  }, [timeStart, timeEnd, displayErrorMessage, apiPrefix]);

  const triggerLoad = () => {
    setLoading(true);
  };

  useEffect(() => {
    if (loading) {
      fetchUsage();
    }
  }, [loading, fetchUsage]);

  const a11yProps = (index: any) => {
    return {
      id: `simple-tab-${index}`,
      "aria-controls": `simple-tabpanel-${index}`,
    };
  };

  const summaryPanels = [
    1, 64, 65, 68, 52, 44, 61, 80, 81, 66, 62, 53, 63, 50, 69, 70, 9, 78,
  ];
  const resourcesPanels = [76, 77, 11, 8, 82, 74];
  const requestsPanels = [60, 71, 17, 73];

  return (
    <React.Fragment>
      <Grid
        item
        xs={12}
        className={`${classes.actionsTray} ${classes.timeContainers}`}
      >
        <span className={classes.label}>Start Time</span>
        <DateTimePickerWrapper
          value={timeStart}
          onChange={setTimeStart}
          forSearchBlock
          id="stTime"
        />
        <span className={classes.label}>End Time</span>
        <DateTimePickerWrapper
          value={timeEnd}
          onChange={setTimeEnd}
          forSearchBlock
          id="endTime"
        />
        <Button
          type="button"
          variant="contained"
          color="primary"
          onClick={triggerLoad}
          startIcon={<SyncIcon />}
          className={classes.syncButton}
        >
          Sync
        </Button>
      </Grid>
      <Grid item xs={12}>
        <Tabs
          indicatorColor="primary"
          textColor="primary"
          aria-label="cluster-tabs"
          variant="scrollable"
          scrollButtons="auto"
          value={curTab}
          onChange={(e: React.ChangeEvent<{}>, newValue: number) => {
            console.log(newValue);
            setCurTab(newValue);
          }}
        >
          <Tab label="Summary" {...a11yProps(0)} />
          <Tab label="Traffic" {...a11yProps(1)} />
          <Tab label="Resources" {...a11yProps(2)} />
        </Tabs>
      </Grid>
      <Grid item xs={12} className={classes.widgetsContainer}>
        <TabPanel index={0} value={curTab}>
          <AutoSizer style={autoSizerStyleProp}>
            {({ width, height }: any) => {
              let hpanel = height < minHeight ? minHeight : height;
              if (hpanel > 380) {
                hpanel = 480;
              }
              const totalWidth = width > 1920 ? 1920 : width;
              return (
                <ReactGridLayout
                  width={totalWidth}
                  cols={colsInGrid}
                  containerPadding={[xSpacing, ySpacing]}
                  onLayoutChange={saveDashboardDistribution}
                  layout={dashboardDistr}
                  rowHeight={hpanel / 6}
                  style={{ margin: "0 auto", width: totalWidth }}
                >
                  {panels(width, summaryPanels)}
                </ReactGridLayout>
              );
            }}
          </AutoSizer>
        </TabPanel>
        <TabPanel index={1} value={curTab}>
          <AutoSizer style={autoSizerStyleProp}>
            {({ width, height }: any) => {
              let hpanel = height < minHeight ? minHeight : height;
              if (hpanel > 380) {
                hpanel = 480;
              }
              const totalWidth = width > 1920 ? 1920 : width;
              return (
                <ReactGridLayout
                  width={totalWidth}
                  cols={colsInGrid}
                  containerPadding={[xSpacing, ySpacing]}
                  onLayoutChange={saveDashboardDistribution}
                  layout={dashboardDistr}
                  rowHeight={hpanel / 6}
                  style={{ margin: "0 auto", width: totalWidth }}
                >
                  {panels(width, requestsPanels)}
                </ReactGridLayout>
              );
            }}
          </AutoSizer>
        </TabPanel>
        <TabPanel index={2} value={curTab}>
          <AutoSizer style={autoSizerStyleProp}>
            {({ width, height }: any) => {
              let hpanel = height < minHeight ? minHeight : height;
              if (hpanel > 380) {
                hpanel = 480;
              }
              const totalWidth = width > 1920 ? 1920 : width;
              return (
                <ReactGridLayout
                  width={totalWidth}
                  cols={colsInGrid}
                  containerPadding={[xSpacing, ySpacing]}
                  onLayoutChange={saveDashboardDistribution}
                  layout={dashboardDistr}
                  rowHeight={hpanel / 6}
                  style={{ margin: "0 auto", width: totalWidth }}
                >
                  {panels(width, resourcesPanels)}
                </ReactGridLayout>
              );
            }}
          </AutoSizer>
        </TabPanel>
      </Grid>
    </React.Fragment>
  );
};

const connector = connect(null, {
  displayErrorMessage: setErrorSnackMessage,
});

export default withStyles(styles)(connector(PrDashboard));
