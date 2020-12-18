import React, { useEffect, useState } from "react";
import { createStyles, Theme, withStyles } from "@material-ui/core/styles";
import CopyToClipboard from "react-copy-to-clipboard";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import { modalBasic } from "../../../../Common/FormComponents/common/styleLibrary";
import ModalWrapper from "../../../../Common/ModalWrapper/ModalWrapper";
import DateSelector from "../../../../Common/FormComponents/DateSelector/DateSelector";
import { CopyIcon } from "../../../../../../icons";
import api from "../../../../../../common/api";
import { IFileInfo } from "./types";
import PredefinedList from "../../../../Common/FormComponents/PredefinedList/PredefinedList";
import ErrorBlock from "../../../../../shared/ErrorBlock";
import { setSnackBarMessage } from "../../../../../../actions";
import { connect } from "react-redux";

const styles = (theme: Theme) =>
  createStyles({
    copyButtonContainer: {
      paddingLeft: 16,
    },
    modalContent: {
      paddingBottom: 53,
    },
    ...modalBasic,
  });

interface IShareFileProps {
  classes: any;
  open: boolean;
  bucketName: string;
  dataObject: IFileInfo;
  closeModalAndRefresh: () => void;
  setSnackBarMessage: typeof setSnackBarMessage;
}

const ShareFile = ({
  classes,
  open,
  closeModalAndRefresh,
  bucketName,
  dataObject,
  setSnackBarMessage,
}: IShareFileProps) => {
  const [shareURL, setShareURL] = useState<string>("");
  const [isLoadingFile, setIsLoadingFile] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [dateValid, setDateValid] = useState<boolean>(true);

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

  return (
    <React.Fragment>
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
              <ErrorBlock errorMessage={error} withBreak={false} />
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
                    setSnackBarMessage("Share URL Copied to clipboard");
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

const mapState = (state: IShareFileProps) => ({});

const connector = connect(mapState, {
  setSnackBarMessage,
});

export default withStyles(styles)(connector(ShareFile));
