import React, { useState, useEffect } from "react";
import { createStyles, Theme, withStyles } from "@material-ui/core/styles";
import get from "lodash/get";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import { modalBasic } from "../../../../Common/FormComponents/common/styleLibrary";
import { IFileInfo } from "./types";
import ModalWrapper from "../../../../Common/ModalWrapper/ModalWrapper";
import FormSwitchWrapper from "../../../../Common/FormComponents/FormSwitchWrapper/FormSwitchWrapper";
import api from "../../../../../../common/api";
import ErrorBlock from "../../../../../shared/ErrorBlock";

const styles = (theme: Theme) =>
  createStyles({
    objectName: {
      fontSize: 18,
      fontWeight: 700,
      marginBottom: 40,
    },
    buttonContainer: {
      textAlign: "right",
    },
    ...modalBasic,
  });

interface ISetRetentionProps {
  classes: any;
  open: boolean;
  closeModalAndRefresh: (reload: boolean) => void;
  objectName: string;
  bucketName: string;
  actualInfo: IFileInfo;
}

const SetLegalHoldModal = ({
  classes,
  open,
  closeModalAndRefresh,
  objectName,
  bucketName,
  actualInfo,
}: ISetRetentionProps) => {
  const [legalHoldEnabled, setLegalHoldEnabled] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const versionId = actualInfo.version_id;

  useEffect(() => {
    const status = get(actualInfo, "legal_hold_status", "OFF");
    setLegalHoldEnabled(status === "ON");
  }, [actualInfo]);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    api
      .invoke(
        "PUT",
        `/api/v1/buckets/${bucketName}/objects/legalhold?prefix=${objectName}&version_id=${versionId}`,
        { status: legalHoldEnabled ? "enabled" : "disabled" }
      )
      .then((res) => {
        setIsSaving(false);
        closeModalAndRefresh(true);
      })
      .catch((error) => {
        setError(error);
        setIsSaving(false);
      });
  };

  const resetForm = () => {
    setLegalHoldEnabled(false);
  };

  return (
    <ModalWrapper
      title="Set Legal Hold"
      modalOpen={open}
      onClose={() => {
        resetForm();
        closeModalAndRefresh(false);
      }}
    >
      {error !== "" && <ErrorBlock errorMessage={error} withBreak={false} />}
      <Grid item xs={12} className={classes.objectName}>
        {objectName}
      </Grid>
      <form
        noValidate
        autoComplete="off"
        onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
          onSubmit(e);
        }}
      >
        <Grid item xs={12}>
          <FormSwitchWrapper
            value="legalhold"
            id="legalhold"
            name="legalhold"
            checked={legalHoldEnabled}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setLegalHoldEnabled(!legalHoldEnabled);
            }}
            label={"Legal Hold Status"}
            indicatorLabels={["Enabled", "Disabled"]}
            tooltip={
              "To enable this feature you need to enable versioning on the bucket before creation"
            }
          />
        </Grid>
        <Grid item xs={12} className={classes.buttonContainer}>
          <button
            type="button"
            color="primary"
            className={classes.clearButton}
            onClick={resetForm}
          >
            Reset
          </button>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={isSaving}
          >
            Save
          </Button>
        </Grid>
      </form>
    </ModalWrapper>
  );
};

export default withStyles(styles)(SetLegalHoldModal);
