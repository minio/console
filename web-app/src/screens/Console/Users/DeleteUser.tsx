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
import { setErrorSnackMessage } from "../../../systemSlice";
import { ConfirmDeleteIcon, DataTable, InformativeMessage, Loader } from "mds";
import { IAM_PAGES } from "../../../common/SecureComponent/permissions";
import ConfirmDialog from "../Common/ModalWrapper/ConfirmDialog";
import { useAppDispatch } from "../../../store";
import { api } from "api";
import { UserServiceAccountItem } from "../../../api/consoleApi";
import { errorToHandler } from "../../../api/errors";

interface IDeleteUserProps {
  closeDeleteModalAndRefresh: (refresh: boolean) => void;
  deleteOpen: boolean;
  selectedUsers: string[] | null;
}

const DeleteUser = ({
  closeDeleteModalAndRefresh,
  deleteOpen,
  selectedUsers,
}: IDeleteUserProps) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const onClose = () => closeDeleteModalAndRefresh(false);

  const [loadingSA, setLoadingSA] = useState<boolean>(true);
  const [hasSA, setHasSA] = useState<boolean>(false);
  const [userSAList, setUserSAList] = useState<UserServiceAccountItem[]>([]);
  const [deleteLoading, setDeleteLoading] = useState<boolean>(false);

  const userLoggedIn = localStorage.getItem("userLoggedIn") || "";

  useEffect(() => {
    if (selectedUsers) {
      api.users
        .checkUserServiceAccounts(selectedUsers)
        .then((res) => {
          if (res.data) {
            setUserSAList(res.data.userServiceAccountList ?? []);
            if (res.data.hasSA) {
              setHasSA(true);
            }
          }
        })
        .catch((err) =>
          dispatch(setErrorSnackMessage(errorToHandler(err.error))),
        )
        .finally(() => setLoadingSA(false));
    }
  }, [selectedUsers, dispatch]);

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
      `${IAM_PAGES.USERS}/${encodeURIComponent(selectionElement.userName)}`,
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
        dispatch(
          setErrorSnackMessage({
            errorMessage: "Cannot delete currently logged in user",
            detailedError: `Cannot delete currently logged in user ${userLoggedIn}`,
          }),
        );
        closeDeleteModalAndRefresh(true);
      } else {
        api.user
          .removeUser(user)
          .then((res) => {
            closeDeleteModalAndRefresh(true);
            navigate(`${IAM_PAGES.USERS}`);
          })
          .finally(() => setDeleteLoading(false));
      }
    }
  };

  const noSAtext =
    "Are you sure you want to delete the following " +
    selectedUsers.length +
    " " +
    "user" +
    (selectedUsers.length > 1 ? "s?" : "?");

  return (
    <ConfirmDialog
      title={`Delete User${selectedUsers.length > 1 ? "s" : ""}`}
      confirmText={"Delete"}
      isOpen={deleteOpen}
      titleIcon={<ConfirmDeleteIcon />}
      isLoading={deleteLoading}
      onConfirm={onConfirmDelete}
      onClose={onClose}
      confirmationContent={
        loadingSA ? (
          <Loader />
        ) : (
          <Fragment>
            {hasSA ? (
              <Fragment>
                <InformativeMessage
                  variant={"warning"}
                  message={
                    <Fragment>
                      Click on a user to view the full listing of associated
                      Access Keys. All Access Keys associated with a user will
                      be deleted along with the user.
                      <br />
                      <br />
                      <strong>Are you sure you want to continue?</strong>
                    </Fragment>
                  }
                  title="Warning: One or more users selected has associated Access Keys."
                  sx={{ margin: "15px 0" }}
                />
                <DataTable
                  itemActions={tableActions}
                  columns={[
                    { label: "Username", elementKey: "userName" },
                    {
                      label: "# Associated Access Keys",
                      elementKey: "numSAs",
                    },
                  ]}
                  isLoading={loadingSA}
                  records={userSAList}
                  entityName="User Access Keys"
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
          </Fragment>
        )
      }
    />
  );
};

export default DeleteUser;
