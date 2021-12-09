import React from "react";
import {
  Button,
  ButtonProps,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { Theme } from "@mui/material/styles";
import createStyles from "@mui/styles/createStyles";
import withStyles from "@mui/styles/withStyles";
import { deleteDialogStyles } from "../FormComponents/common/styleLibrary";

const styles = (theme: Theme) =>
  createStyles({
    ...deleteDialogStyles,
  });

type ConfirmDialogProps = {
  isOpen?: boolean;
  onClose: () => void;
  onCancel?: () => void;
  onConfirm: () => void;
  classes?: any;
  title: string;
  isLoading?: boolean;
  confirmationContent: React.ReactNode | React.ReactNode[];
  cancelText?: string;
  confirmText?: string;
  confirmButtonProps?: Partial<ButtonProps>;
  cancelButtonProps?: Partial<ButtonProps>;
};

const ConfirmDialog = ({
  isOpen = false,
  onClose,
  onCancel,
  onConfirm,
  classes = {},
  title = "",
  isLoading,
  confirmationContent,
  cancelText = "Cancel",
  confirmText = "Confirm",
  confirmButtonProps = {},
  cancelButtonProps = {},
}: ConfirmDialogProps) => {
  return (
    <Dialog
      open={isOpen}
      onClose={(event, reason) => {
        if (reason !== "backdropClick") {
          onClose(); // close on Esc but not on click outside
        }
      }}
      className={classes.root}
      onBackdropClick={() => {
        return false;
      }}
      sx={{
        "& .MuiPaper-root": {
          padding: "1rem 2rem 2rem 1rem",
        },
      }}
    >
      <DialogTitle className={classes.title}>
        <div className={classes.titleText}>{title}</div>
        <div className={classes.closeContainer}>
          <IconButton
            aria-label="close"
            className={classes.closeButton}
            onClick={onClose}
            disableRipple
            size="small"
          >
            <CloseIcon />
          </IconButton>
        </div>
      </DialogTitle>

      <DialogContent className={classes.content}>
        {confirmationContent}
      </DialogContent>
      <DialogActions className={classes.actions}>
        <Button
          className={classes.cancelButton}
          onClick={onCancel || onClose}
          disabled={isLoading}
          type="button"
          {...cancelButtonProps}
          variant="outlined"
          color="primary"
        >
          {cancelText}
        </Button>

        <LoadingButton
          className={classes.confirmButton}
          type="button"
          onClick={onConfirm}
          loading={isLoading}
          disabled={isLoading}
          {...confirmButtonProps}
          variant="outlined"
          color="secondary"
          loadingPosition="start"
          startIcon={null}
          autoFocus
        >
          {confirmText}
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
};

export default withStyles(styles)(ConfirmDialog);
