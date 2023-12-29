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

import React, { Fragment, useEffect, useState } from "react";
import get from "lodash/get";
import {
  Button,
  FileSelector,
  FormLayout,
  Grid,
  InputBox,
  LockIcon,
  ProgressBar,
} from "mds";
import { Tier } from "api/consoleApi";
import { api } from "api";
import { errorToHandler } from "api/errors";
import { modalStyleUtils } from "../../Common/FormComponents/common/styleLibrary";
import { setModalErrorSnackMessage } from "../../../../systemSlice";
import { useAppDispatch } from "../../../../store";
import ModalWrapper from "../../Common/ModalWrapper/ModalWrapper";

interface ITierCredentialsModal {
  open: boolean;
  closeModalAndRefresh: (refresh: boolean) => any;
  tierData: Tier;
}

const UpdateTierCredentialsModal = ({
  open,
  closeModalAndRefresh,
  tierData,
}: ITierCredentialsModal) => {
  const dispatch = useAppDispatch();
  const [savingTiers, setSavingTiers] = useState<boolean>(false);
  const [creds, setCreds] = useState<string>("");
  const [encodedCreds, setEncodedCreds] = useState<string>("");

  const [accountName, setAccountName] = useState<string>("");
  const [accountKey, setAccountKey] = useState<string>("");

  // Validations
  const [isFormValid, setIsFormValid] = useState<boolean>(true);

  const type = get(tierData, "type", "");
  const name = get(tierData, `${type}.name`, "");

  useEffect(() => {
    let valid = true;

    if (type === "s3" || type === "azure" || type === "minio") {
      if (accountName === "" || accountKey === "") {
        valid = false;
      }
    } else if (type === "gcs") {
      if (encodedCreds === "") {
        valid = false;
      }
    }
    setIsFormValid(valid);
  }, [accountKey, accountName, encodedCreds, type]);

  const addRecord = () => {
    let rules = {};

    if (type === "s3" || type === "azure" || type === "minio") {
      rules = {
        access_key: accountName,
        secret_key: accountKey,
      };
    } else if (type === "gcs") {
      rules = {
        creds: encodedCreds,
      };
    }
    if (name !== "") {
      api.admin
        .editTierCredentials(
          type as "azure" | "s3" | "minio" | "gcs",
          name,
          rules,
        )
        .then(() => {
          setSavingTiers(false);
          closeModalAndRefresh(true);
        })
        .catch((err) => {
          setSavingTiers(false);
          dispatch(setModalErrorSnackMessage(errorToHandler(err.error)));
        });
    } else {
      setModalErrorSnackMessage({
        errorMessage: "There was an error retrieving tier information",
        detailedError: "",
      });
    }
  };

  return (
    <ModalWrapper
      modalOpen={open}
      titleIcon={<LockIcon />}
      onClose={() => {
        closeModalAndRefresh(false);
      }}
      title={`Update Credentials - ${type} / ${name}`}
    >
      <form
        noValidate
        autoComplete="off"
        onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
          e.preventDefault();
          setSavingTiers(true);
          addRecord();
        }}
      >
        <FormLayout withBorders={false} containerPadding={false}>
          {(type === "s3" || type === "minio") && (
            <Fragment>
              <InputBox
                id="accessKey"
                name="accessKey"
                label="Access Key"
                placeholder="Enter Access Key"
                value={accountName}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setAccountName(e.target.value);
                }}
              />
              <InputBox
                id="secretKey"
                name="secretKey"
                label="Secret Key"
                placeholder="Enter Secret Key"
                value={accountKey}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setAccountKey(e.target.value);
                }}
              />
            </Fragment>
          )}
          {type === "gcs" && (
            <Fragment>
              <FileSelector
                accept=".json"
                id="creds"
                label="Credentials"
                name="creds"
                returnEncodedData
                onChange={(_, fileName, encodedValue) => {
                  if (encodedValue) {
                    setEncodedCreds(encodedValue);
                    setCreds(fileName);
                  }
                }}
                value={creds}
              />
            </Fragment>
          )}
          {type === "azure" && (
            <Fragment>
              <InputBox
                id="accountName"
                name="accountName"
                label="Account Name"
                placeholder="Enter Account Name"
                value={accountName}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setAccountName(e.target.value);
                }}
              />
              <InputBox
                id="accountKey"
                name="accountKey"
                label="Account Key"
                placeholder="Enter Account Key"
                value={accountKey}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setAccountKey(e.target.value);
                }}
              />
            </Fragment>
          )}
        </FormLayout>
        {savingTiers && (
          <Grid item xs={12}>
            <ProgressBar />
          </Grid>
        )}
        <Grid item xs={12} sx={modalStyleUtils.modalButtonBar}>
          <Button
            id={"save-credentials"}
            type="submit"
            variant="callAction"
            disabled={savingTiers || !isFormValid}
            label={"Save"}
          />
        </Grid>
      </form>
    </ModalWrapper>
  );
};

export default UpdateTierCredentialsModal;
