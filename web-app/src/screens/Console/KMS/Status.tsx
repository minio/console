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
import {
  Box,
  breakPoints,
  DisabledIcon,
  EnabledIcon,
  Grid,
  PageLayout,
  SectionTitle,
  Tabs,
  ValuePair,
} from "mds";
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
import { hasPermission } from "../../../common/SecureComponent";
import {
  CONSOLE_UI_RESOURCE,
  IAM_SCOPES,
} from "../../../common/SecureComponent/permissions";
import { setErrorSnackMessage, setHelpName } from "../../../systemSlice";
import { useAppDispatch } from "../../../store";
import LabelWithIcon from "../Buckets/BucketDetails/SummaryItems/LabelWithIcon";
import PageHeaderWrapper from "../Common/PageHeaderWrapper/PageHeaderWrapper";
import HelpMenu from "../HelpMenu";
import { api } from "api";
import { KmsStatusResponse } from "api/consoleApi";
import { errorToHandler } from "api/errors";

const Status = () => {
  const dispatch = useAppDispatch();
  const [curTab, setCurTab] = useState<string>("simple-tab-0");

  const [isKMSSecretKey, setIsKMSSecretKey] = useState<boolean>(true);
  const [status, setStatus] = useState<KmsStatusResponse | null>(null);
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
  const displayMetrics =
    hasPermission(CONSOLE_UI_RESOURCE, [IAM_SCOPES.KMS_METRICS]) &&
    !isKMSSecretKey;
  const displayAPIs =
    hasPermission(CONSOLE_UI_RESOURCE, [IAM_SCOPES.KMS_APIS]) &&
    !isKMSSecretKey;
  const displayVersion =
    hasPermission(CONSOLE_UI_RESOURCE, [IAM_SCOPES.KMS_Version]) &&
    !isKMSSecretKey;

  useEffect(() => {
    const loadStatus = () => {
      api.kms
        .kmsStatus()
        .then((result) => {
          if (result.data) {
            setStatus(result.data);
            setIsKMSSecretKey(result.data.name === "SecretKey");
          }
        })
        .catch((err) => {
          dispatch(setErrorSnackMessage(errorToHandler(err.error)));
        })
        .finally(() => setLoadingStatus(false));
    };

    const loadMetrics = () => {
      api.kms
        .kmsMetrics()
        .then((result) => {
          if (result.data) {
            setMetrics(result.data);
          }
        })
        .catch((err) => {
          dispatch(setErrorSnackMessage(errorToHandler(err.error)));
        })
        .finally(() => setLoadingMetrics(false));
    };

    const loadAPIs = () => {
      api.kms
        .kmsapIs()
        .then((result: any) => {
          if (result.data) {
            setAPIs(result.data);
          }
        })
        .catch((err) => {
          dispatch(setErrorSnackMessage(errorToHandler(err.error)));
        })
        .finally(() => setLoadingAPIs(false));
    };

    const loadVersion = () => {
      api.kms
        .kmsVersion()
        .then((result: any) => {
          if (result.data) {
            setVersion(result.data);
          }
        })
        .catch((err) => {
          dispatch(setErrorSnackMessage(errorToHandler(err.error)));
        })
        .finally(() => setLoadingVersion(false));
    };

    if (displayStatus && loadingStatus) {
      loadStatus();
    }
    if (displayMetrics && loadingMetrics) {
      loadMetrics();
    }
    if (displayAPIs && loadingAPIs) {
      loadAPIs();
    }
    if (displayVersion && loadingVersion) {
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
        <Grid container>
          <Grid item xs={12}>
            <Box
              sx={{
                display: "grid",
                gap: 2,
                gridTemplateColumns: "2fr 1fr",
                gridAutoFlow: "row",
                [`@media (max-width: ${breakPoints.sm}px)`]: {
                  gridTemplateColumns: "1fr",
                  gridAutoFlow: "dense",
                },
              }}
            >
              <Box
                sx={{
                  display: "grid",
                  gap: 2,
                  gridTemplateColumns: "2fr 1fr",
                  gridAutoFlow: "row",
                  [`@media (max-width: ${breakPoints.sm}px)`]: {
                    gridTemplateColumns: "1fr",
                    gridAutoFlow: "dense",
                  },
                }}
              >
                <ValuePair label={"Name:"} value={status.name} />
                {version && (
                  <ValuePair label={"Version:"} value={version.version} />
                )}
                <ValuePair
                  label={"Default Key ID:"}
                  value={status.defaultKeyID}
                />
                <ValuePair
                  label={"Key Management Service Endpoints:"}
                  value={
                    <Fragment>
                      {status.endpoints &&
                        status.endpoints.map((e: any, i: number) => (
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
        <Grid container>
          <Grid item xs={12}>
            <ValuePair
              label={""}
              value={
                <Box
                  sx={{
                    display: "grid",
                    gap: 2,
                    gridTemplateColumns: "2fr 1fr",
                    gridAutoFlow: "row",
                    [`@media (max-width: ${breakPoints.sm}px)`]: {
                      gridTemplateColumns: "1fr",
                      gridAutoFlow: "dense",
                    },
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
          currentTabOrPath={curTab}
          onTabClick={(newValue) => setCurTab(newValue)}
          options={[
            {
              tabConfig: { label: "Status", id: "simple-tab-0" },
              content: (
                <Box
                  withBorders
                  sx={{
                    display: "flex",
                    flexFlow: "column",
                    padding: "43px",
                  }}
                >
                  {statusPanel}
                </Box>
              ),
            },
            {
              tabConfig: {
                label: "APIs",
                id: "simple-tab-1",
                disabled: !displayAPIs,
              },
              content: (
                <Box
                  withBorders
                  sx={{
                    display: "flex",
                    flexFlow: "column",
                    padding: "43px",
                  }}
                >
                  {apisPanel}
                </Box>
              ),
            },
            {
              tabConfig: {
                label: "Metrics",
                id: "simple-tab-2",
                disabled: !displayMetrics,
              },
              content: (
                <Box
                  withBorders
                  sx={{
                    display: "flex",
                    flexFlow: "column",
                    padding: "43px",
                  }}
                >
                  {metricsPanel}
                </Box>
              ),
            },
          ]}
        />
      </PageLayout>
    </Fragment>
  );
};

export default Status;
