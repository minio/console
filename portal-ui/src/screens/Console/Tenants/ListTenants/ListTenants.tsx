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

import React, { Fragment, useEffect, useState } from "react";
import { connect } from "react-redux";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import { Box, Button, LinearProgress } from "@mui/material";
import { Theme } from "@mui/material/styles";
import createStyles from "@mui/styles/createStyles";
import withStyles from "@mui/styles/withStyles";
import { ITenant, ITenantsResponse } from "./types";
import { niceBytes } from "../../../../common/utils";
import { NewServiceAccount } from "../../Common/CredentialsPrompt/types";
import {
  actionsTray,
  containerForHeader,
  searchField,
} from "../../Common/FormComponents/common/styleLibrary";
import { setErrorSnackMessage } from "../../../../actions";
import { AddIcon, TenantsIcon } from "../../../../icons";
import { ErrorResponseHandler } from "../../../../common/types";
import api from "../../../../common/api";
import CredentialsPrompt from "../../Common/CredentialsPrompt/CredentialsPrompt";
import history from "../../../../history";
import RefreshIcon from "../../../../icons/RefreshIcon";
import SearchIcon from "../../../../icons/SearchIcon";
import PageHeader from "../../Common/PageHeader/PageHeader";
import TenantListItem from "./TenantListItem";
import HelpBox from "../../../../common/HelpBox";
import BoxIconButton from "../../Common/BoxIconButton/BoxIconButton";
import AButton from "../../Common/AButton/AButton";

interface ITenantsList {
  classes: any;
  setErrorSnackMessage: typeof setErrorSnackMessage;
}

const styles = (theme: Theme) =>
  createStyles({
    ...actionsTray,
    ...searchField,
    ...containerForHeader(theme.spacing(4)),
    addTenant: {
      marginRight: 8,
    },
    theaderSearchLabel: {
      color: theme.palette.grey["400"],
      fontSize: 14,
      fontWeight: "bold",
    },
    addBucket: {
      marginRight: 8,
    },
    theaderSearch: {
      borderColor: theme.palette.grey["200"],
      "& .MuiInputBase-input": {
        paddingTop: 10,
        paddingBottom: 10,
      },
      "& .MuiInputBase-root": {
        "& .MuiInputAdornment-root": {
          "& .min-icon": {
            color: theme.palette.grey["400"],
            height: 14,
          },
        },
      },
      actionHeaderItems: {
        "@media (min-width: 320px)": {
          marginTop: 8,
        },
      },
      marginRight: 10,
      marginLeft: 10,
    },
    mainActions: {
      textAlign: "right",
      marginBottom: 8,
    },
    healthStatusIcon: {
      position: "relative",
      fontSize: 10,
      right: -30,
      height: 10,
      top: -50,
    },
    tenantItem: {
      border: "1px solid #dedede",
      marginBottom: 20,
      paddingLeft: 40,
      paddingRight: 40,
      paddingTop: 30,
      paddingBottom: 30,
    },
  });

const ListTenants = ({ classes, setErrorSnackMessage }: ITenantsList) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [filterTenants, setFilterTenants] = useState<string>("");
  const [records, setRecords] = useState<any[]>([]);
  const [showNewCredentials, setShowNewCredentials] = useState<boolean>(false);
  const [createdAccount, setCreatedAccount] =
    useState<NewServiceAccount | null>(null);

  const closeCredentialsModal = () => {
    setShowNewCredentials(false);
    setCreatedAccount(null);
  };

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
              resTenants[i].total_capacity = niceBytes(
                resTenants[i].total_size + ""
              );
            }

            setRecords(resTenants);
            setIsLoading(false);
          })
          .catch((err: ErrorResponseHandler) => {
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

  return (
    <Fragment>
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
      <PageHeader
        label="Tenants"
        actions={
          <Fragment>
            <Grid
              container
              direction="row"
              justifyContent="flex-end"
              alignItems="center"
              className={classes.actionHeaderItems}
            >
              <Box display={{ xs: "none", sm: "none", md: "block" }}>
                <Grid item>
                  <div className={classes.theaderSearchLabel}>
                    Filter Tenants:
                  </div>
                </Grid>
              </Box>
              <Box display={{ xs: "block", sm: "block", md: "none" }}>
                <TextField
                  className={classes.theaderSearch}
                  variant={"outlined"}
                  id="search-resource"
                  placeholder={"Filter Tenants"}
                  onChange={(val) => {
                    setFilterTenants(val.target.value);
                  }}
                  inputProps={{
                    disableUnderline: true,
                    endAdornment: (
                      <InputAdornment position="end">
                        <SearchIcon />
                      </InputAdornment>
                    ),
                  }}
                />
              </Box>
              <Box display={{ xs: "none", sm: "none", md: "block" }}>
                <TextField
                  className={classes.theaderSearch}
                  variant={"outlined"}
                  id="search-resource"
                  onChange={(val) => {
                    setFilterTenants(val.target.value);
                  }}
                  inputProps={{
                    disableUnderline: true,
                    endAdornment: (
                      <InputAdornment position="end">
                        <SearchIcon />
                      </InputAdornment>
                    ),
                  }}
                />
              </Box>

              <Grid item>
                <Button
                  variant="contained"
                  color="primary"
                  endIcon={<AddIcon />}
                  onClick={() => {
                    history.push("/tenants/add");
                  }}
                  className={classes.addTenant}
                >
                  Create Tenant
                </Button>
              </Grid>
            </Grid>
          </Fragment>
        }
      />
      <Grid container>
        <Grid item xs={12} className={classes.container}>
          <Grid container>
            <Grid item xs={12} className={classes.mainActions}>
              <BoxIconButton
                color="primary"
                aria-label="Refresh Tenant List"
                onClick={() => {
                  setIsLoading(true);
                }}
                size="large"
              >
                <RefreshIcon />
              </BoxIconButton>
            </Grid>

            <Grid item xs={12}>
              {isLoading && <LinearProgress />}
              {!isLoading && (
                <Fragment>
                  {filteredRecords.map((t) => {
                    return <TenantListItem tenant={t} />;
                  })}
                  {filteredRecords.length === 0 && (
                    <Grid
                      container
                      justifyContent={"center"}
                      alignContent={"center"}
                      alignItems={"center"}
                    >
                      <Grid item xs={8}>
                        <HelpBox
                          iconComponent={<TenantsIcon />}
                          title={"Tenants"}
                          help={
                            <Fragment>
                              Tenant is the logical structure to represent a
                              MinIO deployment. A tenant can have different size
                              and configurations from other tenants, even a
                              different storage class.
                              <br />
                              <br />
                              To get started,&nbsp;
                              <AButton
                                onClick={() => {
                                  history.push("/tenants/add");
                                }}
                              >
                                Create a Tenant.
                              </AButton>
                            </Fragment>
                          }
                        />
                      </Grid>
                    </Grid>
                  )}
                </Fragment>
              )}
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Fragment>
  );
};

const connector = connect(null, {
  setErrorSnackMessage,
});

export default withStyles(styles)(connector(ListTenants));
