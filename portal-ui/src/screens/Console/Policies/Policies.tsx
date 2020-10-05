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
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import InputAdornment from "@material-ui/core/InputAdornment";
import SearchIcon from "@material-ui/icons/Search";
import { Policy, PolicyList } from "./types";
import { CreateIcon } from "../../../icons";
import { MinTablePaginationActions } from "../../../common/MinTablePaginationActions";
import AddPolicy from "./AddPolicy";
import DeletePolicy from "./DeletePolicy";
import TableWrapper from "../Common/TableWrapper/TableWrapper";
import api from "../../../common/api";
import { containerForHeader } from "../Common/FormComponents/common/styleLibrary";
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
    actionsTray: {
      textAlign: "right",
      "& button": {
        marginLeft: 10,
      },
    },
    searchField: {
      background: "#FFFFFF",
      padding: 12,
      borderRadius: 5,
      boxShadow: "0px 3px 6px #00000012",
    },
    ...containerForHeader(theme.spacing(4)),
  });

interface IPoliciesProps {
  classes: any;
}

const Policies = ({ classes }: IPoliciesProps) => {
  const [records, setRecords] = useState<Policy[]>([]);
  const [totalRecords, setTotalRecords] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [addScreenOpen, setAddScreenOpen] = useState<boolean>(false);
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [deleteOpen, setDeleteOpen] = useState<boolean>(false);
  const [selectedPolicy, setSelectedPolicy] = useState<string>("");
  const [filterPolicies, setFilterPolicies] = useState<string>("");
  const [policyEdit, setPolicyEdit] = useState<any>(null);

  useEffect(() => {
    fetchRecords();
  }, []);

  useEffect(() => {
    if (loading) {
      const offset = page * rowsPerPage;
      api
        .invoke("GET", `/api/v1/policies?offset=${offset}&limit=${rowsPerPage}`)
        .then((res: PolicyList) => {
          const policies = get(res, "policies", []);
          const total = get(res, "total", 0);

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
          setTotalRecords(total);
          setError("");

          // if we get 0 results, and page > 0 , go down 1 page
          if (
            (res.policies === undefined ||
              res.policies == null ||
              res.policies.length === 0) &&
            page > 0
          ) {
            const newPage = page - 1;

            setPage(newPage);
            fetchRecords();
          }
        })
        .catch((err) => {
          setLoading(false);
          setError(err);
        });
    }
  }, [
    loading,
    setLoading,
    setRecords,
    setTotalRecords,
    setError,
    setPage,
    setError,
  ]);

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

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const rPP = parseInt(event.target.value, 10);
    setPage(0);
    setRowsPerPage(rPP);
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

  const beginRecord = page * rowsPerPage;
  const endRecords = beginRecord + rowsPerPage;

  const paginatedRecords = filteredRecords.slice(beginRecord, endRecords);

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
                setPage(0);
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
          <Grid item xs={12}>
            <TableWrapper
              itemActions={tableActions}
              columns={[{ label: "Name", elementKey: "name" }]}
              isLoading={loading}
              records={paginatedRecords}
              entityName="Policies"
              idField="name"
              paginatorConfig={{
                rowsPerPageOptions: [5, 10, 25],
                colSpan: 3,
                count: filteredRecords.length,
                rowsPerPage: rowsPerPage,
                page: page,
                SelectProps: {
                  inputProps: { "aria-label": "rows per page" },
                  native: true,
                },
                onChangePage: handleChangePage,
                onChangeRowsPerPage: handleChangeRowsPerPage,
                ActionsComponent: MinTablePaginationActions,
              }}
            />
          </Grid>
        </Grid>
      </Grid>
    </React.Fragment>
  );
};

export default withStyles(styles)(Policies);
