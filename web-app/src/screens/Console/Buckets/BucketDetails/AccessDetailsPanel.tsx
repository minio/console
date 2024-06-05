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
import { DataTable, SectionTitle, Tabs, HelpTip } from "mds";
import { api } from "api";
import { errorToHandler } from "api/errors";
import {
  CONSOLE_UI_RESOURCE,
  IAM_PAGES,
  IAM_SCOPES,
} from "../../../../common/SecureComponent/permissions";
import {
  hasPermission,
  SecureComponent,
} from "../../../../common/SecureComponent";
import { setErrorSnackMessage, setHelpName } from "../../../../systemSlice";
import { selBucketDetailsLoading } from "./bucketDetailsSlice";
import { useAppDispatch } from "../../../../store";
import { Policy } from "../../../../api/consoleApi";

const AccessDetails = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const params = useParams();

  const loadingBucket = useSelector(selBucketDetailsLoading);

  const [curTab, setCurTab] = useState<string>("simple-tab-0");
  const [loadingPolicies, setLoadingPolicies] = useState<boolean>(true);
  const [bucketPolicy, setBucketPolicy] = useState<Policy[] | undefined>([]);
  const [loadingUsers, setLoadingUsers] = useState<boolean>(true);
  const [bucketUsers, setBucketUsers] = useState<string[]>([]);

  const bucketName = params.bucketName || "";

  const displayPoliciesList = hasPermission(bucketName, [
    IAM_SCOPES.ADMIN_LIST_USER_POLICIES,
  ]);

  const displayUsersList = hasPermission(
    bucketName,
    [
      IAM_SCOPES.ADMIN_GET_POLICY,
      IAM_SCOPES.ADMIN_LIST_USERS,
      IAM_SCOPES.ADMIN_LIST_GROUPS,
    ],
    true,
  );

  const viewUser = hasPermission(CONSOLE_UI_RESOURCE, [
    IAM_SCOPES.ADMIN_GET_USER,
  ]);
  const viewPolicy = hasPermission(CONSOLE_UI_RESOURCE, [
    IAM_SCOPES.ADMIN_GET_POLICY,
    IAM_SCOPES.ADMIN_LIST_USERS,
    IAM_SCOPES.ADMIN_LIST_GROUPS,
  ]);

  useEffect(() => {
    if (loadingBucket) {
      setLoadingUsers(true);
      setLoadingPolicies(true);
    }
  }, [loadingBucket, setLoadingUsers, setLoadingPolicies]);

  const PolicyActions = [
    {
      type: "view",
      disableButtonFunction: () => !viewPolicy,
      onClick: (policy: any) => {
        navigate(`${IAM_PAGES.POLICIES}/${encodeURIComponent(policy.name)}`);
      },
    },
  ];

  const userTableActions = [
    {
      type: "view",
      disableButtonFunction: () => !viewUser,
      onClick: (user: any) => {
        navigate(`${IAM_PAGES.USERS}/${encodeURIComponent(user)}`);
      },
    },
  ];

  useEffect(() => {
    if (loadingUsers) {
      if (displayUsersList) {
        api.bucketUsers
          .listUsersWithAccessToBucket(bucketName)
          .then((res) => {
            setBucketUsers(res.data);
            setLoadingUsers(false);
          })
          .catch((err) => {
            dispatch(setErrorSnackMessage(errorToHandler(err)));
            setLoadingUsers(false);
          });
      } else {
        setLoadingUsers(false);
      }
    }
  }, [loadingUsers, dispatch, bucketName, displayUsersList]);

  useEffect(() => {
    dispatch(setHelpName("bucket_detail_access"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (loadingPolicies) {
      if (displayPoliciesList) {
        api.bucketPolicy
          .listPoliciesWithBucket(bucketName)
          .then((res) => {
            setBucketPolicy(res.data.policies);
            setLoadingPolicies(false);
          })
          .catch((err) => {
            dispatch(setErrorSnackMessage(errorToHandler(err)));
            setLoadingPolicies(false);
          });
      } else {
        setLoadingPolicies(false);
      }
    }
  }, [loadingPolicies, dispatch, bucketName, displayPoliciesList]);

  return (
    <Fragment>
      <SectionTitle separator>
        <HelpTip
          content={
            <Fragment>
              Understand which{" "}
              <a
                target="blank"
                href="https://min.io/docs/minio/linux/administration/identity-access-management/policy-based-access-control.html#"
              >
                Policies
              </a>{" "}
              and{" "}
              <a
                target="blank"
                href="https://min.io/docs/minio/linux/administration/identity-access-management/minio-user-management.html"
              >
                Users
              </a>{" "}
              are authorized to access this Bucket.
            </Fragment>
          }
          placement="right"
        >
          Access Audit
        </HelpTip>
      </SectionTitle>
      <Tabs
        currentTabOrPath={curTab}
        onTabClick={(newValue: string) => {
          setCurTab(newValue);
        }}
        horizontal
        options={[
          {
            tabConfig: { label: "Policies", id: "simple-tab-0" },
            content: (
              <SecureComponent
                scopes={[IAM_SCOPES.ADMIN_LIST_USER_POLICIES]}
                resource={bucketName}
                errorProps={{ disabled: true }}
              >
                {bucketPolicy && (
                  <DataTable
                    noBackground={true}
                    itemActions={PolicyActions}
                    columns={[{ label: "Name", elementKey: "name" }]}
                    isLoading={loadingPolicies}
                    records={bucketPolicy}
                    entityName="Policies"
                    idField="name"
                  />
                )}
              </SecureComponent>
            ),
          },
          {
            tabConfig: { label: "Users", id: "simple-tab-1" },
            content: (
              <SecureComponent
                scopes={[
                  IAM_SCOPES.ADMIN_GET_POLICY,
                  IAM_SCOPES.ADMIN_LIST_USERS,
                  IAM_SCOPES.ADMIN_LIST_GROUPS,
                ]}
                resource={bucketName}
                matchAll
                errorProps={{ disabled: true }}
              >
                <DataTable
                  noBackground={true}
                  itemActions={userTableActions}
                  columns={[{ label: "User", elementKey: "accessKey" }]}
                  isLoading={loadingUsers}
                  records={bucketUsers}
                  entityName="Users"
                  idField="accessKey"
                />
              </SecureComponent>
            ),
          },
        ]}
      />
    </Fragment>
  );
};

export default AccessDetails;
