import React, { useState } from "react";
import { Button, Grid } from "@material-ui/core";
import InputBoxWrapper from "../../../../Common/FormComponents/InputBoxWrapper/InputBoxWrapper";
import ModalWrapper from "../../../../Common/ModalWrapper/ModalWrapper";
import { createStyles, Theme, withStyles } from "@material-ui/core/styles";
import { modalBasic } from "../../../../Common/FormComponents/common/styleLibrary";
import api from "../../../../../../common/api";

interface ITagModal {
  modalOpen: boolean;
  currentTags: any;
  bucketName: string;
  versionId: string;
  onCloseAndUpdate: (refresh: boolean) => void;
  selectedObject: string;
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
    ...modalBasic,
  });

const AddTagModal = ({
  modalOpen,
  currentTags,
  selectedObject,
  onCloseAndUpdate,
  bucketName,
  versionId,
  classes,
}: ITagModal) => {
  const [newKey, setNewKey] = useState<string>("");
  const [newLabel, setNewLabel] = useState<string>("");
  const [error, setError] = useState<string>("");
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
      .invoke(
        "PUT",
        `/api/v1/buckets/${bucketName}/objects/tags?prefix=${selectedObject}&version_id=${versionId}`,
        { tags: newTagList }
      )
      .then((res: any) => {
        setIsSending(false);
        onCloseAndUpdate(true);
      })
      .catch((error) => {
        setError(error);
        setIsSending(false);
      });
  };

  return (
    <React.Fragment>
      <ModalWrapper
        modalOpen={modalOpen}
        title="Add New Tag"
        onClose={() => {
          onCloseAndUpdate(false);
        }}
      >
        <Grid container>
          <h3 className={classes.pathLabel}>
            Selected Object: {selectedObject}
          </h3>
          {error !== "" && <span>{error}</span>}
          <Grid item xs={12}>
            <InputBoxWrapper
              value={newKey}
              label={"New Tag Key"}
              id={"newTagKey"}
              name={"newTagKey"}
              placeholder={"Enter New Tag Key"}
              onChange={(e) => {
                setNewKey(e.target.value);
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <InputBoxWrapper
              value={newLabel}
              label={"New Tag Label"}
              id={"newTagLabel"}
              name={"newTagLabel"}
              placeholder={"Enter New Tag Label"}
              onChange={(e) => {
                setNewLabel(e.target.value);
              }}
            />
          </Grid>
          <Grid item xs={12} className={classes.buttonContainer}>
            <button
              type="button"
              color="primary"
              className={classes.clearButton}
              onClick={resetForm}
            >
              Clear
            </button>
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

export default withStyles(styles)(AddTagModal);
