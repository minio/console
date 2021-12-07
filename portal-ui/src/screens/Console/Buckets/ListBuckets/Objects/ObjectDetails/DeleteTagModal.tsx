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

import React from "react";
import get from "lodash/get";
import { connect } from "react-redux";
import { DialogContentText } from "@mui/material";
import { Theme } from "@mui/material/styles";
import createStyles from "@mui/styles/createStyles";
import withStyles from "@mui/styles/withStyles";
import { setErrorSnackMessage } from "../../../../../../actions";
import { AppState } from "../../../../../../store";
import { ErrorResponseHandler } from "../../../../../../common/types";
import { encodeFileName } from "../../../../../../common/utils";
import useApi from "../../../../Common/Hooks/useApi";
import ConfirmDialog from "../../../../Common/ModalWrapper/ConfirmDialog";

interface IDeleteTagModal {
  deleteOpen: boolean;
  currentTags: any;
  bucketName: string;
  versionId: string | null;
  selectedTag: string[];
  onCloseAndUpdate: (refresh: boolean) => void;
  selectedObject: string;
  distributedSetup: boolean;
  setErrorSnackMessage: typeof setErrorSnackMessage;
  classes: any;
}

const styles = (theme: Theme) =>
  createStyles({
    buttonContainer: {
      textAlign: "right",
    },
    pathLabel: {
      marginTop: 0,
      marginBottom: 32,
    },
  });

const DeleteTagModal = ({
  deleteOpen,
  currentTags,
  selectedObject,
  selectedTag,
  onCloseAndUpdate,
  bucketName,
  versionId,
  distributedSetup,
  setErrorSnackMessage,
  classes,
}: IDeleteTagModal) => {
  const [tagKey, tagLabel] = selectedTag;

  const onDelSuccess = () => onCloseAndUpdate(true);
  const onDelError = (err: ErrorResponseHandler) => setErrorSnackMessage(err);
  const onClose = () => onCloseAndUpdate(false);

  const [deleteLoading, invokeDeleteApi] = useApi(onDelSuccess, onDelError);

  if (!selectedTag) {
    return null;
  }

  const onConfirmDelete = () => {
    const cleanObject = { ...currentTags };
    delete cleanObject[tagKey];

    const verID = distributedSetup ? versionId : "null";

    invokeDeleteApi(
      "PUT",
      `/api/v1/buckets/${bucketName}/objects/tags?prefix=${encodeFileName(
        selectedObject
      )}&version_id=${verID}`,
      { tags: cleanObject }
    );
  };

  return (
    <ConfirmDialog
      title={`Delete Tag`}
      confirmText={"Delete"}
      isOpen={deleteOpen}
      isLoading={deleteLoading}
      onConfirm={onConfirmDelete}
      onClose={onClose}
      confirmationContent={
        <DialogContentText>
          Are you sure you want to delete the tag{" "}
          <b className={classes.wrapText}>
            {tagKey} : {tagLabel}
          </b>{" "}
          from {selectedObject}?
        </DialogContentText>
      }
    />
  );
};

const mapStateToProps = ({ system }: AppState) => ({
  distributedSetup: get(system, "distributedSetup", false),
});

const mapDispatchToProps = {
  setErrorSnackMessage,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

export default withStyles(styles)(connector(DeleteTagModal));
