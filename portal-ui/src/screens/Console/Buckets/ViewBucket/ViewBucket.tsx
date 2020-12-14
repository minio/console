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

import React, { useCallback, useEffect, useState } from "react";
import get from "lodash/get";
import { createStyles, Theme, withStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import CircularProgress from "@material-ui/core/CircularProgress";
import api from "../../../../common/api";
import {
  BucketEvent,
  BucketEventList,
  BucketInfo,
  BucketEncryptionInfo,
  BucketList,
  BucketReplication,
  BucketReplicationDestination,
  BucketReplicationRule,
  BucketReplicationRuleDeleteMarker,
  BucketVersioning,
} from "../types";
import { Button } from "@material-ui/core";
import SetAccessPolicy from "./SetAccessPolicy";
import { CreateIcon } from "../../../../icons";
import AddEvent from "./AddEvent";
import DeleteEvent from "./DeleteEvent";
import TableWrapper from "../../Common/TableWrapper/TableWrapper";
import { niceBytes } from "../../../../common/utils";
import AddReplicationModal from "./AddReplicationModal";
import { containerForHeader } from "../../Common/FormComponents/common/styleLibrary";
import PageHeader from "../../Common/PageHeader/PageHeader";
import Checkbox from "@material-ui/core/Checkbox";
import EnableBucketEncryption from "./EnableBucketEncryption";
import ErrorBlock from "../../../shared/ErrorBlock";

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
      paddingLeft: 23,
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
    tabPan: {
      marginTop: "5px",
    },
    ...containerForHeader(theme.spacing(4)),
  });

interface IViewBucketProps {
  classes: any;
  match: any;
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
      {value === index && <React.Fragment>{children}</React.Fragment>}
    </div>
  );
}

function a11yProps(index: any) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

interface IViewBucketState {
  info: BucketInfo | null;
  records: BucketEvent[];
  replicationRules: BucketReplicationRule[];
  loadingBucket: boolean;
  loadingEvents: boolean;
  loadingSize: boolean;
  error: string;
  deleteError: string;
  errBucket: string;
  setAccessPolicyScreenOpen: boolean;
  curTab: number;
  addScreenOpen: boolean;
  enableEncryptionScreenOpen: boolean;
  deleteOpen: boolean;
  selectedBucket: string;
  selectedEvent: BucketEvent | null;
  bucketSize: string;
  errorSize: string;
  replicationSet: boolean;
  openSetReplication: boolean;
  isVersioned: boolean;
  encryptionEnabled: boolean;
}

