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

import { t } from "i18next";
import React, { useState } from "react";
import { Button } from "mds";
import { Grid } from "@mui/material";
import { Theme } from "@mui/material/styles";
import createStyles from "@mui/styles/createStyles";
import withStyles from "@mui/styles/withStyles";
import {
  formFieldStyles,
  modalStyleUtils,
  spacingUtils,
} from "../../Common/FormComponents/common/styleLibrary";
import { ErrorResponseHandler } from "../../../../common/types";
import InputBoxWrapper from "../../Common/FormComponents/InputBoxWrapper/InputBoxWrapper";
import ModalWrapper from "../../Common/ModalWrapper/ModalWrapper";
import api from "../../../../common/api";
import { AddNewTagIcon } from "../../../../icons";
import { setModalErrorSnackMessage } from "../../../../systemSlice";
import { useAppDispatch } from "../../../../store";

interface IBucketTagModal {
  modalOpen: boolean;
  currentTags: any;
  bucketName: string;
  onCloseAndUpdate: (refresh: boolean) => void;

  classes: any;
}

const styles = (theme: Theme) =>
  createStyles({
    ...formFieldStyles,
    ...modalStyleUtils,
    ...spacingUtils,
  });

const AddBucketTagModal = ({
  modalOpen,
  currentTags,
  onCloseAndUpdate,
  bucketName,

  classes,
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

    api
      .invoke("PUT", `/api/v1/buckets/${bucketName}/tags`, {
        tags: newTagList,
      })
      .then((res: any) => {
        setIsSending(false);
        onCloseAndUpdate(true);
      })
      .catch((error: ErrorResponseHandler) => {
        dispatch(setModalErrorSnackMessage(error));
        setIsSending(false);
      });
  };

  return (
    <ModalWrapper
      modalOpen={modalOpen}
      title={`${t("Add New Tag")}`}
      onClose={() => {
        onCloseAndUpdate(false);
      }}
      titleIcon={<AddNewTagIcon />}
    >
      <Grid container>
        <div className={classes.spacerBottom}>
          <strong>{t("Bucket")}</strong>: {bucketName}
        </div>
        <Grid item xs={12} className={classes.formFieldRow}>
          <InputBoxWrapper
            value={newKey}
            label={t("New Tag Key")}
            id={"newTagKey"}
            name={"newTagKey"}
            placeholder={t("Enter New Tag Key")}
            onChange={(e: any) => {
              setNewKey(e.target.value);
            }}
          />
        </Grid>
        <Grid item xs={12} className={classes.formFieldRow}>
          <InputBoxWrapper
            value={newLabel}
            label={t("New Tag Label")}
            id={"newTagLabel"}
            name={"newTagLabel"}
            placeholder={t("Enter New Tag Label")}
            onChange={(e: any) => {
              setNewLabel(e.target.value);
            }}
          />
        </Grid>
        <Grid item xs={12} className={classes.modalButtonBar}>
          <Button
            id={"clear"}
            type="button"
            variant="regular"
            onClick={resetForm}
            label={t("Clear")}
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
            label={t("Save")}
          />
        </Grid>
      </Grid>
    </ModalWrapper>
  );
};

export default withStyles(styles)(AddBucketTagModal);
