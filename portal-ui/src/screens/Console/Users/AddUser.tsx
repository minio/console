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

const styles = (theme: Theme) =>
  createStyles({
    errorBlock: {
      color: "red"
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
  name: string;
  email: string;
}

class AddUserContent extends React.Component<
  IAddUserContentProps,
  IAddUserContentState
> {
  state: IAddUserContentState = {
    addLoading: false,
    addError: "",
    name: "",
    email: ""
  };

  componentDidMount(): void {
    const { selectedUser } = this.props;
    if (selectedUser !== null) {
      this.setState({
        name: selectedUser.name,
        email: selectedUser.email
      });
    }
  }

  saveRecord(event: React.FormEvent) {
    event.preventDefault();
    const { name, addLoading, email } = this.state;
    const { selectedUser } = this.props;
    if (addLoading) {
      return;
    }
    this.setState({ addLoading: true }, () => {
      if (selectedUser !== null) {
        api
          .invoke("PUT", `/api/v1/users/${selectedUser.id}`, {
            id: selectedUser.id,
            name: name,
            email: email
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
            name: name,
            email: email
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
    const { classes, selectedUser } = this.props;
    const { addLoading, addError, name, email } = this.state;

    return (
      <React.Fragment>
        <DialogTitle id="alert-dialog-title">
          Create User
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
              <Grid item xs={12}>
                {selectedUser !== null ? (
                  <Title>Edit User</Title>
                ) : (
                  <Title>Add User</Title>
                )}
              </Grid>
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
                  value={email}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    this.setState({ email: e.target.value });
                  }}
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
