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

import React, { useCallback, useEffect, useState } from "react";
import { connect } from "react-redux";
import { createStyles, Theme, withStyles } from "@material-ui/core/styles";
import api from "../../../common/api";
import { Button, Grid, InputAdornment, TextField } from "@material-ui/core";
import SearchIcon from "@material-ui/icons/Search";
import GroupIcon from "@material-ui/icons/Group";
import { User, UsersList } from "./types";
import { usersSort } from "../../../utils/sortFunctions";
import { CreateIcon } from "../../../icons";
import {
  actionsTray,
  containerForHeader,
  searchField,
} from "../Common/FormComponents/common/styleLibrary";
import { setErrorSnackMessage } from "../../../actions";
import AddUser from "./AddUser";
import DeleteUser from "./DeleteUser";
import AddToGroup from "./AddToGroup";
import TableWrapper from "../Common/TableWrapper/TableWrapper";
import SetPolicy from "../Policies/SetPolicy";
import PageHeader from "../Common/PageHeader/PageHeader";

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
    ...actionsTray,
    ...searchField,
    ...containerForHeader(theme.spacing(4)),
  });

interface IUsersProps {
  classes: any;
  setErrorSnackMessage: typeof setErrorSnackMessage;
}

const Users = ({ classes, setErrorSnackMessage }: IUsersProps) => {
  const [records, setRecords] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [addScreenOpen, setAddScreenOpen] = useState<boolean>(false);
  const [deleteOpen, setDeleteOpen] = useState<boolean>(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [addGroupOpen, setAddGroupOpen] = useState<boolean>(false);
  const [filter, setFilter] = useState<string>("");
  const [checkedUsers, setCheckedUsers] = useState<string[]>([]);
  const [policyOpen, setPolicyOpen] = useState<boolean>(false);

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

  const closeAddModalAndRefresh = () => {
    setAddScreenOpen(false);
    fetchRecords();
  };

  const closeDeleteModalAndRefresh = (refresh: boolean) => {
    setDeleteOpen(false);
    if (refresh) {
      fetchRecords();
    }
  };

  const closeAddGroupBulk = (unCheckAll: boolean = false) => {
    setAddGroupOpen(false);
    if (unCheckAll) {
      setCheckedUsers([]);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, [fetchRecords]);

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
    setAddScreenOpen(true);
    setSelectedUser(selectionElement);
  };

  const setPolicyAction = (selectionElement: any): void => {
    setPolicyOpen(true);
    setSelectedUser(selectionElement);
  };

  const deleteAction = (selectionElement: any): void => {
    setDeleteOpen(true);
    setSelectedUser(selectionElement);
  };

  const userLoggedIn = atob(localStorage.getItem("userLoggedIn") || "");

  const tableActions = [
    { type: "view", onClick: viewAction },
    { type: "description", onClick: setPolicyAction },
    {
      type: "delete",
      onClick: deleteAction,
      disableButtonFunction: (topValue: any) => topValue === userLoggedIn,
    },
  ];

  return (
    <React.Fragment>
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
            fetchRecords();
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
      <Grid container>
        <Grid item xs={12} className={classes.container}>
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
            />
            <Button
              variant="contained"
              color="primary"
              startIcon={<GroupIcon />}
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
              startIcon={<CreateIcon />}
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
            />
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

export default withStyles(styles)(connector(Users));
