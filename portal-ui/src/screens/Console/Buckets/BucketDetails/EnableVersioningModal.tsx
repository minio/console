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

import React, { Fragment, useState } from "react";
import { DialogContentText } from "@mui/material";

import ConfirmDialog from "../../Common/ModalWrapper/ConfirmDialog";
import { ConfirmModalIcon } from "mds";

import { setErrorSnackMessage } from "../../../../systemSlice";
import { useAppDispatch } from "../../../../store";
import VersioningInfo from "../VersioningInfo";
import { BucketVersioningResponse } from "api/consoleApi";
import { api } from "api";
import { errorToHandler } from "api/errors";

interface IVersioningEventProps {
  closeVersioningModalAndRefresh: (refresh: boolean) => void;
  modalOpen: boolean;
  selectedBucket: string;
  versioningInfo: BucketVersioningResponse | undefined;
}

const EnableVersioningModal = ({
  closeVersioningModalAndRefresh,
  modalOpen,
  selectedBucket,
  versioningInfo = {},
}: IVersioningEventProps) => {
  const isVersioningEnabled = versioningInfo.status === "Enabled";

  const dispatch = useAppDispatch();
  const [versioningLoading, setVersioningLoading] = useState<boolean>(false);

  const enableVersioning = () => {
    if (versioningLoading) {
      return;
    }
    setVersioningLoading(true);

    api.buckets
      .setBucketVersioning(selectedBucket, {
        versioning: !isVersioningEnabled,
      })
      .then(() => {
        setVersioningLoading(false);
        closeVersioningModalAndRefresh(true);
      })
      .catch((err) => {
        setVersioningLoading(false);
        dispatch(setErrorSnackMessage(errorToHandler(err.error)));
      });
  };

  return (
    <ConfirmDialog
      title={`Versioning on Bucket`}
      confirmText={isVersioningEnabled ? "Suspend" : "Enable"}
      isOpen={modalOpen}
      isLoading={versioningLoading}
      titleIcon={<ConfirmModalIcon />}
      onConfirm={enableVersioning}
      confirmButtonProps={{
        variant: "callAction",
      }}
      onClose={() => {
        closeVersioningModalAndRefresh(false);
      }}
      confirmationContent={
        <DialogContentText id="alert-dialog-description">
          Are you sure you want to{" "}
          <strong>{isVersioningEnabled ? "suspend" : "enable"}</strong>{" "}
          versioning for this bucket?
          {isVersioningEnabled && (
            <Fragment>
              <br />
              <br />
              <strong>File versions won't be automatically deleted.</strong>
            </Fragment>
          )}
          <div
            style={{
              paddingTop: "20px",
            }}
          >
            {isVersioningEnabled ? (
              <VersioningInfo versioningState={versioningInfo} />
            ) : null}
          </div>
        </DialogContentText>
      }
    />
  );
};

export default EnableVersioningModal;
