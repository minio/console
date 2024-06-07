// This file is part of MinIO Console Server
// Copyright (c) 2024 MinIO, Inc.
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

import React from "react";
import { ConfirmModalIcon } from "mds";
import { api } from "api";
import { setErrorSnackMessage } from "../../../../systemSlice";
import { useAppDispatch } from "../../../../store";
import ConfirmDialog from "screens/Console/Common/ModalWrapper/ConfirmDialog";

interface ITierDeleteModal {
  open: boolean;
  closeModalAndRefresh: (refresh: boolean) => any;
  tierName: string;
}

const DeleteTierConfirmModal = ({
  open,
  closeModalAndRefresh,
  tierName,
}: ITierDeleteModal) => {
  const dispatch = useAppDispatch();

  const deleteTier = () => {
    if (tierName !== "") {
      api.admin
        .removeTier(tierName)
        .then(() => {
          closeModalAndRefresh(true);
        })
        .catch((err) => {
          err.json().then((body: any) => {
            dispatch(
              setErrorSnackMessage({
                errorMessage: body.message,
                detailedError: body.detailedMessage,
              }),
            );
          });
          closeModalAndRefresh(false);
        });
    } else {
      setErrorSnackMessage({
        errorMessage: "There was an error deleting the tier",
        detailedError: "",
      });
    }
  };

  return (
    <ConfirmDialog
      title={`Delete Tier`}
      confirmText={"Delete"}
      isOpen={open}
      titleIcon={<ConfirmModalIcon />}
      isLoading={false}
      onConfirm={() => deleteTier()}
      onClose={() => closeModalAndRefresh(false)}
      confirmationContent={
        <React.Fragment>
          Are you sure you want to delete the tier <strong>{tierName}</strong>?
          <br />
          <br />
          <strong> Please note</strong>
          <br /> Only empty tiers can be deleted. If the tier has had objects
          transitioned into it, it cannot be removed.
        </React.Fragment>
      }
    />
  );
};

export default DeleteTierConfirmModal;
