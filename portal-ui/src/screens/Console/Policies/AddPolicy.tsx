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
import { Button, LinearProgress } from "@material-ui/core";
import { createStyles, Theme, withStyles } from "@material-ui/core/styles";
import api from "../../../common/api";
import "codemirror/lib/codemirror.css";
import "codemirror/theme/material.css";
import { Policy } from "./types";
import { modalBasic } from "../Common/FormComponents/common/styleLibrary";
import ModalWrapper from "../Common/ModalWrapper/ModalWrapper";
import InputBoxWrapper from "../Common/FormComponents/InputBoxWrapper/InputBoxWrapper";

require("codemirror/mode/javascript/javascript");

const styles = (theme: Theme) =>
  createStyles({
    errorBlock: {
      color: "red",
    },
    jsonPolicyEditor: {
      minHeight: 400,
      width: "100%",
    },
    codeMirror: {
      fontSize: 14,
      "& .CodeMirror": {
        color: "#fff",
        backgroundColor: "#081C42",
      },
      "& .CodeMirror-gutter": {
        backgroundColor: "#081C4280",
      },
      "& .CodeMirror-linenumber": {
        color: "#000",
        fontSize: 10,
        height: 20,
        lineHeight: "20px",
      },
    },
    buttonContainer: {
      textAlign: "right",
    },
    ...modalBasic,
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
      });
    }
  }

  render() {
    const { classes, open, policyEdit } = this.props;
    const { addLoading, addError, policyName } = this.state;
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
              <Grid item xs={12}>
                <CodeMirror
                  className={classes.codeMirror}
                  value={
                    policyEdit
                      ? JSON.stringify(JSON.parse(policyEdit.policy), null, 4)
                      : ""
                  }
                  options={{
                    mode: "javascript",
                    lineNumbers: true,
                  }}
                  onChange={(editor, data, value) => {
                    this.setState({ policyDefinition: value });
                  }}
                />
              </Grid>
            </Grid>
            {!policyEdit && (
              <Grid item xs={12} className={classes.buttonContainer}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
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
      </ModalWrapper>
    );
  }
}

export default withStyles(styles)(AddPolicy);
