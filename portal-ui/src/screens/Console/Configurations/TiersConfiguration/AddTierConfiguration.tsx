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

import React, { Fragment, useEffect, useState, useCallback } from "react";
import { connect } from "react-redux";
import get from "lodash/get";
import Grid from "@mui/material/Grid";
import { Theme } from "@mui/material/styles";
import createStyles from "@mui/styles/createStyles";
import withStyles from "@mui/styles/withStyles";
import { Button } from "@mui/material";
import { setErrorSnackMessage } from "../../../../actions";
import {
  modalBasic,
  settingsCommon,
} from "../../Common/FormComponents/common/styleLibrary";
import { ErrorResponseHandler } from "../../../../common/types";
import api from "../../../../common/api";
import InputBoxWrapper from "../../Common/FormComponents/InputBoxWrapper/InputBoxWrapper";
import FileSelector from "../../Common/FormComponents/FileSelector/FileSelector";
import BackSettingsIcon from "../../../../icons/BackSettingsIcon";
import PageHeader from "../../Common/PageHeader/PageHeader";
import {
  azureServiceName,
  gcsServiceName,
  minioServiceName,
  s3ServiceName,
  tierTypes,
} from "./utils";

const styles = (theme: Theme) =>
  createStyles({
    ...modalBasic,
    ...settingsCommon,
    strongText: {
      fontWeight: 700,
    },
    keyName: {
      marginLeft: 5,
    },
    buttonContainer: {
      textAlign: "right",
    },
    customTitle: {
      ...settingsCommon.customTitle,
      marginTop: 0,
    },
    settingsFormContainer: {
      ...settingsCommon.settingsFormContainer,
      height: "calc(100vh - 422px)",
    },
    lambdaNotif: {
      background:
        "linear-gradient(90deg, rgba(249,249,250,1) 0%, rgba(250,250,251,1) 68%, rgba(254,254,254,1) 100%)",
      border: "#E5E5E5 1px solid",
      borderRadius: 5,
      height: 80,
      display: "flex",
      alignItems: "center",
      justifyContent: "start",
      marginBottom: 16,
      marginRight: 8,
      cursor: "pointer",
      padding: 0,
      overflow: "hidden",
    },
    lambdaNotifIcon: {
      backgroundColor: "#FEFEFE",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      width: 80,
      height: 80,

      "& img": {
        maxWidth: 46,
        maxHeight: 46,
      },
    },
    lambdaNotifTitle: {
      color: "#07193E",
      fontSize: 16,
      fontFamily: "Lato,sans-serif",
      paddingLeft: 18,
    },
    mainCont: {
      maxWidth: 1180,
      paddingLeft: 38,
      paddingRight: 38,
    },
    backTo: {
      margin: "20px 0px 0",
    },
  });

interface IAddNotificationEndpointProps {
  setErrorSnackMessage: typeof setErrorSnackMessage;
  classes: any;
  match: any;
  history: any;
}

