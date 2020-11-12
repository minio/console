// This file is part of MinIO Kubernetes Cloud
// Copyright (c) 2020 MinIO, Inc.
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

import React, { useEffect, useState } from "react";
import { createStyles, Theme, withStyles } from "@material-ui/core/styles";
import { LinearProgress } from "@material-ui/core";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import InputAdornment from "@material-ui/core/InputAdornment";
import SearchIcon from "@material-ui/icons/Search";
import TextField from "@material-ui/core/TextField";
import api from "../../../common/api";
import { stringSort } from "../../../utils/sortFunctions";
import { GroupsList } from "../Groups/types";
import get from "lodash/get";
import TableWrapper from "../Common/TableWrapper/TableWrapper";
import {
  actionsTray,
  selectorsCommon,
} from "../Common/FormComponents/common/styleLibrary";

interface IGroupsProps {
  classes: any;
  selectedGroups: string[];
  setSelectedGroups: any;
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
    errorBlock: {
      color: "red",
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

const GroupsSelectors = ({
  classes,
  selectedGroups,
  setSelectedGroups,
}: IGroupsProps) => {
  // Local State
  const [records, setRecords] = useState<any[]>([]);
  const [loading, isLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [filter, setFilter] = useState<string>("");

  //Effects
  useEffect(() => {
    isLoading(true);
  }, []);

  useEffect(() => {
    if (loading) {
      fetchGroups();
    }
  }, [loading]);

  const selGroups = !selectedGroups ? [] : selectedGroups;

  const fetchGroups = () => {
    api
      .invoke("GET", `/api/v1/groups`)
      .then((res: GroupsList) => {
        let groups = get(res, "groups", []);

        if (!groups) {
          groups = [];
        }
        setRecords(groups.sort(stringSort));
        setError("");
        isLoading(false);
      })
      .catch((err) => {
        setError(err);
        isLoading(false);
      });
  };

  const selectionChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
    const targetD = e.target;
    const value = targetD.value;
    const checked = targetD.checked;

    let elements: string[] = [...selGroups]; // We clone the selectedGroups array

    if (checked) {
      // If the user has checked this field we need to push this to selectedGroupsList
      elements.push(value);
    } else {
      // User has unchecked this field, we need to remove it from the list
      elements = elements.filter((element) => element !== value);
    }
    setSelectedGroups(elements);

    return elements;
  };

  const filteredRecords = records.filter((elementItem) =>
    elementItem.includes(filter)
  );

  return (
    <React.Fragment>
      <Grid item xs={12}>
        <Paper className={classes.paper}>
          {loading && <LinearProgress />}
          {error !== "" && <div>{error}</div>}
          {records != null && records.length > 0 ? (
            <React.Fragment>
              <Grid item xs={12} className={classes.actionsTray}>
                <span className={classes.actionsTitle}>Assign Groups</span>
                <TextField
                  placeholder="Filter by Group"
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
                  columns={[{ label: "Group", elementKey: "" }]}
                  onSelect={selectionChanged}
                  selectedItems={selGroups}
                  isLoading={loading}
                  records={filteredRecords}
                  entityName="Groups"
                  idField=""
                  customPaperHeight={classes.multiSelectTable}
                />
              </Grid>
            </React.Fragment>
          ) : (
            <div className={classes.noFound}>No Groups Available</div>
          )}
        </Paper>
      </Grid>
    </React.Fragment>
  );
};

export default withStyles(styles)(GroupsSelectors);
