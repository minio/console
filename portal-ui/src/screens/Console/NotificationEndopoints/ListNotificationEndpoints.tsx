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
import {
  Button,
  IconButton,
  LinearProgress,
  TableFooter,
  TablePagination,
  TextField
} from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import InputAdornment from "@material-ui/core/InputAdornment";
import SearchIcon from "@material-ui/icons/Search";
import { CreateIcon } from "../../../icons";
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import TableBody from "@material-ui/core/TableBody";
import { Link } from "react-router-dom";
import ViewIcon from "@material-ui/icons/Visibility";
import DeleteIcon from "@material-ui/icons/Delete";
import { MinTablePaginationActions } from "../../../common/MinTablePaginationActions";
import { NotificationEndpointItem, NotificationEndpointsList } from "./types";
import api from "../../../common/api";
import FiberManualRecordIcon from "@material-ui/icons/FiberManualRecord";
import { red } from "@material-ui/core/colors";
import AddNotificationEndpoint from "./AddNotificationEndpoint";

interface IListNotificationEndpoints {
  classes: any;
}

const styles = (theme: Theme) =>
  createStyles({
    errorBlock: {
      color: "red"
    },
    strongText: {
      fontWeight: 700
    },
    keyName: {
      marginLeft: 5
    },
    actionsTray: {
      textAlign: "right",
      "& button": {
        marginLeft: 10
      }
    },
    searchField: {
      background: "#FFFFFF",
      padding: 12,
      borderRadius: 5,
      boxShadow: "0px 3px 6px #00000012"
    },
    iconText: {
      lineHeight: "24px"
    }
  });

const ListNotificationEndpoints = ({ classes }: IListNotificationEndpoints) => {
  //Local States
  const [records, setRecords] = useState<NotificationEndpointItem[]>([]);
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
            setRecords(resNotEndList);
            setTotalRecords(resNotEndList.length);
            setError("");
            setIsLoading(false);
          })
          .catch(err => {
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
      <Grid container>
        <Grid item xs={12}>
          <Typography variant="h6">Lambda Notification Targets</Typography>
        </Grid>
        <Grid item xs={12}>
          <br />
        </Grid>
        {error !== "" && <Grid container>{error}</Grid>}
        <Grid item xs={12} className={classes.actionsTray}>
          <TextField
            placeholder="Filter"
            className={classes.searchField}
            id="search-resource"
            label=""
            onChange={event => {
              setFilter(event.target.value);
            }}
            InputProps={{
              disableUnderline: true,
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              )
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
          <Paper className={classes.paper}>
            {isLoading && <LinearProgress />}
            {records != null && records.length > 0 ? (
              <Table size="medium">
                <TableHead className={classes.minTableHeader}>
                  <TableRow>
                    <TableCell>Service</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {records
                    .filter((b: NotificationEndpointItem) => {
                      if (filter === "") {
                        return true;
                      } else {
                        if (b.service.indexOf(filter) >= 0) {
                          return true;
                        } else {
                          return false;
                        }
                      }
                    })
                    .map(row => (
                      <TableRow key={`${row.service}:${row.account_id}`}>
                        <TableCell>{`${row.service}:${row.account_id}`}</TableCell>
                        {/*<TableCell>{row.account_id}</TableCell>*/}
                        <TableCell className={classes.iconText}>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center"
                            }}
                          >
                            <FiberManualRecordIcon
                              style={
                                row.status === "Offline"
                                  ? { color: red[500] }
                                  : {}
                              }
                            />
                            {row.status}
                          </div>
                        </TableCell>
                        <TableCell align="right">
                          <Link
                            to={`/notification-endpoints/${row.service}:${row.account_id}`}
                          >
                            <IconButton aria-label="delete">
                              <ViewIcon />
                            </IconButton>
                          </Link>
                          <IconButton
                            aria-label="delete"
                            onClick={() => {
                              //confirmDeleteBucket(row.name);
                            }}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
                <TableFooter>
                  <TableRow>
                    <TablePagination
                      rowsPerPageOptions={[5, 10, 25]}
                      colSpan={3}
                      count={totalRecords}
                      rowsPerPage={rowsPerPage}
                      page={page}
                      SelectProps={{
                        inputProps: { "aria-label": "rows per page" },
                        native: true
                      }}
                      onChangePage={(event: unknown, newPage: number) => {
                        setPage(newPage);
                      }}
                      onChangeRowsPerPage={(
                        event: React.ChangeEvent<HTMLInputElement>
                      ) => {
                        const rPP = parseInt(event.target.value, 10);
                        setRowsPerPage(rPP);
                      }}
                      ActionsComponent={MinTablePaginationActions}
                    />
                  </TableRow>
                </TableFooter>
              </Table>
            ) : (
              <div>No Notification Endpoints</div>
            )}
          </Paper>
        </Grid>
      </Grid>
    </React.Fragment>
  );
};

export default withStyles(styles)(ListNotificationEndpoints);
