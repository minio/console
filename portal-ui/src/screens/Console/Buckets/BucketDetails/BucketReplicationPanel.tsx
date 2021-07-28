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
import { createStyles, Theme, withStyles } from "@material-ui/core/styles";
import { Button } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import { CreateIcon } from "../../../../icons";
import { setErrorSnackMessage } from "../../../../actions";
import {
  actionsTray,
  searchField,
} from "../../Common/FormComponents/common/styleLibrary";
import {
  BucketReplication,
  BucketReplicationDestination,
  BucketReplicationRule,
  HasPermissionResponse,
} from "../types";
import api from "../../../../common/api";
import TableWrapper from "../../Common/TableWrapper/TableWrapper";
import AddReplicationModal from "./AddReplicationModal";
import DeleteReplicationRule from "./DeleteReplicationRule";
import { AppState } from "../../../../store";

interface IBucketReplicationProps {
  classes: any;
  match: any;
  setErrorSnackMessage: typeof setErrorSnackMessage;
}

const styles = (theme: Theme) =>
  createStyles({
    ...searchField,
    ...actionsTray,
    actionsTray: {
      ...actionsTray.actionsTray,
    },
  });

const BucketReplicationPanel = ({
  classes,
  match,
  setErrorSnackMessage,
}: IBucketReplicationProps) => {
  const [canPutReplication, setCanPutReplication] = useState<boolean>(false);
  const [loadingReplication, setLoadingReplication] = useState<boolean>(true);
  const [replicationRules, setReplicationRules] = useState<
    BucketReplicationRule[]
  >([]);
  const [loadingPerms, setLoadingPerms] = useState<boolean>(true);
  const [canGetReplication, setCanGetReplication] = useState<boolean>(false);
  const [deleteReplicationModal, setDeleteReplicationModal] =
    useState<boolean>(false);
  const [openSetReplication, setOpenSetReplication] = useState<boolean>(false);
  const [selectedRRule, setSelectedRRule] = useState<string>("");

  const bucketName = match.params["bucketName"];

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

          let userCanPutReplication = actions.find(
            (s) => s.id === "PutReplicationConfiguration"
          );

          if (userCanPutReplication && userCanPutReplication.can) {
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

  if (!canGetReplication) {
    return null;
  }

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
          <h1 style={{ padding: "0px", margin: "0px" }}>Replication</h1>

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
        </Grid>
        <Grid item xs={12}>
          <br />
        </Grid>
        <Grid item xs={12}>
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
          />
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

export default withStyles(styles)(connector(BucketReplicationPanel));
