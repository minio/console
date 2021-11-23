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
import { connect } from "react-redux";
import { Theme } from "@mui/material/styles";
import createStyles from "@mui/styles/createStyles";
import withStyles from "@mui/styles/withStyles";
import { Button, CircularProgress } from "@mui/material";
import get from "lodash/get";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { AppState } from "../../../../store";
import { setErrorSnackMessage } from "../../../../actions";
import {
  BucketEncryptionInfo,
  BucketInfo,
  BucketObjectLocking,
  BucketQuota,
  BucketReplication,
  BucketVersioning,
} from "../types";
import { niceBytes } from "../../../../common/utils";
import { Bucket, BucketList } from "../../Watch/types";
import {
  buttonsStyles,
  hrClass,
} from "../../Common/FormComponents/common/styleLibrary";
import {
  ErrorResponseHandler,
  IRetentionConfig,
} from "../../../../common/types";
import api from "../../../../common/api";
import SetAccessPolicy from "./SetAccessPolicy";
import SetRetentionConfig from "./SetRetentionConfig";
import EnableBucketEncryption from "./EnableBucketEncryption";
import EnableVersioningModal from "./EnableVersioningModal";
import GavelIcon from "@mui/icons-material/Gavel";
import EnableQuota from "./EnableQuota";
import { setBucketDetailsLoad } from "../actions";
import ReportedUsageIcon from "../../../../icons/ReportedUsageIcon";
import { IAM_SCOPES } from "../../../../common/SecureComponent/permissions";

import PanelTitle from "../../Common/PanelTitle/PanelTitle";
import Chip from "@mui/material/Chip";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import AddBucketTagModal from "./AddBucketTagModal";
import DeleteBucketTagModal from "./DeleteBucketTagModal";
import SecureComponent, {
  hasPermission,
} from "../../../../common/SecureComponent/SecureComponent";

interface IBucketSummaryProps {
  classes: any;
  match: any;
  distributedSetup: boolean;
  setErrorSnackMessage: typeof setErrorSnackMessage;
  loadingBucket: boolean;
  bucketInfo: BucketInfo | null;
  setBucketDetailsLoad: typeof setBucketDetailsLoad;
}

const styles = (theme: Theme) =>
  createStyles({
    paperContainer: {
      padding: 15,
      paddingLeft: 50,
      display: "flex",
    },
    elementTitle: {
      fontWeight: 500,
      color: "#777777",
      fontSize: 14,
      marginTop: -9,
    },
    consumptionValue: {
      color: "#000000",
      fontSize: "48px",
      fontWeight: "bold",
    },
    reportedUsage: {
      padding: "15px",
    },
    dualCardLeft: {
      paddingRight: "5px",
    },
    dualCardRight: {
      paddingLeft: "5px",
    },
    capitalizeFirst: {
      textTransform: "capitalize",
      "& .min-icon": {
        width: 16,
        height: 16,
      },
    },
    titleCol: {
      width: "25%",
    },
    tag: {
      textTransform: "none",
      marginRight: "5px",
    },
    ...hrClass,
    ...buttonsStyles,
  });

