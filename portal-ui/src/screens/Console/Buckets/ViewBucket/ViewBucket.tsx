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

import React, { useEffect, useState, Fragment } from "react";
import { connect } from "react-redux";
import { createStyles, Theme, withStyles } from "@material-ui/core/styles";
import { Button, IconButton } from "@material-ui/core";
import * as reactMoment from "react-moment";
import get from "lodash/get";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import CircularProgress from "@material-ui/core/CircularProgress";
import Checkbox from "@material-ui/core/Checkbox";
import Typography from "@material-ui/core/Typography";
import api from "../../../../common/api";
import {
  BucketEncryptionInfo,
  BucketEvent,
  BucketEventList,
  BucketInfo,
  BucketList,
  BucketObjectLocking,
  BucketReplication,
  BucketReplicationDestination,
  BucketReplicationRule,
  BucketReplicationRuleDeleteMarker,
  BucketVersioning,
  HasPermissionResponse,
  LifeCycleItem,
} from "../types";
import { CreateIcon } from "../../../../icons";
import { niceBytes } from "../../../../common/utils";
import { containerForHeader } from "../../Common/FormComponents/common/styleLibrary";
import { setErrorSnackMessage } from "../../../../actions";
import { Policy } from "../../Policies/types";
import { User } from "../../Users/types";
import { AppState } from "../../../../store";
import { ISessionResponse } from "../../types";
import SetAccessPolicy from "./SetAccessPolicy";
import SetRetentionConfig from "./SetRetentionConfig";
import AddEvent from "./AddEvent";
import DeleteEvent from "./DeleteEvent";
import TableWrapper from "../../Common/TableWrapper/TableWrapper";
import AddReplicationModal from "./AddReplicationModal";
import PageHeader from "../../Common/PageHeader/PageHeader";
import EnableBucketEncryption from "./EnableBucketEncryption";
import PencilIcon from "../../Common/TableWrapper/TableActionIcons/PencilIcon";
import EnableVersioningModal from "./EnableVersioningModal";
import UsageIcon from "../../../../icons/UsageIcon";
import AddPolicy from "../../Policies/AddPolicy";
import DeleteReplicationRule from "../ViewBucket/DeleteReplicationRule";
import EditLifecycleConfiguration from "./EditLifecycleConfiguration";
import AddLifecycleModal from "./AddLifecycleModal";

const styles = (theme: Theme) =>
  createStyles({
    seeMore: {
      marginTop: theme.spacing(3),
    },
    paper: {
      display: "flex",
      overflow: "auto",
      flexDirection: "column",
    },
    addSideBar: {
      width: "320px",
      padding: "20px",
    },
    tableToolbar: {
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(0),
    },
    minTableHeader: {
      color: "#393939",
      "& tr": {
        "& th": {
          fontWeight: "bold",
        },
      },
    },
    actionsTray: {
      textAlign: "right",
      "& button": {
        marginLeft: 10,
      },
    },
    searchField: {
      background: "#FFFFFF",
      padding: 12,
      borderRadius: 5,
      boxShadow: "0px 3px 6px #00000012",
    },
    noRecords: {
      lineHeight: "24px",
      textAlign: "center",
      padding: "20px",
    },
    gridWrapper: {
      width: 320,
    },
    gridContainer: {
      display: "grid",
      gridTemplateColumns: "auto auto",
      gridGap: 8,
      justifyContent: "flex-start",
      alignItems: "center",
      "& div:not(.MuiCircularProgress-root)": {
        display: "flex",
        alignItems: "center",
      },
      "& div:nth-child(odd)": {
        justifyContent: "flex-end",
        fontWeight: 700,
      },
      "& div:nth-child(2n)": {
        minWidth: 150,
      },
    },
    masterActions: {
      width: "25%",
      minWidth: "120px",
      "& div": {
        margin: "5px 0px",
      },
    },
    paperContainer: {
      padding: 15,
      paddingLeft: 50,
      display: "flex",
    },
    headerContainer: {
      display: "flex",
      justifyContent: "space-between",
    },
    capitalizeFirst: {
      textTransform: "capitalize",
    },
    doubleElement: {
      display: "flex",
      justifyContent: "space-between",
    },
    encCheckbox: {
      margin: 0,
      padding: 0,
    },
    tabPan: {
      marginTop: "5px",
    },
    fixedHeight: {
      height: 165,
      minWidth: 247,
      padding: "25px 28px",
      "& svg": {
        maxHeight: 18,
      },
    },
    elementTitle: {
      fontWeight: 500,
      color: "#777777",
      fontSize: 14,
      marginTop: -9,
    },
    consumptionValue: {
      color: "#000000",
      fontSize: "60px",
      fontWeight: "bold",
    },
    ...containerForHeader(theme.spacing(4)),
  });

