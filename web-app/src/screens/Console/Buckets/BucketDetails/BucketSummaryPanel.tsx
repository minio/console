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

import get from "lodash/get";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { api } from "api";
import {
  BucketEncryptionInfo,
  BucketQuota,
  BucketVersioningResponse,
  GetBucketRetentionConfig,
} from "api/consoleApi";
import { errorToHandler } from "api/errors";
import {
  Box,
  DisabledIcon,
  EnabledIcon,
  Grid,
  SectionTitle,
  ValuePair,
} from "mds";
import { twoColCssGridLayoutConfig } from "../../Common/FormComponents/common/styleLibrary";
import { IAM_SCOPES } from "../../../../common/SecureComponent/permissions";
import {
  hasPermission,
  SecureComponent,
} from "../../../../common/SecureComponent";
import {
  selDistSet,
  setErrorSnackMessage,
  setHelpName,
} from "../../../../systemSlice";
import {
  selBucketDetailsInfo,
  selBucketDetailsLoading,
  setBucketDetailsLoad,
} from "./bucketDetailsSlice";
import { useAppDispatch } from "../../../../store";
import VersioningInfo from "../VersioningInfo";
import withSuspense from "../../Common/Components/withSuspense";
import LabelWithIcon from "./SummaryItems/LabelWithIcon";
import EditablePropertyItem from "./SummaryItems/EditablePropertyItem";
import ReportedUsage from "./SummaryItems/ReportedUsage";
import BucketQuotaSize from "./SummaryItems/BucketQuotaSize";

const SetAccessPolicy = withSuspense(
  React.lazy(() => import("./SetAccessPolicy")),
);
const SetRetentionConfig = withSuspense(
  React.lazy(() => import("./SetRetentionConfig")),
);
const EnableBucketEncryption = withSuspense(
  React.lazy(() => import("./EnableBucketEncryption")),
);
const EnableVersioningModal = withSuspense(
  React.lazy(() => import("./EnableVersioningModal")),
);
const BucketTags = withSuspense(
  React.lazy(() => import("./SummaryItems/BucketTags")),
);
const EnableQuota = withSuspense(React.lazy(() => import("./EnableQuota")));

