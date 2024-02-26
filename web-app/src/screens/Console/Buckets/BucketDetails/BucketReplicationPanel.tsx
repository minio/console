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
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
  AddIcon,
  Box,
  BucketsIcon,
  Button,
  DataTable,
  Grid,
  HelpBox,
  SectionTitle,
  TrashIcon,
  HelpTip,
} from "mds";
import api from "../../../../common/api";
import {
  BucketReplication,
  BucketReplicationDestination,
  BucketReplicationRule,
} from "../types";
import { ErrorResponseHandler } from "../../../../common/types";
import {
  hasPermission,
  SecureComponent,
} from "../../../../common/SecureComponent";
import {
  IAM_PAGES,
  IAM_SCOPES,
} from "../../../../common/SecureComponent/permissions";
import { setErrorSnackMessage, setHelpName } from "../../../../systemSlice";
import { selBucketDetailsLoading } from "./bucketDetailsSlice";
import { useAppDispatch } from "../../../../store";
import TooltipWrapper from "../../Common/TooltipWrapper/TooltipWrapper";
import withSuspense from "../../Common/Components/withSuspense";

const EditReplicationModal = withSuspense(
  React.lazy(() => import("./EditReplicationModal")),
);
const AddReplicationModal = withSuspense(
  React.lazy(() => import("./AddReplicationModal")),
);
const DeleteReplicationRule = withSuspense(
  React.lazy(() => import("./DeleteReplicationRule")),
);

const BucketReplicationPanel = () => {
  const dispatch = useAppDispatch();
  const params = useParams();

  const loadingBucket = useSelector(selBucketDetailsLoading);

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
  const [selectedRepRules, setSelectedRepRules] = useState<string[]>([]);
  const [deleteSelectedRules, setDeleteSelectedRules] =
    useState<boolean>(false);

  const bucketName = params.bucketName || "";

  const displayReplicationRules = hasPermission(bucketName, [
    IAM_SCOPES.S3_GET_REPLICATION_CONFIGURATION,
    IAM_SCOPES.S3_GET_ACTIONS,
  ]);
  useEffect(() => {
    dispatch(setHelpName("bucket_detail_replication"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
            dispatch(setErrorSnackMessage(err));
            setLoadingReplication(false);
          });
      } else {
        setLoadingReplication(false);
      }
    }
  }, [loadingReplication, dispatch, bucketName, displayReplicationRules]);

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
    setDeleteSelectedRules(false);
    setDeleteReplicationModal(true);
  };

  const confirmDeleteSelectedReplicationRules = () => {
    setSelectedRRule("selectedRules");
    setDeleteSelectedRules(true);
    setDeleteReplicationModal(true);
  };
  const navigate = useNavigate();
  const editReplicationRule = (replication: BucketReplicationRule) => {
    setSelectedRRule(replication.id);
    navigate(
      `/buckets/edit-replication?bucketName=${bucketName}&ruleID=${replication.id}`,
    );
  };

  const ruleDestDisplay = (events: BucketReplicationDestination) => {
    return <Fragment>{events.bucket.replace("arn:aws:s3:::", "")}</Fragment>;
  };

  const tagDisplay = (events: BucketReplicationRule) => {
    return <Fragment>{events && events.tags !== "" ? "Yes" : "No"}</Fragment>;
  };

  const selectAllItems = () => {
    if (selectedRepRules.length === replicationRules.length) {
      setSelectedRepRules([]);
      return;
    }
    setSelectedRepRules(replicationRules.map((x) => x.id));
  };

  const selectRules = (e: React.ChangeEvent<HTMLInputElement>) => {
    const targetD = e.target;
    const value = targetD.value;
    const checked = targetD.checked;

    let elements: string[] = [...selectedRepRules]; // We clone the selectedSAs array
    if (checked) {
      // If the user has checked this field we need to push this to selectedSAs
      elements.push(value);
    } else {
      // User has unchecked this field, we need to remove it from the list
      elements = elements.filter((element) => element !== value);
    }
    setSelectedRepRules(elements);
    return elements;
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
        [
          IAM_SCOPES.S3_PUT_REPLICATION_CONFIGURATION,
          IAM_SCOPES.S3_PUT_ACTIONS,
        ],
        true,
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
          rulesToDelete={selectedRepRules}
          remainingRules={replicationRules.length}
          allSelected={
            replicationRules.length > 0 &&
            selectedRepRules.length === replicationRules.length
          }
          deleteSelectedRules={deleteSelectedRules}
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
      <SectionTitle
        separator
        sx={{ marginBottom: 15 }}
        actions={
          <Box style={{ display: "flex", gap: 10 }}>
            <SecureComponent
              scopes={[
                IAM_SCOPES.S3_PUT_REPLICATION_CONFIGURATION,
                IAM_SCOPES.S3_PUT_ACTIONS,
              ]}
              resource={bucketName}
              matchAll
              errorProps={{ disabled: true }}
            >
              <TooltipWrapper tooltip={"Remove Selected Replication Rules"}>
                <Button
                  id={"remove-bucket-replication-rule"}
                  onClick={() => {
                    confirmDeleteSelectedReplicationRules();
                  }}
                  label={"Remove Selected Rules"}
                  icon={<TrashIcon />}
                  color={"secondary"}
                  disabled={
                    selectedRepRules.length === 0 ||
                    replicationRules.length === 0
                  }
                  variant={"secondary"}
                />
              </TooltipWrapper>
            </SecureComponent>
            <SecureComponent
              scopes={[
                IAM_SCOPES.S3_PUT_REPLICATION_CONFIGURATION,
                IAM_SCOPES.S3_PUT_ACTIONS,
              ]}
              resource={bucketName}
              matchAll
              errorProps={{ disabled: true }}
            >
              <TooltipWrapper tooltip={"Add Replication Rule"}>
                <Button
                  id={"add-bucket-replication-rule"}
                  onClick={() => {
                    navigate(
                      IAM_PAGES.BUCKETS_ADD_REPLICATION +
                        `?bucketName=${bucketName}&nextPriority=${
                          replicationRules.length + 1
                        }`,
                    );
                  }}
                  label={"Add Replication Rule"}
                  icon={<AddIcon />}
                  variant={"callAction"}
                />
              </TooltipWrapper>
            </SecureComponent>
          </Box>
        }
      >
        <HelpTip
          content={
            <Fragment>
              MinIO{" "}
              <a
                target="blank"
                href="https://min.io/docs/minio/kubernetes/upstream/administration/bucket-replication.html"
              >
                server-side bucket replication
              </a>{" "}
              is an automatic bucket-level configuration that synchronizes
              objects between a source and destination bucket.
            </Fragment>
          }
          placement="right"
        >
          Replication
        </HelpTip>
      </SectionTitle>
      <Grid container>
        <Grid item xs={12}>
          <SecureComponent
            scopes={[
              IAM_SCOPES.S3_GET_REPLICATION_CONFIGURATION,
              IAM_SCOPES.S3_GET_ACTIONS,
            ]}
            resource={bucketName}
            errorProps={{ disabled: true }}
          >
            <DataTable
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
              customPaperHeight={"400px"}
              textSelectable
              selectedItems={selectedRepRules}
              onSelect={(e) => selectRules(e)}
              onSelectAll={selectAllItems}
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
                  href="https://min.io/docs/minio/linux/administration/bucket-replication.html?ref=con"
                  target="_blank"
                  rel="noopener"
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

export default BucketReplicationPanel;
