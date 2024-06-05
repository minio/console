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
import { useNavigate } from "react-router-dom";
import { AddIcon, Box, Button, DataTable, DeleteIcon, SectionTitle } from "mds";
import api from "../../../common/api";
import { NewServiceAccount } from "../Common/CredentialsPrompt/types";
import { ErrorResponseHandler } from "../../../common/types";
import DeleteServiceAccount from "../Account/DeleteServiceAccount";
import CredentialsPrompt from "../Common/CredentialsPrompt/CredentialsPrompt";

import DeleteMultipleServiceAccounts from "./DeleteMultipleServiceAccounts";
import { selectSAs } from "../Configurations/utils";
import EditServiceAccount from "../Account/EditServiceAccount";
import {
  CONSOLE_UI_RESOURCE,
  IAM_SCOPES,
} from "../../../common/SecureComponent/permissions";
import { SecureComponent } from "../../../common/SecureComponent";
import {
  setErrorSnackMessage,
  setHelpName,
  setSnackBarMessage,
} from "../../../systemSlice";
import { useAppDispatch } from "../../../store";
import TooltipWrapper from "../Common/TooltipWrapper/TooltipWrapper";
import { ServiceAccounts } from "../../../api/consoleApi";
import { usersSort } from "../../../utils/sortFunctions";
import { ACCOUNT_TABLE_COLUMNS } from "../Account/AccountUtils";

interface IUserServiceAccountsProps {
  user: string;
  hasPolicy: boolean;
}

const UserServiceAccountsPanel = ({
  user,
  hasPolicy,
}: IUserServiceAccountsProps) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [records, setRecords] = useState<ServiceAccounts>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [deleteOpen, setDeleteOpen] = useState<boolean>(false);
  const [selectedServiceAccount, setSelectedServiceAccount] = useState<
    string | null
  >(null);
  const [showNewCredentials, setShowNewCredentials] = useState<boolean>(false);
  const [newServiceAccount, setNewServiceAccount] =
    useState<NewServiceAccount | null>(null);
  const [selectedSAs, setSelectedSAs] = useState<string[]>([]);
  const [deleteMultipleOpen, setDeleteMultipleOpen] = useState<boolean>(false);
  const [editOpen, setEditOpen] = useState<boolean>(false);

  useEffect(() => {
    fetchRecords();
  }, []);

  useEffect(() => {
    if (loading) {
      api
        .invoke(
          "GET",
          `/api/v1/user/${encodeURIComponent(user)}/service-accounts`,
        )
        .then((res: ServiceAccounts) => {
          setLoading(false);
          const sortedRows = res.sort(usersSort);
          setRecords(sortedRows);
        })
        .catch((err: ErrorResponseHandler) => {
          dispatch(setErrorSnackMessage(err));
          setLoading(false);
        });
    }
  }, [loading, setLoading, setRecords, user, dispatch]);

  const fetchRecords = () => {
    setLoading(true);
  };

  const closeDeleteModalAndRefresh = (refresh: boolean) => {
    setDeleteOpen(false);

    if (refresh) {
      fetchRecords();
    }
  };

  const closeDeleteMultipleModalAndRefresh = (refresh: boolean) => {
    setDeleteMultipleOpen(false);
    if (refresh) {
      dispatch(setSnackBarMessage(`Access Keys deleted successfully.`));
      setSelectedSAs([]);
      setLoading(true);
    }
  };

  const closeCredentialsModal = () => {
    setShowNewCredentials(false);
    setNewServiceAccount(null);
  };

  const editModalOpen = (selectedServiceAccount: string) => {
    setSelectedServiceAccount(selectedServiceAccount);
    setEditOpen(true);
  };

  const confirmDeleteServiceAccount = (selectedServiceAccount: string) => {
    setSelectedServiceAccount(selectedServiceAccount);
    setDeleteOpen(true);
  };

  const closePolicyModal = () => {
    setEditOpen(false);
    setLoading(true);
  };

  const tableActions = [
    {
      type: "view",
      onClick: (value: any) => {
        if (value) {
          editModalOpen(value.accessKey);
        }
      },
    },
    {
      type: "delete",
      onClick: (value: any) => {
        if (value) {
          confirmDeleteServiceAccount(value.accessKey);
        }
      },
    },
    {
      type: "edit",
      onClick: (value: any) => {
        if (value) {
          editModalOpen(value.accessKey);
        }
      },
    },
  ];

  useEffect(() => {
    dispatch(setHelpName("user_details_accounts"));

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <Fragment>
      {deleteOpen && (
        <DeleteServiceAccount
          deleteOpen={deleteOpen}
          selectedServiceAccount={selectedServiceAccount}
          closeDeleteModalAndRefresh={(refresh: boolean) => {
            closeDeleteModalAndRefresh(refresh);
          }}
        />
      )}
      {deleteMultipleOpen && (
        <DeleteMultipleServiceAccounts
          deleteOpen={deleteMultipleOpen}
          selectedSAs={selectedSAs}
          closeDeleteModalAndRefresh={closeDeleteMultipleModalAndRefresh}
        />
      )}
      {showNewCredentials && (
        <CredentialsPrompt
          newServiceAccount={newServiceAccount}
          open={showNewCredentials}
          closeModal={() => {
            closeCredentialsModal();
          }}
          entity="Access Key"
        />
      )}
      {editOpen && (
        <EditServiceAccount
          open={editOpen}
          selectedAccessKey={selectedServiceAccount}
          closeModalAndRefresh={closePolicyModal}
        />
      )}

      <SectionTitle
        separator
        sx={{ marginBottom: 15 }}
        actions={
          <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
            <TooltipWrapper tooltip={"Delete Selected"}>
              <Button
                id={"delete-selected"}
                onClick={() => {
                  setDeleteMultipleOpen(true);
                }}
                label={"Delete Selected"}
                icon={<DeleteIcon />}
                disabled={selectedSAs.length === 0}
                variant={"secondary"}
              />
            </TooltipWrapper>
            <SecureComponent
              scopes={[
                IAM_SCOPES.ADMIN_CREATE_SERVICEACCOUNT,
                IAM_SCOPES.ADMIN_UPDATE_SERVICEACCOUNT,
                IAM_SCOPES.ADMIN_REMOVE_SERVICEACCOUNT,
                IAM_SCOPES.ADMIN_LIST_SERVICEACCOUNTS,
              ]}
              resource={CONSOLE_UI_RESOURCE}
              matchAll
              errorProps={{ disabled: true }}
            >
              <TooltipWrapper tooltip={"Create Access Key"}>
                <Button
                  id={"create-service-account"}
                  label={"Create Access Key"}
                  variant="callAction"
                  icon={<AddIcon />}
                  onClick={() => {
                    navigate(
                      `/identity/users/new-user-sa/${encodeURIComponent(user)}`,
                    );
                  }}
                  disabled={!hasPolicy}
                />
              </TooltipWrapper>
            </SecureComponent>
          </Box>
        }
      >
        Access Keys
      </SectionTitle>

      <DataTable
        itemActions={tableActions}
        entityName={"Access Keys"}
        columns={ACCOUNT_TABLE_COLUMNS}
        onSelect={(e) => selectSAs(e, setSelectedSAs, selectedSAs)}
        selectedItems={selectedSAs}
        isLoading={loading}
        records={records}
        idField="accessKey"
      />
    </Fragment>
  );
};

export default UserServiceAccountsPanel;
