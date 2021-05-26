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
import SelectWrapper from "../../Common/FormComponents/SelectWrapper/SelectWrapper";
import FormSwitchWrapper from "../../Common/FormComponents/FormSwitchWrapper/FormSwitchWrapper";
import { getBytes, k8sfactorForDropdown } from "../../../../common/utils";

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
    multiContainer: {
      display: "flex",
      alignItems: "center" as const,
      justifyContent: "flex-start" as const,
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
  const [addLoading, setAddLoading] = useState<boolean>(false);
  const [accessKey, setAccessKey] = useState<string>("");
  const [secretKey, setSecretKey] = useState<string>("");
  const [targetURL, setTargetURL] = useState<string>("");
  const [targetBucket, setTargetBucket] = useState<string>("");
  const [region, setRegion] = useState<string>("");
  const [useTLS, setUseTLS] = useState<boolean>(true);
  const [replicationMode, setReplicationMode] = useState<string>("async");
  const [bandwidthScalar, setBandwidthScalar] = useState<string>("100");
  const [bandwidthUnit, setBandwidthUnit] = useState<string>("Gi");
  const [healthCheck, setHealthCheck] = useState<string>("60");

  const addRecord = () => {
    const replicate = [
      {
        originBucket: bucketName,
        destinationBucket: targetBucket,
      },
    ];

    const hc = parseInt(healthCheck);

    const endURL = `${useTLS ? "https://" : "http://"}${targetURL}`;

    const remoteBucketsInfo = {
      accessKey: accessKey,
      secretKey: secretKey,
      targetURL: endURL,
      region: region,
      bucketsRelation: replicate,
      syncMode: replicationMode,
      bandwidth:
        replicationMode === "async"
          ? parseInt(getBytes(bandwidthScalar, bandwidthUnit, true))
          : 0,
      healthCheckPeriod: hc,
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
                placeholder="play.min.io"
                label="Target URL"
                value={targetURL}
              />
            </Grid>
            <Grid item xs={12}>
              <FormSwitchWrapper
                checked={useTLS}
                id="useTLS"
                name="useTLS"
                label="Use TLS"
                onChange={(e) => {
                  setUseTLS(e.target.checked);
                }}
                value="yes"
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
            <Grid item xs={12}>
              <SelectWrapper
                id="replication_mode"
                name="replication_mode"
                onChange={(e: React.ChangeEvent<{ value: unknown }>) => {
                  setReplicationMode(e.target.value as string);
                }}
                label="ReplicationMode"
                value={replicationMode}
                options={[
                  { label: "Asynchronous", value: "async" },
                  { label: "Synchronous", value: "sync" },
                ]}
              />
            </Grid>

            {replicationMode === "async" && (
              <Grid item xs={12}>
                <div className={classes.multiContainer}>
                  <div>
                    <InputBoxWrapper
                      type="number"
                      id="bandwidth_scalar"
                      name="bandwidth_scalar"
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        setBandwidthScalar(e.target.value as string);
                      }}
                      label="Bandwidth"
                      value={bandwidthScalar}
                      min="0"
                    />
                  </div>
                  <div className={classes.sizeFactorContainer}>
                    <SelectWrapper
                      label={"Unit"}
                      id="bandwidth_unit"
                      name="bandwidth_unit"
                      value={bandwidthUnit}
                      onChange={(e: React.ChangeEvent<{ value: unknown }>) => {
                        setBandwidthUnit(e.target.value as string);
                      }}
                      options={k8sfactorForDropdown()}
                    />
                  </div>
                </div>
              </Grid>
            )}
            <Grid item xs={12}>
              <InputBoxWrapper
                id="healthCheck"
                name="healthCheck"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setHealthCheck(e.target.value as string);
                }}
                label="Health Check Duration"
                value={healthCheck}
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
