// This file is part of MinIO Console Server
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
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import InputAdornment from "@material-ui/core/InputAdornment";
import SearchIcon from "@material-ui/icons/Search";
import { Button } from "@material-ui/core";
import { CreateIcon } from "../../../../icons";
import TableWrapper from "../../Common/TableWrapper/TableWrapper";
import { MinTablePaginationActions } from "../../../../common/MinTablePaginationActions";
import { createStyles, Theme, withStyles } from "@material-ui/core/styles";
import api from "../../../../common/api";
import { ITenant, ITenantsResponse } from "./types";
import { niceBytes } from "../../../../common/utils";
import DeleteTenant from "./DeleteTenant";
import AddTenant from "./AddTenant";
import { NewServiceAccount } from "../../Common/CredentialsPrompt/types";
import CredentialsPrompt from "../../Common/CredentialsPrompt/CredentialsPrompt";

interface ITenantsList {
  classes: any;
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
  });

const ListTenants = ({ classes }: ITenantsList) => {
  const [createTenantOpen, setCreateTenantOpen] = useState<boolean>(false);
  const [deleteOpen, setDeleteOpen] = useState<boolean>(false);
  const [selectedTenant, setSelectedTenant] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [filterTenants, setFilterTenants] = useState<string>("");
  const [records, setRecords] = useState<any[]>([]);
  const [offset, setOffset] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [page, setPage] = useState<number>(0);
  const [error, setError] = useState<string>("");
  const [showNewCredentials, setShowNewCredentials] = useState<boolean>(false);
  const [
    createdAccount,
    setCreatedAccount,
  ] = useState<NewServiceAccount | null>(null);

  const closeAddModalAndRefresh = (
    reloadData: boolean,
    res: NewServiceAccount | null
  ) => {
    setCreateTenantOpen(false);

    if (res !== null) {
      setShowNewCredentials(true);
      setCreatedAccount(res);
    }

    if (reloadData) {
      setIsLoading(true);
    }
  };

  const closeDeleteModalAndRefresh = (reloadData: boolean) => {
    setDeleteOpen(false);

    if (reloadData) {
      setIsLoading(true);
    }
  };

  const confirmDeleteTenant = (tenant: string) => {
    setSelectedTenant(tenant);
    setDeleteOpen(true);
  };

  const closeCredentialsModal = () => {
    setShowNewCredentials(false);
    setCreatedAccount(null);
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

  const openLink = (link: string) => {
    window.open(link, "_blank");
  };

  const tableActions = [
    { type: "view", to: `/tenants`, sendOnlyId: true },
    { type: "delete", onClick: confirmDeleteTenant, sendOnlyId: true },
  ];

  const filteredRecords = records
    .slice(offset, offset + rowsPerPage)
    .filter((b: any) => {
      if (filterTenants === "") {
        return true;
      } else {
        if (b.name.indexOf(filterTenants) >= 0) {
          return true;
        } else {
          return false;
        }
      }
    });

  useEffect(() => {
    if (isLoading) {
      const fetchRecords = () => {
        const offset = page * rowsPerPage;
        api
          .invoke(
            "GET",
            `/api/v1/tenants?offset=${offset}&limit=${rowsPerPage}`
          )
          .then((res: ITenantsResponse) => {
            if (res === null) {
              setIsLoading(false);
              return;
            }
            let resTenants: ITenant[] = [];
            if (res.tenants !== null) {
              resTenants = res.tenants;
            }

            for (let i = 0; i < resTenants.length; i++) {
              const total =
                resTenants[i].volume_count * resTenants[i].volume_size;
              resTenants[i].capacity = niceBytes(total + "");
            }

            setRecords(resTenants);
            setError("");
            setIsLoading(false);

            // if we get 0 results, and page > 0 , go down 1 page
            if ((!res.tenants || res.tenants.length === 0) && page > 0) {
              const newPage = page - 1;
              setPage(newPage);
            }
          })
          .catch((err) => {
            setError(err);
            setIsLoading(false);
          });
      };
      fetchRecords();
    }
  }, [isLoading, page, rowsPerPage]);

  useEffect(() => {
    setIsLoading(true);
  }, []);

  return (
    <React.Fragment>
      {createTenantOpen && (
        <AddTenant
          open={createTenantOpen}
          closeModalAndRefresh={closeAddModalAndRefresh}
        />
      )}
      {deleteOpen && (
        <DeleteTenant
          deleteOpen={deleteOpen}
          selectedTenant={selectedTenant}
          closeDeleteModalAndRefresh={closeDeleteModalAndRefresh}
        />
      )}
      {showNewCredentials && (
        <CredentialsPrompt
          newServiceAccount={createdAccount}
          open={showNewCredentials}
          closeModal={() => {
            closeCredentialsModal();
          }}
          entity="Tenant"
        />
      )}
      <Grid container>
        <Grid item xs={12}>
          <Typography variant="h6">Tenants</Typography>
        </Grid>
        <Grid item xs={12}>
          <br />
        </Grid>
        <Grid item xs={12} className={classes.actionsTray}>
          <TextField
            placeholder="Search Tenants"
            className={classes.searchField}
            id="search-resource"
            label=""
            onChange={(val) => {
              setFilterTenants(val.target.value);
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
              setCreateTenantOpen(true);
            }}
          >
            Create Tenant
          </Button>
        </Grid>
        <Grid item xs={12}>
          <br />
        </Grid>
        <Grid item xs={12}>
          <TableWrapper
            itemActions={tableActions}
            columns={[
              { label: "Name", elementKey: "name" },
              { label: "Capacity", elementKey: "capacity" },
              { label: "# of Zones", elementKey: "zone_count" },
              { label: "State", elementKey: "currentState" },
            ]}
            isLoading={isLoading}
            records={filteredRecords}
            entityName="Tenants"
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
    </React.Fragment>
  );
};

export default withStyles(styles)(ListTenants);
