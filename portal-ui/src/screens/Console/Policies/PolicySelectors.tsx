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

import { Theme } from "@mui/material/styles";
import createStyles from "@mui/styles/createStyles";
import withStyles from "@mui/styles/withStyles";
import { LinearProgress } from "@mui/material";
import Grid from "@mui/material/Grid";
import { policySort } from "../../../utils/sortFunctions";
import {
  actionsTray,
  searchField,
  selectorsCommon,
  tableStyles,
} from "../Common/FormComponents/common/styleLibrary";

import { ErrorResponseHandler } from "../../../common/types";
import TableWrapper from "../Common/TableWrapper/TableWrapper";
import SearchBox from "../Common/SearchBox";
import { setModalErrorSnackMessage } from "../../../systemSlice";
import { AppState, useAppDispatch } from "../../../store";
import { setSelectedPolicies } from "../Users/AddUsersSlice";
import { useSelector } from "react-redux";
import { api } from "../../../api";
import {
  HttpResponse,
  ListPoliciesResponse,
  Error,
} from "../../../api/consoleApi";

interface ISelectPolicyProps {
  classes: any;
  selectedPolicy?: string[];
  noTitle?: boolean;
}

const styles = (theme: Theme) =>
  createStyles({
    noFound: {
      textAlign: "center",
      padding: "10px 0",
    },
    searchBox: {
      flex: 1,
    },
    fieldLabel: {
      fontWeight: 400,
      width: 160,
      marginRight: 10,
    },
    tableBlock: {
      ...tableStyles.tableBlock,
    },
    filterBox: {
      display: "flex",
      marginBottom: 15,
      alignItems: "center",
      "& span": {
        fontSize: 14,
      },
    },
    ...searchField,
    ...tableStyles,
    ...actionsTray,
    ...selectorsCommon,
  });

const PolicySelectors = ({ classes, noTitle = false }: ISelectPolicyProps) => {
  const dispatch = useAppDispatch();
  // Local State
  const [records, setRecords] = useState<any[]>([]);
  const [loading, isLoading] = useState<boolean>(false);
  const [filter, setFilter] = useState<string>("");

  const currentPolicies = useSelector(
    (state: AppState) => state.createUser.selectedPolicies
  );

  const fetchPolicies = useCallback(() => {
    isLoading(true);

    api.policies
      .listPolicies()
      .then((res: HttpResponse<ListPoliciesResponse, Error>) => {
        const policies = res.data.policies ?? [];
        isLoading(false);
        setRecords(policies.sort(policySort));
      })
      .catch((err: ErrorResponseHandler) => {
        isLoading(false);
        dispatch(setModalErrorSnackMessage(err));
      });
  }, [dispatch]);

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

    let elements: string[] = [...currentPolicies]; // We clone the checkedUsers array

    if (checked) {
      // If the user has checked this field we need to push this to checkedUsersList
      elements.push(value);
    } else {
      // User has unchecked this field, we need to remove it from the list
      elements = elements.filter((element) => element !== value);
    }
    // remove empty values
    elements = elements.filter((element) => element !== "");

    dispatch(setSelectedPolicies(elements));
  };

  const filteredRecords = records.filter((elementItem) =>
    elementItem.name.includes(filter)
  );

  return (
    <Grid container>
      <Grid item xs={12}>
        {loading && <LinearProgress />}
        {records.length > 0 ? (
          <React.Fragment>
            <Grid item xs={12} className={classes.filterBox}>
              {!noTitle && (
                <span className={classes.fieldLabel}>Assign Policies</span>
              )}
              <div className={classes.searchBox}>
                <SearchBox
                  placeholder="Start typing to search for a Policy"
                  onChange={(value) => {
                    setFilter(value);
                  }}
                  value={filter}
                />
              </div>
            </Grid>
            <Grid
              item
              xs={12}
              className={classes.tableBlock}
              style={{ paddingBottom: 16 }}
            >
              <TableWrapper
                columns={[{ label: "Policy", elementKey: "name" }]}
                onSelect={selectionChanged}
                selectedItems={currentPolicies}
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
    </Grid>
  );
};

export default withStyles(styles)(PolicySelectors);
