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

import React, { useState, useEffect } from "react";
import get from "lodash/get";
import { createStyles, Theme, withStyles } from "@material-ui/core/styles";
import { Button } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import InputAdornment from "@material-ui/core/InputAdornment";
import SearchIcon from "@material-ui/icons/Search";
import { Policy, PolicyList } from "./types";
import { CreateIcon } from "../../../icons";
import AddPolicy from "./AddPolicy";
import DeletePolicy from "./DeletePolicy";
import TableWrapper from "../Common/TableWrapper/TableWrapper";
import api from "../../../common/api";
import {
  actionsTray,
  containerForHeader,
  searchField,
} from "../Common/FormComponents/common/styleLibrary";
import PageHeader from "../Common/PageHeader/PageHeader";

const styles = (theme: Theme) =>
  createStyles({
    seeMore: {
      marginTop: theme.spacing(3),
    },
    paper: {
      display: "flex",
      overflow: "auto",
      flexDirection: "column",
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

interface IPoliciesProps {
  classes: any;
}

const Policies = ({ classes }: IPoliciesProps) => {
  const [records, setRecords] = useState<Policy[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [addScreenOpen, setAddScreenOpen] = useState<boolean>(false);
  const [deleteOpen, setDeleteOpen] = useState<boolean>(false);
  const [selectedPolicy, setSelectedPolicy] = useState<string>("");
  const [filterPolicies, setFilterPolicies] = useState<string>("");
  const [policyEdit, setPolicyEdit] = useState<any>(null);

  useEffect(() => {
    fetchRecords();
  }, []);

  useEffect(() => {
    if (loading) {
      api
        .invoke("GET", `/api/v1/policies`)
        .then((res: PolicyList) => {
          const policies = get(res, "policies", []);

          policies.sort((pa, pb) => {
            if (pa.name > pb.name) {
              return 1;
            }

            if (pa.name < pb.name) {
              return -1;
            }

            return 0;
          });

          setLoading(false);
          setRecords(policies);
          setError("");
        })
        .catch((err) => {
          setLoading(false);
          setError(err);
        });
    }
  }, [loading, setLoading, setRecords, setError]);

  const fetchRecords = () => {
    setLoading(true);
  };

  const closeAddModalAndRefresh = (refresh: boolean) => {
    setAddScreenOpen(false);

    if (refresh) {
      fetchRecords();
    }
  };

  const closeDeleteModalAndRefresh = (refresh: boolean) => {
    setDeleteOpen(false);

    if (refresh) {
      fetchRecords();
    }
  };

  const confirmDeletePolicy = (policy: string) => {
    setDeleteOpen(true);
    setSelectedPolicy(policy);
  };

  const viewAction = (row: any) => {
    setAddScreenOpen(true);
    setPolicyEdit(row);
  };

  const tableActions = [
    { type: "view", onClick: viewAction },
    { type: "delete", onClick: confirmDeletePolicy, sendOnlyId: true },
  ];

  const filteredRecords = records.filter((elementItem) =>
    elementItem.name.includes(filterPolicies)
  );

  return (
    <React.Fragment>
      {addScreenOpen && (
        <AddPolicy
          open={addScreenOpen}
          closeModalAndRefresh={closeAddModalAndRefresh}
          policyEdit={policyEdit}
        />
      )}
      {deleteOpen && (
        <DeletePolicy
          deleteOpen={deleteOpen}
          selectedPolicy={selectedPolicy}
          closeDeleteModalAndRefresh={closeDeleteModalAndRefresh}
        />
      )}
      <PageHeader label="IAM Policies" />
      <Grid container>
        <Grid item xs={12} className={classes.container}>
          <Grid item xs={12} className={classes.actionsTray}>
            <TextField
              placeholder="Search Policies"
              className={classes.searchField}
              id="search-resource"
              label=""
              onChange={(val) => {
                setFilterPolicies(val.target.value);
              }}
              InputProps={{
                disableUnderline: true,
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
            <Button
              variant="contained"
              color="primary"
              startIcon={<CreateIcon />}
              onClick={() => {
                setAddScreenOpen(true);
                setPolicyEdit(null);
              }}
            >
              Create Policy
            </Button>
          </Grid>
          <Grid item xs={12}>
            <br />
          </Grid>
          {error && (
            <Grid item xs={12}>
              {error}
            </Grid>
          )}
          <Grid item xs={12}>
            <TableWrapper
              itemActions={tableActions}
              columns={[{ label: "Name", elementKey: "name" }]}
              isLoading={loading}
              records={filteredRecords}
              entityName="Policies"
              idField="name"
            />
          </Grid>
        </Grid>
      </Grid>
    </React.Fragment>
  );
};

export default withStyles(styles)(Policies);
