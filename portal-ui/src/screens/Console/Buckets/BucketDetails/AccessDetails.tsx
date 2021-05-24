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

import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { AppState } from "../../../../store";
import { setErrorSnackMessage } from "../../../../actions";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import { Paper } from "@material-ui/core";
import TableWrapper from "../../Common/TableWrapper/TableWrapper";
import { TabPanel } from "../../../shared/tabs";
import { Policy } from "../../Policies/types";
import { ISessionResponse } from "../../types";
import { User } from "../../Users/types";
import api from "../../../../common/api";
import history from "../../../../history";
import { createStyles, Theme, withStyles } from "@material-ui/core/styles";

const styles = (theme: Theme) => createStyles({});

const mapState = (state: AppState) => ({
  session: state.console.session,
});

const connector = connect(mapState, { setErrorSnackMessage });

function a11yProps(index: any) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

interface IAccessDetailsProps {
  bucketName: string;
  session: ISessionResponse;
  setErrorSnackMessage: typeof setErrorSnackMessage;
  classes: any;
}

const AccessDetails = ({
  bucketName,
  classes,
  setErrorSnackMessage,
  session,
}: IAccessDetailsProps) => {
  const [curTab, setCurTab] = useState<number>(0);
  const [loadingPolicies, setLoadingPolicies] = useState<boolean>(true);
  const [bucketPolicy, setBucketPolicy] = useState<Policy[]>([]);
  const [loadingUsers, setLoadingUsers] = useState<boolean>(true);
  const [bucketUsers, setBucketUsers] = useState<User[]>([]);

  const usersEnabled = session.pages?.indexOf("/users") > -1;

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
    if (loadingUsers && usersEnabled) {
      api
        .invoke("GET", `/api/v1/bucket-users/${bucketName}`)
        .then((res: any) => {
          setBucketUsers(res);
          setLoadingUsers(false);
        })
        .catch((err: any) => {
          setErrorSnackMessage(err);
          setLoadingUsers(false);
        });
    }
  }, [loadingUsers, setErrorSnackMessage, bucketName, usersEnabled]);

  useEffect(() => {
    if (loadingPolicies) {
      api
        .invoke("GET", `/api/v1/bucket-policy/${bucketName}`)
        .then((res: any) => {
          setBucketPolicy(res.policies);
          setLoadingPolicies(false);
        })
        .catch((err: any) => {
          setErrorSnackMessage(err);
          setLoadingPolicies(false);
        });
    }
  }, [loadingPolicies, setErrorSnackMessage, bucketName]);

  return (
    <Paper>
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
        {usersEnabled && <Tab label="Users" {...a11yProps(1)} />}
      </Tabs>
      <TabPanel index={0} value={curTab}>
        <TableWrapper
          noBackground={true}
          itemActions={PolicyActions}
          columns={[{ label: "Name", elementKey: "name" }]}
          isLoading={loadingPolicies}
          records={bucketPolicy}
          entityName="Policies"
          idField="name"
        />
      </TabPanel>
      {usersEnabled && (
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
  );
};

export default withStyles(styles)(connector(AccessDetails));
