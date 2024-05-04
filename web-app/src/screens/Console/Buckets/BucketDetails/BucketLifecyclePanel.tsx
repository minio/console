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
import {
  AddIcon,
  Button,
  DataTable,
  Grid,
  HelpBox,
  SectionTitle,
  TiersIcon,
  HelpTip,
} from "mds";
import { useSelector } from "react-redux";
import { api } from "api";
import { ObjectBucketLifecycle } from "api/consoleApi";
import { LifeCycleItem } from "../types";
import {
  hasPermission,
  SecureComponent,
} from "../../../../common/SecureComponent";
import { IAM_SCOPES } from "../../../../common/SecureComponent/permissions";
import { selBucketDetailsLoading } from "./bucketDetailsSlice";
import { useParams } from "react-router-dom";
import { setHelpName } from "../../../../systemSlice";
import { useAppDispatch } from "../../../../store";
import DeleteBucketLifecycleRule from "./DeleteBucketLifecycleRule";
import EditLifecycleConfiguration from "./EditLifecycleConfiguration";
import AddLifecycleModal from "./AddLifecycleModal";
import TooltipWrapper from "../../Common/TooltipWrapper/TooltipWrapper";

const BucketLifecyclePanel = () => {
  const loadingBucket = useSelector(selBucketDetailsLoading);
  const params = useParams();

  const [loadingLifecycle, setLoadingLifecycle] = useState<boolean>(true);
  const [lifecycleRecords, setLifecycleRecords] = useState<
    ObjectBucketLifecycle[]
  >([]);
  const [addLifecycleOpen, setAddLifecycleOpen] = useState<boolean>(false);
  const [editLifecycleOpen, setEditLifecycleOpen] = useState<boolean>(false);
  const [selectedLifecycleRule, setSelectedLifecycleRule] =
    useState<LifeCycleItem | null>(null);
  const [deleteLifecycleOpen, setDeleteLifecycleOpen] =
    useState<boolean>(false);
  const [selectedID, setSelectedID] = useState<string | null>(null);
  const dispatch = useAppDispatch();

  const bucketName = params.bucketName || "";

  const displayLifeCycleRules = hasPermission(bucketName, [
    IAM_SCOPES.S3_GET_LIFECYCLE_CONFIGURATION,
    IAM_SCOPES.S3_GET_ACTIONS,
  ]);

  useEffect(() => {
    if (loadingBucket) {
      setLoadingLifecycle(true);
    }
  }, [loadingBucket, setLoadingLifecycle]);

  useEffect(() => {
    dispatch(setHelpName("bucket_detail_lifecycle"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (loadingLifecycle) {
      if (displayLifeCycleRules) {
        api.buckets
          .getBucketLifecycle(bucketName)
          .then((res) => {
            const records = get(res.data, "lifecycle", []);
            setLifecycleRecords(records || []);
            setLoadingLifecycle(false);
          })
          .catch((err) => {
            console.error(err.error);
            setLifecycleRecords([]);
            setLoadingLifecycle(false);
          });
      } else {
        setLoadingLifecycle(false);
      }
    }
  }, [
    loadingLifecycle,
    setLoadingLifecycle,
    bucketName,
    displayLifeCycleRules,
  ]);

  const closeEditLCAndRefresh = (refresh: boolean) => {
    setEditLifecycleOpen(false);
    setSelectedLifecycleRule(null);
    if (refresh) {
      setLoadingLifecycle(true);
    }
  };

  const closeAddLCAndRefresh = (refresh: boolean) => {
    setAddLifecycleOpen(false);
    if (refresh) {
      setLoadingLifecycle(true);
    }
  };

  const closeDelLCRefresh = (refresh: boolean) => {
    setDeleteLifecycleOpen(false);
    setSelectedID(null);

    if (refresh) {
      setLoadingLifecycle(true);
    }
  };

  const renderStorageClass = (objectST: any) => {
    let stClass = get(objectST, "transition.storage_class", "");
    stClass = get(objectST, "transition.noncurrent_storage_class", stClass);

    return stClass;
  };

  const lifecycleColumns = [
    {
      label: "Type",
      renderFullObject: true,
      renderFunction: (el: LifeCycleItem) => {
        if (!el) {
          return <Fragment />;
        }
        if (
          el.expiration &&
          (el.expiration.days > 0 ||
            el.expiration.noncurrent_expiration_days ||
            (el.expiration.newer_noncurrent_expiration_versions &&
              el.expiration.newer_noncurrent_expiration_versions > 0))
        ) {
          return <span>Expiry</span>;
        }
        if (
          el.transition &&
          (el.transition.days > 0 || el.transition.noncurrent_transition_days)
        ) {
          return <span>Transition</span>;
        }
        return <Fragment />;
      },
    },
    {
      label: "Version",
      renderFullObject: true,
      renderFunction: (el: LifeCycleItem) => {
        if (!el) {
          return <Fragment />;
        }
        if (el.expiration) {
          if (el.expiration.days > 0) {
            return <span>Current</span>;
          } else if (
            el.expiration.noncurrent_expiration_days ||
            el.expiration.newer_noncurrent_expiration_versions
          ) {
            return <span>Non-Current</span>;
          }
        }
        if (el.transition) {
          if (el.transition.days > 0) {
            return <span>Current</span>;
          } else if (el.transition.noncurrent_transition_days) {
            return <span>Non-Current</span>;
          }
        }
      },
    },
    {
      label: "Expire Delete Marker",
      elementKey: "expire_delete_marker",
      renderFunction: (el: LifeCycleItem) => {
        if (!el) {
          return <Fragment />;
        }
        if (el.expiration && el.expiration.delete_marker !== undefined) {
          return <span>{el.expiration.delete_marker ? "true" : "false"}</span>;
        } else {
          return <Fragment />;
        }
      },
      renderFullObject: true,
    },
    {
      label: "Tier",
      elementKey: "storage_class",
      renderFunction: renderStorageClass,
      renderFullObject: true,
    },
    {
      label: "Prefix",
      elementKey: "prefix",
    },
    {
      label: "After",
      renderFullObject: true,
      renderFunction: (el: LifeCycleItem) => {
        if (!el) {
          return <Fragment />;
        }
        if (el.transition) {
          if (el.transition.days > 0) {
            return <span>{el.transition.days} days</span>;
          } else if (el.transition.noncurrent_transition_days) {
            return <span>{el.transition.noncurrent_transition_days} days</span>;
          }
        }
        if (el.expiration) {
          if (el.expiration.days > 0) {
            return <span>{el.expiration.days} days</span>;
          } else if (el.expiration.noncurrent_expiration_days) {
            return <span>{el.expiration.noncurrent_expiration_days} days</span>;
          } else {
            return (
              <span>
                {el.expiration.newer_noncurrent_expiration_versions} versions
              </span>
            );
          }
        }
      },
    },
    {
      label: "Status",
      elementKey: "status",
    },
  ];

  const lifecycleActions = [
    {
      type: "view",

      onClick(valueToSend: any): any {
        setSelectedLifecycleRule(valueToSend);
        setEditLifecycleOpen(true);
      },
    },
    {
      type: "delete",
      onClick(valueToDelete: string): any {
        setSelectedID(valueToDelete);
        setDeleteLifecycleOpen(true);
      },
      sendOnlyId: true,
    },
  ];

  return (
    <Fragment>
      {editLifecycleOpen && selectedLifecycleRule && (
        <EditLifecycleConfiguration
          open={editLifecycleOpen}
          closeModalAndRefresh={closeEditLCAndRefresh}
          selectedBucket={bucketName}
          lifecycleRule={selectedLifecycleRule}
        />
      )}
      {addLifecycleOpen && (
        <AddLifecycleModal
          open={addLifecycleOpen}
          bucketName={bucketName}
          closeModalAndRefresh={closeAddLCAndRefresh}
        />
      )}
      {deleteLifecycleOpen && selectedID && (
        <DeleteBucketLifecycleRule
          id={selectedID}
          bucket={bucketName}
          deleteOpen={deleteLifecycleOpen}
          onCloseAndRefresh={closeDelLCRefresh}
        />
      )}
      <SectionTitle
        separator
        sx={{ marginBottom: 15 }}
        actions={
          <SecureComponent
            scopes={[
              IAM_SCOPES.S3_PUT_LIFECYCLE_CONFIGURATION,
              IAM_SCOPES.S3_PUT_ACTIONS,
            ]}
            resource={bucketName}
            matchAll
            errorProps={{ disabled: true }}
          >
            <TooltipWrapper tooltip={"Add Lifecycle Rule"}>
              <Button
                id={"add-bucket-lifecycle-rule"}
                onClick={() => {
                  setAddLifecycleOpen(true);
                }}
                label={"Add Lifecycle Rule"}
                icon={<AddIcon />}
                variant={"callAction"}
              />
            </TooltipWrapper>
          </SecureComponent>
        }
      >
        <HelpTip
          content={
            <Fragment>
              MinIO derives it’s behavior and syntax from{" "}
              <a
                target="blank"
                href="https://docs.aws.amazon.com/AmazonS3/latest/userguide/object-lifecycle-mgmt.html"
              >
                S3 lifecycle
              </a>{" "}
              for compatibility in migrating workloads and lifecycle rules from
              S3 to MinIO.
            </Fragment>
          }
          placement="right"
        >
          Lifecycle Rules
        </HelpTip>
      </SectionTitle>
      <Grid container>
        <Grid item xs={12}>
          <SecureComponent
            scopes={[
              IAM_SCOPES.S3_GET_LIFECYCLE_CONFIGURATION,
              IAM_SCOPES.S3_GET_ACTIONS,
            ]}
            resource={bucketName}
            errorProps={{ disabled: true }}
          >
            <DataTable
              itemActions={lifecycleActions}
              columns={lifecycleColumns}
              isLoading={loadingLifecycle}
              records={lifecycleRecords}
              entityName="Lifecycle"
              customEmptyMessage="There are no Lifecycle rules yet"
              idField="id"
              customPaperHeight={"400px"}
            />
          </SecureComponent>
        </Grid>
        {!loadingLifecycle && (
          <Grid item xs={12}>
            <br />
            <HelpBox
              title={"Lifecycle Rules"}
              iconComponent={<TiersIcon />}
              help={
                <Fragment>
                  MinIO Object Lifecycle Management allows creating rules for
                  time or date based automatic transition or expiry of objects.
                  For object transition, MinIO automatically moves the object to
                  a configured remote storage tier.
                  <br />
                  <br />
                  You can learn more at our{" "}
                  <a
                    href="https://min.io/docs/minio/linux/administration/object-management/object-lifecycle-management.html?ref=con"
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
        )}
      </Grid>
    </Fragment>
  );
};

export default BucketLifecyclePanel;
