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

import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { createStyles, Theme, withStyles } from "@material-ui/core/styles";
import { TextField } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import InputAdornment from "@material-ui/core/InputAdornment";
import SearchIcon from "@material-ui/icons/Search";
import {
  actionsTray,
  searchField,
} from "../Common/FormComponents/common/styleLibrary";
import api from "../../../common/api";
import TableWrapper from "../Common/TableWrapper/TableWrapper";
import { AppState } from "../../../store";
import { setErrorSnackMessage } from "../../../actions";
import { NewServiceAccount } from "../Common/CredentialsPrompt/types";
import { stringSort } from "../../../utils/sortFunctions";
import AddServiceAccount from "../Account/AddServiceAccount";
import DeleteServiceAccount from "../Account/DeleteServiceAccount";
import CredentialsPrompt from "../Common/CredentialsPrompt/CredentialsPrompt";

interface IUserServiceAccountsProps {
  classes: any;
  user: string;
  setErrorSnackMessage: typeof setErrorSnackMessage;
}

const styles = (theme: Theme) =>
  createStyles({
    ...searchField,
    ...actionsTray,
    actionsTray: {
      ...actionsTray.actionsTray,
      padding: "15px 0 0",
    },
  });

const UserServiceAccountsPanel = ({
  classes,
  user,
  setErrorSnackMessage,
}: IUserServiceAccountsProps) => {
  const [records, setRecords] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [filter, setFilter] = useState<string>("");
  const [addScreenOpen, setAddScreenOpen] = useState<boolean>(false);
  const [deleteOpen, setDeleteOpen] = useState<boolean>(false);
  const [selectedServiceAccount, setSelectedServiceAccount] = useState<
    string | null
  >(null);
  const [showNewCredentials, setShowNewCredentials] = useState<boolean>(false);
  const [newServiceAccount, setNewServiceAccount] =
    useState<NewServiceAccount | null>(null);

  useEffect(() => {
    fetchRecords();
  }, []);

  useEffect(() => {
    if (loading) {
      api
        .invoke("GET", `/api/v1/user/service-accounts?name=${user}`)
        .then((res: string[]) => {
          const serviceAccounts = res.sort(stringSort);

          setLoading(false);
          setRecords(serviceAccounts);
        })
        .catch((err) => {
          setErrorSnackMessage(err);
          setLoading(false);
        });
    }
  }, [loading, setLoading, setRecords, setErrorSnackMessage, user]);

  const fetchRecords = () => {
    setLoading(true);
  };

  const closeAddModalAndRefresh = (res: NewServiceAccount | null) => {
    setAddScreenOpen(false);
    fetchRecords();

    if (res !== null) {
      const nsa: NewServiceAccount = {
        console: {
          accessKey: `${res.accessKey}`,
          secretKey: `${res.secretKey}`,
        },
      };
      setNewServiceAccount(nsa);
      setShowNewCredentials(true);
    }
  };

  const closeDeleteModalAndRefresh = (refresh: boolean) => {
    setDeleteOpen(false);

    if (refresh) {
      fetchRecords();
    }
  };

  const closeCredentialsModal = () => {
    setShowNewCredentials(false);
    setNewServiceAccount(null);
  };

  const confirmDeleteServiceAccount = (selectedServiceAccount: string) => {
    setSelectedServiceAccount(selectedServiceAccount);
    setDeleteOpen(true);
  };

  const tableActions = [
    { type: "delete", onClick: confirmDeleteServiceAccount },
  ];

  const filteredRecords = records.filter((elementItem) =>
    elementItem.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <React.Fragment>
      {addScreenOpen && (
        <AddServiceAccount
          open={addScreenOpen}
          closeModalAndRefresh={(res: NewServiceAccount | null) => {
            closeAddModalAndRefresh(res);
          }}
        />
      )}
      {deleteOpen && (
        <DeleteServiceAccount
          deleteOpen={deleteOpen}
          selectedServiceAccount={selectedServiceAccount}
          closeDeleteModalAndRefresh={(refresh: boolean) => {
            closeDeleteModalAndRefresh(refresh);
          }}
        />
      )}
      {showNewCredentials && (
        <CredentialsPrompt
          newServiceAccount={newServiceAccount}
          open={showNewCredentials}
          closeModal={() => {
            closeCredentialsModal();
          }}
          entity="Service Account"
        />
      )}
      <Grid container>
        <Grid item xs={12} className={classes.container}>
          <Grid item xs={12} className={classes.actionsTray}>
            <TextField
              placeholder="Search Service Accounts"
              className={classes.searchField}
              id="search-resource"
              label=""
              InputProps={{
                disableUnderline: true,
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
          <Grid item xs={12}>
            <br />
          </Grid>
          <Grid item xs={12}>
            <TableWrapper
              isLoading={loading}
              records={filteredRecords}
              entityName={"Service Accounts"}
              idField={""}
              columns={[{ label: "Service Account", elementKey: "" }]}
              itemActions={tableActions}
            />
          </Grid>
        </Grid>
      </Grid>
    </React.Fragment>
  );
};

const mapState = (state: AppState) => ({
  session: state.console.session,
});

const connector = connect(mapState, {
  setErrorSnackMessage,
});

export default withStyles(styles)(connector(UserServiceAccountsPanel));
