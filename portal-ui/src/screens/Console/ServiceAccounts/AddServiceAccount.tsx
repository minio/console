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
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  LinearProgress,
  TextField
} from "@material-ui/core";
import {
  createStyles,
  lighten,
  makeStyles,
  Theme,
  withStyles
} from "@material-ui/core/styles";
import api from "../../../common/api";
import clsx from "clsx";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";
import Toolbar from "@material-ui/core/Toolbar";
import Checkbox from "@material-ui/core/Checkbox";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
import FilterListIcon from "@material-ui/icons/FilterList";
import { Permission, PermissionList } from "../Permissions/types";
import {
  NewServiceAccount,
  ServiceAccount,
  ServiceAccountDetails
} from "./types";
import Switch from "@material-ui/core/Switch";

const useToolbarStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(1)
    },
    highlight:
      theme.palette.type === "light"
        ? {
            color: theme.palette.secondary.main,
            backgroundColor: lighten(theme.palette.secondary.light, 0.85)
          }
        : {
            color: theme.palette.text.primary,
            backgroundColor: theme.palette.secondary.dark
          },
    title: {
      flex: "1 1 100%"
    }
  })
);

interface EnhancedTableToolbarProps {
  numSelected: number;
}

const EnhancedTableToolbar = (props: EnhancedTableToolbarProps) => {
  const classes = useToolbarStyles();
  const { numSelected } = props;

  return (
    <Toolbar
      className={clsx(classes.root, {
        [classes.highlight]: numSelected > 0
      })}
    >
      {numSelected > 0 ? (
        <Typography
          className={classes.title}
          color="inherit"
          variant="subtitle1"
        >
          {numSelected} selected
        </Typography>
      ) : (
        <Typography className={classes.title} variant="h6" id="tableTitle">
          Permissions
        </Typography>
      )}
      {numSelected > 0 ? (
        <span />
      ) : (
        <Tooltip title="Filter list">
          <IconButton aria-label="filter list">
            <FilterListIcon />
          </IconButton>
        </Tooltip>
      )}
    </Toolbar>
  );
};

const styles = (theme: Theme) =>
  createStyles({
    errorBlock: {
      color: "red"
    }
  });

interface IAddServiceAccountContentProps {
  classes: any;
  open: boolean;
  closeModalAndRefresh: (res: NewServiceAccount | null) => void;
  selectedServiceAccount: ServiceAccount | null;
}

interface IAddServiceAccountContentState {
  addLoading: boolean;
  addError: string;
  name: string;
  enabled: boolean;
  selectedPermissions: Permission[];
  rowsPerPage: number;
  page: number;
  permissions: Permission[];
  permissionsError: string;
  loadingPermissions: boolean;
  loadingServiceAccount: boolean;
}

class AddServiceAccountContent extends React.Component<
  IAddServiceAccountContentProps,
  IAddServiceAccountContentState
