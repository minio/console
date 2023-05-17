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
import {
  AddIcon,
  Box,
  Button,
  DataTable,
  Grid,
  HelpBox,
  LambdaIcon,
  PageLayout,
  RefreshIcon,
} from "mds";
import { useNavigate } from "react-router-dom";
import { Theme } from "@mui/material/styles";
import createStyles from "@mui/styles/createStyles";
import withStyles from "@mui/styles/withStyles";
import { LinearProgress } from "@mui/material";
import { red } from "@mui/material/colors";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import {
  NotificationEndpointItem,
  NotificationEndpointsList,
  TransformedEndpointItem,
} from "./types";
import { getNotificationConfigKey, notificationTransform } from "./utils";

import {
  actionsTray,
  containerForHeader,
  searchField,
  settingsCommon,
  tableStyles,
} from "../Common/FormComponents/common/styleLibrary";
import { ErrorResponseHandler } from "../../../common/types";
import api from "../../../common/api";
import AButton from "../Common/AButton/AButton";
import SearchBox from "../Common/SearchBox";

import { IAM_PAGES } from "../../../common/SecureComponent/permissions";
import {
  setErrorSnackMessage,
  setServerNeedsRestart,
} from "../../../systemSlice";
import { AppState, useAppDispatch } from "../../../store";
import ConfirmDeleteDestinationModal from "./ConfirmDeleteDestinationModal";
import TooltipWrapper from "../Common/TooltipWrapper/TooltipWrapper";
import { useSelector } from "react-redux";
import { setDestinationLoading } from "./destinationsSlice";

interface IListNotificationEndpoints {
  classes: any;
}

const styles = (theme: Theme) =>
  createStyles({
    ...actionsTray,
    ...settingsCommon,
    ...containerForHeader,
    tableBlock: {
      ...tableStyles.tableBlock,
    },
    rightActionItems: {
      display: "flex",
      alignItems: "center",
      "& button": {
        whiteSpace: "nowrap",
      },
    },
    searchField: {
      ...searchField.searchField,
      maxWidth: 380,
    },
  });

