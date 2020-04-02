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
  FormControl,
  FormControlLabel,
  FormLabel,
  InputLabel,
  LinearProgress,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
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
import { Bucket, BucketList } from "../Buckets/types";
import { Permission } from "./types";

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
          Buckets
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

interface IAddPermissionContentProps {
  classes: any;
  open: boolean;
  closeModalAndRefresh: () => void;
  selectedPermission: Permission | null;
}

interface IAddPermissionContentState {
  addLoading: boolean;
  addError: string;
  name: string;
  description: string;
  effect: string;
  action: string;
  rowsPerPage: number;
  page: number;
  resources: string[];
  buckets: Bucket[];
  bucketsError: string;
  loadingBuckets: boolean;
}

class AddPermissionContent extends React.Component<
  IAddPermissionContentProps,
  IAddPermissionContentState
> {
  state: IAddPermissionContentState = {
    addLoading: false,
    addError: "",
    name: "",
    description: "",
    effect: "Allow",
    action: "readwrite",
    rowsPerPage: 5,
    page: 0,
    resources: [],
    buckets: [],
    bucketsError: "",
    loadingBuckets: false
  };

  componentDidMount(): void {
    // load a list of buckets
    this.setState({ loadingBuckets: true }, () => {
      api
        .invoke("GET", `/api/v1/buckets`)
        .then((res: BucketList) => {
          this.setState({
            loadingBuckets: false,
            buckets: res.buckets,
            bucketsError: ""
          });
        })
        .catch(err => {
          this.setState({ loadingBuckets: false, bucketsError: err });
        });
    });

    const { selectedPermission } = this.props;
    if (selectedPermission !== null) {
      this.setState({
        name: selectedPermission.name,
        description: selectedPermission.description,
        effect: selectedPermission.effect,
        resources: selectedPermission.resources.map(r => r.bucket_name),
        action: selectedPermission.actions[0].type
      });
    }
  }

  saveRecord(event: React.FormEvent) {
    event.preventDefault();
    const {
      name,
      addLoading,
      resources,
      description,
      effect,
      action
    } = this.state;
    const { selectedPermission } = this.props;
    if (addLoading) {
      return;
    }
    this.setState({ addLoading: true }, () => {
      if (selectedPermission !== null) {
        api
          .invoke("PUT", `/api/v1/permissions/${selectedPermission.id}`, {
            id: selectedPermission.id,
            name: name,
            description: description,
            effect: effect,
            resources: resources,
            actions: [action]
          })
          .then(res => {
            this.setState(
              {
                addLoading: false,
                addError: ""
              },
              () => {
                this.props.closeModalAndRefresh();
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
          .invoke("POST", "/api/v1/permissions", {
            name: name,
            description: description,
            effect: effect,
            resources: resources,
            actions: [action]
          })
          .then(res => {
            this.setState(
              {
                addLoading: false,
                addError: ""
              },
              () => {
                this.props.closeModalAndRefresh();
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
    const { classes, selectedPermission, open } = this.props;
    const {
      addLoading,
      addError,
      resources,
      page,
      rowsPerPage,
      buckets,
      name,
      description,
      effect,
      action
    } = this.state;

    const handleSelectAllClick = (
      event: React.ChangeEvent<HTMLInputElement>
    ) => {
      if (event.target.checked) {
        const newSelecteds = buckets.map(n => n.name);
        this.setState({ resources: newSelecteds });
        return;
      }
      this.setState({ resources: [] });
    };

    const handleClick = (event: React.MouseEvent<unknown>, name: string) => {
      const selectedIndex = resources.indexOf(name);
      let newSelected: string[] = [];

      if (selectedIndex === -1) {
        newSelected = newSelected.concat(resources, name);
      } else if (selectedIndex === 0) {
        newSelected = newSelected.concat(resources.slice(1));
      } else if (selectedIndex === resources.length - 1) {
        newSelected = newSelected.concat(resources.slice(0, -1));
      } else if (selectedIndex > 0) {
        newSelected = newSelected.concat(
          resources.slice(0, selectedIndex),
          resources.slice(selectedIndex + 1)
        );
      }

      this.setState({ resources: newSelected });
    };

    const handleChangePage = (event: unknown, newPage: number) => {
      this.setState({ page: newPage });
    };

    const handleChangeRowsPerPage = (
      event: React.ChangeEvent<HTMLInputElement>
    ) => {
      this.setState({ page: 0, rowsPerPage: parseInt(event.target.value, 10) });
    };

    const isSelected = (name: string) => resources.indexOf(name) !== -1;

    const emptyRows =
      rowsPerPage - Math.min(rowsPerPage, buckets.length - page * rowsPerPage);

    return (
      <Dialog
        open={open}
        onClose={() => {
          this.setState({ addError: "" }, () => {
            this.props.closeModalAndRefresh();
          });
        }}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {selectedPermission !== null ? (
            <span>Edit Permission</span>
          ) : (
            <span>Create Permission</span>
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
                <TextField
                  id="standard-multiline-static"
                  label="Description"
                  fullWidth
                  multiline
                  rows="4"
                  value={description}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    this.setState({ description: e.target.value });
                  }}
                />
              </Grid>

              <Grid item xs={12}>
                <FormControl className={classes.formControl} fullWidth>
                  <InputLabel id="select-effect">Effect</InputLabel>
                  <Select
                    labelId="select-effect"
                    id="select-effect"
                    value={effect}
                    onChange={(e: React.ChangeEvent<{ value: unknown }>) => {
                      this.setState({ effect: e.target.value as string });
                    }}
                  >
                    <MenuItem value="Allow">Allow</MenuItem>
                    <MenuItem value="Deny">Deny</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <div className={classes.root}>
                  <EnhancedTableToolbar numSelected={resources.length} />
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
                                resources.length > 0 &&
                                resources.length < buckets.length
                              }
                              checked={
                                buckets.length > 0 &&
                                resources.length === buckets.length
                              }
                              onChange={handleSelectAllClick}
                              inputProps={{
                                "aria-label": "select all desserts"
                              }}
                            />
                          </TableCell>
                          <TableCell>Name</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {buckets
                          .slice(
                            page * rowsPerPage,
                            page * rowsPerPage + rowsPerPage
                          )
                          .map((row, index) => {
                            const isItemSelected = isSelected(row.name);
                            const labelId = `enhanced-table-checkbox-${index}`;

                            return (
                              <TableRow
                                hover
                                onClick={event => handleClick(event, row.name)}
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
                    count={buckets.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    labelRowsPerPage={null}
                    onChangePage={handleChangePage}
                    onChangeRowsPerPage={handleChangeRowsPerPage}
                  />
                </div>
              </Grid>
              <Grid item xs={12}>
                <FormControl
                  component="fieldset"
                  className={classes.formControl}
                >
                  <FormLabel component="legend">Action</FormLabel>
                  <RadioGroup
                    aria-label="action"
                    name="action"
                    value={action}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                      this.setState({
                        action: (event.target as HTMLInputElement).value
                      });
                    }}
                  >
                    <FormControlLabel
                      value="readwrite"
                      control={<Radio />}
                      label="All Actions"
                    />
                    <FormControlLabel
                      value="read"
                      control={<Radio />}
                      label="Read Only"
                    />
                    <FormControlLabel
                      value="write"
                      control={<Radio />}
                      label="Write Only"
                    />
                    <FormControlLabel
                        value="trace"
                        control={<Radio />}
                        label="Trace"
                    />
                  </RadioGroup>
                </FormControl>
              </Grid>
              {action === 'trace' && (
                  <React.Fragment>
                    <Grid item xs={12}>
                      <br />
                    </Grid>
                    <Grid item xs={12}>
                      <Typography
                          component="p"
                          variant="body1"
                          className={classes.errorBlock}
                      >
                        Trace displays tracing information for all buckets.
                      </Typography>
                    </Grid>
                  </React.Fragment>
              )}
              <Grid item xs={12}>
                <br />
              </Grid>
              <Grid item xs={12}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  fullWidth
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
      </Dialog>
    );
  }
}

const AddPermissionWrapper = withStyles(styles)(AddPermissionContent);

interface IAddPermissionProps {
  open: boolean;
  closeModalAndRefresh: () => void;
  selectedPermission: Permission | null;
}

interface IAddPermissionState {}

class AddPermission extends React.Component<
  IAddPermissionProps,
  IAddPermissionState
> {
  state: IAddPermissionState = {};

  render() {
    const { open } = this.props;
    return (
      <Dialog
        open={open}
        onClose={() => {
          this.setState({ addError: "" }, () => {
            this.props.closeModalAndRefresh();
          });
        }}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <AddPermissionWrapper {...this.props} />
      </Dialog>
    );
  }
}

export default AddPermission;
