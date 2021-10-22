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

import React, { useEffect, useRef, useState } from "react";
import { connect } from "react-redux";
import { Theme } from "@mui/material/styles";
import createStyles from "@mui/styles/createStyles";
import withStyles from "@mui/styles/withStyles";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import { modalBasic } from "../../../../Common/FormComponents/common/styleLibrary";
import { IFileInfo } from "./types";
import { setModalErrorSnackMessage } from "../../../../../../actions";
import { twoDigitDate } from "../../../../Common/FormComponents/DateSelector/utils";
import { ErrorResponseHandler } from "../../../../../../common/types";
import ModalWrapper from "../../../../Common/ModalWrapper/ModalWrapper";
import FormSwitchWrapper from "../../../../Common/FormComponents/FormSwitchWrapper/FormSwitchWrapper";
import RadioGroupSelector from "../../../../Common/FormComponents/RadioGroupSelector/RadioGroupSelector";
import DateSelector from "../../../../Common/FormComponents/DateSelector/DateSelector";
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
  closeModalAndRefresh: (updateInfo: boolean) => void;
  objectName: string;
  bucketName: string;
  objectInfo: IFileInfo;
  setModalErrorSnackMessage: typeof setModalErrorSnackMessage;
}

interface IRefObject {
  resetDate: () => void;
}

const SetRetention = ({
  classes,
  open,
  closeModalAndRefresh,
  objectName,
  objectInfo,
  bucketName,
  setModalErrorSnackMessage,
}: ISetRetentionProps) => {
  const [statusEnabled, setStatusEnabled] = useState<boolean>(true);
  const [type, setType] = useState<string>("");
  const [date, setDate] = useState<string>("");
  const [isDateValid, setIsDateValid] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [alreadyConfigured, setAlreadyConfigured] = useState<boolean>(false);

  useEffect(() => {
    if (objectInfo.retention_mode) {
      setType(objectInfo.retention_mode.toLowerCase());
      setAlreadyConfigured(true);
    }
    // get retention_until_date if defined
    if (objectInfo.retention_until_date) {
      const valueDate = new Date(objectInfo.retention_until_date);
      if (valueDate.toString() !== "Invalid Date") {
        const year = valueDate.getFullYear();
        const month = twoDigitDate(valueDate.getMonth() + 1);
        const day = valueDate.getDate();
        if (!isNaN(day) && month !== "NaN" && !isNaN(year)) {
          setDate(`${year}-${month}-${day}`);
        }
      }
      setAlreadyConfigured(true);
    }
  }, [objectInfo]);

  const dateElement = useRef<IRefObject>(null);

  const dateFieldDisabled = () => {
    return !(statusEnabled && (type === "governance" || type === "compliance"));
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  const resetForm = () => {
    setStatusEnabled(false);
    setType("");
    if (dateElement.current) {
      dateElement.current.resetDate();
    }
  };

  const addRetention = (
    selectedObject: string,
    versionId: string | null,
    expireDate: string
  ) => {
    api
      .invoke(
        "PUT",
        `/api/v1/buckets/${bucketName}/objects/retention?prefix=${encodeFileName(
          selectedObject
        )}&version_id=${versionId}`,
        {
          expires: expireDate,
          mode: type,
        }
      )
      .then((res: any) => {
        setIsSaving(false);
        closeModalAndRefresh(true);
      })
      .catch((error: ErrorResponseHandler) => {
        setModalErrorSnackMessage(error);
        setIsSaving(false);
      });
  };

  const disableRetention = (
    selectedObject: string,
    versionId: string | null
  ) => {
    api
      .invoke(
        "DELETE",
        `/api/v1/buckets/${bucketName}/objects/retention?prefix=${encodeFileName(
          selectedObject
        )}&version_id=${versionId}`
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

  const saveNewRetentionPolicy = () => {
    setIsSaving(true);
    const selectedObject = objectInfo.name;
    const versionId = objectInfo.version_id;

    const expireDate =
      !statusEnabled && type === "governance" ? "" : `${date}T23:59:59Z`;

    if (!statusEnabled && type === "governance") {
      disableRetention(selectedObject, versionId);

      return;
    }

    addRetention(selectedObject, versionId, expireDate);
  };

  const showSwitcher =
    alreadyConfigured && (type === "governance" || type === "");

  return (
    <ModalWrapper
      title="Set Retention Policy"
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
        {showSwitcher && (
          <Grid item xs={12}>
            <FormSwitchWrapper
              value="status"
              id="status"
              name="status"
              checked={statusEnabled}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setStatusEnabled(!statusEnabled);
              }}
              label={"Status"}
              indicatorLabels={["Enabled", "Disabled"]}
            />
          </Grid>
        )}
        <Grid item xs={12}>
          <RadioGroupSelector
            currentSelection={type}
            id="type"
            name="type"
            label="Type"
            disableOptions={
              !statusEnabled || (alreadyConfigured && type !== "")
            }
            onChange={(e) => {
              setType(e.target.value);
            }}
            selectorOptions={[
              { label: "Governance", value: "governance" },
              { label: "Compliance", value: "compliance" },
            ]}
          />
        </Grid>
        <Grid item xs={12}>
          <DateSelector
            id="date"
            label="Date"
            disableOptions={dateFieldDisabled()}
            ref={dateElement}
            value={date}
            borderBottom={true}
            onDateChange={(date: string, isValid: boolean) => {
              setIsDateValid(isValid);
              if (isValid) {
                setDate(date);
              }
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
            Reset
          </button>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={
              (statusEnabled && type === "") ||
              (statusEnabled && !isDateValid) ||
              isSaving
            }
            onClick={saveNewRetentionPolicy}
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

export default withStyles(styles)(connector(SetRetention));
