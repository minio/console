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
import { Button, LockIcon } from "mds";
import { Theme } from "@mui/material/styles";
import createStyles from "@mui/styles/createStyles";
import withStyles from "@mui/styles/withStyles";
import { LinearProgress } from "@mui/material";
import Grid from "@mui/material/Grid";
import {
  formFieldStyles,
  modalBasic,
} from "../../Common/FormComponents/common/styleLibrary";

import InputBoxWrapper from "../../Common/FormComponents/InputBoxWrapper/InputBoxWrapper";
import FileSelector from "../../Common/FormComponents/FileSelector/FileSelector";
import ModalWrapper from "../../Common/ModalWrapper/ModalWrapper";
import { setModalErrorSnackMessage } from "../../../../systemSlice";
import { useAppDispatch } from "../../../../store";
import { Tier } from "api/consoleApi";
import { api } from "api";
import { errorToHandler } from "api/errors";

interface ITierCredentialsModal {
  open: boolean;
  closeModalAndRefresh: (refresh: boolean) => any;
  classes: any;
  tierData: Tier;
}

const styles = (theme: Theme) =>
  createStyles({
    buttonContainer: {
      display: "flex",
      justifyContent: "flex-end",
    },
    ...modalBasic,
    ...formFieldStyles,
  });

const UpdateTierCredentialsModal = ({
  open,
  closeModalAndRefresh,
  classes,
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
        <Grid container>
          <Grid item xs={12}>
            {(type === "s3" || type === "minio") && (
              <Fragment>
                <div className={classes.formFieldRow}>
                  <InputBoxWrapper
                    id="accessKey"
                    name="accessKey"
                    label="Access Key"
                    placeholder="Enter Access Key"
                    value={accountName}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      setAccountName(e.target.value);
                    }}
                  />
                </div>
                <div className={classes.formFieldRow}>
                  <InputBoxWrapper
                    id="secretKey"
                    name="secretKey"
                    label="Secret Key"
                    placeholder="Enter Secret Key"
                    value={accountKey}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      setAccountKey(e.target.value);
                    }}
                  />
                </div>
              </Fragment>
            )}
            {type === "gcs" && (
              <Fragment>
                <FileSelector
                  accept=".json"
                  id="creds"
                  label="Credentials"
                  name="creds"
                  onChange={(encodedValue, fileName) => {
                    setEncodedCreds(encodedValue);
                    setCreds(fileName);
                  }}
                  value={creds}
                />
              </Fragment>
            )}
            {type === "azure" && (
              <Fragment>
                <div className={classes.formFieldRow}>
                  <InputBoxWrapper
                    id="accountName"
                    name="accountName"
                    label="Account Name"
                    placeholder="Enter Account Name"
                    value={accountName}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      setAccountName(e.target.value);
                    }}
                  />
                </div>
                <div className={classes.formFieldRow}>
                  <InputBoxWrapper
                    id="accountKey"
                    name="accountKey"
                    label="Account Key"
                    placeholder="Enter Account Key"
                    value={accountKey}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      setAccountKey(e.target.value);
                    }}
                  />
                </div>
              </Fragment>
            )}
          </Grid>
          <Grid item xs={12} className={classes.buttonContainer}>
            <Button
              id={"save-credentials"}
              type="submit"
              variant="callAction"
              disabled={savingTiers || !isFormValid}
              label={"Save"}
            />
          </Grid>
          {savingTiers && (
            <Grid item xs={12}>
              <LinearProgress />
            </Grid>
          )}
        </Grid>
      </form>
    </ModalWrapper>
  );
};

export default withStyles(styles)(UpdateTierCredentialsModal);