const ListEventDestinations = ({ classes }: IListNotificationEndpoints) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  // Reducer States
  const isLoading = useSelector((state: AppState) => state.destination.loading);

  //Local States
  const [records, setRecords] = useState<TransformedEndpointItem[]>([]);
  const [filter, setFilter] = useState<string>("");

  const [isDelConfirmOpen, setIsDelConfirmOpen] = useState<boolean>(false);
  const [selNotifyEndPoint, setSelNotifyEndpoint] =
    useState<TransformedEndpointItem | null>();

  //Effects
  // load records on mount
  useEffect(() => {
    if (isLoading) {
      const fetchRecords = () => {
        api
          .invoke("GET", `/api/v1/admin/notification_endpoints`)
          .then((res: NotificationEndpointsList) => {
            let resNotEndList: NotificationEndpointItem[] = [];
            if (res.notification_endpoints !== null) {
              resNotEndList = res.notification_endpoints;
            }
            setRecords(notificationTransform(resNotEndList));
            dispatch(setDestinationLoading(false));
          })
          .catch((err: ErrorResponseHandler) => {
            dispatch(setErrorSnackMessage(err));
            dispatch(setDestinationLoading(false));
          });
      };
      fetchRecords();
    }
  }, [isLoading, dispatch]);

  useEffect(() => {
    dispatch(setDestinationLoading(true));
  }, [dispatch]);

  const resetNotificationConfig = (
    ep: TransformedEndpointItem | undefined | null
  ) => {
    if (ep?.name) {
      const configKey = getNotificationConfigKey(ep.name);
      let accountId = `:${ep.account_id}`;
      if (configKey) {
        api
          .invoke("POST", `/api/v1/configs/${configKey}${accountId}/reset`)
          .then((res) => {
            dispatch(setServerNeedsRestart(true));
            setSelNotifyEndpoint(null);
            setIsDelConfirmOpen(false);
            dispatch(setDestinationLoading(true));
          })
          .catch((err: ErrorResponseHandler) => {
            setIsDelConfirmOpen(false);
            dispatch(setErrorSnackMessage(err));
          });
      } else {
        setSelNotifyEndpoint(null);
        setIsDelConfirmOpen(false);
        console.log(`Unable to find Config key for ${ep.name}`);
      }
    }
  };

  const confirmDelNotifyEndpoint = (record: TransformedEndpointItem) => {
    setSelNotifyEndpoint(record);
    setIsDelConfirmOpen(true);
  };

  const tableActions = [{ type: "delete", onClick: confirmDelNotifyEndpoint }];

  const filteredRecords = records.filter((b: TransformedEndpointItem) => {
    if (filter === "") {
      return true;
    }
    return b.service_name.indexOf(filter) >= 0;
  });

  const statusDisplay = (status: string) => {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
        }}
      >
        <FiberManualRecordIcon
          style={status === "Offline" ? { color: red[500] } : {}}
        />
        {status}
      </div>
    );
  };

  return (
    <Fragment>
      <PageLayout>
        <Grid container sx={{ width: "100%" }}>
          <Grid item xs={12} className={classes.actionsTray}>
            <SearchBox
              placeholder="Search target"
              onChange={setFilter}
              overrideClass={classes.searchField}
              value={filter}
            />
            <div className={classes.rightActionItems}>
              <TooltipWrapper tooltip={"Refresh List"}>
                <Button
                  id={"reload-event-destinations"}
                  label={"Refresh"}
                  variant="regular"
                  icon={<RefreshIcon />}
                  onClick={() => {
                    dispatch(setDestinationLoading(true));
                  }}
                />
              </TooltipWrapper>
              <TooltipWrapper tooltip={"Add Event Destination"}>
                <Button
                  id={"add-notification-target"}
                  label={"Add Event Destination"}
                  variant="callAction"
                  icon={<AddIcon />}
                  onClick={() => {
                    navigate(IAM_PAGES.EVENT_DESTINATIONS_ADD);
                  }}
                />
              </TooltipWrapper>
            </div>
          </Grid>
          {isLoading && <LinearProgress />}
          {!isLoading && (
            <Fragment>
              {records.length > 0 && (
                <Fragment>
                  <Grid item xs={12} className={classes.tableBlock}>
                    <Box sx={{ width: "100%" }}>
                      <DataTable
                        itemActions={tableActions}
                        columns={[
                          {
                            label: "Status",
                            elementKey: "status",
                            renderFunction: statusDisplay,
                            width: 150,
                          },
                          { label: "Service", elementKey: "service_name" },
                        ]}
                        isLoading={isLoading}
                        records={filteredRecords}
                        entityName="Event Destinations"
                        idField="service_name"
                        customPaperHeight={"400px"}
                      />
                    </Box>
                  </Grid>
                  <Grid item xs={12} sx={{ marginTop: 15 }}>
                    <HelpBox
                      title={"Event Destinations"}
                      iconComponent={<LambdaIcon />}
                      help={
                        <Fragment>
                          MinIO bucket notifications allow administrators to
                          send notifications to supported external services on
                          certain object or bucket events. MinIO supports bucket
                          and object-level S3 events similar to the Amazon S3
                          Event Notifications.
                          <br />
                          <br />
                          You can learn more at our{" "}
                          <a
                            href="https://min.io/docs/minio/linux/administration/monitoring/bucket-notifications.html?ref=con"
                            target="_blank"
                            rel="noopener"
                          >
                            documentation
                          </a>
                          .
                        </Fragment>
                      }
                    />
                  </Grid>
                </Fragment>
              )}
              {records.length === 0 && (
                <Grid
                  container
                  sx={{
                    justifyContent: "center",
                    alignContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Grid item xs={8}>
                    <HelpBox
                      title={"Event Destinations"}
                      iconComponent={<LambdaIcon />}
                      help={
                        <Fragment>
                          MinIO bucket notifications allow administrators to
                          send notifications to supported external services on
                          certain object or bucket events. MinIO supports bucket
                          and object-level S3 events similar to the Amazon S3
                          Event Notifications.
                          <br />
                          <br />
                          To get started,{" "}
                          <AButton
                            onClick={() => {
                              navigate(IAM_PAGES.EVENT_DESTINATIONS_ADD);
                            }}
                          >
                            Add an Event Destination
                          </AButton>
                          .
                        </Fragment>
                      }
                    />
                  </Grid>
                </Grid>
              )}
            </Fragment>
          )}

          {isDelConfirmOpen ? (
            <ConfirmDeleteDestinationModal
              onConfirm={() => {
                resetNotificationConfig(selNotifyEndPoint);
              }}
              status={`${selNotifyEndPoint?.status}`}
              serviceName={`${selNotifyEndPoint?.service_name}`}
              onClose={() => {
                setIsDelConfirmOpen(false);
              }}
            />
          ) : null}
        </Grid>
      </PageLayout>
    </Fragment>
  );
};

export default withStyles(styles)(ListEventDestinations);
