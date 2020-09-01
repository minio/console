// This file is part of MinIO Console Server
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
import {
  Button,
  Checkbox,
  FormControlLabel,
  LinearProgress,
} from "@material-ui/core";
import { createStyles, Theme, withStyles } from "@material-ui/core/styles";
import { modalBasic } from "../../Common/FormComponents/common/styleLibrary";
import api from "../../../../common/api";
import ModalWrapper from "../../Common/ModalWrapper/ModalWrapper";
import InputBoxWrapper from "../../Common/FormComponents/InputBoxWrapper/InputBoxWrapper";
import CheckboxWrapper from "../../Common/FormComponents/CheckboxWrapper/CheckboxWrapper";

const styles = (theme: Theme) =>
  createStyles({
    errorBlock: {
      color: "red",
    },
    buttonContainer: {
      textAlign: "right",
    },
    ...modalBasic,
  });

interface IAddBucketProps {
  classes: any;
  open: boolean;
  closeModalAndRefresh: () => void;
}

interface IAddBucketState {
  addLoading: boolean;
  versioned: boolean;
  addError: string;
  bucketName: string;
}

class AddBucket extends React.Component<IAddBucketProps, IAddBucketState> {
  state: IAddBucketState = {
    addLoading: false,
    versioned: false,
    addError: "",
    bucketName: "",
  };

  addRecord(event: React.FormEvent) {
    event.preventDefault();
    const { bucketName, addLoading, versioned } = this.state;
    if (addLoading) {
      return;
    }
    this.setState({ addLoading: true }, () => {
      api
        .invoke("POST", "/api/v1/buckets", {
          name: bucketName,
          versioning: versioned,
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
    });
  }

  render() {
    const { classes, open } = this.props;
    const { addLoading, addError, bucketName, versioned } = this.state;
    return (
      <ModalWrapper
        title="Create Bucket"
        modalOpen={open}
        onClose={() => {
          this.setState({ addError: "" }, () => {
            this.props.closeModalAndRefresh();
          });
        }}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
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
                  id="bucket-name"
                  name="bucket-name"
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    this.setState({ bucketName: e.target.value });
                  }}
                  label="Bucket Name"
                  value={bucketName}
                />
              </Grid>
              <Grid item xs={12}>
                <CheckboxWrapper
                  value="versioned"
                  id="versioned"
                  name="versioned"
                  checked={versioned}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    this.setState({ versioned: event.target.checked });
                  }}
                  label={"Turn On Versioning"}
                />
              </Grid>
            </Grid>
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

export default withStyles(styles)(AddBucket);
