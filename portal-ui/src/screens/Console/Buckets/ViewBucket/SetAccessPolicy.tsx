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
import { Button, LinearProgress } from "@material-ui/core";
import { createStyles, Theme, withStyles } from "@material-ui/core/styles";
import { modalBasic } from "../../Common/FormComponents/common/styleLibrary";
import api from "../../../../common/api";
import ModalWrapper from "../../Common/ModalWrapper/ModalWrapper";
import SelectWrapper from "../../Common/FormComponents/SelectWrapper/SelectWrapper";

const styles = (theme: Theme) =>
  createStyles({
    errorBlock: {
      color: "red"
    },
    ...modalBasic
  });

interface ISetAccessPolicyProps {
  classes: any;
  open: boolean;
  bucketName: string;
  closeModalAndRefresh: () => void;
}

interface ISetAccessPolicyState {
  addLoading: boolean;
  addError: string;
  accessPolicy: string;
}

class SetAccessPolicy extends React.Component<
  ISetAccessPolicyProps,
  ISetAccessPolicyState
> {
  state: ISetAccessPolicyState = {
    addLoading: false,
    addError: "",
    accessPolicy: ""
  };

  addRecord(event: React.FormEvent) {
    event.preventDefault();
    const { addLoading, accessPolicy } = this.state;
    const { bucketName } = this.props;
    if (addLoading) {
      return;
    }
    this.setState({ addLoading: true }, () => {
      api
        .invoke("PUT", `/api/v1/buckets/${bucketName}/set-policy`, {
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
      <ModalWrapper
        title="Change Access Policy"
        modalOpen={open}
        onClose={() => {
          this.setState({ addError: "" }, () => {
            this.props.closeModalAndRefresh();
          });
        }}
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
                <SelectWrapper
                  value={accessPolicy}
                  label="Access Policy"
                  id="select-access-policy"
                  name="select-access-policy"
                  onChange={(e: React.ChangeEvent<{ value: unknown }>) => {
                    this.setState({ accessPolicy: e.target.value as string });
                  }}
                  options={[
                    { value: "PRIVATE", label: "Private" },
                    { value: "PUBLIC", label: "Public" }
                  ]}
                />
              </Grid>
            </Grid>
            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                disabled={addLoading}
              >
                Set
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

export default withStyles(styles)(SetAccessPolicy);
