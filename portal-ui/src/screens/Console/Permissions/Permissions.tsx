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
import DeleteIcon from "@material-ui/icons/Delete";
import { Permission, PermissionList } from "./types";
import AddPermission from "./AddPermission";
import DeletePermission from "./DeletePermission";
import { MinTablePaginationActions } from "../../../common/MinTablePaginationActions";
import EditIcon from "@material-ui/icons/Edit";
import Checkbox from "@material-ui/core/Checkbox";
import { CreateIcon } from "../../../icons";
import TextField from '@material-ui/core/TextField';
import InputBase from '@material-ui/core/InputBase';
import SearchIcon from '@material-ui/icons/Search';
import InputAdornment from '@material-ui/core/InputAdornment';
import PlayArrowRoundedIcon from "@material-ui/icons/PlayArrowRounded";


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
    wrapCell: {
      maxWidth: "200px",
      whiteSpace: "normal",
      wordWrap: "break-word"
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

interface IPermissionsProps {
  classes: any;
}

interface IPermissionsState {
  records: Permission[];
  totalRecords: number;
  loading: boolean;
  error: string;
  deleteError: string;
  addScreenOpen: boolean;
  page: number;
  rowsPerPage: number;
  deleteOpen: boolean;
  selectedPermission: Permission | null;
}

class Permissions extends React.Component<
  IPermissionsProps,
  IPermissionsState
> {
  state: IPermissionsState = {
    records: [],
    totalRecords: 0,
    loading: false,
    error: "",
    deleteError: "",
    addScreenOpen: false,
    page: 0,
    rowsPerPage: 10,
    deleteOpen: false,
    selectedPermission: null
  };

  fetchRecords() {
    this.setState({ loading: true }, () => {
      const { page, rowsPerPage } = this.state;
      const offset = page * rowsPerPage;
      api
        .invoke(
          "GET",
          `/api/v1/permissions?offset=${offset}&limit=${rowsPerPage}`
        )
        .then((res: PermissionList) => {
          this.setState({
            loading: false,
            records: res.permissions,
            totalRecords: res.total,
            error: ""
          });
          // if we get 0 results, and page > 0 , go down 1 page
          if (
            (res.permissions === undefined ||
              res.permissions == null ||
              res.permissions.length === 0) &&
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

  closeAddModalAndRefresh() {
    this.setState({ addScreenOpen: false, selectedPermission: null }, () => {
      this.fetchRecords();
    });
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
      selectedPermission
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

    const confirmDeletePermission = (selectedPermission: Permission) => {
      this.setState({
        deleteOpen: true,
        selectedPermission: selectedPermission
      });
    };

    const editPermission = (selectedPermission: Permission) => {
      this.setState({
        addScreenOpen: true,
        selectedPermission: selectedPermission
      });
    };

    const actionLabel = (action: string) => {
      switch (action) {
        case "readwrite":
          return "All Actions";
        case "read":
          return "Read Only";
        case "write":
          return "Write Only";
        case "trace":
          return "Tracing";
        default:
          return "n/a";
      }
    };

    return (
      <React.Fragment>

        <AddPermission
          open={addScreenOpen}
          selectedPermission={selectedPermission}
          closeModalAndRefresh={() => {
            this.closeAddModalAndRefresh();
          }}
        />

        <Grid container>
          <Grid item xs={12}>
            <Typography variant="h6">Permissions</Typography>
          </Grid>
          <Grid item xs={12}>
            <br />
          </Grid>
          <Grid item xs={12} className={classes.actionsTray}>
            <TextField
              placeholder="Search Permissions"
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
                  selectedPermission: null
                });
              }}
            >
              Create Permission
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
              Assign Permissions
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
                      <TableCell>Description</TableCell>
                      <TableCell>Effect</TableCell>
                      <TableCell>Resources</TableCell>
                      <TableCell>Action</TableCell>
                      <TableCell align="right"></TableCell>
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
                        <TableCell className={classes.wrapCell}>
                          {row.description}
                        </TableCell>
                        <TableCell>{row.effect}</TableCell>
                        <TableCell className={classes.wrapCell}>
                          {row.resources.map(r => r.bucket_name).join(", ")}
                        </TableCell>
                        <TableCell>
                          {actionLabel(row.actions[0].type)}
                        </TableCell>
                        <TableCell align="right">
                          <IconButton
                            aria-label="edit"
                            onClick={() => {
                              editPermission(row);
                            }}
                          >
                            <EditIcon />
                          </IconButton>
                          <IconButton
                            aria-label="delete"
                            onClick={() => {
                              confirmDeletePermission(row);
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
                        colSpan={6}
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
                <div>No Permissions</div>
              )}
            </Paper>
          </Grid>
        </Grid>
        <DeletePermission
          deleteOpen={deleteOpen}
          selectedPermission={selectedPermission}
          closeDeleteModalAndRefresh={(refresh: boolean) => {
            this.closeDeleteModalAndRefresh(refresh);
          }}
        />
      </React.Fragment>
    );
  }
}

export default withStyles(styles)(Permissions);
