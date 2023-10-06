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

import React, { Fragment, useEffect, useState } from "react";
import { Box, Grid } from "@mui/material";
import { SectionTitle } from "mds";
import api from "../../../common/api";

import { ErrorResponseHandler } from "../../../common/types";
import { hasPermission } from "../../../common/SecureComponent";
import {
  CONSOLE_UI_RESOURCE,
  IAM_SCOPES,
} from "../../../common/SecureComponent/permissions";

import { setErrorSnackMessage, setHelpName } from "../../../systemSlice";
import { useAppDispatch } from "../../../store";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { TabPanel } from "../../shared/tabs";

import LabelValuePair from "../Common/UsageBarWrapper/LabelValuePair";
import LabelWithIcon from "../Buckets/BucketDetails/SummaryItems/LabelWithIcon";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { DisabledIcon, EnabledIcon, PageLayout } from "mds";
import PageHeaderWrapper from "../Common/PageHeaderWrapper/PageHeaderWrapper";

import HelpMenu from "../HelpMenu";

const Status = () => {
  const dispatch = useAppDispatch();
  const [curTab, setCurTab] = useState<number>(0);

  const [status, setStatus] = useState<any | null>(null);
  const [loadingStatus, setLoadingStatus] = useState<boolean>(true);
  const [metrics, setMetrics] = useState<any | null>(null);
  const [loadingMetrics, setLoadingMetrics] = useState<boolean>(true);
  const [apis, setAPIs] = useState<any | null>(null);
  const [loadingAPIs, setLoadingAPIs] = useState<boolean>(true);
  const [version, setVersion] = useState<any | null>(null);
  const [loadingVersion, setLoadingVersion] = useState<boolean>(true);

  const displayStatus = hasPermission(CONSOLE_UI_RESOURCE, [
    IAM_SCOPES.KMS_STATUS,
  ]);
  const displayMetrics = hasPermission(CONSOLE_UI_RESOURCE, [
    IAM_SCOPES.KMS_METRICS,
  ]);
  const displayAPIs = hasPermission(CONSOLE_UI_RESOURCE, [IAM_SCOPES.KMS_APIS]);
  const displayVersion = hasPermission(CONSOLE_UI_RESOURCE, [
    IAM_SCOPES.KMS_Version,
  ]);

  useEffect(() => {
    setLoadingStatus(true);
  }, []);

  useEffect(() => {
    const loadMetrics = () => {
      if (displayMetrics) {
        api
          .invoke("GET", `/api/v1/kms/metrics`)
          .then((result: any) => {
            if (result) {
              setMetrics(result);
            }
            setLoadingMetrics(false);
          })
          .catch((err: ErrorResponseHandler) => {
            dispatch(setErrorSnackMessage(err));
            setLoadingMetrics(false);
          });
      } else {
        setLoadingMetrics(false);
      }
    };

    const loadAPIs = () => {
      if (displayAPIs) {
        api
          .invoke("GET", `/api/v1/kms/apis`)
          .then((result: any) => {
            if (result) {
              setAPIs(result);
            }
            setLoadingAPIs(false);
          })
          .catch((err: ErrorResponseHandler) => {
            dispatch(setErrorSnackMessage(err));
            setLoadingAPIs(false);
          });
      } else {
        setLoadingAPIs(false);
      }
    };

    const loadVersion = () => {
      if (displayVersion) {
        api
          .invoke("GET", `/api/v1/kms/version`)
          .then((result: any) => {
            if (result) {
              setVersion(result);
            }
            setLoadingVersion(false);
          })
          .catch((err: ErrorResponseHandler) => {
            dispatch(setErrorSnackMessage(err));
            setLoadingVersion(false);
          });
      } else {
        setLoadingVersion(false);
      }
    };

    const loadStatus = () => {
      if (displayStatus) {
        api
          .invoke("GET", `/api/v1/kms/status`)
          .then((result: any) => {
            if (result) {
              setStatus(result);
            }
            setLoadingStatus(false);
          })
          .catch((err: ErrorResponseHandler) => {
            dispatch(setErrorSnackMessage(err));
            setLoadingStatus(false);
          });
      } else {
        setLoadingStatus(false);
      }
    };

    if (loadingStatus) {
      loadStatus();
    }
    if (loadingMetrics) {
      loadMetrics();
    }
    if (loadingAPIs) {
      loadAPIs();
    }
    if (loadingVersion) {
      loadVersion();
    }
  }, [
    dispatch,
    displayStatus,
    loadingStatus,
    displayMetrics,
    loadingMetrics,
    displayAPIs,
    loadingAPIs,
    displayVersion,
    loadingVersion,
  ]);

  const statusPanel = (
    <Fragment>
      <SectionTitle>Status</SectionTitle>
      <br />
      {status && (
        <Grid container spacing={1}>
          <Grid item xs={12}>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", sm: "2fr 1fr" },
                gridAutoFlow: { xs: "dense", sm: "row" },
                gap: 2,
              }}
            >
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: { xs: "1fr", sm: "2fr 1fr" },
                  gridAutoFlow: { xs: "dense", sm: "row" },
                  gap: 2,
                }}
              >
                <LabelValuePair label={"Name:"} value={status.name} />
                {version && (
                  <LabelValuePair label={"Version:"} value={version.version} />
                )}
                <LabelValuePair
                  label={"Default Key ID:"}
                  value={status.defaultKeyID}
                />
                <LabelValuePair
                  label={"Key Management Service Endpoints:"}
                  value={
                    <Fragment>
                      {status.endpoints.map((e: any, i: number) => (
                        <LabelWithIcon
                          key={i}
                          icon={
                            e.status === "online" ? (
                              <EnabledIcon />
                            ) : (
                              <DisabledIcon />
                            )
                          }
                          label={e.url}
                        />
                      ))}
                    </Fragment>
                  }
                />
              </Box>
            </Box>
          </Grid>
        </Grid>
      )}
    </Fragment>
  );

  const apisPanel = (
    <Fragment>
      <SectionTitle>Supported API endpoints</SectionTitle>
      <br />
      {apis && (
        <Grid container spacing={1}>
          <Grid item xs={12}>
            <LabelValuePair
              label={""}
              value={
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: { xs: "1fr", sm: "2fr 1fr" },
                    gridAutoFlow: { xs: "dense", sm: "row" },
                    gap: 2,
                  }}
                >
                  {apis.results.map((e: any, i: number) => (
                    <LabelWithIcon
                      key={i}
                      icon={<EnabledIcon />}
                      label={`${e.path} - ${e.method}`}
                    />
                  ))}
                </Box>
              }
            />
          </Grid>
        </Grid>
      )}
    </Fragment>
  );

  const getAPIRequestsData = () => {
    return [
      { label: "Success", success: metrics.requestOK },
      { label: "Failures", failures: metrics.requestFail },
      { label: "Errors", errors: metrics.requestErr },
      { label: "Active", active: metrics.requestActive },
    ];
  };

  const getEventsData = () => {
    return [
      { label: "Audit", audit: metrics.auditEvents },
      { label: "Errors", errors: metrics.errorEvents },
    ];
  };

  const getHistogramData = () => {
    return metrics.latencyHistogram.map((h: any) => {
      return {
        ...h,
        duration: `${h.duration / 1000000}ms`,
      };
    });
  };

  const metricsPanel = (
    <Fragment>
      {metrics && (
        <Fragment>
          <h3>API Requests</h3>
          <BarChart width={730} height={250} data={getAPIRequestsData()}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="label" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="success" fill="green" />
            <Bar dataKey="failures" fill="red" />
            <Bar dataKey="errors" fill="black" />
            <Bar dataKey="active" fill="#8884d8" />
          </BarChart>

          <h3>Events</h3>
          <BarChart width={730} height={250} data={getEventsData()}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="label" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="audit" fill="green" />
            <Bar dataKey="errors" fill="black" />
          </BarChart>
          <h3>Latency Histogram</h3>
          {metrics.latencyHistogram && (
            <LineChart
              width={730}
              height={250}
              data={getHistogramData()}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="duration" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="total"
                stroke="#8884d8"
                name={"Requests that took T ms or less"}
              />
            </LineChart>
          )}
        </Fragment>
      )}
    </Fragment>
  );

  useEffect(() => {
    dispatch(setHelpName("kms_status"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Fragment>
      <PageHeaderWrapper
        label="Key Management Service"
        actions={<HelpMenu />}
      />

      <PageLayout>
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
          <Tab
            label="Status"
            id="simple-tab-0"
            aria-controls="simple-tabpanel-0"
          />
          <Tab
            label="APIs"
            id="simple-tab-1"
            aria-controls="simple-tabpanel-1"
          />
          <Tab
            label="Metrics"
            id="simple-tab-2"
            aria-controls="simple-tabpanel-2"
            onClick={() => {}}
          />
        </Tabs>

        <TabPanel index={0} value={curTab}>
          <Box
            sx={{
              border: "1px solid #eaeaea",
              borderRadius: "2px",
              display: "flex",
              flexFlow: "column",
              padding: "43px",
            }}
          >
            {statusPanel}
          </Box>
        </TabPanel>
        <TabPanel index={1} value={curTab}>
          <Box
            sx={{
              border: "1px solid #eaeaea",
              borderRadius: "2px",
              display: "flex",
              flexFlow: "column",
              padding: "43px",
            }}
          >
            {apisPanel}
          </Box>
        </TabPanel>
        <TabPanel index={2} value={curTab}>
          <Box
            sx={{
              border: "1px solid #eaeaea",
              borderRadius: "2px",
              display: "flex",
              flexFlow: "column",
              padding: "43px",
            }}
          >
            {metricsPanel}
          </Box>
        </TabPanel>
      </PageLayout>
    </Fragment>
  );
};

export default Status;
