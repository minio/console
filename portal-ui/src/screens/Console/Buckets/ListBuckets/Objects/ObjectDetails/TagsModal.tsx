// This file is part of MinIO Console Server
// Copyright (c) 2022 MinIO, Inc.
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
import get from "lodash/get";
import { useSelector } from "react-redux";
import { Box, Grid } from "@mui/material";
import { Button } from "mds";
import { Theme } from "@mui/material/styles";
import createStyles from "@mui/styles/createStyles";
import withStyles from "@mui/styles/withStyles";
import { ErrorResponseHandler } from "../../../../../../common/types";
import InputBoxWrapper from "../../../../Common/FormComponents/InputBoxWrapper/InputBoxWrapper";
import ModalWrapper from "../../../../Common/ModalWrapper/ModalWrapper";
import api from "../../../../../../common/api";
import { encodeURLString } from "../../../../../../common/utils";
import {
  formFieldStyles,
  modalStyleUtils,
  spacingUtils,
} from "../../../../Common/FormComponents/common/styleLibrary";
import {
  AddNewTagIcon,
  DisabledIcon,
  EditTagIcon,
} from "../../../../../../icons";
import { IFileInfo } from "./types";
import { IAM_SCOPES } from "../../../../../../common/SecureComponent/permissions";
import { SecureComponent } from "../../../../../../common/SecureComponent";
import Chip from "@mui/material/Chip";
import CloseIcon from "@mui/icons-material/Close";
import {
  selDistSet,
  setModalErrorSnackMessage,
} from "../../../../../../systemSlice";
import { useAppDispatch } from "../../../../../../store";

interface ITagModal {
  modalOpen: boolean;
  bucketName: string;
  actualInfo: IFileInfo;
  onCloseAndUpdate: (refresh: boolean) => void;
  classes: any;
}

const styles = (theme: Theme) =>
  createStyles({
    newTileHeader: {
      fontSize: 18,
      fontWeight: "bold",
      color: "#000",
      margin: "35px 0",
      paddingBottom: 15,
      display: "flex",
      alignItems: "center",
      "& > svg": {
        marginRight: 10,
      },
    },
    tagsForLabel: {
      fontSize: 16,
      margin: "20px 0 30px",
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis",
      width: "100%",
    },
    currentTagsContainer: {
      fontSize: 14,
      fontWeight: "normal",
    },
    noTagsForObject: {
      color: "#858585",
    },
    deleteTag: {
      color: "#C83B51",
      marginLeft: 5,
    },
    ...formFieldStyles,
    ...modalStyleUtils,
    ...spacingUtils,
  });

