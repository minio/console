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
import { useDispatch, useSelector } from "react-redux";
import { Theme } from "@mui/material/styles";
import createStyles from "@mui/styles/createStyles";
import withStyles from "@mui/styles/withStyles";
import CopyToClipboard from "react-copy-to-clipboard";
import Grid from "@mui/material/Grid";
import LinearProgress from "@mui/material/LinearProgress";
import {
  formFieldStyles,
  modalStyleUtils,
} from "../../../../Common/FormComponents/common/styleLibrary";

import { IFileInfo } from "./types";
import { ErrorResponseHandler } from "../../../../../../common/types";
import api from "../../../../../../common/api";
import ModalWrapper from "../../../../Common/ModalWrapper/ModalWrapper";
import PredefinedList from "../../../../Common/FormComponents/PredefinedList/PredefinedList";
import DaysSelector from "../../../../Common/FormComponents/DaysSelector/DaysSelector";
import { encodeURLString } from "../../../../../../common/utils";
import { ShareIcon } from "../../../../../../icons";
import BoxIconButton from "../../../../Common/BoxIconButton/BoxIconButton";
import {
  selDistSet,
  setModalErrorSnackMessage,
  setModalSnackMessage,
} from "../../../../../../systemSlice";

const CopyIcon = React.lazy(() => import("../../../../../../icons/CopyIcon"));

const styles = (theme: Theme) =>
  createStyles({
    shareLinkInfo: {
      fontSize: 14,
      fontWeight: 400,
    },
    copyShareLink: {
      display: "flex",
      "@media (max-width: 900px)": {
        flexFlow: "column",
        alignItems: "center",
        justifyContent: "center",
      },
    },
    copyShareLinkInput: {
      "& div:first-child": {
        marginTop: 0,
      },
      "@media (max-width: 900px)": {
        minWidth: 250,
      },
    },
    copyShareLinkBtn: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      "@media (max-width: 900px)": {
        marginTop: 10,
      },
    },
    ...modalStyleUtils,
    ...formFieldStyles,
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
  const dispatch = useDispatch();
  const distributedSetup = useSelector(selDistSet);
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
            `/api/v1/buckets/${bucketName}/objects?prefix=${encodeURLString(
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
            dispatch(setModalErrorSnackMessage(error));
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
  }, [bucketName, dataObject, distributedSetup, dispatch]);

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
            `/api/v1/buckets/${bucketName}/objects/share?prefix=${encodeURLString(
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
            dispatch(setModalErrorSnackMessage(error));
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
    dispatch,
    distributedSetup,
    isLoadingVersion,
    versionID,
  ]);

  return (
    <React.Fragment>
      <ModalWrapper
        title="Share File"
        titleIcon={<ShareIcon style={{ fill: "#4CCB92" }} />}
        modalOpen={open}
        onClose={() => {
          closeModalAndRefresh();
        }}
      >
        {isLoadingVersion && (
          <Grid item xs={12}>
            <LinearProgress />
          </Grid>
        )}
        {!isLoadingVersion && (
          <Fragment>
            <Grid item xs={12} className={classes.shareLinkInfo}>
              This is a temporary URL with integrated access credentials for
              sharing objects valid for up to 7 days.
              <br />
              <br />
              The temporary URL expires after the configured time limit.
            </Grid>
            <br />
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
            <Grid
              item
              xs={12}
              className={`${classes.copyShareLink} ${classes.formFieldRow} `}
            >
              <Grid item xs={12} className={classes.copyShareLinkInput}>
                <PredefinedList
                  content={shareURL}
                  actionButton={
                    <CopyToClipboard text={shareURL}>
                      <BoxIconButton
                        variant="outlined"
                        onClick={() => {
                          dispatch(
                            setModalSnackMessage(
                              "Share URL Copied to clipboard"
                            )
                          );
                        }}
                        disabled={shareURL === "" || isLoadingFile}
                        sx={{
                          marginRight: "5px",
                          width: "28px",
                          height: "28px",
                          padding: "0px",
                        }}
                      >
                        <CopyIcon />
                      </BoxIconButton>
                    </CopyToClipboard>
                  }
                />
              </Grid>
            </Grid>
          </Fragment>
        )}
      </ModalWrapper>
    </React.Fragment>
  );
};

export default withStyles(styles)(ShareFile);
