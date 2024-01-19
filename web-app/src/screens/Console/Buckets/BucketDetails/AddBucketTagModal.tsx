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

import React, { useState } from "react";
import { AddNewTagIcon, Box, Button, FormLayout, Grid, InputBox } from "mds";
import { modalStyleUtils } from "../../Common/FormComponents/common/styleLibrary";
import ModalWrapper from "../../Common/ModalWrapper/ModalWrapper";
import { setModalErrorSnackMessage } from "../../../../systemSlice";
import { useAppDispatch } from "../../../../store";
import { api } from "api";
import { errorToHandler } from "api/errors";

interface IBucketTagModal {
  modalOpen: boolean;
  currentTags: any;
  bucketName: string;
  onCloseAndUpdate: (refresh: boolean) => void;
}

const AddBucketTagModal = ({
  modalOpen,
  currentTags,
  onCloseAndUpdate,
  bucketName,
}: IBucketTagModal) => {
  const dispatch = useAppDispatch();
  const [newKey, setNewKey] = useState<string>("");
  const [newLabel, setNewLabel] = useState<string>("");
  const [isSending, setIsSending] = useState<boolean>(false);

  const resetForm = () => {
    setNewLabel("");
    setNewKey("");
  };

  const addTagProcess = () => {
    setIsSending(true);
    const newTag: any = {};

    newTag[newKey] = newLabel;
    const newTagList = { ...currentTags, ...newTag };

    api.buckets
      .putBucketTags(bucketName, {
        tags: newTagList,
      })
      .then(() => {
        setIsSending(false);
        onCloseAndUpdate(true);
      })
      .catch((error) => {
        dispatch(setModalErrorSnackMessage(errorToHandler(error.error)));
        setIsSending(false);
      });
  };

  return (
    <ModalWrapper
      modalOpen={modalOpen}
      title={`Add New Tag `}
      onClose={() => {
        onCloseAndUpdate(false);
      }}
      titleIcon={<AddNewTagIcon />}
    >
      <FormLayout withBorders={false} containerPadding={false}>
        <Box sx={{ marginBottom: 15 }}>
          <strong>Bucket</strong>: {bucketName}
        </Box>
        <InputBox
          value={newKey}
          label={"New Tag Key"}
          id={"newTagKey"}
          name={"newTagKey"}
          placeholder={"Enter New Tag Key"}
          onChange={(e: any) => {
            setNewKey(e.target.value);
          }}
        />
        <InputBox
          value={newLabel}
          label={"New Tag Label"}
          id={"newTagLabel"}
          name={"newTagLabel"}
          placeholder={"Enter New Tag Label"}
          onChange={(e: any) => {
            setNewLabel(e.target.value);
          }}
        />
        <Grid item xs={12} sx={modalStyleUtils.modalButtonBar}>
          <Button
            id={"clear"}
            type="button"
            variant="regular"
            onClick={resetForm}
            label={"Clear"}
          />
          <Button
            id={"save-add-bucket-tag"}
            type="submit"
            variant="callAction"
            color="primary"
            disabled={
              newLabel.trim() === "" || newKey.trim() === "" || isSending
            }
            onClick={addTagProcess}
            label={"Save"}
          />
        </Grid>
      </FormLayout>
    </ModalWrapper>
  );
};

export default AddBucketTagModal;
