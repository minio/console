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
import get from "lodash/get";
import { createStyles, Theme, withStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import CircularProgress from "@material-ui/core/CircularProgress";
import api from "../../../../common/api";
import { BucketEvent, BucketEventList, BucketInfo, BucketList } from "../types";
import { Button } from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import SetAccessPolicy from "./SetAccessPolicy";
import { MinTablePaginationActions } from "../../../../common/MinTablePaginationActions";
import { CreateIcon } from "../../../../icons";
import AddEvent from "./AddEvent";
import DeleteEvent from "./DeleteEvent";
import TableWrapper from "../../Common/TableWrapper/TableWrapper";
import { niceBytes } from "../../../../common/utils";

const styles = (theme: Theme) =>
  createStyles({
    seeMore: {
      marginTop: theme.spacing(3),
    },
    paper: {
      display: "flex",
      overflow: "auto",
      flexDirection: "column",
    },

    addSideBar: {
      width: "320px",
      padding: "20px",
    },
    errorBlock: {
      color: "red",
    },
    tableToolbar: {
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(0),
    },
    minTableHeader: {
      color: "#393939",
      "& tr": {
        "& th": {
          fontWeight: "bold",
        },
      },
    },
    actionsTray: {
      textAlign: "right",
      "& button": {
        marginLeft: 10,
      },
    },
    searchField: {
      background: "#FFFFFF",
      padding: 12,
      borderRadius: 5,
      boxShadow: "0px 3px 6px #00000012",
    },
    noRecords: {
      lineHeight: "24px",
      textAlign: "center",
      padding: "20px",
    },
    gridContainer: {
      display: "grid",
      gridTemplateColumns: "auto auto",
      gridGap: 8,
      justifyContent: "flex-start",
      alignItems: "center",
      "& div:not(.MuiCircularProgress-root)": {
        display: "flex",
        alignItems: "center",
      },
      "& div:nth-child(odd)": {
        justifyContent: "flex-end",
        fontWeight: 700,
      },
      "& div:nth-child(2n)": {
        minWidth: 150,
      },
    },
    masterActions: {
      width: "25%",
      minWidth: "120px",
      "& div": {
        margin: "5px 0px",
      },
    },
    paperContainer: {
      padding: 15,
      paddingLeft: 23,
    },
    headerContainer: {
      display: "flex",
      justifyContent: "space-between",
    },
    capitalizeFirst: {
      textTransform: "capitalize",
    },
  });

interface IViewBucketProps {
  classes: any;
  match: any;
}

interface IViewBucketState {
  info: BucketInfo | null;
  records: BucketEvent[];
  totalRecords: number;
  loadingBucket: boolean;
  loadingEvents: boolean;
  loadingSize: boolean;
  error: string;
  deleteError: string;
  errBucket: string;
  setAccessPolicyScreenOpen: boolean;
  page: number;
  rowsPerPage: number;
  addScreenOpen: boolean;
  deleteOpen: boolean;
  selectedBucket: string;
  selectedEvent: BucketEvent | null;
  bucketSize: string;
  errorSize: string;
}

class ViewBucket extends React.Component<IViewBucketProps, IViewBucketState> {
  state: IViewBucketState = {
    info: null,
    records: [],
    totalRecords: 0,
    loadingBucket: true,
    loadingEvents: true,
    loadingSize: true,
    error: "",
    deleteError: "",
    errBucket: "",
    setAccessPolicyScreenOpen: false,
    page: 0,
    rowsPerPage: 10,
    addScreenOpen: false,
    deleteOpen: false,
    selectedBucket: "",
    selectedEvent: null,
    bucketSize: "0",
    errorSize: "",
  };

  fetchEvents() {
    this.setState({ loadingBucket: true }, () => {
      const { page } = this.state;
      const { match } = this.props;
      const bucketName = match.params["bucketName"];
      api
        .invoke("GET", `/api/v1/buckets/${bucketName}/events`)
        .then((res: BucketEventList) => {
          const events = get(res, "events", []);
          const total = get(res, "total", 0);

          this.setState({
            loadingEvents: false,
            records: events || [],
            totalRecords: total,
            error: "",
          });
          // if we get 0 results, and page > 0 , go down 1 page
          if ((!events || res.events.length === 0) && page > 0) {
            const newPage = page - 1;
            this.setState({ page: newPage }, () => {
              this.fetchEvents();
            });
          }
        })
        .catch((err: any) => {
          this.setState({ loadingEvents: false, error: err });
        });
    });
  }

  fetchBucketsSize() {
    const { match } = this.props;
    const bucketName = match.params["bucketName"];

    this.setState({ loadingSize: true }, () => {
      api
        .invoke("GET", `/api/v1/buckets`)
        .then((res: BucketList) => {
          const resBuckets = get(res, "buckets", []);

          const bucketInfo = resBuckets.find(
            (bucket) => bucket.name === bucketName
          );

          const size = get(bucketInfo, "size", "0");

          this.setState({
            loadingSize: false,
            errorSize: "",
            bucketSize: size,
          });
        })
        .catch((err: any) => {
          this.setState({ loadingSize: false, errorSize: err });
        });
    });
  }

  loadInfo() {
    const { match } = this.props;
    const bucketName = match.params["bucketName"];
    this.setState({ loadingBucket: true }, () => {
      api
        .invoke("GET", `/api/v1/buckets/${bucketName}`)
        .then((res: BucketInfo) => {
          this.setState({ loadingBucket: false, info: res });
        })
        .catch((err) => {
          this.setState({ loadingBucket: false, errBucket: err });
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

  componentDidMount(): void {
    this.loadInfo();
    this.fetchEvents();
    this.fetchBucketsSize();
  }

  bucketFilter(): void {}

  render() {
    const { classes, match } = this.props;
    const {
      info,
      records,
      totalRecords,
      setAccessPolicyScreenOpen,
      loadingEvents,
      loadingBucket,
      page,
      rowsPerPage,
      deleteOpen,
      addScreenOpen,
      selectedEvent,
      bucketSize,
      loadingSize,
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

    const eventsDisplay = (events: string[]) => {
      return <React.Fragment>{events.join(", ")}</React.Fragment>;
    };

    const tableActions = [{ type: "delete", onClick: confirmDeleteEvent }];

    const filteredRecords = records.slice(offset, offset + rowsPerPage);

    return (
      <React.Fragment>
        {addScreenOpen && (
          <AddEvent
            open={addScreenOpen}
            selectedBucket={bucketName}
            closeModalAndRefresh={() => {
              this.setState({ addScreenOpen: false });
              this.fetchEvents();
            }}
          />
        )}
        {setAccessPolicyScreenOpen && (
          <SetAccessPolicy
            bucketName={bucketName}
            open={setAccessPolicyScreenOpen}
            actualPolicy={accessPolicy}
            closeModalAndRefresh={() => {
              this.closeAddModalAndRefresh();
            }}
          />
        )}

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
            <div className={classes.headerContainer}>
              <div>
                <Paper className={classes.paperContainer}>
                  <div className={classes.gridContainer}>
                    <div>Access Policy:</div>
                    <div className={classes.capitalizeFirst}>
                      {loadingBucket ? (
                        <CircularProgress
                          color="primary"
                          size={16}
                          variant="indeterminate"
                        />
                      ) : (
                        accessPolicy.toLowerCase()
                      )}
                    </div>
                    <div>Reported Usage:</div>
                    <div>
                      {loadingSize ? (
                        <CircularProgress
                          color="primary"
                          size={16}
                          variant="indeterminate"
                        />
                      ) : (
                        niceBytes(bucketSize)
                      )}
                    </div>
                  </div>
                </Paper>
              </div>
              <div className={classes.masterActions}>
                <div>
                  <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    size="medium"
                    onClick={() => {
                      this.setState({
                        setAccessPolicyScreenOpen: true,
                      });
                    }}
                  >
                    Change Access Policy
                  </Button>
                </div>
              </div>
            </div>
          </Grid>
          <Grid item xs={12}>
            <br />
          </Grid>
          <Grid item xs={6}>
            <Tabs
              value={0}
              indicatorColor="primary"
              textColor="primary"
              aria-label="cluster-tabs"
            >
              <Tab label="Events" />
            </Tabs>
          </Grid>
          <Grid item xs={6} className={classes.actionsTray}>
            <Button
              variant="contained"
              color="primary"
              startIcon={<CreateIcon />}
              size="medium"
              onClick={() => {
                this.setState({
                  addScreenOpen: true,
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
            <TableWrapper
              itemActions={tableActions}
              columns={[
                { label: "SQS", elementKey: "arn" },
                {
                  label: "Events",
                  elementKey: "events",
                  renderFunction: eventsDisplay,
                },
                { label: "Prefix", elementKey: "prefix" },
                { label: "Suffix", elementKey: "suffix" },
              ]}
              isLoading={loadingEvents}
              records={filteredRecords}
              entityName="Events"
              idField="id"
              paginatorConfig={{
                rowsPerPageOptions: [5, 10, 25],
                colSpan: 3,
                count: totalRecords,
                rowsPerPage: rowsPerPage,
                page: page,
                SelectProps: {
                  inputProps: { "aria-label": "rows per page" },
                  native: true,
                },
                onChangePage: handleChangePage,
                onChangeRowsPerPage: handleChangeRowsPerPage,
                ActionsComponent: MinTablePaginationActions,
              }}
            />
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
