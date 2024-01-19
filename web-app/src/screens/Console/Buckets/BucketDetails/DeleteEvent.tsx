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

import React, { Fragment } from "react";
import get from "lodash/get";
import { ErrorResponseHandler } from "../../../../common/types";
import useApi from "../../Common/Hooks/useApi";
import ConfirmDialog from "../../Common/ModalWrapper/ConfirmDialog";
import { ConfirmDeleteIcon } from "mds";
import { setErrorSnackMessage } from "../../../../systemSlice";
import { useAppDispatch } from "../../../../store";
import { NotificationConfig } from "api/consoleApi";

interface IDeleteEventProps {
  closeDeleteModalAndRefresh: (refresh: boolean) => void;
  deleteOpen: boolean;
  selectedBucket: string;
  bucketEvent: NotificationConfig | null;
}

const DeleteEvent = ({
  closeDeleteModalAndRefresh,
  deleteOpen,
  selectedBucket,
  bucketEvent,
}: IDeleteEventProps) => {
  const dispatch = useAppDispatch();
  const onDelSuccess = () => closeDeleteModalAndRefresh(true);
  const onDelError = (err: ErrorResponseHandler) =>
    dispatch(setErrorSnackMessage(err));
  const onClose = () => closeDeleteModalAndRefresh(false);

  const [deleteLoading, invokeDeleteApi] = useApi(onDelSuccess, onDelError);

  if (!selectedBucket) {
    return null;
  }

  const onConfirmDelete = () => {
    if (bucketEvent === null) {
      return;
    }

    const events: string[] = get(bucketEvent, "events", []);
    const prefix = get(bucketEvent, "prefix", "");
    const suffix = get(bucketEvent, "suffix", "");

    const cleanEvents = events.reduce((acc: string[], currVal: string) => {
      if (!acc.includes(currVal)) {
        return [...acc, currVal];
      }
      return acc;
    }, []);

    invokeDeleteApi(
      "DELETE",
      `/api/v1/buckets/${selectedBucket}/events/${bucketEvent.arn}`,
      {
        events: cleanEvents,
        prefix,
        suffix,
      },
    );
  };

  return (
    <ConfirmDialog
      title={`Delete Event`}
      confirmText={"Delete"}
      isOpen={deleteOpen}
      titleIcon={<ConfirmDeleteIcon />}
      isLoading={deleteLoading}
      onConfirm={onConfirmDelete}
      onClose={onClose}
      confirmationContent={
        <Fragment>Are you sure you want to delete this event?</Fragment>
      }
    />
  );
};

export default DeleteEvent;
