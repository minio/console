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
import { Box, Button, FormLayout, Grid, RadioGroup, Switch } from "mds";
import { useSelector } from "react-redux";
import { BucketObject, ObjectRetentionMode } from "api/consoleApi";
import { api } from "api";
import { errorToHandler } from "api/errors";
import { modalStyleUtils } from "../../../../Common/FormComponents/common/styleLibrary";
import { twoDigitDate } from "../../../../Common/FormComponents/DateSelector/utils";
import { setModalErrorSnackMessage } from "../../../../../../systemSlice";
import { AppState, useAppDispatch } from "../../../../../../store";
import ModalWrapper from "../../../../Common/ModalWrapper/ModalWrapper";
import DateSelector from "../../../../Common/FormComponents/DateSelector/DateSelector";

interface ISetRetentionProps {
  open: boolean;
  closeModalAndRefresh: (updateInfo: boolean) => void;
  objectName: string;
  bucketName: string;
  objectInfo: BucketObject;
}

interface IRefObject {
  resetDate: () => void;
}

const SetRetention = ({
  open,
  closeModalAndRefresh,
  objectName,
  objectInfo,
  bucketName,
}: ISetRetentionProps) => {
  const dispatch = useAppDispatch();
  const retentionConfig = useSelector(
    (state: AppState) => state.objectBrowser.retentionConfig,
  );

  const [statusEnabled, setStatusEnabled] = useState<boolean>(true);
  const [type, setType] = useState<ObjectRetentionMode | "">("");
  const [date, setDate] = useState<string>("");
  const [isDateValid, setIsDateValid] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [alreadyConfigured, setAlreadyConfigured] = useState<boolean>(false);

  useEffect(() => {
    if (objectInfo.retention_mode) {
      setType(retentionConfig?.mode || ObjectRetentionMode.Governance);
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
  }, [objectInfo, retentionConfig?.mode]);

  const dateElement = useRef<IRefObject>(null);

  const dateFieldDisabled = () => {
    return !(statusEnabled && (type === "governance" || type === "compliance"));
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  const resetForm = () => {
    setStatusEnabled(false);
    setType(ObjectRetentionMode.Governance);
    if (dateElement.current) {
      dateElement.current.resetDate();
    }
  };

  const addRetention = (
    selectedObject: string,
    versionId: string | null,
    expireDate: string,
  ) => {
    api.buckets
      .putObjectRetention(
        bucketName,
        {
          prefix: selectedObject,
          version_id: versionId || "",
        },
        {
          expires: expireDate,
          mode: type as ObjectRetentionMode,
        },
      )
      .then(() => {
        setIsSaving(false);
        closeModalAndRefresh(true);
      })
      .catch((err) => {
        dispatch(setModalErrorSnackMessage(errorToHandler(err.error)));
        setIsSaving(false);
      });
  };

  const disableRetention = (
    selectedObject: string,
    versionId: string | null,
  ) => {
    api.buckets
      .deleteObjectRetention(bucketName, {
        prefix: selectedObject,
        version_id: versionId || "",
      })
      .then(() => {
        setIsSaving(false);
        closeModalAndRefresh(true);
      })
      .catch((err) => {
        dispatch(setModalErrorSnackMessage(errorToHandler(err.error)));
        setIsSaving(false);
      });
  };

  const saveNewRetentionPolicy = () => {
    setIsSaving(true);
    const selectedObject = objectInfo.name || "";
    const versionId = objectInfo.version_id || null;

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
      <form
        noValidate
        autoComplete="off"
        onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
          onSubmit(e);
        }}
      >
        <FormLayout withBorders={false} containerPadding={false}>
          <Box className={"inputItem"}>
            <strong>Selected Object</strong>: {objectName}
          </Box>
          {showSwitcher && (
            <Switch
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
          )}
          <RadioGroup
            currentValue={type}
            id="type"
            name="type"
            label="Type"
            disableOptions={
              !statusEnabled || (alreadyConfigured && type !== "")
            }
            onChange={(e) => {
              setType(e.target.value as ObjectRetentionMode);
            }}
            selectorOptions={[
              { label: "Governance", value: ObjectRetentionMode.Governance },
              { label: "Compliance", value: ObjectRetentionMode.Compliance },
            ]}
          />
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
          <Grid item xs={12} sx={modalStyleUtils.modalButtonBar}>
            <Button
              id={"reset"}
              type="button"
              variant="regular"
              onClick={resetForm}
              label={"Reset"}
            />
            <Button
              id={"save"}
              type="submit"
              variant="callAction"
              disabled={
                (statusEnabled && type === "") ||
                (statusEnabled && !isDateValid) ||
                isSaving
              }
              onClick={saveNewRetentionPolicy}
              label={"Save"}
            />
          </Grid>
        </FormLayout>
      </form>
    </ModalWrapper>
  );
};

export default SetRetention;
