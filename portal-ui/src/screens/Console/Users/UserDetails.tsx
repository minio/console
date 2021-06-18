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
import { connect } from "react-redux";
import { createStyles, Theme, withStyles } from "@material-ui/core/styles";
import { Button, Grid, IconButton, Menu, MenuItem } from "@material-ui/core";
import PageHeader from "../Common/PageHeader/PageHeader";
import { CreateIcon } from "../../../icons";
import {
  setErrorSnackMessage,
  setModalErrorSnackMessage,
} from "../../../actions";
import {
  actionsTray,
  containerForHeader,
  searchField,
} from "../Common/FormComponents/common/styleLibrary";
import { IPolicyItem, User, UsersList } from "./types";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import { TabPanel } from "../../shared/tabs";
import Paper from "@material-ui/core/Paper";
import api from "../../../common/api";
import FormSwitchWrapper from "../Common/FormComponents/FormSwitchWrapper/FormSwitchWrapper";
import TableWrapper from "../Common/TableWrapper/TableWrapper";
import ChangeUserGroups from "./ChangeUserGroups";
import SetUserPolicies from "./SetUserPolicies";
import { Bookmark } from "@material-ui/icons";
import history from "../../../history";
import UserServiceAccountsPanel from "./UserServiceAccountsPanel";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import ChangeUserPasswordModal from "../Account/ChangeUserPasswordModal";
import DeleteUserString from "./DeleteUserString";
import DeleteUser from "./DeleteUser";
import { usersSort } from "../../../utils/sortFunctions";

const styles = (theme: Theme) =>
  createStyles({
    seeMore: {
      marginTop: theme.spacing(3),
    },
    paper: {
      // padding: theme.spacing(2),
      display: "flex",
      overflow: "auto",
      flexDirection: "column",
    },
    addSideBar: {
      width: "320px",
      padding: "20px",
    },
    tableToolbar: {
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(0),
    },
    wrapCell: {
      maxWidth: "200px",
      whiteSpace: "normal",
      wordWrap: "break-word",
    },
    minTableHeader: {
      color: "#393939",
      "& tr": {
        "& th": {
          fontWeight: "bold",
        },
      },
    },
    fixedHeight: {
      height: 165,
      minWidth: 247,
      padding: "25px 28px",
      "& svg": {
        maxHeight: 18,
      },
    },
    paperContainer: {
      padding: 15,
      paddingLeft: 50,
      display: "flex",
    },
    gridContainer: {
      display: "grid",
      gridTemplateColumns: "auto auto",
      gridGap: 8,
      justifyContent: "flex-start",
      alignItems: "center",
      "& div:not(.MuiCircularProgress-root)": {
        display: "flex",
        alignItems: "center",
      },
      "& div:nth-child(odd)": {
        justifyContent: "flex-end",
        fontWeight: 700,
      },
      "& div:nth-child(2n)": {
        minWidth: 150,
      },
    },
    ...actionsTray,
    ...searchField,
    ...containerForHeader(theme.spacing(4)),
  });

interface IUserDetailsProps {
  classes: any;
  match: any;
  setErrorSnackMessage: typeof setErrorSnackMessage;
}

function a11yProps(index: any) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

interface IGroupItem {
  group: string;
}

