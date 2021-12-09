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
import { Theme } from "@mui/material/styles";
import createStyles from "@mui/styles/createStyles";
import withStyles from "@mui/styles/withStyles";
import { LinearProgress } from "@mui/material";
import Grid from "@mui/material/Grid";
import { policySort } from "../../../utils/sortFunctions";
import {
  actionsTray,
  selectorsCommon,
  tableStyles,
} from "../Common/FormComponents/common/styleLibrary";
import { PolicyList } from "./types";
import { setModalErrorSnackMessage } from "../../../actions";
import { ErrorResponseHandler } from "../../../common/types";
import api from "../../../common/api";
import TableWrapper from "../Common/TableWrapper/TableWrapper";
import SearchBox from "../Common/SearchBox";

interface ISelectPolicyProps {
  classes: any;
  selectedPolicy?: string[];
  setSelectedPolicy: any;
  setModalErrorSnackMessage: typeof setModalErrorSnackMessage;
}

const styles = (theme: Theme) =>
  createStyles({
    noFound: {
      textAlign: "center",
      padding: "10px 0",
    },
    filterBox: {
      flex: 1,
    },
    searchField: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: ".9rem",
    },
    fieldLabel: {
      fontWeight: 600,
      width: 160,
      marginRight: 10,
    },
    tableBlock: {
      ...tableStyles.tableBlock,
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
        {loading && <LinearProgress />}
        {records.length > 0 ? (
          <React.Fragment>
            <Grid item xs={12} className={classes.searchField}>
              <span className={classes.fieldLabel}>Assign Policies</span>

              <div className={classes.filterBox}>
                <SearchBox
                  placeholder="Filter by Policy"
                  onChange={(value) => {
                    setFilter(value);
                  }}
                  overrideClass={classes.searchField}
                />
              </div>
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
      </Grid>
    </React.Fragment>
  );
};

const connector = connect(null, {
  setModalErrorSnackMessage,
});

export default withStyles(styles)(connector(PolicySelectors));
