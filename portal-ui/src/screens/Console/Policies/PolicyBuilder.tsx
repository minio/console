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
import { createStyles, Theme, withStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import remove from "lodash/remove";
import {
  Checkbox,
  FormControlLabel,
  FormGroup,
  FormLabel,
  Paper,
  Radio,
  RadioGroup
} from "@material-ui/core";
import { Statement } from "./types";

const styles = (theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1
    },
    errorBlock: {
      color: "red"
    },
    jsonPolicyEditor: {
      minHeight: 400,
      width: "100%"
    },
    codeMirror: {
      fontSize: 14
    },
    paper: {
      padding: theme.spacing(1),
      textAlign: "center",
      color: theme.palette.text.secondary
    }
  });

interface IPolicyBuilderProps {
  classes: any;
  policyDefinition: string;
}

interface IPolicyBuilderState {
  policyString: string;
  currentStatement: Statement;
  statements: Statement[];
  currentStatementWrite: boolean;
  currentStatementRead: boolean;
}

class PolicyBuilder extends React.Component<
  IPolicyBuilderProps,
  IPolicyBuilderState
> {
  state: IPolicyBuilderState = {
    policyString: "",
    statements: [],
    currentStatement: {
      effect: "",
      actions: [],
      resources: []
    },
    currentStatementWrite: false,
    currentStatementRead: false
  };

  render() {
    const { classes, policyDefinition } = this.props;
    const {
      currentStatement,
      currentStatementWrite,
      currentStatementRead
    } = this.state;
    console.log(currentStatement);
    return (
      <div className={classes.root}>
        <Grid container spacing={1}>
          <Grid container item xs={12} spacing={3}>
            <React.Fragment>
              <Grid item xs={4}>
                <Paper className={classes.paper}>
                  <FormLabel component="legend">Effect</FormLabel>
                  <RadioGroup
                    aria-label="effect"
                    name="effect"
                    value={currentStatement.effect}
                    onChange={(
                      e: React.ChangeEvent<HTMLInputElement>,
                      value: string
                    ) => {
                      this.setState({
                        currentStatement: { ...currentStatement, effect: value }
                      });
                    }}
                  >
                    <FormControlLabel
                      value="Deny"
                      control={<Radio />}
                      label="Deny"
                    />
                    <FormControlLabel
                      value="Allow"
                      control={<Radio />}
                      label="Allow"
                    />
                  </RadioGroup>
                </Paper>
              </Grid>
              <Grid item xs={4}>
                <Paper className={classes.paper}>
                  <FormLabel component="legend">Actions</FormLabel>
                  <FormGroup>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={currentStatementRead}
                          onChange={(
                            e: React.ChangeEvent<HTMLInputElement>,
                            checked: boolean
                          ) => {
                            const readActions = [
                              "s3:ListBucket",
                              "s3:GetObject",
                              "s3:GetBucketLocation"
                            ];
                            let actions = currentStatement.actions;
                            if (checked) {
                              actions.push(...readActions);
                            } else {
                              actions = remove(actions, action =>
                                readActions.includes(action)
                              );
                            }
                            this.setState({
                              currentStatement: {
                                ...currentStatement,
                                actions: actions
                              }
                            });
                            this.setState({ currentStatementRead: checked });
                          }}
                          name="read"
                        />
                      }
                      label="Read Only"
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={currentStatementWrite}
                          onChange={(
                            e: React.ChangeEvent<HTMLInputElement>,
                            checked: boolean
                          ) => {
                            const writeActions = ["s3:PutObject"];
                            let actions = currentStatement.actions;
                            if (checked) {
                              actions.push(...writeActions);
                            } else {
                              actions = remove(actions, action =>
                                writeActions.includes(action)
                              );
                            }
                            this.setState({
                              currentStatement: {
                                ...currentStatement,
                                actions: actions
                              }
                            });
                            this.setState({ currentStatementWrite: checked });
                          }}
                          name="write"
                        />
                      }
                      label="Write Only"
                    />
                  </FormGroup>
                </Paper>
              </Grid>
              <Grid item xs={4}>
                <Paper className={classes.paper}>
                  <FormLabel component="legend">Resources</FormLabel>
                </Paper>
              </Grid>
            </React.Fragment>
          </Grid>
        </Grid>
      </div>
    );
  }
}

export default withStyles(styles)(PolicyBuilder);
