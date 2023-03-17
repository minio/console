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
import { Paper } from "@mui/material";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";

import { TabPanel } from "../../../shared/tabs";
import { User } from "../../Users/types";
import { ErrorResponseHandler } from "../../../../common/types";
import TableWrapper from "../../Common/TableWrapper/TableWrapper";
import api from "../../../../common/api";
import {
  CONSOLE_UI_RESOURCE,
  IAM_PAGES,
  IAM_SCOPES,
} from "../../../../common/SecureComponent/permissions";
import PanelTitle from "../../Common/PanelTitle/PanelTitle";
import {
  hasPermission,
  SecureComponent,
} from "../../../../common/SecureComponent";
import { encodeURLString } from "../../../../common/utils";
import { setErrorSnackMessage } from "../../../../systemSlice";
import { selBucketDetailsLoading } from "./bucketDetailsSlice";
import { useAppDispatch } from "../../../../store";
import { Policy } from "../../../../api/consoleApi";

function a11yProps(index: any) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const AccessDetails = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const params = useParams();

  const loadingBucket = useSelector(selBucketDetailsLoading);

  const [curTab, setCurTab] = useState<number>(0);
  const [loadingPolicies, setLoadingPolicies] = useState<boolean>(true);
  const [bucketPolicy, setBucketPolicy] = useState<Policy[]>([]);
  const [loadingUsers, setLoadingUsers] = useState<boolean>(true);
  const [bucketUsers, setBucketUsers] = useState<User[]>([]);

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
    true
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
        navigate(`${IAM_PAGES.POLICIES}/${encodeURLString(policy.name)}`);
      },
    },
  ];

  const userTableActions = [
    {
      type: "view",
      disableButtonFunction: () => !viewUser,
      onClick: (user: any) => {
        navigate(`${IAM_PAGES.USERS}/${encodeURLString(user)}`);
      },
    },
  ];

  useEffect(() => {
    if (loadingUsers) {
      if (displayUsersList) {
        api
          .invoke("GET", `/api/v1/bucket-users/${bucketName}`)
          .then((res: any) => {
            setBucketUsers(res);
            setLoadingUsers(false);
          })
          .catch((err: ErrorResponseHandler) => {
            dispatch(setErrorSnackMessage(err));
            setLoadingUsers(false);
          });
      } else {
        setLoadingUsers(false);
      }
    }
  }, [loadingUsers, dispatch, bucketName, displayUsersList]);

  useEffect(() => {
    if (loadingPolicies) {
      if (displayPoliciesList) {
        api
          .invoke("GET", `/api/v1/bucket-policy/${bucketName}`)
          .then((res: any) => {
            setBucketPolicy(res.policies);
            setLoadingPolicies(false);
          })
          .catch((err: ErrorResponseHandler) => {
            dispatch(setErrorSnackMessage(err));
            setLoadingPolicies(false);
          });
      } else {
        setLoadingPolicies(false);
      }
    }
  }, [loadingPolicies, dispatch, bucketName, displayPoliciesList]);

  return (
    <Fragment>
      <PanelTitle>Access Audit</PanelTitle>
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
        {displayPoliciesList && <Tab label="Policies" {...a11yProps(0)} />}
        {displayUsersList && <Tab label="Users" {...a11yProps(1)} />}
      </Tabs>
      <Paper>
        <TabPanel index={0} value={curTab}>
          <SecureComponent
            scopes={[IAM_SCOPES.ADMIN_LIST_USER_POLICIES]}
            resource={bucketName}
            errorProps={{ disabled: true }}
          >
            <TableWrapper
              noBackground={true}
              itemActions={PolicyActions}
              columns={[{ label: "Name", elementKey: "name" }]}
              isLoading={loadingPolicies}
              records={bucketPolicy}
              entityName="Policies"
              idField="name"
            />
          </SecureComponent>
        </TabPanel>

        <TabPanel index={1} value={curTab}>
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
            <TableWrapper
              noBackground={true}
              itemActions={userTableActions}
              columns={[{ label: "User", elementKey: "accessKey" }]}
              isLoading={loadingUsers}
              records={bucketUsers}
              entityName="Users"
              idField="accessKey"
            />
          </SecureComponent>
        </TabPanel>
      </Paper>
    </Fragment>
  );
};

export default AccessDetails;
