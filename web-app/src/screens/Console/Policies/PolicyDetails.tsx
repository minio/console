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
import { IAMPolicy, IAMStatement } from "./types";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
  BackLink,
  Box,
  Button,
  DataTable,
  Grid,
  IAMPoliciesIcon,
  PageLayout,
  ProgressBar,
  RefreshIcon,
  ScreenTitle,
  SectionTitle,
  Tabs,
  TrashIcon,
  HelpTip,
} from "mds";
import { actionsTray } from "../Common/FormComponents/common/styleLibrary";

import { ErrorResponseHandler } from "../../../common/types";
import CodeMirrorWrapper from "../Common/FormComponents/CodeMirrorWrapper/CodeMirrorWrapper";

import {
  CONSOLE_UI_RESOURCE,
  createPolicyPermissions,
  deletePolicyPermissions,
  getGroupPermissions,
  IAM_PAGES,
  IAM_SCOPES,
  listGroupPermissions,
  listUsersPermissions,
  permissionTooltipHelper,
  viewPolicyPermissions,
  viewUserPermissions,
} from "../../../common/SecureComponent/permissions";
import {
  hasPermission,
  SecureComponent,
} from "../../../common/SecureComponent";

import withSuspense from "../Common/Components/withSuspense";

import PolicyView from "./PolicyView";
import {
  setErrorSnackMessage,
  setHelpName,
  setSnackBarMessage,
} from "../../../systemSlice";
import { selFeatures } from "../consoleSlice";
import { useAppDispatch } from "../../../store";
import TooltipWrapper from "../Common/TooltipWrapper/TooltipWrapper";
import PageHeaderWrapper from "../Common/PageHeaderWrapper/PageHeaderWrapper";
import { Policy } from "../../../api/consoleApi";
import { api } from "../../../api";
import HelpMenu from "../HelpMenu";
import SearchBox from "../Common/SearchBox";

const DeletePolicy = withSuspense(React.lazy(() => import("./DeletePolicy")));

