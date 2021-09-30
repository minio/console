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
import { Paper } from "@mui/material";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { AppState } from "../../../../store";
import { setErrorSnackMessage } from "../../../../actions";
import { TabPanel } from "../../../shared/tabs";
import { Policy } from "../../Policies/types";
import { ISessionResponse } from "../../types";
import { User } from "../../Users/types";
import { ErrorResponseHandler } from "../../../../common/types";
import TableWrapper from "../../Common/TableWrapper/TableWrapper";
import api from "../../../../common/api";
import history from "../../../../history";
import { BucketInfo } from "../types";
import { displayComponent } from "../../../../utils/permissions";
import {
  ADMIN_GET_POLICY,
  ADMIN_LIST_GROUPS,
  ADMIN_LIST_USER_POLICIES,
  ADMIN_LIST_USERS,
} from "../../../../types";
import PanelTitle from "../../Common/PanelTitle/PanelTitle";

const styles = (theme: Theme) => createStyles({});

const mapState = (state: AppState) => ({
  session: state.console.session,
  loadingBucket: state.buckets.bucketDetails.loadingBucket,
  bucketInfo: state.buckets.bucketDetails.bucketInfo,
});

const connector = connect(mapState, { setErrorSnackMessage });

function a11yProps(index: any) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

interface IAccessDetailsProps {
  session: ISessionResponse;
  setErrorSnackMessage: typeof setErrorSnackMessage;
  classes: any;
  match: any;
  loadingBucket: boolean;
  bucketInfo: BucketInfo | null;
}

const AccessDetails = ({
  classes,
  match,
  setErrorSnackMessage,
  session,
  loadingBucket,
  bucketInfo,
}: IAccessDetailsProps) => {
  const [curTab, setCurTab] = useState<number>(0);
  const [loadingPolicies, setLoadingPolicies] = useState<boolean>(true);
  const [bucketPolicy, setBucketPolicy] = useState<Policy[]>([]);
  const [loadingUsers, setLoadingUsers] = useState<boolean>(true);
  const [bucketUsers, setBucketUsers] = useState<User[]>([]);

  const bucketName = match.params["bucketName"];

  const displayPoliciesList = displayComponent(bucketInfo?.allowedActions, [
    ADMIN_LIST_USER_POLICIES,
  ]);

  const displayUsersList = displayComponent(
    bucketInfo?.allowedActions,
    [ADMIN_GET_POLICY, ADMIN_LIST_USERS, ADMIN_LIST_GROUPS],
    true
  );

  useEffect(() => {
    if (loadingBucket) {
      setLoadingUsers(true);
      setLoadingPolicies(true);
    }
  }, [loadingBucket, setLoadingUsers, setLoadingPolicies]);

  const PolicyActions = [
    {
      type: "view",
      onClick: (policy: any) => {
        history.push(`/policies/${policy.name}`);
      },
    },
  ];

  const userTableActions = [
    {
      type: "view",
      onClick: (user: any) => {
        history.push(`/users/${user}`);
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
            setErrorSnackMessage(err);
            setLoadingUsers(false);
          });
      } else {
        setLoadingUsers(false);
      }
    }
  }, [loadingUsers, setErrorSnackMessage, bucketName, displayUsersList]);

  useEffect(() => {
    if (loadingPolicies) {
      console.log("displayPoliciesList", displayPoliciesList);
      if (displayPoliciesList) {
        api
          .invoke("GET", `/api/v1/bucket-policy/${bucketName}`)
          .then((res: any) => {
            setBucketPolicy(res.policies);
            setLoadingPolicies(false);
          })
          .catch((err: ErrorResponseHandler) => {
            setErrorSnackMessage(err);
            setLoadingPolicies(false);
          });
      } else {
        setLoadingPolicies(false);
      }
    }
  }, [loadingPolicies, setErrorSnackMessage, bucketName, displayPoliciesList]);

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
        <Tab label="Policies" {...a11yProps(0)} />
        {displayUsersList && <Tab label="Users" {...a11yProps(1)} />}
      </Tabs>
      <Paper>
        <TabPanel index={0} value={curTab}>
          <TableWrapper
            disabled={!displayPoliciesList}
            noBackground={true}
            itemActions={PolicyActions}
            columns={[{ label: "Name", elementKey: "name" }]}
            isLoading={loadingPolicies}
            records={bucketPolicy}
            entityName="Policies"
            idField="name"
          />
        </TabPanel>
        {displayUsersList && (
          <TabPanel index={1} value={curTab}>
            <TableWrapper
              noBackground={true}
              itemActions={userTableActions}
              columns={[{ label: "User", elementKey: "accessKey" }]}
              isLoading={loadingUsers}
              records={bucketUsers}
              entityName="Users"
              idField="accessKey"
            />
          </TabPanel>
        )}
      </Paper>
    </Fragment>
  );
};

export default withStyles(styles)(connector(AccessDetails));
