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

import React, { Fragment, useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  AddIcon,
  BackLink,
  Box,
  Button,
  DataTable,
  Grid,
  IAMPoliciesIcon,
  PageLayout,
  PasswordKeyIcon,
  ScreenTitle,
  SectionTitle,
  Switch,
  Tabs,
  TrashIcon,
  UsersIcon,
} from "mds";
import { IPolicyItem } from "./types";
import { ErrorResponseHandler } from "../../../common/types";
import { setHelpName, setModalErrorSnackMessage } from "../../../systemSlice";
import {
  assignGroupPermissions,
  assignIAMPolicyPermissions,
  CONSOLE_UI_RESOURCE,
  deleteUserPermissions,
  disableUserPermissions,
  editServiceAccountPermissions,
  enableDisableUserPermissions,
  enableUserPermissions,
  getGroupPermissions,
  IAM_PAGES,
  permissionTooltipHelper,
} from "../../../common/SecureComponent/permissions";
import { hasPermission } from "../../../common/SecureComponent";
import { useAppDispatch } from "../../../store";
import { policyDetailsSort } from "../../../utils/sortFunctions";
import TooltipWrapper from "../Common/TooltipWrapper/TooltipWrapper";
import PageHeaderWrapper from "../Common/PageHeaderWrapper/PageHeaderWrapper";
import HelpMenu from "../HelpMenu";
import api from "../../../common/api";
import ChangeUserGroups from "./ChangeUserGroups";
import SetUserPolicies from "./SetUserPolicies";
import UserServiceAccountsPanel from "./UserServiceAccountsPanel";
import ChangeUserPasswordModal from "../Account/ChangeUserPasswordModal";
import DeleteUser from "./DeleteUser";

interface IGroupItem {
  group: string;
}

