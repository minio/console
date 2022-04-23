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
import api from "../../../common/api";
import { Grid, LinearProgress } from "@mui/material";
import { User, UsersList } from "./types";
import { usersSort } from "../../../utils/sortFunctions";
import { GroupsIcon, AddIcon, UsersIcon } from "../../../icons";
import {
  actionsTray,
  containerForHeader,
  searchField,
  tableStyles,
} from "../Common/FormComponents/common/styleLibrary";
import { setErrorSnackMessage } from "../../../actions";
import { ErrorResponseHandler } from "../../../common/types";

import TableWrapper from "../Common/TableWrapper/TableWrapper";
import PageHeader from "../Common/PageHeader/PageHeader";
import { decodeFileName } from "../../../common/utils";
import HelpBox from "../../../common/HelpBox";
import AButton from "../Common/AButton/AButton";
import PageLayout from "../Common/Layout/PageLayout";
import SearchBox from "../Common/SearchBox";
import withSuspense from "../Common/Components/withSuspense";
import {
  CONSOLE_UI_RESOURCE,
  IAM_PAGES,
  IAM_SCOPES,
  S3_ALL_RESOURCES,
} from "../../../common/SecureComponent/permissions";

import RBIconButton from "../Buckets/BucketDetails/SummaryItems/RBIconButton";
import {
  hasPermission,
  SecureComponent,
} from "../../../common/SecureComponent";

const SetPolicy = withSuspense(
  React.lazy(() => import("../Policies/SetPolicy"))
);
const DeleteUser = withSuspense(React.lazy(() => import("./DeleteUser")));
const AddToGroup = withSuspense(React.lazy(() => import("./BulkAddToGroup")));

const styles = (theme: Theme) =>
  createStyles({
    ...actionsTray,
    ...searchField,
    searchField: {
      ...searchField.searchField,
      marginRight: "auto",
      maxWidth: 380,
    },
    ...tableStyles,
    ...containerForHeader(theme.spacing(4)),
  });

interface IUsersProps {
  classes: any;
  history: any;
  setErrorSnackMessage: typeof setErrorSnackMessage;
}

