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

import React, { useState, useEffect, useCallback } from "react";
import { connect } from "react-redux";
import { createStyles, Theme, withStyles } from "@material-ui/core/styles";
import { LinearProgress } from "@material-ui/core";
import get from "lodash/get";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import InputAdornment from "@material-ui/core/InputAdornment";
import { UsersList } from "../Users/types";
import { usersSort } from "../../../utils/sortFunctions";
import {
  actionsTray,
  selectorsCommon,
} from "../Common/FormComponents/common/styleLibrary";
import { setModalErrorSnackMessage } from "../../../actions";
import { ErrorResponseHandler } from "../../../common/types";
import api from "../../../common/api";
import TableWrapper from "../Common/TableWrapper/TableWrapper";
import SearchIcon from "../../../icons/SearchIcon";

interface IGroupsProps {
  classes: any;
  selectedUsers: string[];
  setSelectedUsers: any;
  editMode?: boolean;
  setModalErrorSnackMessage: typeof setModalErrorSnackMessage;
}

const styles = (theme: Theme) =>
  createStyles({
    seeMore: {
      marginTop: theme.spacing(3),
    },
    paper: {
      display: "flex",
      overflow: "auto",
      flexDirection: "column",
      paddingTop: 15,
      boxShadow: "none",
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
    noFound: {
      textAlign: "center",
      padding: "10px 0",
    },
    tableContainer: {
      maxHeight: 200,
    },
    stickyHeader: {
      backgroundColor: "#fff",
    },
    actionsTitle: {
      fontWeight: 600,
      color: "#000",
      fontSize: 16,
      alignSelf: "center",
    },
    tableBlock: {
      marginTop: 15,
    },
    filterField: {
      width: 375,
      fontWeight: 600,
      "& .input": {
        "&::placeholder": {
          fontWeight: 600,
          color: "#000",
        },
      },
    },
    ...actionsTray,
    ...selectorsCommon,
  });

const UsersSelectors = ({
  classes,
  selectedUsers,
  setSelectedUsers,
  editMode = false,
  setModalErrorSnackMessage,
}: IGroupsProps) => {
  //Local States
  const [records, setRecords] = useState<any[]>([]);
  const [loading, isLoading] = useState<boolean>(false);
  const [filter, setFilter] = useState<string>("");

  const fetchUsers = useCallback(() => {
    api
      .invoke("GET", `/api/v1/users`)
      .then((res: UsersList) => {
        let users = get(res, "users", []);

        if (!users) {
          users = [];
        }

        setRecords(users.sort(usersSort));
        isLoading(false);
      })
      .catch((err: ErrorResponseHandler) => {
        setModalErrorSnackMessage(err);
        isLoading(false);
      });
  }, [setModalErrorSnackMessage]);

  //Effects
  useEffect(() => {
    isLoading(true);
  }, []);

  useEffect(() => {
    if (loading) {
      fetchUsers();
    }
  }, [loading, fetchUsers]);

  const selUsers = !selectedUsers ? [] : selectedUsers;

  //Fetch Actions
  const selectionChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
    const targetD = e.target;
    const value = targetD.value;
    const checked = targetD.checked;

    let elements: string[] = [...selUsers]; // We clone the selectedGroups array

    if (checked) {
      // If the user has checked this field we need to push this to selectedGroupsList
      elements.push(value);
    } else {
      // User has unchecked this field, we need to remove it from the list
      elements = elements.filter((element) => element !== value);
    }
    setSelectedUsers(elements);

    return elements;
  };

  const filteredRecords = records.filter((elementItem) =>
    elementItem.accessKey.includes(filter)
  );

  return (
    <React.Fragment>
      <Grid item xs={12}>
        <Paper className={classes.paper}>
          {loading && <LinearProgress />}
          {records != null && records.length > 0 ? (
            <React.Fragment>
              <Grid item xs={12} className={classes.actionsTray}>
                <span className={classes.actionsTitle}>
                  {editMode ? "Edit Members" : "Assign Users"}
                </span>
                <TextField
                  placeholder="Filter Users"
                  className={classes.filterField}
                  id="search-resource"
                  label=""
                  InputProps={{
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
              </Grid>
              <Grid item xs={12} className={classes.tableBlock}>
                <TableWrapper
                  columns={[{ label: "Access Key", elementKey: "accessKey" }]}
                  onSelect={selectionChanged}
                  selectedItems={selUsers}
                  isLoading={loading}
                  records={filteredRecords}
                  entityName="Users"
                  idField="accessKey"
                  customPaperHeight={classes.multiSelectTable}
                />
              </Grid>
            </React.Fragment>
          ) : (
            <div className={classes.noFound}>No Users Available</div>
          )}
        </Paper>
      </Grid>
    </React.Fragment>
  );
};

const mapDispatchToProps = {
  setModalErrorSnackMessage,
};

const connector = connect(null, mapDispatchToProps);

export default withStyles(styles)(connector(UsersSelectors));