const PolicyDetails = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const params = useParams();

  const features = useSelector(selFeatures);

  const [policy, setPolicy] = useState<Policy | null>(null);
  const [policyStatements, setPolicyStatements] = useState<IAMStatement[]>([]);
  const [userList, setUserList] = useState<string[]>([]);
  const [groupList, setGroupList] = useState<string[]>([]);
  const [addLoading, setAddLoading] = useState<boolean>(false);

  const policyName = params.policyName || "";

  const [policyDefinition, setPolicyDefinition] = useState<string>("");
  const [loadingPolicy, setLoadingPolicy] = useState<boolean>(true);
  const [filterUsers, setFilterUsers] = useState<string>("");
  const [loadingUsers, setLoadingUsers] = useState<boolean>(true);
  const [filterGroups, setFilterGroups] = useState<string>("");
  const [loadingGroups, setLoadingGroups] = useState<boolean>(true);
  const [deleteOpen, setDeleteOpen] = useState<boolean>(false);
  const [selectedTab, setSelectedTab] = useState<string>("summary");

  const ldapIsEnabled = (features && features.includes("ldap-idp")) || false;

  const displayGroups = hasPermission(
    CONSOLE_UI_RESOURCE,
    listGroupPermissions,
    true,
  );

  const viewGroup = hasPermission(
    CONSOLE_UI_RESOURCE,
    getGroupPermissions,
    true,
  );

  const displayUsers = hasPermission(
    CONSOLE_UI_RESOURCE,
    listUsersPermissions,
    true,
  );

  const viewUser = hasPermission(
    CONSOLE_UI_RESOURCE,
    viewUserPermissions,
    true,
  );

  const displayPolicy = hasPermission(
    CONSOLE_UI_RESOURCE,
    viewPolicyPermissions,
    true,
  );

  const canDeletePolicy = hasPermission(
    CONSOLE_UI_RESOURCE,
    deletePolicyPermissions,
    true,
  );

  const canEditPolicy = hasPermission(
    CONSOLE_UI_RESOURCE,
    createPolicyPermissions,
    true,
  );

  const saveRecord = (event: React.FormEvent) => {
    event.preventDefault();
    if (addLoading) {
      return;
    }
    setAddLoading(true);
    if (canEditPolicy) {
      api.policies
        .addPolicy({
          name: policyName,
          policy: policyDefinition,
        })
        .then((_) => {
          setAddLoading(false);
          dispatch(setSnackBarMessage("Policy successfully updated"));
          refreshPolicyDetails();
        })
        .catch((err) => {
          setAddLoading(false);
          dispatch(
            setErrorSnackMessage({
              errorMessage: "There was an error updating the Policy ",
              detailedError:
                "There was an error updating the Policy: " +
                (err.error.detailedMessage || "") +
                ". Please check Policy syntax.",
            }),
          );
        });
    } else {
      setAddLoading(false);
    }
  };

  useEffect(() => {
    const loadUsersForPolicy = () => {
      if (loadingUsers) {
        if (displayUsers && !ldapIsEnabled) {
          api.policies
            .listUsersForPolicy(policyName)
            .then((result) => {
              setUserList(result.data ?? []);
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
    };

    const loadGroupsForPolicy = () => {
      if (loadingGroups) {
        if (displayGroups && !ldapIsEnabled) {
          api.policies
            .listGroupsForPolicy(policyName)
            .then((result) => {
              setGroupList(result.data ?? []);
              setLoadingGroups(false);
            })
            .catch((err: ErrorResponseHandler) => {
              dispatch(setErrorSnackMessage(err));
              setLoadingGroups(false);
            });
        } else {
          setLoadingGroups(false);
        }
      }
    };
    const loadPolicyDetails = () => {
      if (loadingPolicy) {
        if (displayPolicy) {
          api.policy
            .policyInfo(policyName)
            .then((result) => {
              if (result.data) {
                setPolicy(result.data);
                setPolicyDefinition(
                  result
                    ? JSON.stringify(JSON.parse(result.data?.policy!), null, 4)
                    : "",
                );
                const pol: IAMPolicy = JSON.parse(result.data?.policy!);
                setPolicyStatements(pol.Statement);
              }
              setLoadingPolicy(false);
            })
            .catch((err: ErrorResponseHandler) => {
              dispatch(setErrorSnackMessage(err));
              setLoadingPolicy(false);
            });
        } else {
          setLoadingPolicy(false);
        }
      }
    };

    if (loadingPolicy) {
      loadPolicyDetails();
      loadUsersForPolicy();
      loadGroupsForPolicy();
    }
  }, [
    policyName,
    loadingPolicy,
    loadingUsers,
    loadingGroups,
    setUserList,
    setGroupList,
    setPolicyDefinition,
    setPolicy,
    setLoadingUsers,
    setLoadingGroups,
    displayUsers,
    displayGroups,
    displayPolicy,
    ldapIsEnabled,
    dispatch,
  ]);

  const resetForm = () => {
    setPolicyDefinition("{}");
  };

  const validSave = policyName.trim() !== "";

  const deletePolicy = () => {
    setDeleteOpen(true);
  };

  const closeDeleteModalAndRefresh = (refresh: boolean) => {
    setDeleteOpen(false);
    navigate(IAM_PAGES.POLICIES);
  };

  const userViewAction = (user: any) => {
    navigate(`${IAM_PAGES.USERS}/${encodeURIComponent(user)}`);
  };
  const userTableActions = [
    {
      type: "view",
      onClick: userViewAction,
      disableButtonFunction: () => !viewUser,
    },
  ];

  const filteredUsers = userList.filter((elementItem) =>
    elementItem.includes(filterUsers),
  );

  const groupViewAction = (group: any) => {
    navigate(`${IAM_PAGES.GROUPS}/${encodeURIComponent(group)}`);
  };

  const groupTableActions = [
    {
      type: "view",
      onClick: groupViewAction,
      disableButtonFunction: () => !viewGroup,
    },
  ];

  const filteredGroups = groupList.filter((elementItem) =>
    elementItem.includes(filterGroups),
  );

  const refreshPolicyDetails = () => {
    setLoadingUsers(true);
    setLoadingGroups(true);
    setLoadingPolicy(true);
  };

  useEffect(() => {
    dispatch(setHelpName("policy_details_summary"));

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Fragment>
      {deleteOpen && (
        <DeletePolicy
          deleteOpen={deleteOpen}
          selectedPolicy={policyName}
          closeDeleteModalAndRefresh={closeDeleteModalAndRefresh}
        />
      )}
      <PageHeaderWrapper
        label={
          <Fragment>
            <BackLink
              label={"Policy"}
              onClick={() => navigate(IAM_PAGES.POLICIES)}
            />
          </Fragment>
        }
        actions={<HelpMenu />}
      />
      <PageLayout>
        <ScreenTitle
          icon={<IAMPoliciesIcon width={40} />}
          title={policyName}
          subTitle={<Fragment>IAM Policy</Fragment>}
          actions={
            <Fragment>
              <SecureComponent
                scopes={[IAM_SCOPES.ADMIN_DELETE_POLICY]}
                resource={CONSOLE_UI_RESOURCE}
                errorProps={{ disabled: true }}
              >
                <TooltipWrapper
                  tooltip={
                    canDeletePolicy
                      ? ""
                      : permissionTooltipHelper(
                          deletePolicyPermissions,
                          "delete Policies",
                        )
                  }
                >
                  <Button
                    id={"delete-policy"}
                    label={"Delete Policy"}
                    variant="secondary"
                    icon={<TrashIcon />}
                    onClick={deletePolicy}
                    disabled={!canDeletePolicy}
                  />
                </TooltipWrapper>
              </SecureComponent>

              <TooltipWrapper tooltip={"Refresh"}>
                <Button
                  id={"refresh-policy"}
                  label={"Refresh"}
                  variant="regular"
                  icon={<RefreshIcon />}
                  onClick={() => {
                    refreshPolicyDetails();
                  }}
                />
              </TooltipWrapper>
            </Fragment>
          }
          sx={{ marginBottom: 15 }}
        />
        <Box>
          <Tabs
            options={[
              {
                tabConfig: {
                  label: "Summary",
                  disabled: !displayPolicy,
                  id: "summary",
                },
                content: (
                  <Fragment>
                    <Grid
                      onMouseMove={() =>
                        dispatch(setHelpName("policy_details_summary"))
                      }
                    >
                      <SectionTitle separator sx={{ marginBottom: 15 }}>
                        Policy Summary
                      </SectionTitle>
                      <Box withBorders>
                        <PolicyView policyStatements={policyStatements} />
                      </Box>
                    </Grid>
                  </Fragment>
                ),
              },
              {
                tabConfig: {
                  label: "Users",
                  disabled: !displayUsers || ldapIsEnabled,
                  id: "users",
                },
                content: (
                  <Fragment>
                    <Grid
                      onMouseMove={() =>
                        dispatch(setHelpName("policy_details_users"))
                      }
                    >
                      <SectionTitle separator sx={{ marginBottom: 15 }}>
                        Users
                      </SectionTitle>
                      <Grid container>
                        {userList.length > 0 && (
                          <Grid
                            item
                            xs={12}
                            sx={{
                              ...actionsTray.actionsTray,
                              marginBottom: 15,
                            }}
                          >
                            <SearchBox
                              value={filterUsers}
                              placeholder={"Search Users"}
                              id="search-resource"
                              onChange={(val) => {
                                setFilterUsers(val);
                              }}
                            />
                          </Grid>
                        )}
                        <DataTable
                          itemActions={userTableActions}
                          columns={[{ label: "Name", elementKey: "name" }]}
                          isLoading={loadingUsers}
                          records={filteredUsers}
                          entityName="Users with this Policy associated"
                          idField="name"
                          customPaperHeight={"500px"}
                        />
                      </Grid>
                    </Grid>
                  </Fragment>
                ),
              },
              {
                tabConfig: {
                  label: "Groups",
                  disabled: !displayGroups || ldapIsEnabled,
                  id: "groups",
                },
                content: (
                  <Fragment>
                    <Grid
                      onMouseMove={() =>
                        dispatch(setHelpName("policy_details_groups"))
                      }
                    >
                      <SectionTitle separator sx={{ marginBottom: 15 }}>
                        Groups
                      </SectionTitle>
                      <Grid container>
                        {groupList.length > 0 && (
                          <Grid
                            item
                            xs={12}
                            sx={{
                              ...actionsTray.actionsTray,
                              marginBottom: 15,
                            }}
                          >
                            <SearchBox
                              value={filterUsers}
                              placeholder={"Search Groups"}
                              id="search-resource"
                              onChange={(val) => {
                                setFilterGroups(val);
                              }}
                            />
                          </Grid>
                        )}
                        <DataTable
                          itemActions={groupTableActions}
                          columns={[{ label: "Name", elementKey: "name" }]}
                          isLoading={loadingGroups}
                          records={filteredGroups}
                          entityName="Groups with this Policy associated"
                          idField="name"
                          customPaperHeight={"500px"}
                        />
                      </Grid>
                    </Grid>
                  </Fragment>
                ),
              },
              {
                tabConfig: {
                  label: "Raw Policy",
                  disabled: !displayPolicy,
                  id: "raw-policy",
                },
                content: (
                  <Fragment>
                    <Grid
                      onMouseMove={() =>
                        dispatch(setHelpName("policy_details_policy"))
                      }
                    >
                      <HelpTip
                        content={
                          <Fragment>
                            <a
                              target="blank"
                              href="https://min.io/docs/minio/kubernetes/upstream/administration/identity-access-management/policy-based-access-control.html#policy-document-structure"
                            >
                              Guide to access policy structure
                            </a>
                          </Fragment>
                        }
                        placement="right"
                      >
                        <SectionTitle>Raw Policy</SectionTitle>
                      </HelpTip>
                      <form
                        noValidate
                        autoComplete="off"
                        onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
                          saveRecord(e);
                        }}
                      >
                        <Grid container>
                          <Grid item xs={12}>
                            <CodeMirrorWrapper
                              value={policyDefinition}
                              onChange={(value) => {
                                if (canEditPolicy) {
                                  setPolicyDefinition(value);
                                }
                              }}
                              editorHeight={"350px"}
                              helptip={
                                <Fragment>
                                  <a
                                    target="blank"
                                    href="https://min.io/docs/minio/kubernetes/upstream/administration/identity-access-management/policy-based-access-control.html#policy-document-structure"
                                  >
                                    Guide to access policy structure
                                  </a>
                                </Fragment>
                              }
                            />
                          </Grid>
                          <Grid
                            item
                            xs={12}
                            sx={{
                              display: "flex",
                              justifyContent: "flex-end",
                              paddingTop: 16,
                              gap: 8,
                            }}
                          >
                            {!policy && (
                              <Button
                                type="button"
                                variant={"regular"}
                                id={"clear-policy"}
                                onClick={() => {
                                  resetForm();
                                }}
                              >
                                Clear
                              </Button>
                            )}
                            <SecureComponent
                              scopes={[IAM_SCOPES.ADMIN_CREATE_POLICY]}
                              resource={CONSOLE_UI_RESOURCE}
                              errorProps={{ disabled: true }}
                            >
                              <TooltipWrapper
                                tooltip={
                                  canEditPolicy
                                    ? ""
                                    : permissionTooltipHelper(
                                        createPolicyPermissions,
                                        "edit a Policy",
                                      )
                                }
                              >
                                <Button
                                  id={"save"}
                                  type="submit"
                                  variant="callAction"
                                  color="primary"
                                  disabled={
                                    addLoading || !validSave || !canEditPolicy
                                  }
                                  label={"Save"}
                                />
                              </TooltipWrapper>
                            </SecureComponent>
                          </Grid>
                          {addLoading && (
                            <Grid item xs={12}>
                              <ProgressBar />
                            </Grid>
                          )}
                        </Grid>
                      </form>
                    </Grid>
                  </Fragment>
                ),
              },
            ]}
            currentTabOrPath={selectedTab}
            onTabClick={(tab) => setSelectedTab(tab)}
          />
        </Box>
      </PageLayout>
    </Fragment>
  );
};

export default PolicyDetails;
