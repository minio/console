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
import api from "../../../../common/api";
import { modalBasic } from "../../Common/FormComponents/common/styleLibrary";
import ModalWrapper from "../../Common/ModalWrapper/ModalWrapper";
import InputBoxWrapper from "../../Common/FormComponents/InputBoxWrapper/InputBoxWrapper";
import SelectWrapper from "../../Common/FormComponents/SelectWrapper/SelectWrapper";

const styles = (theme: Theme) =>
  createStyles({
    errorBlock: {
      color: "red",
    },
    minTableHeader: {
      color: "#393939",
      "& tr": {
        "& th": {
          fontWeight: "bold",
        },
      },
    },
    buttonContainer: {
      textAlign: "right",
    },
    ...modalBasic,
  });

interface IEnableBucketEncryptionProps {
  classes: any;
  open: boolean;
  selectedBucket: string;
  closeModalAndRefresh: () => void;
}

interface IEnableBucketEncryptionState {
  loading: boolean;
  encryptionError: string;
  kmsKeyID: string;
  suffix: string;
  encryptionType: string;
}

class EnableBucketEncryption extends React.Component<
  IEnableBucketEncryptionProps,
  IEnableBucketEncryptionState
> {
  state: IEnableBucketEncryptionState = {
    loading: false,
    encryptionError: "",
    kmsKeyID: "",
    suffix: "",
    encryptionType: "sse-s3",
  };

  enableBucketEncryption(event: React.FormEvent) {
    event.preventDefault();
    const { kmsKeyID, loading, encryptionType } = this.state;
    const { selectedBucket } = this.props;
    if (loading) {
      return;
    }
    api
      .invoke("POST", `/api/v1/buckets/${selectedBucket}/encryption/enable`, {
        encType: encryptionType,
        kmsKeyID: kmsKeyID,
      })
      .then(() => {
        this.setState(
          {
            loading: false,
            encryptionError: "",
          },
          () => {
            this.props.closeModalAndRefresh();
          }
        );
      })
      .catch((err: any) => {
        this.setState({ encryptionError: err });
      });
  }

  render() {
    const { classes, open } = this.props;
    const { loading, encryptionError, kmsKeyID, encryptionType } = this.state;

    return (
      <ModalWrapper
        modalOpen={open}
        onClose={() => {
          this.setState({ encryptionError: "" }, () => {
            this.props.closeModalAndRefresh();
          });
        }}
        title="Enable Bucket Encryption"
      >
        <form
          noValidate
          autoComplete="off"
          onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
            this.enableBucketEncryption(e);
          }}
        >
          <Grid container>
            <Grid item xs={12} className={classes.formScrollable}>
              {encryptionError !== "" && (
                <Grid item xs={12}>
                  <Typography
                    component="p"
                    variant="body1"
                    className={classes.errorBlock}
                  >
                    {encryptionError}
                  </Typography>
                </Grid>
              )}
              <Grid item xs={12}>
                <SelectWrapper
                  onChange={(e: React.ChangeEvent<{ value: unknown }>) => {
                    this.setState({ encryptionType: e.target.value as string });
                  }}
                  id="select-encryption-type"
                  name="select-encryption-type"
                  label={"Encryption Type"}
                  value={encryptionType}
                  options={[
                    {
                      label: "SSE-S3",
                      value: "sse-s3",
                    },
                    {
                      label: "SSE-KMS",
                      value: "sse-kms",
                    },
                  ]}
                />
              </Grid>
              <Grid item xs={12}>
                <br />
              </Grid>
              {encryptionType === "sse-kms" && (
                <Grid item xs={12}>
                  <InputBoxWrapper
                    id="kms-key-id"
                    name="kms-key-id"
                    label="KMS Key ID"
                    value={kmsKeyID}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      this.setState({ kmsKeyID: e.target.value });
                    }}
                  />
                </Grid>
              )}
              <Grid item xs={12}>
                <br />
              </Grid>
            </Grid>
            <Grid item xs={12} className={classes.buttonContainer}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={loading}
              >
                Save
              </Button>
            </Grid>
            {loading && (
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

export default withStyles(styles)(EnableBucketEncryption);
