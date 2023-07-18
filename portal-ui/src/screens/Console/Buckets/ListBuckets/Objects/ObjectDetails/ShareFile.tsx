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
import { useSelector } from "react-redux";
import { Button, CopyIcon, ReadBox, ShareIcon, Grid } from "mds";
import CopyToClipboard from "react-copy-to-clipboard";
import LinearProgress from "@mui/material/LinearProgress";

import ModalWrapper from "../../../../Common/ModalWrapper/ModalWrapper";
import DaysSelector from "../../../../Common/FormComponents/DaysSelector/DaysSelector";
import { encodeURLString } from "../../../../../../common/utils";
import {
  selDistSet,
  setModalErrorSnackMessage,
  setModalSnackMessage,
} from "../../../../../../systemSlice";
import { useAppDispatch } from "../../../../../../store";
import { BucketObject } from "api/consoleApi";
import { api } from "api";
import { errorToHandler } from "api/errors";

interface IShareFileProps {
  open: boolean;
  bucketName: string;
  dataObject: BucketObject;
  closeModalAndRefresh: () => void;
}

const ShareFile = ({
  open,
  closeModalAndRefresh,
  bucketName,
  dataObject,
}: IShareFileProps) => {
  const dispatch = useAppDispatch();
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
        api.buckets
          .listObjects(bucketName, {
            prefix: encodeURLString(dataObject.name || ""),
            with_versions: distributedSetup,
          })
          .then((res) => {
            const result: BucketObject[] = res.data.objects || [];

            const latestVersion: BucketObject | undefined = result.find(
              (elem: BucketObject) => elem.is_latest,
            );

            if (latestVersion) {
              setVersionID(`${latestVersion.version_id}`);
              return;
            }

            // Version couldn't be retrieved, we default
            setVersionID("null");
          })
          .catch((err) => {
            dispatch(setModalErrorSnackMessage(errorToHandler(err.error)));
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
        (slDate.getTime() - currDate.getTime()) / 1000,
      );

      if (diffDate > 0) {
        api.buckets
          .shareObject(bucketName, {
            prefix: encodeURLString(dataObject.name || ""),
            version_id: versionID,
            expires: selectedDate !== "" ? `${diffDate}s` : "",
          })
          .then((res) => {
            setShareURL(res.data);
            setIsLoadingFile(false);
          })
          .catch((err) => {
            dispatch(setModalErrorSnackMessage(errorToHandler(err.error)));
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
            <Grid
              item
              xs={12}
              sx={{
                fontSize: 14,
                fontWeight: 400,
              }}
            >
              This is a temporary URL with integrated access credentials for
              sharing objects valid for up to 7 days.
              <br />
              <br />
              The temporary URL expires after the configured time limit.
            </Grid>
            <br />
            <Grid item xs={12}>
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
              sx={{
                marginBottom: 10,
              }}
            >
              <ReadBox
                actionButton={
                  <CopyToClipboard text={shareURL}>
                    <Button
                      id={"copy-path"}
                      variant="regular"
                      onClick={() => {
                        dispatch(
                          setModalSnackMessage("Share URL Copied to clipboard"),
                        );
                      }}
                      disabled={shareURL === "" || isLoadingFile}
                      style={{
                        width: "28px",
                        height: "28px",
                        padding: "0px",
                      }}
                      icon={<CopyIcon />}
                    />
                  </CopyToClipboard>
                }
              >
                {shareURL}
              </ReadBox>
            </Grid>
          </Fragment>
        )}
      </ModalWrapper>
    </React.Fragment>
  );
};

export default ShareFile;
