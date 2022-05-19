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
import { useDispatch, useSelector } from "react-redux";
import { Theme } from "@mui/material/styles";
import createStyles from "@mui/styles/createStyles";
import withStyles from "@mui/styles/withStyles";
import { Paper } from "@mui/material";
import Grid from "@mui/material/Grid";

import {
  createTenantCommon,
  formFieldStyles,
  modalBasic,
  wizardCommon,
} from "../../../Common/FormComponents/common/styleLibrary";
import { AppState } from "../../../../../store";
import { clearValidationError } from "../../utils";
import InputBoxWrapper from "../../../Common/FormComponents/InputBoxWrapper/InputBoxWrapper";
import FormSwitchWrapper from "../../../Common/FormComponents/FormSwitchWrapper/FormSwitchWrapper";
import FileSelector from "../../../Common/FormComponents/FileSelector/FileSelector";
import RadioGroupSelector from "../../../Common/FormComponents/RadioGroupSelector/RadioGroupSelector";
import {
  commonFormValidation,
  IValidation,
} from "../../../../../utils/validationFunctions";
import SectionH1 from "../../../Common/SectionH1";
import {
  addFileClientCert,
  addFileGemaltoCa,
  addFileServerCert,
  addFileVaultCa,
  addFileVaultCert,
  isPageValid,
  updateAddField,
} from "../../tenantsSlice";

interface IEncryptionProps {
  classes: any;
}

const styles = (theme: Theme) =>
  createStyles({
    encryptionTypeOptions: {
      marginBottom: 15,
    },
    mutualTlsConfig: {
      marginTop: 15,
      "& fieldset": {
        flex: 1,
      },
    },
    rightSpacer: {
      marginRight: 15,
    },
    responsiveContainer: {
      "@media (max-width: 900px)": {
        display: "flex",
        flexFlow: "column",
      },
    },
    ...createTenantCommon,
    ...formFieldStyles,
    ...modalBasic,
    ...wizardCommon,
  });

