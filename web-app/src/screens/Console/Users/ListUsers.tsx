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
import { useNavigate } from "react-router-dom";
import {
  AddIcon,
  Button,
  DeleteIcon,
  GroupsIcon,
  HelpBox,
  PageLayout,
  UsersIcon,
  DataTable,
  Grid,
  ProgressBar,
  ActionLink,
} from "mds";

import { User, UsersList } from "./types";
import { usersSort } from "../../../utils/sortFunctions";
import { actionsTray } from "../Common/FormComponents/common/styleLibrary";
import { ErrorResponseHandler } from "../../../common/types";
import {
  addUserToGroupPermissions,
  CONSOLE_UI_RESOURCE,
  deleteUserPermissions,
  IAM_PAGES,
  IAM_SCOPES,
  listUsersPermissions,
  permissionTooltipHelper,
  S3_ALL_RESOURCES,
  viewUserPermissions,
} from "../../../common/SecureComponent/permissions";
import api from "../../../common/api";
import SearchBox from "../Common/SearchBox";
import withSuspense from "../Common/Components/withSuspense";

import {
  hasPermission,
  SecureComponent,
} from "../../../common/SecureComponent";
import { setErrorSnackMessage, setHelpName } from "../../../systemSlice";
import { useAppDispatch } from "../../../store";
import TooltipWrapper from "../Common/TooltipWrapper/TooltipWrapper";
import PageHeaderWrapper from "../Common/PageHeaderWrapper/PageHeaderWrapper";
import HelpMenu from "../HelpMenu";

const DeleteUser = withSuspense(React.lazy(() => import("./DeleteUser")));
const AddToGroup = withSuspense(React.lazy(() => import("./BulkAddToGroup")));

