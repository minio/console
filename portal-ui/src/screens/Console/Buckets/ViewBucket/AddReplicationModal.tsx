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

import React, { useState } from "react";
import get from "lodash/get";
import ModalWrapper from "../../Common/ModalWrapper/ModalWrapper";
import { createStyles, Theme, withStyles } from "@material-ui/core/styles";
import { modalBasic } from "../../Common/FormComponents/common/styleLibrary";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import InputBoxWrapper from "../../Common/FormComponents/InputBoxWrapper/InputBoxWrapper";
import { Button, LinearProgress } from "@material-ui/core";
import api from "../../../../common/api";
import { IRemoteBucket } from "../types";

interface IReplicationModal {
  open: boolean;
  closeModalAndRefresh: () => any;
  classes: any;
  bucketName: string;
}

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

const AddReplicationModal = ({
  open,
  closeModalAndRefresh,
  classes,
  bucketName,
}: IReplicationModal) => {
  const [addError, setAddError] = useState("");
  const [addLoading, setAddLoading] = useState(false);
  const [accessKey, setAccessKey] = useState("");
  const [secretKey, setSecretKey] = useState("");
  const [targetURL, setTargetURL] = useState("");
  const [targetBucket, setTargetBucket] = useState("");
  const [region, setRegion] = useState("");

  const addRecord = () => {
    const remoteBucketInfo = {
      accessKey: accessKey,
      secretKey: secretKey,
      sourceBucket: bucketName,
      targetURL: targetURL,
      targetBucket: targetBucket,
      region: region,
    };

    api
      .invoke("POST", "/api/v1/remote-buckets", remoteBucketInfo)
      .then(() => {
        api
          .invoke("GET", "/api/v1/remote-buckets")
          .then((res: any) => {
            const remoteBuckets = get(res, "buckets", []);
            const remoteBucket = remoteBuckets.find(
              (itemRemote: IRemoteBucket) => {
                return itemRemote.sourceBucket === bucketName;
              }
            );
            if (remoteBucket && remoteBucket.remoteARN) {
              const remoteARN = remoteBucket.remoteARN;
              const replicationInfo = {
                destination_bucket: targetBucket,
                arn: remoteARN,
              };
              api
                .invoke(
                  "POST",
                  `/api/v1/buckets/${bucketName}/replication`,
                  replicationInfo
                )
                .then(() => {
                  setAddLoading(false);
                  setAddError("");
                  closeModalAndRefresh();
                })
                .catch((err) => {
                  setAddLoading(false);
                  setAddError(err);
                });
            }
          })
          .catch((err) => {
            setAddError(err);
          });
      })
      .catch((err) => {
        setAddLoading(false);
        setAddError(err);
      });
  };

  return (
    <ModalWrapper
      modalOpen={open}
      onClose={() => {
        setAddError("");
        closeModalAndRefresh();
      }}
      title="Set Bucket Replication"
    >
      <form
        noValidate
        autoComplete="off"
        onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
          e.preventDefault();
          setAddLoading(true);
          addRecord();
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
                id="target"
                name="target"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setAccessKey(e.target.value);
                }}
                label="Access Key"
                value={accessKey}
              />
            </Grid>
            <Grid item xs={12}>
              <InputBoxWrapper
                id="target"
                name="target"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setSecretKey(e.target.value);
                }}
                label="Secret Key"
                value={secretKey}
              />
            </Grid>
            <Grid item xs={12}>
              <InputBoxWrapper
                id="target"
                name="target"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setTargetURL(e.target.value);
                }}
                placeholder="https://play.min.io:9000"
                label="Target URL"
                value={targetURL}
              />
            </Grid>
            <Grid item xs={12}>
              <InputBoxWrapper
                id="target"
                name="target"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setTargetBucket(e.target.value);
                }}
                label="Target Bucket"
                value={targetBucket}
              />
            </Grid>
            <Grid item xs={12}>
              <InputBoxWrapper
                id="target"
                name="target"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setRegion(e.target.value);
                }}
                label="Region"
                value={region}
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
};

export default withStyles(styles)(AddReplicationModal);
