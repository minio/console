// This file is part of MinIO Console Server
// Copyright (c) 2020 MinIO, Inc.
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
import { createStyles, Theme, withStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import { modalBasic } from "../../../../Common/FormComponents/common/styleLibrary";
import { IFileInfo } from "./types";
import ModalWrapper from "../../../../Common/ModalWrapper/ModalWrapper";
import FormSwitchWrapper from "../../../../Common/FormComponents/FormSwitchWrapper/FormSwitchWrapper";
import RadioGroupSelector from "../../../../Common/FormComponents/RadioGroupSelector/RadioGroupSelector";
import DateSelector from "../../../../Common/FormComponents/DateSelector/DateSelector";
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
  closeModalAndRefresh: (updateInfo: boolean) => void;
  objectName: string;
  bucketName: string;
  objectInfo: IFileInfo;
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
}: ISetRetentionProps) => {
  const [statusEnabled, setStatusEnabled] = useState<boolean>(true);
  const [error, setError] = useState("");
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
        `/api/v1/buckets/${bucketName}/objects/retention?prefix=${selectedObject}&version_id=${versionId}`,
        {
          expires: expireDate,
          mode: type,
        }
      )
      .then((res: any) => {
        setIsSaving(false);
        closeModalAndRefresh(true);
      })
      .catch((error) => {
        setError(error);
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
        `/api/v1/buckets/${bucketName}/objects/retention?prefix=${selectedObject}&version_id=${versionId}`
      )
      .then((res: any) => {
        setIsSaving(false);
        closeModalAndRefresh(true);
      })
      .catch((error) => {
        setError(error);
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
      {error !== "" && (
        <Grid item xs={12}>
          <ErrorBlock errorMessage={error} />
        </Grid>
      )}
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
            borderBottom={true}
            onDateChange={(date: string, isValid: boolean) => {
              setIsDateValid(isValid);
              setDate(date);
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

export default withStyles(styles)(SetRetention);