const ListUsers = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [records, setRecords] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [deleteOpen, setDeleteOpen] = useState<boolean>(false);
  const [addGroupOpen, setAddGroupOpen] = useState<boolean>(false);
  const [filter, setFilter] = useState<string>("");
  const [checkedUsers, setCheckedUsers] = useState<string[]>([]);

  const displayListUsers = hasPermission(
    CONSOLE_UI_RESOURCE,
    listUsersPermissions,
  );

  const viewUser = hasPermission(CONSOLE_UI_RESOURCE, viewUserPermissions);

  const addUserToGroup = hasPermission(
    CONSOLE_UI_RESOURCE,
    addUserToGroupPermissions,
  );

  const deleteUser = hasPermission(CONSOLE_UI_RESOURCE, deleteUserPermissions);

  const closeDeleteModalAndRefresh = (refresh: boolean) => {
    setDeleteOpen(false);
    if (refresh) {
      setLoading(true);
      setCheckedUsers([]);
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
            dispatch(setErrorSnackMessage(err));
          });
      } else {
        setLoading(false);
      }
    }
  }, [loading, dispatch, displayListUsers]);

  const filteredRecords = records.filter((elementItem) =>
    elementItem.accessKey.includes(filter),
  );

  const selectionChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { target: { value = "", checked = false } = {} } = e;

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
    navigate(
      `${IAM_PAGES.USERS}/${encodeURIComponent(selectionElement.accessKey)}`,
    );
  };

  const tableActions = [
    {
      type: "view",
      onClick: viewAction,
      disableButtonFunction: () => !viewUser,
    },
    {
      type: "edit",
      onClick: viewAction,
      disableButtonFunction: () => !viewUser,
    },
  ];

  useEffect(() => {
    dispatch(setHelpName("list_users"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Fragment>
      {deleteOpen && (
        <DeleteUser
          deleteOpen={deleteOpen}
          selectedUsers={checkedUsers}
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
      <PageHeaderWrapper label={"Users"} actions={<HelpMenu />} />

      <PageLayout>
        <Grid container>
          <Grid item xs={12} sx={actionsTray.actionsTray}>
            <SearchBox
              placeholder={"Search Users"}
              onChange={setFilter}
              value={filter}
              sx={{
                marginRight: "auto",
                maxWidth: 380,
              }}
            />
            <SecureComponent
              resource={CONSOLE_UI_RESOURCE}
              scopes={[IAM_SCOPES.ADMIN_DELETE_USER]}
              matchAll
              errorProps={{ disabled: true }}
            >
              <TooltipWrapper
                tooltip={
                  hasPermission("console", [IAM_SCOPES.ADMIN_DELETE_USER])
                    ? checkedUsers.length === 0
                      ? "Select Users to delete"
                      : "Delete Selected"
                    : permissionTooltipHelper(
                        [IAM_SCOPES.ADMIN_DELETE_USER],
                        "delete users",
                      )
                }
              >
                <Button
                  id={"delete-selected-users"}
                  onClick={() => {
                    setDeleteOpen(true);
                  }}
                  label={"Delete Selected"}
                  icon={<DeleteIcon />}
                  disabled={checkedUsers.length === 0}
                  variant={"secondary"}
                  aria-label="delete-selected-users"
                />
              </TooltipWrapper>
            </SecureComponent>
            <SecureComponent
              scopes={[IAM_SCOPES.ADMIN_ADD_USER_TO_GROUP]}
              resource={CONSOLE_UI_RESOURCE}
              errorProps={{ disabled: true }}
            >
              <TooltipWrapper
                tooltip={
                  hasPermission("console", [IAM_SCOPES.ADMIN_ADD_USER_TO_GROUP])
                    ? checkedUsers.length === 0
                      ? "Select Users to group"
                      : "Add to Group"
                    : permissionTooltipHelper(
                        [IAM_SCOPES.ADMIN_ADD_USER_TO_GROUP],
                        "add users to groups",
                      )
                }
              >
                <Button
                  id={"add-to-group"}
                  label={"Add to Group"}
                  icon={<GroupsIcon />}
                  disabled={checkedUsers.length <= 0}
                  onClick={() => {
                    if (checkedUsers.length > 0) {
                      setAddGroupOpen(true);
                    }
                  }}
                  variant={"regular"}
                />
              </TooltipWrapper>
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
              <TooltipWrapper
                tooltip={
                  hasPermission(
                    "console-ui",
                    [
                      IAM_SCOPES.ADMIN_CREATE_USER,
                      IAM_SCOPES.ADMIN_LIST_USER_POLICIES,
                      IAM_SCOPES.ADMIN_LIST_GROUPS,
                      IAM_SCOPES.ADMIN_ATTACH_USER_OR_GROUP_POLICY,
                    ],
                    true,
                  )
                    ? "Create User"
                    : permissionTooltipHelper(
                        [
                          IAM_SCOPES.ADMIN_CREATE_USER,
                          IAM_SCOPES.ADMIN_LIST_USER_POLICIES,
                          IAM_SCOPES.ADMIN_LIST_GROUPS,
                          IAM_SCOPES.ADMIN_ATTACH_USER_OR_GROUP_POLICY,
                        ],
                        "create users",
                      )
                }
              >
                <Button
                  id={"create-user"}
                  label={"Create User"}
                  icon={<AddIcon />}
                  onClick={() => {
                    navigate(`${IAM_PAGES.USER_ADD}`);
                  }}
                  variant={"callAction"}
                  disabled={
                    !hasPermission(
                      "console-ui",
                      [
                        IAM_SCOPES.ADMIN_CREATE_USER,
                        IAM_SCOPES.ADMIN_LIST_USER_POLICIES,
                        IAM_SCOPES.ADMIN_LIST_GROUPS,
                        IAM_SCOPES.ADMIN_ATTACH_USER_OR_GROUP_POLICY,
                      ],
                      true,
                    )
                  }
                />
              </TooltipWrapper>
            </SecureComponent>
          </Grid>

          {loading && <ProgressBar />}
          {!loading && (
            <Fragment>
              {records.length > 0 && (
                <Fragment>
                  <Grid item xs={12} sx={{ marginBottom: 15 }}>
                    <SecureComponent
                      scopes={[IAM_SCOPES.ADMIN_LIST_USERS]}
                      resource={CONSOLE_UI_RESOURCE}
                      errorProps={{ disabled: true }}
                    >
                      <DataTable
                        itemActions={tableActions}
                        columns={[
                          { label: "Access Key", elementKey: "accessKey" },
                        ]}
                        onSelect={
                          addUserToGroup || deleteUser
                            ? selectionChanged
                            : undefined
                        }
                        selectedItems={checkedUsers}
                        isLoading={loading}
                        records={filteredRecords}
                        entityName="Users"
                        idField="accessKey"
                      />
                    </SecureComponent>
                  </Grid>
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
                        Groups provide a simplified method for managing shared
                        permissions among users with common access patterns and
                        workloads.
                        <br />
                        <br />
                        Users inherit access permissions to data and resources
                        through the groups they belong to.
                        <br />
                        MinIO uses Policy-Based Access Control (PBAC) to define
                        the authorized actions and resources to which an
                        authenticated user has access. Each policy describes one
                        or more actions and conditions that outline the
                        permissions of a user or group of users.
                        <br />
                        <br />
                        Each user can access only those resources and operations
                        which are explicitly granted by the built-in role. MinIO
                        denies access to any other resource or action by
                        default.
                        <br />
                        <br />
                        You can learn more at our{" "}
                        <a
                          href="https://min.io/docs/minio/kubernetes/upstream/administration/identity-access-management/minio-user-management.html?ref=con"
                          target="_blank"
                          rel="noopener"
                        >
                          documentation
                        </a>
                        .
                      </Fragment>
                    }
                  />
                </Fragment>
              )}
              {records.length === 0 && (
                <Grid container>
                  <Grid item xs={8}>
                    <HelpBox
                      title={"Users"}
                      iconComponent={<UsersIcon />}
                      help={
                        <Fragment>
                          A MinIO user consists of a unique access key
                          (username) and corresponding secret key (password).
                          Clients must authenticate their identity by specifying
                          both a valid access key (username) and the
                          corresponding secret key (password) of an existing
                          MinIO user.
                          <br />
                          Groups provide a simplified method for managing shared
                          permissions among users with common access patterns
                          and workloads.
                          <br />
                          <br />
                          Users inherit access permissions to data and resources
                          through the groups they belong to.
                          <br />
                          MinIO uses Policy-Based Access Control (PBAC) to
                          define the authorized actions and resources to which
                          an authenticated user has access. Each policy
                          describes one or more actions and conditions that
                          outline the permissions of a user or group of users.
                          <br />
                          <br />
                          Each user can access only those resources and
                          operations which are explicitly granted by the
                          built-in role. MinIO denies access to any other
                          resource or action by default.
                          <SecureComponent
                            scopes={[
                              IAM_SCOPES.ADMIN_CREATE_USER,
                              IAM_SCOPES.ADMIN_LIST_USER_POLICIES,
                              IAM_SCOPES.ADMIN_LIST_GROUPS,
                            ]}
                            matchAll
                            resource={CONSOLE_UI_RESOURCE}
                          >
                            <br />
                            <br />
                            To get started,{" "}
                            <ActionLink
                              onClick={() => {
                                navigate(`${IAM_PAGES.USER_ADD}`);
                              }}
                            >
                              Create a User
                            </ActionLink>
                            .
                          </SecureComponent>
                        </Fragment>
                      }
                    />
                  </Grid>
                </Grid>
              )}
            </Fragment>
          )}
        </Grid>
      </PageLayout>
    </Fragment>
  );
};

export default ListUsers;