const BucketSummary = () => {
  const dispatch = useAppDispatch();
  const params = useParams();

  const loadingBucket = useSelector(selBucketDetailsLoading);
  const bucketInfo = useSelector(selBucketDetailsInfo);
  const distributedSetup = useSelector(selDistSet);

  const [encryptionCfg, setEncryptionCfg] =
    useState<BucketEncryptionInfo | null>(null);
  const [bucketSize, setBucketSize] = useState<number | "0">("0");
  const [hasObjectLocking, setHasObjectLocking] = useState<boolean | undefined>(
    false,
  );
  const [accessPolicyScreenOpen, setAccessPolicyScreenOpen] =
    useState<boolean>(false);
  const [replicationRules, setReplicationRules] = useState<boolean>(false);
  const [loadingObjectLocking, setLoadingLocking] = useState<boolean>(true);
  const [loadingSize, setLoadingSize] = useState<boolean>(true);
  const [bucketLoading, setBucketLoading] = useState<boolean>(true);
  const [loadingEncryption, setLoadingEncryption] = useState<boolean>(true);
  const [loadingVersioning, setLoadingVersioning] = useState<boolean>(true);
  const [loadingQuota, setLoadingQuota] = useState<boolean>(true);
  const [loadingReplication, setLoadingReplication] = useState<boolean>(true);
  const [loadingRetention, setLoadingRetention] = useState<boolean>(true);
  const [versioningInfo, setVersioningInfo] =
    useState<BucketVersioningResponse>();
  const [quotaEnabled, setQuotaEnabled] = useState<boolean>(false);
  const [quota, setQuota] = useState<BucketQuota | null>(null);
  const [encryptionEnabled, setEncryptionEnabled] = useState<boolean>(false);
  const [retentionEnabled, setRetentionEnabled] = useState<boolean>(false);
  const [retentionConfig, setRetentionConfig] =
    useState<GetBucketRetentionConfig | null>(null);
  const [retentionConfigOpen, setRetentionConfigOpen] =
    useState<boolean>(false);
  const [enableEncryptionScreenOpen, setEnableEncryptionScreenOpen] =
    useState<boolean>(false);
  const [enableQuotaScreenOpen, setEnableQuotaScreenOpen] =
    useState<boolean>(false);
  const [enableVersioningOpen, setEnableVersioningOpen] =
    useState<boolean>(false);
  useEffect(() => {
    dispatch(setHelpName("bucket_detail_summary"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const bucketName = params.bucketName || "";

  let accessPolicy = "PRIVATE";
  let policyDefinition = "";

  if (bucketInfo !== null && bucketInfo.access && bucketInfo.definition) {
    accessPolicy = bucketInfo.access;
    policyDefinition = bucketInfo.definition;
  }

  const displayGetBucketObjectLockConfiguration = hasPermission(bucketName, [
    IAM_SCOPES.S3_GET_BUCKET_OBJECT_LOCK_CONFIGURATION,
    IAM_SCOPES.S3_GET_ACTIONS,
  ]);

  const displayGetBucketEncryptionConfiguration = hasPermission(bucketName, [
    IAM_SCOPES.S3_GET_BUCKET_ENCRYPTION_CONFIGURATION,
    IAM_SCOPES.S3_GET_ACTIONS,
  ]);

  const displayGetBucketQuota = hasPermission(bucketName, [
    IAM_SCOPES.ADMIN_GET_BUCKET_QUOTA,
  ]);

  useEffect(() => {
    if (loadingBucket) {
      setBucketLoading(true);
    } else {
      setBucketLoading(false);
    }
  }, [loadingBucket, setBucketLoading]);

  useEffect(() => {
    if (loadingEncryption) {
      if (displayGetBucketEncryptionConfiguration) {
        api.buckets
          .getBucketEncryptionInfo(bucketName)
          .then((res) => {
            if (res.data.algorithm) {
              setEncryptionEnabled(true);
              setEncryptionCfg(res.data);
            }
            setLoadingEncryption(false);
          })
          .catch((err) => {
            err = errorToHandler(err.error);
            if (
              err.errorMessage ===
              "The server side encryption configuration was not found"
            ) {
              setEncryptionEnabled(false);
              setEncryptionCfg(null);
            }
            setLoadingEncryption(false);
          });
      } else {
        setEncryptionEnabled(false);
        setEncryptionCfg(null);
        setLoadingEncryption(false);
      }
    }
  }, [loadingEncryption, bucketName, displayGetBucketEncryptionConfiguration]);

  useEffect(() => {
    if (loadingVersioning && distributedSetup) {
      api.buckets
        .getBucketVersioning(bucketName)
        .then((res) => {
          setVersioningInfo(res.data);
          setLoadingVersioning(false);
        })
        .catch((err) => {
          dispatch(setErrorSnackMessage(errorToHandler(err.error)));
          setLoadingVersioning(false);
        });
    }
  }, [loadingVersioning, dispatch, bucketName, distributedSetup]);

  useEffect(() => {
    if (loadingQuota && distributedSetup) {
      if (displayGetBucketQuota) {
        api.buckets
          .getBucketQuota(bucketName)
          .then((res) => {
            setQuota(res.data);
            if (res.data.quota) {
              setQuotaEnabled(true);
            } else {
              setQuotaEnabled(false);
            }
            setLoadingQuota(false);
          })
          .catch((err) => {
            dispatch(setErrorSnackMessage(errorToHandler(err.error)));
            setQuotaEnabled(false);
            setLoadingQuota(false);
          });
      } else {
        setQuotaEnabled(false);
        setLoadingQuota(false);
      }
    }
  }, [
    loadingQuota,
    setLoadingVersioning,
    dispatch,
    bucketName,
    distributedSetup,
    displayGetBucketQuota,
  ]);

  useEffect(() => {
    if (loadingVersioning && distributedSetup) {
      if (displayGetBucketObjectLockConfiguration) {
        api.buckets
          .getBucketObjectLockingStatus(bucketName)
          .then((res) => {
            setHasObjectLocking(res.data.object_locking_enabled);
            setLoadingLocking(false);
          })
          .catch((err) => {
            dispatch(setErrorSnackMessage(errorToHandler(err.error)));
            setLoadingLocking(false);
          });
      } else {
        setLoadingLocking(false);
      }
    }
  }, [
    loadingObjectLocking,
    dispatch,
    bucketName,
    loadingVersioning,
    distributedSetup,
    displayGetBucketObjectLockConfiguration,
  ]);

  useEffect(() => {
    if (loadingSize) {
      api.buckets
        .listBuckets()
        .then((res) => {
          const resBuckets = get(res.data, "buckets", []);

          const bucketInfo = resBuckets.find(
            (bucket) => bucket.name === bucketName,
          );

          const size = get(bucketInfo, "size", "0");

          setLoadingSize(false);
          setBucketSize(size);
        })
        .catch((err) => {
          setLoadingSize(false);
          dispatch(setErrorSnackMessage(errorToHandler(err.error)));
        });
    }
  }, [loadingSize, dispatch, bucketName]);

  useEffect(() => {
    if (loadingReplication && distributedSetup) {
      api.buckets
        .getBucketReplication(bucketName)
        .then((res) => {
          const r = res.data.rules ? res.data.rules : [];
          setReplicationRules(r.length > 0);
          setLoadingReplication(false);
        })
        .catch((err) => {
          dispatch(setErrorSnackMessage(errorToHandler(err.error)));
          setLoadingReplication(false);
        });
    }
  }, [loadingReplication, dispatch, bucketName, distributedSetup]);

  useEffect(() => {
    if (loadingRetention && hasObjectLocking) {
      api.buckets
        .getBucketRetentionConfig(bucketName)
        .then((res) => {
          setLoadingRetention(false);
          setRetentionEnabled(true);
          setRetentionConfig(res.data);
        })
        .catch((err) => {
          setRetentionEnabled(false);
          setLoadingRetention(false);
          setRetentionConfig(null);
        });
    }
  }, [loadingRetention, hasObjectLocking, bucketName]);

  const loadAllBucketData = () => {
    dispatch(setBucketDetailsLoad(true));
    setBucketLoading(true);
    setLoadingSize(true);
    setLoadingVersioning(true);
    setLoadingEncryption(true);
    setLoadingRetention(true);
  };

  const setBucketVersioning = () => {
    setEnableVersioningOpen(true);
  };
  const setBucketQuota = () => {
    setEnableQuotaScreenOpen(true);
  };

  const closeEnableBucketEncryption = () => {
    setEnableEncryptionScreenOpen(false);
    setLoadingEncryption(true);
  };
  const closeEnableBucketQuota = () => {
    setEnableQuotaScreenOpen(false);
    setLoadingQuota(true);
  };

  const closeSetAccessPolicy = () => {
    setAccessPolicyScreenOpen(false);
    loadAllBucketData();
  };

  const closeRetentionConfig = () => {
    setRetentionConfigOpen(false);
    loadAllBucketData();
  };

  const closeEnableVersioning = (refresh: boolean) => {
    setEnableVersioningOpen(false);
    if (refresh) {
      loadAllBucketData();
    }
  };

  let versioningStatus = versioningInfo?.status;
  let versioningText = "Unversioned (Default)";
  if (versioningStatus === "Enabled") {
    versioningText = "Versioned";
  } else if (versioningStatus === "Suspended") {
    versioningText = "Suspended";
  }

  return (
    <Fragment>
      {enableEncryptionScreenOpen && (
        <EnableBucketEncryption
          open={enableEncryptionScreenOpen}
          selectedBucket={bucketName}
          encryptionEnabled={encryptionEnabled}
          encryptionCfg={encryptionCfg}
          closeModalAndRefresh={closeEnableBucketEncryption}
        />
      )}
      {enableQuotaScreenOpen && (
        <EnableQuota
          open={enableQuotaScreenOpen}
          selectedBucket={bucketName}
          enabled={quotaEnabled}
          cfg={quota}
          closeModalAndRefresh={closeEnableBucketQuota}
        />
      )}
      {accessPolicyScreenOpen && (
        <SetAccessPolicy
          bucketName={bucketName}
          open={accessPolicyScreenOpen}
          actualPolicy={accessPolicy}
          actualDefinition={policyDefinition}
          closeModalAndRefresh={closeSetAccessPolicy}
        />
      )}
      {retentionConfigOpen && (
        <SetRetentionConfig
          bucketName={bucketName}
          open={retentionConfigOpen}
          closeModalAndRefresh={closeRetentionConfig}
        />
      )}
      {enableVersioningOpen && (
        <EnableVersioningModal
          closeVersioningModalAndRefresh={closeEnableVersioning}
          modalOpen={enableVersioningOpen}
          selectedBucket={bucketName}
          versioningInfo={versioningInfo}
          objectLockingEnabled={!!hasObjectLocking}
        />
      )}

      <SectionTitle separator sx={{ marginBottom: 15 }}>
        Summary
      </SectionTitle>
      <Grid container>
        <SecureComponent
          scopes={[IAM_SCOPES.S3_GET_BUCKET_POLICY, IAM_SCOPES.S3_GET_ACTIONS]}
          resource={bucketName}
        >
          <Grid item xs={12}>
            <Box sx={twoColCssGridLayoutConfig}>
              <Box sx={twoColCssGridLayoutConfig}>
                <SecureComponent
                  scopes={[
                    IAM_SCOPES.S3_GET_BUCKET_POLICY,
                    IAM_SCOPES.S3_GET_ACTIONS,
                  ]}
                  resource={bucketName}
                >
                  <EditablePropertyItem
                    iamScopes={[
                      IAM_SCOPES.S3_PUT_BUCKET_POLICY,
                      IAM_SCOPES.S3_PUT_ACTIONS,
                    ]}
                    resourceName={bucketName}
                    property={"Access Policy:"}
                    value={accessPolicy.toLowerCase()}
                    onEdit={() => {
                      setAccessPolicyScreenOpen(true);
                    }}
                    isLoading={bucketLoading}
                    helpTip={
                      <Fragment>
                        <strong>Private</strong> policy limits access to
                        credentialled accounts with appropriate permissions
                        <br />
                        <strong>Public</strong> policy anyone will be able to
                        upload, download and delete files from this Bucket once
                        logged in
                        <br />
                        <strong>Custom</strong> policy can be written to define
                        which accounts are authorized to access this Bucket
                        <br />
                        <br />
                        To allow Bucket access without credentials, use the{" "}
                        <a href={`/buckets/${bucketName}/admin/prefix`}>
                          Anonymous
                        </a>{" "}
                        setting
                      </Fragment>
                    }
                  />
                </SecureComponent>

                <SecureComponent
                  scopes={[
                    IAM_SCOPES.S3_GET_BUCKET_ENCRYPTION_CONFIGURATION,
                    IAM_SCOPES.S3_GET_ACTIONS,
                  ]}
                  resource={bucketName}
                >
                  <EditablePropertyItem
                    iamScopes={[
                      IAM_SCOPES.S3_PUT_BUCKET_ENCRYPTION_CONFIGURATION,
                      IAM_SCOPES.S3_PUT_ACTIONS,
                    ]}
                    resourceName={bucketName}
                    property={"Encryption:"}
                    value={encryptionEnabled ? "Enabled" : "Disabled"}
                    onEdit={() => {
                      setEnableEncryptionScreenOpen(true);
                    }}
                    isLoading={loadingEncryption}
                    helpTip={
                      <Fragment>
                        MinIO supports enabling automatic{" "}
                        <a
                          href="https://min.io/docs/minio/kubernetes/upstream/administration/server-side-encryption/server-side-encryption-sse-kms.html"
                          target="blank"
                        >
                          SSE-KMS
                        </a>{" "}
                        and{" "}
                        <a
                          href="https://min.io/docs/minio/kubernetes/upstream/administration/server-side-encryption/server-side-encryption-sse-s3.html"
                          target="blank"
                        >
                          SSE-S3
                        </a>{" "}
                        encryption of all objects written to a bucket using a
                        specific External Key (EK) stored on the external KMS.
                      </Fragment>
                    }
                  />
                </SecureComponent>

                <SecureComponent
                  scopes={[
                    IAM_SCOPES.S3_GET_REPLICATION_CONFIGURATION,
                    IAM_SCOPES.S3_GET_ACTIONS,
                  ]}
                  resource={bucketName}
                >
                  <ValuePair
                    label={"Replication:"}
                    value={
                      <LabelWithIcon
                        icon={
                          replicationRules ? <EnabledIcon /> : <DisabledIcon />
                        }
                        label={
                          <label className={"muted"}>
                            {replicationRules ? "Enabled" : "Disabled"}
                          </label>
                        }
                      />
                    }
                  />
                </SecureComponent>

                <SecureComponent
                  scopes={[
                    IAM_SCOPES.S3_GET_BUCKET_OBJECT_LOCK_CONFIGURATION,
                    IAM_SCOPES.S3_GET_ACTIONS,
                  ]}
                  resource={bucketName}
                >
                  <ValuePair
                    label={"Object Locking:"}
                    value={
                      <LabelWithIcon
                        icon={
                          hasObjectLocking ? <EnabledIcon /> : <DisabledIcon />
                        }
                        label={
                          <label className={"muted"}>
                            {hasObjectLocking ? "Enabled" : "Disabled"}
                          </label>
                        }
                      />
                    }
                  />
                </SecureComponent>
                <Box>
                  <ValuePair
                    label={"Tags:"}
                    value={<BucketTags bucketName={bucketName} />}
                  />
                </Box>
                <EditablePropertyItem
                  iamScopes={[IAM_SCOPES.ADMIN_SET_BUCKET_QUOTA]}
                  resourceName={bucketName}
                  property={"Quota:"}
                  value={quotaEnabled ? "Enabled" : "Disabled"}
                  onEdit={setBucketQuota}
                  isLoading={loadingQuota}
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
                />
              </Box>
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: "1fr",
                  alignItems: "flex-start",
                }}
              >
                <ReportedUsage bucketSize={`${bucketSize}`} />
                {quotaEnabled && quota ? (
                  <BucketQuotaSize quota={quota} />
                ) : null}
              </Box>
            </Box>
          </Grid>
        </SecureComponent>

        {distributedSetup && (
          <SecureComponent
            scopes={[
              IAM_SCOPES.S3_GET_BUCKET_VERSIONING,
              IAM_SCOPES.S3_GET_ACTIONS,
            ]}
            resource={bucketName}
          >
            <Grid item xs={12} sx={{ marginTop: 5 }}>
              <SectionTitle separator sx={{ marginBottom: 15 }}>
                Versioning
              </SectionTitle>

              <Box sx={twoColCssGridLayoutConfig}>
                <Box sx={twoColCssGridLayoutConfig}>
                  <EditablePropertyItem
                    iamScopes={[
                      IAM_SCOPES.S3_PUT_BUCKET_VERSIONING,
                      IAM_SCOPES.S3_PUT_ACTIONS,
                    ]}
                    resourceName={bucketName}
                    property={"Current Status:"}
                    value={
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          textDecorationStyle: "initial",
                          placeItems: "flex-start",
                          justifyItems: "flex-start",
                          gap: 3,
                        }}
                      >
                        <div> {versioningText}</div>
                      </Box>
                    }
                    onEdit={setBucketVersioning}
                    isLoading={loadingVersioning}
                    disabled={hasObjectLocking}
                  />

                  {versioningInfo?.status === "Enabled" ? (
                    <VersioningInfo versioningState={versioningInfo} />
                  ) : null}
                </Box>
              </Box>
            </Grid>
          </SecureComponent>
        )}

        {hasObjectLocking && (
          <SecureComponent
            scopes={[
              IAM_SCOPES.S3_GET_OBJECT_RETENTION,
              IAM_SCOPES.S3_GET_ACTIONS,
            ]}
            resource={bucketName}
          >
            <Grid item xs={12} sx={{ marginTop: 5 }}>
              <SectionTitle separator sx={{ marginBottom: 15 }}>
                Retention
              </SectionTitle>

              <Box sx={twoColCssGridLayoutConfig}>
                <Box sx={twoColCssGridLayoutConfig}>
                  <EditablePropertyItem
                    iamScopes={[IAM_SCOPES.ADMIN_SET_BUCKET_QUOTA]}
                    resourceName={bucketName}
                    property={"Retention:"}
                    value={retentionEnabled ? "Enabled" : "Disabled"}
                    onEdit={() => {
                      setRetentionConfigOpen(true);
                    }}
                    isLoading={loadingRetention}
                    helpTip={
                      <Fragment>
                        MinIO{" "}
                        <a
                          target="blank"
                          href="https://min.io/docs/minio/macos/administration/object-management.html#object-retention"
                        >
                          Object Locking
                        </a>{" "}
                        enforces Write-Once Read-Many (WORM) immutability to
                        protect versioned objects from deletion.
                      </Fragment>
                    }
                  />

                  <ValuePair
                    label={"Mode:"}
                    value={
                      <label
                        className={"muted"}
                        style={{ textTransform: "capitalize" }}
                      >
                        {retentionConfig && retentionConfig.mode
                          ? retentionConfig.mode
                          : "-"}
                      </label>
                    }
                  />
                  <ValuePair
                    label={"Validity:"}
                    value={
                      <label
                        className={"muted"}
                        style={{ textTransform: "capitalize" }}
                      >
                        {retentionConfig && retentionConfig.validity}{" "}
                        {retentionConfig &&
                          (retentionConfig.validity === 1
                            ? retentionConfig.unit?.slice(0, -1)
                            : retentionConfig.unit)}
                      </label>
                    }
                  />
                </Box>
              </Box>
            </Grid>
          </SecureComponent>
        )}
      </Grid>
    </Fragment>
  );
};

export default BucketSummary;
