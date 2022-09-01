// This file is part of MinIO Console Server
// Copyright (c) 2022 MinIO, Inc.
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
import { useNavigate } from "react-router-dom";
import createStyles from "@mui/styles/createStyles";
import withStyles from "@mui/styles/withStyles";
import { containerForHeader } from "../../../Common/FormComponents/common/styleLibrary";
import InputBoxWrapper from "../../../Common/FormComponents/InputBoxWrapper/InputBoxWrapper";
import RadioGroupSelector from "../../../Common/FormComponents/RadioGroupSelector/RadioGroupSelector";
import { k8sScalarUnitsExcluding } from "../../../../../common/utils";
import { AppState, useAppDispatch } from "../../../../../store";
import { useSelector } from "react-redux";
import FormSwitchWrapper from "../../../Common/FormComponents/FormSwitchWrapper/FormSwitchWrapper";
import PageHeader from "../../../Common/PageHeader/PageHeader";
import BackLink from "../../../../../common/BackLink";
import { BucketsIcon, InfoIcon } from "../../../../../icons";
import { setErrorSnackMessage } from "../../../../../systemSlice";
import { ErrorResponseHandler } from "../../../../../common/types";
import { BucketList } from "../../types";
import api from "../../../../../common/api";
import PageLayout from "../../../Common/Layout/PageLayout";
import InputUnitMenu from "../../../Common/FormComponents/InputUnitMenu/InputUnitMenu";
import FormLayout from "../../../Common/FormLayout";
import HelpBox from "../../../../../common/HelpBox";
import SectionTitle from "../../../Common/SectionTitle";
import { selDistSet, selSiteRep } from "../../../../../systemSlice";
import {
  resetForm,
  setEnableObjectLocking,
  setQuota,
  setQuotaSize,
  setQuotaUnit,
  setRetention,
  setRetentionMode,
  setRetentionUnit,
  setRetentionValidity,
  setVersioning,
} from "./addBucketsSlice";
import { addBucketAsync } from "./addBucketThunks";
import AddBucketName from "./AddBucketName";
import { IAM_SCOPES } from "../../../../../common/SecureComponent/permissions";
import { hasPermission } from "../../../../../common/SecureComponent";
import BucketNamingRules from "./BucketNamingRules";

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
    alertVersioning: {
      border: "#E2E2E2 1px solid",
      backgroundColor: "#FBFAFA",
      borderRadius: 3,
      display: "flex",
      alignItems: "center",
      padding: "10px",
      color: "#767676",
      "& > .min-icon ": {
        width: 20,
        height: 20,
        marginRight: 10,
      },
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
    },
    ...containerForHeader(theme.spacing(4)),
  });

interface IsetProps {
  classes: any;
}

