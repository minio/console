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
import {
  Button,
  Grid,
  InputAdornment,
  LinearProgress,
  TextField,
} from "@mui/material";
import GroupIcon from "@mui/icons-material/Group";
import { User, UsersList } from "./types";
import { usersSort } from "../../../utils/sortFunctions";
import { AddIcon, UsersIcon } from "../../../icons";
import {
  actionsTray,
  containerForHeader,
  searchField,
} from "../Common/FormComponents/common/styleLibrary";
import { setErrorSnackMessage } from "../../../actions";
import { ErrorResponseHandler } from "../../../common/types";
import AddUser from "./AddUser";
import DeleteUser from "./DeleteUser";
import AddToGroup from "./BulkAddToGroup";
import TableWrapper from "../Common/TableWrapper/TableWrapper";
import SetPolicy from "../Policies/SetPolicy";
import PageHeader from "../Common/PageHeader/PageHeader";
import SearchIcon from "../../../icons/SearchIcon";
import { decodeFileName } from "../../../common/utils";
import HelpBox from "../../../common/HelpBox";
import AButton from "../Common/AButton";

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
    twHeight: {
      minHeight: 600,
    },
    ...actionsTray,
    ...searchField,
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
  const [addScreenOpen, setAddScreenOpen] = useState<boolean>(false);
  const [deleteOpen, setDeleteOpen] = useState<boolean>(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [addGroupOpen, setAddGroupOpen] = useState<boolean>(false);
  const [filter, setFilter] = useState<string>("");
  const [checkedUsers, setCheckedUsers] = useState<string[]>([]);
  const [policyOpen, setPolicyOpen] = useState<boolean>(false);

  const closeAddModalAndRefresh = () => {
    setAddScreenOpen(false);
    setLoading(true);
  };

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
    }
  }, [loading, setErrorSnackMessage]);

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
    history.push(`/users/${encodeURI(selectionElement.accessKey)}`);
  };

  const deleteAction = (selectionElement: any): void => {
    setDeleteOpen(true);
    setSelectedUser(selectionElement);
  };

  const userLoggedIn = decodeFileName(
    localStorage.getItem("userLoggedIn") || ""
  );

  const tableActions = [
    { type: "view", onClick: viewAction },
    {
      type: "delete",
      onClick: deleteAction,
      disableButtonFunction: (topValue: any) => topValue === userLoggedIn,
    },
  ];

  return (
    <Fragment>
      {addScreenOpen && (
        <AddUser
          open={addScreenOpen}
          selectedUser={selectedUser}
          closeModalAndRefresh={() => {
            closeAddModalAndRefresh();
          }}
        />
      )}
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
      <Grid container className={classes.container}>
        <Grid item xs={12} className={classes.actionsTray}>
          <TextField
            placeholder="Search Users"
            className={classes.searchField}
            id="search-resource"
            label=""
            InputProps={{
              disableUnderline: true,
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            onChange={(e) => {
              setFilter(e.target.value);
            }}
            variant="standard"
          />
          <Button
            variant="outlined"
            color="primary"
            endIcon={<GroupIcon />}
            disabled={checkedUsers.length <= 0}
            onClick={() => {
              if (checkedUsers.length > 0) {
                setAddGroupOpen(true);
              }
            }}
          >
            Add to Group
          </Button>
          <Button
            variant="contained"
            color="primary"
            endIcon={<AddIcon />}
            onClick={() => {
              setAddScreenOpen(true);
              setSelectedUser(null);
            }}
          >
            Create User
          </Button>
        </Grid>

        <Grid item xs={12}>
          <br />
        </Grid>
        {loading && <LinearProgress />}
        {!loading && (
          <Fragment>
            {records.length > 0 && (
              <Fragment>
                <Grid item xs={12}>
                  <TableWrapper
                    itemActions={tableActions}
                    columns={[{ label: "Access Key", elementKey: "accessKey" }]}
                    onSelect={selectionChanged}
                    selectedItems={checkedUsers}
                    isLoading={loading}
                    records={filteredRecords}
                    entityName="Users"
                    idField="accessKey"
                    customPaperHeight={classes.twHeight}
                  />
                </Grid>
                <Grid item xs={12}>
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
                        <br />
                        <br />
                        To get started,{" "}
                        <AButton
                          onClick={() => {
                            setAddScreenOpen(true);
                            setSelectedUser(null);
                          }}
                        >
                          Create a User
                        </AButton>
                        .
                      </Fragment>
                    }
                  />
                </Grid>
              </Grid>
            )}
          </Fragment>
        )}
      </Grid>
    </Fragment>
  );
};

const mapDispatchToProps = {
  setErrorSnackMessage,
};

const connector = connect(null, mapDispatchToProps);

export default withStyles(styles)(connector(ListUsers));
