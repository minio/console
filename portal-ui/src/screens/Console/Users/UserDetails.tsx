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
import { Link } from "react-router-dom";

import { Theme } from "@mui/material/styles";
import createStyles from "@mui/styles/createStyles";
import withStyles from "@mui/styles/withStyles";
import { Button, Grid, Tooltip } from "@mui/material";
import {
  AddIcon,
  DeleteIcon,
  IAMPoliciesIcon,
  UsersIcon,
} from "../../../icons";
import {
  setErrorSnackMessage,
  setModalErrorSnackMessage,
} from "../../../actions";
import {
  actionsTray,
  containerForHeader,
  searchField,
} from "../Common/FormComponents/common/styleLibrary";
import { IPolicyItem } from "./types";
import { ErrorResponseHandler } from "../../../common/types";
import PageHeader from "../Common/PageHeader/PageHeader";
import api from "../../../common/api";
import TableWrapper from "../Common/TableWrapper/TableWrapper";
import ChangeUserGroups from "./ChangeUserGroups";
import SetUserPolicies from "./SetUserPolicies";
import history from "../../../history";
import UserServiceAccountsPanel from "./UserServiceAccountsPanel";
import ChangeUserPasswordModal from "../Account/ChangeUserPasswordModal";
import DeleteUserString from "./DeleteUserString";
import LockIcon from "@mui/icons-material/Lock";
import ScreenTitle from "../Common/ScreenTitle/ScreenTitle";
import BoxIconButton from "../Common/BoxIconButton/BoxIconButton";
import PanelTitle from "../Common/PanelTitle/PanelTitle";
import PageLayout from "../Common/Layout/PageLayout";
import VerticalTabs from "../Common/VerticalTabs/VerticalTabs";
import FormSwitchWrapper from "../Common/FormComponents/FormSwitchWrapper/FormSwitchWrapper";
import BackLink from "../../../common/BackLink";

const styles = (theme: Theme) =>
  createStyles({
    pageContainer: {
      border: "1px solid #EAEAEA",
    },
    statusLabel: {
      fontSize: ".8rem",
      marginRight: ".5rem",
    },
    statusValue: {
      fontWeight: "bold",
      fontSize: ".9rem",
      marginRight: ".5rem",
    },
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
    breadcrumLink: {
      textDecoration: "none",
      color: "black",
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

interface IGroupItem {
  group: string;
}

const UserDetails = ({ classes, match }: IUserDetailsProps) => {
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

  const userName = match.params["userName"];

  const changeUserPassword = () => {
    setChangeUserPasswordModalOpen(true);
  };

  const deleteUser = () => {
    setDeleteOpen(true);
  };

  const getUserInformation = useCallback(() => {
    if (userName === "") {
      return null;
    }
    setLoading(true);
    api
      .invoke("GET", `/api/v1/user?name=${encodeURIComponent(userName)}`)
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
        setHasPolicy(res.hasPolicy);
        setLoading(false);
      })
      .catch((err: ErrorResponseHandler) => {
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
      .invoke("PUT", `/api/v1/user?name=${encodeURIComponent(userName)}`, {
        status: isEnabled ? "enabled" : "disabled",
        groups: selectedGroups,
      })
      .then((_) => {
        setAddLoading(false);
      })
      .catch((err: ErrorResponseHandler) => {
        setAddLoading(false);
        setModalErrorSnackMessage(err);
      });
  };

  useEffect(() => {
    getUserInformation();
  }, [getUserInformation]);

  const closeDeleteModalAndRefresh = (refresh: boolean) => {
    setDeleteOpen(false);
    if (refresh) {
      getUserInformation();
    }
  };

  return (
    <React.Fragment>
      <PageHeader
        label={
          <Fragment>
            <Link to={"/users"} className={classes.breadcrumLink}>
              Users
            </Link>
          </Fragment>
        }
        actions={<React.Fragment></React.Fragment>}
      />
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
      <BackLink label={"Return to Users"} to={"/users"} />
      <PageLayout className={classes.pageContainer}>
        <Grid item xs={12}>
          <ScreenTitle
            icon={
              <Fragment>
                <UsersIcon width={40} />
              </Fragment>
            }
            title={userName}
            actions={
              <Fragment>
                <span className={classes.statusLabel}>User Status:</span>
                <span className={classes.statusValue}>
                  {enabled ? "Enabled" : "Disabled"}
                </span>
                <FormSwitchWrapper
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
                />

                <Tooltip title="Delete User">
                  <BoxIconButton
                    color="primary"
                    aria-label="Delete User"
                    onClick={deleteUser}
                    size="large"
                  >
                    <DeleteIcon />
                  </BoxIconButton>
                </Tooltip>
                <Tooltip title="Change Password">
                  <BoxIconButton
                    color="primary"
                    aria-label="Change Password"
                    onClick={changeUserPassword}
                    size="large"
                  >
                    <LockIcon />
                  </BoxIconButton>
                </Tooltip>
              </Fragment>
            }
          />
        </Grid>

        <Grid item xs={12}>
          <VerticalTabs>
            {{
              tabConfig: {
                label: "Groups",
              },
              content: (
                <React.Fragment>
                  <div className={classes.actionsTray}>
                    <PanelTitle>Groups</PanelTitle>
                    <Button
                      variant="contained"
                      color="primary"
                      endIcon={<AddIcon />}
                      size="medium"
                      onClick={() => {
                        setAddGroupOpen(true);
                      }}
                    >
                      Add to Groups
                    </Button>
                  </div>
                  <TableWrapper
                    // itemActions={userTableActions}
                    columns={[{ label: "Name", elementKey: "group" }]}
                    isLoading={loading}
                    records={currentGroups}
                    entityName="Groups"
                    idField="group"
                  />
                </React.Fragment>
              ),
            }}
            {{
              tabConfig: {
                label: "Service Accounts",
              },
              content: (
                <UserServiceAccountsPanel
                  user={userName}
                  classes={classes}
                  hasPolicy={hasPolicy}
                />
              ),
            }}
            {{
              tabConfig: {
                label: "Policies",
              },
              content: (
                <React.Fragment>
                  <div className={classes.actionsTray}>
                    <PanelTitle>Policies</PanelTitle>
                    <Button
                      variant="contained"
                      color="primary"
                      endIcon={<IAMPoliciesIcon />}
                      size="medium"
                      onClick={() => {
                        setPolicyOpen(true);
                      }}
                    >
                      Assign Policies
                    </Button>
                  </div>
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
                </React.Fragment>
              ),
            }}
          </VerticalTabs>
        </Grid>
      </PageLayout>
    </React.Fragment>
  );
};

const mapDispatchToProps = {
  setErrorSnackMessage,
};

const connector = connect(null, mapDispatchToProps);

export default withStyles(styles)(connector(UserDetails));
