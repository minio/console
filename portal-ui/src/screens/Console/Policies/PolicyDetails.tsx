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
import { Policy } from "./types";
import { connect } from "react-redux";
import { createStyles, Theme, withStyles } from "@material-ui/core/styles";
import {
  containerForHeader,
  modalBasic,
} from "../Common/FormComponents/common/styleLibrary";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import { Button, LinearProgress } from "@material-ui/core";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import TableWrapper from "../Common/TableWrapper/TableWrapper";
import api from "../../../common/api";
import PageHeader from "../Common/PageHeader/PageHeader";
import { Link } from "react-router-dom";
import { setErrorSnackMessage, setSnackBarMessage } from "../../../actions";
import CodeMirrorWrapper from "../Common/FormComponents/CodeMirrorWrapper/CodeMirrorWrapper";
import history from "../../../history";
import InputAdornment from "@material-ui/core/InputAdornment";
import SearchIcon from "@material-ui/icons/Search";
import {
  actionsTray,
  searchField,
} from "../Common/FormComponents/common/styleLibrary";
import TextField from "@material-ui/core/TextField";

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
  const [selectedTab, setSelectedTab] = useState<number>(0);
  const [policy, setPolicy] = useState<Policy | null>(null);
  const [userList, setUserList] = useState<string[]>([]);
  const [groupList, setGroupList] = useState<string[]>([]);
  const [addLoading, setAddLoading] = useState<boolean>(false);
  const [policyName, setPolicyName] = useState<string>(
    match.params["policyName"]
  );
  const [policyDefinition, setPolicyDefinition] = useState<string>("");
  const [loadingPolicy, setLoadingPolicy] = useState<boolean>(true);
  const [filterUsers, setFilterUsers] = useState<string>("");
  const [loadingUsers, setLoadingUsers] = useState<boolean>(true);
  const [filterGroups, setFilterGroups] = useState<string>("");
  const [loadingGroups, setLoadingGroups] = useState<boolean>(true);

  const saveRecord = (event: React.FormEvent) => {
    event.preventDefault();
    if (addLoading) {
      return;
    }
    setAddLoading(true);
    api
      .invoke("POST", "/api/v1/policies", {
        name: policyName,
        policy: policyDefinition,
      })
      .then((res) => {
        setAddLoading(false);
        setSnackBarMessage("Policy successfully updated")
      })
      .catch((err) => {
        setAddLoading(false);
        setErrorSnackMessage(err);
      });
  };

  useEffect(() => {
    const loadUsersForPolicy = () => {
      if (loadingUsers) {
        api
          .invoke("GET", `/api/v1/policies/${policyName}/users`)
          .then((result: any) => {
            setUserList(result);
            setLoadingUsers(false);
          })
          .catch((err) => {
            setErrorSnackMessage(err);
            setLoadingUsers(false);
          });
      }
    };
    const loadGroupsForPolicy = () => {
      if (loadingGroups) {
        api
          .invoke("GET", `/api/v1/policies/${policyName}/groups`)
          .then((result: any) => {
            setGroupList(result);
            setLoadingGroups(false);
          })
          .catch((err) => {
            setErrorSnackMessage(err);
            setLoadingGroups(false);
          });
      }
    };
    const loadPolicyDetails = () => {
      if (loadingPolicy) {
        api
          .invoke("GET", `/api/v1/policy?name=${policyName}`)
          .then((result: any) => {
            if (result) {
              setPolicy(result);
              setPolicyDefinition(
                result ? JSON.stringify(JSON.parse(result.policy), null, 4) : ""
              );
            }
            setLoadingPolicy(false);
          })
          .catch((err) => {
            setErrorSnackMessage(err);
            setLoadingPolicy(false);
          });
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
  ]);

  const resetForm = () => {
    setPolicyName("");
    setPolicyDefinition("");
  };

  const validSave = policyName.trim() !== "";

  const userViewAction = (user: any) => {
    history.push(`/users/${user}`);
  };
  const userTableActions = [{ type: "view", onClick: userViewAction }];

  const filteredUsers = userList.filter((elementItem) =>
    elementItem.includes(filterUsers)
  );

  const filteredGroups = groupList.filter((elementItem) =>
    elementItem.includes(filterGroups)
  );

  return (
    <React.Fragment>
      <PageHeader
        label={
          <Fragment>
            <Link to={"/policies"} className={classes.breadcrumLink}>
              Policy
            </Link>
            {` > ${match.params["policyName"]}`}
          </Fragment>
        }
      />
      <Grid item xs={12} className={classes.container}>
        <Grid item xs={12}>
          <Tabs
            value={selectedTab}
            indicatorColor="primary"
            textColor="primary"
            onChange={(_, newValue: number) => {
              setSelectedTab(newValue);
            }}
            aria-label="policy-tabs"
          >
            <Tab label="Details" />
            <Tab label="Users" />
            <Tab label="Groups" />
          </Tabs>
        </Grid>
        {selectedTab === 0 && (
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
                    label={`${policy ? "Edit" : "Write"} Policy`}
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

                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    disabled={addLoading || !validSave}
                  >
                    Save
                  </Button>
                </Grid>
                {addLoading && (
                  <Grid item xs={12}>
                    <LinearProgress />
                  </Grid>
                )}
              </Grid>
            </form>
          </Paper>
        )}
        {selectedTab === 1 && (
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
        )}
        {selectedTab === 2 && (
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
              />
            </Grid>
            <Grid item xs={12} className={classes.actionsTray}>
              <br />
            </Grid>
            <TableWrapper
              itemActions={[]}
              columns={[{ label: "Name", elementKey: "name" }]}
              isLoading={loadingGroups}
              records={filteredGroups}
              entityName="Groups"
              idField="name"
            />
          </Grid>
        )}
      </Grid>
    </React.Fragment>
  );
};

const connector = connect(null, {
  setErrorSnackMessage,
  setSnackBarMessage
});

export default withStyles(styles)(connector(PolicyDetails));