const AddTierConfiguration = ({
  classes,
  setErrorSnackMessage,
  match,
  history,
}: IAddNotificationEndpointProps) => {
  //Local States
  const [saving, setSaving] = useState<boolean>(false);

  // Form Items
  const [name, setName] = useState<string>("");
  const [endpoint, setEndpoint] = useState<string>("");
  const [bucket, setBucket] = useState<string>("");
  const [prefix, setPrefix] = useState<string>("");
  const [region, setRegion] = useState<string>("");
  const [storageClass, setStorageClass] = useState<string>("");

  const [accessKey, setAccessKey] = useState<string>("");
  const [secretKey, setSecretKey] = useState<string>("");

  const [creds, setCreds] = useState<string>("");
  const [encodedCreds, setEncodedCreds] = useState<string>("");

  const [accountName, setAccountName] = useState<string>("");
  const [accountKey, setAccountKey] = useState<string>("");

  const [titleSelection, setTitleSelection] = useState<string>("");

  const type = get(match, "params.service", "s3");

  // Validations
  const [isFormValid, setIsFormValid] = useState<boolean>(true);
  const [nameInputError, setNameInputError] = useState<string>("");

  // Extra validation functions

  const validName = useCallback(() => {
    const patternAgainst = /^[A-Z0-9-_]+$/; // Only allow uppercase, numbers, dashes and underscores
    if (patternAgainst.test(name)) {
      setNameInputError("");
      return true;
    }

    setNameInputError(
      "Please verify that string is uppercase only and contains valid characters (numbers, dashes & underscores)."
    );
    return false;
  }, [name]);

  //Effects

  useEffect(() => {
    if (saving) {
      let request = {};
      let fields = {
        name,
        endpoint,
        bucket,
        prefix,
        region,
      };

      let tierType = type;

      if (type === "minio") {
        tierType = "s3";
      }

      switch (type) {
        case "minio":
        case "s3":
          request = {
            s3: {
              ...fields,
              accesskey: accessKey,
              secretkey: secretKey,
              storageclass: storageClass,
            },
          };
          break;
        case "gcs":
          request = {
            gcs: {
              ...fields,
              creds: encodedCreds,
            },
          };
          break;
        case "azure":
          request = {
            azure: {
              ...fields,
              accountname: accountName,
              accountkey: accountKey,
            },
          };
      }

      let payload = {
        type: tierType,
        ...request,
      };

      api
        .invoke("POST", `/api/v1/admin/tiers`, payload)
        .then(() => {
          setSaving(false);

          history.push("/tiers");
        })
        .catch((err: ErrorResponseHandler) => {
          setSaving(false);
          setErrorSnackMessage(err);
        });
    }
  }, [
    accessKey,
    accountKey,
    accountName,
    bucket,
    encodedCreds,
    endpoint,
    history,
    name,
    prefix,
    region,
    saving,
    secretKey,
    setErrorSnackMessage,
    storageClass,
    type,
  ]);

  useEffect(() => {
    let valid = true;
    if (type === "") {
      valid = false;
    }
    if (name === "" || !validName()) {
      valid = false;
    }
    if (endpoint === "") {
      valid = false;
    }
    if (bucket === "") {
      valid = false;
    }
    if (prefix === "") {
      valid = false;
    }
    if (region === "") {
      valid = false;
    }

    if (type === "s3" || type === "minio") {
      if (accessKey === "") {
        valid = false;
      }
      if (secretKey === "") {
        valid = false;
      }
    }

    if (type === "gcs") {
      if (encodedCreds === "") {
        valid = false;
      }
    }

    if (type === "azure") {
      if (accountName === "") {
        valid = false;
      }
      if (accountKey === "") {
        valid = false;
      }
    }

    setIsFormValid(valid);
  }, [
    accessKey,
    accountKey,
    accountName,
    bucket,
    encodedCreds,
    endpoint,
    isFormValid,
    name,
    prefix,
    region,
    secretKey,
    storageClass,
    type,
    validName,
  ]);

  useEffect(() => {
    switch (type) {
      case "gcs":
        setEndpoint("https://storage.googleapis.com/");
        setTitleSelection("Google Cloud");
        break;
      case "s3":
        setEndpoint("https://s3.amazonaws.com");
        setTitleSelection("Amazon S3");
        break;
      case "azure":
        setEndpoint("http://blob.core.windows.net");
        setTitleSelection("Azure");
        break;
      case "minio":
        setEndpoint("");
        setTitleSelection("MinIO");
    }
  }, [type]);

  //Fetch Actions
  const submitForm = (event: React.FormEvent) => {
    event.preventDefault();
    setSaving(true);
  };

  // Input actions
  const updateTierName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value.toUpperCase());
  };

  const backClick = () => {
    history.push("/tiers/add");
  };

  const targetElement = tierTypes.find((item) => item.serviceName === type);

  return (
    <Fragment>
      <PageHeader label="Tiers" />
      <Grid container className={classes.mainCont}>
        <Grid item xs={12} className={classes.backTo}>
          <button onClick={backClick} className={classes.backButton}>
            <BackSettingsIcon />
            Back To Tier Type Selection
          </button>
        </Grid>
        {type !== "" && (
          <Fragment>
            <Grid item xs={12}>
              {targetElement && (
                <div
                  key={`icon-${targetElement.targetTitle}`}
                  className={classes.lambdaNotif}
                >
                  <div className={classes.lambdaNotifIcon}>
                    <img
                      src={targetElement.logo}
                      className={classes.logoButton}
                      alt={targetElement.targetTitle}
                    />
                  </div>

                  <div className={classes.lambdaNotifTitle}>
                    <b>
                      {titleSelection ? titleSelection : ""} Tier Configuration
                    </b>
                  </div>
                </div>
              )}
            </Grid>
          </Fragment>
        )}
        <Grid item xs={12}>
          <form noValidate onSubmit={submitForm}>
            <Grid item xs={12}>
              <Grid container>
                {type !== "" && (
                  <Fragment>
                    <InputBoxWrapper
                      id="name"
                      name="name"
                      label="Name"
                      placeholder="Enter Name (Eg. REMOTE-TIER)"
                      value={name}
                      onChange={updateTierName}
                      error={nameInputError}
                    />
                    <InputBoxWrapper
                      id="endpoint"
                      name="endpoint"
                      label="Endpoint"
                      placeholder="Enter Endpoint"
                      value={endpoint}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        setEndpoint(e.target.value);
                      }}
                    />
                    {(type === s3ServiceName || type === minioServiceName) && (
                      <Fragment>
                        <InputBoxWrapper
                          id="accessKey"
                          name="accessKey"
                          label="Access Key"
                          placeholder="Enter Access Key"
                          value={accessKey}
                          onChange={(
                            e: React.ChangeEvent<HTMLInputElement>
                          ) => {
                            setAccessKey(e.target.value);
                          }}
                        />
                        <InputBoxWrapper
                          id="secretKey"
                          name="secretKey"
                          label="Secret Key"
                          placeholder="Enter Secret Key"
                          value={secretKey}
                          onChange={(
                            e: React.ChangeEvent<HTMLInputElement>
                          ) => {
                            setSecretKey(e.target.value);
                          }}
                        />
                      </Fragment>
                    )}
                    {type === gcsServiceName && (
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
                    {type === azureServiceName && (
                      <Fragment>
                        <InputBoxWrapper
                          id="accountName"
                          name="accountName"
                          label="Account Name"
                          placeholder="Enter Account Name"
                          value={accountName}
                          onChange={(
                            e: React.ChangeEvent<HTMLInputElement>
                          ) => {
                            setAccountName(e.target.value);
                          }}
                        />
                        <InputBoxWrapper
                          id="accountKey"
                          name="accountKey"
                          label="Account Key"
                          placeholder="Enter Account Key"
                          value={accountKey}
                          onChange={(
                            e: React.ChangeEvent<HTMLInputElement>
                          ) => {
                            setAccountKey(e.target.value);
                          }}
                        />
                      </Fragment>
                    )}
                    <InputBoxWrapper
                      id="bucket"
                      name="bucket"
                      label="Bucket"
                      placeholder="Enter Bucket"
                      value={bucket}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        setBucket(e.target.value);
                      }}
                    />
                    <InputBoxWrapper
                      id="prefix"
                      name="prefix"
                      label="Prefix"
                      placeholder="Enter Prefix"
                      value={prefix}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        setPrefix(e.target.value);
                      }}
                    />
                    <InputBoxWrapper
                      id="region"
                      name="region"
                      label="Region"
                      placeholder="Enter Region"
                      value={region}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        setRegion(e.target.value);
                      }}
                    />
                    {type === s3ServiceName ||
                      (type === minioServiceName && (
                        <InputBoxWrapper
                          id="storageClass"
                          name="storageClass"
                          label="Storage Class"
                          placeholder="Enter Storage Class"
                          value={storageClass}
                          onChange={(
                            e: React.ChangeEvent<HTMLInputElement>
                          ) => {
                            setStorageClass(e.target.value);
                          }}
                        />
                      ))}
                  </Fragment>
                )}
              </Grid>
            </Grid>
            <Grid item xs={12} className={classes.settingsButtonContainer}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={saving || !isFormValid}
              >
                Save
              </Button>
            </Grid>
          </form>
        </Grid>
      </Grid>
    </Fragment>
  );
};

const mapDispatchToProps = {
  setErrorSnackMessage,
};

const connector = connect(null, mapDispatchToProps);

export default withStyles(styles)(connector(AddTierConfiguration));