const ListUsers = ({ classes, setErrorSnackMessage, history }: IUsersProps) => {
  const [records, setRecords] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [deleteOpen, setDeleteOpen] = useState<boolean>(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [addGroupOpen, setAddGroupOpen] = useState<boolean>(false);
  const [filter, setFilter] = useState<string>("");
  const [checkedUsers, setCheckedUsers] = useState<string[]>([]);
  const [policyOpen, setPolicyOpen] = useState<boolean>(false);

  const displayListUsers = hasPermission(CONSOLE_UI_RESOURCE, [
    IAM_SCOPES.ADMIN_LIST_USERS,
  ]);

  const deleteUser = hasPermission(CONSOLE_UI_RESOURCE, [
    IAM_SCOPES.ADMIN_DELETE_USER,
  ]);

  const viewUser = hasPermission(CONSOLE_UI_RESOURCE, [
    IAM_SCOPES.ADMIN_GET_USER,
  ]);

  const addUserToGroup = hasPermission(CONSOLE_UI_RESOURCE, [
    IAM_SCOPES.ADMIN_ADD_USER_TO_GROUP,
  ]);

 const closeDeleteModalAndRefresh = (refresh: boolean) => {
    setDeleteOpen(false);
    if (refresh) {
      setLoading(true);
    }
  };

  const closeAddGroupBulk = (unCheckAll: boolean = false) => {
    setAddGroupOpen(false);
    if (unCheckAll) {
      setCheckedUsers([]);
    }
  };

  useEffect(() => {
    if (loading) {
      if (displayListUsers) {
        api
          .invoke("GET", `/api/v1/users`)
          .then((res: UsersList) => {
            const users = res.users === null ? [] : res.users;

            setLoading(false);
            setRecords(users.sort(usersSort));
          })
          .catch((err: ErrorResponseHandler) => {
            setLoading(false);
            setErrorSnackMessage(err);
          });
      } else {
        setLoading(false);
      }
    }
  }, [loading, setErrorSnackMessage, displayListUsers]);

  const filteredRecords = records.filter((elementItem) =>
    elementItem.accessKey.includes(filter)
  );

  const selectionChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
    const targetD = e.target;
    const value = targetD.value;
    const checked = targetD.checked;

    let elements: string[] = [...checkedUsers]; // We clone the checkedUsers array

    if (checked) {
      // If the user has checked this field we need to push this to checkedUsersList
      elements.push(value);
    } else {
      // User has unchecked this field, we need to remove it from the list
      elements = elements.filter((element) => element !== value);
    }

    setCheckedUsers(elements);

    return elements;
  };

  const viewAction = (selectionElement: any): void => {
    history.push(`${IAM_PAGES.USERS}/${encodeURI(selectionElement.accessKey)}`);
  };

  const deleteAction = (selectionElement: any): void => {
    setDeleteOpen(true);
    setSelectedUser(selectionElement);
  };

  const userLoggedIn = decodeFileName(
    localStorage.getItem("userLoggedIn") || ""
  );

  const tableActions = [
    {
      type: "view",
      onClick: viewAction,
      disableButtonFunction: () => !viewUser,
    },
    {
      type: "delete",
      onClick: deleteAction,
      disableButtonFunction: (topValue: any) =>
        topValue === userLoggedIn || !deleteUser,
    },
  ];

  return (
    <Fragment>
      {policyOpen && (
        <SetPolicy
          open={policyOpen}
          selectedUser={selectedUser}
          selectedGroup={null}
          closeModalAndRefresh={() => {
            setPolicyOpen(false);
            setLoading(true);
          }}
        />
      )}
      {deleteOpen && (
        <DeleteUser
          deleteOpen={deleteOpen}
          selectedUser={selectedUser}
          closeDeleteModalAndRefresh={(refresh: boolean) => {
            closeDeleteModalAndRefresh(refresh);
          }}
        />
      )}
      {addGroupOpen && (
        <AddToGroup
          open={addGroupOpen}
          checkedUsers={checkedUsers}
          closeModalAndRefresh={(close: boolean) => {
            closeAddGroupBulk(close);
          }}
        />
      )}
      <PageHeader label={"Users"} />
      <PageLayout>
        <Grid item xs={12} className={classes.actionsTray}>
          <SearchBox
            placeholder={"Search Users"}
            onChange={setFilter}
            overrideClass={classes.searchField}
            value={filter}
          />
          <SecureComponent
            scopes={[IAM_SCOPES.ADMIN_ADD_USER_TO_GROUP]}
            resource={CONSOLE_UI_RESOURCE}
            errorProps={{ disabled: true }}
          >
            <RBIconButton
              tooltip={"Add to Group"}
              text={"Add to Group"}
              icon={<GroupsIcon />}
              color="primary"
              disabled={checkedUsers.length <= 0}
              onClick={() => {
                if (checkedUsers.length > 0) {
                  setAddGroupOpen(true);
                }
              }}
              variant={"outlined"}
            />
          </SecureComponent>
          <SecureComponent
            scopes={[
              IAM_SCOPES.ADMIN_CREATE_USER,
              IAM_SCOPES.ADMIN_LIST_USER_POLICIES,
              IAM_SCOPES.ADMIN_LIST_GROUPS,
            ]}
            resource={S3_ALL_RESOURCES}
            matchAll
            errorProps={{ disabled: true }}
          >
            <RBIconButton
              tooltip={"Create User"}
              text={"Create User"}
              icon={<AddIcon />}
              color="primary"
              onClick={() => {
                history.push(`${IAM_PAGES.USER_ADD}`);
              }}
              variant={"contained"}
            />
          </SecureComponent>
        </Grid>

        {loading && <LinearProgress />}
        {!loading && (
          <Fragment>
            {records.length > 0 && (
              <Fragment>
                <Grid item xs={12} className={classes.tableBlock}>
                  <SecureComponent
                    scopes={[IAM_SCOPES.ADMIN_LIST_USERS]}
                    resource={CONSOLE_UI_RESOURCE}
                    errorProps={{ disabled: true }}
                  >
                    <TableWrapper
                      itemActions={tableActions}
                      columns={[
                        { label: "Access Key", elementKey: "accessKey" },
                      ]}
                      onSelect={addUserToGroup ? selectionChanged : undefined}
                      selectedItems={checkedUsers}
                      isLoading={loading}
                      records={filteredRecords}
                      entityName="Users"
                      idField="accessKey"
                    />
                  </SecureComponent>
                </Grid>
                <Grid item xs={12} marginTop={"25px"}>
                  <HelpBox
                    title={"Users"}
                    iconComponent={<UsersIcon />}
                    help={
                      <Fragment>
                        A MinIO user consists of a unique access key (username)
                        and corresponding secret key (password). Clients must
                        authenticate their identity by specifying both a valid
                        access key (username) and the corresponding secret key
                        (password) of an existing MinIO user.
                        <br />
                        <br />
                        Each user can have one or more assigned policies that
                        explicitly list the actions and resources to which that
                        user has access. Users can also inherit policies from
                        the groups in which they have membership.
                        <br />
                        <br />
                        You can learn more at our{" "}
                        <a
                          href="https://docs.min.io/minio/baremetal/monitoring/bucket-notifications/bucket-notifications.html?ref=con"
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
              </Fragment>
            )}
            {records.length === 0 && (
              <Grid
                container
                justifyContent={"center"}
                alignContent={"center"}
                alignItems={"center"}
              >
                <Grid item xs={8}>
                  <HelpBox
                    title={"Users"}
                    iconComponent={<UsersIcon />}
                    help={
                      <Fragment>
                        A MinIO user consists of a unique access key (username)
                        and corresponding secret key (password). Clients must
                        authenticate their identity by specifying both a valid
                        access key (username) and the corresponding secret key
                        (password) of an existing MinIO user.
                        <br />
                        <br />
                        Each user can have one or more assigned policies that
                        explicitly list the actions and resources to which that
                        user has access. Users can also inherit policies from
                        the groups in which they have membership.
                        <SecureComponent
                          scopes={[
                            IAM_SCOPES.ADMIN_CREATE_USER,
                            IAM_SCOPES.ADMIN_LIST_USER_POLICIES,
                            IAM_SCOPES.ADMIN_LIST_GROUPS,
                          ]}
                          matchAll
                          resource={CONSOLE_UI_RESOURCE}
                        >
                          <Fragment>
                            <br />
                            <br />
                            To get started,{" "}
                            <AButton
                              onClick={() => {
                                history.push(`${IAM_PAGES.USER_ADD}`);
                              }}
                            >
                              Create a User
                            </AButton>
                            .
                          </Fragment>
                        </SecureComponent>
                      </Fragment>
                    }
                  />
                </Grid>
              </Grid>
            )}
          </Fragment>
        )}
      </PageLayout>
    </Fragment>
  );
};

const mapDispatchToProps = {
  setErrorSnackMessage,
};

const connector = connect(null, mapDispatchToProps);

export default withStyles(styles)(connector(ListUsers));
