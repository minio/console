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
import { DialogContentText } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { setErrorSnackMessage } from "../../../systemSlice";
import { ErrorResponseHandler } from "../../../common/types";
import { ConfirmDeleteIcon } from "../../../icons";
import { encodeURLString } from "../../../common/utils";
import { IAM_PAGES } from "../../../common/SecureComponent/permissions";
import useApi from "../Common/Hooks/useApi";
import ConfirmDialog from "../Common/ModalWrapper/ConfirmDialog";
import WarningMessage from "../Common/WarningMessage/WarningMessage";
import TableWrapper from "../Common/TableWrapper/TableWrapper";
import api from "../../../common/api";
import Loader from "../Common/Loader/Loader";

interface IDeleteUserProps {
  closeDeleteModalAndRefresh: (refresh: boolean) => void;
  deleteOpen: boolean;
  selectedUsers: string[] | null;
  setErrorSnackMessage: typeof setErrorSnackMessage;
}

const DeleteUser = ({
  closeDeleteModalAndRefresh,
  deleteOpen,
  selectedUsers,
  setErrorSnackMessage,
}: IDeleteUserProps) => {
  const navigate = useNavigate();

  const onDelSuccess = () => closeDeleteModalAndRefresh(true);
  const onDelError = (err: ErrorResponseHandler) => setErrorSnackMessage(err);
  const onClose = () => closeDeleteModalAndRefresh(false);

  const [deleteLoading, invokeDeleteApi] = useApi(onDelSuccess, onDelError);
  const [loadingSA, setLoadingSA] = useState<boolean>(true);
  const [hasSA, setHasSA] = useState<boolean>(false);
  const [userSAList, setUserSAList] = useState<userSACount[]>([]);

  const userLoggedIn = localStorage.getItem("userLoggedIn") || "";

  useEffect(() => {
    if (selectedUsers) {
      api
        .invoke("POST", `/api/v1/users/service-accounts`, selectedUsers)
        .then((res) => {
          setUserSAList(res.userServiceAccountList);
          if (res.hasSA) {
            setHasSA(true);
          }
          setLoadingSA(false);
        })
        .catch((err: ErrorResponseHandler) => {
          setErrorSnackMessage(err);
          setLoadingSA(false);
        });
    }
  }, [selectedUsers, setErrorSnackMessage]);

  if (!selectedUsers) {
    return null;
  }
  const renderUsers = selectedUsers.map((user) => (
    <div key={user}>
      <b>{user}</b>
    </div>
  ));
  const viewAction = (selectionElement: any): void => {
    navigate(
      `${IAM_PAGES.USERS}/${encodeURLString(selectionElement.userName)}`
    );
    onClose();
  };
  const tableActions = [
    {
      type: "view",
      onClick: viewAction,
    },
  ];

  const onConfirmDelete = () => {
    for (let user of selectedUsers) {
      if (user === userLoggedIn) {
        setErrorSnackMessage({
          errorMessage: "Cannot delete currently logged in user",
          detailedError: `Cannot delete currently logged in user ${userLoggedIn}`,
        });
        closeDeleteModalAndRefresh(true);
      } else {
        invokeDeleteApi("DELETE", `/api/v1/user/${encodeURLString(user)}`);
        closeDeleteModalAndRefresh(true);
        navigate(`${IAM_PAGES.USERS}`);
      }
    }
  };

  interface userSACount {
    userName: string;
    numSAs: number;
  }

  const noSAtext =
    "Are you sure you want to delete the following " +
    selectedUsers.length +
    " " +
    "user" +
    (selectedUsers.length > 1 ? "s?" : "?");

  return loadingSA ? (
    <Loader />
  ) : (
    <ConfirmDialog
      title={`Delete User${selectedUsers.length > 1 ? "s" : ""}`}
      confirmText={"Delete"}
      isOpen={deleteOpen}
      titleIcon={<ConfirmDeleteIcon />}
      isLoading={deleteLoading}
      onConfirm={onConfirmDelete}
      onClose={onClose}
      confirmationContent={
        <DialogContentText>
          {hasSA ? (
            <Fragment>
              <WarningMessage
                label="Click on a user to view the full listing of asociated Service Accounts. All Service Accounts associated with a user will be deleted along with the user. Are you sure you want to continue?"
                title="Warning: One or more users selected has associated Service Accounts. "
              />
              <TableWrapper
                itemActions={tableActions}
                columns={[
                  { label: "Username", elementKey: "userName" },
                  {
                    label: "# Associated Service Accounts",
                    elementKey: "numSAs",
                  },
                ]}
                isLoading={loadingSA}
                records={userSAList}
                entityName="User Service Accounts"
                idField="userName"
                customPaperHeight="250"
              />
            </Fragment>
          ) : (
            <Fragment>
              {noSAtext}
              {renderUsers}
            </Fragment>
          )}
        </DialogContentText>
      }
    />
  );
};

const mapDispatchToProps = {
  setErrorSnackMessage,
};

const connector = connect(null, mapDispatchToProps);

export default connector(DeleteUser);
