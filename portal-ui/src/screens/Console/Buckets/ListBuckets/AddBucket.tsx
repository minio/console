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

import React, { Fragment, useEffect, useState } from "react";
import Grid from "@mui/material/Grid";
import { Button, LinearProgress } from "@mui/material";
import { Theme } from "@mui/material/styles";
import createStyles from "@mui/styles/createStyles";
import withStyles from "@mui/styles/withStyles";
import { containerForHeader } from "../../Common/FormComponents/common/styleLibrary";
import api from "../../../../common/api";
import InputBoxWrapper from "../../Common/FormComponents/InputBoxWrapper/InputBoxWrapper";
import RadioGroupSelector from "../../Common/FormComponents/RadioGroupSelector/RadioGroupSelector";
import { getBytes, k8sScalarUnitsExcluding } from "../../../../common/utils";
import { AppState } from "../../../../store";
import history from "../../../../history";
import { connect } from "react-redux";
import {
  addBucketEnableObjectLocking,
  addBucketName,
  addBucketQuota,
  addBucketQuotaSize,
  addBucketQuotaType,
  addBucketQuotaUnit,
  addBucketRetention,
  addBucketRetentionMode,
  addBucketRetentionUnit,
  addBucketRetentionValidity,
  addBucketVersioning,
} from "../actions";
import { useDebounce } from "use-debounce";
import { MakeBucketRequest } from "../types";
import FormSwitchWrapper from "../../Common/FormComponents/FormSwitchWrapper/FormSwitchWrapper";
import { ErrorResponseHandler } from "../../../../common/types";
import PageHeader from "../../Common/PageHeader/PageHeader";
import BackLink from "../../../../common/BackLink";
import { BucketsIcon } from "../../../../icons";
import { setErrorSnackMessage } from "../../../../actions";
import PageLayout from "../../Common/Layout/PageLayout";
import InputUnitMenu from "../../Common/FormComponents/InputUnitMenu/InputUnitMenu";

const styles = (theme: Theme) =>
  createStyles({
    buttonContainer: {
      marginTop: 24,
      textAlign: "right",
      "& .MuiButton-root": {
        marginLeft: 8,
      },
    },
    error: {
      color: "#b53b4b",
      border: "1px solid #b53b4b",
      padding: 8,
      borderRadius: 3,
    },
    title: {
      marginBottom: 8,
    },
    headTitle: {
      fontWeight: "bold",
      fontSize: 16,
      paddingLeft: 8,
    },
    h6title: {
      fontWeight: "bold",
      color: "#000000",
      fontSize: 20,
      paddingBottom: 8,
    },
    ...containerForHeader(theme.spacing(4)),
  });

interface IAddBucketProps {
  classes: any;
  addBucketName: typeof addBucketName;
  addBucketVersioned: typeof addBucketVersioning;
  enableObjectLocking: typeof addBucketEnableObjectLocking;
  addBucketQuota: typeof addBucketQuota;
  addBucketQuotaType: typeof addBucketQuotaType;
  addBucketQuotaSize: typeof addBucketQuotaSize;
  addBucketQuotaUnit: typeof addBucketQuotaUnit;
  addBucketRetention: typeof addBucketRetention;
  addBucketRetentionMode: typeof addBucketRetentionMode;
  addBucketRetentionUnit: typeof addBucketRetentionUnit;
  addBucketRetentionValidity: typeof addBucketRetentionValidity;
  setErrorSnackMessage: typeof setErrorSnackMessage;
  bucketName: string;
  versioningEnabled: boolean;
  lockingEnabled: boolean;
  quotaEnabled: boolean;
  quotaType: string;
  quotaSize: string;
  quotaUnit: string;
  retentionEnabled: boolean;
  retentionMode: string;
  retentionUnit: string;
  retentionValidity: number;
  distributedSetup: boolean;
}

