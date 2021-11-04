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
import Grid from "@mui/material/Grid";

import { Theme } from "@mui/material/styles";
import createStyles from "@mui/styles/createStyles";
import withStyles from "@mui/styles/withStyles";
import { GridSize, useMediaQuery } from "@mui/material";
import {
  actionsTray,
  widgetContainerCommon,
} from "../../Common/FormComponents/common/styleLibrary";
import { IDashboardPanel } from "./types";
import { getWidgetsWithValue, panelsConfiguration } from "./utils";
import { TabPanel } from "../../../shared/tabs";
import { ErrorResponseHandler } from "../../../../common/types";
import { setErrorSnackMessage } from "../../../../actions";
import api from "../../../../common/api";

import TabSelector from "../../Common/TabSelector/TabSelector";
import MergedWidgets from "./MergedWidgets";
import { componentToUse } from "./widgetUtils";
import ZoomWidget from "./ZoomWidget";
import { AppState } from "../../../../store";
import DateRangeSelector from "../../Common/FormComponents/DateRangeSelector/DateRangeSelector";
import { useTheme } from "@mui/styles";

interface IPrDashboard {
  classes: any;
  displayErrorMessage: typeof setErrorSnackMessage;
  apiPrefix?: string;
  zoomOpen: boolean;
  zoomWidget: null | IDashboardPanel;
}

const styles = (theme: Theme) =>
  createStyles({
    ...actionsTray,
    ...widgetContainerCommon,
    syncButton: {
      "&.MuiButton-root .MuiButton-iconSizeMedium > *:first-of-type": {
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
  zoomOpen,
  zoomWidget,
}: IPrDashboard) => {
  const [timeStart, setTimeStart] = useState<any>(null);
  const [timeEnd, setTimeEnd] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [panelInformation, setPanelInformation] =
    useState<IDashboardPanel[]>(panelsConfiguration);
  const [curTab, setCurTab] = useState<number>(0);

  const theme = useTheme();
  const biggerThanMd = useMediaQuery(theme.breakpoints.up("md"));

  const panels = useCallback(
    (tabName: string, filterPanels?: number[][] | null) => {
      return filterPanels?.map((panelLine, indexLine) => {
        const totalPanelsContained = panelLine.length;

        let perc = Math.floor(12 / totalPanelsContained);

        if (!biggerThanMd && totalPanelsContained >= 4) {
          perc = 6;
        } else if (!biggerThanMd && totalPanelsContained >= 3) {
          perc = 12;
        }

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
                  xs={12}
                  sm={perc as GridSize}
                  md={perc as GridSize}
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
                                timeStart,
                                timeEnd,
                                loading,
                                apiPrefix
                              )}
                              rightComponent={componentToUse(
                                panelInfo.mergedPanels[1],
                                timeStart,
                                timeEnd,
                                loading,
                                apiPrefix
                              )}
                            />
                          </Fragment>
                        ) : (
                          componentToUse(
                            panelInfo,
                            timeStart,
                            timeEnd,
                            loading,
                            apiPrefix
                          )
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
      biggerThanMd,
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
    [80, 81, 1],
    [68, 52],
    [63, 70],
  ];

  if (biggerThanMd) {
    summaryPanels.splice(1, 0, [50, 502]);
  } else {
    summaryPanels.splice(1, 0, [50]);
    summaryPanels.splice(1, 0, [502]);
  }

  const resourcesPanels = [
    [76, 77],
    [11, 8],
    [82, 74],
  ];
  const requestsPanels = [[60], [71, 17], [73]];

  return (
    <Fragment>
      {zoomOpen && (
        <ZoomWidget
          modalOpen={zoomOpen}
          timeStart={timeStart}
          timeEnd={timeEnd}
          widgetRender={0}
          value={zoomWidget}
          apiPrefix={apiPrefix}
        />
      )}
      <DateRangeSelector
        timeStart={timeStart}
        setTimeStart={setTimeStart}
        timeEnd={timeEnd}
        setTimeEnd={setTimeEnd}
        triggerSync={triggerLoad}
      />
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

const mapState = (state: AppState) => ({
  zoomOpen: state.dashboard.zoom.openZoom,
  zoomWidget: state.dashboard.zoom.widgetRender,
});

const connector = connect(mapState, {
  displayErrorMessage: setErrorSnackMessage,
});

export default withStyles(styles)(connector(PrDashboard));
