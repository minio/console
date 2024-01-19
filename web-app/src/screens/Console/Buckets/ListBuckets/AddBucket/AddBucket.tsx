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
import styled from "styled-components";
import get from "lodash/get";

import { useNavigate } from "react-router-dom";
import {
  BackLink,
  Box,
  BucketsIcon,
  Button,
  FormLayout,
  Grid,
  HelpBox,
  InfoIcon,
  InputBox,
  PageLayout,
  RadioGroup,
  Switch,
  SectionTitle,
  ProgressBar,
} from "mds";
import { k8sScalarUnitsExcluding } from "../../../../../common/utils";
import { AppState, useAppDispatch } from "../../../../../store";
import { useSelector } from "react-redux";
import {
  selDistSet,
  selSiteRep,
  setErrorSnackMessage,
  setHelpName,
} from "../../../../../systemSlice";
import InputUnitMenu from "../../../Common/FormComponents/InputUnitMenu/InputUnitMenu";
import TooltipWrapper from "../../../Common/TooltipWrapper/TooltipWrapper";
import {
  resetForm,
  setEnableObjectLocking,
  setExcludedPrefixes,
  setExcludeFolders,
  setIsDirty,
  setName,
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
import {
  IAM_SCOPES,
  permissionTooltipHelper,
} from "../../../../../common/SecureComponent/permissions";
import { hasPermission } from "../../../../../common/SecureComponent";
import BucketNamingRules from "./BucketNamingRules";
import PageHeaderWrapper from "../../../Common/PageHeaderWrapper/PageHeaderWrapper";
import { api } from "../../../../../api";
import { ObjectRetentionMode } from "../../../../../api/consoleApi";
import { errorToHandler } from "../../../../../api/errors";
import HelpMenu from "../../../HelpMenu";
import CSVMultiSelector from "../../../Common/FormComponents/CSVMultiSelector/CSVMultiSelector";

const ErrorBox = styled.div(({ theme }) => ({
  color: get(theme, "signalColors.danger", "#C51B3F"),
  border: `1px solid ${get(theme, "signalColors.danger", "#C51B3F")}`,
  padding: 8,
  borderRadius: 3,
}));

const AddBucket = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const validBucketCharacters = new RegExp(
    `^[a-z0-9][a-z0-9\\.\\-]{1,61}[a-z0-9]$`,
  );
  const ipAddressFormat = new RegExp(`^(\\d+\\.){3}\\d+$`);
  const bucketName = useSelector((state: AppState) => state.addBucket.name);
  const isDirty = useSelector((state: AppState) => state.addBucket.isDirty);
  const [validationResult, setValidationResult] = useState<boolean[]>([]);
  const errorList = validationResult.filter((v) => !v);
  const hasErrors = errorList.length > 0;
  const [records, setRecords] = useState<string[]>([]);
  const versioningEnabled = useSelector(
    (state: AppState) => state.addBucket.versioningEnabled,
  );
  const excludeFolders = useSelector(
    (state: AppState) => state.addBucket.excludeFolders,
  );
  const excludedPrefixes = useSelector(
    (state: AppState) => state.addBucket.excludedPrefixes,
  );
  const lockingEnabled = useSelector(
    (state: AppState) => state.addBucket.lockingEnabled,
  );
  const quotaEnabled = useSelector(
    (state: AppState) => state.addBucket.quotaEnabled,
  );
  const quotaSize = useSelector((state: AppState) => state.addBucket.quotaSize);
  const quotaUnit = useSelector((state: AppState) => state.addBucket.quotaUnit);
  const retentionEnabled = useSelector(
    (state: AppState) => state.addBucket.retentionEnabled,
  );
  const retentionMode = useSelector(
    (state: AppState) => state.addBucket.retentionMode,
  );
  const retentionUnit = useSelector(
    (state: AppState) => state.addBucket.retentionUnit,
  );
  const retentionValidity = useSelector(
    (state: AppState) => state.addBucket.retentionValidity,
  );
  const addLoading = useSelector((state: AppState) => state.addBucket.loading);
  const invalidFields = useSelector(
    (state: AppState) => state.addBucket.invalidFields,
  );
  const lockingFieldDisabled = useSelector(
    (state: AppState) => state.addBucket.lockingFieldDisabled,
  );
  const distributedSetup = useSelector(selDistSet);
  const siteReplicationInfo = useSelector(selSiteRep);
  const navigateTo = useSelector(
    (state: AppState) => state.addBucket.navigateTo,
  );

  const lockingAllowed = hasPermission(
    "*",
    [
      IAM_SCOPES.S3_PUT_BUCKET_VERSIONING,
      IAM_SCOPES.S3_PUT_BUCKET_OBJECT_LOCK_CONFIGURATION,
      IAM_SCOPES.S3_PUT_ACTIONS,
    ],
    true,
  );

  const versioningAllowed = hasPermission("*", [
    IAM_SCOPES.S3_PUT_BUCKET_VERSIONING,
    IAM_SCOPES.S3_PUT_ACTIONS,
  ]);

  useEffect(() => {
    const bucketNameErrors = [
      !(isDirty && (bucketName.length < 3 || bucketName.length > 63)),
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
  }, [bucketName, isDirty]);

  useEffect(() => {
    dispatch(setName(""));
    dispatch(setIsDirty(false));
    const fetchRecords = () => {
      api.buckets
        .listBuckets()
        .then((res) => {
          if (res.data) {
            var bucketList: string[] = [];
            if (res.data.buckets != null && res.data.buckets.length > 0) {
              res.data.buckets.forEach((bucket) => {
                bucketList.push(bucket.name);
              });
            }
            setRecords(bucketList);
          } else if (res.error) {
            dispatch(setErrorSnackMessage(errorToHandler(res.error)));
          }
        })
        .catch((err) => {
          dispatch(setErrorSnackMessage(errorToHandler(err)));
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

  useEffect(() => {
    dispatch(setHelpName("add_bucket"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Fragment>
      <PageHeaderWrapper
        label={
          <BackLink label={"Buckets"} onClick={() => navigate("/buckets")} />
        }
        actions={<HelpMenu />}
      />
      <PageLayout>
        <FormLayout
          title={"Create Bucket"}
          icon={<BucketsIcon />}
          helpBox={
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
                  enabled at bucket creation.
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
            <Box>
              <AddBucketName hasErrors={hasErrors} />
              <Box sx={{ margin: "10px 0" }}>
                <BucketNamingRules errorList={validationResult} />
              </Box>
              <SectionTitle separator>Features</SectionTitle>
              <Box sx={{ marginTop: 10 }}>
                {!distributedSetup && (
                  <Fragment>
                    <ErrorBox>
                      These features are unavailable in a single-disk setup.
                      <br />
                      Please deploy a server in{" "}
                      <a
                        href="https://min.io/docs/minio/linux/operations/install-deploy-manage/deploy-minio-multi-node-multi-drive.html?ref=con"
                        target="_blank"
                        rel="noopener"
                      >
                        Distributed Mode
                      </a>{" "}
                      to use these features.
                    </ErrorBox>
                    <br />
                    <br />
                  </Fragment>
                )}

                {siteReplicationInfo.enabled && (
                  <Fragment>
                    <br />
                    <Box
                      withBorders
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        padding: "10px",
                        "& > .min-icon ": {
                          width: 20,
                          height: 20,
                          marginRight: 10,
                        },
                      }}
                    >
                      <InfoIcon /> Versioning setting cannot be changed as
                      cluster replication is enabled for this site.
                    </Box>
                    <br />
                  </Fragment>
                )}
                <Switch
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
                    siteReplicationInfo.enabled ||
                    !versioningAllowed
                  }
                  tooltip={
                    versioningAllowed
                      ? ""
                      : permissionTooltipHelper(
                          [
                            IAM_SCOPES.S3_PUT_BUCKET_VERSIONING,
                            IAM_SCOPES.S3_PUT_ACTIONS,
                          ],
                          "Versioning",
                        )
                  }
                  helpTip={
                    <Fragment>
                      {lockingEnabled && versioningEnabled && (
                        <strong>
                          {" "}
                          You must disable Object Locking before Versioning can
                          be disabled <br />
                        </strong>
                      )}
                      MinIO supports keeping multiple{" "}
                      <a
                        href="https://min.io/docs/minio/kubernetes/upstream/administration/object-management/object-versioning.html#minio-bucket-versioning"
                        target="blank"
                      >
                        versions
                      </a>{" "}
                      of an object in a single bucket.
                      <br />
                      Versioning is required to enable{" "}
                      <a
                        href="https://min.io/docs/minio/macos/administration/object-management.html#object-retention"
                        target="blank"
                      >
                        Object Locking
                      </a>{" "}
                      and{" "}
                      <a
                        href="https://min.io/docs/minio/macos/administration/object-management/object-retention.html#object-retention-modes"
                        target="blank"
                      >
                        Retention
                      </a>
                      .
                    </Fragment>
                  }
                  helpTipPlacement="right"
                />
                {versioningEnabled && distributedSetup && !lockingEnabled && (
                  <Fragment>
                    <Switch
                      id={"excludeFolders"}
                      label={"Exclude Folders"}
                      checked={excludeFolders}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        dispatch(setExcludeFolders(e.target.checked));
                      }}
                      indicatorLabels={["Enabled", "Disabled"]}
                      helpTip={
                        <Fragment>
                          You can choose to{" "}
                          <a href="https://min.io/docs/minio/windows/administration/object-management/object-versioning.html#exclude-folders-from-versioning">
                            exclude folders and prefixes
                          </a>{" "}
                          from versioning if Object Locking is not enabled.
                          <br />
                          MinIO requires versioning to support replication.
                          <br />
                          Objects in excluded prefixes do not replicate to any
                          peer site or remote site.
                        </Fragment>
                      }
                      helpTipPlacement="right"
                    />
                    <CSVMultiSelector
                      elements={excludedPrefixes}
                      label={"Excluded Prefixes"}
                      name={"excludedPrefixes"}
                      onChange={(value: string | string[]) => {
                        let valCh = "";

                        if (Array.isArray(value)) {
                          valCh = value.join(",");
                        } else {
                          valCh = value;
                        }
                        dispatch(setExcludedPrefixes(valCh));
                      }}
                      withBorder={true}
                    />
                  </Fragment>
                )}
                <Switch
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
                  tooltip={
                    lockingAllowed
                      ? ``
                      : permissionTooltipHelper(
                          [
                            IAM_SCOPES.S3_PUT_BUCKET_VERSIONING,
                            IAM_SCOPES.S3_PUT_BUCKET_OBJECT_LOCK_CONFIGURATION,
                            IAM_SCOPES.S3_PUT_ACTIONS,
                          ],
                          "Locking",
                        )
                  }
                  helpTip={
                    <Fragment>
                      {retentionEnabled && (
                        <strong>
                          {" "}
                          You must disable Retention before Object Locking can
                          be disabled <br />
                        </strong>
                      )}
                      You can only enable{" "}
                      <a
                        href="https://min.io/docs/minio/macos/administration/object-management.html#object-retention"
                        target="blank"
                      >
                        Object Locking
                      </a>{" "}
                      when first creating a bucket.
                      <br />
                      <br />
                      <a href="https://min.io/docs/minio/windows/administration/object-management/object-versioning.html#exclude-folders-from-versioning">
                        Exclude folders and prefixes
                      </a>{" "}
                      options will not be available if this option is enabled.
                    </Fragment>
                  }
                  helpTipPlacement="right"
                />
                <Switch
                  value="bucket_quota"
                  id="bucket_quota"
                  name="bucket_quota"
                  checked={quotaEnabled}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    dispatch(setQuota(event.target.checked));
                  }}
                  label={"Quota"}
                  disabled={!distributedSetup}
                  helpTip={
                    <Fragment>
                      Setting a{" "}
                      <a
                        href="https://min.io/docs/minio/linux/reference/minio-mc/mc-quota-set.html"
                        target="blank"
                      >
                        quota
                      </a>{" "}
                      assigns a hard limit to a bucket beyond which MinIO does
                      not allow writes.
                    </Fragment>
                  }
                  helpTipPlacement="right"
                />
                {quotaEnabled && distributedSetup && (
                  <Fragment>
                    <InputBox
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
                  </Fragment>
                )}
                {versioningEnabled && distributedSetup && lockingAllowed && (
                  <Switch
                    value="bucket_retention"
                    id="bucket_retention"
                    name="bucket_retention"
                    checked={retentionEnabled}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                      dispatch(setRetention(event.target.checked));
                    }}
                    label={"Retention"}
                    helpTip={
                      <Fragment>
                        MinIO supports setting both{" "}
                        <a
                          href="https://min.io/docs/minio/macos/administration/object-management/object-retention.html#configure-bucket-default-object-retention"
                          target="blank"
                        >
                          bucket-default
                        </a>{" "}
                        and per-object retention rules.
                        <br />
                        <br /> For per-object retention settings, defer to the
                        documentation for the PUT operation used by your
                        preferred SDK.
                      </Fragment>
                    }
                    helpTipPlacement="right"
                  />
                )}
                {retentionEnabled && distributedSetup && (
                  <Fragment>
                    <RadioGroup
                      currentValue={retentionMode}
                      id="retention_mode"
                      name="retention_mode"
                      label="Mode"
                      onChange={(e: React.ChangeEvent<{ value: unknown }>) => {
                        dispatch(
                          setRetentionMode(
                            e.target.value as ObjectRetentionMode,
                          ),
                        );
                      }}
                      selectorOptions={[
                        { value: "compliance", label: "Compliance" },
                        { value: "governance", label: "Governance" },
                      ]}
                      helpTip={
                        <Fragment>
                          {" "}
                          <a
                            href="https://min.io/docs/minio/macos/administration/object-management/object-retention.html#minio-object-locking-compliance"
                            target="blank"
                          >
                            Compliance
                          </a>{" "}
                          lock protects Objects from write operations by all
                          users, including the MinIO root user.
                          <br />
                          <br />
                          <a
                            href="https://min.io/docs/minio/macos/administration/object-management/object-retention.html#minio-object-locking-governance"
                            target="blank"
                          >
                            Governance
                          </a>{" "}
                          lock protects Objects from write operations by
                          non-privileged users.
                        </Fragment>
                      }
                      helpTipPlacement="right"
                    />
                    <InputBox
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
                  </Fragment>
                )}
              </Box>
            </Box>
            <Grid
              item
              xs={12}
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                alignItems: "center",
                gap: 10,
                marginTop: 15,
              }}
            >
              <Button
                id={"clear"}
                type="button"
                variant={"regular"}
                className={"clearButton"}
                onClick={resForm}
                label={"Clear"}
              />
              <TooltipWrapper
                tooltip={
                  invalidFields.length > 0 || !isDirty || hasErrors
                    ? "You must apply a valid name to the bucket"
                    : ""
                }
              >
                <Button
                  id={"create-bucket"}
                  type="submit"
                  variant="callAction"
                  color="primary"
                  disabled={
                    addLoading ||
                    invalidFields.length > 0 ||
                    !isDirty ||
                    hasErrors
                  }
                  label={"Create Bucket"}
                />
              </TooltipWrapper>
            </Grid>
            {addLoading && (
              <Grid item xs={12}>
                <ProgressBar />
              </Grid>
            )}
          </form>
        </FormLayout>
      </PageLayout>
    </Fragment>
  );
};

export default AddBucket;
