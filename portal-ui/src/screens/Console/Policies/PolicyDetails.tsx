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
import { IAMPolicy, IAMStatement, Policy } from "./types";
import { connect } from "react-redux";
import { Theme } from "@mui/material/styles";
import createStyles from "@mui/styles/createStyles";
import withStyles from "@mui/styles/withStyles";
import {
  actionsTray,
  containerForHeader,
  modalBasic,
  searchField,
} from "../Common/FormComponents/common/styleLibrary";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import { Button, LinearProgress } from "@mui/material";
import TableWrapper from "../Common/TableWrapper/TableWrapper";
import api from "../../../common/api";
import PageHeader from "../Common/PageHeader/PageHeader";
import DeletePolicy from "./DeletePolicy";
import { Link } from "react-router-dom";
import { setErrorSnackMessage, setSnackBarMessage } from "../../../actions";
import { ErrorResponseHandler } from "../../../common/types";
import CodeMirrorWrapper from "../Common/FormComponents/CodeMirrorWrapper/CodeMirrorWrapper";
import history from "../../../history";
import InputAdornment from "@mui/material/InputAdornment";
import TextField from "@mui/material/TextField";
import ScreenTitle from "../Common/ScreenTitle/ScreenTitle";
import IAMPoliciesIcon from "../../../icons/IAMPoliciesIcon";
import RefreshIcon from "../../../icons/RefreshIcon";
import SearchIcon from "../../../icons/SearchIcon";
import TrashIcon from "../../../icons/TrashIcon";
import PageLayout from "../Common/Layout/PageLayout";
import VerticalTabs from "../Common/VerticalTabs/VerticalTabs";
import BackLink from "../../../common/BackLink";
import BoxIconButton from "../Common/BoxIconButton/BoxIconButton";
import {
  CONSOLE_UI_RESOURCE,
  IAM_SCOPES,
} from "../../../common/SecureComponent/permissions";
import SecureComponent, {
  hasPermission,
} from "../../../common/SecureComponent/SecureComponent";

interface IPolicyDetailsProps {
  classes: any;
  match: any;
  setErrorSnackMessage: typeof setErrorSnackMessage;
  setSnackBarMessage: typeof setSnackBarMessage;
}

const styles = (theme: Theme) =>
  createStyles({
    buttonContainer: {
      textAlign: "right",
    },
    pageContainer: {
      border: "1px solid #EAEAEA",
      height: "100%",
    },
    multiContainer: {
      display: "flex",
      alignItems: "center" as const,
      justifyContent: "flex-start" as const,
    },
    sizeFactorContainer: {
      marginLeft: 8,
    },
    containerHeader: {
      display: "flex",
      justifyContent: "space-between",
    },
    paperContainer: {
      padding: "15px 15px 15px 50px",
      minHeight: "450px",
    },
    infoGrid: {
      display: "grid",
      gridTemplateColumns: "auto auto auto auto",
      gridGap: 8,
      "& div": {
        display: "flex",
        alignItems: "center",
      },
      "& div:nth-child(odd)": {
        justifyContent: "flex-end",
        fontWeight: 700,
      },
      "& div:nth-child(2n)": {
        paddingRight: 35,
      },
    },
    masterActions: {
      width: "25%",
      minWidth: "120px",
      "& div": {
        margin: "5px 0px",
      },
    },
    updateButton: {
      backgroundColor: "transparent",
      border: 0,
      padding: "0 6px",
      cursor: "pointer",
      "&:focus, &:active": {
        outline: "none",
      },
      "& svg": {
        height: 12,
      },
    },
    noUnderLine: {
      textDecoration: "none",
    },
    poolLabel: {
      color: "#666666",
    },
    licenseContainer: {
      position: "relative",
      padding: "20px 52px 0px 28px",
      background: "#032F51",
      boxShadow: "0px 3px 7px #00000014",
      "& h2": {
        color: "#FFF",
        marginBottom: 67,
      },
      "& a": {
        textDecoration: "none",
      },
      "& h3": {
        color: "#FFFFFF",
        marginBottom: "30px",
        fontWeight: "bold",
      },
      "& h6": {
        color: "#FFFFFF !important",
      },
    },
    licenseInfo: { color: "#FFFFFF", position: "relative" },
    licenseInfoTitle: {
      textTransform: "none",
      color: "#BFBFBF",
      fontSize: 11,
    },
    licenseInfoValue: {
      textTransform: "none",
      fontSize: 14,
      fontWeight: "bold",
    },
    verifiedIcon: {
      width: 96,
      position: "absolute",
      right: 0,
      bottom: 29,
    },
    breadcrumLink: {
      textDecoration: "none",
      color: "black",
    },
    statement: {
      border: "1px solid #DADADA",
      padding: 8,
      marginBottom: 8,
      borderRadius: 4,
    },
    labelCol: {
      fontWeight: "bold",
    },
    statementActions: {
      textAlign: "right",
    },
    addStmt: {
      color: theme.palette.primary.main,
    },
    listBox: {
      border: "1px solid #DADADA",
      height: 100,
    },
    ...actionsTray,
    ...searchField,
    ...modalBasic,
    ...containerForHeader(theme.spacing(4)),
  });

