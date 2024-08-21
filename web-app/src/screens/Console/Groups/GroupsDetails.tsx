// This file is part of MinIO Console Server
// Copyright (c) 2023 MinIO, Inc.
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
import { useNavigate, useParams } from "react-router-dom";
import {
  AddIcon,
  BackLink,
  Box,
  Button,
  DataTable,
  Grid,
  GroupsIcon,
  IAMPoliciesIcon,
  PageLayout,
  ScreenTitle,
  SectionTitle,
  Switch,
  Tabs,
  TrashIcon,
} from "mds";
import { api } from "api";
import { errorToHandler } from "api/errors";
import { Group } from "api/consoleApi";
import {
  addUserToGroupPermissions,
  CONSOLE_UI_RESOURCE,
  createGroupPermissions,
  editGroupMembersPermissions,
  enableDisableGroupPermissions,
  getGroupPermissions,
  IAM_PAGES,
  listUsersPermissions,
  permissionTooltipHelper,
  setGroupPoliciesPermissions,
  viewPolicyPermissions,
  viewUserPermissions,
} from "../../../common/SecureComponent/permissions";
import {
  hasPermission,
  SecureComponent,
} from "../../../common/SecureComponent";
import { setHelpName, setModalErrorSnackMessage } from "../../../systemSlice";
import { useAppDispatch } from "../../../store";
import { setSelectedPolicies } from "../Users/AddUsersSlice";
import SetPolicy from "../Policies/SetPolicy";
import AddGroupMember from "./AddGroupMember";
import DeleteGroup from "./DeleteGroup";
import SearchBox from "../Common/SearchBox";
import TooltipWrapper from "../Common/TooltipWrapper/TooltipWrapper";
import HelpMenu from "../HelpMenu";
import PageHeaderWrapper from "../Common/PageHeaderWrapper/PageHeaderWrapper";

const formatPolicy = (policy: string = ""): string[] => {
  if (policy.length <= 0) return [];
  return policy.split(",");
};