const AddBucket = ({
  classes,
  addBucketName,
  addBucketVersioned,
  enableObjectLocking,
  addBucketQuota,
  addBucketQuotaType,
  addBucketQuotaSize,
  addBucketQuotaUnit,
  addBucketRetention,
  addBucketRetentionMode,
  addBucketRetentionUnit,
  addBucketRetentionValidity,
  setErrorSnackMessage,
  bucketName,
  versioningEnabled,
  lockingEnabled,
  quotaEnabled,
  quotaType,
  quotaSize,
  quotaUnit,
  retentionEnabled,
  retentionMode,
  retentionUnit,
  retentionValidity,
  distributedSetup,
}: IAddBucketProps) => {
  const [addLoading, setAddLoading] = useState<boolean>(false);
  const [sendEnabled, setSendEnabled] = useState<boolean>(false);
  const [lockingFieldDisabled, setLockingFieldDisabled] =
    useState<boolean>(false);

  const addRecord = (event: React.FormEvent) => {
    event.preventDefault();
    if (addLoading) {
      return;
    }
    setAddLoading(true);

    let request: MakeBucketRequest = {
      name: bucketName,
      versioning: distributedSetup ? versioningEnabled : false,
      locking: distributedSetup ? lockingEnabled : false,
    };

    if (distributedSetup) {
      if (quotaEnabled) {
        const amount = getBytes(quotaSize, quotaUnit, true);
        request.quota = {
          enabled: true,
          quota_type: quotaType,
          amount: parseInt(amount),
        };
      }

      if (retentionEnabled) {
        request.retention = {
          mode: retentionMode,
          unit: retentionUnit,
          validity: retentionValidity,
        };
      }
    }

    api
      .invoke("POST", "/api/v1/buckets", request)
      .then((res) => {
        setAddLoading(false);
        const newBucketName = `${bucketName}`;
        resetForm();
        history.push(`/buckets/${newBucketName}/browse`);
      })
      .catch((err: ErrorResponseHandler) => {
        setAddLoading(false);
        setErrorSnackMessage(err);
      });
  };

  const [value] = useDebounce(bucketName, 1000);

  useEffect(() => {
    addBucketName(value);
  }, [value, addBucketName]);

  const resetForm = () => {
    addBucketName("");
    addBucketVersioned(false);
    enableObjectLocking(false);
    addBucketQuota(false);
    addBucketQuotaType("hard");
    addBucketQuotaSize("1");
    addBucketQuotaUnit("TiB");
    addBucketRetention(false);
    addBucketRetentionMode("compliance");
    addBucketRetentionUnit("days");
    addBucketRetentionValidity(1);
  };

  useEffect(() => {
    let valid = false;

    if (bucketName.trim() !== "") {
      valid = true;
    }

    if (quotaEnabled && valid) {
      if (quotaSize.trim() === "" || parseInt(quotaSize) === 0) {
        valid = false;
      }
    }

    if (!versioningEnabled || !retentionEnabled) {
      addBucketRetention(false);
      addBucketRetentionMode("compliance");
      addBucketRetentionUnit("days");
      addBucketRetentionValidity(1);
    }

    if (retentionEnabled) {
      // if retention is enabled, then objec locking should be enabled as well
      enableObjectLocking(true);
      setLockingFieldDisabled(true);
    } else {
      setLockingFieldDisabled(false);
    }

    if (
      retentionEnabled &&
      (Number.isNaN(retentionValidity) || retentionValidity < 1)
    ) {
      valid = false;
    }

    setSendEnabled(valid);
  }, [
    bucketName,
    retentionEnabled,
    lockingEnabled,
    quotaType,
    quotaSize,
    quotaUnit,
    quotaEnabled,
    addBucketRetention,
    addBucketRetentionMode,
    addBucketRetentionUnit,
    addBucketRetentionValidity,
    retentionValidity,
    versioningEnabled,
    enableObjectLocking,
  ]);

  return (
    <Fragment>
      <PageHeader label={"Create a Bucket"} />
      <BackLink label={"Return to Buckets"} to={"/buckets"} />
      <PageLayout>
        <Grid item xs={12} className={classes.boxy}>
          <form
            noValidate
            autoComplete="off"
            onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
              addRecord(e);
            }}
          >
            <Grid container>
              <Grid item xs={12} container className={classes.title}>
                <Grid item xs={"auto"}>
                  <BucketsIcon />
                </Grid>
                <Grid item xs className={classes.headTitle}>
                  Create Bucket
                </Grid>
              </Grid>
              <Grid item xs={12} container>
                <Grid item xs={12}>
                  <InputBoxWrapper
                    id="bucket-name"
                    name="bucket-name"
                    autoFocus={true}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                      addBucketName(event.target.value);
                    }}
                    label="Bucket Name"
                    value={bucketName}
                  />
                </Grid>
                <Grid item xs={12}>
                  <div className={classes.h6title}>Features</div>
                  <br />
                  {!distributedSetup && (
                    <Fragment>
                      <div className={classes.error}>
                        These features are unavailable in a single-disk setup.
                        <br />
                        Please deploy a server in{" "}
                        <a
                          href="https://docs.min.io/minio/baremetal/installation/deploy-minio-distributed.html?ref=con"
                          target="_blank"
                          rel="noreferrer"
                        >
                          Distributed Mode
                        </a>{" "}
                        to use these features.
                      </div>
                      <br />
                      <br />
                    </Fragment>
                  )}
                </Grid>

                <Grid item xs={12}>
                  <FormSwitchWrapper
                    value="versioned"
                    id="versioned"
                    name="versioned"
                    checked={versioningEnabled}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                      addBucketVersioned(event.target.checked);
                    }}
                    description={
                      "Allows to keep multiple versions of the same object under the same key."
                    }
                    label={"Versioning"}
                    disabled={!distributedSetup || lockingEnabled}
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormSwitchWrapper
                    value="locking"
                    id="locking"
                    name="locking"
                    disabled={lockingFieldDisabled || !distributedSetup}
                    checked={lockingEnabled}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                      enableObjectLocking(event.target.checked);
                      if (event.target.checked) {
                        addBucketVersioned(true);
                      }
                    }}
                    label={"Object Locking"}
                    description={
                      "Required to support retention and legal hold. Can only be enabled at bucket creation."
                    }
                  />
                </Grid>

                <Grid item xs={12}>
                  <FormSwitchWrapper
                    value="bucket_quota"
                    id="bucket_quota"
                    name="bucket_quota"
                    checked={quotaEnabled}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                      addBucketQuota(event.target.checked);
                    }}
                    label={"Quota"}
                    description={"Limit the amount of data in the bucket."}
                    disabled={!distributedSetup}
                  />
                </Grid>
                {quotaEnabled && distributedSetup && (
                  <React.Fragment>
                    <Grid item xs={12}>
                      <InputBoxWrapper
                        type="number"
                        id="quota_size"
                        name="quota_size"
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                          if (e.target.validity.valid) {
                            addBucketQuotaSize(e.target.value);
                          }
                        }}
                        label="Quota"
                        value={quotaSize}
                        required
                        min="1"
                        pattern={"[0-9]*"}
                        overlayObject={
                          <InputUnitMenu
                            id={"quota_unit"}
                            onUnitChange={(newValue) => {
                              addBucketQuotaUnit(newValue);
                            }}
                            unitSelected={quotaUnit}
                            unitsList={k8sScalarUnitsExcluding(["Ki"])}
                            disabled={false}
                          />
                        }
                      />
                    </Grid>
                  </React.Fragment>
                )}
                {versioningEnabled && distributedSetup && (
                  <Grid item xs={12}>
                    <FormSwitchWrapper
                      value="bucket_retention"
                      id="bucket_retention"
                      name="bucket_retention"
                      checked={retentionEnabled}
                      onChange={(
                        event: React.ChangeEvent<HTMLInputElement>
                      ) => {
                        addBucketRetention(event.target.checked);
                      }}
                      label={"Retention"}
                      description={
                        "Impose rules to prevent object deletion for a period of time."
                      }
                    />
                  </Grid>
                )}
                {retentionEnabled && distributedSetup && (
                  <React.Fragment>
                    <Grid item xs={12}>
                      <RadioGroupSelector
                        currentSelection={retentionMode}
                        id="retention_mode"
                        name="retention_mode"
                        label="Retention Mode"
                        onChange={(
                          e: React.ChangeEvent<{ value: unknown }>
                        ) => {
                          addBucketRetentionMode(e.target.value as string);
                        }}
                        selectorOptions={[
                          { value: "compliance", label: "Compliance" },
                          { value: "governance", label: "Governance" },
                        ]}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <RadioGroupSelector
                        currentSelection={retentionUnit}
                        id="retention_unit"
                        name="retention_unit"
                        label="Retention Unit"
                        onChange={(
                          e: React.ChangeEvent<{ value: unknown }>
                        ) => {
                          addBucketRetentionUnit(e.target.value as string);
                        }}
                        selectorOptions={[
                          { value: "days", label: "Days" },
                          { value: "years", label: "Years" },
                        ]}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <InputBoxWrapper
                        type="number"
                        id="retention_validity"
                        name="retention_validity"
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                          addBucketRetentionValidity(e.target.valueAsNumber);
                        }}
                        label="Retention Validity"
                        value={String(retentionValidity)}
                        required
                        min="1"
                      />
                    </Grid>
                  </React.Fragment>
                )}
              </Grid>
              <Grid item xs={12} className={classes.buttonContainer}>
                <Button
                  type="button"
                  variant={"outlined"}
                  className={classes.clearButton}
                  onClick={resetForm}
                >
                  Clear
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={addLoading || !sendEnabled}
                >
                  Create Bucket
                </Button>
              </Grid>
              {addLoading && (
                <Grid item xs={12}>
                  <LinearProgress />
                </Grid>
              )}
            </Grid>
          </form>
        </Grid>
      </PageLayout>
    </Fragment>
  );
};

