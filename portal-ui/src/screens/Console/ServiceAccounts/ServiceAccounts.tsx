// This file is part of MinIO Kubernetes Cloud
// Copyright (c) 2019 MinIO, Inc.
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
import api from "../../../common/api";
import {
  Button,
  IconButton,
  LinearProgress,
  TableFooter,
  TablePagination
} from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import {
  NewServiceAccount,
  ServiceAccount,
  ServiceAccountsList
} from "./types";
import { MinTablePaginationActions } from "../../../common/MinTablePaginationActions";
import EditIcon from "@material-ui/icons/Edit";
import AddServiceAccount from "./AddServiceAccount";
import DeleteServiceAccount from "./DeleteServiceAccount";
import CredentialsPrompt from "./CredentialsPrompt";
import { CreateIcon, DeleteIcon } from "../../../icons";
import Checkbox from "@material-ui/core/Checkbox";
import PlayArrowRoundedIcon from "@material-ui/icons/PlayArrowRounded";
import TextField from "@material-ui/core/TextField";
import InputAdornment from "@material-ui/core/InputAdornment";
import SearchIcon from "@material-ui/icons/Search";

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
      width: "480px",
      minWidth: "320px",
      padding: "20px"
    },
    errorBlock: {
      color: "red"
    },
    tableToolbar: {
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(0)
    },
    wrapCell: {
      maxWidth: "200px",
      whiteSpace: "normal",
      wordWrap: "break-word"
    },
    minTableHeader: {
      color: "#393939",
      "& tr": {
        "& th": {
          fontWeight:'bold'
        }
      }
    },
    imageIcon: {
      height: "100%"
    },
    iconRoot: {
      textAlign: "center"
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
    }
  });

interface IServiceAccountsProps {
  classes: any;
}

interface IServiceAccountsState {
  records: ServiceAccount[];
  totalRecords: number;
  loading: boolean;
  error: string;
  deleteError: string;
  addScreenOpen: boolean;
  page: number;
  rowsPerPage: number;
  deleteOpen: boolean;
  selectedServiceAccount: ServiceAccount | null;
  showNewCredentials: boolean;
  newServiceAccount: NewServiceAccount | null;
}

class ServiceAccounts extends React.Component<
  IServiceAccountsProps,
  IServiceAccountsState
