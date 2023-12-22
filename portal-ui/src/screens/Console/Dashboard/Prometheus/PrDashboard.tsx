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
import {
  Box,
  Button,
  Grid,
  HelpBox,
  PageLayout,
  ProgressBar,
  PrometheusErrorIcon,
  SyncIcon,
  TabItemProps,
  Tabs,
} from "mds";
import { IDashboardPanel } from "./types";
import { panelsConfiguration } from "./utils";
import { componentToUse } from "./widgetUtils";
import { useAppDispatch, useAppSelector } from "../../../../store";
import {
  DLayoutColumnProps,
  DLayoutRowProps,
  resourcesPanelsLayout,
  resourcesPanelsLayoutAdvanced,
  RowPanelLayout,
  summaryPanelsLayout,
  trafficPanelsLayout,
} from "./Widgets/LayoutUtil";
import { getUsageAsync } from "../dashboardThunks";
import { reloadWidgets } from "../dashboardSlice";
import { selFeatures } from "../../consoleSlice";
import { AdminInfoResponse } from "api/consoleApi";
import ZoomWidget from "./ZoomWidget";
import DateRangeSelector from "../../Common/FormComponents/DateRangeSelector/DateRangeSelector";
import MergedWidgetsRenderer from "./Widgets/MergedWidgetsRenderer";
import BasicDashboard from "../BasicDashboard/BasicDashboard";

interface IPrDashboard {
  apiPrefix?: string;
  usage: AdminInfoResponse | null;
}

const PrDashboard = ({ apiPrefix = "admin", usage }: IPrDashboard) => {
  const dispatch = useAppDispatch();
  const status = useAppSelector((state) => state.dashboard.status);
  const zoomOpen = useAppSelector((state) => state.dashboard.zoom.openZoom);
  const zoomWidget = useAppSelector(
    (state) => state.dashboard.zoom.widgetRender,
  );
  const features = useAppSelector(selFeatures);
  const obOnly = !!features?.includes("object-browser-only");
  let hideMenu = false;
  if (features?.includes("hide-menu")) {
    hideMenu = true;
  } else if (obOnly) {
    hideMenu = true;
  }

  const [timeStart, setTimeStart] = useState<any>(null);
  const [timeEnd, setTimeEnd] = useState<any>(null);
  const panelInformation = panelsConfiguration;
  const [curTab, setCurTab] = useState<string>("info");

  const getPanelDetails = (id: number) => {
    return panelInformation.find((panel) => panel.id === id);
  };

  const triggerLoad = () => {
    dispatch(reloadWidgets());
  };

  const renderCmpByConfig = (
    panelInfo: IDashboardPanel | undefined,
    key: string,
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
                  zoomOpen,
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
        },
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

  const prometheusOptionsDisabled =
    usage?.advancedMetricsStatus === "not configured";

  const searchBox = (
    <Box sx={{ marginBottom: 20 }}>
      {curTab === "info" ? (
        <Grid container>
          <Grid item>
            <Box
              sx={{
                fontSize: 18,
                lineHeight: 2,
                fontWeight: 700,
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
                  disabled={status === "loading"}
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
  );

  const infoTab: TabItemProps = {
    tabConfig: { label: "Info", id: "info", disabled: false },
    content: (
      <Fragment>
        {(!usage || status === "loading") && <ProgressBar />}
        {usage && status === "idle" && (
          <Fragment>
            {searchBox}
            <BasicDashboard usage={usage} />
          </Fragment>
        )}
      </Fragment>
    ),
  };

  const prometheusTabs: TabItemProps[] = [
    {
      tabConfig: {
        label: "Usage",
        id: "usage",
        disabled: prometheusOptionsDisabled,
      },
      content: (
        <Fragment>
          {searchBox}
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
        </Fragment>
      ),
    },
    {
      tabConfig: {
        label: "Traffic",
        id: "traffic",
        disabled: prometheusOptionsDisabled,
      },
      content: (
        <Fragment>
          {searchBox}
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
        </Fragment>
      ),
    },
    {
      tabConfig: {
        label: "Resources",
        id: "resources",
        disabled: prometheusOptionsDisabled,
      },
      content: (
        <Fragment>
          {searchBox}
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
        </Fragment>
      ),
    },
  ];

  let tabsOptions: TabItemProps[] = [infoTab, ...prometheusTabs];

  return (
    <PageLayout
      sx={{
        padding: hideMenu ? 0 : "2rem",
      }}
    >
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

      <Tabs
        horizontal
        options={tabsOptions}
        currentTabOrPath={curTab}
        onTabClick={(newValue) => {
          setCurTab(newValue);
        }}
      />
    </PageLayout>
  );
};

export default PrDashboard;
