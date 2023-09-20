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
import { AddIcon, Button, DataTable, SectionTitle, HelpTip } from "mds";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { api } from "api";
import { AccessRule as IAccessRule } from "api/consoleApi";
import { errorToHandler } from "api/errors";
import { IAM_SCOPES } from "../../../../common/SecureComponent/permissions";
import {
  hasPermission,
  SecureComponent,
} from "../../../../common/SecureComponent";
import { setErrorSnackMessage, setHelpName } from "../../../../systemSlice";
import { selBucketDetailsLoading } from "./bucketDetailsSlice";
import { useAppDispatch } from "../../../../store";
import withSuspense from "../../Common/Components/withSuspense";
import TooltipWrapper from "../../Common/TooltipWrapper/TooltipWrapper";

const AddAccessRuleModal = withSuspense(
  React.lazy(() => import("./AddAccessRule")),
);
const DeleteAccessRuleModal = withSuspense(
  React.lazy(() => import("./DeleteAccessRule")),
);
const EditAccessRuleModal = withSuspense(
  React.lazy(() => import("./EditAccessRule")),
);

const AccessRule = () => {
  const dispatch = useAppDispatch();
  const params = useParams();

  const loadingBucket = useSelector(selBucketDetailsLoading);

  const [loadingAccessRules, setLoadingAccessRules] = useState<boolean>(true);
  const [accessRules, setAccessRules] = useState<IAccessRule[] | undefined>([]);
  const [addAccessRuleOpen, setAddAccessRuleOpen] = useState<boolean>(false);
  const [deleteAccessRuleOpen, setDeleteAccessRuleOpen] =
    useState<boolean>(false);
  const [accessRuleToDelete, setAccessRuleToDelete] = useState<string>("");
  const [editAccessRuleOpen, setEditAccessRuleOpen] = useState<boolean>(false);
  const [accessRuleToEdit, setAccessRuleToEdit] = useState<string>("");
  const [initialAccess, setInitialAccess] = useState<string>("");

  const bucketName = params.bucketName || "";

  const displayAccessRules = hasPermission(bucketName, [
    IAM_SCOPES.S3_GET_BUCKET_POLICY,
    IAM_SCOPES.S3_GET_ACTIONS,
  ]);

  const deleteAccessRules = hasPermission(bucketName, [
    IAM_SCOPES.S3_DELETE_BUCKET_POLICY,
  ]);

  const editAccessRules = hasPermission(bucketName, [
    IAM_SCOPES.S3_PUT_BUCKET_POLICY,
    IAM_SCOPES.S3_PUT_ACTIONS,
  ]);

  useEffect(() => {
    if (loadingBucket) {
      setLoadingAccessRules(true);
    }
  }, [loadingBucket, setLoadingAccessRules]);

  const AccessRuleActions = [
    {
      type: "delete",
      disableButtonFunction: () => !deleteAccessRules,
      onClick: (accessRule: any) => {
        setDeleteAccessRuleOpen(true);
        setAccessRuleToDelete(accessRule.prefix);
      },
    },
    {
      type: "view",
      disableButtonFunction: () => !editAccessRules,
      onClick: (accessRule: any) => {
        setAccessRuleToEdit(accessRule.prefix);
        setInitialAccess(accessRule.access);
        setEditAccessRuleOpen(true);
      },
    },
  ];

  useEffect(() => {
    dispatch(setHelpName("bucket_detail_prefix"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (loadingAccessRules) {
      if (displayAccessRules) {
        api.bucket
          .listAccessRulesWithBucket(bucketName)
          .then((res) => {
            setAccessRules(res.data.accessRules);
            setLoadingAccessRules(false);
          })
          .catch((err) => {
            dispatch(setErrorSnackMessage(errorToHandler(err)));
            setLoadingAccessRules(false);
          });
      } else {
        setLoadingAccessRules(false);
      }
    }
  }, [loadingAccessRules, dispatch, displayAccessRules, bucketName]);

  const closeAddAccessRuleModal = () => {
    setAddAccessRuleOpen(false);
    setLoadingAccessRules(true);
  };

  const closeDeleteAccessRuleModal = () => {
    setDeleteAccessRuleOpen(false);
    setLoadingAccessRules(true);
  };

  const closeEditAccessRuleModal = () => {
    setEditAccessRuleOpen(false);
    setLoadingAccessRules(true);
  };

  return (
    <Fragment>
      {addAccessRuleOpen && (
        <AddAccessRuleModal
          modalOpen={addAccessRuleOpen}
          onClose={closeAddAccessRuleModal}
          bucket={bucketName}
        />
      )}
      {deleteAccessRuleOpen && (
        <DeleteAccessRuleModal
          modalOpen={deleteAccessRuleOpen}
          onClose={closeDeleteAccessRuleModal}
          bucket={bucketName}
          toDelete={accessRuleToDelete}
        />
      )}
      {editAccessRuleOpen && (
        <EditAccessRuleModal
          modalOpen={editAccessRuleOpen}
          onClose={closeEditAccessRuleModal}
          bucket={bucketName}
          toEdit={accessRuleToEdit}
          initial={initialAccess}
        />
      )}
      <SectionTitle
        separator
        sx={{ marginBottom: 15 }}
        actions={
          <SecureComponent
            scopes={[
              IAM_SCOPES.S3_GET_BUCKET_POLICY,
              IAM_SCOPES.S3_PUT_BUCKET_POLICY,
              IAM_SCOPES.S3_GET_ACTIONS,
              IAM_SCOPES.S3_PUT_ACTIONS,
            ]}
            resource={bucketName}
            matchAll
            errorProps={{ disabled: true }}
          >
            <TooltipWrapper tooltip={"Add Access Rule"}>
              <Button
                id={"add-bucket-access-rule"}
                onClick={() => {
                  setAddAccessRuleOpen(true);
                }}
                label={"Add Access Rule"}
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
              Setting an{" "}
              <a
                href="https://min.io/docs/minio/linux/reference/minio-mc/mc-anonymous-set.html"
                target="blank"
              >
                Anonymous
              </a>{" "}
              policy allows clients to access the Bucket or prefix contents and
              perform actions consistent with the specified policy without
              authentication.
            </Fragment>
          }
          placement="right"
        >
          Anonymous Access
        </HelpTip>
      </SectionTitle>
      <SecureComponent
        scopes={[IAM_SCOPES.S3_GET_BUCKET_POLICY, IAM_SCOPES.S3_GET_ACTIONS]}
        resource={bucketName}
        errorProps={{ disabled: true }}
      >
        <DataTable
          itemActions={AccessRuleActions}
          columns={[
            {
              label: "Prefix",
              elementKey: "prefix",
              renderFunction: (prefix: string) => {
                return prefix || "/";
              },
            },
            { label: "Access", elementKey: "access" },
          ]}
          isLoading={loadingAccessRules}
          records={accessRules || []}
          entityName="Access Rules"
          idField="prefix"
        />
      </SecureComponent>
    </Fragment>
  );
};

export default AccessRule;
