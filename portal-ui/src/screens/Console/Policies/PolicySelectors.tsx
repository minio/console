// This file is part of MinIO Kubernetes Cloud
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
import { LinearProgress } from "@material-ui/core";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import InputAdornment from "@material-ui/core/InputAdornment";
import SearchIcon from "@material-ui/icons/Search";
import TextField from "@material-ui/core/TextField";
import { policySort } from "../../../utils/sortFunctions";
import {
  actionsTray,
  selectorsCommon,
} from "../Common/FormComponents/common/styleLibrary";
import { PolicyList } from "./types";
import { setModalErrorSnackMessage } from "../../../actions";
import { ErrorResponseHandler } from "../../../common/types";
import api from "../../../common/api";
import TableWrapper from "../Common/TableWrapper/TableWrapper";

interface ISelectPolicyProps {
  classes: any;
  selectedPolicy?: string[];
  setSelectedPolicy: any;
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

const PolicySelectors = ({
  classes,
  selectedPolicy = [],
  setSelectedPolicy,
  setModalErrorSnackMessage,
}: ISelectPolicyProps) => {
  // Local State
  const [records, setRecords] = useState<any[]>([]);
  const [loading, isLoading] = useState<boolean>(false);
  const [filter, setFilter] = useState<string>("");

  const fetchPolicies = useCallback(() => {
    isLoading(true);

    api
      .invoke("GET", `/api/v1/policies?limit=1000`)
      .then((res: PolicyList) => {
        const policies = res.policies === null ? [] : res.policies;
        isLoading(false);
        setRecords(policies.sort(policySort));
      })
      .catch((err: ErrorResponseHandler) => {
        isLoading(false);
        setModalErrorSnackMessage(err);
      });
  }, [setModalErrorSnackMessage]);

  //Effects
  useEffect(() => {
    isLoading(true);
  }, []);

  useEffect(() => {
    if (loading) {
      fetchPolicies();
    }
  }, [loading, fetchPolicies]);

  const selectionChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
    const targetD = e.target;
    const value = targetD.value;
    const checked = targetD.checked;

    let elements: string[] = [...selectedPolicy]; // We clone the checkedUsers array

    if (checked) {
      // If the user has checked this field we need to push this to checkedUsersList
      elements.push(value);
    } else {
      // User has unchecked this field, we need to remove it from the list
      elements = elements.filter((element) => element !== value);
    }
    // remove empty values
    elements = elements.filter((element) => element !== "");

    setSelectedPolicy(elements);
  };

  const filteredRecords = records.filter((elementItem) =>
    elementItem.name.includes(filter)
  );

  return (
    <React.Fragment>
      <Grid item xs={12}>
        <Paper className={classes.paper}>
          {loading && <LinearProgress />}
          {records.length > 0 ? (
            <React.Fragment>
              <Grid item xs={12} className={classes.actionsTray}>
                <span className={classes.actionsTitle}>Assign Policies</span>
                <TextField
                  placeholder="Filter by Policy"
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
                  columns={[{ label: "Policy", elementKey: "name" }]}
                  onSelect={selectionChanged}
                  selectedItems={selectedPolicy}
                  isLoading={loading}
                  records={filteredRecords}
                  entityName="Policies"
                  idField="name"
                  customPaperHeight={classes.multiSelectTable}
                />
              </Grid>
            </React.Fragment>
          ) : (
            <div className={classes.noFound}>No Policies Available</div>
          )}
        </Paper>
      </Grid>
    </React.Fragment>
  );
};

const connector = connect(null, {
  setModalErrorSnackMessage,
});

export default withStyles(styles)(connector(PolicySelectors));
