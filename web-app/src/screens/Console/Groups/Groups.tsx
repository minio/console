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
  IAMPoliciesIcon,
  PageLayout,
  UsersIcon,
  DataTable,
  Grid,
  Box,
  ProgressBar,
  ActionLink,
} from "mds";

import { api } from "api";
import { stringSort } from "../../../utils/sortFunctions";
import { actionsTray } from "../Common/FormComponents/common/styleLibrary";
import {
  applyPolicyPermissions,
  CONSOLE_UI_RESOURCE,
  createGroupPermissions,
  deleteGroupPermissions,
  displayGroupsPermissions,
  getGroupPermissions,
  IAM_PAGES,
  permissionTooltipHelper,
} from "../../../common/SecureComponent/permissions";
import {
  hasPermission,
  SecureComponent,
} from "../../../common/SecureComponent";
import { errorToHandler } from "../../../api/errors";
import withSuspense from "../Common/Components/withSuspense";
import { setErrorSnackMessage, setHelpName } from "../../../systemSlice";
import { useAppDispatch } from "../../../store";
import TooltipWrapper from "../Common/TooltipWrapper/TooltipWrapper";
import PageHeaderWrapper from "../Common/PageHeaderWrapper/PageHeaderWrapper";
import HelpMenu from "../HelpMenu";
import SearchBox from "../Common/SearchBox";

const DeleteGroup = withSuspense(React.lazy(() => import("./DeleteGroup")));
const SetPolicy = withSuspense(
  React.lazy(() => import("../Policies/SetPolicy")),
);

