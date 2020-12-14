import React, { useState, useEffect } from "react";
import { createStyles, Theme, withStyles } from "@material-ui/core/styles";
import CopyToClipboard from "react-copy-to-clipboard";
import Typography from "@material-ui/core/Typography";
import Snackbar from "@material-ui/core/Snackbar";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import { modalBasic } from "../../../../Common/FormComponents/common/styleLibrary";
import ModalWrapper from "../../../../Common/ModalWrapper/ModalWrapper";
import DateSelector from "../../../../Common/FormComponents/DateSelector/DateSelector";
import { CopyIcon } from "../../../../../../icons";
import api from "../../../../../../common/api";
import { IFileInfo } from "./types";
import PredefinedList from "../../../../Common/FormComponents/PredefinedList/PredefinedList";

const styles = (theme: Theme) =>
  createStyles({
    copyButtonContainer: {
      paddingLeft: 16,
    },
    modalContent: {
      paddingBottom: 53,
    },
    errorBlock: {
      color: "red",
    },
    ...modalBasic,
  });

interface IShareFileProps {
  classes: any;
  open: boolean;
  bucketName: string;
  dataObject: IFileInfo;
  closeModalAndRefresh: () => void;
}

const ShareFile = ({
  classes,
  open,
  closeModalAndRefresh,
  bucketName,
  dataObject,
}: IShareFileProps) => {
  const [shareURL, setShareURL] = useState<string>("");
  const [isLoadingFile, setIsLoadingFile] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [dateValid, setDateValid] = useState<boolean>(true);
  const [openSnack, setOpenSnack] = useState<boolean>(false);
  const [snackBarMessage, setSnackbarMessage] = useState<string>("");

  const showSnackBarMessage = (text: string) => {
    setSnackbarMessage(text);
    setOpenSnack(true);
  };

  const closeSnackBar = () => {
    setSnackbarMessage("");
    setOpenSnack(false);
  };

  const dateChanged = (newDate: string, isValid: boolean) => {
    setDateValid(isValid);
    if (isValid) {
      setSelectedDate(newDate);
      return;
    }
    setSelectedDate("");
  };

  useEffect(() => {
    if (dateValid) {
      setIsLoadingFile(true);
      setShareURL("");

      const slDate = new Date(`${selectedDate}T23:59:59`);
      const currDate = new Date();

      const diffDate = slDate.getTime() - currDate.getTime();

      if (diffDate < 0) {
        setError("Selected date must be greater than current time.");
        setShareURL("");
        setIsLoadingFile(false);

        return;
      }

      if (diffDate > 604800000) {
        setError("You can share a file only for less than 7 days.");
        setShareURL("");
        setIsLoadingFile(false);

        return;
      }

      api
        .invoke(
          "GET",
          `/api/v1/buckets/${bucketName}/objects/share?prefix=${
            dataObject.name
          }&version_id=${dataObject.version_id}${
            selectedDate !== "" ? `&expires=${diffDate}ms` : ""
          }`
        )
        .then((res: string) => {
          setShareURL(res);
          setError("");
          setIsLoadingFile(false);
        })
        .catch((error) => {
          setError(error);
          setShareURL("");
          setIsLoadingFile(false);
        });
      return;
    }
  }, [dataObject, selectedDate, bucketName, dateValid, setShareURL]);

  const snackBarAction = (
    <Button
      color="secondary"
      size="small"
      onClick={() => {
        closeSnackBar();
      }}
    >
      Dismiss
    </Button>
  );

  return (
    <React.Fragment>
      {openSnack && (
        <Snackbar
          open={openSnack}
          message={snackBarMessage}
          action={snackBarAction}
        />
      )}
      <ModalWrapper
        title="Share File"
        modalOpen={open}
        onClose={() => {
          closeModalAndRefresh();
        }}
      >
        <Grid container className={classes.modalContent}>
          {error !== "" && (
            <Grid item xs={12}>
              <Typography
                component="p"
                variant="body1"
                className={classes.errorBlock}
              >
                {error}
              </Typography>
            </Grid>
          )}
          <Grid item xs={12} className={classes.dateContainer}>
            <DateSelector
              id="date"
              label="Active until"
              borderBottom={false}
              addSwitch={true}
              onDateChange={dateChanged}
            />
          </Grid>
          <Grid container item xs={12}>
            <Grid item xs={10}>
              <PredefinedList content={shareURL} />
            </Grid>
            <Grid item xs={2} className={classes.copyButtonContainer}>
              <CopyToClipboard text={shareURL}>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<CopyIcon />}
                  onClick={() => {
                    showSnackBarMessage("Share URL Copied to clipboard");
                  }}
                  disabled={shareURL === "" || isLoadingFile}
                >
                  Copy
                </Button>
              </CopyToClipboard>
            </Grid>
          </Grid>
        </Grid>
      </ModalWrapper>
    </React.Fragment>
  );
};

export default withStyles(styles)(ShareFile);
