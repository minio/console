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
import { useSelector } from "react-redux";
import Grid from "@mui/material/Grid";
import { Theme } from "@mui/material/styles";
import createStyles from "@mui/styles/createStyles";
import withStyles from "@mui/styles/withStyles";
import { Box } from "@mui/material";
import {
  actionsTray,
  widgetContainerCommon,
} from "../../Common/FormComponents/common/styleLibrary";
import { IDashboardPanel } from "./types";
import { getWidgetsWithValue, panelsConfiguration } from "./utils";
import { TabPanel } from "../../../shared/tabs";
import { ErrorResponseHandler } from "../../../../common/types";
import api from "../../../../common/api";

import TabSelector from "../../Common/TabSelector/TabSelector";
import { componentToUse } from "./widgetUtils";
import ZoomWidget from "./ZoomWidget";
import { AppState, useAppDispatch } from "../../../../store";
import DateRangeSelector from "../../Common/FormComponents/DateRangeSelector/DateRangeSelector";
import {
  DLayoutColumnProps,
  DLayoutRowProps,
  resourcesPanelsLayout,
  resourcesPanelsLayoutAdvanced,
  RowPanelLayout,
  summaryPanelsLayout,
  trafficPanelsLayout,
} from "./Widgets/LayoutUtil";
import MergedWidgetsRenderer from "./Widgets/MergedWidgetsRenderer";
import PageLayout from "../../Common/Layout/PageLayout";
import { setErrorSnackMessage } from "../../../../systemSlice";

interface IPrDashboard {
  classes?: any;
  apiPrefix?: string;
}

const styles = (theme: Theme) =>
  createStyles({
    ...actionsTray,
    ...widgetContainerCommon,
    dashboardRow: {
      display: "flex",
      flexDirection: "row",
      justifyContent: "flex-start",
      flexWrap: "wrap",
    },
  });

const PrDashboard = ({ apiPrefix = "admin" }: IPrDashboard) => {
  const dispatch = useAppDispatch();
  const zoomOpen = useSelector(
    (state: AppState) => state.dashboard.zoom.openZoom
  );
  const zoomWidget = useSelector(
    (state: AppState) => state.dashboard.zoom.widgetRender
  );

  const [timeStart, setTimeStart] = useState<any>(null);
  const [timeEnd, setTimeEnd] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [panelInformation, setPanelInformation] =
    useState<IDashboardPanel[]>(panelsConfiguration);
  const [curTab, setCurTab] = useState<number>(0);

  const getPanelDetails = (id: number) => {
    return panelInformation.find((panel) => panel.id === id);
  };

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
          dispatch(
            setErrorSnackMessage({
              errorMessage:
                "Widget information could not be retrieved at this time. Please try again",
              detailedError: "",
            })
          );
        }

        setLoading(false);
      })
      .catch((err: ErrorResponseHandler) => {
        dispatch(setErrorSnackMessage(err));
        setLoading(false);
      });
  }, [timeStart, timeEnd, dispatch, apiPrefix]);

  const triggerLoad = () => {
    setLoading(true);
  };

  useEffect(() => {
    if (loading) {
      fetchUsage();
    }
  }, [loading, fetchUsage]);

  const renderCmpByConfig = (
    panelInfo: IDashboardPanel | undefined,
    key: string
  ) => {
    return (
      <Fragment key={`widget-${key}`}>
        {panelInfo ? (
          <Fragment>
            <Box>
              {panelInfo.mergedPanels ? (
                <MergedWidgetsRenderer
                  info={panelInfo}
                  timeStart={timeStart}
                  timeEnd={timeEnd}
                  loading={loading}
                  apiPrefix={apiPrefix}
                />
              ) : (
                componentToUse(
                  panelInfo,
                  timeStart,
                  timeEnd,
                  loading,
                  apiPrefix,
                  zoomOpen
                )
              )}
            </Box>
          </Fragment>
        ) : null}
      </Fragment>
    );
  };

  const renderPanelItems = (layoutRows: DLayoutRowProps[]) => {
    return layoutRows.reduce((prev: any[], rowItem, rIdx) => {
      const { columns = [] } = rowItem;
      const cellItems: any[] = columns.map(
        (cellItem: DLayoutColumnProps, colIdx: number) => {
          const panelInfo = getPanelDetails(cellItem.componentId);
          return renderCmpByConfig(panelInfo, `${rIdx}-${colIdx}`);
        }
      );
      const rowConfig = (
        <Box sx={rowItem.sx} key={`layout-row-${rIdx}`}>
          {cellItems}
        </Box>
      );
      return [...prev, rowConfig];
    }, []);
  };

  const renderSummaryPanels = () => {
    return renderPanelItems(summaryPanelsLayout);
  };

  const renderTrafficPanels = () => {
    return renderPanelItems(trafficPanelsLayout);
  };

  const renderResourcesPanels = () => {
    return renderPanelItems(resourcesPanelsLayout);
  };

  const renderAdvancedResourcesPanels = () => {
    return renderPanelItems(resourcesPanelsLayoutAdvanced);
  };

  return (
    <PageLayout>
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
      <Grid
        item
        xs={12}
        sx={{
          paddingTop: "20px",
        }}
      >
        <Box
          sx={{
            marginBottom: "20px",
          }}
        >
          <DateRangeSelector
            timeStart={timeStart}
            setTimeStart={setTimeStart}
            timeEnd={timeEnd}
            setTimeEnd={setTimeEnd}
            triggerSync={triggerLoad}
          />
        </Box>
        <TabPanel index={0} value={curTab}>
          <RowPanelLayout>
            {panelInformation.length ? renderSummaryPanels() : null}
          </RowPanelLayout>
        </TabPanel>
        <TabPanel index={1} value={curTab}>
          <RowPanelLayout>
            {panelInformation.length ? renderTrafficPanels() : null}
          </RowPanelLayout>
        </TabPanel>
        <TabPanel index={2} value={curTab}>
          <RowPanelLayout>
            {panelInformation.length ? renderResourcesPanels() : null}
            <h2 style={{ margin: 0, borderBottom: "1px solid #dedede" }}>
              Advanced
            </h2>
            {panelInformation.length ? renderAdvancedResourcesPanels() : null}
          </RowPanelLayout>
        </TabPanel>
      </Grid>
    </PageLayout>
  );
};

export default withStyles(styles)(PrDashboard);