const UserDetails = () => {
  const dispatch = useAppDispatch();
  const params = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState<boolean>(false);
  const [addGroupOpen, setAddGroupOpen] = useState<boolean>(false);
  const [policyOpen, setPolicyOpen] = useState<boolean>(false);
  const [addLoading, setAddLoading] = useState<boolean>(false);
  const [enabled, setEnabled] = useState<boolean>(false);
  const [selectedGroups, setSelectedGroups] = useState<string[]>([]);
  const [currentGroups, setCurrentGroups] = useState<IGroupItem[]>([]);
  const [currentPolicies, setCurrentPolicies] = useState<IPolicyItem[]>([]);
  const [changeUserPasswordModalOpen, setChangeUserPasswordModalOpen] =
    useState<boolean>(false);
  const [deleteOpen, setDeleteOpen] = useState<boolean>(false);
  const [hasPolicy, setHasPolicy] = useState<boolean>(false);
  const [selectedTab, setSelectedTab] = useState<string>("groups");

  const enableEnabled =
    hasPermission(CONSOLE_UI_RESOURCE, enableUserPermissions) && !enabled;
  const disableEnabled =
    hasPermission(CONSOLE_UI_RESOURCE, disableUserPermissions) && enabled;

  const userName = params.userName || "";

  const changeUserPassword = () => {
    setChangeUserPasswordModalOpen(true);
  };

  const deleteUser = () => {
    setDeleteOpen(true);
  };

  const userLoggedIn = localStorage.getItem("userLoggedIn") || "";
  const canAssignPolicy = hasPermission(
    CONSOLE_UI_RESOURCE,
    assignIAMPolicyPermissions,
    true,
  );
  const canAssignGroup = hasPermission(
    CONSOLE_UI_RESOURCE,
    assignGroupPermissions,
    true,
  );

  const viewGroup = hasPermission(CONSOLE_UI_RESOURCE, getGroupPermissions);

  const getUserInformation = useCallback(() => {
    if (userName === "") {
      return null;
    }
    setLoading(true);
    api
      .invoke("GET", `/api/v1/user/${encodeURIComponent(userName)}`)
      .then((res) => {
        setAddLoading(false);
        const memberOf = res.memberOf || [];
        setSelectedGroups(memberOf);

        const currentGroups: IGroupItem[] = memberOf.map((group: string) => {
          return {
            group: group,
          };
        });

        setCurrentGroups(currentGroups);
        const currentPolicies: IPolicyItem[] = res.policy.map(
          (policy: string) => {
            return {
              policy: policy,
            };
          },
        );

        currentPolicies.sort(policyDetailsSort);

        setCurrentPolicies(currentPolicies);
        setEnabled(res.status === "enabled");
        setHasPolicy(res.hasPolicy);
        setLoading(false);
      })
      .catch((err: ErrorResponseHandler) => {
        setAddLoading(false);
        setLoading(false);
        dispatch(setModalErrorSnackMessage(err));
      });
  }, [userName, dispatch]);

  const saveRecord = (isEnabled: boolean) => {
    if (addLoading) {
      return;
    }
    setAddLoading(true);
    api
      .invoke("PUT", `/api/v1/user/${encodeURIComponent(userName)}`, {
        status: isEnabled ? "enabled" : "disabled",
        groups: selectedGroups,
      })
      .then((_) => {
        setAddLoading(false);
      })
      .catch((err: ErrorResponseHandler) => {
        setAddLoading(false);
        dispatch(setModalErrorSnackMessage(err));
      });
  };

  useEffect(() => {
    dispatch(setHelpName("user_details_groups"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    getUserInformation();
  }, [getUserInformation]);

  const closeDeleteModalAndRefresh = (refresh: boolean) => {
    setDeleteOpen(false);
    if (refresh) {
      getUserInformation();
    }
  };

  const groupViewAction = (group: any) => {
    navigate(`${IAM_PAGES.GROUPS}/${encodeURIComponent(group.group)}`);
  };

  const groupTableActions = [
    {
      type: "view",
      onClick: groupViewAction,
      disableButtonFunction: () => !viewGroup,
    },
  ];

  return (
    <Fragment>
      {addGroupOpen && (
        <ChangeUserGroups
          open={addGroupOpen}
          selectedUser={userName}
          closeModalAndRefresh={() => {
            setAddGroupOpen(false);
            getUserInformation();
          }}
        />
      )}
      {policyOpen && (
        <SetUserPolicies
          open={policyOpen}
          selectedUser={userName}
          currentPolicies={currentPolicies}
          closeModalAndRefresh={() => {
            setPolicyOpen(false);
            getUserInformation();
          }}
        />
      )}
      {deleteOpen && (
        <DeleteUser
          deleteOpen={deleteOpen}
          selectedUsers={[userName]}
          closeDeleteModalAndRefresh={(refresh: boolean) => {
            closeDeleteModalAndRefresh(refresh);
          }}
        />
      )}
      {changeUserPasswordModalOpen && (
        <ChangeUserPasswordModal
          open={changeUserPasswordModalOpen}
          userName={userName}
          closeModal={() => setChangeUserPasswordModalOpen(false)}
        />
      )}
      <PageHeaderWrapper
        label={
          <Fragment>
            <BackLink
              label={"Users"}
              onClick={() => navigate(IAM_PAGES.USERS)}
            />
          </Fragment>
        }
        actions={<HelpMenu />}
      />
      <PageLayout>
        <Grid container>
          <Grid item xs={12}>
            <ScreenTitle
              icon={<UsersIcon width={40} />}
              title={userName}
              subTitle={""}
              actions={
                <Fragment>
                  <span
                    style={{
                      fontSize: ".8rem",
                      marginRight: ".5rem",
                    }}
                  >
                    User Status:
                  </span>
                  <span
                    style={{
                      fontWeight: "bold",
                      fontSize: ".9rem",
                      marginRight: ".5rem",
                    }}
                  >
                    {enabled ? "Enabled" : "Disabled"}
                  </span>
                  <TooltipWrapper
                    tooltip={
                      enableEnabled || disableEnabled
                        ? ""
                        : hasPermission(
                              CONSOLE_UI_RESOURCE,
                              enableUserPermissions,
                            )
                          ? permissionTooltipHelper(
                              disableUserPermissions,
                              "disable users",
                            )
                          : hasPermission(
                                CONSOLE_UI_RESOURCE,
                                disableUserPermissions,
                              )
                            ? permissionTooltipHelper(
                                enableUserPermissions,
                                "enable users",
                              )
                            : permissionTooltipHelper(
                                enableDisableUserPermissions,
                                "enable or disable users",
                              )
                    }
                  >
                    <Switch
                      indicatorLabels={["Enabled", "Disabled"]}
                      checked={enabled}
                      value={"group_enabled"}
                      id="group-status"
                      name="group-status"
                      onChange={() => {
                        setEnabled(!enabled);
                        saveRecord(!enabled);
                      }}
                      switchOnly
                      disabled={!enableEnabled && !disableEnabled}
                    />
                  </TooltipWrapper>
                  <TooltipWrapper
                    tooltip={
                      hasPermission(CONSOLE_UI_RESOURCE, deleteUserPermissions)
                        ? userLoggedIn === userName
                          ? "You cannot delete the currently logged in User"
                          : "Delete User"
                        : permissionTooltipHelper(
                            deleteUserPermissions,
                            "delete user",
                          )
                    }
                  >
                    <Button
                      id={"delete-user"}
                      onClick={deleteUser}
                      icon={<TrashIcon />}
                      variant={"secondary"}
                      disabled={
                        !hasPermission(
                          CONSOLE_UI_RESOURCE,
                          deleteUserPermissions,
                        ) || userLoggedIn === userName
                      }
                    />
                  </TooltipWrapper>

                  <TooltipWrapper tooltip={"Change Password"}>
                    <Button
                      id={"change-user-password"}
                      onClick={changeUserPassword}
                      icon={<PasswordKeyIcon />}
                      variant={"regular"}
                      disabled={userLoggedIn === userName}
                    />
                  </TooltipWrapper>
                </Fragment>
              }
              sx={{ marginBottom: 15 }}
            />
          </Grid>

          <Grid item xs={12}>
            <Tabs
              currentTabOrPath={selectedTab}
              onTabClick={setSelectedTab}
              options={[
                {
                  tabConfig: {
                    id: "groups",
                    label: "Groups",
                    disabled: !canAssignGroup,
                  },
                  content: (
                    <Fragment>
                      <Box
                        onMouseMove={() =>
                          dispatch(setHelpName("user_details_groups"))
                        }
                      >
                        <SectionTitle
                          separator
                          sx={{ marginBottom: 15 }}
                          actions={
                            <TooltipWrapper
                              tooltip={
                                canAssignGroup
                                  ? "Assign groups"
                                  : permissionTooltipHelper(
                                      assignGroupPermissions,
                                      "add users to groups",
                                    )
                              }
                            >
                              <Button
                                id={"add-groups"}
                                label={"Add to Groups"}
                                onClick={() => {
                                  setAddGroupOpen(true);
                                }}
                                icon={<AddIcon />}
                                variant={"callAction"}
                                disabled={!canAssignGroup}
                              />
                            </TooltipWrapper>
                          }
                        >
                          Groups
                        </SectionTitle>
                      </Box>
                      <Grid
                        item
                        xs={12}
                        onMouseMove={() =>
                          dispatch(setHelpName("user_details_groups"))
                        }
                      >
                        <DataTable
                          itemActions={groupTableActions}
                          columns={[{ label: "Name", elementKey: "group" }]}
                          isLoading={loading}
                          records={currentGroups}
                          entityName="Groups"
                          idField="group"
                        />
                      </Grid>
                    </Fragment>
                  ),
                },
                {
                  tabConfig: {
                    id: "service_accounts",
                    label: "Service Accounts",
                    disabled: !hasPermission(
                      CONSOLE_UI_RESOURCE,
                      editServiceAccountPermissions,
                    ),
                  },
                  content: (
                    <UserServiceAccountsPanel
                      user={userName}
                      hasPolicy={hasPolicy}
                    />
                  ),
                },
                {
                  tabConfig: {
                    id: "policies",
                    label: "Policies",
                    disabled: !canAssignPolicy,
                  },
                  content: (
                    <Fragment>
                      <Box
                        onMouseMove={() =>
                          dispatch(setHelpName("user_details_policies"))
                        }
                      >
                        <SectionTitle
                          separator
                          sx={{ marginBottom: 15 }}
                          actions={
                            <TooltipWrapper
                              tooltip={
                                canAssignPolicy
                                  ? "Assign Policies"
                                  : permissionTooltipHelper(
                                      assignIAMPolicyPermissions,
                                      "assign policies",
                                    )
                              }
                            >
                              <Button
                                id={"assign-policies"}
                                label={"Assign Policies"}
                                onClick={() => {
                                  setPolicyOpen(true);
                                }}
                                icon={<IAMPoliciesIcon />}
                                variant={"callAction"}
                                disabled={!canAssignPolicy}
                              />
                            </TooltipWrapper>
                          }
                        >
                          Policies
                        </SectionTitle>
                      </Box>
                      <Box>
                        <DataTable
                          itemActions={[
                            {
                              type: "view",
                              onClick: (policy: IPolicyItem) => {
                                navigate(
                                  `${IAM_PAGES.POLICIES}/${encodeURIComponent(
                                    policy.policy,
                                  )}`,
                                );
                              },
                            },
                          ]}
                          columns={[{ label: "Name", elementKey: "policy" }]}
                          isLoading={loading}
                          records={currentPolicies}
                          entityName="Policies"
                          idField="policy"
                        />
                      </Box>
                    </Fragment>
                  ),
                },
              ]}
            />
          </Grid>
        </Grid>
      </PageLayout>
    </Fragment>
  );
};

export default UserDetails;
