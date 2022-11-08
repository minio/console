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

import React, { Fragment, useCallback, useEffect, useState } from "react";

import { useNavigate, useParams } from "react-router-dom";
import get from "lodash/get";
import Grid from "@mui/material/Grid";
import { Theme } from "@mui/material/styles";
import { Button } from "mds";
import createStyles from "@mui/styles/createStyles";
import withStyles from "@mui/styles/withStyles";
import { Box } from "@mui/material";
import {
  fileInputStyles,
  formFieldStyles,
  modalBasic,
  settingsCommon,
} from "../../Common/FormComponents/common/styleLibrary";
import { ErrorResponseHandler } from "../../../../common/types";
import api from "../../../../common/api";
import InputBoxWrapper from "../../Common/FormComponents/InputBoxWrapper/InputBoxWrapper";
import FileSelector from "../../Common/FormComponents/FileSelector/FileSelector";
import PageHeader from "../../Common/PageHeader/PageHeader";
import {
  azureServiceName,
  gcsServiceName,
  minioServiceName,
  s3ServiceName,
  tierTypes,
} from "./utils";
import BackLink from "../../../../common/BackLink";
import PageLayout from "../../Common/Layout/PageLayout";
import { IAM_PAGES } from "../../../../common/SecureComponent/permissions";

import RegionSelectWrapper from "./RegionSelectWrapper";
import { setErrorSnackMessage } from "../../../../systemSlice";
import { useAppDispatch } from "../../../../store";

const styles = (theme: Theme) =>
  createStyles({
    ...modalBasic,
    ...settingsCommon,
    ...formFieldStyles,
    lambdaNotifTitle: {
      color: "#07193E",
      fontSize: 16,
      fontFamily: "Lato,sans-serif",
      paddingLeft: 18,
    },
    fileInputFieldCss: {
      margin: "0",
    },
    fileTextBoxContainer: {
      maxWidth: " 100%",
      flex: 1,
    },
    fileReselectCss: {
      maxWidth: " 100%",
      flex: 1,
    },
    ...fileInputStyles,
  });

interface IAddNotificationEndpointProps {
  classes: any;
}

const AddTierConfiguration = ({ classes }: IAddNotificationEndpointProps) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const params = useParams();

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

  const type = get(params, "service", "s3");

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

      switch (type) {
        case "minio":
          request = {
            minio: {
              ...fields,
              accesskey: accessKey,
              secretkey: secretKey,
            },
          };
          break;
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
          navigate(IAM_PAGES.TIERS);
        })
        .catch((err: ErrorResponseHandler) => {
          setSaving(false);
          dispatch(setErrorSnackMessage(err));
        });
    }
  }, [
    accessKey,
    accountKey,
    accountName,
    bucket,
    encodedCreds,
    endpoint,
    name,
    prefix,
    region,
    saving,
    secretKey,
    dispatch,
    storageClass,
    type,
    navigate,
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
    if (region === "" && type !== "minio") {
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
        setEndpoint("https://storage.googleapis.com");
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

  const targetElement = tierTypes.find((item) => item.serviceName === type);

  return (
    <Fragment>
      <PageHeader
        label={
          <Fragment>
            <BackLink to={IAM_PAGES.TIERS_ADD} label={"Add Tier"} />
          </Fragment>
        }
        actions={<React.Fragment />}
      />

      <PageLayout>
        <Grid
          item
          xs={12}
          sx={{
            border: "1px solid #eaeaea",
            padding: "25px",
          }}
        >
          <form noValidate onSubmit={submitForm}>
            {type !== "" && targetElement ? (
              <Grid
                item
                xs={12}
                key={`icon-${targetElement.targetTitle}`}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "start",
                  marginBottom: "20px",
                }}
              >
                {targetElement.logo ? (
                  <Box
                    sx={{
                      "& .min-icon": {
                        height: "60px",
                        width: "60px",
                      },
                    }}
                  >
                    {targetElement.logo}
                  </Box>
                ) : null}

                <div className={classes.lambdaNotifTitle}>
                  <b>
                    {titleSelection ? titleSelection : ""} - Add Tier
                    Configuration
                  </b>
                </div>
              </Grid>
            ) : null}

            <Grid
              item
              xs={12}
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                gridAutoFlow: { xs: "dense", sm: "row" },
                gridRowGap: 25,
                gridColumnGap: 50,
              }}
            >
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
                    required
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
                    required
                  />
                  {(type === s3ServiceName || type === minioServiceName) && (
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
                        required
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
                        required
                      />
                    </Fragment>
                  )}
                  {type === gcsServiceName && (
                    <FileSelector
                      accept=".json"
                      classes={{
                        fileInputField: classes.fileInputFieldCss,
                        textBoxContainer: classes.fileTextBoxContainer,
                        fileReselect: classes.fileReselectCss,
                      }}
                      id="creds"
                      label="Credentials"
                      name="creds"
                      onChange={(encodedValue, fileName) => {
                        setEncodedCreds(encodedValue);
                        setCreds(fileName);
                      }}
                      value={creds}
                      required
                    />
                  )}
                  {type === azureServiceName && (
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
                        required
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
                        required
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
                    required
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
                    required
                  />
                  <RegionSelectWrapper
                    onChange={(value) => {
                      setRegion(value);
                    }}
                    required={type !== "minio"}
                    label={"Region"}
                    id="region"
                    name="region"
                    type={type as "azure" | "s3" | "minio" | "gcs"}
                  />
                  {type === s3ServiceName && (
                    <InputBoxWrapper
                      id="storageClass"
                      name="storageClass"
                      label="Storage Class"
                      placeholder="Enter Storage Class"
                      value={storageClass}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        setStorageClass(e.target.value);
                      }}
                    />
                  )}
                </Fragment>
              )}
            </Grid>
            <Grid item xs={12} className={classes.settingsButtonContainer}>
              <Button
                id={"save-tier-configuration"}
                type="submit"
                variant="callAction"
                disabled={saving || !isFormValid}
                label={"Save Tier Configuration"}
              />
            </Grid>
          </form>
        </Grid>
      </PageLayout>
    </Fragment>
  );
};

export default withStyles(styles)(AddTierConfiguration);