const GroupsDetails = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const params = useParams();

  const [groupDetails, setGroupDetails] = useState<Group>({});
  const [policyOpen, setPolicyOpen] = useState<boolean>(false);
  const [usersOpen, setUsersOpen] = useState<boolean>(false);
  const [deleteOpen, setDeleteOpen] = useState<boolean>(false);
  const [memberFilter, setMemberFilter] = useState<string>("");
  const [currentTab, setCurrentTab] = useState<string>("members");

  const { members = [], policy = "", status: groupEnabled } = groupDetails;

  const filteredMembers = members.filter((elementItem) =>
    elementItem.includes(memberFilter),
  );

  const viewUser = hasPermission(
    CONSOLE_UI_RESOURCE,
    viewUserPermissions,
    true,
  );

  useEffect(() => {
    dispatch(setHelpName("group_details"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (params.groupName) {
      fetchGroupInfo();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.groupName]);

  const groupPolicies = formatPolicy(policy);
  const isGroupEnabled = groupEnabled === "enabled";
  const memberActionText = members.length > 0 ? "Edit Members" : "Add Members";

  const getGroupDetails = hasPermission(
    CONSOLE_UI_RESOURCE,
    getGroupPermissions,
  );

  const canEditGroupMembers = hasPermission(
    CONSOLE_UI_RESOURCE,
    editGroupMembersPermissions,
    true,
  );

  const canSetPolicies = hasPermission(
    CONSOLE_UI_RESOURCE,
    setGroupPoliciesPermissions,
    true,
  );

  const canViewPolicy = hasPermission(
    CONSOLE_UI_RESOURCE,
    viewPolicyPermissions,
    true,
  );

  function fetchGroupInfo() {
    if (getGroupDetails) {
      api.group
        .groupInfo(params.groupName || "")
        .then((res) => {
          setGroupDetails(res.data);
        })
        .catch((err) => {
          dispatch(setModalErrorSnackMessage(errorToHandler(err.error)));
          setGroupDetails({});
        });
    }
  }

  function toggleGroupStatus(nextStatus: boolean) {
    return api.group
      .updateGroup(params.groupName || "", {
        members: members,
        status: nextStatus ? "enabled" : "disabled",
      })
      .then(() => {
        fetchGroupInfo();
      })
      .catch((err) => {
        dispatch(setModalErrorSnackMessage(errorToHandler(err.error)));
      });
  }

  const groupsTabContent = (
    <Box
      onMouseMove={() => {
        dispatch(setHelpName("groups_members"));
      }}
    >
      <SectionTitle
        separator
        sx={{ marginBottom: 15 }}
        actions={
          <Box
            sx={{
              display: "flex",
              gap: 10,
            }}
          >
            <SearchBox
              placeholder={"Search members"}
              onChange={(searchText) => {
                setMemberFilter(searchText);
              }}
              value={memberFilter}
              sx={{
                maxWidth: 280,
              }}
            />
            <SecureComponent
              resource={CONSOLE_UI_RESOURCE}
              scopes={addUserToGroupPermissions}
              errorProps={{ disabled: true }}
            >
              <TooltipWrapper
                tooltip={
                  canEditGroupMembers
                    ? memberActionText
                    : permissionTooltipHelper(
                        createGroupPermissions,
                        "edit Group membership",
                      )
                }
              >
                <Button
                  id={"add-user-group"}
                  label={memberActionText}
                  variant="callAction"
                  icon={<AddIcon />}
                  onClick={() => {
                    setUsersOpen(true);
                  }}
                  disabled={!canEditGroupMembers}
                />
              </TooltipWrapper>
            </SecureComponent>
          </Box>
        }
      >
        Members
      </SectionTitle>
      <Grid item xs={12}>
        <SecureComponent
          resource={CONSOLE_UI_RESOURCE}
          scopes={listUsersPermissions}
          errorProps={{ disabled: true }}
        >
          <TooltipWrapper
            tooltip={
              viewUser
                ? ""
                : permissionTooltipHelper(
                    viewUserPermissions,
                    "view User details",
                  )
            }
          >
            <DataTable
              itemActions={[
                {
                  type: "view",
                  onClick: (userName) => {
                    navigate(
                      `${IAM_PAGES.USERS}/${encodeURIComponent(userName)}`,
                    );
                  },
                  isDisabled: !viewUser,
                },
              ]}
              columns={[{ label: "Access Key" }]}
              selectedItems={[]}
              isLoading={false}
              records={filteredMembers}
              entityName="Users"
            />
          </TooltipWrapper>
        </SecureComponent>
      </Grid>
    </Box>
  );

  const policiesTabContent = (
    <Fragment>
      <Box
        onMouseMove={() => {
          dispatch(setHelpName("groups_policies"));
        }}
      >
        <SectionTitle
          separator
          sx={{ marginBottom: 15 }}
          actions={
            <TooltipWrapper
              tooltip={
                canSetPolicies
                  ? "Set Policies"
                  : permissionTooltipHelper(
                      setGroupPoliciesPermissions,
                      "assign Policies",
                    )
              }
            >
              <Button
                id={"set-policies"}
                label={`Set Policies`}
                variant="callAction"
                icon={<IAMPoliciesIcon />}
                onClick={() => {
                  setPolicyOpen(true);
                }}
                disabled={!canSetPolicies}
              />
            </TooltipWrapper>
          }
        >
          Policies
        </SectionTitle>
      </Box>
      <Grid item xs={12}>
        <TooltipWrapper
          tooltip={
            canViewPolicy
              ? ""
              : permissionTooltipHelper(
                  viewPolicyPermissions,
                  "view Policy details",
                )
          }
        >
          <DataTable
            itemActions={[
              {
                type: "view",
                onClick: (policy) => {
                  navigate(
                    `${IAM_PAGES.POLICIES}/${encodeURIComponent(policy)}`,
                  );
                },
                isDisabled: !canViewPolicy,
              },
            ]}
            columns={[{ label: "Policy" }]}
            isLoading={false}
            records={groupPolicies}
            entityName="Policies"
          />
        </TooltipWrapper>
      </Grid>
    </Fragment>
  );

  return (
    <Fragment>
      {policyOpen ? (
        <SetPolicy
          open={policyOpen}
          selectedGroups={[params.groupName || ""]}
          selectedUser={null}
          closeModalAndRefresh={() => {
            setPolicyOpen(false);
            fetchGroupInfo();
            dispatch(setSelectedPolicies([]));
          }}
        />
      ) : null}

      {usersOpen ? (
        <AddGroupMember
          selectedGroup={params.groupName}
          onSaveClick={() => {}}
          title={memberActionText}
          groupStatus={groupEnabled}
          preSelectedUsers={members}
          open={usersOpen}
          onClose={() => {
            setUsersOpen(false);
            fetchGroupInfo();
          }}
        />
      ) : null}

      {deleteOpen && (
        <DeleteGroup
          deleteOpen={deleteOpen}
          selectedGroups={[params.groupName || ""]}
          closeDeleteModalAndRefresh={(isDelSuccess: boolean) => {
            setDeleteOpen(false);
            if (isDelSuccess) {
              navigate(IAM_PAGES.GROUPS);
            }
          }}
        />
      )}
      <PageHeaderWrapper
        label={
          <Fragment>
            <BackLink
              label={"Groups"}
              onClick={() => navigate(IAM_PAGES.GROUPS)}
            />
          </Fragment>
        }
        actions={<HelpMenu />}
      />
      <PageLayout>
        <Grid item xs={12}>
          <ScreenTitle
            icon={
              <Fragment>
                <GroupsIcon width={40} />
              </Fragment>
            }
            title={params.groupName || ""}
            subTitle={null}
            bottomBorder
            actions={
              <Box
                sx={{
                  display: "flex",
                  fontSize: 14,
                  alignItems: "center",
                  gap: 15,
                }}
              >
                <span>Group Status:</span>
                <span id="group-status-label" style={{ fontWeight: "bold" }}>
                  {isGroupEnabled ? "Enabled" : "Disabled"}
                </span>
                <TooltipWrapper
                  tooltip={
                    hasPermission(
                      CONSOLE_UI_RESOURCE,
                      enableDisableGroupPermissions,
                      true,
                    )
                      ? ""
                      : permissionTooltipHelper(
                          enableDisableGroupPermissions,
                          "enable or disable Groups",
                        )
                  }
                >
                  <SecureComponent
                    resource={CONSOLE_UI_RESOURCE}
                    scopes={enableDisableGroupPermissions}
                    errorProps={{ disabled: true }}
                    matchAll
                  >
                    <Switch
                      indicatorLabels={["Enabled", "Disabled"]}
                      checked={isGroupEnabled}
                      value={"group_enabled"}
                      id="group-status"
                      name="group-status"
                      onChange={() => {
                        toggleGroupStatus(!isGroupEnabled);
                      }}
                      switchOnly
                    />
                  </SecureComponent>
                </TooltipWrapper>

                <TooltipWrapper tooltip={"Delete Group"}>
                  <Button
                    id={"delete-user-group"}
                    variant="secondary"
                    icon={<TrashIcon />}
                    onClick={() => {
                      setDeleteOpen(true);
                    }}
                  />
                </TooltipWrapper>
              </Box>
            }
            sx={{ marginBottom: 15 }}
          />
        </Grid>

        <Grid item xs={12}>
          <Tabs
            options={[
              {
                tabConfig: { id: "members", label: "Members" },
                content: groupsTabContent,
              },
              {
                tabConfig: { id: "policies", label: "Policies" },
                content: policiesTabContent,
              },
            ]}
            currentTabOrPath={currentTab}
            onTabClick={setCurrentTab}
          />
        </Grid>
      </PageLayout>
    </Fragment>
  );
};

export default GroupsDetails;