const ViewBucket = ({ classes, match }: IViewBucketProps) => {
  const [info, setInfo] = useState<BucketInfo | null>(null);
  const [records, setRecords] = useState<BucketEvent[]>([]);
  const [replicationRules, setReplicationRules] = useState<
    BucketReplicationRule[]
  >([]);
  const [loadingBucket, setLoadingBucket] = useState<boolean>(true);
  const [loadingEvents, setLoadingEvents] = useState<boolean>(true);
  const [loadingSize, setLoadingSize] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [errBucket, setErrBucket] = useState<string>("");
  const [accessPolicyScreenOpen, setAccessPolicyScreenOpen] = useState<boolean>(
    false
  );
  const [curTab, setCurTab] = useState<number>(0);
  const [addScreenOpen, setAddScreenOpen] = useState<boolean>(false);
  const [
    enableEncryptionScreenOpen,
    setEnableEncryptionScreenOpen,
  ] = useState<boolean>(false);
  const [deleteOpen, setDeleteOpen] = useState<boolean>(false);
  const [selectedEvent, setSelectedEvent] = useState<BucketEvent | null>(null);
  const [bucketSize, setBucketSize] = useState<string>("0");
  const [errorSize, setErrorSize] = useState<string>("");
  const [openSetReplication, setOpenSetReplication] = useState<boolean>(false);
  const [isVersioned, setIsVersioned] = useState<boolean>(false);
  const [encryptionEnabled, setEncryptionEnabled] = useState<boolean>(false);

  const fetchEvents = useCallback(() => {
    setLoadingBucket(true);
    const bucketName = match.params["bucketName"];
    api
      .invoke("GET", `/api/v1/buckets/${bucketName}/events`)
      .then((res: BucketEventList) => {
        const events = get(res, "events", []);
        setLoadingEvents(false);
        setError("");
        setRecords(events || []);
      })
      .catch((err: any) => {
        setLoadingEvents(false);
        setError(err);
      });

    api
      .invoke("GET", `/api/v1/buckets/${bucketName}/versioning`)
      .then((res: BucketVersioning) => {
        setIsVersioned(res.is_versioned);
      })
      .catch((err: any) => {
        setError(err);
      });

    api
      .invoke("GET", `/api/v1/buckets/${bucketName}/replication`)
      .then((res: BucketReplication) => {
        const r = res.rules ? res.rules : [];
        setReplicationRules(r);
      })
      .catch((err: any) => {
        setError(err);
      });
  }, [match]);

  const fetchBucketsSize = useCallback(() => {
    const bucketName = match.params["bucketName"];
    setLoadingSize(true);
    api
      .invoke("GET", `/api/v1/buckets`)
      .then((res: BucketList) => {
        const resBuckets = get(res, "buckets", []);

        const bucketInfo = resBuckets.find(
          (bucket) => bucket.name === bucketName
        );

        const size = get(bucketInfo, "size", "0");

        setLoadingSize(false);
        setErrorSize("");
        setBucketSize(size);
      })
      .catch((err: any) => {
        setLoadingSize(false);
        setErrorSize(err);
      });
  }, [match]);

  const loadInfo = useCallback(() => {
    const bucketName = match.params["bucketName"];
    setLoadingBucket(true);

    api
      .invoke("GET", `/api/v1/buckets/${bucketName}`)
      .then((res: BucketInfo) => {
        setLoadingBucket(false);
        setInfo(res);
      })
      .catch((err) => {
        setLoadingBucket(false);
        setErrBucket(err);
      });
  }, [match]);

  const fetchBucketEncryptionInfo = useCallback(() => {
    const bucketName = match.params["bucketName"];
    api
      .invoke("GET", `/api/v1/buckets/${bucketName}/encryption/info`)
      .then((res: BucketEncryptionInfo) => {
        if (res.algorithm) {
          setEncryptionEnabled(true);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, [match]);

  const closeAddModalAndRefresh = () => {
    setAccessPolicyScreenOpen(false);
    loadInfo();
  };

  const closeDeleteModalAndRefresh = (refresh: boolean) => {
    setDeleteOpen(false);
    if (refresh) {
      fetchEvents();
    }
  };

  useEffect(() => {
    loadInfo();
    fetchEvents();
    fetchBucketsSize();
    fetchBucketEncryptionInfo();
  }, [loadInfo, fetchEvents, fetchBucketsSize, fetchBucketEncryptionInfo]);

  const bucketName = match.params["bucketName"];

  const confirmDeleteEvent = (evnt: BucketEvent) => {
    setDeleteOpen(true);
    setSelectedEvent(evnt);
  };

  let accessPolicy = "n/a";

  if (info !== null) {
    accessPolicy = info.access;
  }

  const eventsDisplay = (events: string[]) => {
    return <React.Fragment>{events.join(", ")}</React.Fragment>;
  };

  const ruleDestDisplay = (events: BucketReplicationDestination) => {
    return (
      <React.Fragment>
        {events.bucket.replace("arn:aws:s3:::", "")}
      </React.Fragment>
    );
  };

  const ruleDelDisplay = (events: BucketReplicationRuleDeleteMarker) => {
    return <React.Fragment>{events.status}</React.Fragment>;
  };

  const setOpenReplicationOpen = (open = false) => {
    setOpenSetReplication(open);
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
          setError(err);
        });
    }
  };

  const tableActions = [{ type: "delete", onClick: confirmDeleteEvent }];

  return (
    <React.Fragment>
      {addScreenOpen && (
        <AddEvent
          open={addScreenOpen}
          selectedBucket={bucketName}
          closeModalAndRefresh={() => {
            setAddScreenOpen(false);
            fetchEvents();
          }}
        />
      )}
      {enableEncryptionScreenOpen && (
        <EnableBucketEncryption
          open={enableEncryptionScreenOpen}
          selectedBucket={bucketName}
          closeModalAndRefresh={() => {
            setEnableEncryptionScreenOpen(false);
            fetchBucketEncryptionInfo();
          }}
        />
      )}
      {accessPolicyScreenOpen && (
        <SetAccessPolicy
          bucketName={bucketName}
          open={accessPolicyScreenOpen}
          actualPolicy={accessPolicy}
          closeModalAndRefresh={() => {
            closeAddModalAndRefresh();
          }}
        />
      )}
      {openSetReplication && (
        <AddReplicationModal
          closeModalAndRefresh={() => {
            setOpenReplicationOpen(false);
            fetchEvents();
          }}
          open={openSetReplication}
          bucketName={bucketName}
        />
      )}
      <PageHeader label={`Bucket > ${match.params["bucketName"]}`} />
      <Grid container>
        {error !== "" && (
          <Grid item xs={12}>
            <ErrorBlock errorMessage={error} withBreak={false} />
          </Grid>
        )}
        {errBucket !== "" && (
          <Grid item xs={12}>
            {errBucket}
          </Grid>
        )}
        {errorSize !== "" && (
          <Grid item xs={12}>
            {errorSize}
          </Grid>
        )}
        <Grid item xs={12} className={classes.container}>
          <Grid item xs={12}>
            <div className={classes.headerContainer}>
              <div>
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
                    </div>
                    <div>Reported Usage:</div>
                    <div>
                      {loadingSize ? (
                        <CircularProgress
                          color="primary"
                          size={16}
                          variant="indeterminate"
                        />
                      ) : (
                        niceBytes(bucketSize)
                      )}
                    </div>
                    <div>Replication:</div>
                    <div className={classes.doubleElement}>
                      <span>{replicationRules.length ? "Yes" : "No"}</span>
                    </div>
                    <div>Versioning:</div>
                    <div>{isVersioned ? "Yes" : "No"}&nbsp;</div>
                    <div>Encryption:</div>
                    <div>
                      <Checkbox
                        color="primary"
                        inputProps={{
                          "aria-label": "secondary checkbox",
                        }}
                        onChange={(event) => handleEncryptionCheckbox(event)}
                        checked={encryptionEnabled}
                      />
                    </div>
                  </div>
                </Paper>
              </div>
              <div className={classes.masterActions}>
                <div>
                  <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    size="medium"
                    onClick={() => {
                      setAccessPolicyScreenOpen(true);
                    }}
                  >
                    Change Access Policy
                  </Button>
                </div>
              </div>
            </div>
          </Grid>
          <Grid item xs={12}>
            <br />
          </Grid>
          <Grid container item xs={12}>
            <Grid item xs={6}>
              <Tabs
                value={curTab}
                onChange={(e: React.ChangeEvent<{}>, newValue: number) => {
                  setCurTab(newValue);
                }}
                indicatorColor="primary"
                textColor="primary"
                aria-label="cluster-tabs"
              >
                <Tab label="Events" {...a11yProps(0)} />
                <Tab label="Replication" {...a11yProps(1)} />
              </Tabs>
            </Grid>
            <Grid item xs={6} className={classes.actionsTray}>
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
            <TabPanel index={1} value={curTab}>
              <TableWrapper
                itemActions={tableActions}
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
                    label: "Delete Replication",
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
          </Grid>
        </Grid>
      </Grid>

      <DeleteEvent
        deleteOpen={deleteOpen}
        selectedBucket={bucketName}
        bucketEvent={selectedEvent}
        closeDeleteModalAndRefresh={(refresh: boolean) => {
          closeDeleteModalAndRefresh(refresh);
        }}
      />
    </React.Fragment>
  );
};

export default withStyles(styles)(ViewBucket);
