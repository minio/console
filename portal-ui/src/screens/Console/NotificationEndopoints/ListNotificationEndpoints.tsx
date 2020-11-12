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

import React, { useEffect, useState } from "react";
import { createStyles, Theme, withStyles } from "@material-ui/core/styles";
import { TextField } from "@material-ui/core";
import { red } from "@material-ui/core/colors";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import InputAdornment from "@material-ui/core/InputAdornment";
import SearchIcon from "@material-ui/icons/Search";
import { MinTablePaginationActions } from "../../../common/MinTablePaginationActions";
import {
  NotificationEndpointItem,
  NotificationEndpointsList,
  TransformedEndpointItem,
} from "./types";
import { notificationTransform } from "./utils";
import { CreateIcon } from "../../../icons";
import api from "../../../common/api";
import FiberManualRecordIcon from "@material-ui/icons/FiberManualRecord";
import TableWrapper from "../Common/TableWrapper/TableWrapper";
import AddNotificationEndpoint from "./AddNotificationEndpoint";
import {
  actionsTray,
  containerForHeader,
  searchField,
} from "../Common/FormComponents/common/styleLibrary";
import PageHeader from "../Common/PageHeader/PageHeader";

interface IListNotificationEndpoints {
  classes: any;
}

const styles = (theme: Theme) =>
  createStyles({
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
    ...actionsTray,
    ...searchField,
    ...containerForHeader(theme.spacing(4)),
  });

const ListNotificationEndpoints = ({ classes }: IListNotificationEndpoints) => {
  //Local States
  const [records, setRecords] = useState<TransformedEndpointItem[]>([]);
  const [totalRecords, setTotalRecords] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [page, setPage] = useState<number>(0);
  const [filter, setFilter] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [addScreenOpen, setAddScreenOpen] = useState<boolean>(false);

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
            setTotalRecords(resNotEndList.length);
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
    { type: "view", to: "/notification-endpoints", sendOnlyId: true },
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

  return (
    <React.Fragment>
      {addScreenOpen && (
        <AddNotificationEndpoint
          open={addScreenOpen}
          closeModalAndRefresh={() => {
            setIsLoading(true);
            setAddScreenOpen(false);
          }}
        />
      )}
      <PageHeader label="Lambda Notification Targets" />
      <Grid container>
        <Grid item xs={12} className={classes.container}>
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
              onClick={() => {
                setAddScreenOpen(true);
              }}
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
                { label: "Service", elementKey: "service_name" },
                {
                  label: "Status",
                  elementKey: "status",
                  renderFunction: statusDisplay,
                },
              ]}
              isLoading={isLoading}
              records={filteredRecords}
              entityName="Notification Endpoints"
              idField="service_name"
            />
          </Grid>
        </Grid>
      </Grid>
    </React.Fragment>
  );
};

export default withStyles(styles)(ListNotificationEndpoints);