const BucketSummary = ({
  classes,
  match,
  distributedSetup,
  setErrorSnackMessage,
  loadingBucket,
  bucketInfo,
  setBucketDetailsLoad,
}: IBucketSummaryProps) => {
  const [encryptionCfg, setEncryptionCfg] =
    useState<BucketEncryptionInfo | null>(null);
  const [bucketSize, setBucketSize] = useState<string>("0");
  const [hasObjectLocking, setHasObjectLocking] = useState<boolean>(false);
  const [accessPolicyScreenOpen, setAccessPolicyScreenOpen] =
    useState<boolean>(false);
  const [replicationRules, setReplicationRules] = useState<boolean>(false);
  const [loadingObjectLocking, setLoadingLocking] = useState<boolean>(true);
  const [loadingSize, setLoadingSize] = useState<boolean>(true);
  const [loadingTags, setLoadingTags] = useState<boolean>(true);
  const [bucketLoading, setBucketLoading] = useState<boolean>(true);
  const [loadingEncryption, setLoadingEncryption] = useState<boolean>(true);
  const [loadingVersioning, setLoadingVersioning] = useState<boolean>(true);
  const [loadingQuota, setLoadingQuota] = useState<boolean>(true);
  const [loadingReplication, setLoadingReplication] = useState<boolean>(true);
  const [loadingRetention, setLoadingRetention] = useState<boolean>(true);
  const [isVersioned, setIsVersioned] = useState<boolean>(false);
  const [quotaEnabled, setQuotaEnabled] = useState<boolean>(false);
  const [quota, setQuota] = useState<BucketQuota | null>(null);
  const [encryptionEnabled, setEncryptionEnabled] = useState<boolean>(false);
  const [retentionEnabled, setRetentionEnabled] = useState<boolean>(false);
  const [retentionConfig, setRetentionConfig] =
    useState<IRetentionConfig | null>(null);
  const [retentionConfigOpen, setRetentionConfigOpen] =
    useState<boolean>(false);
  const [enableEncryptionScreenOpen, setEnableEncryptionScreenOpen] =
    useState<boolean>(false);
  const [enableQuotaScreenOpen, setEnableQuotaScreenOpen] =
    useState<boolean>(false);
  const [enableVersioningOpen, setEnableVersioningOpen] =
    useState<boolean>(false);
  const [tags, setTags] = useState<any>(null);
  const [tagModalOpen, setTagModalOpen] = useState<boolean>(false);
  const [tagKeys, setTagKeys] = useState<string[]>([]);
  const [selectedTag, setSelectedTag] = useState<string[]>(["", ""]);
  const [deleteTagModalOpen, setDeleteTagModalOpen] = useState<boolean>(false);

  const bucketName = match.params["bucketName"];

  let accessPolicy = "n/a";

  if (bucketInfo !== null) {
    accessPolicy = bucketInfo.access;
  }

  const displayGetBucketObjectLockConfiguration = hasPermission(bucketName, [
    IAM_SCOPES.S3_GET_BUCKET_OBJECT_LOCK_CONFIGURATION,
  ]);

  const displayGetBucketEncryptionConfiguration = hasPermission(bucketName, [
    IAM_SCOPES.S3_GET_BUCKET_ENCRYPTION_CONFIGURATION,
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
        api
          .invoke("GET", `/api/v1/buckets/${bucketName}/encryption/info`)
          .then((res: BucketEncryptionInfo) => {
            if (res.algorithm) {
              setEncryptionEnabled(true);
              setEncryptionCfg(res);
            }
            setLoadingEncryption(false);
          })
          .catch((err: ErrorResponseHandler) => {
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
      api
        .invoke("GET", `/api/v1/buckets/${bucketName}/versioning`)
        .then((res: BucketVersioning) => {
          setIsVersioned(res.is_versioned);
          setLoadingVersioning(false);
        })
        .catch((err: ErrorResponseHandler) => {
          setErrorSnackMessage(err);
          setLoadingVersioning(false);
        });
    }
  }, [loadingVersioning, setErrorSnackMessage, bucketName, distributedSetup]);

  useEffect(() => {
    if (loadingQuota && distributedSetup) {
      if (displayGetBucketQuota) {
        api
          .invoke("GET", `/api/v1/buckets/${bucketName}/quota`)
          .then((res: BucketQuota) => {
            setQuota(res);
            if (res.quota) {
              setQuotaEnabled(true);
            } else {
              setQuotaEnabled(false);
            }
            setLoadingQuota(false);
          })
          .catch((err: ErrorResponseHandler) => {
            setErrorSnackMessage(err);
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
    setErrorSnackMessage,
    bucketName,
    distributedSetup,
    displayGetBucketQuota,
  ]);

  useEffect(() => {
    if (loadingVersioning && distributedSetup) {
      if (displayGetBucketObjectLockConfiguration) {
        api
          .invoke("GET", `/api/v1/buckets/${bucketName}/object-locking`)
          .then((res: BucketObjectLocking) => {
            setHasObjectLocking(res.object_locking_enabled);
            setLoadingLocking(false);
          })
          .catch((err: ErrorResponseHandler) => {
            setErrorSnackMessage(err);
            setLoadingLocking(false);
          });
      } else {
        setLoadingLocking(false);
      }
    }
  }, [
    loadingObjectLocking,
    setErrorSnackMessage,
    bucketName,
    loadingVersioning,
    distributedSetup,
    displayGetBucketObjectLockConfiguration,
  ]);

  useEffect(() => {
    if (loadingSize) {
      api
        .invoke("GET", `/api/v1/buckets`)
        .then((res: BucketList) => {
          const resBuckets = get(res, "buckets", []);

          const bucketInfo = resBuckets.find(
            (bucket) => bucket.name === bucketName
          );

          const size = get(bucketInfo, "size", "0");

          setLoadingSize(false);
          setBucketSize(size);
        })
        .catch((err: ErrorResponseHandler) => {
          setLoadingSize(false);
          setErrorSnackMessage(err);
        });
    }
  }, [loadingSize, setErrorSnackMessage, bucketName]);

  useEffect(() => {
    if (loadingTags) {
      api
        .invoke("GET", `/api/v1/buckets/${bucketName}`)
        .then((res: Bucket) => {
          if (res != null && res?.details != null) {
            setTags(res?.details?.tags);
            setTagKeys(Object.keys(res?.details?.tags));
          }
          setLoadingTags(false);
        })
        .catch((err: ErrorResponseHandler) => {
          setLoadingTags(false);
          setErrorSnackMessage(err);
        });
    }
  }, [
    loadingTags,
    setErrorSnackMessage,
    bucketName,
    setTags,
    tags,
    setTagKeys,
    tagKeys,
  ]);

  useEffect(() => {
    if (loadingReplication && distributedSetup) {
      api
        .invoke("GET", `/api/v1/buckets/${bucketName}/replication`)
        .then((res: BucketReplication) => {
          const r = res.rules ? res.rules : [];
          setReplicationRules(r.length > 0);
          setLoadingReplication(false);
        })
        .catch((err: ErrorResponseHandler) => {
          setErrorSnackMessage(err);
          setLoadingReplication(false);
        });
    }
  }, [loadingReplication, setErrorSnackMessage, bucketName, distributedSetup]);

  useEffect(() => {
    if (loadingRetention && hasObjectLocking) {
      api
        .invoke("GET", `/api/v1/buckets/${bucketName}/retention`)
        .then((res: IRetentionConfig) => {
          setLoadingRetention(false);
          setRetentionEnabled(true);
          setRetentionConfig(res);
        })
        .catch((err: ErrorResponseHandler) => {
          setRetentionEnabled(false);
          setLoadingRetention(false);
          setRetentionConfig(null);
        });
    }
  }, [loadingRetention, hasObjectLocking, bucketName]);

  const loadAllBucketData = () => {
    setBucketDetailsLoad(true);
    setBucketLoading(true);
    setLoadingSize(true);
    setLoadingTags(true);
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

  const closeAddTagModal = (refresh: boolean) => {
    setTagModalOpen(false);
    if (refresh) {
      loadAllBucketData();
    }
  };

  const cap = (str: string) => {
    if (!str) {
      return null;
    }
    return str[0].toUpperCase() + str.slice(1);
  };

  const deleteTag = (tagKey: string, tagLabel: string) => {
    setSelectedTag([tagKey, tagLabel]);
    setDeleteTagModalOpen(true);
  };

  const closeDeleteTagModal = (refresh: boolean) => {
    setDeleteTagModalOpen(false);

    if (refresh) {
      loadAllBucketData();
    }
  };

  // @ts-ignore
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
          versioningCurrentState={isVersioned}
        />
      )}
      {tagModalOpen && (
        <AddBucketTagModal
          modalOpen={tagModalOpen}
          currentTags={tags}
          bucketName={bucketName}
          onCloseAndUpdate={closeAddTagModal}
        />
      )}
      {deleteTagModalOpen && (
        <DeleteBucketTagModal
          deleteOpen={deleteTagModalOpen}
          currentTags={tags}
          bucketName={bucketName}
          onCloseAndUpdate={closeDeleteTagModal}
          selectedTag={selectedTag}
        />
      )}
      <Grid container>
        <Grid item xs={12} className={classes.actionsTray}>
          <PanelTitle>Summary</PanelTitle>
        </Grid>
      </Grid>
      <Paper className={classes.paperContainer}>
        <Grid container>
          <Grid item xs={8}>
            <table width={"100%"}>
              <tbody>
                <SecureComponent
                  scopes={[IAM_SCOPES.S3_GET_BUCKET_POLICY]}
                  resource={bucketName}
                >
                  <tr>
                    <td className={classes.titleCol}>Access Policy:</td>
                    <td className={classes.capitalizeFirst}>
                      <SecureComponent
                        scopes={[IAM_SCOPES.S3_PUT_BUCKET_POLICY]}
                        resource={bucketName}
                        errorProps={{ disabled: true }}
                      >
                        <Button
                          color="primary"
                          className={classes.anchorButton}
                          onClick={() => {
                            setAccessPolicyScreenOpen(true);
                          }}
                        >
                          {bucketLoading ? (
                            <CircularProgress
                              color="primary"
                              size={16}
                              variant="indeterminate"
                            />
                          ) : (
                            accessPolicy.toLowerCase()
                          )}
                        </Button>
                      </SecureComponent>
                    </td>
                  </tr>
                </SecureComponent>
                {distributedSetup && (
                  <Fragment>
                    <SecureComponent
                      scopes={[IAM_SCOPES.S3_GET_REPLICATION_CONFIGURATION]}
                      resource={bucketName}
                    >
                      <tr>
                        <td className={classes.titleCol}>Replication:</td>
                        <td className={classes.doubleElement}>
                          <span>
                            {replicationRules ? "Enabled" : "Disabled"}
                          </span>
                        </td>
                      </tr>
                    </SecureComponent>
                    <SecureComponent
                      scopes={[
                        IAM_SCOPES.S3_GET_BUCKET_OBJECT_LOCK_CONFIGURATION,
                      ]}
                      resource={bucketName}
                    >
                      <tr>
                        <td className={classes.titleCol}>Object Locking:</td>
                        <td>{!hasObjectLocking ? "Disabled" : "Enabled"}</td>
                      </tr>
                    </SecureComponent>
                  </Fragment>
                )}
                <SecureComponent
                  scopes={[IAM_SCOPES.S3_GET_BUCKET_ENCRYPTION_CONFIGURATION]}
                  resource={bucketName}
                >
                  <tr>
                    <td className={classes.titleCol}>Encryption:</td>
                    <td>
                      {loadingEncryption ? (
                        <CircularProgress
                          color="primary"
                          size={16}
                          variant="indeterminate"
                        />
                      ) : (
                        <SecureComponent
                          scopes={[
                            IAM_SCOPES.S3_PUT_BUCKET_ENCRYPTION_CONFIGURATION,
                          ]}
                          resource={bucketName}
                          errorProps={{ disabled: true }}
                        >
                          <Button
                            color="primary"
                            className={classes.anchorButton}
                            onClick={() => {
                              setEnableEncryptionScreenOpen(true);
                            }}
                          >
                            {encryptionEnabled ? "Enabled" : "Disabled"}
                          </Button>
                        </SecureComponent>
                      )}
                    </td>
                  </tr>
                </SecureComponent>
                <SecureComponent
                  scopes={[IAM_SCOPES.S3_GET_BUCKET_TAGGING]}
                  resource={bucketName}
                >
                  <tr>
                    <td className={classes.titleCol}>Tags:</td>
                    <td>
                      {tagKeys &&
                        tagKeys.map((tagKey: any, index: any) => {
                          const tag = get(tags, `${tagKey}`, "");
                          if (tag !== "") {
                            return (
                              <SecureComponent
                                key={`chip-${index}`}
                                scopes={[IAM_SCOPES.S3_PUT_BUCKET_TAGGING]}
                                resource={bucketName}
                                matchAll
                                errorProps={{
                                  deleteIcon: null,
                                  onDelete: null,
                                }}
                              >
                                <Chip
                                  className={classes.tag}
                                  size="small"
                                  label={`${tagKey} : ${tag}`}
                                  color="primary"
                                  deleteIcon={<CloseIcon />}
                                  onDelete={() => {
                                    deleteTag(tagKey, tag);
                                  }}
                                />
                              </SecureComponent>
                            );
                          }
                          return null;
                        })}
                      <SecureComponent
                        scopes={[IAM_SCOPES.S3_PUT_BUCKET_TAGGING]}
                        resource={bucketName}
                      >
                        <Chip
                          className={classes.tag}
                          icon={<AddIcon />}
                          clickable
                          size="small"
                          label="Add tag"
                          color="primary"
                          variant="outlined"
                          onClick={() => {
                            setTagModalOpen(true);
                          }}
                        />
                      </SecureComponent>
                    </td>
                  </tr>
                </SecureComponent>
              </tbody>
            </table>
          </Grid>
          <Grid item xs={4} className={classes.reportedUsage}>
            <Grid container direction="row" alignItems="center">
              <Grid item className={classes.icon} xs={2}>
                <ReportedUsageIcon />
              </Grid>
              <Grid item xs={10}>
                <Typography className={classes.elementTitle}>
                  Reported Usage
                </Typography>
              </Grid>
            </Grid>
            <Typography className={classes.consumptionValue}>
              {niceBytes(bucketSize)}
            </Typography>
          </Grid>
        </Grid>
      </Paper>
      <br />
      <br />
      {distributedSetup && (
        <SecureComponent
          scopes={[IAM_SCOPES.S3_GET_BUCKET_VERSIONING]}
          resource={bucketName}
        >
          <Fragment>
            <Paper className={classes.paperContainer} elevation={1}>
              <Grid container>
                <Grid item xs={quotaEnabled ? 9 : 12}>
                  <h2>Versioning</h2>
                  <hr className={classes.hrClass} />
                  <table width={"100%"}>
                    <tbody>
                      <tr>
                        <td className={classes.titleCol}>Versioning:</td>
                        <td>
                          {loadingVersioning ? (
                            <CircularProgress
                              color="primary"
                              size={16}
                              variant="indeterminate"
                            />
                          ) : (
                            <SecureComponent
                              scopes={[IAM_SCOPES.S3_PUT_BUCKET_VERSIONING]}
                              resource={bucketName}
                              errorProps={{ disabled: true }}
                            >
                              <Button
                                color="primary"
                                className={classes.anchorButton}
                                onClick={setBucketVersioning}
                              >
                                {isVersioned ? "Enabled" : "Disabled"}
                              </Button>
                            </SecureComponent>
                          )}
                        </td>
                        <SecureComponent
                          scopes={[IAM_SCOPES.ADMIN_GET_BUCKET_QUOTA]}
                          resource={bucketName}
                        >
                          <td className={classes.titleCol}>Quota:</td>
                          <td>
                            {loadingQuota ? (
                              <CircularProgress
                                color="primary"
                                size={16}
                                variant="indeterminate"
                              />
                            ) : (
                              <SecureComponent
                                scopes={[IAM_SCOPES.ADMIN_SET_BUCKET_QUOTA]}
                                resource={bucketName}
                                errorProps={{ disabled: true }}
                              >
                                <Button
                                  color="primary"
                                  className={classes.anchorButton}
                                  onClick={setBucketQuota}
                                >
                                  {quotaEnabled ? "Enabled" : "Disabled"}
                                </Button>
                              </SecureComponent>
                            )}
                          </td>
                        </SecureComponent>
                      </tr>
                    </tbody>
                  </table>
                </Grid>
                {quotaEnabled && quota && (
                  <Grid item xs={3} className={classes.reportedUsage}>
                    <Grid container direction="row" alignItems="center">
                      <Grid item className={classes.icon} xs={2}>
                        <GavelIcon />
                      </Grid>
                      <Grid item xs={10}>
                        <Typography className={classes.elementTitle}>
                          {cap(quota?.type)} Quota
                        </Typography>
                      </Grid>
                    </Grid>
                    <Typography className={classes.consumptionValue}>
                      {niceBytes(`${quota?.quota}`)}
                    </Typography>
                  </Grid>
                )}
              </Grid>
            </Paper>
            <br />
            <br />
          </Fragment>
        </SecureComponent>
      )}

      {hasObjectLocking && (
        <SecureComponent
          scopes={[IAM_SCOPES.S3_GET_OBJECT_RETENTION]}
          resource={bucketName}
        >
          <Paper className={classes.paperContainer}>
            <Grid container>
              <Grid item xs={12}>
                <h2>Retention</h2>
                <hr className={classes.hrClass} />
                <table width={"100%"}>
                  <tbody>
                    <tr className={classes.gridContainer}>
                      <td className={classes.titleCol}>Status:</td>
                      <td>
                        {loadingRetention ? (
                          <CircularProgress
                            color="primary"
                            size={16}
                            variant="indeterminate"
                          />
                        ) : (
                          <SecureComponent
                            scopes={[IAM_SCOPES.S3_PUT_OBJECT_RETENTION]}
                            resource={bucketName}
                            errorProps={{ disabled: true }}
                          >
                            <Button
                              color="primary"
                              className={classes.anchorButton}
                              onClick={() => {
                                setRetentionConfigOpen(true);
                              }}
                            >
                              {!retentionEnabled ? "Disabled" : "Enabled"}
                            </Button>
                          </SecureComponent>
                        )}
                      </td>
                      {retentionConfig === null ? (
                        <td colSpan={2}>&nbsp;</td>
                      ) : (
                        <Fragment>
                          <td className={classes.titleCol}>Mode:</td>
                          <td className={classes.capitalizeFirst}>
                            {retentionConfig && retentionConfig.mode}
                          </td>
                        </Fragment>
                      )}
                    </tr>
                    <tr className={classes.gridContainer}>
                      {retentionConfig === null ? (
                        <td colSpan={2}></td>
                      ) : (
                        <Fragment>
                          <td className={classes.titleCol}>Valitidy:</td>
                          <td className={classes.capitalizeFirst}>
                            {retentionConfig && retentionConfig.validity}{" "}
                            {retentionConfig &&
                              (retentionConfig.validity === 1
                                ? retentionConfig.unit.slice(0, -1)
                                : retentionConfig.unit)}
                          </td>
                        </Fragment>
                      )}
                    </tr>
                  </tbody>
                </table>
              </Grid>
            </Grid>
          </Paper>
        </SecureComponent>
      )}
    </Fragment>
  );
};

const mapState = (state: AppState) => ({
  session: state.console.session,
  distributedSetup: state.system.distributedSetup,
  loadingBucket: state.buckets.bucketDetails.loadingBucket,
  bucketInfo: state.buckets.bucketDetails.bucketInfo,
});

const connector = connect(mapState, {
  setErrorSnackMessage,
  setBucketDetailsLoad,
});

export default withStyles(styles)(connector(BucketSummary));
