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

import React, { useState, useEffect } from "react";
import get from "lodash/get";
import ModalWrapper from "../../Common/ModalWrapper/ModalWrapper";
import { createStyles, Theme, withStyles } from "@material-ui/core/styles";
import { modalBasic } from "../../Common/FormComponents/common/styleLibrary";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import InputBoxWrapper from "../../Common/FormComponents/InputBoxWrapper/InputBoxWrapper";
import SelectWrapper from "../../Common/FormComponents/SelectWrapper/SelectWrapper";
import { Button, LinearProgress } from "@material-ui/core";
import api from "../../../../common/api";
import {
  IRemoteBucket,
  IRemoteBucketsResponse,
} from "../../RemoteBuckets/types";
import RemoteBucketsList from "../../RemoteBuckets/RemoteBuckets";

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
  const [loadingForm, setLoadingForm] = useState(true);
  const [addLoading, setAddLoading] = useState(false);
  const [remoteURL, setRemoteURL] = useState("");
  const [source, setSource] = useState("");
  const [target, setTarget] = useState("");
  const [ARN, setARN] = useState("");
  const [arnValues, setARNValues] = useState([]);

  useEffect(() => {
    if (addLoading) {
      addRecord();
    }
  }, [addLoading]);

  useEffect(() => {
    if (loadingForm) {
      getARNValues();
    }
  });

  const addRecord = () => {
    const replicationInfo = {
      destination_bucket: target,
      arn: ARN,
    };

    api
      .invoke(
        "POST",
        `/api/v1/buckets/${bucketName}/replication`,
        replicationInfo
      )
      .then((res) => {
        setAddLoading(false);
        setAddError("");
        closeModalAndRefresh();
      })
      .catch((err) => {
        setAddLoading(false);
        setAddError(err);
      });
  };

  const getARNValues = () => {
    api
      .invoke("GET", "/api/v1/remote-buckets")
      .then((res: any) => {
        const remoteBuckets = get(res, "buckets", []);

        const remoteARNS = remoteBuckets.map((itemRemote: IRemoteBucket) => {
          return { label: itemRemote.remoteARN, value: itemRemote.remoteARN };
        });
        setLoadingForm(false);
        setARNValues(remoteARNS);
      })
      .catch((err) => {
        setLoadingForm(false);
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
        }}
      >
        {loadingForm && (
          <Grid container>
            <Grid item xs={12}>
              <LinearProgress />
            </Grid>
          </Grid>
        )}
        {!loadingForm && (
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
                    setTarget(e.target.value);
                  }}
                  label="Destination Bucket"
                  value={target}
                />
              </Grid>
              <Grid item xs={12}>
                <SelectWrapper
                  onChange={(e: React.ChangeEvent<{ value: unknown }>) => {
                    setARN(e.target.value as string);
                  }}
                  id="arn"
                  name="arn"
                  label={"ARN"}
                  value={ARN}
                  options={arnValues}
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
        )}
      </form>
    </ModalWrapper>
  );
};

export default withStyles(styles)(AddReplicationModal);
