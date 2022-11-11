import { t } from "i18next";
import React from "react";
import ConfirmDialog from "../Common/ModalWrapper/ConfirmDialog";
import { ConfirmModalIcon } from "../../../icons";
import { DialogContentText } from "@mui/material";

const ConfirmDeleteTargetModal = ({
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
      title={`${t("Delete Endpoint")}`}
      confirmText={t("Delete")}
      isOpen={true}
      titleIcon={<ConfirmModalIcon />}
      isLoading={false}
      onConfirm={onConfirm}
      onClose={onClose}
      confirmationContent={
        <React.Fragment>
          <DialogContentText>
            {t("Are you sure you want to delete the notification endpoint ?")}

            <br />
            <b>{serviceName}</b>
            {t("which is")}
            <b>{status}</b>
          </DialogContentText>
        </React.Fragment>
      }
    />
  );
};

export default ConfirmDeleteTargetModal;
