// This file is part of MinIO Console Server
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
import Title from "../../../common/Title";
import Typography from "@material-ui/core/Typography";
import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  LinearProgress,
  TextField
} from "@material-ui/core";
import { createStyles, Theme, withStyles } from "@material-ui/core/styles";
import api from "../../../common/api";
import { User } from "./types";
import GroupsSelectors from "./GroupsSelectors";

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
    }
  });

interface IAddUserContentProps {
  classes: any;
  closeModalAndRefresh: () => void;
  selectedUser: User | null;
}

interface IAddUserContentState {
  addLoading: boolean;
  addError: string;
  accessKey: string;
  secretKey: string;
  selectedGroups: string[];
  loadingGroups: boolean;
  groupsList: any[];
}

class AddUserContent extends React.Component<
  IAddUserContentProps,
  IAddUserContentState
> {
  state: IAddUserContentState = {
    addLoading: false,
    addError: "",
    accessKey: "",
    secretKey: "",
    selectedGroups: [],
    loadingGroups: false,
    groupsList: []
  };

  componentDidMount(): void {
    const { selectedUser } = this.props;
    if (selectedUser !== null) {
      console.log("selUsr", selectedUser);
      this.setState({
        accessKey: selectedUser.accessKey,
        secretKey: ""
      });
    }
  }

  saveRecord(event: React.FormEvent) {
    event.preventDefault();
    const { accessKey, addLoading, secretKey, selectedGroups } = this.state;
    const { selectedUser } = this.props;
    if (addLoading) {
      return;
    }
    this.setState({ addLoading: true }, () => {
      if (selectedUser !== null) {
        api
          .invoke("PUT", `/api/v1/users/${selectedUser.accessKey}`, {
            accessKey,
            secretKey: secretKey != "" ? null : secretKey
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
          .invoke("POST", "/api/v1/users", {
            accessKey,
            secretKey
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
            console.log(err);
            this.setState({
              addLoading: false,
              addError: err
            });
          });
      }
    });
  }

  render() {
    const { classes, selectedUser } = this.props;
    const {
      addLoading,
      addError,
      accessKey,
      secretKey,
      selectedGroups,
      loadingGroups,
      groupsList
    } = this.state;

    return (
      <React.Fragment>
        <DialogTitle id="alert-dialog-title">
          {selectedUser !== null ? "Edit User" : "Add User"}
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

              {selectedUser !== null ? (
                <React.Fragment>
                  <span className={classes.strongText}>Access Key:</span>
                  <span className={classes.keyName}>{` ${accessKey}`}</span>
                </React.Fragment>
              ) : (
                <React.Fragment>
                  <Grid item xs={12}>
                    <TextField
                      id="standard-basic"
                      fullWidth
                      label="Access Key"
                      value={accessKey}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        this.setState({ accessKey: e.target.value });
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      id="standard-multiline-static"
                      label={
                        selectedUser !== null ? "New Secret Key" : "Secret Key"
                      }
                      type="password"
                      fullWidth
                      value={secretKey}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        this.setState({ secretKey: e.target.value });
                      }}
                      autoComplete="current-password"
                    />
                  </Grid>
                </React.Fragment>
              )}

              <Grid item xs={12}>
                <br />
              </Grid>
              <Grid item xs={12}>
                <GroupsSelectors
                  selectedGroups={selectedGroups}
                  setSelectedGroups={(elements: string[]) => {
                    this.setState({
                      selectedGroups: elements
                    });
                  }}
                  loading={loadingGroups}
                  records={groupsList}
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
      </React.Fragment>
    );
  }
}

const AddUserWrapper = withStyles(styles)(AddUserContent);

interface IAddUserProps {
  open: boolean;
  closeModalAndRefresh: () => void;
  selectedUser: User | null;
}

interface IAddUserState {}

class AddUser extends React.Component<IAddUserProps, IAddUserState> {
  state: IAddUserState = {};
  render() {
    const { open } = this.props;
    return (
      <Dialog
        open={open}
        onClose={() => {
          this.props.closeModalAndRefresh();
        }}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <AddUserWrapper {...this.props} />
      </Dialog>
    );
  }
}

export default AddUser;