interface IViewBucketProps {
  classes: any;
  match: any;
  setErrorSnackMessage: typeof setErrorSnackMessage;
  session: ISessionResponse;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: any;
  value: any;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      style={{ marginTop: "5px" }}
      {...other}
    >
      {value === index && <Fragment>{children}</Fragment>}
    </div>
  );
}

function a11yProps(index: any) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const ViewBucket = ({
  classes,
  match,
  setErrorSnackMessage,
  session,
}: IViewBucketProps) => {
  const [info, setInfo] = useState<BucketInfo | null>(null);
  const [records, setRecords] = useState<BucketEvent[]>([]);
  const [replicationRules, setReplicationRules] = useState<
    BucketReplicationRule[]
  >([]);
  const [bucketPolicy, setBucketPolicy] = useState<Policy[]>([]);
  const [loadingPolicy, setLoadingPolicy] = useState<boolean>(true);
  const [bucketUsers, setBucketUsers] = useState<User[]>([]);
  const [loadingUsers, setLoadingUsers] = useState<boolean>(true);
  const [loadingBucket, setLoadingBucket] = useState<boolean>(true);
  const [loadingEvents, setLoadingEvents] = useState<boolean>(true);
  const [loadingVersioning, setLoadingVersioning] = useState<boolean>(true);
  const [loadingObjectLocking, setLoadingLocking] = useState<boolean>(true);
  const [loadingReplication, setLoadingReplication] = useState<boolean>(true);
  const [loadingSize, setLoadingSize] = useState<boolean>(true);
  const [loadingEncryption, setLoadingEncryption] = useState<boolean>(true);
  const [accessPolicyScreenOpen, setAccessPolicyScreenOpen] = useState<boolean>(
    false
  );
  const [curTab, setCurTab] = useState<number>(0);
  const [addScreenOpen, setAddScreenOpen] = useState<boolean>(false);
  const [policyScreenOpen, setPolicyScreenOpen] = useState<boolean>(false);
  const [
    enableEncryptionScreenOpen,
    setEnableEncryptionScreenOpen,
  ] = useState<boolean>(false);
  const [deleteOpen, setDeleteOpen] = useState<boolean>(false);
  const [editLifecycleOpen, setEditLifecycleOpen] = useState<boolean>(false);
  const [selectedEvent, setSelectedEvent] = useState<BucketEvent | null>(null);
  const [bucketSize, setBucketSize] = useState<string>("0");
  const [openSetReplication, setOpenSetReplication] = useState<boolean>(false);
  const [isVersioned, setIsVersioned] = useState<boolean>(false);
  const [hasObjectLocking, setHasObjectLocking] = useState<boolean>(false);
  const [encryptionEnabled, setEncryptionEnabled] = useState<boolean>(false);
  const [retentionConfigOpen, setRetentionConfigOpen] = useState<boolean>(
    false
  );
  const [policyEdit, setPolicyEdit] = useState<any>(null);
  const [enableVersioningOpen, setEnableVersioningOpen] = useState<boolean>(
    false
  );
  const [loadingPerms, setLoadingPerms] = useState<boolean>(true);
  const [canPutReplication, setCanPutReplication] = useState<boolean>(false);
  const [canGetReplication, setCanGetReplication] = useState<boolean>(false);
  const [deleteReplicationModal, setDeleteReplicationModal] = useState<boolean>(
    false
  );
  const [selectedRRule, setSelectedRRule] = useState<string>("");
  const [loadingLifecycle, setLoadingLifecycle] = useState<boolean>(true);
  const [lifecycleRecords, setLifecycleRecords] = useState<LifeCycleItem[]>([]);
  const [addLifecycleOpen, setAddLifecycleOpen] = useState<boolean>(false);

  const bucketName = match.params["bucketName"];
  const ilmEnabled = session.features?.indexOf("ilm") > -1;
  const usersEnabled = session.pages?.indexOf("/users") > -1;

  // check the permissions for creating bucket
  useEffect(() => {
    if (loadingPerms) {
      api
        .invoke("POST", `/api/v1/has-permission`, {
          actions: [
            {
              id: "PutReplicationConfiguration",
              action: "s3:PutReplicationConfiguration",
              bucket_name: bucketName,
            },
            {
              id: "GetReplicationConfiguration",
              action: "s3:GetReplicationConfiguration",
              bucket_name: bucketName,
            },
          ],
        })
        .then((res: HasPermissionResponse) => {
          setLoadingPerms(false);
          if (!res.permissions) {
            return;
          }
          const actions = res.permissions ? res.permissions : [];

          let canPutReplication = actions.find(
            (s) => s.id === "PutReplicationConfiguration"
          );

          if (canPutReplication && canPutReplication.can) {
            setCanPutReplication(true);
          } else {
            setCanPutReplication(false);
          }
          let canGetReplication = actions.find(
            (s) => s.id === "GetReplicationConfiguration"
          );

          if (canGetReplication && canGetReplication.can) {
            setCanGetReplication(true);
          } else {
            setCanGetReplication(false);
          }

          setLoadingPerms(false);
        })
        .catch((err: any) => {
          setLoadingPerms(false);
          setErrorSnackMessage(err);
        });
    }
  }, [bucketName, loadingPerms, setErrorSnackMessage]);

  useEffect(() => {
    if (loadingEvents) {
      api
        .invoke("GET", `/api/v1/buckets/${bucketName}/events`)
        .then((res: BucketEventList) => {
          const events = get(res, "events", []);
          setLoadingEvents(false);
          setRecords(events || []);
        })
        .catch((err: any) => {
          setLoadingEvents(false);
          setErrorSnackMessage(err);
        });
    }
  }, [loadingEvents, setErrorSnackMessage, bucketName]);

  useEffect(() => {
    if (loadingVersioning) {
      api
        .invoke("GET", `/api/v1/buckets/${bucketName}/versioning`)
        .then((res: BucketVersioning) => {
          setIsVersioned(res.is_versioned);
          setLoadingVersioning(false);
        })
        .catch((err: any) => {
          setErrorSnackMessage(err);
          setLoadingVersioning(false);
        });
    }
  }, [loadingVersioning, setErrorSnackMessage, bucketName]);

  useEffect(() => {
    if (loadingVersioning) {
      api
        .invoke("GET", `/api/v1/buckets/${bucketName}/object-locking`)
        .then((res: BucketObjectLocking) => {
          setHasObjectLocking(res.object_locking_enabled);
          setLoadingLocking(false);
        })
        .catch((err: any) => {
          setErrorSnackMessage(err);
          setLoadingLocking(false);
        });
    }
  }, [
    loadingObjectLocking,
    setErrorSnackMessage,
    bucketName,
    loadingVersioning,
  ]);

  useEffect(() => {
    if (loadingReplication) {
      api
        .invoke("GET", `/api/v1/buckets/${bucketName}/replication`)
        .then((res: BucketReplication) => {
          const r = res.rules ? res.rules : [];
          setReplicationRules(r);
          setLoadingReplication(false);
        })
        .catch((err: any) => {
          setErrorSnackMessage(err);
          setLoadingReplication(false);
        });
    }
  }, [loadingReplication, setErrorSnackMessage, bucketName]);

  useEffect(() => {
    if (loadingPolicy) {
      api
        .invoke("GET", `/api/v1/bucket-policy/${bucketName}`)
        .then((res: any) => {
          setBucketPolicy(res.policies);
          setLoadingPolicy(false);
        })
        .catch((err: any) => {
          setErrorSnackMessage(err);
          setLoadingPolicy(false);
        });
    }
  }, [loadingPolicy, setErrorSnackMessage, bucketName]);

  useEffect(() => {
    if (loadingUsers && usersEnabled) {
      api
        .invoke("GET", `/api/v1/bucket-users/${bucketName}`)
        .then((res: any) => {
          setBucketUsers(res);
          setLoadingUsers(false);
        })
        .catch((err: any) => {
          setErrorSnackMessage(err);
          setLoadingUsers(false);
        });
    }
  }, [loadingUsers, setErrorSnackMessage, bucketName, usersEnabled]);

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
        .catch((err: any) => {
          setLoadingSize(false);
          setErrorSnackMessage(err);
        });
    }
  }, [loadingSize, setErrorSnackMessage, bucketName]);

  useEffect(() => {
    if (loadingBucket) {
      api
        .invoke("GET", `/api/v1/buckets/${bucketName}`)
        .then((res: BucketInfo) => {
          setLoadingBucket(false);
          setInfo(res);
        })
        .catch((err) => {
          setLoadingBucket(false);
          setErrorSnackMessage(err);
        });
    }
  }, [loadingBucket, setErrorSnackMessage, bucketName]);

  useEffect(() => {
    if (loadingEncryption) {
      api
        .invoke("GET", `/api/v1/buckets/${bucketName}/encryption/info`)
        .then((res: BucketEncryptionInfo) => {
          if (res.algorithm) {
            setEncryptionEnabled(true);
          }
          setLoadingEncryption(false);
        })
        .catch((err) => {
          console.error(err);
          setLoadingEncryption(false);
        });
    }
  }, [loadingEncryption, bucketName]);

  const setBucketVersioning = () => {
    setEnableVersioningOpen(true);
  };
  useEffect(() => {
    if (loadingLifecycle) {
      api
        .invoke("GET", `/api/v1/buckets/${bucketName}/lifecycle`)
        .then((res: any) => {
          const records = get(res, "lifecycle", []);

          setLifecycleRecords(records || []);
          setLoadingLifecycle(false);
        })
        .catch((err) => {
          console.error(err);
          setLoadingLifecycle(false);
        });
    }
  }, [loadingLifecycle, setLoadingLifecycle, bucketName]);

  const loadAllBucketData = () => {
    setLoadingBucket(true);
    setLoadingSize(true);
    setLoadingReplication(true);
    setLoadingVersioning(true);
    setLoadingEvents(true);
    setLoadingEncryption(true);
  };

  const closeAddModalAndRefresh = (refresh: boolean) => {
    setPolicyScreenOpen(false);

    if (refresh) {
      fetchPolicies();
    }
  };

  const fetchPolicies = () => {
    setLoadingPolicy(true);
  };

  const closeAddEventAndRefresh = () => {
    setAddScreenOpen(false);
    loadAllBucketData();
  };

  const closeEnableBucketEncryption = () => {
    setEnableEncryptionScreenOpen(false);
    loadAllBucketData();
  };

  const closeSetAccessPolicy = () => {
    setAccessPolicyScreenOpen(false);
    loadAllBucketData();
  };

  const closeRetentionConfig = () => {
    setRetentionConfigOpen(false);
    loadAllBucketData();
  };

  const closeAddReplication = () => {
    setOpenReplicationOpen(false);
    loadAllBucketData();
  };

  const closeDeleteModalAndRefresh = (refresh: boolean) => {
    setDeleteOpen(false);
    if (refresh) {
      loadAllBucketData();
    }
  };

  const closeEditLCAndRefresh = (refresh: boolean) => {
    setEditLifecycleOpen(false);
    if (refresh) {
      setLoadingLifecycle(true);
    }
  };

  const confirmDeleteEvent = (evnt: BucketEvent) => {
    setDeleteOpen(true);
    setSelectedEvent(evnt);
  };

  const confirmDeleteReplication = (replication: BucketReplicationRule) => {
    setSelectedRRule(replication.id);
    setDeleteReplicationModal(true);
  };

  const closeEnableVersioning = (refresh: boolean) => {
    setEnableVersioningOpen(false);
    if (refresh) {
      loadAllBucketData();
    }
  };

  let accessPolicy = "n/a";

  if (info !== null) {
    accessPolicy = info.access;
  }

  const eventsDisplay = (events: string[]) => {
    return <Fragment>{events.join(", ")}</Fragment>;
  };

  const ruleDestDisplay = (events: BucketReplicationDestination) => {
    return <Fragment>{events.bucket.replace("arn:aws:s3:::", "")}</Fragment>;
  };

  const ruleDelDisplay = (events: BucketReplicationRuleDeleteMarker) => {
    return null;
  };

  const setOpenReplicationOpen = (open = false) => {
    setOpenSetReplication(open);
  };

  const closeReplicationModalDelete = (refresh: boolean) => {
    setDeleteReplicationModal(false);

    if (refresh) {
      setLoadingReplication(true);
    }
  };

  const closeAddLCAndRefresh = (refresh: boolean) => {
    setAddLifecycleOpen(false);
    if (refresh) {
      setLoadingLifecycle(true);
    }
  };

  const handleEncryptionCheckbox = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (event.target.checked) {
      setEnableEncryptionScreenOpen(true);
    } else {
      api
        .invoke("POST", `/api/v1/buckets/${bucketName}/encryption/disable`)
        .then(() => {
          setEncryptionEnabled(false);
        })
        .catch((err: any) => {
          setErrorSnackMessage(err);
        });
    }
  };

  const tableActions = [{ type: "delete", onClick: confirmDeleteEvent }];
  const viewAction = (row: any) => {
    setPolicyScreenOpen(true);
    setPolicyEdit(row);
  };

  const PolicyActions = [{ type: "view", onClick: viewAction }];
  const replicationTableActions = [
    {
      type: "delete",
      onClick: confirmDeleteReplication,
      disableButtonFunction: () => replicationRules.length <= 1,
    },
  ];

  const expirationRender = (expiration: any) => {
    if (expiration.days) {
      return `${expiration.days} day${expiration.days > 1 ? "s" : ""}`;
    }

    if (expiration.date === "0001-01-01T00:00:00Z") {
      return "";
    }

    return <reactMoment.default>{expiration.date}</reactMoment.default>;
  };

  const transitionRender = (transition: any) => {
    if (transition.days) {
      return `${transition.days} day${transition.days > 1 ? "s" : ""}`;
    }

    if (transition.date === "0001-01-01T00:00:00Z") {
      return "";
    }

    return <reactMoment.default>{transition.date}</reactMoment.default>;
  };

  const renderStorageClass = (objectST: any) => {
    const stClass = get(objectST, "transition.storage_class", "");

    return stClass;
  };

  const lifecycleColumns = [
    { label: "ID", elementKey: "id" },
    {
      label: "Prefix",
      elementKey: "prefix",
    },
    {
      label: "Status",
      elementKey: "status",
    },
    {
      label: "Expiration",
      elementKey: "expiration",
      renderFunction: expirationRender,
    },
    {
      label: "Transition",
      elementKey: "transition",
      renderFunction: transitionRender,
    },
    {
      label: "Storage Class",
      elementKey: "storage_class",
      renderFunction: renderStorageClass,
      renderFullObject: true,
    },
  ];

  return (
    <Fragment>
      {addScreenOpen && (
        <AddEvent
          open={addScreenOpen}
          selectedBucket={bucketName}
          closeModalAndRefresh={closeAddEventAndRefresh}
        />
      )}
      {enableEncryptionScreenOpen && (
        <EnableBucketEncryption
          open={enableEncryptionScreenOpen}
          selectedBucket={bucketName}
          closeModalAndRefresh={closeEnableBucketEncryption}
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
      {policyScreenOpen && (
        <AddPolicy
          open={policyScreenOpen}
          closeModalAndRefresh={closeAddModalAndRefresh}
          policyEdit={policyEdit}
        />
      )}
      {retentionConfigOpen && (
        <SetRetentionConfig
          bucketName={bucketName}
          open={retentionConfigOpen}
          closeModalAndRefresh={closeRetentionConfig}
        />
      )}
      {openSetReplication && (
        <AddReplicationModal
          closeModalAndRefresh={closeAddReplication}
          open={openSetReplication}
          bucketName={bucketName}
        />
      )}
      {deleteOpen && (
        <DeleteEvent
          deleteOpen={deleteOpen}
          selectedBucket={bucketName}
          bucketEvent={selectedEvent}
          closeDeleteModalAndRefresh={closeDeleteModalAndRefresh}
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
      {deleteReplicationModal && (
        <DeleteReplicationRule
          deleteOpen={deleteReplicationModal}
          selectedBucket={bucketName}
          closeDeleteModalAndRefresh={closeReplicationModalDelete}
          ruleToDelete={selectedRRule}
        />
      )}
      {editLifecycleOpen && (
        <EditLifecycleConfiguration
          open={editLifecycleOpen}
          closeModalAndRefresh={closeEditLCAndRefresh}
          selectedBucket={bucketName}
          lifecycle={{
            id: "",
          }}
        />
      )}
      {addLifecycleOpen && (
        <AddLifecycleModal
          open={addLifecycleOpen}
          bucketName={bucketName}
          closeModalAndRefresh={closeAddLCAndRefresh}
        />
      )}

      <PageHeader label={`Bucket > ${match.params["bucketName"]}`} />
      <Grid container>
        <Grid item xs={12} className={classes.container}>
          <Grid item xs={12}>
            <Grid container spacing={2}>
              <Grid item>
                <Paper className={classes.fixedHeight}>
                  <Grid container direction="row" alignItems="center">
                    <Grid item className={classes.icon}>
                      <UsageIcon />
                    </Grid>
                    <Grid item>
                      <Typography className={classes.elementTitle}>
                        Reported Usage
                      </Typography>
                    </Grid>
                  </Grid>
                  <Typography className={classes.consumptionValue}>
                    {niceBytes(bucketSize)}
                  </Typography>
                </Paper>
              </Grid>
              <Grid item>
                <Paper className={classes.paperContainer}>
                  <div className={classes.gridContainer}>
                    <div>Access Policy:</div>
                    <div className={classes.capitalizeFirst}>
                      {loadingBucket ? (
                        <CircularProgress
                          color="primary"
                          size={16}
                          variant="indeterminate"
                        />
                      ) : (
                        accessPolicy.toLowerCase()
                      )}
                      <IconButton
                        color="primary"
                        aria-label="access"
                        size="small"
                        className={classes.propertiesIcon}
                        onClick={() => {
                          setAccessPolicyScreenOpen(true);
                        }}
                      >
                        <PencilIcon active={true} />
                      </IconButton>
                    </div>
                    <div>Replication:</div>
                    <div className={classes.doubleElement}>
                      <span>{replicationRules.length ? "Yes" : "No"}</span>
                    </div>
                    {!hasObjectLocking && (
                      <Fragment>
                        <div>Object Locking:</div>
                        <div>No</div>
                      </Fragment>
                    )}
                    <div>Encryption:</div>
                    <div>
                      <Checkbox
                        color="primary"
                        className={classes.encCheckbox}
                        inputProps={{
                          "aria-label": "secondary checkbox",
                        }}
                        onChange={(event) => handleEncryptionCheckbox(event)}
                        checked={encryptionEnabled}
                      />
                    </div>
                  </div>
                  {hasObjectLocking && (
                    <div className={classes.gridContainer}>
                      <div>Object Locking</div>
                      <div></div>
                      <div>Versioning:</div>
                      <div>
                        {loadingVersioning ? (
                          <CircularProgress
                            color="primary"
                            size={16}
                            variant="indeterminate"
                          />
                        ) : (
                          <Fragment>
                            {isVersioned && !loadingVersioning ? "Yes" : "No"}
                            &nbsp;
                            <IconButton
                              color="primary"
                              aria-label="retention"
                              size="small"
                              className={classes.propertiesIcon}
                              onClick={setBucketVersioning}
                            >
                              <PencilIcon active={true} />
                            </IconButton>
                          </Fragment>
                        )}
                      </div>
                      <div>Retention:</div>
                      <div>
                        {loadingVersioning ? (
                          <CircularProgress
                            color="primary"
                            size={16}
                            variant="indeterminate"
                          />
                        ) : (
                          <Fragment>
                            &nbsp;
                            <IconButton
                              color="primary"
                              aria-label="retention"
                              size="small"
                              className={classes.propertiesIcon}
                              onClick={() => {
                                setRetentionConfigOpen(true);
                              }}
                            >
                              <PencilIcon active={true} />
                            </IconButton>
                          </Fragment>
                        )}
                      </div>
                    </div>
                  )}
                </Paper>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <br />
          </Grid>
          <Grid container item xs={12}>
            <Grid item xs={9}>
              <Tabs
                value={curTab}
                onChange={(e: React.ChangeEvent<{}>, newValue: number) => {
                  setCurTab(newValue);
                }}
                indicatorColor="primary"
                textColor="primary"
                aria-label="cluster-tabs"
                variant="scrollable"
                scrollButtons="auto"
              >
                <Tab label="Events" {...a11yProps(0)} />
                {canGetReplication && (
                  <Tab label="Replication" {...a11yProps(1)} />
                )}
                <Tab label="Policies" {...a11yProps(2)} />
                {usersEnabled && <Tab label="Users" {...a11yProps(3)} />}
                {ilmEnabled && <Tab label="Lifecycle" {...a11yProps(4)} />}
              </Tabs>
            </Grid>
            <Grid item xs={3} className={classes.actionsTray}>
              {curTab === 0 && (
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<CreateIcon />}
                  size="medium"
                  onClick={() => {
                    setAddScreenOpen(true);
                  }}
                >
                  Subscribe to Event
                </Button>
              )}
              {curTab === 1 && (
                <Fragment>
                  {canPutReplication && (
                    <Button
                      variant="contained"
                      color="primary"
                      startIcon={<CreateIcon />}
                      size="medium"
                      onClick={() => {
                        setOpenReplicationOpen(true);
                      }}
                    >
                      Add Replication Rule
                    </Button>
                  )}
                </Fragment>
              )}
              {curTab === 4 && (
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<CreateIcon />}
                  size="medium"
                  onClick={() => {
                    setAddLifecycleOpen(true);
                  }}
                >
                  Add Lifecycle Rule
                </Button>
              )}
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <TabPanel index={0} value={curTab}>
              <TableWrapper
                itemActions={tableActions}
                columns={[
                  { label: "SQS", elementKey: "arn" },
                  {
                    label: "Events",
                    elementKey: "events",
                    renderFunction: eventsDisplay,
                  },
                  { label: "Prefix", elementKey: "prefix" },
                  { label: "Suffix", elementKey: "suffix" },
                ]}
                isLoading={loadingEvents}
                records={records}
                entityName="Events"
                idField="id"
              />
            </TabPanel>
            {canGetReplication && (
              <TabPanel index={1} value={curTab}>
                <TableWrapper
                  itemActions={replicationTableActions}
                  columns={[
                    { label: "ID", elementKey: "id" },
                    {
                      label: "Priority",
                      elementKey: "priority",
                    },
                    {
                      label: "Destination",
                      elementKey: "destination",
                      renderFunction: ruleDestDisplay,
                    },
                    {
                      label: "Delete Marker Replication",
                      elementKey: "delete_marker_replication",
                      renderFunction: ruleDelDisplay,
                    },
                    { label: "Status", elementKey: "status" },
                  ]}
                  isLoading={loadingEvents}
                  records={replicationRules}
                  entityName="Replication Rules"
                  idField="id"
                />
              </TabPanel>
            )}
            <TabPanel index={2} value={curTab}>
              <TableWrapper
                itemActions={PolicyActions}
                columns={[{ label: "Name", elementKey: "name" }]}
                isLoading={loadingEvents}
                records={bucketPolicy}
                entityName="Policies"
                idField="name"
              />
            </TabPanel>

            {usersEnabled && (
              <TabPanel index={3} value={curTab}>
                <TableWrapper
                  columns={[{ label: "User", elementKey: "accessKey" }]}
                  isLoading={loadingUsers}
                  records={bucketUsers}
                  entityName="Users"
                  idField="accessKey"
                />
              </TabPanel>
            )}
            <TabPanel index={4} value={curTab}>
              <TableWrapper
                itemActions={[]}
                columns={lifecycleColumns}
                isLoading={loadingLifecycle}
                records={lifecycleRecords}
                entityName="Lifecycle"
                customEmptyMessage="There are no Lifecycle rules yet"
                idField="id"
              />
            </TabPanel>
          </Grid>
        </Grid>
      </Grid>
    </Fragment>
  );
};

const mapState = (state: AppState) => ({
  session: state.console.session,
});

const connector = connect(mapState, {
  setErrorSnackMessage,
});

export default withStyles(styles)(connector(ViewBucket));