const AddBucket = ({ classes }: IsetProps) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const validBucketCharacters = new RegExp(`^[a-z0-9.-]*$`);
  const ipAddressFormat = new RegExp(
    "^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)(.|$)){4}$"
  );
  const bucketName = useSelector((state: AppState) => state.addBucket.name);
  const [validationResult, setValidationResult] = useState<boolean[]>([]);
  const errorList = validationResult.filter((v) => !v);
  const hasErrors = errorList.length > 0;
  const [records, setRecords] = useState<string[]>([]);
  const versioningEnabled = useSelector(
    (state: AppState) => state.addBucket.versioningEnabled
  );
  const lockingEnabled = useSelector(
    (state: AppState) => state.addBucket.lockingEnabled
  );
  const quotaEnabled = useSelector(
    (state: AppState) => state.addBucket.quotaEnabled
  );
  const quotaSize = useSelector((state: AppState) => state.addBucket.quotaSize);
  const quotaUnit = useSelector((state: AppState) => state.addBucket.quotaUnit);
  const retentionEnabled = useSelector(
    (state: AppState) => state.addBucket.retentionEnabled
  );
  const retentionMode = useSelector(
    (state: AppState) => state.addBucket.retentionMode
  );
  const retentionUnit = useSelector(
    (state: AppState) => state.addBucket.retentionUnit
  );
  const retentionValidity = useSelector(
    (state: AppState) => state.addBucket.retentionValidity
  );
  const addLoading = useSelector((state: AppState) => state.addBucket.loading);
  const invalidFields = useSelector(
    (state: AppState) => state.addBucket.invalidFields
  );
  const lockingFieldDisabled = useSelector(
    (state: AppState) => state.addBucket.lockingFieldDisabled
  );
  const distributedSetup = useSelector(selDistSet);
  const siteReplicationInfo = useSelector(selSiteRep);
  const navigateTo = useSelector(
    (state: AppState) => state.addBucket.navigateTo
  );

  const lockingAllowed = hasPermission("*", [
    IAM_SCOPES.S3_PUT_BUCKET_VERSIONING,
    IAM_SCOPES.S3_PUT_BUCKET_OBJECT_LOCK_CONFIGURATION,
  ]);

  useEffect(() => {
    const bucketNameErrors = [
      !(bucketName.length < 3 || bucketName.length > 63),
      validBucketCharacters.test(bucketName),
      !(
        bucketName.includes(".-") ||
        bucketName.includes("-.") ||
        bucketName.includes("..")
      ),
      !ipAddressFormat.test(bucketName),
      !bucketName.startsWith("xn--"),
      !bucketName.endsWith("-s3alias"),
      !records.includes(bucketName),
    ];
    setValidationResult(bucketNameErrors);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bucketName]);

  useEffect(() => {
    const fetchRecords = () => {
      api
        .invoke("GET", `/api/v1/buckets`)
        .then((res: BucketList) => {
          var bucketList: string[] = [];
          if (res.buckets != null && res.buckets.length > 0) {
            res.buckets.forEach((bucket) => {
              bucketList.push(bucket.name);
            });
          }
          setRecords(bucketList);
        })
        .catch((err: ErrorResponseHandler) => {
          dispatch(setErrorSnackMessage(err));
        });
    };
    fetchRecords();
  }, [dispatch]);

  const resForm = () => {
    dispatch(resetForm());
  };

  useEffect(() => {
    if (navigateTo !== "") {
      const goTo = `${navigateTo}`;
      dispatch(resetForm());
      navigate(goTo);
    }
  }, [navigateTo, navigate, dispatch]);

  return (
    <Fragment>
      <PageHeader label={<BackLink to={"/buckets"} label={"Buckets"} />} />
      <PageLayout>
        <FormLayout
          title={"Create Bucket"}
          icon={<BucketsIcon />}
          helpbox={
            <HelpBox
              iconComponent={<BucketsIcon />}
              title={"Buckets"}
              help={
                <Fragment>
                  MinIO uses buckets to organize objects. A bucket is similar to
                  a folder or directory in a filesystem, where each bucket can
                  hold an arbitrary number of objects.
                  <br />
                  <br />
                  <b>Versioning</b> allows to keep multiple versions of the same
                  object under the same key.
                  <br />
                  <br />
                  <b>Object Locking</b> prevents objects from being deleted.
                  Required to support retention and legal hold. Can only be
                  enabled at bucket creation.{" "}
                  {!lockingAllowed ? (
                    <Fragment>
                      <br />
                      <span>
                        To enable this option{" "}
                        <i>s3:PutBucketObjectLockConfiguration</i> and{" "}
                        <i>s3:PutBucketVersioning</i> permissions must be set.
                      </span>
                    </Fragment>
                  ) : (
                    ""
                  )}
                  <br />
                  <br />
                  <b>Quota</b> limits the amount of data in the bucket.
                  {lockingAllowed && (
                    <Fragment>
                      <br />
                      <br />
                      <b>Retention</b> imposes rules to prevent object deletion
                      for a period of time. Versioning must be enabled in order
                      to set bucket retention policies.
                    </Fragment>
                  )}
                  <br />
                  <br />
                </Fragment>
              }
            />
          }
        >
          <form
            noValidate
            autoComplete="off"
            onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
              e.preventDefault();
              dispatch(addBucketAsync());
            }}
          >
            <Grid container marginTop={1} spacing={2}>
              <Grid item xs={12}>
                <AddBucketName hasErrors={hasErrors} />
              </Grid>
              <Grid item xs={12}>
                <BucketNamingRules errorList={validationResult} />
              </Grid>
              <Grid item xs={12}>
                <SectionTitle>Features</SectionTitle>
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
              <Grid item xs={12} spacing={2}>
                {siteReplicationInfo.enabled && (
                  <Fragment>
                    <br />
                    <div className={classes.alertVersioning}>
                      <InfoIcon /> Versioning setting cannot be changed as
                      cluster replication is enabled for this site.
                    </div>
                    <br />
                  </Fragment>
                )}
                <FormSwitchWrapper
                  value="versioned"
                  id="versioned"
                  name="versioned"
                  checked={versioningEnabled}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    dispatch(setVersioning(event.target.checked));
                  }}
                  label={"Versioning"}
                  disabled={
                    !distributedSetup ||
                    lockingEnabled ||
                    siteReplicationInfo.enabled
                  }
                />
              </Grid>
              <Grid item xs={12}>
                <FormSwitchWrapper
                  value="locking"
                  id="locking"
                  name="locking"
                  disabled={
                    lockingFieldDisabled || !distributedSetup || !lockingAllowed
                  }
                  checked={lockingEnabled}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    dispatch(setEnableObjectLocking(event.target.checked));
                    if (event.target.checked && !siteReplicationInfo.enabled) {
                      dispatch(setVersioning(true));
                    }
                  }}
                  label={"Object Locking"}
                />
              </Grid>

              <Grid item xs={12}>
                <FormSwitchWrapper
                  value="bucket_quota"
                  id="bucket_quota"
                  name="bucket_quota"
                  checked={quotaEnabled}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    dispatch(setQuota(event.target.checked));
                  }}
                  label={"Quota"}
                  disabled={!distributedSetup}
                />
              </Grid>
              {quotaEnabled && distributedSetup && (
                <React.Fragment>
                  <Grid item xs={12}>
                    <InputBoxWrapper
                      type="string"
                      id="quota_size"
                      name="quota_size"
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        dispatch(setQuotaSize(e.target.value));
                      }}
                      label="Capacity"
                      value={quotaSize}
                      required
                      min="1"
                      overlayObject={
                        <InputUnitMenu
                          id={"quota_unit"}
                          onUnitChange={(newValue) => {
                            dispatch(setQuotaUnit(newValue));
                          }}
                          unitSelected={quotaUnit}
                          unitsList={k8sScalarUnitsExcluding(["Ki"])}
                          disabled={false}
                        />
                      }
                      error={
                        invalidFields.includes("quotaSize")
                          ? "Please enter a valid quota"
                          : ""
                      }
                    />
                  </Grid>
                </React.Fragment>
              )}
              {versioningEnabled && distributedSetup && lockingAllowed && (
                <Grid item xs={12}>
                  <FormSwitchWrapper
                    value="bucket_retention"
                    id="bucket_retention"
                    name="bucket_retention"
                    checked={retentionEnabled}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                      dispatch(setRetention(event.target.checked));
                    }}
                    label={"Retention"}
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
                      label="Mode"
                      onChange={(e: React.ChangeEvent<{ value: unknown }>) => {
                        dispatch(setRetentionMode(e.target.value as string));
                      }}
                      selectorOptions={[
                        { value: "compliance", label: "Compliance" },
                        { value: "governance", label: "Governance" },
                      ]}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <InputBoxWrapper
                      type="number"
                      id="retention_validity"
                      name="retention_validity"
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        dispatch(setRetentionValidity(e.target.valueAsNumber));
                      }}
                      label="Validity"
                      value={String(retentionValidity)}
                      required
                      overlayObject={
                        <InputUnitMenu
                          id={"retention_unit"}
                          onUnitChange={(newValue) => {
                            dispatch(setRetentionUnit(newValue));
                          }}
                          unitSelected={retentionUnit}
                          unitsList={[
                            { value: "days", label: "Days" },
                            { value: "years", label: "Years" },
                          ]}
                          disabled={false}
                        />
                      }
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
                onClick={resForm}
              >
                Clear
              </Button>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={addLoading || invalidFields.length > 0 || hasErrors}
              >
                Create Bucket
              </Button>
            </Grid>
            {addLoading && (
              <Grid item xs={12}>
                <LinearProgress />
              </Grid>
            )}
          </form>
        </FormLayout>
      </PageLayout>
    </Fragment>
  );
};

export default withStyles(styles)(AddBucket);