> {
  state: IServiceAccountsState = {
    records: [],
    totalRecords: 0,
    loading: false,
    error: "",
    deleteError: "",
    addScreenOpen: false,
    page: 0,
    rowsPerPage: 10,
    deleteOpen: false,
    selectedServiceAccount: null,
    showNewCredentials: false,
    newServiceAccount: null
  };

  fetchRecords() {
    this.setState({ loading: true }, () => {
      const { page, rowsPerPage } = this.state;
      const offset = page * rowsPerPage;
      api
        .invoke(
          "GET",
          `/api/v1/service_accounts?offset=${offset}&limit=${rowsPerPage}`
        )
        .then((res: ServiceAccountsList) => {
          this.setState({
            loading: false,
            records: res.service_accounts,
            totalRecords: res.total,
            error: ""
          });
          // if we get 0 results, and page > 0 , go down 1 page
          if (
            (res.service_accounts === undefined ||
              res.service_accounts == null ||
              res.service_accounts.length === 0) &&
            page > 0
          ) {
            const newPage = page - 1;
            this.setState({ page: newPage }, () => {
              this.fetchRecords();
            });
          }
        })
        .catch(err => {
          this.setState({ loading: false, error: err });
        });
    });
  }

  closeAddModalAndRefresh(res: NewServiceAccount | null) {
    this.setState({ addScreenOpen: false }, () => {
      this.fetchRecords();
    });
    if (res !== null) {
      this.setState({ showNewCredentials: true, newServiceAccount: res });
    }
  }

  closeDeleteModalAndRefresh(refresh: boolean) {
    this.setState({ deleteOpen: false }, () => {
      if (refresh) {
        this.fetchRecords();
      }
    });
  }

  componentDidMount(): void {
    this.fetchRecords();
  }

  closeCredentialsModal() {
    this.setState({ showNewCredentials: false, newServiceAccount: null });
  }

  render() {
    const { classes } = this.props;
    const {
      records,
      totalRecords,
      addScreenOpen,
      loading,
      page,
      rowsPerPage,
      deleteOpen,
      selectedServiceAccount,
      showNewCredentials,
      newServiceAccount
    } = this.state;

    const handleChangePage = (event: unknown, newPage: number) => {
      this.setState({ page: newPage }, () => {
        this.fetchRecords();
      });
    };

    const handleChangeRowsPerPage = (
      event: React.ChangeEvent<HTMLInputElement>
    ) => {
      const rPP = parseInt(event.target.value, 10);
      this.setState({ page: 0, rowsPerPage: rPP }, () => {
        this.fetchRecords();
      });
    };

    const confirmDeleteServiceAccount = (
      selectedServiceAccount: ServiceAccount
    ) => {
      this.setState({
        deleteOpen: true,
        selectedServiceAccount: selectedServiceAccount
      });
    };

    const editServiceAccount = (selectedServiceAccount: ServiceAccount) => {
      this.setState({
        addScreenOpen: true,
        selectedServiceAccount: selectedServiceAccount
      });
    };

    return (
      <React.Fragment>
        <AddServiceAccount
          open={addScreenOpen}
          selectedServiceAccount={selectedServiceAccount}
          closeModalAndRefresh={(res: NewServiceAccount | null) => {
            this.closeAddModalAndRefresh(res);
          }}
        />

        <Grid container>
          <Grid item xs={12}>
            <Typography variant="h6">Service Accounts</Typography>
          </Grid>
          <Grid item xs={12}>
            <br />
          </Grid>
          <Grid item xs={12} className={classes.actionsTray}>
            <TextField
              placeholder="Search Service Accounts"
              className={classes.searchField}
              id="search-resource"
              label=""
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
                this.setState({
                  addScreenOpen: true,
                  selectedServiceAccount: null
                });
              }}
            >
              Create service account
            </Button>
            <Button
              variant="contained"
              color="primary"
              startIcon={<PlayArrowRoundedIcon />}
              onClick={() => {
                this.setState({
                  addScreenOpen: true
                });
              }}
            >
              Change Access
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
                      <TableCell>Select</TableCell>
                      <TableCell>Name</TableCell>
                      <TableCell>Access Key</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell align="right">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {records.map(row => (
                      <TableRow key={row.name}>
                        <TableCell padding="checkbox">
                          <Checkbox
                            value="secondary"
                            color="primary"
                            inputProps={{ 'aria-label': 'secondary checkbox' }}
                          />
                        </TableCell>
                        <TableCell className={classes.wrapCell}>
                          {row.name}
                        </TableCell>
                        <TableCell>{row.access_key}</TableCell>
                        <TableCell>
                          {row.enabled ? "enabled" : "disabled"}
                        </TableCell>
                        <TableCell align="right">
                          <IconButton
                            aria-label="edit"
                            onClick={() => {
                              editServiceAccount(row);
                            }}
                          >
                            <EditIcon />
                          </IconButton>
                          <IconButton
                            aria-label="delete"
                            onClick={() => {
                              confirmDeleteServiceAccount(row);
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
                        colSpan={4}
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
                <div>No Service Accounts</div>
              )}
            </Paper>
          </Grid>
        </Grid>

        <DeleteServiceAccount
          deleteOpen={deleteOpen}
          selectedServiceAccount={selectedServiceAccount}
          closeDeleteModalAndRefresh={(refresh: boolean) => {
            this.closeDeleteModalAndRefresh(refresh);
          }}
        />
        <CredentialsPrompt
          newServiceAccount={newServiceAccount}
          open={showNewCredentials}
          closeModal={() => {
            this.closeCredentialsModal();
          }}
        />
      </React.Fragment>
    );
  }
}

export default withStyles(styles)(ServiceAccounts);
