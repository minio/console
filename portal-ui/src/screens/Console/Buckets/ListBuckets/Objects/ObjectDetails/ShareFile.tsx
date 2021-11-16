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
import get from "lodash/get";
import { connect } from "react-redux";
import { Theme } from "@mui/material/styles";
import createStyles from "@mui/styles/createStyles";
import withStyles from "@mui/styles/withStyles";
import CopyToClipboard from "react-copy-to-clipboard";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import LinearProgress from "@mui/material/LinearProgress";
import { modalBasic } from "../../../../Common/FormComponents/common/styleLibrary";
import { CopyIcon } from "../../../../../../icons";
import { IFileInfo } from "./types";
import {
  setModalErrorSnackMessage,
  setModalSnackMessage,
} from "../../../../../../actions";
import { AppState } from "../../../../../../store";
import { ErrorResponseHandler } from "../../../../../../common/types";
import api from "../../../../../../common/api";
import ModalWrapper from "../../../../Common/ModalWrapper/ModalWrapper";
import PredefinedList from "../../../../Common/FormComponents/PredefinedList/PredefinedList";
import DaysSelector from "../../../../Common/FormComponents/DaysSelector/DaysSelector";
import { encodeFileName } from "../../../../../../common/utils";

const styles = (theme: Theme) =>
  createStyles({
    copyButtonContainer: {
      paddingLeft: 16,
      paddingTop: 18,
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
  const [isLoadingVersion, setIsLoadingVersion] = useState<boolean>(true);
  const [isLoadingFile, setIsLoadingFile] = useState<boolean>(false);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [dateValid, setDateValid] = useState<boolean>(true);
  const [versionID, setVersionID] = useState<string>("null");

  const initialDate = new Date();

  const dateChanged = (newDate: string, isValid: boolean) => {
    setDateValid(isValid);
    if (isValid) {
      setSelectedDate(newDate);
      return;
    }
    setSelectedDate("");
    setShareURL("");
  };

  useEffect(() => {
    // In case version is undefined, we get the latest version of the object
    if (dataObject.version_id === undefined) {
      // In case it is not distributed setup, then we default to "null";
      if (distributedSetup) {
        api
          .invoke(
            "GET",
            `/api/v1/buckets/${bucketName}/objects?prefix=${encodeFileName(
              dataObject.name
            )}${distributedSetup ? "&with_versions=true" : ""}`
          )
          .then((res: IFileInfo[]) => {
            const result = get(res, "objects", []);

            const latestVersion = result.find(
              (elem: IFileInfo) => elem.is_latest
            );

            if (latestVersion) {
              setVersionID(latestVersion.version_id);
              return;
            }

            // Version couldn't ve retrieved, we default
            setVersionID("null");
          })
          .catch((error: ErrorResponseHandler) => {
            setModalErrorSnackMessage(error);
          });

        setIsLoadingVersion(false);
        return;
      }
      setVersionID("null");
      setIsLoadingVersion(false);
      return;
    }
    setVersionID(dataObject.version_id || "null");
    setIsLoadingVersion(false);
  }, [bucketName, dataObject, distributedSetup, setModalErrorSnackMessage]);

  useEffect(() => {
    if (dateValid && !isLoadingVersion) {
      setIsLoadingFile(true);
      setShareURL("");

      const slDate = new Date(`${selectedDate}`);
      const currDate = new Date();

      const diffDate = Math.ceil(
        (slDate.getTime() - currDate.getTime()) / 1000
      );

      if (diffDate > 0) {
        api
          .invoke(
            "GET",
            `/api/v1/buckets/${bucketName}/objects/share?prefix=${encodeFileName(
              dataObject.name
            )}&version_id=${versionID}${
              selectedDate !== "" ? `&expires=${diffDate}s` : ""
            }`
          )
          .then((res: string) => {
            setShareURL(res);
            setIsLoadingFile(false);
          })
          .catch((error: ErrorResponseHandler) => {
            setModalErrorSnackMessage(error);
            setShareURL("");
            setIsLoadingFile(false);
          });
      }
    }
  }, [
    dataObject,
    selectedDate,
    bucketName,
    dateValid,
    setShareURL,
    setModalErrorSnackMessage,
    distributedSetup,
    isLoadingVersion,
    versionID,
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
          {isLoadingVersion && (
            <Grid item xs={12}>
              <LinearProgress />
            </Grid>
          )}
          {!isLoadingVersion && (
            <Fragment>
              <Grid item xs={12} className={classes.moduleDescription}>
                This module generates a temporary URL with integrated access
                credentials for sharing objects for up to 7 days.
                <br />
                The temporary URL expires after the configured time limit.
              </Grid>
              <Grid item xs={12} className={classes.dateContainer}>
                <DaysSelector
                  initialDate={initialDate}
                  id="date"
                  label="Active for"
                  maxDays={7}
                  onChange={dateChanged}
                  entity="Link"
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
                      endIcon={<CopyIcon />}
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
            </Fragment>
          )}
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
