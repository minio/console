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
import { LinearProgress } from "@mui/material";
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
import history from "../../../../history";
import RefreshIcon from "../../../../icons/RefreshIcon";
import PageHeader from "../../Common/PageHeader/PageHeader";
import TenantListItem from "./TenantListItem";
import HelpBox from "../../../../common/HelpBox";
import AButton from "../../Common/AButton/AButton";

import withSuspense from "../../Common/Components/withSuspense";
import VirtualizedList from "../../Common/VirtualizedList/VirtualizedList";
import RBIconButton from "../../Buckets/BucketDetails/SummaryItems/RBIconButton";
import SearchBox from "../../Common/SearchBox";
import PageLayout from "../../Common/Layout/PageLayout";

const CredentialsPrompt = withSuspense(
  React.lazy(() => import("../../Common/CredentialsPrompt/CredentialsPrompt"))
);

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
    tenantsList: {
      marginTop: 25,
      height: "calc(100vh - 195px)",
    },
    searchField: {
      ...searchField.searchField,
      marginRight: "auto",
      maxWidth: 380,
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

  const renderItemLine = (index: number) => {
    const tenant = filteredRecords[index] || null;

    if (tenant) {
      return <TenantListItem tenant={tenant} />;
    }

    return null;
  };

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
          <Grid
            item
            xs={12}
            className={classes.actionsTray}
            marginRight={"30px"}
          >
            <SearchBox
              placeholder={"Filter Tenants"}
              onChange={(val) => {
                setFilterTenants(val);
              }}
              overrideClass={classes.searchField}
              value={filterTenants}
            />

            <RBIconButton
              tooltip={"Refresh Tenant List"}
              text={""}
              onClick={() => {
                setIsLoading(true);
              }}
              icon={<RefreshIcon />}
              color="primary"
              variant={"outlined"}
            />
            <RBIconButton
              id={"create-tenant"}
              tooltip={"Create Tenant"}
              text={"Create Tenant"}
              onClick={() => {
                history.push("/tenants/add");
              }}
              icon={<AddIcon />}
              color="primary"
              variant={"contained"}
            />
          </Grid>
        }
      />
      <PageLayout>
        <Grid item xs={12} className={classes.tenantsList}>
          {isLoading && <LinearProgress />}
          {!isLoading && (
            <Fragment>
              {filteredRecords.length !== 0 && (
                <VirtualizedList
                  rowRenderFunction={renderItemLine}
                  totalItems={filteredRecords.length}
                />
              )}
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
                          Tenant is the logical structure to represent a MinIO
                          deployment. A tenant can have different size and
                          configurations from other tenants, even a different
                          storage class.
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
      </PageLayout>
    </Fragment>
  );
};

const connector = connect(null, {
  setErrorSnackMessage,
});

export default withStyles(styles)(connector(ListTenants));
