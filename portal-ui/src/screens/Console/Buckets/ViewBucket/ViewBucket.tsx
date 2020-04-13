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

import React from "react";
import { createStyles, Theme, withStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import api from "../../../../common/api";
import { BucketEvent, BucketEventList, BucketInfo } from "../types";
import {
  Button,
  IconButton,
  LinearProgress,
  TableFooter,
  TablePagination
} from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import DeleteIcon from "@material-ui/icons/Delete";
import SetAccessPolicy from "./SetAccessPolicy";
import { MinTablePaginationActions } from "../../../../common/MinTablePaginationActions";
import { CreateIcon } from "../../../../icons";
import AddEvent from "./AddEvent";
import DeleteEvent from "./DeleteEvent";

const styles = (theme: Theme) =>
  createStyles({
    seeMore: {
      marginTop: theme.spacing(3)
    },
    paper: {
      display: "flex",
      overflow: "auto",
      flexDirection: "column"
    },

    addSideBar: {
      width: "320px",
      padding: "20px"
    },
    errorBlock: {
      color: "red"
    },
    tableToolbar: {
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(0)
    },
    minTableHeader: {
      color: "#393939",
      "& tr": {
        "& th": {
          fontWeight: "bold"
        }
      }
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
    noRecords: {
      lineHeight: "24px",
      textAlign: "center",
      padding: "20px"
    }
  });

interface IViewBucketProps {
  classes: any;
  match: any;
}

interface IViewBucketState {
  info: BucketInfo | null;
  records: BucketEvent[];
  totalRecords: number;
  loading: boolean;
  error: string;
  deleteError: string;
  setAccessPolicyScreenOpen: boolean;
  page: number;
  rowsPerPage: number;
  addScreenOpen: boolean;
  deleteOpen: boolean;
  selectedBucket: string;
  selectedEvent: BucketEvent | null;
}

class ViewBucket extends React.Component<IViewBucketProps, IViewBucketState> {
  state: IViewBucketState = {
    info: null,
    records: [],
    totalRecords: 0,
    loading: false,
    error: "",
    deleteError: "",
    setAccessPolicyScreenOpen: false,
    page: 0,
    rowsPerPage: 10,
    addScreenOpen: false,
    deleteOpen: false,
    selectedBucket: "",
    selectedEvent: null
  };

  fetchEvents() {
    this.setState({ loading: true }, () => {
      const { page } = this.state;
      const { match } = this.props;
      const bucketName = match.params["bucketName"];
      api
        .invoke("GET", `/api/v1/buckets/${bucketName}/events`)
        .then((res: BucketEventList) => {
          this.setState({
            loading: false,
            records: res.events,
            totalRecords: res.total,
            error: ""
          });
          // if we get 0 results, and page > 0 , go down 1 page
          if (
            (res.events === undefined ||
              res.events == null ||
              res.events.length === 0) &&
            page > 0
          ) {
            const newPage = page - 1;
            this.setState({ page: newPage }, () => {
              this.fetchEvents();
            });
          }
        })
        .catch((err: any) => {
          this.setState({ loading: false, error: err });
        });
    });
  }

  closeAddModalAndRefresh() {
    this.setState({ setAccessPolicyScreenOpen: false }, () => {
      this.loadInfo();
    });
  }

  closeDeleteModalAndRefresh(refresh: boolean) {
    this.setState({ deleteOpen: false }, () => {
      if (refresh) {
        this.fetchEvents();
      }
    });
  }

  loadInfo() {
    const { match } = this.props;
    const bucketName = match.params["bucketName"];
    api
      .invoke("GET", `/api/v1/buckets/${bucketName}`)
      .then((res: BucketInfo) => {
        this.setState({ info: res });
      })
      .catch(err => {});
  }

  componentDidMount(): void {
    this.loadInfo();
    this.fetchEvents();
  }

  bucketFilter(): void {}

  render() {
    const { classes, match } = this.props;
    const {
      info,
      records,
      totalRecords,
      setAccessPolicyScreenOpen,
      loading,
      page,
      rowsPerPage,
      deleteOpen,
      addScreenOpen,
      selectedEvent
    } = this.state;

    const offset = page * rowsPerPage;

    const bucketName = match.params["bucketName"];

    const handleChangePage = (event: unknown, newPage: number) => {
      this.setState({ page: newPage });
    };

    const handleChangeRowsPerPage = (
      event: React.ChangeEvent<HTMLInputElement>
    ) => {
      const rPP = parseInt(event.target.value, 10);
      this.setState({ page: 0, rowsPerPage: rPP });
    };

    const confirmDeleteEvent = (evnt: BucketEvent) => {
      this.setState({ deleteOpen: true, selectedEvent: evnt });
    };

    let accessPolicy = "n/a";
    if (info !== null) {
      accessPolicy = info.access;
    }

    return (
      <React.Fragment>
        <AddEvent
          open={addScreenOpen}
          selectedBucket={bucketName}
          closeModalAndRefresh={() => {
            this.setState({ addScreenOpen: false });
            this.fetchEvents();
          }}
        />
        <SetAccessPolicy
          bucketName={bucketName}
          open={setAccessPolicyScreenOpen}
          closeModalAndRefresh={() => {
            this.closeAddModalAndRefresh();
          }}
        />
        <Grid container>
          <Grid item xs={12}>
            <Typography variant="h6">
              Bucket > {match.params["bucketName"]}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <br />
          </Grid>
          <Grid item xs={12}>
            Access Policy: {accessPolicy}
            {"   "}
            <Button
              variant="contained"
              size="small"
              color="primary"
              onClick={() => {
                this.setState({
                  setAccessPolicyScreenOpen: true
                });
              }}
            >
              Change Access Policy
            </Button>
            <br />
            Reported Usage: 0 bytes
            <br />
          </Grid>
          <Grid item xs={12}>
            <br />
          </Grid>
          <Grid item xs={6}>
            <Typography variant="h6">Events</Typography>
          </Grid>
          <Grid item xs={6} className={classes.actionsTray}>
            <Button
              variant="contained"
              color="primary"
              size="small"
              startIcon={<CreateIcon />}
              onClick={() => {
                this.setState({
                  addScreenOpen: true
                });
              }}
            >
              Subcribe to Event
            </Button>
          </Grid>
          <Grid item xs={12}>
            <br />
          </Grid>
          <Grid item xs={12}>
            <Paper className={classes.paper}>
              {loading && <LinearProgress />}
              {records != null && records.length > 0 ? (
                <Table size="medium">
                  <TableHead className={classes.minTableHeader}>
                    <TableRow>
                      <TableCell>SQS</TableCell>
                      <TableCell>Events</TableCell>
                      <TableCell>Prefix</TableCell>
                      <TableCell>Suffix</TableCell>
                      <TableCell align="right">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {records
                      .slice(offset, offset + rowsPerPage)
                      .map((row, index) => (
                        <TableRow
                          key={`bucket-evt-${row.id}-${index.toString()}`}
                        >
                          <TableCell>{row.arn}</TableCell>
                          <TableCell>{row.events.join(", ")}</TableCell>
                          <TableCell>{row.prefix}</TableCell>
                          <TableCell>{row.suffix}</TableCell>
                          <TableCell align="right">
                            <IconButton
                              aria-label="delete"
                              onClick={() => {
                                confirmDeleteEvent(row);
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
                        onChangePage={handleChangePage}
                        onChangeRowsPerPage={handleChangeRowsPerPage}
                        ActionsComponent={MinTablePaginationActions}
                      />
                    </TableRow>
                  </TableFooter>
                </Table>
              ) : (
                <div className={classes.noRecords}>No Events</div>
              )}
            </Paper>
          </Grid>
        </Grid>

        <DeleteEvent
          deleteOpen={deleteOpen}
          selectedBucket={bucketName}
          bucketEvent={selectedEvent}
          closeDeleteModalAndRefresh={(refresh: boolean) => {
            this.closeDeleteModalAndRefresh(refresh);
          }}
        />
      </React.Fragment>
    );
  }
}

export default withStyles(styles)(ViewBucket);
