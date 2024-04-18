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
import {
  BackLink,
  breakPoints,
  Button,
  FileSelector,
  Grid,
  InputBox,
  PageLayout,
  SectionTitle,
} from "mds";
import { api } from "api";
import { errorToHandler } from "api/errors";
import { ApiError } from "api/consoleApi";
import { modalStyleUtils } from "../../Common/FormComponents/common/styleLibrary";
import {
  azureServiceName,
  gcsServiceName,
  minioServiceName,
  s3ServiceName,
  tierTypes,
} from "./utils";
import { IAM_PAGES } from "../../../../common/SecureComponent/permissions";
import { setErrorSnackMessage, setHelpName } from "../../../../systemSlice";
import { useAppDispatch } from "../../../../store";
import RegionSelectWrapper from "./RegionSelectWrapper";
import PageHeaderWrapper from "../../Common/PageHeaderWrapper/PageHeaderWrapper";
import HelpMenu from "../../HelpMenu";

const AddTierConfiguration = () => {
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
      "Please verify that string is uppercase only and contains valid characters (numbers, dashes & underscores).",
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
        type: tierType as
          | "azure"
          | "s3"
          | "minio"
          | "gcs"
          | "unsupported"
          | undefined,
        ...request,
      };

      api.admin
        .addTier(payload)
        .then(() => {
          setSaving(false);
          navigate(IAM_PAGES.TIERS);
        })
        .catch(async (res) => {
          const err = (await res.json()) as ApiError;
          setSaving(false);
          dispatch(setErrorSnackMessage(errorToHandler(err)));
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

  useEffect(() => {
    dispatch(setHelpName("add-tier-configuration"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Fragment>
      <PageHeaderWrapper
        label={
          <Fragment>
            <BackLink
              label={"Add Tier"}
              onClick={() => navigate(IAM_PAGES.TIERS_ADD)}
            />
          </Fragment>
        }
        actions={<HelpMenu />}
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
              <SectionTitle icon={targetElement.logo} sx={{ marginBottom: 20 }}>
                {titleSelection ? titleSelection : ""} - Add Tier Configuration
              </SectionTitle>
            ) : null}
            <Grid
              item
              xs={12}
              sx={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gridAutoFlow: "row",
                gridRowGap: 20,
                gridColumnGap: 50,
                [`@media (max-width: ${breakPoints.sm}px)`]: {
                  gridTemplateColumns: "1fr",
                  gridAutoFlow: "dense",
                },
              }}
            >
              {type !== "" && (
                <Fragment>
                  <InputBox
                    id="name"
                    name="name"
                    label="Name"
                    placeholder="Enter Name (Eg. REMOTE-TIER)"
                    value={name}
                    onChange={updateTierName}
                    error={nameInputError}
                    required
                  />
                  <InputBox
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
                      <InputBox
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
                      <InputBox
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
                      required
                    />
                  )}
                  {type === azureServiceName && (
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
                        required
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
                        required
                      />
                    </Fragment>
                  )}
                  <InputBox
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
                  <InputBox
                    id="prefix"
                    name="prefix"
                    label="Prefix"
                    placeholder="Enter Prefix"
                    value={prefix}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      setPrefix(e.target.value);
                    }}
                  />
                  <RegionSelectWrapper
                    onChange={(value) => {
                      setRegion(value);
                    }}
                    required={type !== "minio"}
                    label={"Region"}
                    id="region"
                    type={type as "azure" | "s3" | "minio" | "gcs"}
                  />
                  {type === s3ServiceName && (
                    <InputBox
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
            <Grid item xs={12} sx={modalStyleUtils.modalButtonBar}>
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

export default AddTierConfiguration;
