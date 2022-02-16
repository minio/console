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
import Grid from "@mui/material/Grid";
import { setErrorSnackMessage } from "../../../../actions";
import {
  actionsTray,
  searchField,
} from "../../Common/FormComponents/common/styleLibrary";
import {
  BucketInfo,
  BucketReplication,
  BucketReplicationDestination,
  BucketReplicationRule,
} from "../types";
import { ErrorResponseHandler } from "../../../../common/types";
import { AppState } from "../../../../store";
import {
  SecureComponent,
  hasPermission,
} from "../../../../common/SecureComponent";
import { IAM_SCOPES } from "../../../../common/SecureComponent/permissions";
import { AddIcon, DeleteIcon, BucketsIcon } from "../../../../icons";
import api from "../../../../common/api";
import TableWrapper from "../../Common/TableWrapper/TableWrapper";
import HelpBox from "../../../../common/HelpBox";
import PanelTitle from "../../Common/PanelTitle/PanelTitle";
import withSuspense from "../../Common/Components/withSuspense";
import RBIconButton from "./SummaryItems/RBIconButton";
import EditReplicationModal from "./EditReplicationModal";

const AddReplicationModal = withSuspense(
  React.lazy(() => import("./AddReplicationModal"))
);
const DeleteReplicationRule = withSuspense(
  React.lazy(() => import("./DeleteReplicationRule"))
);

interface IBucketReplicationProps {
  classes: any;
  match: any;
  setErrorSnackMessage: typeof setErrorSnackMessage;
  loadingBucket: boolean;
  bucketInfo: BucketInfo | null;
}

const styles = (theme: Theme) =>
  createStyles({
    ...searchField,
    ...actionsTray,
    twHeight: {
      minHeight: 400,
    },
  });