> {
  state: IAddServiceAccountContentState = {
    addLoading: false,
    addError: "",
    name: "",
    enabled: true,
    selectedPermissions: [],
    rowsPerPage: 5,
    page: 0,
    permissions: [],
    permissionsError: "",
    loadingPermissions: false,
    loadingServiceAccount: false
  };

  componentDidMount(): void {
    // load a list of permissions
    this.setState({ loadingPermissions: true }, () => {
      api
        .invoke("GET", `/api/v1/permissions?limit=1000`)
        .then((res: PermissionList) => {
          this.setState({
            loadingPermissions: false,
            permissions: res.permissions,
            permissionsError: ""
          });
        })
        .catch(err => {
          this.setState({ loadingPermissions: false, permissionsError: err });
        });
    });

    const { selectedServiceAccount } = this.props;
    if (selectedServiceAccount !== null) {
      this.setState({ loadingServiceAccount: true }, () => {
        api
          .invoke(
            "GET",
            `/api/v1/service_accounts/${selectedServiceAccount.id}`
          )
          .then((res: ServiceAccountDetails) => {
            console.log(res);
            this.setState({
              loadingServiceAccount: false,
              name: selectedServiceAccount.name,
              enabled: selectedServiceAccount.enabled,
              selectedPermissions:
                res.permissions === undefined || res.permissions === null
                  ? []
                  : res.permissions
            });
          })
          .catch(err => {
            this.setState({ loadingServiceAccount: false });
          });
      });
    }
  }

  saveRecord(event: React.FormEvent) {
    event.preventDefault();
    const { name, addLoading, selectedPermissions,enabled } = this.state;
    const { selectedServiceAccount } = this.props;
    if (addLoading) {
      return;
    }
    this.setState({ addLoading: true }, () => {
      if (selectedServiceAccount !== null) {
        api
          .invoke(
            "PUT",
            `/api/v1/service_accounts/${selectedServiceAccount.id}`,
            {
              id: selectedServiceAccount.id,
              name: name,
              enabled: enabled,
              permission_ids: selectedPermissions.map(p => p.id)
            }
          )
          .then(res => {
            this.setState(
              {
                addLoading: false,
                addError: ""
              },
              () => {
                this.props.closeModalAndRefresh(null);
              }
            );
          })
          .catch(err => {
            this.setState({
              addLoading: false,
              addError: err
            });
          });
      } else {
        api
          .invoke("POST", "/api/v1/service_accounts", {
            name: name,
            permission_ids: selectedPermissions.map(p => p.id)
          })
          .then((res: NewServiceAccount) => {
            this.setState(
              {
                addLoading: false,
                addError: ""
              },
              () => {
                this.props.closeModalAndRefresh(res);
              }
            );
          })
          .catch(err => {
            this.setState({
              addLoading: false,
              addError: err
            });
          });
      }
    });
  }

  render() {
    const { classes, selectedServiceAccount } = this.props;
    const {
      addLoading,
      addError,
      page,
      rowsPerPage,
      permissions,
      selectedPermissions,
      name,
      loadingServiceAccount
    } = this.state;

    const handleSelectAllClick = (
      event: React.ChangeEvent<HTMLInputElement>
    ) => {
      if (event.target.checked) {
        // const newSelecteds = permissions.map(n => n.name);
        const newSelecteds = [...permissions];
        this.setState({ selectedPermissions: newSelecteds });
        return;
      }
      this.setState({ selectedPermissions: [] });
    };

    const handleClick = (
      event: React.MouseEvent<unknown>,
      perm: Permission
    ) => {
      let newSelected: Permission[] = [...selectedPermissions];
      if (newSelected.filter(p => p.id === perm.id).length === 0) {
        newSelected.push(perm);
      } else {
        let selectedIndex = -1;
        for (let i = 0; i < newSelected.length; i++) {
          if (newSelected[i].id === perm.id) {
            selectedIndex = i;
            break;
          }
        }
        if (selectedIndex >= 0) {
          newSelected = [
            ...newSelected.slice(0, selectedIndex),
            ...newSelected.slice(selectedIndex + 1)
          ];
        }
      }

      this.setState({ selectedPermissions: newSelected });
    };

    const handleChangePage = (event: unknown, newPage: number) => {
      this.setState({ page: newPage });
    };

    const handleChangeRowsPerPage = (
      event: React.ChangeEvent<HTMLInputElement>
    ) => {
      this.setState({ page: 0, rowsPerPage: parseInt(event.target.value, 10) });
    };

    const isSelected = (perm: Permission) =>
      selectedPermissions.filter(p => p.id === perm.id).length > 0;

    const emptyRows =
      rowsPerPage -
      Math.min(rowsPerPage, permissions.length - page * rowsPerPage);

    const handleChange = (name: string) => (
      event: React.ChangeEvent<HTMLInputElement>
    ) => {
      this.setState({enabled:event.target.checked})
    };

    return (
      <React.Fragment>
        <DialogTitle id="alert-dialog-title">
          {selectedServiceAccount !== null ? (
            <span>Edit Service Account</span>
          ) : (
            <span>Create Service Account</span>
          )}
        </DialogTitle>
        <DialogContent>
          <form
            noValidate
            autoComplete="off"
            onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
              this.saveRecord(e);
            }}
          >
            <Grid container>
              {loadingServiceAccount && (
                <Grid item xs={12}>
                  <LinearProgress />
                </Grid>
              )}
              {addError !== "" && (
                <Grid item xs={12}>
                  <Typography
                    component="p"
                    variant="body1"
                    className={classes.errorBlock}
                  >
                    {addError}
                  </Typography>
                </Grid>
              )}
              <Grid item xs={12}>
                <TextField
                  id="standard-basic"
                  fullWidth
                  label="Name"
                  value={name}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    this.setState({ name: e.target.value });
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <div className={classes.root}>
                  <EnhancedTableToolbar
                    numSelected={selectedPermissions.length}
                  />
                  <TableContainer>
                    <Table
                      className={classes.table}
                      aria-labelledby="tableTitle"
                      size={"small"}
                      aria-label="enhanced table"
                    >
                      <TableHead>
                        <TableRow>
                          <TableCell padding="checkbox">
                            <Checkbox
                              indeterminate={
                                selectedPermissions.length > 0 &&
                                selectedPermissions.length < permissions.length
                              }
                              checked={
                                selectedPermissions.length > 0 &&
                                selectedPermissions.length ===
                                  permissions.length
                              }
                              onChange={handleSelectAllClick}
                              inputProps={{
                                "aria-label": "select all desserts"
                              }}
                            />
                          </TableCell>
                          <TableCell>Permission</TableCell>
                          <TableCell>Description</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {permissions
                          .slice(
                            page * rowsPerPage,
                            page * rowsPerPage + rowsPerPage
                          )
                          .map((row, index) => {
                            const isItemSelected = isSelected(row);
                            const labelId = `enhanced-table-checkbox-${index}`;

                            return (
                              <TableRow
                                hover
                                onClick={event => handleClick(event, row)}
                                role="checkbox"
                                aria-checked={isItemSelected}
                                tabIndex={-1}
                                key={row.name}
                                selected={isItemSelected}
                              >
                                <TableCell padding="checkbox">
                                  <Checkbox
                                    checked={isItemSelected}
                                    inputProps={{ "aria-labelledby": labelId }}
                                  />
                                </TableCell>
                                <TableCell id={labelId}>{row.name}</TableCell>
                                <TableCell>{row.description}</TableCell>
                              </TableRow>
                            );
                          })}
                        {emptyRows > 0 && (
                          <TableRow style={{ height: 33 * emptyRows }}>
                            <TableCell colSpan={6} />
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </TableContainer>
                  <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={permissions.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    labelRowsPerPage={null}
                    onChangePage={handleChangePage}
                    onChangeRowsPerPage={handleChangeRowsPerPage}
                  />
                </div>
              </Grid>
              <Grid item xs={12}>
                <br />
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      onChange={handleChange("enabled")}
                      value="checkedA"
                    />
                  }
                  label="Enabled"

                />
              </Grid>
              <Grid item xs={12}>
                <br />
              </Grid>
              <Grid item xs={12}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={addLoading}
                >
                  Save
                </Button>
              </Grid>
              {addLoading && (
                <Grid item xs={12}>
                  <LinearProgress />
                </Grid>
              )}
            </Grid>
          </form>
        </DialogContent>
      </React.Fragment>
    );
  }
}

const AddServiceAccountWrapper = withStyles(styles)(AddServiceAccountContent);

interface IAddServiceAccountProps {
  open: boolean;
  closeModalAndRefresh: (res: NewServiceAccount | null) => void;
  selectedServiceAccount: ServiceAccount | null;
}

interface IAddServiceAccountState {}

class AddServiceAccount extends React.Component<
  IAddServiceAccountProps,
  IAddServiceAccountState
> {
  state: IAddServiceAccountState = {};

  render() {
    const { open } = this.props;
    return (
      <Dialog
        open={open}
        onClose={() => {
          this.setState({ addError: "" }, () => {
            this.props.closeModalAndRefresh(null);
          });
        }}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <AddServiceAccountWrapper {...this.props} />
      </Dialog>
    );
  }
}

export default AddServiceAccount;