const Groups = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [deleteOpen, setDeleteOpen] = useState<boolean>(false);
  const [loading, isLoading] = useState<boolean>(false);
  const [records, setRecords] = useState<any[]>([]);
  const [filter, setFilter] = useState<string>("");
  const [policyOpen, setPolicyOpen] = useState<boolean>(false);
  const [checkedGroups, setCheckedGroups] = useState<string[]>([]);

  useEffect(() => {
    isLoading(true);
  }, []);

  useEffect(() => {
    isLoading(true);
  }, []);

  useEffect(() => {
    dispatch(setHelpName("groups"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const displayGroups = hasPermission(
    CONSOLE_UI_RESOURCE,
    displayGroupsPermissions,
  );

  const deleteGroup = hasPermission(
    CONSOLE_UI_RESOURCE,
    deleteGroupPermissions,
  );

  const getGroup = hasPermission(CONSOLE_UI_RESOURCE, getGroupPermissions);

  const applyPolicy = hasPermission(
    CONSOLE_UI_RESOURCE,
    applyPolicyPermissions,
    true,
  );

  const selectionChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { target: { value = "", checked = false } = {} } = e;

    let elements: string[] = [...checkedGroups]; // We clone the checkedUsers array

    if (checked) {
      // If the user has checked this field we need to push this to checkedUsersList
      elements.push(value);
    } else {
      // User has unchecked this field, we need to remove it from the list
      elements = elements.filter((element) => element !== value);
    }

    setCheckedGroups(elements);

    return elements;
  };

  useEffect(() => {
    if (loading) {
      if (displayGroups) {
        const fetchRecords = () => {
          api.groups
            .listGroups()
            .then((res) => {
              let resGroups: string[] = [];
              if (res.data.groups) {
                resGroups = res.data.groups.sort(stringSort);
              }
              setRecords(resGroups);
              isLoading(false);
            })
            .catch((err) => {
              dispatch(setErrorSnackMessage(errorToHandler(err.error)));
              isLoading(false);
            });
        };
        fetchRecords();
      } else {
        isLoading(false);
      }
    }
  }, [loading, dispatch, displayGroups]);

  const closeDeleteModalAndRefresh = (refresh: boolean) => {
    setDeleteOpen(false);
    setCheckedGroups([]);
    if (refresh) {
      isLoading(true);
    }
  };

  const filteredRecords = records.filter((elementItem) =>
    elementItem.includes(filter),
  );

  const viewAction = (group: any) => {
    navigate(`${IAM_PAGES.GROUPS}/${encodeURIComponent(group)}`);
  };

  const tableActions = [
    {
      type: "view",
      onClick: viewAction,
      disableButtonFunction: () => !getGroup,
    },
    {
      type: "edit",
      onClick: viewAction,
      disableButtonFunction: () => !getGroup,
    },
  ];

  return (
    <Fragment>
      {deleteOpen && (
        <DeleteGroup
          deleteOpen={deleteOpen}
          selectedGroups={checkedGroups}
          closeDeleteModalAndRefresh={closeDeleteModalAndRefresh}
        />
      )}
      {policyOpen && (
        <SetPolicy
          open={policyOpen}
          selectedGroups={checkedGroups}
          selectedUser={null}
          closeModalAndRefresh={() => {
            setPolicyOpen(false);
          }}
        />
      )}
      <PageHeaderWrapper label={"Groups"} actions={<HelpMenu />} />

      <PageLayout>
        <Grid container>
          <Grid item xs={12} sx={actionsTray.actionsTray}>
            <SecureComponent
              resource={CONSOLE_UI_RESOURCE}
              scopes={displayGroupsPermissions}
              errorProps={{ disabled: true }}
            >
              <SearchBox
                placeholder={"Search Groups"}
                onChange={setFilter}
                value={filter}
                sx={{ maxWidth: 380 }}
              />
            </SecureComponent>
            <Box
              sx={{
                display: "flex",
              }}
            >
              <SecureComponent
                resource={CONSOLE_UI_RESOURCE}
                scopes={applyPolicyPermissions}
                matchAll
                errorProps={{ disabled: true }}
              >
                <TooltipWrapper
                  tooltip={
                    checkedGroups.length < 1
                      ? "Please select Groups on which you want to apply Policies"
                      : applyPolicy
                        ? "Select Policy"
                        : permissionTooltipHelper(
                            applyPolicyPermissions,
                            "apply policies to Groups",
                          )
                  }
                >
                  <Button
                    id={"assign-policy"}
                    onClick={() => {
                      setPolicyOpen(true);
                    }}
                    label={"Assign Policy"}
                    icon={<IAMPoliciesIcon />}
                    disabled={checkedGroups.length < 1 || !applyPolicy}
                    variant={"regular"}
                  />
                </TooltipWrapper>
              </SecureComponent>
              <SecureComponent
                resource={CONSOLE_UI_RESOURCE}
                scopes={deleteGroupPermissions}
                matchAll
                errorProps={{ disabled: true }}
              >
                <TooltipWrapper
                  tooltip={
                    checkedGroups.length === 0
                      ? "Select Groups to delete"
                      : getGroup
                        ? "Delete Selected"
                        : permissionTooltipHelper(
                            getGroupPermissions,
                            "delete Groups",
                          )
                  }
                >
                  <Button
                    id="delete-selected-groups"
                    onClick={() => {
                      setDeleteOpen(true);
                    }}
                    label={"Delete Selected"}
                    icon={<DeleteIcon />}
                    variant="secondary"
                    disabled={checkedGroups.length === 0 || !getGroup}
                  />
                </TooltipWrapper>
              </SecureComponent>
              <SecureComponent
                resource={CONSOLE_UI_RESOURCE}
                scopes={createGroupPermissions}
                matchAll
                errorProps={{ disabled: true }}
              >
                <TooltipWrapper tooltip={"Create Group"}>
                  <Button
                    id={"create-group"}
                    label={"Create Group"}
                    variant="callAction"
                    icon={<AddIcon />}
                    onClick={() => {
                      navigate(`${IAM_PAGES.GROUPS_ADD}`);
                    }}
                  />
                </TooltipWrapper>
              </SecureComponent>
            </Box>
          </Grid>
          {loading && <ProgressBar />}
          {!loading && (
            <Fragment>
              {records.length > 0 && (
                <Fragment>
                  <Grid item xs={12} sx={{ marginBottom: 15 }}>
                    <SecureComponent
                      resource={CONSOLE_UI_RESOURCE}
                      scopes={displayGroupsPermissions}
                      errorProps={{ disabled: true }}
                    >
                      <DataTable
                        itemActions={tableActions}
                        columns={[{ label: "Name" }]}
                        isLoading={loading}
                        selectedItems={checkedGroups}
                        onSelect={
                          deleteGroup || getGroup ? selectionChanged : undefined
                        }
                        records={filteredRecords}
                        entityName="Groups"
                        idField=""
                      />
                    </SecureComponent>
                  </Grid>
                  <Grid item xs={12}>
                    <HelpBox
                      title={"Groups"}
                      iconComponent={<GroupsIcon />}
                      help={
                        <Fragment>
                          A group can have one attached IAM policy, where all
                          users with membership in that group inherit that
                          policy. Groups support more simplified management of
                          user permissions on the MinIO Tenant.
                          <br />
                          <br />
                          You can learn more at our{" "}
                          <a
                            href="https://min.io/docs/minio/linux/administration/identity-access-management/minio-group-management.html?ref=con"
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
                </Fragment>
              )}
              {records.length === 0 && (
                <Grid container>
                  <Grid item xs={8}>
                    <HelpBox
                      title={"Groups"}
                      iconComponent={<UsersIcon />}
                      help={
                        <Fragment>
                          A group can have one attached IAM policy, where all
                          users with membership in that group inherit that
                          policy. Groups support more simplified management of
                          user permissions on the MinIO Tenant.
                          <SecureComponent
                            resource={CONSOLE_UI_RESOURCE}
                            scopes={createGroupPermissions}
                            matchAll
                          >
                            <br />
                            <br />
                            To get started,{" "}
                            <ActionLink
                              onClick={() => {
                                navigate(`${IAM_PAGES.GROUPS_ADD}`);
                              }}
                            >
                              Create a Group
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

export default Groups;