const Encryption = ({ classes }: IEncryptionProps) => {
  const dispatch = useDispatch();

  const replicas = useSelector(
    (state: AppState) => state.tenants.createTenant.fields.encryption.replicas
  );
  const enableEncryption = useSelector(
    (state: AppState) =>
      state.tenants.createTenant.fields.encryption.enableEncryption
  );
  const encryptionType = useSelector(
    (state: AppState) =>
      state.tenants.createTenant.fields.encryption.encryptionType
  );
  const gemaltoEndpoint = useSelector(
    (state: AppState) =>
      state.tenants.createTenant.fields.encryption.gemaltoEndpoint
  );
  const gemaltoToken = useSelector(
    (state: AppState) =>
      state.tenants.createTenant.fields.encryption.gemaltoToken
  );
  const gemaltoDomain = useSelector(
    (state: AppState) =>
      state.tenants.createTenant.fields.encryption.gemaltoDomain
  );
  const gemaltoRetry = useSelector(
    (state: AppState) =>
      state.tenants.createTenant.fields.encryption.gemaltoRetry
  );
  const awsEndpoint = useSelector(
    (state: AppState) =>
      state.tenants.createTenant.fields.encryption.awsEndpoint
  );
  const awsRegion = useSelector(
    (state: AppState) => state.tenants.createTenant.fields.encryption.awsRegion
  );
  const awsKMSKey = useSelector(
    (state: AppState) => state.tenants.createTenant.fields.encryption.awsKMSKey
  );
  const awsAccessKey = useSelector(
    (state: AppState) =>
      state.tenants.createTenant.fields.encryption.awsAccessKey
  );
  const awsSecretKey = useSelector(
    (state: AppState) =>
      state.tenants.createTenant.fields.encryption.awsSecretKey
  );
  const awsToken = useSelector(
    (state: AppState) => state.tenants.createTenant.fields.encryption.awsToken
  );
  const vaultEndpoint = useSelector(
    (state: AppState) =>
      state.tenants.createTenant.fields.encryption.vaultEndpoint
  );
  const vaultEngine = useSelector(
    (state: AppState) =>
      state.tenants.createTenant.fields.encryption.vaultEngine
  );
  const vaultNamespace = useSelector(
    (state: AppState) =>
      state.tenants.createTenant.fields.encryption.vaultNamespace
  );
  const vaultPrefix = useSelector(
    (state: AppState) =>
      state.tenants.createTenant.fields.encryption.vaultPrefix
  );
  const vaultAppRoleEngine = useSelector(
    (state: AppState) =>
      state.tenants.createTenant.fields.encryption.vaultAppRoleEngine
  );
  const vaultId = useSelector(
    (state: AppState) => state.tenants.createTenant.fields.encryption.vaultId
  );
  const vaultSecret = useSelector(
    (state: AppState) =>
      state.tenants.createTenant.fields.encryption.vaultSecret
  );
  const vaultRetry = useSelector(
    (state: AppState) => state.tenants.createTenant.fields.encryption.vaultRetry
  );
  const vaultPing = useSelector(
    (state: AppState) => state.tenants.createTenant.fields.encryption.vaultPing
  );
  const azureEndpoint = useSelector(
    (state: AppState) =>
      state.tenants.createTenant.fields.encryption.azureEndpoint
  );
  const azureTenantID = useSelector(
    (state: AppState) =>
      state.tenants.createTenant.fields.encryption.azureTenantID
  );
  const azureClientID = useSelector(
    (state: AppState) =>
      state.tenants.createTenant.fields.encryption.azureClientID
  );
  const azureClientSecret = useSelector(
    (state: AppState) =>
      state.tenants.createTenant.fields.encryption.azureClientSecret
  );
  const gcpProjectID = useSelector(
    (state: AppState) =>
      state.tenants.createTenant.fields.encryption.gcpProjectID
  );
  const gcpEndpoint = useSelector(
    (state: AppState) =>
      state.tenants.createTenant.fields.encryption.gcpEndpoint
  );
  const gcpClientEmail = useSelector(
    (state: AppState) =>
      state.tenants.createTenant.fields.encryption.gcpClientEmail
  );
  const gcpClientID = useSelector(
    (state: AppState) =>
      state.tenants.createTenant.fields.encryption.gcpClientID
  );
  const gcpPrivateKeyID = useSelector(
    (state: AppState) =>
      state.tenants.createTenant.fields.encryption.gcpPrivateKeyID
  );
  const gcpPrivateKey = useSelector(
    (state: AppState) =>
      state.tenants.createTenant.fields.encryption.gcpPrivateKey
  );
  const enableCustomCertsForKES = useSelector(
    (state: AppState) =>
      state.tenants.createTenant.fields.encryption.enableCustomCertsForKES
  );
  const enableAutoCert = useSelector(
    (state: AppState) =>
      state.tenants.createTenant.fields.security.enableAutoCert
  );
  const enableTLS = useSelector(
    (state: AppState) => state.tenants.createTenant.fields.security.enableTLS
  );
  const minioCertificates = useSelector(
    (state: AppState) =>
      state.tenants.createTenant.certificates.minioCertificates
  );
  const serverCertificate = useSelector(
    (state: AppState) =>
      state.tenants.createTenant.certificates.serverCertificate
  );
  const clientCertificate = useSelector(
    (state: AppState) =>
      state.tenants.createTenant.certificates.clientCertificate
  );
  const vaultCertificate = useSelector(
    (state: AppState) =>
      state.tenants.createTenant.certificates.vaultCertificate
  );
  const vaultCA = useSelector(
    (state: AppState) => state.tenants.createTenant.certificates.vaultCA
  );
  const gemaltoCA = useSelector(
    (state: AppState) => state.tenants.createTenant.certificates.gemaltoCA
  );
  const enableCustomCerts = useSelector(
    (state: AppState) =>
      state.tenants.createTenant.fields.security.enableCustomCerts
  );
  const kesSecurityContext = useSelector(
    (state: AppState) =>
      state.tenants.createTenant.fields.encryption.kesSecurityContext
  );

  const [validationErrors, setValidationErrors] = useState<any>({});

  let encryptionAvailable = false;
  if (
    enableTLS &&
    (enableAutoCert ||
      (minioCertificates &&
        minioCertificates.filter(
          (item) => item.encoded_key && item.encoded_cert
        ).length > 0))
  ) {
    encryptionAvailable = true;
  }

  // Common
  const updateField = useCallback(
    (field: string, value: any) => {
      dispatch(
        updateAddField({ pageName: "encryption", field: field, value: value })
      );
    },
    [dispatch]
  );

  const cleanValidation = (fieldName: string) => {
    setValidationErrors(clearValidationError(validationErrors, fieldName));
  };

  // Validation
  useEffect(() => {
    let encryptionValidation: IValidation[] = [];

    if (enableEncryption) {
      encryptionValidation = [
        ...encryptionValidation,
        {
          fieldKey: "replicas",
          required: true,
          value: replicas,
          customValidation: parseInt(replicas) < 1,
          customValidationMessage: "Replicas needs to be 1 or greater",
        },
        {
          fieldKey: "kes_securityContext_runAsUser",
          required: true,
          value: kesSecurityContext.runAsUser,
          customValidation:
            kesSecurityContext.runAsUser === "" ||
            parseInt(kesSecurityContext.runAsUser) < 0,
          customValidationMessage: `runAsUser must be present and be 0 or more`,
        },
        {
          fieldKey: "kes_securityContext_runAsGroup",
          required: true,
          value: kesSecurityContext.runAsGroup,
          customValidation:
            kesSecurityContext.runAsGroup === "" ||
            parseInt(kesSecurityContext.runAsGroup) < 0,
          customValidationMessage: `runAsGroup must be present and be 0 or more`,
        },
        {
          fieldKey: "kes_securityContext_fsGroup",
          required: true,
          value: kesSecurityContext.fsGroup,
          customValidation:
            kesSecurityContext.fsGroup === "" ||
            parseInt(kesSecurityContext.fsGroup) < 0,
          customValidationMessage: `fsGroup must be present and be 0 or more`,
        },
      ];

      if (enableCustomCerts) {
        encryptionValidation = [
          ...encryptionValidation,
          {
            fieldKey: "serverKey",
            required: !enableAutoCert,
            value: serverCertificate.encoded_key,
          },
          {
            fieldKey: "serverCert",
            required: !enableAutoCert,
            value: serverCertificate.encoded_cert,
          },
          {
            fieldKey: "clientKey",
            required: !enableAutoCert,
            value: clientCertificate.encoded_key,
          },
          {
            fieldKey: "clientCert",
            required: !enableAutoCert,
            value: clientCertificate.encoded_cert,
          },
        ];
      }

      if (encryptionType === "vault") {
        encryptionValidation = [
          ...encryptionValidation,
          {
            fieldKey: "vault_endpoint",
            required: true,
            value: vaultEndpoint,
          },
          {
            fieldKey: "vault_id",
            required: true,
            value: vaultId,
          },
          {
            fieldKey: "vault_secret",
            required: true,
            value: vaultSecret,
          },
          {
            fieldKey: "vault_ping",
            required: false,
            value: vaultPing,
            customValidation: parseInt(vaultPing) < 0,
            customValidationMessage: "Value needs to be 0 or greater",
          },
          {
            fieldKey: "vault_retry",
            required: false,
            value: vaultRetry,
            customValidation: parseInt(vaultRetry) < 0,
            customValidationMessage: "Value needs to be 0 or greater",
          },
        ];
      }

      if (encryptionType === "aws") {
        encryptionValidation = [
          ...encryptionValidation,
          {
            fieldKey: "aws_endpoint",
            required: true,
            value: awsEndpoint,
          },
          {
            fieldKey: "aws_region",
            required: true,
            value: awsRegion,
          },
          {
            fieldKey: "aws_accessKey",
            required: true,
            value: awsAccessKey,
          },
          {
            fieldKey: "aws_secretKey",
            required: true,
            value: awsSecretKey,
          },
        ];
      }

      if (encryptionType === "gemalto") {
        encryptionValidation = [
          ...encryptionValidation,
          {
            fieldKey: "gemalto_endpoint",
            required: true,
            value: gemaltoEndpoint,
          },
          {
            fieldKey: "gemalto_token",
            required: true,
            value: gemaltoToken,
          },
          {
            fieldKey: "gemalto_domain",
            required: true,
            value: gemaltoDomain,
          },
          {
            fieldKey: "gemalto_retry",
            required: false,
            value: gemaltoRetry,
            customValidation: parseInt(gemaltoRetry) < 0,
            customValidationMessage: "Value needs to be 0 or greater",
          },
        ];
      }

      if (encryptionType === "azure") {
        encryptionValidation = [
          ...encryptionValidation,
          {
            fieldKey: "azure_endpoint",
            required: true,
            value: azureEndpoint,
          },
          {
            fieldKey: "azure_tenant_id",
            required: true,
            value: azureTenantID,
          },
          {
            fieldKey: "azure_client_id",
            required: true,
            value: azureClientID,
          },
          {
            fieldKey: "azure_client_secret",
            required: true,
            value: azureClientSecret,
          },
        ];
      }
    }

    const commonVal = commonFormValidation(encryptionValidation);

    dispatch(
      isPageValid({
        pageName: "encryption",
        valid: Object.keys(commonVal).length === 0,
      })
    );

    setValidationErrors(commonVal);
  }, [
    enableEncryption,
    encryptionType,
    vaultEndpoint,
    vaultEngine,
    vaultId,
    vaultSecret,
    vaultPing,
    vaultRetry,
    awsEndpoint,
    awsRegion,
    awsSecretKey,
    awsAccessKey,
    gemaltoEndpoint,
    gemaltoToken,
    gemaltoDomain,
    gemaltoRetry,
    gcpProjectID,
    gcpEndpoint,
    gcpClientEmail,
    gcpClientID,
    gcpPrivateKeyID,
    gcpPrivateKey,
    azureEndpoint,
    azureTenantID,
    azureClientID,
    azureClientSecret,
    dispatch,
    enableAutoCert,
    enableCustomCerts,
    serverCertificate.encoded_key,
    serverCertificate.encoded_cert,
    clientCertificate.encoded_key,
    clientCertificate.encoded_cert,
    kesSecurityContext,
    replicas,
  ]);

  return (
    <Paper className={classes.paperWrapper}>
      <Grid container alignItems={"center"}>
        <Grid item xs>
          <SectionH1>Encryption</SectionH1>
        </Grid>
        <Grid item xs={4} justifyContent={"end"} textAlign={"right"}>
          <FormSwitchWrapper
            label={""}
            indicatorLabels={["Enabled", "Disabled"]}
            checked={enableEncryption}
            value={"tenant_encryption"}
            id="tenant-encryption"
            name="tenant-encryption"
            onChange={(e) => {
              const targetD = e.target;
              const checked = targetD.checked;

              updateField("enableEncryption", checked);
            }}
            description=""
            disabled={!encryptionAvailable}
          />
        </Grid>
      </Grid>
      <Grid container spacing={1}>
        <Grid item xs={12}>
          <span className={classes.descriptionText}>
            MinIO Server-Side Encryption (SSE) protects objects as part of write
            operations, allowing clients to take advantage of server processing
            power to secure objects at the storage layer (encryption-at-rest).
            SSE also provides key functionality to regulatory and compliance
            requirements around secure locking and erasure.
          </span>
        </Grid>
        <Grid xs={12}>
          <hr className={classes.hrClass} />
        </Grid>

        {enableEncryption && (
          <Fragment>
            <Grid item xs={12} className={classes.encryptionTypeOptions}>
              <RadioGroupSelector
                currentSelection={encryptionType}
                id="encryptionType"
                name="encryptionType"
                label="Encryption Options"
                onChange={(e) => {
                  updateField("encryptionType", e.target.value);
                }}
                selectorOptions={[
                  { label: "Vault", value: "vault" },
                  { label: "AWS", value: "aws" },
                  { label: "Gemalto", value: "gemalto" },
                  { label: "GCP", value: "gcp" },
                  { label: "Azure", value: "azure" },
                ]}
              />
            </Grid>
            {encryptionType === "vault" && (
              <Fragment>
                <Grid item xs={12} className={classes.formFieldRow}>
                  <InputBoxWrapper
                    id="vault_endpoint"
                    name="vault_endpoint"
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      updateField("vaultEndpoint", e.target.value);
                      cleanValidation("vault_endpoint");
                    }}
                    label="Endpoint"
                    value={vaultEndpoint}
                    error={validationErrors["vault_endpoint"] || ""}
                    required
                  />
                </Grid>
                <Grid item xs={12} className={classes.formFieldRow}>
                  <InputBoxWrapper
                    id="vault_engine"
                    name="vault_engine"
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      updateField("vaultEngine", e.target.value);
                      cleanValidation("vault_engine");
                    }}
                    label="Engine"
                    value={vaultEngine}
                  />
                </Grid>
                <Grid item xs={12} className={classes.formFieldRow}>
                  <InputBoxWrapper
                    id="vault_namespace"
                    name="vault_namespace"
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      updateField("vaultNamespace", e.target.value);
                    }}
                    label="Namespace"
                    value={vaultNamespace}
                  />
                </Grid>
                <Grid item xs={12} className={classes.formFieldRow}>
                  <InputBoxWrapper
                    id="vault_prefix"
                    name="vault_prefix"
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      updateField("vaultPrefix", e.target.value);
                    }}
                    label="Prefix"
                    value={vaultPrefix}
                  />
                </Grid>

                <Grid item xs={12}>
                  <fieldset className={classes.fieldGroup}>
                    <legend className={classes.descriptionText}>
                      App Role
                    </legend>
                    <Grid item xs={12} className={classes.formFieldRow}>
                      <InputBoxWrapper
                        id="vault_approle_engine"
                        name="vault_approle_engine"
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                          updateField("vaultAppRoleEngine", e.target.value);
                        }}
                        label="Engine"
                        value={vaultAppRoleEngine}
                      />
                    </Grid>
                    <Grid item xs={12} className={classes.formFieldRow}>
                      <InputBoxWrapper
                        id="vault_id"
                        name="vault_id"
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                          updateField("vaultId", e.target.value);
                          cleanValidation("vault_id");
                        }}
                        label="AppRole ID"
                        value={vaultId}
                        error={validationErrors["vault_id"] || ""}
                        required
                      />
                    </Grid>
                    <Grid item xs={12} className={classes.formFieldRow}>
                      <InputBoxWrapper
                        id="vault_secret"
                        name="vault_secret"
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                          updateField("vaultSecret", e.target.value);
                          cleanValidation("vault_secret");
                        }}
                        label="AppRole Secret"
                        value={vaultSecret}
                        error={validationErrors["vault_secret"] || ""}
                        required
                      />
                    </Grid>
                    <Grid item xs={12} className={classes.formFieldRow}>
                      <InputBoxWrapper
                        type="number"
                        min="0"
                        id="vault_retry"
                        name="vault_retry"
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                          updateField("vaultRetry", e.target.value);
                          cleanValidation("vault_retry");
                        }}
                        label="Retry (Seconds)"
                        value={vaultRetry}
                        error={validationErrors["vault_retry"] || ""}
                      />
                    </Grid>
                  </fieldset>
                </Grid>

                <Grid container className={classes.mutualTlsConfig}>
                  <fieldset className={classes.fieldGroup}>
                    <legend className={classes.descriptionText}>
                      Mutual TLS authentication (optional)
                    </legend>
                    <FileSelector
                      onChange={(encodedValue, fileName) => {
                        dispatch(
                          addFileVaultCert({
                            key: "key",
                            fileName: fileName,
                            value: encodedValue,
                          })
                        );
                        cleanValidation("vault_key");
                      }}
                      accept=".key,.pem"
                      id="vault_key"
                      name="vault_key"
                      label="Key"
                      value={vaultCertificate.key}
                    />
                    <FileSelector
                      onChange={(encodedValue, fileName) => {
                        dispatch(
                          addFileVaultCert({
                            key: "cert",
                            fileName: fileName,
                            value: encodedValue,
                          })
                        );
                        cleanValidation("vault_cert");
                      }}
                      accept=".cer,.crt,.cert,.pem"
                      id="vault_cert"
                      name="vault_cert"
                      label="Cert"
                      value={vaultCertificate.cert}
                    />
                    <FileSelector
                      onChange={(encodedValue, fileName) => {
                        dispatch(
                          addFileVaultCa({
                            fileName: fileName,
                            value: encodedValue,
                          })
                        );
                        cleanValidation("vault_ca");
                      }}
                      accept=".cer,.crt,.cert,.pem"
                      id="vault_ca"
                      name="vault_ca"
                      label="CA"
                      value={vaultCA.cert}
                    />
                  </fieldset>
                </Grid>
                <Grid
                  item
                  xs={12}
                  className={classes.formFieldRow}
                  style={{ marginTop: 15 }}
                >
                  <fieldset className={classes.fieldGroup}>
                    <legend className={classes.descriptionText}>Status</legend>
                    <InputBoxWrapper
                      type="number"
                      min="0"
                      id="vault_ping"
                      name="vault_ping"
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        updateField("vaultPing", e.target.value);
                        cleanValidation("vault_ping");
                      }}
                      label="Ping (Seconds)"
                      value={vaultPing}
                      error={validationErrors["vault_ping"] || ""}
                    />
                  </fieldset>
                </Grid>
              </Fragment>
            )}
            {encryptionType === "azure" && (
              <Fragment>
                <Grid item xs={12} className={classes.formFieldRow}>
                  <InputBoxWrapper
                    id="azure_endpoint"
                    name="azure_endpoint"
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      updateField("azureEndpoint", e.target.value);
                      cleanValidation("azure_endpoint");
                    }}
                    label="Endpoint"
                    value={azureEndpoint}
                    error={validationErrors["azure_endpoint"] || ""}
                  />
                </Grid>
                <Grid item xs={12}>
                  <fieldset className={classes.fieldGroup}>
                    <legend className={classes.descriptionText}>
                      Credentials
                    </legend>
                    <Grid item xs={12} className={classes.formFieldRow}>
                      <InputBoxWrapper
                        id="azure_tenant_id"
                        name="azure_tenant_id"
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                          updateField("azureTenantID", e.target.value);
                          cleanValidation("azure_tenant_id");
                        }}
                        label="Tenant ID"
                        value={azureTenantID}
                        error={validationErrors["azure_tenant_id"] || ""}
                      />
                    </Grid>
                    <Grid item xs={12} className={classes.formFieldRow}>
                      <InputBoxWrapper
                        id="azure_client_id"
                        name="azure_client_id"
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                          updateField("azureClientID", e.target.value);
                          cleanValidation("azure_client_id");
                        }}
                        label="Client ID"
                        value={azureClientID}
                        error={validationErrors["azure_client_id"] || ""}
                      />
                    </Grid>
                    <Grid item xs={12} className={classes.formFieldRow}>
                      <InputBoxWrapper
                        id="azure_client_secret"
                        name="azure_client_secret"
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                          updateField("azureClientSecret", e.target.value);
                          cleanValidation("azure_client_secret");
                        }}
                        label="Client Secret"
                        value={azureClientSecret}
                        error={validationErrors["azure_client_secret"] || ""}
                      />
                    </Grid>
                  </fieldset>
                </Grid>
              </Fragment>
            )}
            {encryptionType === "gcp" && (
              <Fragment>
                <Grid item xs={12} className={classes.formFieldRow}>
                  <InputBoxWrapper
                    id="gcp_project_id"
                    name="gcp_project_id"
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      updateField("gcpProjectID", e.target.value);
                    }}
                    label="Project ID"
                    value={gcpProjectID}
                  />
                </Grid>
                <Grid item xs={12} className={classes.formFieldRow}>
                  <InputBoxWrapper
                    id="gcp_endpoint"
                    name="gcp_endpoint"
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      updateField("gcpEndpoint", e.target.value);
                    }}
                    label="Endpoint"
                    value={gcpEndpoint}
                  />
                </Grid>
                <Grid item xs={12}>
                  <fieldset className={classes.fieldGroup}>
                    <legend className={classes.descriptionText}>
                      Credentials
                    </legend>
                    <Grid item xs={12} className={classes.formFieldRow}>
                      <InputBoxWrapper
                        id="gcp_client_email"
                        name="gcp_client_email"
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                          updateField("gcpClientEmail", e.target.value);
                        }}
                        label="Client Email"
                        value={gcpClientEmail}
                      />
                    </Grid>
                    <Grid item xs={12} className={classes.formFieldRow}>
                      <InputBoxWrapper
                        id="gcp_client_id"
                        name="gcp_client_id"
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                          updateField("gcpClientID", e.target.value);
                        }}
                        label="Client ID"
                        value={gcpClientID}
                      />
                    </Grid>
                    <Grid item xs={12} className={classes.formFieldRow}>
                      <InputBoxWrapper
                        id="gcp_private_key_id"
                        name="gcp_private_key_id"
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                          updateField("gcpPrivateKeyID", e.target.value);
                        }}
                        label="Private Key ID"
                        value={gcpPrivateKeyID}
                      />
                    </Grid>
                    <Grid item xs={12} className={classes.formFieldRow}>
                      <InputBoxWrapper
                        id="gcp_private_key"
                        name="gcp_private_key"
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                          updateField("gcpPrivateKey", e.target.value);
                        }}
                        label="Private Key"
                        value={gcpPrivateKey}
                      />
                    </Grid>
                  </fieldset>
                </Grid>
              </Fragment>
            )}
            {encryptionType === "aws" && (
              <Fragment>
                <Grid item xs={12} className={classes.formFieldRow}>
                  <InputBoxWrapper
                    id="aws_endpoint"
                    name="aws_endpoint"
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      updateField("awsEndpoint", e.target.value);
                      cleanValidation("aws_endpoint");
                    }}
                    label="Endpoint"
                    value={awsEndpoint}
                    error={validationErrors["aws_endpoint"] || ""}
                    required
                  />
                </Grid>
                <Grid item xs={12} className={classes.formFieldRow}>
                  <InputBoxWrapper
                    id="aws_region"
                    name="aws_region"
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      updateField("awsRegion", e.target.value);
                      cleanValidation("aws_region");
                    }}
                    label="Region"
                    value={awsRegion}
                    error={validationErrors["aws_region"] || ""}
                    required
                  />
                </Grid>
                <Grid item xs={12} className={classes.formFieldRow}>
                  <InputBoxWrapper
                    id="aws_kmsKey"
                    name="aws_kmsKey"
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      updateField("awsKMSKey", e.target.value);
                    }}
                    label="KMS Key"
                    value={awsKMSKey}
                  />
                </Grid>
                <Grid item xs={12}>
                  <fieldset className={classes.fieldGroup}>
                    <legend className={classes.descriptionText}>
                      Credentials
                    </legend>
                    <Grid item xs={12} className={classes.formFieldRow}>
                      <InputBoxWrapper
                        id="aws_accessKey"
                        name="aws_accessKey"
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                          updateField("awsAccessKey", e.target.value);
                          cleanValidation("aws_accessKey");
                        }}
                        label="Access Key"
                        value={awsAccessKey}
                        error={validationErrors["aws_accessKey"] || ""}
                        required
                      />
                    </Grid>
                    <Grid item xs={12} className={classes.formFieldRow}>
                      <InputBoxWrapper
                        id="aws_secretKey"
                        name="aws_secretKey"
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                          updateField("awsSecretKey", e.target.value);
                          cleanValidation("aws_secretKey");
                        }}
                        label="Secret Key"
                        value={awsSecretKey}
                        error={validationErrors["aws_secretKey"] || ""}
                        required
                      />
                    </Grid>
                    <Grid item xs={12} className={classes.formFieldRow}>
                      <InputBoxWrapper
                        id="aws_token"
                        name="aws_token"
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                          updateField("awsToken", e.target.value);
                        }}
                        label="Token"
                        value={awsToken}
                      />
                    </Grid>
                  </fieldset>
                </Grid>
              </Fragment>
            )}
            {encryptionType === "gemalto" && (
              <Fragment>
                <Grid item xs={12} className={classes.formFieldRow}>
                  <InputBoxWrapper
                    id="gemalto_endpoint"
                    name="gemalto_endpoint"
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      updateField("gemaltoEndpoint", e.target.value);
                      cleanValidation("gemalto_endpoint");
                    }}
                    label="Endpoint"
                    value={gemaltoEndpoint}
                    error={validationErrors["gemalto_endpoint"] || ""}
                    required
                  />
                </Grid>
                <Grid
                  item
                  xs={12}
                  style={{
                    marginBottom: 15,
                  }}
                >
                  <fieldset className={classes.fieldGroup}>
                    <legend className={classes.descriptionText}>
                      Credentials
                    </legend>
                    <Grid item xs={12} className={classes.formFieldRow}>
                      <InputBoxWrapper
                        id="gemalto_token"
                        name="gemalto_token"
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                          updateField("gemaltoToken", e.target.value);
                          cleanValidation("gemalto_token");
                        }}
                        label="Token"
                        value={gemaltoToken}
                        error={validationErrors["gemalto_token"] || ""}
                        required
                      />
                    </Grid>
                    <Grid item xs={12} className={classes.formFieldRow}>
                      <InputBoxWrapper
                        id="gemalto_domain"
                        name="gemalto_domain"
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                          updateField("gemaltoDomain", e.target.value);
                          cleanValidation("gemalto_domain");
                        }}
                        label="Domain"
                        value={gemaltoDomain}
                        error={validationErrors["gemalto_domain"] || ""}
                        required
                      />
                    </Grid>
                    <Grid item xs={12} className={classes.formFieldRow}>
                      <InputBoxWrapper
                        type="number"
                        min="0"
                        id="gemalto_retry"
                        name="gemalto_retry"
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                          updateField("gemaltoRetry", e.target.value);
                          cleanValidation("gemalto_retry");
                        }}
                        label="Retry (seconds)"
                        value={gemaltoRetry}
                        error={validationErrors["gemalto_retry"] || ""}
                      />
                    </Grid>
                  </fieldset>
                </Grid>
                <Grid
                  item
                  xs={12}
                  style={{
                    marginBottom: 15,
                  }}
                >
                  <fieldset className={classes.fieldGroup}>
                    <legend className={classes.descriptionText}>
                      Custom CA Root certificate verification
                    </legend>

                    <FileSelector
                      onChange={(encodedValue, fileName) => {
                        dispatch(
                          addFileGemaltoCa({
                            fileName: fileName,
                            value: encodedValue,
                          })
                        );
                        cleanValidation("gemalto_ca");
                      }}
                      accept=".cer,.crt,.cert,.pem"
                      id="gemalto_ca"
                      name="gemalto_ca"
                      label="CA"
                      value={gemaltoCA.cert}
                    />
                  </fieldset>
                </Grid>
              </Fragment>
            )}
            <div className={classes.headerElement}>
              <h4 className={classes.h3Section}>Additional Configurations</h4>
            </div>
            <Grid item xs={12}>
              <FormSwitchWrapper
                value="enableCustomCertsForKES"
                id="enableCustomCertsForKES"
                name="enableCustomCertsForKES"
                checked={enableCustomCertsForKES || !enableAutoCert}
                onChange={(e) => {
                  const targetD = e.target;
                  const checked = targetD.checked;

                  updateField("enableCustomCertsForKES", checked);
                }}
                label={"Custom Certificates"}
                disabled={!enableAutoCert}
              />
            </Grid>
            {(enableCustomCertsForKES || !enableAutoCert) && (
              <Fragment>
                <Grid container>
                  <Grid item xs={12} style={{ marginBottom: 15 }}>
                    <fieldset className={classes.fieldGroup}>
                      <legend className={classes.descriptionText}>
                        Encryption Service Certificates
                      </legend>
                      <FileSelector
                        onChange={(encodedValue, fileName) => {
                          dispatch(
                            addFileServerCert({
                              key: "key",
                              fileName: fileName,
                              value: encodedValue,
                            })
                          );
                          cleanValidation("serverKey");
                        }}
                        accept=".key,.pem"
                        id="serverKey"
                        name="serverKey"
                        label="Key"
                        error={validationErrors["serverKey"] || ""}
                        value={serverCertificate.key}
                        required={!enableAutoCert}
                      />
                      <FileSelector
                        onChange={(encodedValue, fileName) => {
                          dispatch(
                            addFileServerCert({
                              key: "cert",
                              fileName: fileName,
                              value: encodedValue,
                            })
                          );
                          cleanValidation("serverCert");
                        }}
                        accept=".cer,.crt,.cert,.pem"
                        id="serverCert"
                        name="serverCert"
                        label="Cert"
                        error={validationErrors["serverCert"] || ""}
                        value={serverCertificate.cert}
                        required={!enableAutoCert}
                      />
                    </fieldset>
                  </Grid>
                </Grid>
                <Grid container style={{ marginBottom: 15 }}>
                  <Grid item xs={12}>
                    <fieldset className={classes.fieldGroup}>
                      <legend className={classes.descriptionText}>
                        Mutual TLS authentication with MinIO
                      </legend>
                      <FileSelector
                        onChange={(encodedValue, fileName) => {
                          dispatch(
                            addFileClientCert({
                              key: "key",
                              fileName: fileName,
                              value: encodedValue,
                            })
                          );
                          cleanValidation("clientKey");
                        }}
                        accept=".key,.pem"
                        id="clientKey"
                        name="clientKey"
                        label="Key"
                        error={validationErrors["clientKey"] || ""}
                        value={clientCertificate.key}
                        required={!enableAutoCert}
                      />
                      <FileSelector
                        onChange={(encodedValue, fileName) => {
                          dispatch(
                            addFileClientCert({
                              key: "cert",
                              fileName: fileName,
                              value: encodedValue,
                            })
                          );
                          cleanValidation("clientCert");
                        }}
                        accept=".cer,.crt,.cert,.pem"
                        id="clientCert"
                        name="clientCert"
                        label="Cert"
                        error={validationErrors["clientCert"] || ""}
                        value={clientCertificate.cert}
                        required={!enableAutoCert}
                      />
                    </fieldset>
                  </Grid>
                </Grid>
              </Fragment>
            )}
            <Grid item xs={12}>
              <Grid item xs={12} classes={classes.formFieldRow}>
                <InputBoxWrapper
                  type="number"
                  min="1"
                  id="replicas"
                  name="replicas"
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    updateField("replicas", e.target.value);
                    cleanValidation("replicas");
                  }}
                  label="Replicas"
                  value={replicas}
                  required
                  error={validationErrors["replicas"] || ""}
                />
              </Grid>

              <fieldset
                className={classes.fieldGroup}
                style={{ marginTop: 15 }}
              >
                <legend className={classes.descriptionText}>
                  SecurityContext for KES pods
                </legend>
                <Grid item xs={12} className={classes.kesSecurityContext}>
                  <div
                    className={`${classes.multiContainer} ${classes.responsiveContainer}`}
                  >
                    <div
                      className={`${classes.formFieldRow} ${classes.rightSpacer}`}
                    >
                      <InputBoxWrapper
                        type="number"
                        id="kes_securityContext_runAsUser"
                        name="kes_securityContext_runAsUser"
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                          updateField("kesSecurityContext", {
                            ...kesSecurityContext,
                            runAsUser: e.target.value,
                          });
                          cleanValidation("kes_securityContext_runAsUser");
                        }}
                        label="Run As User"
                        value={kesSecurityContext.runAsUser}
                        required
                        error={
                          validationErrors["kes_securityContext_runAsUser"] ||
                          ""
                        }
                        min="0"
                      />
                    </div>
                    <div
                      className={`${classes.formFieldRow} ${classes.rightSpacer}`}
                    >
                      <InputBoxWrapper
                        type="number"
                        id="kes_securityContext_runAsGroup"
                        name="kes_securityContext_runAsGroup"
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                          updateField("kesSecurityContext", {
                            ...kesSecurityContext,
                            runAsGroup: e.target.value,
                          });
                          cleanValidation("kes_securityContext_runAsGroup");
                        }}
                        label="Run As Group"
                        value={kesSecurityContext.runAsGroup}
                        required
                        error={
                          validationErrors["kes_securityContext_runAsGroup"] ||
                          ""
                        }
                        min="0"
                      />
                    </div>
                    <div
                      className={`${classes.formFieldRow} ${classes.rightSpacer}`}
                    >
                      <InputBoxWrapper
                        type="number"
                        id="kes_securityContext_fsGroup"
                        name="kes_securityContext_fsGroup"
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                          updateField("kesSecurityContext", {
                            ...kesSecurityContext,
                            fsGroup: e.target.value,
                          });
                          cleanValidation("kes_securityContext_fsGroup");
                        }}
                        label="FsGroup"
                        value={kesSecurityContext.fsGroup}
                        required
                        error={
                          validationErrors["kes_securityContext_fsGroup"] || ""
                        }
                        min="0"
                      />
                    </div>
                  </div>
                </Grid>
                <br />
                <Grid item xs={12}>
                  <div className={classes.multiContainer}>
                    <FormSwitchWrapper
                      value="kesSecurityContextRunAsNonRoot"
                      id="kes_securityContext_runAsNonRoot"
                      name="kes_securityContext_runAsNonRoot"
                      checked={kesSecurityContext.runAsNonRoot}
                      onChange={(e) => {
                        const targetD = e.target;
                        const checked = targetD.checked;
                        updateField("kesSecurityContext", {
                          ...kesSecurityContext,
                          runAsNonRoot: checked,
                        });
                      }}
                      label={"Do not run as Root"}
                    />
                  </div>
                </Grid>
              </fieldset>
            </Grid>
          </Fragment>
        )}
      </Grid>
    </Paper>
  );
};

export default withStyles(styles)(Encryption);
