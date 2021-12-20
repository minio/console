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
import get from "lodash/get";
import { connect } from "react-redux";
import { Button, Grid } from "@mui/material";
import { Theme } from "@mui/material/styles";
import createStyles from "@mui/styles/createStyles";
import withStyles from "@mui/styles/withStyles";
import { setModalErrorSnackMessage } from "../../../../../../actions";
import { AppState } from "../../../../../../store";
import { ErrorResponseHandler } from "../../../../../../common/types";
import InputBoxWrapper from "../../../../Common/FormComponents/InputBoxWrapper/InputBoxWrapper";
import ModalWrapper from "../../../../Common/ModalWrapper/ModalWrapper";
import api from "../../../../../../common/api";
import { decodeFileName } from "../../../../../../common/utils";
import {
  formFieldStyles,
  modalStyleUtils,
  spacingUtils,
} from "../../../../Common/FormComponents/common/styleLibrary";
import { AddNewTagIcon } from "../../../../../../icons";

interface ITagModal {
  modalOpen: boolean;
  currentTags: any;
  bucketName: string;
  versionId: string | null;
  onCloseAndUpdate: (refresh: boolean) => void;
  selectedObject: string;
  distributedSetup: boolean;
  setModalErrorSnackMessage: typeof setModalErrorSnackMessage;
  classes: any;
}

const styles = (theme: Theme) =>
  createStyles({
    pathLabel: {
      marginTop: 0,
      marginBottom: 32,
    },
    ...formFieldStyles,
    ...modalStyleUtils,
    ...spacingUtils,
  });

const AddTagModal = ({
  modalOpen,
  currentTags,
  selectedObject,
  onCloseAndUpdate,
  bucketName,
  versionId,
  distributedSetup,
  setModalErrorSnackMessage,
  classes,
}: ITagModal) => {
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

    const verID = distributedSetup ? versionId : "null";

    api
      .invoke(
        "PUT",
        `/api/v1/buckets/${bucketName}/objects/tags?prefix=${selectedObject}&version_id=${verID}`,
        { tags: newTagList }
      )
      .then((res: any) => {
        setIsSending(false);
        onCloseAndUpdate(true);
      })
      .catch((error: ErrorResponseHandler) => {
        setModalErrorSnackMessage(error);
        setIsSending(false);
      });
  };

  return (
    <React.Fragment>
      <ModalWrapper
        modalOpen={modalOpen}
        title="Add New Tag to the Object"
        onClose={() => {
          onCloseAndUpdate(false);
        }}
        titleIcon={<AddNewTagIcon />}
      >
        <Grid container>
          <div className={classes.spacerBottom}>
            <strong>Selected Object</strong>: {decodeFileName(selectedObject)}
          </div>
          <Grid item xs={12} className={classes.formFieldRow}>
            <InputBoxWrapper
              value={newKey}
              label={"Tag Key"}
              id={"newTagKey"}
              name={"newTagKey"}
              placeholder={"Enter Tag Key"}
              onChange={(e) => {
                setNewKey(e.target.value);
              }}
            />
          </Grid>
          <Grid item xs={12} className={classes.formFieldRow}>
            <InputBoxWrapper
              value={newLabel}
              label={"Tag Label"}
              id={"newTagLabel"}
              name={"newTagLabel"}
              placeholder={"Enter Tag Label"}
              onChange={(e) => {
                setNewLabel(e.target.value);
              }}
            />
          </Grid>
          <Grid item xs={12} className={classes.modalButtonBar}>
            <Button
              type="button"
              variant="outlined"
              color="primary"
              onClick={resetForm}
            >
              Clear
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={
                newLabel.trim() === "" || newKey.trim() === "" || isSending
              }
              onClick={addTagProcess}
            >
              Save
            </Button>
          </Grid>
        </Grid>
      </ModalWrapper>
    </React.Fragment>
  );
};

const mapStateToProps = ({ system }: AppState) => ({
  distributedSetup: get(system, "distributedSetup", false),
});

const mapDispatchToProps = {
  setModalErrorSnackMessage,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

export default withStyles(styles)(connector(AddTagModal));
