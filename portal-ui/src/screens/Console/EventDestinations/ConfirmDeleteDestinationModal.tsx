// This file is part of MinIO Console Server
// Copyright (c) 2022 MinIO, Inc.
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
import ConfirmDialog from "../Common/ModalWrapper/ConfirmDialog";
import { ConfirmModalIcon } from "mds";

const ConfirmDeleteDestinationModal = ({
  onConfirm,
  onClose,
  serviceName,
  status,
}: {
  onConfirm: () => void;
  onClose: () => void;
  serviceName: string;
  status: string;
}) => {
  return (
    <ConfirmDialog
      title={`Delete Endpoint`}
      confirmText={"Delete"}
      isOpen={true}
      titleIcon={<ConfirmModalIcon />}
      isLoading={false}
      onConfirm={onConfirm}
      onClose={onClose}
      confirmationContent={
        <React.Fragment>
          Are you sure you want to delete the event destination ?
          <br />
          <b>{serviceName}</b> which is <b>{status}</b>
        </React.Fragment>
      }
    />
  );
};

export default ConfirmDeleteDestinationModal;
