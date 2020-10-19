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
import Typography from "@material-ui/core/Typography";
import { Button, LinearProgress } from "@material-ui/core";
import { createStyles, Theme, withStyles } from "@material-ui/core/styles";
import api from "../../../common/api";
import { Policy } from "./types";
import {
  fieldBasic,
  modalBasic,
} from "../Common/FormComponents/common/styleLibrary";
import ModalWrapper from "../Common/ModalWrapper/ModalWrapper";
import InputBoxWrapper from "../Common/FormComponents/InputBoxWrapper/InputBoxWrapper";
import CodeMirrorWrapper from "../Common/FormComponents/CodeMirrorWrapper/CodeMirrorWrapper";

const styles = (theme: Theme) =>
  createStyles({
    errorBlock: {
      color: "red",
    },
    jsonPolicyEditor: {
      minHeight: 400,
      width: "100%",
    },
    buttonContainer: {
      textAlign: "right",
    },
    ...modalBasic,
    ...fieldBasic,
  });

interface IAddPolicyProps {
  classes: any;
  open: boolean;
  closeModalAndRefresh: (refresh: boolean) => void;
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
    policyDefinition: "",
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
          policy: policyDefinition,
        })
        .then((res) => {
          this.setState(
            {
              addLoading: false,
              addError: "",
            },
            () => {
              this.props.closeModalAndRefresh(true);
            }
          );
        })
        .catch((err) => {
          this.setState({
            addLoading: false,
            addError: err,
          });
        });
    });
  }

  componentDidMount() {
    const { policyEdit } = this.props;

    if (policyEdit) {
      this.setState({
        policyName: policyEdit.name,
        policyDefinition: policyEdit
          ? JSON.stringify(JSON.parse(policyEdit.policy), null, 4)
          : "",
      });
    }
  }

  resetForm() {
    this.setState({
      policyName: "",
      policyDefinition: "",
    });
  }

  render() {
    const { classes, open, policyEdit } = this.props;
    const { addLoading, addError, policyName, policyDefinition } = this.state;

    const validSave = policyName.trim() !== "";

    return (
      <ModalWrapper
        modalOpen={open}
        onClose={() => {
          this.setState({ addError: "" }, () => {
            this.props.closeModalAndRefresh(false);
          });
        }}
        title={`${policyEdit ? "Info" : "Create"} Policy`}
      >
        <form
          noValidate
          autoComplete="off"
          onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
            this.addRecord(e);
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
              <Grid item xs={12}>
                <InputBoxWrapper
                  id="policy-name"
                  name="policy-name"
                  label="Policy Name"
                  placeholder="Enter Policy Name"
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    this.setState({ policyName: e.target.value });
                  }}
                  value={policyName}
                  disabled={!!policyEdit}
                />
              </Grid>
              <Grid item xs={12}>
                <br />
              </Grid>
              <CodeMirrorWrapper
                label="Write Policy"
                value={policyDefinition}
                onBeforeChange={(editor, data, value) => {
                  this.setState({ policyDefinition: value });
                }}
                readOnly={!!policyEdit}
              />
            </Grid>
            {!policyEdit && (
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
                  disabled={addLoading || !validSave}
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
      </ModalWrapper>
    );
  }
}

export default withStyles(styles)(AddPolicy);
