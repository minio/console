// This file is part of MinIO Console Server
// Copyright (c) 2021 MinIO, Inc.
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
import { connect } from "react-redux";
import { createStyles, Theme, withStyles } from "@material-ui/core/styles";
import { Button, LinearProgress } from "@material-ui/core";
import get from "lodash/get";
import Grid from "@material-ui/core/Grid";
import { modalBasic } from "../../Common/FormComponents/common/styleLibrary";
import { BulkReplicationResponse } from "../types";
import { setModalErrorSnackMessage } from "../../../../actions";
import InputBoxWrapper from "../../Common/FormComponents/InputBoxWrapper/InputBoxWrapper";
import ModalWrapper from "../../Common/ModalWrapper/ModalWrapper";
import api from "../../../../common/api";

interface IReplicationModal {
  open: boolean;
  closeModalAndRefresh: () => any;
  classes: any;
  bucketName: string;
  setModalErrorSnackMessage: typeof setModalErrorSnackMessage;
}

const styles = (theme: Theme) =>
  createStyles({
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
  setModalErrorSnackMessage,
}: IReplicationModal) => {
  const [addLoading, setAddLoading] = useState(false);
  const [accessKey, setAccessKey] = useState("");
  const [secretKey, setSecretKey] = useState("");
  const [targetURL, setTargetURL] = useState("");
  const [targetBucket, setTargetBucket] = useState("");
  const [region, setRegion] = useState("");

  const addRecord = () => {
    const replicate = [
      {
        originBucket: bucketName,
        destinationBucket: targetBucket,
      },
    ];

    const remoteBucketsInfo = {
      accessKey: accessKey,
      secretKey: secretKey,
      targetURL: targetURL,
      region: region,
      bucketsRelation: replicate,
    };

    api
      .invoke("POST", "/api/v1/buckets-replication", remoteBucketsInfo)
      .then((response: BulkReplicationResponse) => {
        setAddLoading(false);

        const states = get(response, "replicationState", []);

        if (states.length > 0) {
          const itemVal = states[0];

          setAddLoading(false);

          if (itemVal.errorString && itemVal.errorString !== "") {
            setModalErrorSnackMessage(itemVal.errorString);
            return;
          }

          closeModalAndRefresh();

          return;
        }
        setModalErrorSnackMessage("No changes applied");
      })
      .catch((err) => {
        setAddLoading(false);
        setModalErrorSnackMessage(err);
      });
  };

  return (
    <ModalWrapper
      modalOpen={open}
      onClose={() => {
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
            <Grid item xs={12}>
              <InputBoxWrapper
                id="accessKey"
                name="accessKey"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setAccessKey(e.target.value);
                }}
                label="Access Key"
                value={accessKey}
              />
            </Grid>
            <Grid item xs={12}>
              <InputBoxWrapper
                id="secretKey"
                name="secretKey"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setSecretKey(e.target.value);
                }}
                label="Secret Key"
                value={secretKey}
              />
            </Grid>
            <Grid item xs={12}>
              <InputBoxWrapper
                id="targetURL"
                name="targetURL"
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
                id="targetBucket"
                name="targetBucket"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setTargetBucket(e.target.value);
                }}
                label="Target Bucket"
                value={targetBucket}
              />
            </Grid>
            <Grid item xs={12}>
              <InputBoxWrapper
                id="region"
                name="region"
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

const connector = connect(null, {
  setModalErrorSnackMessage,
});

export default withStyles(styles)(connector(AddReplicationModal));
