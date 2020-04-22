// This file is part of MinIO Console Server
// Copyright (c) 2019 MinIO, Inc.
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

import React from "react";
import { createStyles, Theme, withStyles } from "@material-ui/core/styles";
import api from "../../../common/api";
import {
  Button,
  Grid,
  Typography,
  TextField,
  InputAdornment
} from "@material-ui/core";
import SearchIcon from "@material-ui/icons/Search";
import GroupIcon from "@material-ui/icons/Group";
import { User, UsersList } from "./types";
import { usersSort } from "../../../utils/sortFunctions";
import { MinTablePaginationActions } from "../../../common/MinTablePaginationActions";
import { CreateIcon } from "../../../icons";
import AddUser from "./AddUser";
import DeleteUser from "./DeleteUser";
import AddToGroup from "./AddToGroup";
import TableWrapper from "../Common/TableWrapper/TableWrapper";

const styles = (theme: Theme) =>
  createStyles({
    seeMore: {
      marginTop: theme.spacing(3)
    },
    paper: {
      // padding: theme.spacing(2),
      display: "flex",
      overflow: "auto",
      flexDirection: "column"
    },
    addSideBar: {
      width: "320px",
      padding: "20px"
    },
    errorBlock: {
      color: "red"
    },
    tableToolbar: {
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(0)
    },
    wrapCell: {
      maxWidth: "200px",
      whiteSpace: "normal",
      wordWrap: "break-word"
    },
    minTableHeader: {
      color: "#393939",
      "& tr": {
        "& th": {
          fontWeight: "bold"
        }
      }
    },
    actionsTray: {
      textAlign: "right",
      "& button": {
        marginLeft: 10
      }
    },
    searchField: {
      background: "#FFFFFF",
      padding: 12,
      borderRadius: 5,
      boxShadow: "0px 3px 6px #00000012"
    }
  });

interface IUsersProps {
  classes: any;
}

interface IUsersState {
  records: User[];
  totalRecords: number;
  loading: boolean;
  error: string;
  deleteError: string;
  addScreenOpen: boolean;
  page: number;
  rowsPerPage: number;
  deleteOpen: boolean;
  selectedUser: User | null;
  addGroupOpen: boolean;
  filter: string;
  checkedUsers: string[];
}

class Users extends React.Component<IUsersProps, IUsersState> {
  state: IUsersState = {
    records: [],
    totalRecords: 0,
    loading: false,
    error: "",
    deleteError: "",
    addScreenOpen: false,
    page: 0,
    rowsPerPage: 10,
    deleteOpen: false,
    selectedUser: null,
    addGroupOpen: false,
    filter: "",
    checkedUsers: []
  };

  fetchRecords() {
    this.setState({ loading: true }, () => {
      const { page, rowsPerPage } = this.state;
      const offset = page * rowsPerPage;
      api
        .invoke("GET", `/api/v1/users?offset=${offset}&limit=${rowsPerPage}`)
        .then((res: UsersList) => {
          const users = res.users === null ? [] : res.users;
          this.setState({
            loading: false,
            records: users.sort(usersSort),
            totalRecords: users.length,
            error: ""
          });
          // if we get 0 results, and page > 0 , go down 1 page
          if ((!users || users.length === 0) && page > 0) {
            const newPage = page - 1;
            this.setState({ page: newPage }, () => {
              this.fetchRecords();
            });
          }
        })
        .catch(err => {
          this.setState({ loading: false, error: err });
        });
    });
  }

  closeAddModalAndRefresh() {
    this.setState({ addScreenOpen: false }, () => {
      this.fetchRecords();
    });
  }

  closeDeleteModalAndRefresh(refresh: boolean) {
    this.setState({ deleteOpen: false }, () => {
      if (refresh) {
        this.fetchRecords();
      }
    });
  }

  closeAddGroupBulk(unCheckAll: boolean = false) {
    let newStates = { addGroupOpen: false };
    let addUsers = {};

    if (unCheckAll) {
      addUsers = { checkedUsers: [] };
    }

    this.setState({ ...newStates, ...addUsers });
  }

  componentDidMount(): void {
    this.fetchRecords();
  }

  render() {
    const { classes } = this.props;
    const {
      records,
      totalRecords,
      addScreenOpen,
      loading,
      page,
      rowsPerPage,
      deleteOpen,
      selectedUser,
      filter,
      checkedUsers,
      addGroupOpen
    } = this.state;

    const handleChangePage = (event: unknown, newPage: number) => {
      this.setState({ page: newPage }, () => {
        this.fetchRecords();
      });
    };

    const handleChangeRowsPerPage = (
      event: React.ChangeEvent<HTMLInputElement>
    ) => {
      const rPP = parseInt(event.target.value, 10);
      this.setState({ page: 0, rowsPerPage: rPP }, () => {
        this.fetchRecords();
      });
    };

    const filteredRecords = records.filter(elementItem =>
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
        elements = elements.filter(element => element !== value);
      }

      this.setState({
        checkedUsers: elements
      });

      return elements;
    };

    const viewAction = (selectionElement: any): void => {
      this.setState({
        addScreenOpen: true,
        selectedUser: selectionElement
      });
    };

    const deleteAction = (selectionElement: any): void => {
      this.setState({
        deleteOpen: true,
        selectedUser: selectionElement
      });
    };

    const tableActions = [
      { type: "view", onClick: viewAction },
      { type: "delete", onClick: deleteAction }
    ];

    return (
      <React.Fragment>
        {addScreenOpen && (
          <AddUser
            open={addScreenOpen}
            selectedUser={selectedUser}
            closeModalAndRefresh={() => {
              this.closeAddModalAndRefresh();
            }}
          />
        )}
        {deleteOpen && (
          <DeleteUser
            deleteOpen={deleteOpen}
            selectedUser={selectedUser}
            closeDeleteModalAndRefresh={(refresh: boolean) => {
              this.closeDeleteModalAndRefresh(refresh);
            }}
          />
        )}
        {addGroupOpen && (
          <AddToGroup
            open={addGroupOpen}
            checkedUsers={checkedUsers}
            closeModalAndRefresh={(close: boolean) => {
              this.closeAddGroupBulk(close);
            }}
          />
        )}

        <Grid container>
          <Grid item xs={12}>
            <Typography variant="h6">Users</Typography>
          </Grid>
          <Grid item xs={12}>
            <br />
          </Grid>
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
                )
              }}
              onChange={e => {
                this.setState({ filter: e.target.value });
              }}
            />
            <Button
              variant="contained"
              color="primary"
              startIcon={<GroupIcon />}
              disabled={checkedUsers.length <= 0}
              onClick={() => {
                if (checkedUsers.length > 0) {
                  this.setState({
                    addGroupOpen: true
                  });
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
                this.setState({
                  addScreenOpen: true,
                  selectedUser: null
                });
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
              paginatorConfig={{
                rowsPerPageOptions: [5, 10, 25],
                colSpan: 3,
                count: totalRecords,
                rowsPerPage: rowsPerPage,
                page: page,
                SelectProps: {
                  inputProps: { "aria-label": "rows per page" },
                  native: true
                },
                onChangePage: handleChangePage,
                onChangeRowsPerPage: handleChangeRowsPerPage,
                ActionsComponent: MinTablePaginationActions
              }}
            />
          </Grid>
        </Grid>
      </React.Fragment>
    );
  }
}

export default withStyles(styles)(Users);
