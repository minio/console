// This file is part of MinIO Console Server
// Copyright (c) 2020 MinIO, Inc.
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

import React, { useEffect, useState, Fragment } from "react";
import { createStyles, Theme, withStyles } from "@material-ui/core/styles";
import { TextField } from "@material-ui/core";
import { red } from "@material-ui/core/colors";
import Grid from "@material-ui/core/Grid";
import FiberManualRecordIcon from "@material-ui/icons/FiberManualRecord";
import Button from "@material-ui/core/Button";
import InputAdornment from "@material-ui/core/InputAdornment";
import SearchIcon from "@material-ui/icons/Search";
import {
  NotificationEndpointItem,
  NotificationEndpointsList,
  TransformedEndpointItem,
} from "./types";
import { notificationTransform } from "./utils";
import { CreateIcon } from "../../../../icons";
import api from "../../../../common/api";

import TableWrapper from "../../Common/TableWrapper/TableWrapper";
import AddNotificationEndpoint from "./AddNotificationEndpoint";
import {
  actionsTray,
  containerForHeader,
  searchField,
  settingsCommon,
} from "../../Common/FormComponents/common/styleLibrary";
import SlideOptions from "../../Common/SlideOptions/SlideOptions";
import BackSettingsIcon from "../../../../icons/BackSettingsIcon";
import NotificationTypeSelector from "./NotificationTypeSelector";

interface IListNotificationEndpoints {
  classes: any;
}

const styles = (theme: Theme) =>
  createStyles({
    ...actionsTray,
    ...searchField,
    ...settingsCommon,
    ...containerForHeader(theme.spacing(4)),
    errorBlock: {
      color: "red",
    },
    strongText: {
      fontWeight: 700,
    },
    keyName: {
      marginLeft: 5,
    },
    iconText: {
      lineHeight: "24px",
    },
    customConfigurationPage: {
      height: "calc(100vh - 410px)",
      scrollbarWidth: "none" as const,
      "&::-webkit-scrollbar": {
        display: "none",
      },
    },
    lambdaContainer: {
      padding: "15px 0",
    },
    actionsTray: {
      ...actionsTray.actionsTray,
      padding: "0 38px",
    },
  });

const ListNotificationEndpoints = ({ classes }: IListNotificationEndpoints) => {
  //Local States
  const [records, setRecords] = useState<TransformedEndpointItem[]>([]);
  const [filter, setFilter] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [currentPanel, setCurrentPanel] = useState<number>(0);
  const [service, setService] = useState<string>("");

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
            setError("");
            setIsLoading(false);
          })
          .catch((err) => {
            setError(err);
            setIsLoading(false);
          });
      };
      fetchRecords();
    }
  }, [isLoading]);

  useEffect(() => {
    setIsLoading(true);
  }, []);

  const tableActions = [
    {
      type: "delete",
      onClick: (row: any) => {
        //confirmDeleteBucket(row.name);
      },
    },
  ];

  const filteredRecords = records.filter((b: TransformedEndpointItem) => {
    if (filter === "") {
      return true;
    } else {
      if (b.service_name.indexOf(filter) >= 0) {
        return true;
      } else {
        return false;
      }
    }
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

  const openNewLambdaSelector = () => {
    setCurrentPanel(1);
  };

  const backClick = () => {
    setService("");
    setCurrentPanel(currentPanel - 1);
  };

  const saveAndRefresh = () => {
    setIsLoading(true);
    setCurrentPanel(0);
    setService("");
  };

  return (
    <Fragment>
      <Grid container>
        <Grid item xs={12}>
          <Grid item xs={12}>
            <div className={classes.settingsOptionsContainer}>
              <SlideOptions
                slideOptions={[
                  <Fragment>
                    <Grid item xs={12} className={classes.customTitle}>
                      Lambda Notification Targets
                    </Grid>

                    <Grid item xs={12} className={classes.lambdaContainer}>
                      {error !== "" && <Grid container>{error}</Grid>}
                      <Grid item xs={12} className={classes.actionsTray}>
                        <TextField
                          placeholder="Filter"
                          className={classes.searchField}
                          id="search-resource"
                          label=""
                          onChange={(event) => {
                            setFilter(event.target.value);
                          }}
                          InputProps={{
                            disableUnderline: true,
                            startAdornment: (
                              <InputAdornment position="start">
                                <SearchIcon />
                              </InputAdornment>
                            ),
                          }}
                        />
                        <Button
                          variant="contained"
                          color="primary"
                          startIcon={<CreateIcon />}
                          onClick={openNewLambdaSelector}
                        >
                          Add Notification Target
                        </Button>
                      </Grid>
                      <Grid item xs={12}>
                        <br />
                      </Grid>
                      <Grid item xs={12}>
                        <TableWrapper
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
                          entityName="Notification Endpoints"
                          idField="service_name"
                          customPaperHeight={classes.customConfigurationPage}
                          noBackground
                        />
                      </Grid>
                    </Grid>
                  </Fragment>,
                  <Fragment>
                    <Grid item xs={12} className={classes.backContainer}>
                      <button
                        onClick={backClick}
                        className={classes.backButton}
                      >
                        <BackSettingsIcon />
                        Back To Lambda Notifications
                      </button>
                    </Grid>
                    <Grid item xs={12}>
                      <NotificationTypeSelector
                        setService={(serviceName: string) => {
                          setService(serviceName);
                          setCurrentPanel(2);
                        }}
                      />
                    </Grid>
                  </Fragment>,
                  <Fragment>
                    <Grid item xs={12} className={classes.backContainer}>
                      <button
                        onClick={backClick}
                        className={classes.backButton}
                      >
                        <BackSettingsIcon />
                        Back To Supported Services
                      </button>
                    </Grid>
                    <Grid item xs={12}>
                      <AddNotificationEndpoint
                        service={service}
                        saveAndRefresh={saveAndRefresh}
                      />
                    </Grid>
                  </Fragment>,
                ]}
                currentSlide={currentPanel}
              />
            </div>
          </Grid>
        </Grid>
      </Grid>
    </Fragment>
  );
};

export default withStyles(styles)(ListNotificationEndpoints);