const AddTagModal = ({
  modalOpen,
  onCloseAndUpdate,
  bucketName,
  actualInfo,
  classes,
}: ITagModal) => {
  const dispatch = useAppDispatch();
  const distributedSetup = useSelector(selDistSet);
  const [newKey, setNewKey] = useState<string>("");
  const [newLabel, setNewLabel] = useState<string>("");
  const [isSending, setIsSending] = useState<boolean>(false);
  const [deleteEnabled, setDeleteEnabled] = useState<boolean>(false);
  const [deleteKey, setDeleteKey] = useState<string>("");
  const [deleteLabel, setDeleteLabel] = useState<string>("");

  const selectedObject = encodeURLString(actualInfo.name);
  const currentTags = actualInfo.tags;
  const currTagKeys = Object.keys(currentTags || {});

  const allPathData = actualInfo.name.split("/");
  const currentItem = allPathData.pop() || "";

  const resetForm = () => {
    setNewLabel("");
    setNewKey("");
  };

  const addTagProcess = () => {
    setIsSending(true);
    const newTag: any = {};

    newTag[newKey] = newLabel;
    const newTagList = { ...currentTags, ...newTag };

    const verID = distributedSetup ? actualInfo.version_id : "null";

    api
      .invoke(
        "PUT",
        `/api/v1/buckets/${bucketName}/objects/tags?prefix=${selectedObject}&version_id=${verID}`,
        { tags: newTagList }
      )
      .then((res: any) => {
        onCloseAndUpdate(true);
        setIsSending(false);
      })
      .catch((error: ErrorResponseHandler) => {
        dispatch(setModalErrorSnackMessage(error));
        setIsSending(false);
      });
  };

  const deleteTagProcess = () => {
    const cleanObject: any = { ...currentTags };
    delete cleanObject[deleteKey];

    const verID = distributedSetup ? actualInfo.version_id : "null";

    api
      .invoke(
        "PUT",
        `/api/v1/buckets/${bucketName}/objects/tags?prefix=${selectedObject}&version_id=${verID}`,
        { tags: cleanObject }
      )
      .then((res: any) => {
        onCloseAndUpdate(true);
        setIsSending(false);
      })
      .catch((error: ErrorResponseHandler) => {
        dispatch(setModalErrorSnackMessage(error));
        setIsSending(false);
      });
  };

  const onDeleteTag = (tagKey: string, tag: string) => {
    setDeleteKey(tagKey);
    setDeleteLabel(tag);
    setDeleteEnabled(true);
  };

  const cancelDelete = () => {
    setDeleteKey("");
    setDeleteLabel("");
    setDeleteEnabled(false);
  };

  const tagsFor = (plural: boolean) => (
    <div className={classes.tagsForLabel}>
      Tag{plural ? "s" : ""} for: <strong>{currentItem}</strong>
    </div>
  );

  return (
    <Fragment>
      <ModalWrapper
        modalOpen={modalOpen}
        title={
          deleteEnabled ? (
            <span style={{ color: "#C83B51" }}>Delete Tag</span>
          ) : (
            `Edit Tags`
          )
        }
        onClose={() => {
          onCloseAndUpdate(true);
        }}
        titleIcon={
          deleteEnabled ? (
            <DisabledIcon style={{ fill: "#C83B51" }} />
          ) : (
            <EditTagIcon />
          )
        }
      >
        {deleteEnabled ? (
          <Fragment>
            <Grid container>
              {tagsFor(false)}
              Are you sure you want to delete the tag{" "}
              <b className={classes.deleteTag}>
                {deleteKey} : {deleteLabel}
              </b>{" "}
              ?
              <Grid item xs={12} className={classes.modalButtonBar}>
                <Button
                  id={"cancel"}
                  type="button"
                  variant="regular"
                  onClick={cancelDelete}
                  label={"Cancel"}
                />
                <Button
                  type="submit"
                  variant="secondary"
                  onClick={deleteTagProcess}
                  id={"deleteTag"}
                  label={"Delete Tag"}
                />
              </Grid>
            </Grid>
          </Fragment>
        ) : (
          <Grid container>
            <SecureComponent
              scopes={[
                IAM_SCOPES.S3_GET_OBJECT_TAGGING,
                IAM_SCOPES.S3_GET_ACTIONS,
              ]}
              resource={bucketName}
            >
              <Box
                sx={{
                  display: "flex",
                  flexFlow: "column",
                  width: "100%",
                }}
              >
                {tagsFor(true)}
                <div className={classes.currentTagsContainer}>
                  Current Tags:
                  <br />
                  {currTagKeys.length === 0 ? (
                    <span className={classes.noTagsForObject}>
                      There are no tags for this object
                    </span>
                  ) : (
                    <Fragment />
                  )}
                  <Box sx={{ marginTop: "5px", marginBottom: "15px" }}>
                    {currTagKeys.map((tagKey: string, index: number) => {
                      const tag = get(currentTags, `${tagKey}`, "");
                      if (tag !== "") {
                        return (
                          <SecureComponent
                            key={`chip-${index}`}
                            scopes={[IAM_SCOPES.S3_DELETE_OBJECT_TAGGING]}
                            resource={bucketName}
                            errorProps={{
                              deleteIcon: null,
                              onDelete: null,
                            }}
                          >
                            <Chip
                              style={{
                                textTransform: "none",
                                marginRight: "5px",
                                marginBottom: "5px",
                              }}
                              size="small"
                              label={`${tagKey} : ${tag}`}
                              color="primary"
                              deleteIcon={<CloseIcon />}
                              onDelete={() => {
                                onDeleteTag(tagKey, tag);
                              }}
                            />
                          </SecureComponent>
                        );
                      }
                      return null;
                    })}
                  </Box>
                </div>
              </Box>
            </SecureComponent>
            <SecureComponent
              scopes={[
                IAM_SCOPES.S3_PUT_OBJECT_TAGGING,
                IAM_SCOPES.S3_PUT_ACTIONS,
              ]}
              resource={bucketName}
              errorProps={{ disabled: true, onClick: null }}
            >
              <Grid container>
                <Grid item xs={12} className={classes.newTileHeader}>
                  <AddNewTagIcon /> Add New Tag
                </Grid>
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
                    id={"clear"}
                    type="button"
                    variant="regular"
                    color="primary"
                    onClick={resetForm}
                    label={"Clear"}
                  />
                  <Button
                    type="submit"
                    variant="callAction"
                    disabled={
                      newLabel.trim() === "" ||
                      newKey.trim() === "" ||
                      isSending
                    }
                    onClick={addTagProcess}
                    id="saveTag"
                    label={"Save"}
                  />
                </Grid>
              </Grid>
            </SecureComponent>
          </Grid>
        )}
      </ModalWrapper>
    </Fragment>
  );
};

export default withStyles(styles)(AddTagModal);
