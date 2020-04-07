// This file is part of MinIO Kubernetes Cloud
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
import Grid from "@material-ui/core/Grid";
import { UnControlled as CodeMirror } from "react-codemirror2";
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
import Title from "../../../common/Title";
import api from "../../../common/api";
import "codemirror/lib/codemirror.css";
import "codemirror/theme/material.css";
import { Policy } from "./types";

require("codemirror/mode/javascript/javascript");

const styles = (theme: Theme) =>
  createStyles({
    errorBlock: {
      color: "red"
    },
    jsonPolicyEditor: {
      minHeight: 400,
      width: "100%"
    },
    codeMirror: {
      fontSize: 14
    }
  });

interface IAddPolicyProps {
  classes: any;
  open: boolean;
  closeModalAndRefresh: () => void;
  policyEdit: Policy;
}

interface IAddPolicyState {
  addLoading: boolean;
  addError: string;
  policyName: string;
  policyDefinition: string;
}

class AddPolicy extends React.Component<IAddPolicyProps, IAddPolicyState> {
  state: IAddPolicyState = {
    addLoading: false,
    addError: "",
    policyName: "",
    policyDefinition: ""
  };

  addRecord(event: React.FormEvent) {
    event.preventDefault();
    const { policyName, addLoading, policyDefinition } = this.state;
    if (addLoading) {
      return;
    }
    this.setState({ addLoading: true }, () => {
      api
        .invoke("POST", "/api/v1/policies", {
          name: policyName,
          policy: policyDefinition
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
    });
  }

  render() {
    const { classes, open, policyEdit } = this.props;
    const { addLoading, addError } = this.state;
    return (
      <Dialog
        fullWidth
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
          <Title>{policyEdit ? "Info" : "Create"} Policy</Title>
        </DialogTitle>
        <DialogContent>
          <form
            noValidate
            autoComplete="off"
            onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
              this.addRecord(e);
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
                  defaultValue={policyEdit ? policyEdit.name : "" }
                  id="standard-basic"
                  fullWidth
                  label="Policy Name"
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    this.setState({ policyName: e.target.value });
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <br />
              </Grid>
              <Grid item xs={12}>
                <CodeMirror
                  className={classes.codeMirror}
                  value={policyEdit ? JSON.stringify(JSON.parse(policyEdit.policy), null, 4) : ""}
                  options={{
                    mode: "javascript",
                    lineNumbers: true
                  }}
                  onChange={(editor, data, value) => {
                    this.setState({ policyDefinition: value });
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <br />
              </Grid>
              {!policyEdit && (
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
              )}
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

export default withStyles(styles)(AddPolicy);