const mapState = (state: AppState) => ({
  addBucketModalOpen: state.buckets.open,
  bucketName: state.buckets.addBucketName,
  versioningEnabled: state.buckets.addBucketVersioningEnabled,
  lockingEnabled: state.buckets.addBucketLockingEnabled,
  quotaEnabled: state.buckets.addBucketQuotaEnabled,
  quotaType: state.buckets.addBucketQuotaType,
  quotaSize: state.buckets.addBucketQuotaSize,
  quotaUnit: state.buckets.addBucketQuotaUnit,
  retentionEnabled: state.buckets.addBucketRetentionEnabled,
  retentionMode: state.buckets.addBucketRetentionMode,
  retentionUnit: state.buckets.addBucketRetentionUnit,
  retentionValidity: state.buckets.addBucketRetentionValidity,
  distributedSetup: state.system.distributedSetup,
});

const connector = connect(mapState, {
  addBucketName: addBucketName,
  addBucketVersioned: addBucketVersioning,
  enableObjectLocking: addBucketEnableObjectLocking,
  addBucketQuota: addBucketQuota,
  addBucketQuotaType: addBucketQuotaType,
  addBucketQuotaSize: addBucketQuotaSize,
  addBucketQuotaUnit: addBucketQuotaUnit,
  addBucketRetention: addBucketRetention,
  addBucketRetentionMode: addBucketRetentionMode,
  addBucketRetentionUnit: addBucketRetentionUnit,
  addBucketRetentionValidity: addBucketRetentionValidity,
  setErrorSnackMessage: setErrorSnackMessage,
});

export default connector(withStyles(styles)(AddBucket));
