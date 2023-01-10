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

import React, { Fragment, useState } from "react";
import { useSelector } from "react-redux";
import Grid from "@mui/material/Grid";
import { Theme } from "@mui/material/styles";
import createStyles from "@mui/styles/createStyles";
import withStyles from "@mui/styles/withStyles";
import { Box, LinearProgress } from "@mui/material";
import {
  actionsTray,
  widgetContainerCommon,
} from "../../Common/FormComponents/common/styleLibrary";
import { IDashboardPanel } from "./types";
import { panelsConfiguration } from "./utils";
import { TabPanel } from "../../../shared/tabs";

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
import { Usage } from "../types";
import BasicDashboard from "../BasicDashboard/BasicDashboard";
import { SyncIcon } from "mds";
import { Button } from "mds";
import { ITabOption } from "../../Common/TabSelector/types";
import { getUsageAsync } from "../dashboardThunks";
import { reloadWidgets } from "../dashboardSlice";
import HelpBox from "../../../../common/HelpBox";
import { PrometheusErrorIcon } from "mds";

interface IPrDashboard {
  classes?: any;
  apiPrefix?: string;
  usage: Usage | null;
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

const PrDashboard = ({ apiPrefix = "admin", usage }: IPrDashboard) => {
  const dispatch = useAppDispatch();
  const zoomOpen = useSelector(
    (state: AppState) => state.dashboard.zoom.openZoom
  );
  const zoomWidget = useSelector(
    (state: AppState) => state.dashboard.zoom.widgetRender
  );

  const [timeStart, setTimeStart] = useState<any>(null);
  const [timeEnd, setTimeEnd] = useState<any>(null);
  const panelInformation = panelsConfiguration;
  const [curTab, setCurTab] = useState<number>(0);

  const getPanelDetails = (id: number) => {
    return panelInformation.find((panel) => panel.id === id);
  };

  const triggerLoad = () => {
    dispatch(reloadWidgets());
  };

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
                  loading={true}
                  apiPrefix={apiPrefix}
                />
              ) : (
                componentToUse(
                  panelInfo,
                  timeStart,
                  timeEnd,
                  true,
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

  let tabs: ITabOption[];
  if (usage?.advancedMetricsStatus !== "not configured") {
    tabs = [
      { label: "Usage" },
      { label: "Traffic" },
      { label: "Resources" },
      { label: "Info" },
    ];
  } else {
    tabs = [
      { label: "Info" },
      { label: "Usage", disabled: true },
      { label: "Traffic", disabled: true },
      { label: "Resources", disabled: true },
    ];
  }

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
          tabOptions={tabs}
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
          {curTab ===
          (usage?.advancedMetricsStatus === "not configured" ? 0 : 3) ? (
            <Grid container>
              <Grid item>
                <Box
                  sx={{
                    color: "#000",
                    fontSize: 18,
                    lineHeight: 2,
                    fontWeight: 700,
                    marginLeft: "21px",
                    display: "flex",
                  }}
                >
                  Server Information
                </Box>
              </Grid>
              <Grid item xs>
                <Grid container direction="row-reverse">
                  <Grid item>
                    <Button
                      id={"sync"}
                      type="button"
                      variant="callAction"
                      onClick={() => {
                        dispatch(getUsageAsync());
                      }}
                      icon={<SyncIcon />}
                      label={"Sync"}
                    />
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          ) : (
            <DateRangeSelector
              timeStart={timeStart}
              setTimeStart={setTimeStart}
              timeEnd={timeEnd}
              setTimeEnd={setTimeEnd}
              triggerSync={triggerLoad}
            />
          )}
        </Box>
        <TabPanel
          index={usage?.advancedMetricsStatus === "not configured" ? 3 : 0}
          value={curTab}
        >
          <RowPanelLayout>
            {usage?.advancedMetricsStatus === "unavailable" && (
              <HelpBox
                iconComponent={<PrometheusErrorIcon />}
                title={"We can’t retrieve advanced metrics at this time."}
                help={
                  <Box
                    sx={{
                      fontSize: "14px",
                    }}
                  >
                    It looks like Prometheus is not available or reachable at
                    the moment.
                  </Box>
                }
              />
            )}
            {panelInformation.length ? renderSummaryPanels() : null}
          </RowPanelLayout>
        </TabPanel>
        <TabPanel index={1} value={curTab}>
          <RowPanelLayout>
            {usage?.advancedMetricsStatus === "unavailable" && (
              <HelpBox
                iconComponent={<PrometheusErrorIcon />}
                title={"We can’t retrieve advanced metrics at this time."}
                help={
                  <Box
                    sx={{
                      fontSize: "14px",
                    }}
                  >
                    It looks like Prometheus is not available or reachable at
                    the moment.
                  </Box>
                }
              />
            )}
            {panelInformation.length ? renderTrafficPanels() : null}
          </RowPanelLayout>
        </TabPanel>
        <TabPanel index={2} value={curTab}>
          <RowPanelLayout>
            {usage?.advancedMetricsStatus === "unavailable" && (
              <HelpBox
                iconComponent={<PrometheusErrorIcon />}
                title={"We can’t retrieve advanced metrics at this time."}
                help={
                  <Box
                    sx={{
                      fontSize: "14px",
                    }}
                  >
                    It looks like Prometheus is not available or reachable at
                    the moment.
                  </Box>
                }
              />
            )}
            {panelInformation.length ? renderResourcesPanels() : null}
            <h2 style={{ margin: 0, borderBottom: "1px solid #dedede" }}>
              Advanced
            </h2>
            {panelInformation.length ? renderAdvancedResourcesPanels() : null}
          </RowPanelLayout>
        </TabPanel>
        <TabPanel
          index={usage?.advancedMetricsStatus === "not configured" ? 0 : 3}
          value={curTab}
        >
          {!usage && <LinearProgress />}
          {usage && <BasicDashboard usage={usage} />}
        </TabPanel>
      </Grid>
    </PageLayout>
  );
};

export default withStyles(styles)(PrDashboard);
