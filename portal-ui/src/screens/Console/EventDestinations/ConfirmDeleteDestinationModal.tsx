import React from "react";
import ConfirmDialog from "../Common/ModalWrapper/ConfirmDialog";
import { ConfirmModalIcon } from "mds";
import { DialogContentText } from "@mui/material";

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
          <DialogContentText>
            Are you sure you want to delete the event destination ?
            <br />
            <b>{serviceName}</b> which is <b>{status}</b>
          </DialogContentText>
        </React.Fragment>
      }
    />
  );
};

export default ConfirmDeleteDestinationModal;
