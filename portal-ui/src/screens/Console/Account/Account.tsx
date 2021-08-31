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
import Grid from "@material-ui/core/Grid";
import api from "../../../common/api";
import { Button, IconButton, Tooltip } from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import { NewServiceAccount } from "../Common/CredentialsPrompt/types";
import { setErrorSnackMessage } from "../../../actions";
import AddServiceAccount from "./AddServiceAccount";
import DeleteServiceAccount from "./DeleteServiceAccount";
import CredentialsPrompt from "../Common/CredentialsPrompt/CredentialsPrompt";
import { CreateIcon } from "../../../icons";
import TextField from "@material-ui/core/TextField";
import InputAdornment from "@material-ui/core/InputAdornment";
import TableWrapper from "../Common/TableWrapper/TableWrapper";
import { stringSort } from "../../../utils/sortFunctions";
import PageHeader from "../Common/PageHeader/PageHeader";
import {
  actionsTray,
  containerForHeader,
  searchField,
} from "../Common/FormComponents/common/styleLibrary";
import { ErrorResponseHandler } from "../../../common/types";
import LockIcon from "@material-ui/icons/Lock";
import ChangePasswordModal from "./ChangePasswordModal";
import SearchIcon from "../../../icons/SearchIcon";

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
      width: "480px",
      minWidth: "320px",
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
    imageIcon: {
      height: "100%",
    },
    iconRoot: {
      textAlign: "center",
    },
    ...actionsTray,
    ...searchField,
    ...containerForHeader(theme.spacing(4)),
  });

interface IServiceAccountsProps {
  classes: any;
  displayErrorMessage: typeof setErrorSnackMessage;
  changePassword: boolean;
}

const Account = ({
  classes,
  displayErrorMessage,
  changePassword,
}: IServiceAccountsProps) => {
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
  const [changePasswordModalOpen, setChangePasswordModalOpen] =
    useState<boolean>(false);

  useEffect(() => {
    fetchRecords();
  }, []);

  useEffect(() => {
    if (loading) {
      api
        .invoke("GET", `/api/v1/service-accounts`)
        .then((res: string[]) => {
          const serviceAccounts = res.sort(stringSort);

          setLoading(false);
          setRecords(serviceAccounts);
        })
        .catch((err: ErrorResponseHandler) => {
          displayErrorMessage(err);
          setLoading(false);
        });
    }
  }, [loading, setLoading, setRecords, displayErrorMessage]);

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
      <ChangePasswordModal
        open={changePasswordModalOpen}
        closeModal={() => setChangePasswordModalOpen(false)}
      />
      <PageHeader
        label="Account"
        actions={
          <React.Fragment>
            {changePassword && (
              <Tooltip title="Change Password">
                <IconButton
                  color="primary"
                  aria-label="Change Password"
                  component="span"
                  onClick={() => setChangePasswordModalOpen(true)}
                >
                  <LockIcon />
                </IconButton>
              </Tooltip>
            )}
          </React.Fragment>
        }
      />
      <Grid container>
        <Grid item xs={12} className={classes.container}>
          <Grid item xs={12}>
            <Typography variant="h5" component="h5">
              Service Accounts
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <br />
          </Grid>
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
            <Button
              variant="contained"
              color="primary"
              startIcon={<CreateIcon />}
              onClick={() => {
                setAddScreenOpen(true);
                setSelectedServiceAccount(null);
              }}
            >
              Create service account
            </Button>
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

const connector = connect(null, {
  displayErrorMessage: setErrorSnackMessage,
});

export default withStyles(styles)(connector(Account));