const PolicyDetails = ({
  classes,
  match,
  setErrorSnackMessage,
  setSnackBarMessage,
}: IPolicyDetailsProps) => {
  const [policy, setPolicy] = useState<Policy | null>(null);
  const [policyStatements, setPolicyStatements] = useState<IAMStatement[]>([]);
  const [userList, setUserList] = useState<string[]>([]);
  const [groupList, setGroupList] = useState<string[]>([]);
  const [addLoading, setAddLoading] = useState<boolean>(false);
  const [policyName, setPolicyName] = useState<string>(match.params[0]);
  const [policyDefinition, setPolicyDefinition] = useState<string>("");
  const [loadingPolicy, setLoadingPolicy] = useState<boolean>(true);
  const [filterUsers, setFilterUsers] = useState<string>("");
  const [loadingUsers, setLoadingUsers] = useState<boolean>(true);
  const [filterGroups, setFilterGroups] = useState<string>("");
  const [loadingGroups, setLoadingGroups] = useState<boolean>(true);
  const [deleteOpen, setDeleteOpen] = useState<boolean>(false);

  const displayGroups = hasPermission(
    CONSOLE_UI_RESOURCE,
    [IAM_SCOPES.ADMIN_LIST_GROUPS, IAM_SCOPES.ADMIN_GET_GROUP],
    true
  );

  const viewGroup = hasPermission(CONSOLE_UI_RESOURCE, [
    IAM_SCOPES.ADMIN_GET_GROUP,
  ]);

  const displayUsers = hasPermission(CONSOLE_UI_RESOURCE, [
    IAM_SCOPES.ADMIN_LIST_GROUPS,
  ]);

  const viewUser = hasPermission(CONSOLE_UI_RESOURCE, [
    IAM_SCOPES.ADMIN_GET_USER,
  ]);

  const displayPolicy = hasPermission(CONSOLE_UI_RESOURCE, [
    IAM_SCOPES.ADMIN_GET_POLICY,
  ]);

  const editPolicy = hasPermission(CONSOLE_UI_RESOURCE, [
    IAM_SCOPES.ADMIN_CREATE_POLICY,
  ]);

  const saveRecord = (event: React.FormEvent) => {
    event.preventDefault();
    if (addLoading) {
      return;
    }
    setAddLoading(true);
    if (editPolicy) {
      api
        .invoke("POST", "/api/v1/policies", {
          name: policyName,
          policy: policyDefinition,
        })
        .then((_) => {
          setAddLoading(false);
          setSnackBarMessage("Policy successfully updated");
        })
        .catch((err: ErrorResponseHandler) => {
          setAddLoading(false);
          setErrorSnackMessage(err);
        });
    } else {
      setAddLoading(false);
    }
  };

  useEffect(() => {
    const loadUsersForPolicy = () => {
      if (loadingUsers) {
        if (displayUsers) {
          api
            .invoke(
              "GET",
              `/api/v1/policies/${encodeURIComponent(policyName)}/users`
            )
            .then((result: any) => {
              setUserList(result);
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
    };

    const loadGroupsForPolicy = () => {
      if (loadingGroups) {
        if (displayGroups) {
          api
            .invoke(
              "GET",
              `/api/v1/policies/${encodeURIComponent(policyName)}/groups`
            )
            .then((result: any) => {
              setGroupList(result);
              setLoadingGroups(false);
            })
            .catch((err: ErrorResponseHandler) => {
              setErrorSnackMessage(err);
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
          api
            .invoke(
              "GET",
              `/api/v1/policy?name=${encodeURIComponent(policyName)}`
            )
            .then((result: any) => {
              if (result) {
                setPolicy(result);
                setPolicyDefinition(
                  result
                    ? JSON.stringify(JSON.parse(result.policy), null, 4)
                    : ""
                );
                const pol: IAMPolicy = JSON.parse(result.policy);
                setPolicyStatements(pol.Statement);
              }
              setLoadingPolicy(false);
            })
            .catch((err: ErrorResponseHandler) => {
              setErrorSnackMessage(err);
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
    setErrorSnackMessage,
    setUserList,
    setGroupList,
    setPolicyDefinition,
    setPolicy,
    setLoadingUsers,
    setLoadingGroups,
    displayUsers,
    displayGroups,
    displayPolicy,
  ]);

  const resetForm = () => {
    setPolicyName("");
    setPolicyDefinition("");
  };

  const validSave = policyName.trim() !== "";

  const deletePolicy = () => {
    setDeleteOpen(true);
  };

  const closeDeleteModalAndRefresh = (refresh: boolean) => {
    setDeleteOpen(false);
    history.push(`/policies`);
  };

  const userViewAction = (user: any) => {
    history.push(`/users/${user}`);
  };
  const userTableActions = [
    {
      type: "view",
      onClick: userViewAction,
      disableButtonFunction: () => !viewUser,
    },
  ];

  const filteredUsers = userList.filter((elementItem) =>
    elementItem.includes(filterUsers)
  );

  const groupViewAction = (group: any) => {
    history.push(`/groups/${group}`);
  };

  const groupTableActions = [
    {
      type: "view",
      onClick: groupViewAction,
      disableButtonFunction: () => !viewGroup,
    },
  ];

  const filteredGroups = groupList.filter((elementItem) =>
    elementItem.includes(filterGroups)
  );

  return (
    <Fragment>
      {deleteOpen && (
        <DeletePolicy
          deleteOpen={deleteOpen}
          selectedPolicy={policyName}
          closeDeleteModalAndRefresh={closeDeleteModalAndRefresh}
        />
      )}
      <PageHeader
        label={
          <Fragment>
            <Link to={"/policies"} className={classes.breadcrumLink}>
              Policy
            </Link>
          </Fragment>
        }
      />
      <BackLink
        to={"/policies"}
        label={"Return to Policies"}
        classes={classes}
      />
      <PageLayout className={classes.pageContainer}>
        <Grid item xs={12}>
          <ScreenTitle
            icon={
              <Fragment>
                <IAMPoliciesIcon width={40} />
              </Fragment>
            }
            title={policyName}
            subTitle={<Fragment>IAM Policy</Fragment>}
            actions={
              <Fragment>
                <SecureComponent
                  scopes={[IAM_SCOPES.ADMIN_DELETE_POLICY]}
                  resource={CONSOLE_UI_RESOURCE}
                >
                  <BoxIconButton
                    tooltip={"Delete Policy"}
                    color="primary"
                    aria-label="Delete Policy"
                    onClick={deletePolicy}
                  >
                    <TrashIcon />
                  </BoxIconButton>
                </SecureComponent>

                <BoxIconButton
                  tooltip={"Refresh"}
                  color="primary"
                  aria-label="Refresh List"
                  onClick={() => {
                    setLoadingUsers(true);
                    setLoadingGroups(true);
                    setLoadingPolicy(true);
                  }}
                  size="large"
                >
                  <RefreshIcon />
                </BoxIconButton>
              </Fragment>
            }
          />
        </Grid>

        <VerticalTabs>
          {{
            tabConfig: { label: "Summary", disabled: !displayPolicy },
            content: (
              <Fragment>
                <div className={classes.sectionTitle}>Policy Summary</div>
                <Paper className={classes.paperContainer}>
                  <form
                    noValidate
                    autoComplete="off"
                    onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
                      saveRecord(e);
                    }}
                  >
                    <Grid container>
                      <Grid item xs={8}>
                        <h4>Statements</h4>
                      </Grid>
                      <Grid item xs={4} />

                      <Fragment>
                        {policyStatements.map((stmt, i) => {
                          return (
                            <Grid
                              item
                              xs={12}
                              className={classes.statement}
                              key={`s-${i}`}
                            >
                              <Grid container>
                                <Grid item xs={2} className={classes.labelCol}>
                                  Effect
                                </Grid>
                                <Grid item xs={4}>
                                  <Fragment>{stmt.Effect}</Fragment>
                                </Grid>
                                <Grid
                                  item
                                  xs={2}
                                  className={classes.labelCol}
                                />
                                <Grid item xs={4} />
                                <Grid item xs={2} className={classes.labelCol}>
                                  Actions
                                </Grid>
                                <Grid item xs={4}>
                                  <ul>
                                    {stmt.Action &&
                                      stmt.Action.map((act, actIndex) => (
                                        <li key={`${i}-r-${actIndex}`}>
                                          {act}
                                        </li>
                                      ))}
                                  </ul>
                                </Grid>
                                <Grid item xs={2} className={classes.labelCol}>
                                  Resources
                                </Grid>
                                <Grid item xs={4}>
                                  <ul>
                                    {stmt.Resource &&
                                      stmt.Resource.map((res, resIndex) => (
                                        <li key={`${i}-r-${resIndex}`}>
                                          {res}
                                        </li>
                                      ))}
                                  </ul>
                                </Grid>
                              </Grid>
                            </Grid>
                          );
                        })}
                      </Fragment>
                    </Grid>
                  </form>
                </Paper>
              </Fragment>
            ),
          }}
          {{
            tabConfig: { label: "Users", disabled: !displayUsers },
            content: (
              <Fragment>
                <div className={classes.sectionTitle}>Users</div>
                <Grid container>
                  <Grid item xs={12} className={classes.actionsTray}>
                    <TextField
                      placeholder="Search Users"
                      className={classes.searchField}
                      id="search-resource"
                      label=""
                      onChange={(val) => {
                        setFilterUsers(val.target.value);
                      }}
                      InputProps={{
                        disableUnderline: true,
                        startAdornment: (
                          <InputAdornment position="start">
                            <SearchIcon />
                          </InputAdornment>
                        ),
                      }}
                      variant="standard"
                    />
                  </Grid>
                  <Grid item xs={12} className={classes.actionsTray}>
                    <br />
                  </Grid>
                  <TableWrapper
                    itemActions={userTableActions}
                    columns={[{ label: "Name", elementKey: "name" }]}
                    isLoading={loadingUsers}
                    records={filteredUsers}
                    entityName="Users"
                    idField="name"
                  />
                </Grid>
              </Fragment>
            ),
          }}
          {{
            tabConfig: { label: "Groups", disabled: !displayGroups },
            content: (
              <Fragment>
                <div className={classes.sectionTitle}>Groups</div>
                <Grid container>
                  <Grid item xs={12} className={classes.actionsTray}>
                    <TextField
                      placeholder="Search Groups"
                      className={classes.searchField}
                      id="search-resource"
                      label=""
                      onChange={(val) => {
                        setFilterGroups(val.target.value);
                      }}
                      InputProps={{
                        disableUnderline: true,
                        startAdornment: (
                          <InputAdornment position="start">
                            <SearchIcon />
                          </InputAdornment>
                        ),
                      }}
                      variant="standard"
                    />
                  </Grid>
                  <Grid item xs={12} className={classes.actionsTray}>
                    <br />
                  </Grid>
                  <TableWrapper
                    itemActions={groupTableActions}
                    columns={[{ label: "Name", elementKey: "name" }]}
                    isLoading={loadingGroups}
                    records={filteredGroups}
                    entityName="Groups"
                    idField="name"
                  />
                </Grid>
              </Fragment>
            ),
          }}
          {{
            tabConfig: { label: "Raw Policy", disabled: !displayPolicy },
            content: (
              <Fragment>
                <div className={classes.sectionTitle}>Raw Policy</div>
                <Paper className={classes.paperContainer}>
                  <form
                    noValidate
                    autoComplete="off"
                    onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
                      saveRecord(e);
                    }}
                  >
                    <Grid container>
                      <Grid item xs={12} className={classes.formScrollable}>
                        <CodeMirrorWrapper
                          readOnly={!editPolicy}
                          value={policyDefinition}
                          onBeforeChange={(editor, data, value) => {
                            setPolicyDefinition(value);
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} className={classes.buttonContainer}>
                        {!policy && (
                          <button
                            type="button"
                            color="primary"
                            className={classes.clearButton}
                            onClick={() => {
                              resetForm();
                            }}
                          >
                            Clear
                          </button>
                        )}
                        <SecureComponent
                          scopes={[IAM_SCOPES.ADMIN_CREATE_POLICY]}
                          resource={CONSOLE_UI_RESOURCE}
                        >
                          <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            disabled={addLoading || !validSave}
                          >
                            Save
                          </Button>
                        </SecureComponent>
                      </Grid>
                      {addLoading && (
                        <Grid item xs={12}>
                          <LinearProgress />
                        </Grid>
                      )}
                    </Grid>
                  </form>
                </Paper>
              </Fragment>
            ),
          }}
        </VerticalTabs>
      </PageLayout>
    </Fragment>
  );
};

const connector = connect(null, {
  setErrorSnackMessage,
  setSnackBarMessage,
});

export default withStyles(styles)(connector(PolicyDetails));
