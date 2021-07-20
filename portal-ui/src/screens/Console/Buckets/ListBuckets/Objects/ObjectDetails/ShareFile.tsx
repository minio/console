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

import React, { useEffect, useState } from "react";
import get from "lodash/get";
import { connect } from "react-redux";
import { createStyles, Theme, withStyles } from "@material-ui/core/styles";
import CopyToClipboard from "react-copy-to-clipboard";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import { modalBasic } from "../../../../Common/FormComponents/common/styleLibrary";
import { CopyIcon } from "../../../../../../icons";
import { IFileInfo } from "./types";
import {
  setModalErrorSnackMessage,
  setModalSnackMessage,
} from "../../../../../../actions";
import api from "../../../../../../common/api";
import ModalWrapper from "../../../../Common/ModalWrapper/ModalWrapper";
import DateSelector from "../../../../Common/FormComponents/DateSelector/DateSelector";
import PredefinedList from "../../../../Common/FormComponents/PredefinedList/PredefinedList";
import { AppState } from "../../../../../../store";

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
  distributedSetup: boolean;
  closeModalAndRefresh: () => void;
  setModalSnackMessage: typeof setModalSnackMessage;
  setModalErrorSnackMessage: typeof setModalErrorSnackMessage;
}

const ShareFile = ({
  classes,
  open,
  closeModalAndRefresh,
  bucketName,
  dataObject,
  distributedSetup,
  setModalSnackMessage,
  setModalErrorSnackMessage,
}: IShareFileProps) => {
  const [shareURL, setShareURL] = useState<string>("");
  const [isLoadingFile, setIsLoadingFile] = useState<boolean>(false);
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

      const versID = distributedSetup ? dataObject.version_id : "null";

      if (diffDate < 0) {
        setModalErrorSnackMessage(
          "Selected date must be greater than current time."
        );
        setShareURL("");
        setIsLoadingFile(false);

        return;
      }

      if (diffDate > 604800000) {
        setModalErrorSnackMessage(
          "You can share a file only for less than 7 days."
        );
        setShareURL("");
        setIsLoadingFile(false);

        return;
      }

      api
        .invoke(
          "GET",
          `/api/v1/buckets/${bucketName}/objects/share?prefix=${
            dataObject.name
          }&version_id=${versID}${
            selectedDate !== "" ? `&expires=${diffDate}ms` : ""
          }`
        )
        .then((res: string) => {
          setShareURL(res);
          setIsLoadingFile(false);
        })
        .catch((error) => {
          setModalErrorSnackMessage(error);
          setShareURL("");
          setIsLoadingFile(false);
        });
      return;
    }
  }, [
    dataObject,
    selectedDate,
    bucketName,
    dateValid,
    setShareURL,
    setModalErrorSnackMessage,
    distributedSetup,
  ]);

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
                    setModalSnackMessage("Share URL Copied to clipboard");
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

const mapStateToProps = ({ system }: AppState) => ({
  distributedSetup: get(system, "distributedSetup", false),
});

const connector = connect(mapStateToProps, {
  setModalSnackMessage,
  setModalErrorSnackMessage,
});

export default withStyles(styles)(connector(ShareFile));
