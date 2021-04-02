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

import React, { useEffect, useState, Fragment } from "react";
import { connect } from "react-redux";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import InputAdornment from "@material-ui/core/InputAdornment";
import SearchIcon from "@material-ui/icons/Search";
import { Button, IconButton } from "@material-ui/core";
import { createStyles, Theme, withStyles } from "@material-ui/core/styles";
import { ITenant, ITenantsResponse } from "./types";
import { niceBytes } from "../../../../common/utils";
import { NewServiceAccount } from "../../Common/CredentialsPrompt/types";
import {
  actionsTray,
  searchField,
  settingsCommon,
} from "../../Common/FormComponents/common/styleLibrary";
import { setErrorSnackMessage } from "../../../../actions";
import { CreateIcon } from "../../../../icons";
import api from "../../../../common/api";
import TableWrapper from "../../Common/TableWrapper/TableWrapper";
import DeleteTenant from "./DeleteTenant";
import AddTenant from "../AddTenant/AddTenant";
import CredentialsPrompt from "../../Common/CredentialsPrompt/CredentialsPrompt";
import history from "../../../../history";
import RefreshIcon from "@material-ui/icons/Refresh";
import SlideOptions from "../../Common/SlideOptions/SlideOptions";
import BackSettingsIcon from "../../../../icons/BackSettingsIcon";
import { resetAddTenantForm } from "../actions";

interface ITenantsList {
  classes: any;
  setErrorSnackMessage: typeof setErrorSnackMessage;
  resetAddTenantForm: typeof resetAddTenantForm;
}

const styles = (theme: Theme) =>
  createStyles({
    ...actionsTray,
    ...searchField,
    ...settingsCommon,
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
      ...actionsTray.actionsTray,
      padding: "0 38px",
    },
    tenantsContainer: {
      padding: "15px 0",
    },
    customConfigurationPage: {
      height: "calc(100vh - 440px)",
      scrollbarWidth: "none" as const,
      "&::-webkit-scrollbar": {
        display: "none",
      },
    },
  });

const ListTenants = ({
  classes,
  setErrorSnackMessage,
  resetAddTenantForm,
}: ITenantsList) => {
  const [currentPanel, setCurrentPanel] = useState<number>(0);
  const [deleteOpen, setDeleteOpen] = useState<boolean>(false);
  const [selectedTenant, setSelectedTenant] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [filterTenants, setFilterTenants] = useState<string>("");
  const [records, setRecords] = useState<any[]>([]);
  const [showNewCredentials, setShowNewCredentials] = useState<boolean>(false);
  const [
    createdAccount,
    setCreatedAccount,
  ] = useState<NewServiceAccount | null>(null);

  const closeAddModalAndRefresh = (reloadData: boolean) => {
    setCurrentPanel(0);
    resetAddTenantForm();

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

  const confirmDeleteTenant = (tenant: ITenant) => {
    setSelectedTenant(tenant);
    setDeleteOpen(true);
  };

  const redirectToTenantDetails = (tenant: ITenant) => {
    history.push(`/namespaces/${tenant.namespace}/tenants/${tenant.name}`);
    return;
  };

  const closeCredentialsModal = () => {
    setShowNewCredentials(false);
    setCreatedAccount(null);
  };

  const backClick = () => {
    setCurrentPanel(currentPanel - 1);
    resetAddTenantForm();
  };

  const tableActions = [
    { type: "view", onClick: redirectToTenantDetails },
    { type: "delete", onClick: confirmDeleteTenant },
  ];

  const filteredRecords = records.filter((b: any) => {
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
        api
          .invoke("GET", `/api/v1/tenants`)
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
              resTenants[i].capacity = niceBytes(resTenants[i].total_size + "");
            }

            setRecords(resTenants);
            setIsLoading(false);
          })
          .catch((err) => {
            setErrorSnackMessage(err);
            setIsLoading(false);
          });
      };
      fetchRecords();
    }
  }, [isLoading, setErrorSnackMessage]);

  useEffect(() => {
    setIsLoading(true);
  }, []);

  const createTenant = () => {
    setCurrentPanel(1);
  };

  return (
    <Fragment>
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
          <Grid item xs={12}>
            <div className={classes.settingsOptionsContainer}>
              <SlideOptions
                slideOptions={[
                  <Fragment>
                    <Grid item xs={12} className={classes.tenantsContainer}>
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
                        <IconButton
                          color="primary"
                          aria-label="Refresh Tenant List"
                          component="span"
                          onClick={() => {
                            setIsLoading(true);
                          }}
                        >
                          <RefreshIcon />
                        </IconButton>
                        <Button
                          variant="contained"
                          color="primary"
                          startIcon={<CreateIcon />}
                          onClick={createTenant}
                        >
                          Create Tenant
                        </Button>
                      </Grid>
                      <Grid item xs={12} className={classes.tenantsContainer}>
                        <TableWrapper
                          itemActions={tableActions}
                          columns={[
                            { label: "Name", elementKey: "name" },
                            { label: "Namespace", elementKey: "namespace" },
                            { label: "Capacity", elementKey: "capacity" },
                            { label: "# of Pools", elementKey: "pool_count" },
                            { label: "State", elementKey: "currentState" },
                          ]}
                          isLoading={isLoading}
                          records={filteredRecords}
                          entityName="Tenants"
                          idField="name"
                          customPaperHeight={classes.customConfigurationPage}
                          noBackground
                        />
                      </Grid>
                    </Grid>
                  </Fragment>,
                  <Fragment>
                    <Grid item xs={12} className={classes.backContainer}>
                      <button
                        onClick={backClick}
                        className={classes.backButton}
                      >
                        <BackSettingsIcon />
                        Back To Tenants List
                      </button>
                    </Grid>
                    <Grid item xs={12}>
                      {currentPanel === 1 && (
                        <AddTenant closeAndRefresh={closeAddModalAndRefresh} />
                      )}
                    </Grid>
                  </Fragment>,
                ]}
                currentSlide={currentPanel}
              />
            </div>
          </Grid>
        </Grid>
      </Grid>
    </Fragment>
  );
};

const connector = connect(null, {
  setErrorSnackMessage,
  resetAddTenantForm,
});

export default withStyles(styles)(connector(ListTenants));
