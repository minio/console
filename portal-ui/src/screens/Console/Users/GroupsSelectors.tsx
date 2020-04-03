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

import React from "react";
import { createStyles, Theme, withStyles } from "@material-ui/core/styles";
import { LinearProgress } from "@material-ui/core";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import Title from "../../../common/Title";
import InputAdornment from "@material-ui/core/InputAdornment";
import SearchIcon from "@material-ui/icons/Search";
import TextField from "@material-ui/core/TextField";
import Checkbox from "@material-ui/core/Checkbox";

interface IGroupsProps {
  classes: any;
  selectedGroups: string[];
  setSelectedGroups: any;
  records: any[];
  loading: boolean;
}

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
      textAlign: "left",
      "& button": {
        marginLeft: 10
      }
    },
    filterField: {
      background: "#FFFFFF",
      padding: 12,
      borderRadius: 5,
      boxShadow: "0px 3px 6px #00000012",
      width: "100%"
    },
    noFound: {
      textAlign: "center",
      padding: "10px 0"
    }
  });

const GroupsSelectors = ({
  classes,
  selectedGroups,
  setSelectedGroups,
  records,
  loading
}: IGroupsProps) => {
  if (!records) {
    return null;
  }

  const selectionChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
    const targetD = e.target;
    const value = targetD.value;
    const checked = targetD.checked;

    let elements: string[] = [...selectedGroups]; // We clone the selectedGroups array

    if (checked) {
      // If the user has checked this field we need to push this to selectedGroupsList
      elements.push(value);
    } else {
      // User has unchecked this field, we need to remove it from the list
      elements = elements.filter(element => element !== value);
    }
    setSelectedGroups(elements);

    return elements;
  };

  return (
    <React.Fragment>
      <Title>Groups</Title>
      <Grid item xs={12}>
        <Paper className={classes.paper}>
          {loading && <LinearProgress />}
          {records != null && records.length > 0 ? (
            <React.Fragment>
              <Grid item xs={12} className={classes.actionsTray}>
                <TextField
                  placeholder="Filter Groups"
                  className={classes.filterField}
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
                />
              </Grid>
              <Table size="medium">
                <TableHead className={classes.minTableHeader}>
                  <TableRow>
                    <TableCell>Select</TableCell>
                    <TableCell>Group</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {records.map(row => (
                    <TableRow key={`group-${row.groupName}`}>
                      <TableCell padding="checkbox">
                        <Checkbox
                          value={row.groupName}
                          color="primary"
                          inputProps={{
                            "aria-label": "secondary checkbox"
                          }}
                          onChange={selectionChanged}
                          checked={selectedGroups.includes(row.groupName)}
                        />
                      </TableCell>
                      <TableCell className={classes.wrapCell}>
                        {row.groupName}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
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
