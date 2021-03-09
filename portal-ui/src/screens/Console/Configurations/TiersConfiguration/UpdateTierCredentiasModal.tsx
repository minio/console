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

import React, { useState, useEffect, Fragment } from "react";
import get from "lodash/get";
import { connect } from "react-redux";
import { createStyles, Theme, withStyles } from "@material-ui/core/styles";
import { Button, LinearProgress } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import { modalBasic } from "../../Common/FormComponents/common/styleLibrary";
import { setModalErrorSnackMessage } from "../../../../actions";
import InputBoxWrapper from "../../Common/FormComponents/InputBoxWrapper/InputBoxWrapper";
import FileSelector from "../../Common/FormComponents/FileSelector/FileSelector";
import api from "../../../../common/api";
import { ITierElement } from "./types";
import ModalWrapper from "../../Common/ModalWrapper/ModalWrapper";

interface ITierCredentialsModal {
  open: boolean;
  closeModalAndRefresh: (refresh: boolean) => any;
  classes: any;
  tierData: ITierElement;
  setModalErrorSnackMessage: typeof setModalErrorSnackMessage;
}

const styles = (theme: Theme) =>
  createStyles({
    minTableHeader: {
      color: "#393939",
      "& tr": {
        "& th": {
          fontWeight: "bold",
        },
      },
    },
    buttonContainer: {
      textAlign: "right",
    },
    ...modalBasic,
  });

const UpdateTierCredentialsModal = ({
  open,
  closeModalAndRefresh,
  classes,
  tierData,
  setModalErrorSnackMessage,
}: ITierCredentialsModal) => {
  const [savingTiers, setSavingTiers] = useState<boolean>(false);
  const [accessKey, setAccessKey] = useState<string>("");
  const [secretKey, setSecretKey] = useState<string>("");

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

    if (type === "s3" || type === "azure") {
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

    if (type === "s3" || type === "azure") {
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
      api
        .invoke("PUT", `/api/v1/admin/tiers/${type}/${name}/credentials`, rules)
        .then(() => {
          setSavingTiers(false);
          closeModalAndRefresh(true);
        })
        .catch((err) => {
          setSavingTiers(false);
          setModalErrorSnackMessage(err);
        });
    } else {
      setModalErrorSnackMessage(
        "There was an error retrieving tier information"
      );
    }
  };

  return (
    <ModalWrapper
      modalOpen={open}
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
          <Grid item xs={12} className={classes.formScrollable}>
            {type === "s3" && (
              <Fragment>
                <InputBoxWrapper
                  id="accessKey"
                  name="accessKey"
                  label="Access Key"
                  placeholder="Enter Access Key"
                  value={accessKey}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    setAccessKey(e.target.value);
                  }}
                />
                <InputBoxWrapper
                  id="secretKey"
                  name="secretKey"
                  label="Secret Key"
                  placeholder="Enter Secret Key"
                  value={secretKey}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    setSecretKey(e.target.value);
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
              </Fragment>
            )}
          </Grid>
          <Grid item xs={12} className={classes.buttonContainer}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={savingTiers || !isFormValid}
            >
              Save
            </Button>
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

const connector = connect(null, {
  setModalErrorSnackMessage,
});

export default withStyles(styles)(connector(UpdateTierCredentialsModal));