const UserDetails = ({ classes, match }: IUserDetailsProps) => {
  const [curTab, setCurTab] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [addGroupOpen, setAddGroupOpen] = useState<boolean>(false);
  const [policyOpen, setPolicyOpen] = useState<boolean>(false);
  const [addLoading, setAddLoading] = useState<boolean>(false);
  const [records, setRecords] = useState<User[]>([]);

  const [enabled, setEnabled] = useState<boolean>(false);
  const [selectedGroups, setSelectedGroups] = useState<string[]>([]);
  const [currentGroups, setCurrentGroups] = useState<IGroupItem[]>([]);
  const [currentPolicies, setCurrentPolicies] = useState<IPolicyItem[]>([]);
  const [changeUserPasswordModalOpen, setChangeUserPasswordModalOpen] =
    useState<boolean>(false);
  const [deleteOpen, setDeleteOpen] = useState<boolean>(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const userName = match.params["userName"];

  const changeUserPassword = () => {
    setAnchorEl(null);
    setChangeUserPasswordModalOpen(true);
  };

  const deleteUser = () => {
    setAnchorEl(null);
    setDeleteOpen(true);
  };

  const getUserInformation = useCallback(() => {
    if (userName === "") {
      return null;
    }
    setLoading(true);
    api
      .invoke("GET", `/api/v1/users/${userName}`)
      .then((res) => {
        setAddLoading(false);
        const memberOf = res.memberOf || [];
        setSelectedGroups(memberOf);
        let currentGroups: IGroupItem[] = [];
        for (let group of memberOf) {
          currentGroups.push({
            group: group,
          });
        }
        setCurrentGroups(currentGroups);
        let currentPolicies: IPolicyItem[] = [];
        for (let policy of res.policy) {
          currentPolicies.push({
            policy: policy,
          });
        }
        setCurrentPolicies(currentPolicies);
        setEnabled(res.status === "enabled");
        setSelectedUser(res.user);
        setLoading(false);
      })
      .catch((err) => {
        setAddLoading(false);
        setLoading(false);
        setModalErrorSnackMessage(err);
      });
  }, [userName]);

  const saveRecord = (isEnabled: boolean) => {
    if (addLoading) {
      return;
    }
    setAddLoading(true);
    api
      .invoke("PUT", `/api/v1/users/${userName}`, {
        status: isEnabled ? "enabled" : "disabled",
        groups: selectedGroups,
      })
      .then((_) => {
        setAddLoading(false);
      })
      .catch((err) => {
        setAddLoading(false);
        setModalErrorSnackMessage(err);
      });
  };

  const fetchRecords = useCallback(() => {
    setLoading(true);
    api
      .invoke("GET", `/api/v1/users`)
      .then((res: UsersList) => {
        const users = res.users === null ? [] : res.users;

        setLoading(false);
        setRecords(users.sort(usersSort));
      })
      .catch((err) => {
        setLoading(false);
        setErrorSnackMessage(err);
      });
  }, [setLoading, setRecords, setErrorSnackMessage]);

  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleUserMenu = (event: any) => {
    setAnchorEl(event.currentTarget);
  };

  useEffect(() => {
    getUserInformation();
  }, [getUserInformation]);

  const userLoggedIn = atob(localStorage.getItem("userLoggedIn") || "");

  const closeDeleteModalAndRefresh = (refresh: boolean) => {
    setDeleteOpen(false);
    if (refresh) {
      fetchRecords();
    }
  };

  return (
    <React.Fragment>
      <PageHeader label={`User: ${userName}`} />
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
        <DeleteUserString
          deleteOpen={deleteOpen}
          userName={userName}
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

      <Grid container>
        <Grid item xs={12} className={classes.container}>
          <Grid item xs={12}>
            <Grid container spacing={2}>
              <Grid item>
                <Paper className={classes.paperContainer}>
                  <div className={classes.gridContainer}>
                    <div>Enabled:</div>
                    <div className={classes.capitalizeFirst}>
                      <FormSwitchWrapper
                        checked={enabled}
                        value={"user_enabled"}
                        id="user-status"
                        name="user-status"
                        disabled={userLoggedIn === userName}
                        onChange={(e) => {
                          setEnabled(e.target.checked);
                          saveRecord(e.target.checked);
                        }}
                        switchOnly
                      />
                    </div>
                  </div>
                  <Fragment>
                    <IconButton
                      aria-label="more"
                      aria-controls="long-menu"
                      aria-haspopup="true"
                      onClick={handleUserMenu}
                    >
                      <MoreVertIcon />
                    </IconButton>
                    <Menu
                      id="long-menu"
                      anchorEl={anchorEl}
                      keepMounted
                      open={Boolean(anchorEl)}
                    >
                      <MenuItem
                        key="changeUserPassword"
                        onClick={changeUserPassword}
                      >
                        Change User Password
                      </MenuItem>
                      <MenuItem key="deleteUser" onClick={deleteUser}>
                        Delete User
                      </MenuItem>
                    </Menu>
                  </Fragment>
                </Paper>
              </Grid>
            </Grid>
          </Grid>
          <h1>{selectedUser != null && selectedUser.id}</h1>
          <Grid item xs={12}>
            <br />
          </Grid>
          <Grid container item xs={12}>
            <Grid item xs={9}>
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
                <Tab label="Groups" {...a11yProps(0)} />
                <Tab label="Service Accounts" {...a11yProps(2)} />
                <Tab label="Policies" {...a11yProps(1)} />
              </Tabs>
            </Grid>
            <Grid item xs={3} className={classes.actionsTray}>
              {curTab === 0 && (
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<CreateIcon />}
                  size="medium"
                  onClick={() => {
                    setAddGroupOpen(true);
                  }}
                >
                  Add to Groups
                </Button>
              )}
              {curTab === 2 && (
                <Fragment>
                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={<Bookmark />}
                    size="medium"
                    onClick={() => {
                      setPolicyOpen(true);
                    }}
                  >
                    Assign Policies
                  </Button>
                </Fragment>
              )}
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <TabPanel index={0} value={curTab}>
              <TableWrapper
                // itemActions={userTableActions}
                columns={[{ label: "Name", elementKey: "group" }]}
                isLoading={loading}
                records={currentGroups}
                entityName="Groups"
                idField="group"
              />
            </TabPanel>
            <TabPanel index={1} value={curTab}>
              <UserServiceAccountsPanel user={userName} />
            </TabPanel>
            <TabPanel index={2} value={curTab}>
              <TableWrapper
                itemActions={[
                  {
                    type: "view",
                    onClick: (policy: IPolicyItem) => {
                      history.push(`/policies/${policy.policy}`);
                    },
                  },
                ]}
                columns={[{ label: "Name", elementKey: "policy" }]}
                isLoading={loading}
                records={currentPolicies}
                entityName="Policies"
                idField="policy"
              />
            </TabPanel>
          </Grid>
        </Grid>
      </Grid>
    </React.Fragment>
  );
};

const mapDispatchToProps = {
  setErrorSnackMessage,
};

const connector = connect(null, mapDispatchToProps);

export default withStyles(styles)(connector(UserDetails));