const BucketReplicationPanel = ({
  classes,
  match,
  setErrorSnackMessage,
  loadingBucket,
}: IBucketReplicationProps) => {
  const [loadingReplication, setLoadingReplication] = useState<boolean>(true);
  const [replicationRules, setReplicationRules] = useState<
    BucketReplicationRule[]
  >([]);
  const [deleteReplicationModal, setDeleteReplicationModal] =
    useState<boolean>(false);
  const [openSetReplication, setOpenSetReplication] = useState<boolean>(false);
  const [editReplicationModal, setEditReplicationModal] =
    useState<boolean>(false);
  const [selectedRRule, setSelectedRRule] = useState<string>("");
  const [deleteAllRules, setDeleteAllRules] = useState<boolean>(false);

  const bucketName = match.params["bucketName"];

  const displayReplicationRules = hasPermission(bucketName, [
    IAM_SCOPES.S3_GET_REPLICATION_CONFIGURATION,
  ]);

  useEffect(() => {
    if (loadingBucket) {
      setLoadingReplication(true);
    }
  }, [loadingBucket, setLoadingReplication]);

  useEffect(() => {
    if (loadingReplication) {
      if (displayReplicationRules) {
        api
          .invoke("GET", `/api/v1/buckets/${bucketName}/replication`)
          .then((res: BucketReplication) => {
            const r = res.rules ? res.rules : [];

            r.sort((a, b) => a.priority - b.priority);

            setReplicationRules(r);
            setLoadingReplication(false);
          })
          .catch((err: ErrorResponseHandler) => {
            setErrorSnackMessage(err);
            setLoadingReplication(false);
          });
      } else {
        setLoadingReplication(false);
      }
    }
  }, [
    loadingReplication,
    setErrorSnackMessage,
    bucketName,
    displayReplicationRules,
  ]);

  const closeAddReplication = () => {
    setOpenReplicationOpen(false);
    setLoadingReplication(true);
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

  const closeEditReplication = (refresh: boolean) => {
    setEditReplicationModal(false);

    if (refresh) {
      setLoadingReplication(true);
    }
  };

  const confirmDeleteReplication = (replication: BucketReplicationRule) => {
    setSelectedRRule(replication.id);
    setDeleteAllRules(false);
    setDeleteReplicationModal(true);
  };

  const confirmDeleteAllReplicationRules = () => {
    setSelectedRRule("allRules");
    setDeleteAllRules(true);
    setDeleteReplicationModal(true);
  };

  const editReplicationRule = (replication: BucketReplicationRule) => {
    setSelectedRRule(replication.id);
    setEditReplicationModal(true);
  };

  const ruleDestDisplay = (events: BucketReplicationDestination) => {
    return <Fragment>{events.bucket.replace("arn:aws:s3:::", "")}</Fragment>;
  };

  const tagDisplay = (events: BucketReplicationRule) => {
    return <Fragment>{events && events.tags !== "" ? "Yes" : "No"}</Fragment>;
  };

  const replicationTableActions: any = [
    {
      type: "delete",
      onClick: confirmDeleteReplication,
    },
    {
      type: "view",
      onClick: editReplicationRule,
      disableButtonFunction: !hasPermission(
        bucketName,
        [IAM_SCOPES.S3_PUT_REPLICATION_CONFIGURATION],
        true
      ),
    },
  ];

  return (
    <Fragment>
      {openSetReplication && (
        <AddReplicationModal
          closeModalAndRefresh={closeAddReplication}
          open={openSetReplication}
          bucketName={bucketName}
          setReplicationRules={replicationRules}
        />
      )}

      {deleteReplicationModal && (
        <DeleteReplicationRule
          deleteOpen={deleteReplicationModal}
          selectedBucket={bucketName}
          closeDeleteModalAndRefresh={closeReplicationModalDelete}
          ruleToDelete={selectedRRule}
          remainingRules={replicationRules.length}
          deleteAllRules={deleteAllRules}
        />
      )}

      {editReplicationModal && (
        <EditReplicationModal
          closeModalAndRefresh={closeEditReplication}
          open={editReplicationModal}
          bucketName={bucketName}
          ruleID={selectedRRule}
        />
      )}
      <Grid container>
        <Grid item xs={12} className={classes.actionsTray}>
          <PanelTitle>Replication</PanelTitle>
          <div>
            <SecureComponent
              scopes={[IAM_SCOPES.S3_PUT_REPLICATION_CONFIGURATION]}
              resource={bucketName}
              matchAll
              errorProps={{ disabled: true }}
            >
              <RBIconButton
                tooltip={"Remove All Replication Rules"}
                onClick={() => {
                  confirmDeleteAllReplicationRules();
                }}
                text={"Remove All Rules"}
                icon={<DeleteIcon />}
                color={"secondary"}
                variant={"outlined"}
                disabled={replicationRules.length === 0}
              />
            </SecureComponent>
            <SecureComponent
              scopes={[IAM_SCOPES.S3_PUT_REPLICATION_CONFIGURATION]}
              resource={bucketName}
              matchAll
              errorProps={{ disabled: true }}
            >
              <RBIconButton
                tooltip={"Add Replication Rule"}
                onClick={() => {
                  setOpenReplicationOpen(true);
                }}
                text={"Add Replication Rule"}
                icon={<AddIcon />}
                color="primary"
                variant={"contained"}
              />
            </SecureComponent>
          </div>
        </Grid>
        <Grid item xs={12}>
          <SecureComponent
            scopes={[IAM_SCOPES.S3_GET_REPLICATION_CONFIGURATION]}
            resource={bucketName}
            errorProps={{ disabled: true }}
          >
            <TableWrapper
              itemActions={replicationTableActions}
              columns={[
                {
                  label: "Priority",
                  elementKey: "priority",
                  width: 55,
                  contentTextAlign: "center",
                },
                {
                  label: "Destination",
                  elementKey: "destination",
                  renderFunction: ruleDestDisplay,
                },
                {
                  label: "Prefix",
                  elementKey: "prefix",
                  width: 200,
                },
                {
                  label: "Tags",
                  elementKey: "tags",
                  renderFunction: tagDisplay,
                  width: 60,
                },
                { label: "Status", elementKey: "status", width: 100 },
              ]}
              isLoading={loadingReplication}
              records={replicationRules}
              entityName="Replication Rules"
              idField="id"
              customPaperHeight={classes.twHeight}
              textSelectable
            />
          </SecureComponent>
        </Grid>
        <Grid item xs={12}>
          <br />
          <HelpBox
            title={"Replication"}
            iconComponent={<BucketsIcon />}
            help={
              <Fragment>
                MinIO supports server-side and client-side replication of
                objects between source and destination buckets.
                <br />
                <br />
                You can learn more at our{" "}
                <a
                  href="https://docs.min.io/minio/baremetal/replication/replication-overview.html?ref=con"
                  target="_blank"
                  rel="noreferrer"
                >
                  documentation
                </a>
                .
              </Fragment>
            }
          />
        </Grid>
      </Grid>
    </Fragment>
  );
};

const mapState = (state: AppState) => ({
  session: state.console.session,
  loadingBucket: state.buckets.bucketDetails.loadingBucket,
  bucketInfo: state.buckets.bucketDetails.bucketInfo,
});

const connector = connect(mapState, {
  setErrorSnackMessage,
});

export default withStyles(styles)(connector(BucketReplicationPanel));
