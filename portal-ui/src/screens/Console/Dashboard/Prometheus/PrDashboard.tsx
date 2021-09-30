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

import React, { Fragment, useCallback, useEffect, useState } from "react";
import { connect } from "react-redux";
import Grid from "@material-ui/core/Grid";
import ScheduleIcon from "@material-ui/icons/Schedule";
import WatchLaterIcon from "@material-ui/icons/WatchLater";
import { createStyles, Theme, withStyles } from "@material-ui/core/styles";
import { Button, GridSize } from "@material-ui/core";
import {
  actionsTray,
  widgetContainerCommon,
} from "../../Common/FormComponents/common/styleLibrary";
import { IDashboardPanel, widgetType } from "./types";
import { getWidgetsWithValue, panelsConfiguration } from "./utils";
import { TabPanel } from "../../../shared/tabs";
import { ErrorResponseHandler } from "../../../../common/types";
import { setErrorSnackMessage } from "../../../../actions";
import SingleValueWidget from "./Widgets/SingleValueWidget";
import LinearGraphWidget from "./Widgets/LinearGraphWidget";
import BarChartWidget from "./Widgets/BarChartWidget";
import PieChartWidget from "./Widgets/PieChartWidget";
import SingleRepWidget from "./Widgets/SingleRepWidget";
import DateTimePickerWrapper from "../../Common/FormComponents/DateTimePickerWrapper/DateTimePickerWrapper";
import api from "../../../../common/api";
import SyncIcon from "../../../../icons/SyncIcon";
import TabSelector from "../../Common/TabSelector/TabSelector";
import SimpleWidget from "./Widgets/SimpleWidget";
import MergedWidgets from "./MergedWidgets";

interface IPrDashboard {
  classes: any;
  displayErrorMessage: typeof setErrorSnackMessage;
  apiPrefix?: string;
}

const styles = (theme: Theme) =>
  createStyles({
    ...actionsTray,
    ...widgetContainerCommon,
    syncButton: {
      "&.MuiButton-root .MuiButton-iconSizeMedium > *:first-child": {
        fontSize: 18,
      },
    },
    actionsTray: {
      ...actionsTray.actionsTray,
      padding: "0 10px",
    },
    dashboardRow: {
      display: "flex",
      flexDirection: "row",
      justifyContent: "flex-start",
      flexWrap: "wrap",
      maxWidth: 1180,
    },
    schedulerIcon: {
      opacity: 0.4,
      fontSize: 10,
      "& svg": {
        width: 18,
        height: 18,
      },
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

  const panels = useCallback(
    (tabName: string, filterPanels?: number[][] | null) => {
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
          case widgetType.simpleWidget:
            return (
              <SimpleWidget
                title={value.title}
                panelItem={value}
                timeStart={timeStart}
                timeEnd={timeEnd}
                propLoading={loading}
                apiPrefix={apiPrefix}
                iconWidget={value.widgetIcon}
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
          case widgetType.areaGraph:
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
                apiPrefix={apiPrefix}
                areaWidget={value.type === widgetType.areaGraph}
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

      return filterPanels?.map((panelLine, indexLine) => {
        const totalPanelsContained = panelLine.length;

        let perc = Math.floor(12 / totalPanelsContained);

        if (perc < 1) {
          perc = 1;
        } else if (perc > 12) {
          perc = 12;
        }

        return (
          <Grid
            item
            xs={12}
            key={`line-${tabName}-${indexLine}`}
            className={classes.dashboardRow}
          >
            {panelLine.map((panelInline, indexPanel) => {
              const panelInfo = panelInformation.find(
                (panel) => panel.id === panelInline
              );

              return (
                <Grid
                  key={`widget-${panelInline}-${indexPanel}`}
                  className={classes.widgetPanelDelimiter}
                  item
                  xs={7}
                  sm={8}
                  md={6}
                  lg={perc as GridSize}
                >
                  <Grid item xs={12}>
                    {panelInfo ? (
                      <Fragment>
                        {panelInfo.mergedPanels ? (
                          <Fragment>
                            <MergedWidgets
                              title={panelInfo.title}
                              leftComponent={componentToUse(
                                panelInfo.mergedPanels[0],
                                0
                              )}
                              rightComponent={componentToUse(
                                panelInfo.mergedPanels[1],
                                1
                              )}
                            />
                          </Fragment>
                        ) : (
                          componentToUse(panelInfo, indexPanel)
                        )}
                      </Fragment>
                    ) : null}
                  </Grid>
                </Grid>
              );
            })}
          </Grid>
        );
      });
    },
    [
      timeStart,
      timeEnd,
      loading,
      apiPrefix,
      classes.dashboardRow,
      classes.widgetPanelDelimiter,
      panelInformation,
    ]
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
          displayErrorMessage({
            errorMessage:
              "Widget information could not be retrieved at this time. Please try again",
            detailedError: "",
          });
        }

        setLoading(false);
      })
      .catch((err: ErrorResponseHandler) => {
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

  const summaryPanels = [
    [66, 44, 500, 501],
    [50, 502],
    [80, 81, 1],
    [68, 52],
    [63, 70],
  ];
  const resourcesPanels = [
    [76, 77],
    [11, 8],
    [82, 74],
  ];
  const requestsPanels = [[60], [71, 17], [73]];

  return (
    <Fragment>
      <Grid
        item
        xs={12}
        className={`${classes.actionsTray} ${classes.timeContainers}`}
      >
        <span className={classes.filterTitle}>Filter:</span>
        <span className={`${classes.filterTitle} ${classes.schedulerIcon}`}>
          <ScheduleIcon />
        </span>
        <span className={classes.label}>Start Time:</span>
        <DateTimePickerWrapper
          value={timeStart}
          onChange={setTimeStart}
          forSearchBlock
          id="stTime"
          noInputIcon
        />
        <span className={`${classes.filterTitle} ${classes.schedulerIcon}`}>
          <WatchLaterIcon />
        </span>
        <span className={classes.label}>End Time:</span>
        <DateTimePickerWrapper
          value={timeEnd}
          onChange={setTimeEnd}
          forSearchBlock
          id="endTime"
          noInputIcon
        />
        <Button
          type="button"
          variant="contained"
          color="primary"
          onClick={triggerLoad}
          endIcon={<SyncIcon />}
          className={classes.syncButton}
        >
          Sync
        </Button>
      </Grid>
      <Grid item xs={12}>
        <TabSelector
          selectedTab={curTab}
          onChange={(newValue: number) => {
            setCurTab(newValue);
          }}
          tabOptions={[
            { label: "Usage" },
            { label: "Traffic" },
            { label: "Resources" },
          ]}
        />
      </Grid>
      <Grid item xs={12} className={classes.widgetsContainer}>
        <TabPanel index={0} value={curTab}>
          {panels("Summary", summaryPanels)}
        </TabPanel>
        <TabPanel index={1} value={curTab}>
          {panels("Traffic", requestsPanels)}
        </TabPanel>
        <TabPanel index={2} value={curTab}>
          {panels("Resources", resourcesPanels)}
        </TabPanel>
      </Grid>
    </Fragment>
  );
};
/*
<
*/

const connector = connect(null, {
  displayErrorMessage: setErrorSnackMessage,
});

export default withStyles(styles)(connector(PrDashboard));
