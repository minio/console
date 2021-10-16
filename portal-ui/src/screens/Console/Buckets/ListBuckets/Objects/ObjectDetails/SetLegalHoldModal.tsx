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

import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { Theme } from "@mui/material/styles";
import createStyles from "@mui/styles/createStyles";
import withStyles from "@mui/styles/withStyles";
import get from "lodash/get";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import { modalBasic } from "../../../../Common/FormComponents/common/styleLibrary";
import { setModalErrorSnackMessage } from "../../../../../../actions";
import { IFileInfo } from "./types";
import { ErrorResponseHandler } from "../../../../../../common/types";
import ModalWrapper from "../../../../Common/ModalWrapper/ModalWrapper";
import FormSwitchWrapper from "../../../../Common/FormComponents/FormSwitchWrapper/FormSwitchWrapper";
import api from "../../../../../../common/api";
import { encodeFileName } from "../../../../../../common/utils";

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
  setModalErrorSnackMessage: typeof setModalErrorSnackMessage;
}

const SetLegalHoldModal = ({
  classes,
  open,
  closeModalAndRefresh,
  objectName,
  bucketName,
  actualInfo,
  setModalErrorSnackMessage,
}: ISetRetentionProps) => {
  const [legalHoldEnabled, setLegalHoldEnabled] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
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
        `/api/v1/buckets/${bucketName}/objects/legalhold?prefix=${encodeFileName(
          objectName
        )}&version_id=${versionId}`,
        { status: legalHoldEnabled ? "enabled" : "disabled" }
      )
      .then(() => {
        setIsSaving(false);
        closeModalAndRefresh(true);
      })
      .catch((error: ErrorResponseHandler) => {
        setModalErrorSnackMessage(error);
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

const mapDispatchToProps = {
  setModalErrorSnackMessage,
};

const connector = connect(null, mapDispatchToProps);

export default withStyles(styles)(connector(SetLegalHoldModal));
