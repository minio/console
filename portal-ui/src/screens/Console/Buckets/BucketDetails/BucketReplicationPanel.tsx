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
import { Button } from "@mui/material";
import Grid from "@mui/material/Grid";
import { AddIcon, BucketsIcon } from "../../../../icons";
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
import api from "../../../../common/api";
import TableWrapper from "../../Common/TableWrapper/TableWrapper";
import AddReplicationModal from "./AddReplicationModal";
import DeleteReplicationRule from "./DeleteReplicationRule";
import HelpBox from "../../../../common/HelpBox";
import PanelTitle from "../../Common/PanelTitle/PanelTitle";
import SecureComponent, {
  hasPermission,
} from "../../../../common/SecureComponent/SecureComponent";
import { IAM_SCOPES } from "../../../../common/SecureComponent/permissions";

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
  bucketInfo,
}: IBucketReplicationProps) => {
  const [loadingReplication, setLoadingReplication] = useState<boolean>(true);
  const [replicationRules, setReplicationRules] = useState<
    BucketReplicationRule[]
  >([]);
  const [deleteReplicationModal, setDeleteReplicationModal] =
    useState<boolean>(false);
  const [openSetReplication, setOpenSetReplication] = useState<boolean>(false);
  const [selectedRRule, setSelectedRRule] = useState<string>("");

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

  const confirmDeleteReplication = (replication: BucketReplicationRule) => {
    setSelectedRRule(replication.id);
    setDeleteReplicationModal(true);
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
      disableButtonFunction: () => replicationRules.length > 1,
    },
  ];

  return (
    <Fragment>
      {openSetReplication && (
        <AddReplicationModal
          closeModalAndRefresh={closeAddReplication}
          open={openSetReplication}
          bucketName={bucketName}
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
      <Grid container>
        <Grid item xs={12} className={classes.actionsTray}>
          <PanelTitle>Replication</PanelTitle>
          <SecureComponent
            scopes={[IAM_SCOPES.S3_PUT_REPLICATION_CONFIGURATION]}
            resource={bucketName}
            matchAll
          >
            <Button
              variant="contained"
              color="primary"
              endIcon={<AddIcon />}
              size="medium"
              onClick={() => {
                setOpenReplicationOpen(true);
              }}
            >
              Add Replication Rule
            </Button>
          </SecureComponent>
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
                },
                {
                  label: "Destination",
                  elementKey: "destination",
                  renderFunction: ruleDestDisplay,
                },
                {
                  label: "Prefix",
                  elementKey: "prefix",
                },
                {
                  label: "Tags",
                  elementKey: "tags",
                  renderFunction: tagDisplay,
                },
                { label: "Status", elementKey: "status" },
              ]}
              isLoading={loadingReplication}
              records={replicationRules}
              entityName="Replication Rules"
              idField="id"
              customPaperHeight={classes.twHeight}
            />
          </SecureComponent>
        </Grid>
        <Grid item xs={12}>
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
