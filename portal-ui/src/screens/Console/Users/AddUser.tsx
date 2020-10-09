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
import Typography from "@material-ui/core/Typography";
import { Button, LinearProgress } from "@material-ui/core";
import { createStyles, Theme, withStyles } from "@material-ui/core/styles";
import {
  modalBasic,
  predefinedList,
} from "../Common/FormComponents/common/styleLibrary";
import { User } from "./types";
import api from "../../../common/api";
import GroupsSelectors from "./GroupsSelectors";
import ModalWrapper from "../Common/ModalWrapper/ModalWrapper";
import InputBoxWrapper from "../Common/FormComponents/InputBoxWrapper/InputBoxWrapper";
import RadioGroupSelector from "../Common/FormComponents/RadioGroupSelector/RadioGroupSelector";
import FormSwitchWrapper from "../Common/FormComponents/FormSwitchWrapper/FormSwitchWrapper";

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
    buttonContainer: {
      textAlign: "right",
    },
    ...modalBasic,
    ...predefinedList,
  });

interface IAddUserContentProps {
  classes: any;
  closeModalAndRefresh: () => void;
  selectedUser: User | null;
  open: boolean;
}

interface IAddUserContentState {
  addLoading: boolean;
  addError: string;
  accessKey: string;
  secretKey: string;
  selectedGroups: string[];
  currentGroups: string[];
  enabled: boolean;
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
    enabled: false,
    selectedGroups: [],
    currentGroups: [],
  };

  componentDidMount(): void {
    const { selectedUser } = this.props;
    if (selectedUser == null) {
      this.setState({
        accessKey: "",
        secretKey: "",
        selectedGroups: [],
      });
    } else {
      this.getUserInformation();
    }
  }

  saveRecord(event: React.FormEvent) {
    event.preventDefault();
    const {
      accessKey,
      addLoading,
      secretKey,
      selectedGroups,
      enabled,
    } = this.state;
    const { selectedUser } = this.props;
    if (addLoading) {
      return;
    }
    this.setState({ addLoading: true }, () => {
      if (selectedUser !== null) {
        api
          .invoke("PUT", `/api/v1/users/${selectedUser.accessKey}`, {
            status: enabled ? "enabled" : "disabled",
            groups: selectedGroups,
          })
          .then((res) => {
            this.setState(
              {
                addLoading: false,
                addError: "",
              },
              () => {
                this.props.closeModalAndRefresh();
              }
            );
          })
          .catch((err) => {
            this.setState({
              addLoading: false,
              addError: err,
            });
          });
      } else {
        api
          .invoke("POST", "/api/v1/users", {
            accessKey,
            secretKey,
            groups: selectedGroups,
          })
          .then((res) => {
            this.setState(
              {
                addLoading: false,
                addError: "",
              },
              () => {
                this.props.closeModalAndRefresh();
              }
            );
          })
          .catch((err) => {
            console.log(err);
            this.setState({
              addLoading: false,
              addError: err,
            });
          });
      }
    });
  }

  getUserInformation() {
    const { selectedUser } = this.props;

    if (!selectedUser) {
      return null;
    }

    api
      .invoke("GET", `/api/v1/users/${selectedUser.accessKey}`)
      .then((res) => {
        this.setState({
          addLoading: false,
          addError: "",
          accessKey: res.accessKey,
          selectedGroups: res.memberOf || [],
          currentGroups: res.memberOf || [],
          enabled: res.status === "enabled",
        });
      })
      .catch((err) => {
        this.setState({
          addLoading: false,
          addError: err,
        });
      });
  }

  resetForm() {
    if (this.props.selectedUser !== null) {
      this.setState({ selectedGroups: [] });

      return;
    }

    this.setState({ accessKey: "", secretKey: "", selectedGroups: [] });
  }

  render() {
    const { classes, selectedUser } = this.props;
    const {
      addLoading,
      addError,
      accessKey,
      secretKey,
      selectedGroups,
      currentGroups,
      enabled,
    } = this.state;

    const sendEnabled =
      accessKey.trim() !== "" &&
      selectedGroups.length > 0 &&
      ((secretKey.trim() !== "" && selectedUser === null) ||
        selectedUser !== null);
    return (
      <ModalWrapper
        onClose={() => {
          this.props.closeModalAndRefresh();
        }}
        modalOpen={this.props.open}
        title={selectedUser !== null ? "Edit User" : "Create User"}
      >
        {selectedUser !== null && (
          <div className={classes.floatingEnabled}>
            <FormSwitchWrapper
              indicatorLabel={"Enabled"}
              checked={enabled}
              value={"user_enabled"}
              id="user-status"
              name="user-status"
              onChange={(e) => {
                this.setState({ enabled: e.target.checked });
              }}
              switchOnly
            />
          </div>
        )}

        <React.Fragment>
          <form
            noValidate
            autoComplete="off"
            onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
              this.saveRecord(e);
            }}
          >
            <Grid container>
              <Grid item xs={12} className={classes.formScrollable}>
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

                <InputBoxWrapper
                  id="accesskey-input"
                  name="accesskey-input"
                  label="Access Key"
                  value={accessKey}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    this.setState({ accessKey: e.target.value });
                  }}
                  disabled={selectedUser !== null}
                />

                {selectedUser !== null ? (
                  <React.Fragment>
                    <Grid item xs={12} className={classes.predefinedTitle}>
                      Current Groups
                    </Grid>
                    <Grid item xs={12} className={classes.predefinedList}>
                      {currentGroups.join(", ")}
                    </Grid>
                  </React.Fragment>
                ) : (
                  <InputBoxWrapper
                    id="standard-multiline-static"
                    name="standard-multiline-static"
                    label="Secret Key"
                    type="password"
                    value={secretKey}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      this.setState({ secretKey: e.target.value });
                    }}
                    autoComplete="current-password"
                  />
                )}
                <Grid item xs={12}>
                  <GroupsSelectors
                    selectedGroups={selectedGroups}
                    setSelectedGroups={(elements: string[]) => {
                      this.setState({
                        selectedGroups: elements,
                      });
                    }}
                  />
                </Grid>
              </Grid>
              <Grid item xs={12} className={classes.buttonContainer}>
                <button
                  type="button"
                  color="primary"
                  className={classes.clearButton}
                  onClick={() => {
                    this.resetForm();
                  }}
                >
                  Clear
                </button>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={addLoading || !sendEnabled}
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
        </React.Fragment>
      </ModalWrapper>
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
    return <AddUserWrapper {...this.props} />;
  }
}

export default AddUser;
