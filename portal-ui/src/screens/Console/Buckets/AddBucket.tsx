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
  FormControl,
  InputLabel,
  LinearProgress,
  MenuItem,
  Select,
  TextField
} from "@material-ui/core";
import { createStyles, Theme, withStyles } from "@material-ui/core/styles";
import api from "../../../common/api";

const styles = (theme: Theme) =>
  createStyles({
    errorBlock: {
      color: "red"
    }
  });

interface IAddBucketProps {
  classes: any;
  open: boolean;
  closeModalAndRefresh: () => void;
}

interface IAddBucketState {
  addLoading: boolean;
  addError: string;
  bucketName: string;
  accessPolicy: string;
}

class AddBucket extends React.Component<IAddBucketProps, IAddBucketState> {
  state: IAddBucketState = {
    addLoading: false,
    addError: "",
    bucketName: "",
    accessPolicy: ""
  };

  addRecord(event: React.FormEvent) {
    event.preventDefault();
    const { bucketName, addLoading, accessPolicy } = this.state;
    if (addLoading) {
      return;
    }
    this.setState({ addLoading: true }, () => {
      api
        .invoke("POST", "/api/v1/buckets", {
          name: bucketName,
          access: accessPolicy
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
    const { classes, open } = this.props;
    const { addLoading, addError, accessPolicy } = this.state;
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
          <Title>Create Bucket</Title>
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
                  id="standard-basic"
                  fullWidth
                  label="Bucket Name"
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    this.setState({ bucketName: e.target.value });
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl className={classes.formControl} fullWidth>
                  <InputLabel id="select-access-policy">
                    Access Policy
                  </InputLabel>
                  <Select
                    labelId="select-access-policy"
                    id="select-access-policy"
                    value={accessPolicy}
                    onChange={(e: React.ChangeEvent<{ value: unknown }>) => {
                      this.setState({ accessPolicy: e.target.value as string });
                    }}
                  >
                    <MenuItem value="PRIVATE">Private</MenuItem>
                    <MenuItem value="PUBLIC">Public</MenuItem>
                    <MenuItem value="CUSTOM">Custom</MenuItem>
                  </Select>
                </FormControl>
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
      </Dialog>
    );
  }
}

export default withStyles(styles)(AddBucket);
