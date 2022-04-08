// This file is part of MinIO Console Server
// Copyright (c) 2022 MinIO, Inc.
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

import { ITenant } from "../ListTenants/types";
import {
  ICertificateInfo,
  ISecurityContext,
  ITenantEncryptionResponse,
} from "../types";
import { Theme } from "@mui/material/styles";
import createStyles from "@mui/styles/createStyles";
import withStyles from "@mui/styles/withStyles";
import {
  containerForHeader,
  createTenantCommon,
  formFieldStyles,
  modalBasic,
  spacingUtils,
  tenantDetailsStyles,
  wizardCommon,
} from "../../Common/FormComponents/common/styleLibrary";
import React, { Fragment, useEffect, useState } from "react";
import { setErrorSnackMessage } from "../../../../actions";
import { connect } from "react-redux";
import { AppState } from "../../../../store";
import { setTenantDetailsLoad } from "../actions";
import api from "../../../../common/api";
import { ErrorResponseHandler } from "../../../../common/types";

import FormSwitchWrapper from "../../Common/FormComponents/FormSwitchWrapper/FormSwitchWrapper";
import Grid from "@mui/material/Grid";
import FileSelector from "../../Common/FormComponents/FileSelector/FileSelector";
import InputBoxWrapper from "../../Common/FormComponents/InputBoxWrapper/InputBoxWrapper";
import RadioGroupSelector from "../../Common/FormComponents/RadioGroupSelector/RadioGroupSelector";
import { Button, DialogContentText, Stack } from "@mui/material";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import { KeyPair } from "../ListTenants/utils";
import { clearValidationError } from "../utils";
import {
  commonFormValidation,
  IValidation,
} from "../../../../utils/validationFunctions";
import ConfirmDialog from "../../Common/ModalWrapper/ConfirmDialog";
import TLSCertificate from "../../Common/TLSCertificate/TLSCertificate";
import StackRow from "../../Common/UsageBarWrapper/StackRow";

interface ITenantEncryption {
  classes: any;
  loadingTenant: boolean;
  tenant: ITenant | null;
  setErrorSnackMessage: typeof setErrorSnackMessage;
  setTenantDetailsLoad: typeof setTenantDetailsLoad;
}

const styles = (theme: Theme) =>
  createStyles({
    ...tenantDetailsStyles,
    ...spacingUtils,
    loaderAlign: {
      textAlign: "center",
    },
    title: {
      marginTop: 35,
    },
    bold: { fontWeight: "bold" },
    italic: { fontStyle: "italic" },
    paperContainer: {
      padding: "15px 15px 15px 50px",
    },
    certificateInfo: {
      height: "auto",
      margin: 5,
    },
    fileItem: {
      marginRight: 10,
      display: "flex",
      "& div label": {
        minWidth: 50,
      },

      "@media (max-width: 900px)": {
        flexFlow: "column",
      },
    },
    certInputRow: {
      display: "flex",
      alignItems: "center",
      borderBottom: "1px solid #eaeaea",
      marginBottom: 8,
    },
    caCertsRow: {
      borderBottom: "1px solid #eaeaea",
      display: "flex",
      alignItems: "center",
      marginBottom: 8,
    },
    ...containerForHeader(theme.spacing(4)),
    ...createTenantCommon,
    ...formFieldStyles,
    ...modalBasic,
    ...wizardCommon,
  });

const TenantEncryption = ({
  classes,
  tenant,
  setErrorSnackMessage,
}: ITenantEncryption) => {
  const [encryptionEnabled, setEncryptionEnabled] = useState<boolean>(false);
  const [encryptionType, setEncryptionType] = useState<string>("vault");
  const [replicas, setReplicas] = useState<string>("2");
  const [image, setImage] = useState<string>("");
  const [refreshEncryptionInfo, setRefreshEncryptionInfo] =
    useState<boolean>(false);
  const [securityContext, setSecurityContext] = useState<ISecurityContext>({
    fsGroup: "1000",
    runAsGroup: "1000",
    runAsNonRoot: true,
    runAsUser: "1000",
  });
  const [vaultConfiguration, setVaultConfiguration] = useState<any>(null);
  const [awsConfiguration, setAWSConfiguration] = useState<any>(null);
  const [gemaltoConfiguration, setGemaltoConfiguration] = useState<any>(null);
  const [azureConfiguration, setAzureConfiguration] = useState<any>(null);
  const [gcpConfiguration, setGCPConfiguration] = useState<any>(null);
  const [enabledCustomCertificates, setEnabledCustomCertificates] =
    useState<boolean>(false);
  const [updatingEncryption, setUpdatingEncryption] = useState<boolean>(false);
  const [serverTLSCertificateSecret, setServerTLSCertificateSecret] =
    useState<ICertificateInfo | null>(null);
  const [mTLSCertificateSecret, setMTLSCertificateSecret] =
    useState<ICertificateInfo | null>(null);
  const [mTLSCertificate, setMTLSCertificate] = useState<KeyPair | null>(null);
  const [certificatesToBeRemoved, setCertificatesToBeRemoved] = useState<
    string[]
  >([]);
  const [showVaultAppRoleID, setShowVaultAppRoleID] = useState<boolean>(false);
  const [isFormValid, setIsFormValid] = useState<boolean>(false);
  const [showVaultAppRoleSecret, setShowVaultAppRoleSecret] =
    useState<boolean>(false);
  const [vaultClientCertificateSecret, setVaultClientCertificateSecret] =
    useState<ICertificateInfo | null>(null);
  const [vaultCACertificateSecret, setVaultCACertificateSecret] =
    useState<ICertificateInfo | null>(null);
  const [vaultClientCertificate, setVaultClientCertificate] =
    useState<KeyPair | null>(null);
  const [serverCertificate, setServerCertificate] = useState<KeyPair | null>(
    null
  );
  const [vaultCACertificate, setVaultCACertificate] = useState<KeyPair | null>(
    null
  );
  const [gemaltoCACertificateSecret, setGemaltoCACertificateSecret] =
    useState<ICertificateInfo | null>(null);
  const [gemaltoCACertificate, setGemaltotCACertificate] =
    useState<KeyPair | null>(null);
  const [validationErrors, setValidationErrors] = useState<any>({});
  const cleanValidation = (fieldName: string) => {
    setValidationErrors(clearValidationError(validationErrors, fieldName));
  };
  const [confirmOpen, setConfirmOpen] = useState<boolean>(false);

  // Validation
  useEffect(() => {
    let encryptionValidation: IValidation[] = [];

    if (encryptionEnabled) {
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
          value: securityContext.runAsUser,
          customValidation:
            securityContext.runAsUser === "" ||
            parseInt(securityContext.runAsUser) < 0,
          customValidationMessage: `runAsUser must be present and be 0 or more`,
        },
        {
          fieldKey: "kes_securityContext_runAsGroup",
          required: true,
          value: securityContext.runAsGroup,
          customValidation:
            securityContext.runAsGroup === "" ||
            parseInt(securityContext.runAsGroup) < 0,
          customValidationMessage: `runAsGroup must be present and be 0 or more`,
        },
        {
          fieldKey: "kes_securityContext_fsGroup",
          required: true,
          value: securityContext.fsGroup,
          customValidation:
            securityContext.fsGroup === "" ||
            parseInt(securityContext.fsGroup) < 0,
          customValidationMessage: `fsGroup must be present and be 0 or more`,
        },
      ];

      if (enabledCustomCertificates) {
        encryptionValidation = [
          ...encryptionValidation,
          {
            fieldKey: "serverKey",
            required: false,
            value: serverCertificate?.encoded_key || "",
          },
          {
            fieldKey: "serverCert",
            required: false,
            value: serverCertificate?.encoded_cert || "",
          },
          {
            fieldKey: "clientKey",
            required: false,
            value: mTLSCertificate?.encoded_key || "",
          },
          {
            fieldKey: "clientCert",
            required: false,
            value: mTLSCertificate?.encoded_cert || "",
          },
        ];
      }

      if (encryptionType === "vault") {
        encryptionValidation = [
          ...encryptionValidation,
          {
            fieldKey: "vault_endpoint",
            required: true,
            value: vaultConfiguration?.endpoint,
          },
          {
            fieldKey: "vault_id",
            required: true,
            value: vaultConfiguration?.approle?.id,
          },
          {
            fieldKey: "vault_secret",
            required: true,
            value: vaultConfiguration?.approle?.secret,
          },
          {
            fieldKey: "vault_ping",
            required: false,
            value: vaultConfiguration?.status?.ping,
            customValidation: parseInt(vaultConfiguration?.status?.ping) < 0,
            customValidationMessage: "Value needs to be 0 or greater",
          },
          {
            fieldKey: "vault_retry",
            required: false,
            value: vaultConfiguration?.approle?.retry,
            customValidation: parseInt(vaultConfiguration?.approle?.retry) < 0,
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
            value: awsConfiguration?.secretsmanager?.endpoint,
          },
          {
            fieldKey: "aws_region",
            required: true,
            value: awsConfiguration?.secretsmanager?.region,
          },
          {
            fieldKey: "aws_accessKey",
            required: true,
            value: awsConfiguration?.secretsmanager?.credentials?.accesskey,
          },
          {
            fieldKey: "aws_secretKey",
            required: true,
            value: awsConfiguration?.secretsmanager?.credentials?.secretkey,
          },
        ];
      }

      if (encryptionType === "gemalto") {
        encryptionValidation = [
          ...encryptionValidation,
          {
            fieldKey: "gemalto_endpoint",
            required: true,
            value: gemaltoConfiguration?.keysecure?.endpoint,
          },
          {
            fieldKey: "gemalto_token",
            required: true,
            value: gemaltoConfiguration?.keysecure?.credentials?.token,
          },
          {
            fieldKey: "gemalto_domain",
            required: true,
            value: gemaltoConfiguration?.keysecure?.credentials?.domain,
          },
          {
            fieldKey: "gemalto_retry",
            required: false,
            value: gemaltoConfiguration?.keysecure?.credentials?.retry,
            customValidation:
              parseInt(gemaltoConfiguration?.keysecure?.credentials?.retry) < 0,
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
            value: azureConfiguration?.keyvault?.endpoint,
          },
          {
            fieldKey: "azure_tenant_id",
            required: true,
            value: azureConfiguration?.keyvault?.credentials?.tenant_id,
          },
          {
            fieldKey: "azure_client_id",
            required: true,
            value: azureConfiguration?.keyvault?.credentials?.client_id,
          },
          {
            fieldKey: "azure_client_secret",
            required: true,
            value: azureConfiguration?.keyvault?.credentials?.client_secret,
          },
        ];
      }
    }

    const commonVal = commonFormValidation(encryptionValidation);

    setIsFormValid(Object.keys(commonVal).length === 0);

    setValidationErrors(commonVal);
  }, [
    enabledCustomCertificates,
    encryptionEnabled,
    encryptionType,
    serverCertificate?.encoded_key,
    serverCertificate?.encoded_cert,
    mTLSCertificate?.encoded_key,
    mTLSCertificate?.encoded_cert,
    vaultClientCertificate?.encoded_key,
    vaultClientCertificate?.encoded_cert,
    vaultCACertificate?.encoded_key,
    vaultCACertificate?.encoded_cert,
    securityContext,
    vaultConfiguration,
    awsConfiguration,
    gemaltoConfiguration,
    azureConfiguration,
    gcpConfiguration,
    replicas,
  ]);

  const fetchEncryptionInfo = () => {
    if (!refreshEncryptionInfo) {
      setRefreshEncryptionInfo(true);
      api
        .invoke(
          "GET",
          `/api/v1/namespaces/${tenant?.namespace}/tenants/${tenant?.name}/encryption`
        )
        .then((resp: ITenantEncryptionResponse) => {
          if (resp.vault) {
            setEncryptionType("vault");
            setVaultConfiguration(resp.vault);
            if (resp.vault.tls) {
              setVaultClientCertificateSecret(resp.vault.tls.crt);
              setVaultCACertificateSecret(resp.vault.tls.ca);
            }
          } else if (resp.aws) {
            setEncryptionType("aws");
            setAWSConfiguration(resp.aws);
          } else if (resp.gemalto) {
            setEncryptionType("gemalto");
            setGemaltoConfiguration(resp.gemalto);
            if (resp.gemalto.keysecure.tls) {
              setGemaltoCACertificateSecret(resp.gemalto.keysecure.tls.ca);
            }
          } else if (resp.gcp) {
            setEncryptionType("gcp");
            setGCPConfiguration(resp.gcp);
          } else if (resp.azure) {
            setEncryptionType("azure");
            setAzureConfiguration(resp.azure);
          }

          setEncryptionEnabled(true);
          setImage(resp.image);
          setReplicas(resp.replicas);
          if (resp.securityContext) {
            setSecurityContext(resp.securityContext);
          }
          if (resp.server || resp.mtls_client) {
            setEnabledCustomCertificates(true);
          }
          if (resp.server) {
            setServerTLSCertificateSecret(resp.server);
          }
          if (resp.mtls_client) {
            setMTLSCertificateSecret(resp.mtls_client);
          }
          setRefreshEncryptionInfo(false);
        })
        .catch((err: ErrorResponseHandler) => {
          console.log(err);
          setRefreshEncryptionInfo(false);
        });
    }
  };

  useEffect(() => {
    fetchEncryptionInfo();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const removeCertificate = (certificateInfo: ICertificateInfo) => {
    setCertificatesToBeRemoved([
      ...certificatesToBeRemoved,
      certificateInfo.name,
    ]);
    if (certificateInfo.name === serverTLSCertificateSecret?.name) {
      setServerTLSCertificateSecret(null);
    }
    if (certificateInfo.name === mTLSCertificateSecret?.name) {
      setMTLSCertificateSecret(null);
    }
    if (certificateInfo.name === vaultClientCertificateSecret?.name) {
      setVaultClientCertificateSecret(null);
    }
    if (certificateInfo.name === vaultCACertificateSecret?.name) {
      setVaultCACertificateSecret(null);
    }
    if (certificateInfo.name === gemaltoCACertificateSecret?.name) {
      setGemaltoCACertificateSecret(null);
    }
  };

  const updateEncryptionConfiguration = () => {
    if (encryptionEnabled) {
      let insertEncrypt = {};
      switch (encryptionType) {
        case "gemalto":
          let gemaltoCAIntroduce = {};

          if (gemaltoCACertificate?.encoded_cert) {
            gemaltoCAIntroduce = {
              tls: {
                ca: gemaltoCACertificate?.encoded_cert,
              },
            };
          }
          insertEncrypt = {
            gemalto: {
              keysecure: {
                endpoint: gemaltoConfiguration?.keysecure?.endpoint || "",
                credentials: {
                  token:
                    gemaltoConfiguration?.keysecure?.credentials?.token || "",
                  domain:
                    gemaltoConfiguration?.keysecure?.credentials?.domain || "",
                  retry: parseInt(
                    gemaltoConfiguration?.keysecure?.credentials?.retry
                  ),
                },
                ...gemaltoCAIntroduce,
              },
            },
          };
          break;
        case "aws":
          insertEncrypt = {
            aws: {
              secretsmanager: {
                endpoint: awsConfiguration?.secretsmanager?.endpoint || "",
                region: awsConfiguration?.secretsmanager?.region || "",
                kmskey: awsConfiguration?.secretsmanager?.kmskey || "",
                credentials: {
                  accesskey:
                    awsConfiguration?.secretsmanager?.credentials?.accesskey ||
                    "",
                  secretkey:
                    awsConfiguration?.secretsmanager?.credentials?.secretkey ||
                    "",
                  token:
                    awsConfiguration?.secretsmanager?.credentials?.token || "",
                },
              },
            },
          };
          break;
        case "azure":
          insertEncrypt = {
            azure: {
              keyvault: {
                endpoint: azureConfiguration?.keyvault?.endpoint || "",
                credentials: {
                  tenant_id:
                    azureConfiguration?.keyvault?.credentials?.tenant_id || "",
                  client_id:
                    azureConfiguration?.keyvault?.credentials?.client_id || "",
                  client_secret:
                    azureConfiguration?.keyvault?.credentials?.client_secret ||
                    "",
                },
              },
            },
          };
          break;
        case "gcp":
          insertEncrypt = {
            gcp: {
              secretmanager: {
                project_id: gcpConfiguration?.secretmanager?.project_id || "",
                endpoint: gcpConfiguration?.secretmanager?.endpoint || "",
                credentials: {
                  client_email:
                    gcpConfiguration?.secretmanager?.credentials
                      ?.client_email || "",
                  client_id:
                    gcpConfiguration?.secretmanager?.credentials?.client_id ||
                    "",
                  private_key_id:
                    gcpConfiguration?.secretmanager?.credentials
                      ?.private_key_id || "",
                  private_key:
                    gcpConfiguration?.secretmanager?.credentials?.private_key ||
                    "",
                },
              },
            },
          };
          break;
        case "vault":
          let vaultKeyPair = null;
          let vaultCAInsert = null;
          if (
            vaultClientCertificate?.encoded_key &&
            vaultClientCertificate?.encoded_cert
          ) {
            vaultKeyPair = {
              key: vaultClientCertificate?.encoded_key,
              crt: vaultClientCertificate?.encoded_cert,
            };
          }
          if (vaultCACertificate?.encoded_cert) {
            vaultCAInsert = {
              ca: vaultCACertificate?.encoded_cert,
            };
          }
          let vaultTLS = null;
          if (vaultKeyPair || vaultCAInsert) {
            vaultTLS = {
              tls: {
                ...vaultKeyPair,
                ...vaultCAInsert,
              },
            };
          }
          insertEncrypt = {
            vault: {
              endpoint: vaultConfiguration?.endpoint || "",
              engine: vaultConfiguration?.engine || "",
              namespace: vaultConfiguration?.namespace || "",
              prefix: vaultConfiguration?.prefix || "",
              approle: {
                engine: vaultConfiguration?.approle?.engine || "",
                id: vaultConfiguration?.approle?.id || "",
                secret: vaultConfiguration?.approle?.secret || "",
                retry: parseInt(vaultConfiguration?.approle?.retry),
              },
              ...vaultTLS,
              status: {
                ping: parseInt(vaultConfiguration?.status?.ping),
              },
            },
          };
          break;
      }

      let encryptionServerKeyPair: any = {};
      let encryptionClientKeyPair: any = {};

      if (mTLSCertificate?.encoded_key && mTLSCertificate?.encoded_cert) {
        encryptionClientKeyPair = {
          client: {
            key: mTLSCertificate?.encoded_key,
            crt: mTLSCertificate?.encoded_cert,
          },
        };
      }

      if (serverCertificate?.encoded_key && serverCertificate?.encoded_cert) {
        encryptionServerKeyPair = {
          server: {
            key: serverCertificate?.encoded_key,
            crt: serverCertificate?.encoded_cert,
          },
        };
      }
      const dataSend = {
        secretsToBeDeleted: certificatesToBeRemoved || [],
        replicas: replicas,
        securityContext: securityContext,
        image: image,
        ...encryptionClientKeyPair,
        ...encryptionServerKeyPair,
        ...insertEncrypt,
      };
      if (!updatingEncryption) {
        setUpdatingEncryption(true);
        api
          .invoke(
            "PUT",
            `/api/v1/namespaces/${tenant?.namespace}/tenants/${tenant?.name}/encryption`,
            dataSend
          )
          .then(() => {
            setConfirmOpen(false);
            setUpdatingEncryption(false);
            fetchEncryptionInfo();
          })
          .catch((err: ErrorResponseHandler) => {
            setUpdatingEncryption(false);
            setConfirmOpen(false);
            setErrorSnackMessage(err);
          });
      }
    } else {
      if (!updatingEncryption) {
        setUpdatingEncryption(true);
        api
          .invoke(
            "DELETE",
            `/api/v1/namespaces/${tenant?.namespace}/tenants/${tenant?.name}/encryption`,
            {}
          )
          .then(() => {
            fetchEncryptionInfo();
            setUpdatingEncryption(false);
          })
          .catch((err: ErrorResponseHandler) => {
            setUpdatingEncryption(false);
            setErrorSnackMessage(err);
          });
      }
    }
  };

  return (
    <React.Fragment>
      <Fragment>
        {confirmOpen && (
          <ConfirmDialog
            isOpen={confirmOpen}
            title={
              encryptionEnabled
                ? "Enable encryption at rest for tenant?"
                : "Disable encryption at rest for tenant?"
            }
            confirmText={encryptionEnabled ? "Enable" : "Disable"}
            cancelText="Cancel"
            onClose={() => setConfirmOpen(false)}
            onConfirm={updateEncryptionConfiguration}
            confirmationContent={
              <DialogContentText>
                {encryptionEnabled
                  ? "Data will be encrypted using and external KMS"
                  : "Current encrypted information will not be accessible"}
              </DialogContentText>
            }
          />
        )}
        <Grid container alignItems={"center"}>
          <Grid item xs>
            <h1 className={classes.sectionTitle}>Encryption</h1>
          </Grid>
          <Grid
            item
            xs={4}
            justifyContent={"end"}
            textAlign={"right"}
            className={classes.formFieldRow}
          >
            <FormSwitchWrapper
              label={""}
              indicatorLabels={["Enabled", "Disabled"]}
              checked={encryptionEnabled}
              value={"tenant_encryption"}
              id="tenant-encryption"
              name="tenant-encryption"
              onChange={() => {
                setEncryptionEnabled(!encryptionEnabled);
              }}
              description=""
            />
          </Grid>
        </Grid>
        {encryptionEnabled && (
          <Grid container spacing={1}>
            <Grid item xs={12} className={classes.encryptionTypeOptions}>
              <RadioGroupSelector
                currentSelection={encryptionType}
                id="encryptionType"
                name="encryptionType"
                label="Encryption Options"
                onChange={(e) => {
                  setEncryptionType(e.target.value);
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
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setVaultConfiguration({
                        ...vaultConfiguration,
                        endpoint: e.target.value,
                      })
                    }
                    label="Endpoint"
                    value={vaultConfiguration?.endpoint || ""}
                    error={validationErrors["vault_ping"] || ""}
                    required
                  />
                </Grid>
                <Grid item xs={12} className={classes.formFieldRow}>
                  <InputBoxWrapper
                    id="vault_engine"
                    name="vault_engine"
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setVaultConfiguration({
                        ...vaultConfiguration,
                        engine: e.target.value,
                      })
                    }
                    label="Engine"
                    value={vaultConfiguration?.engine || ""}
                  />
                </Grid>
                <Grid item xs={12} className={classes.formFieldRow}>
                  <InputBoxWrapper
                    id="vault_namespace"
                    name="vault_namespace"
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setVaultConfiguration({
                        ...vaultConfiguration,
                        namespace: e.target.value,
                      })
                    }
                    label="Namespace"
                    value={vaultConfiguration?.namespace || ""}
                  />
                </Grid>
                <Grid item xs={12} className={classes.formFieldRow}>
                  <InputBoxWrapper
                    id="vault_prefix"
                    name="vault_prefix"
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setVaultConfiguration({
                        ...vaultConfiguration,
                        prefix: e.target.value,
                      })
                    }
                    label="Prefix"
                    value={vaultConfiguration?.prefix || ""}
                  />
                </Grid>
                <Grid item xs={12} className={classes.formFieldRow}>
                  <Stack>
                    <StackRow
                      sx={{
                        borderBottom: "1px solid #eaeaea",
                        margin: 0,
                        marginBottom: 1,
                      }}
                    >
                      <h3
                        style={{
                          marginBottom: 8,
                        }}
                      >
                        App Role
                      </h3>
                    </StackRow>
                    <Grid container spacing={1}>
                      <Grid item xs={12}>
                        <InputBoxWrapper
                          id="vault_approle_engine"
                          name="vault_approle_engine"
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            setVaultConfiguration({
                              ...vaultConfiguration,
                              approle: {
                                ...vaultConfiguration?.approle,
                                engine: e.target.value,
                              },
                            })
                          }
                          label="Engine"
                          value={vaultConfiguration?.approle?.engine || ""}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <InputBoxWrapper
                          type={showVaultAppRoleID ? "text" : "password"}
                          id="vault_id"
                          name="vault_id"
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            setVaultConfiguration({
                              ...vaultConfiguration,
                              approle: {
                                ...vaultConfiguration?.approle,
                                id: e.target.value,
                              },
                            })
                          }
                          label="AppRole ID"
                          value={vaultConfiguration?.approle?.id || ""}
                          required
                          error={validationErrors["vault_id"] || ""}
                          overlayIcon={
                            showVaultAppRoleID ? (
                              <VisibilityOffIcon />
                            ) : (
                              <RemoveRedEyeIcon />
                            )
                          }
                          overlayAction={() =>
                            setShowVaultAppRoleID(!showVaultAppRoleID)
                          }
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <InputBoxWrapper
                          type={showVaultAppRoleSecret ? "text" : "password"}
                          id="vault_secret"
                          name="vault_secret"
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            setVaultConfiguration({
                              ...vaultConfiguration,
                              approle: {
                                ...vaultConfiguration?.approle,
                                secret: e.target.value,
                              },
                            })
                          }
                          label="AppRole Secret"
                          value={vaultConfiguration?.approle?.secret || ""}
                          required
                          error={validationErrors["vault_secret"] || ""}
                          overlayIcon={
                            showVaultAppRoleSecret ? (
                              <VisibilityOffIcon />
                            ) : (
                              <RemoveRedEyeIcon />
                            )
                          }
                          overlayAction={() =>
                            setShowVaultAppRoleSecret(!showVaultAppRoleSecret)
                          }
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <InputBoxWrapper
                          type="number"
                          min="0"
                          id="vault_retry"
                          name="vault_retry"
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            setVaultConfiguration({
                              ...vaultConfiguration,
                              approle: {
                                ...vaultConfiguration?.approle,
                                retry: e.target.value,
                              },
                            })
                          }
                          label="Retry (Seconds)"
                          error={validationErrors["vault_retry"] || ""}
                          value={vaultConfiguration?.approle?.retry || ""}
                        />
                      </Grid>
                    </Grid>
                  </Stack>
                </Grid>
                <Grid item xs={12} className={classes.formFieldRow}>
                  <Stack>
                    <StackRow
                      sx={{
                        borderBottom: "1px solid #eaeaea",
                        margin: 0,
                        marginBottom: 1,
                      }}
                    >
                      <h3
                        style={{
                          marginBottom: 8,
                        }}
                      >
                        Vault Certificates (optional)
                      </h3>
                    </StackRow>
                  </Stack>
                  <fieldset className={classes.fieldGroup}>
                    <legend className={classes.descriptionText}>
                      Mutual TLS authentication with Vault (optional)
                    </legend>
                    {vaultClientCertificateSecret ? (
                      <TLSCertificate
                        certificateInfo={vaultClientCertificateSecret}
                        onDelete={() =>
                          removeCertificate(vaultClientCertificateSecret)
                        }
                      />
                    ) : (
                      <Fragment>
                        <FileSelector
                          onChange={(encodedValue, fileName) =>
                            setVaultClientCertificate({
                              encoded_key: encodedValue || "",
                              id: vaultClientCertificate?.id || "",
                              key: fileName || "",
                              cert: vaultClientCertificate?.cert || "",
                              encoded_cert:
                                vaultClientCertificate?.encoded_cert || "",
                            })
                          }
                          accept=".key,.pem"
                          id="vault_key"
                          name="vault_key"
                          label="Key"
                          value={vaultClientCertificate?.key || ""}
                        />
                        <FileSelector
                          onChange={(encodedValue, fileName) =>
                            setVaultClientCertificate({
                              encoded_key:
                                vaultClientCertificate?.encoded_key || "",
                              id: vaultClientCertificate?.id || "",
                              key: vaultClientCertificate?.key || "",
                              cert: fileName || "",
                              encoded_cert: encodedValue || "",
                            })
                          }
                          accept=".cer,.crt,.cert,.pem"
                          id="vault_cert"
                          name="vault_cert"
                          label="Cert"
                          value={vaultClientCertificate?.cert || ""}
                        />
                      </Fragment>
                    )}
                  </fieldset>
                  <fieldset className={classes.fieldGroup}>
                    <legend className={classes.descriptionText}>
                      Vault CA certificate (optional)
                    </legend>
                    {vaultCACertificateSecret ? (
                      <TLSCertificate
                        certificateInfo={vaultCACertificateSecret}
                        onDelete={() =>
                          removeCertificate(vaultCACertificateSecret)
                        }
                      />
                    ) : (
                      <FileSelector
                        onChange={(encodedValue, fileName) =>
                          setVaultCACertificate({
                            encoded_key: vaultCACertificate?.encoded_key || "",
                            id: vaultCACertificate?.id || "",
                            key: vaultCACertificate?.key || "",
                            cert: fileName || "",
                            encoded_cert: encodedValue || "",
                          })
                        }
                        accept=".cer,.crt,.cert,.pem"
                        id="vault_ca"
                        name="vault_ca"
                        label="CA"
                        value={vaultCACertificate?.cert || ""}
                      />
                    )}
                  </fieldset>
                </Grid>
                <Grid item xs={12} className={classes.formFieldRow}>
                  <Stack>
                    <StackRow
                      sx={{
                        borderBottom: "1px solid #eaeaea",
                        margin: 0,
                        marginBottom: 1,
                      }}
                    >
                      <h3
                        style={{
                          marginBottom: 8,
                        }}
                      >
                        Status
                      </h3>
                    </StackRow>
                    <InputBoxWrapper
                      type="number"
                      min="0"
                      id="vault_ping"
                      name="vault_ping"
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setVaultConfiguration({
                          ...vaultConfiguration,
                          status: {
                            ...vaultConfiguration?.status,
                            ping: e.target.value,
                          },
                        })
                      }
                      label="Ping (Seconds)"
                      error={validationErrors["vault_ping"] || ""}
                      value={vaultConfiguration?.status?.ping || ""}
                    />
                  </Stack>
                </Grid>
              </Fragment>
            )}
            {encryptionType === "azure" && (
              <Fragment>
                <Grid item xs={12} className={classes.formFieldRow}>
                  <InputBoxWrapper
                    id="azure_endpoint"
                    name="azure_endpoint"
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setAzureConfiguration({
                        ...azureConfiguration,
                        keyvault: {
                          ...azureConfiguration?.keyvault,
                          endpoint: e.target.value,
                        },
                      })
                    }
                    label="Endpoint"
                    error={validationErrors["azure_endpoint"] || ""}
                    value={azureConfiguration?.keyvault?.endpoint || ""}
                  />
                </Grid>
                <Grid item xs={12} className={classes.formFieldRow}>
                  <fieldset className={classes.fieldGroup}>
                    <legend className={classes.descriptionText}>
                      Credentials
                    </legend>
                    <Grid item xs={12} className={classes.formFieldRow}>
                      <InputBoxWrapper
                        id="azure_tenant_id"
                        name="azure_tenant_id"
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          setAzureConfiguration({
                            ...azureConfiguration,
                            keyvault: {
                              ...azureConfiguration?.keyvault,
                              credentials: {
                                ...azureConfiguration?.keyvault?.credentials,
                                tenant_id: e.target.value,
                              },
                            },
                          })
                        }
                        label="Tenant ID"
                        value={
                          azureConfiguration?.keyvault?.credentials
                            ?.tenant_id || ""
                        }
                        error={validationErrors["azure_tenant_id"] || ""}
                      />
                    </Grid>
                    <Grid item xs={12} className={classes.formFieldRow}>
                      <InputBoxWrapper
                        id="azure_client_id"
                        name="azure_client_id"
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          setAzureConfiguration({
                            ...azureConfiguration,
                            keyvault: {
                              ...azureConfiguration?.keyvault,
                              credentials: {
                                ...azureConfiguration?.keyvault?.credentials,
                                client_id: e.target.value,
                              },
                            },
                          })
                        }
                        label="Client ID"
                        value={
                          azureConfiguration?.keyvault?.credentials
                            ?.client_id || ""
                        }
                        error={validationErrors["azure_client_id"] || ""}
                      />
                    </Grid>
                    <Grid item xs={12} className={classes.formFieldRow}>
                      <InputBoxWrapper
                        id="azure_client_secret"
                        name="azure_client_secret"
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          setAzureConfiguration({
                            ...azureConfiguration,
                            keyvault: {
                              ...azureConfiguration?.keyvault,
                              credentials: {
                                ...azureConfiguration?.keyvault?.credentials,
                                client_secret: e.target.value,
                              },
                            },
                          })
                        }
                        label="Client Secret"
                        value={
                          azureConfiguration?.keyvault?.credentials
                            ?.client_secret || ""
                        }
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
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setGCPConfiguration({
                        ...gcpConfiguration,
                        secretmanager: {
                          ...gcpConfiguration?.secretmanager,
                          project_id: e.target.value,
                        },
                      })
                    }
                    label="Project ID"
                    value={gcpConfiguration?.secretmanager.project_id || ""}
                  />
                </Grid>
                <Grid item xs={12} className={classes.formFieldRow}>
                  <InputBoxWrapper
                    id="gcp_endpoint"
                    name="gcp_endpoint"
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setGCPConfiguration({
                        ...gcpConfiguration,
                        secretmanager: {
                          ...gcpConfiguration?.secretmanager,
                          endpoint: e.target.value,
                        },
                      })
                    }
                    label="Endpoint"
                    value={gcpConfiguration?.secretmanager.endpoint || ""}
                  />
                </Grid>
                <Grid item xs={12} className={classes.formFieldRow}>
                  <fieldset className={classes.fieldGroup}>
                    <legend className={classes.descriptionText}>
                      Credentials
                    </legend>
                    <Grid item xs={12} className={classes.formFieldRow}>
                      <InputBoxWrapper
                        id="gcp_client_email"
                        name="gcp_client_email"
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          setGCPConfiguration({
                            ...gcpConfiguration,
                            secretmanager: {
                              ...gcpConfiguration?.secretmanager,
                              credentials: {
                                ...gcpConfiguration?.secretmanager.credentials,
                                client_email: e.target.value,
                              },
                            },
                          })
                        }
                        label="Client Email"
                        value={
                          gcpConfiguration?.secretmanager.credentials
                            ?.client_email || ""
                        }
                      />
                    </Grid>
                    <Grid item xs={12} className={classes.formFieldRow}>
                      <InputBoxWrapper
                        id="gcp_client_id"
                        name="gcp_client_id"
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          setGCPConfiguration({
                            ...gcpConfiguration,
                            secretmanager: {
                              ...gcpConfiguration?.secretmanager,
                              credentials: {
                                ...gcpConfiguration?.secretmanager.credentials,
                                client_id: e.target.value,
                              },
                            },
                          })
                        }
                        label="Client ID"
                        value={
                          gcpConfiguration?.secretmanager.credentials
                            ?.client_id || ""
                        }
                      />
                    </Grid>
                    <Grid item xs={12} className={classes.formFieldRow}>
                      <InputBoxWrapper
                        id="gcp_private_key_id"
                        name="gcp_private_key_id"
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          setGCPConfiguration({
                            ...gcpConfiguration,
                            secretmanager: {
                              ...gcpConfiguration?.secretmanager,
                              credentials: {
                                ...gcpConfiguration?.secretmanager.credentials,
                                private_key_id: e.target.value,
                              },
                            },
                          })
                        }
                        label="Private Key ID"
                        value={
                          gcpConfiguration?.secretmanager.credentials
                            ?.private_key_id || ""
                        }
                      />
                    </Grid>
                    <Grid item xs={12} className={classes.formFieldRow}>
                      <InputBoxWrapper
                        id="gcp_private_key"
                        name="gcp_private_key"
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          setGCPConfiguration({
                            ...gcpConfiguration,
                            secretmanager: {
                              ...gcpConfiguration?.secretmanager,
                              credentials: {
                                ...gcpConfiguration?.secretmanager.credentials,
                                private_key: e.target.value,
                              },
                            },
                          })
                        }
                        label="Private Key"
                        value={
                          gcpConfiguration?.secretmanager.credentials
                            ?.private_key || ""
                        }
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
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setAWSConfiguration({
                        ...awsConfiguration,
                        secretsmanager: {
                          ...awsConfiguration?.secretsmanager,
                          endpoint: e.target.value,
                        },
                      })
                    }
                    label="Endpoint"
                    value={awsConfiguration?.secretsmanager?.endpoint || ""}
                    required
                    error={validationErrors["aws_endpoint"] || ""}
                  />
                </Grid>
                <Grid item xs={12} className={classes.formFieldRow}>
                  <InputBoxWrapper
                    id="aws_region"
                    name="aws_region"
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setAWSConfiguration({
                        ...awsConfiguration,
                        secretsmanager: {
                          ...awsConfiguration?.secretsmanager,
                          region: e.target.value,
                        },
                      })
                    }
                    label="Region"
                    value={awsConfiguration?.secretsmanager?.region || ""}
                    error={validationErrors["aws_region"] || ""}
                    required
                  />
                </Grid>
                <Grid item xs={12} className={classes.formFieldRow}>
                  <InputBoxWrapper
                    id="aws_kmsKey"
                    name="aws_kmsKey"
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setAWSConfiguration({
                        ...awsConfiguration,
                        secretsmanager: {
                          ...awsConfiguration?.secretsmanager,
                          kmskey: e.target.value,
                        },
                      })
                    }
                    label="KMS Key"
                    value={awsConfiguration?.secretsmanager?.kmskey || ""}
                  />
                </Grid>
                <Grid item xs={12} className={classes.formFieldRow}>
                  <fieldset className={classes.fieldGroup}>
                    <legend className={classes.descriptionText}>
                      Credentials
                    </legend>
                    <Grid item xs={12} className={classes.formFieldRow}>
                      <InputBoxWrapper
                        id="aws_accessKey"
                        name="aws_accessKey"
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          setAWSConfiguration({
                            ...awsConfiguration,
                            secretsmanager: {
                              ...awsConfiguration?.secretsmanager,
                              credentials: {
                                ...awsConfiguration?.secretsmanager
                                  ?.credentials,
                                accesskey: e.target.value,
                              },
                            },
                          })
                        }
                        label="Access Key"
                        value={
                          awsConfiguration?.secretsmanager?.credentials
                            ?.accesskey || ""
                        }
                        error={validationErrors["aws_accessKey"] || ""}
                        required
                      />
                    </Grid>
                    <Grid item xs={12} className={classes.formFieldRow}>
                      <InputBoxWrapper
                        id="aws_secretKey"
                        name="aws_secretKey"
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          setAWSConfiguration({
                            ...awsConfiguration,
                            secretsmanager: {
                              ...awsConfiguration?.secretsmanager,
                              credentials: {
                                ...awsConfiguration?.secretsmanager
                                  ?.credentials,
                                secretkey: e.target.value,
                              },
                            },
                          })
                        }
                        label="Secret Key"
                        value={
                          awsConfiguration?.secretsmanager?.credentials
                            ?.secretkey || ""
                        }
                        error={validationErrors["aws_secretKey"] || ""}
                        required
                      />
                    </Grid>
                    <Grid item xs={12} className={classes.formFieldRow}>
                      <InputBoxWrapper
                        id="aws_token"
                        name="aws_token"
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          setAWSConfiguration({
                            ...awsConfiguration,
                            secretsmanager: {
                              ...awsConfiguration?.secretsmanager,
                              credentials: {
                                ...awsConfiguration?.secretsmanager
                                  ?.credentials,
                                token: e.target.value,
                              },
                            },
                          })
                        }
                        label="Token"
                        value={
                          awsConfiguration?.secretsmanager?.credentials
                            ?.token || ""
                        }
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
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setGemaltoConfiguration({
                        ...gemaltoConfiguration,
                        keysecure: {
                          ...gemaltoConfiguration?.keysecure,
                          endpoint: e.target.value,
                        },
                      })
                    }
                    label="Endpoint"
                    value={gemaltoConfiguration?.keysecure?.endpoint || ""}
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
                  className={classes.formFieldRow}
                >
                  <fieldset className={classes.fieldGroup}>
                    <legend className={classes.descriptionText}>
                      Credentials
                    </legend>
                    <Grid item xs={12} className={classes.formFieldRow}>
                      <InputBoxWrapper
                        id="gemalto_token"
                        name="gemalto_token"
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          setGemaltoConfiguration({
                            ...gemaltoConfiguration,
                            keysecure: {
                              ...gemaltoConfiguration?.keysecure,
                              credentials: {
                                ...gemaltoConfiguration?.keysecure?.credentials,
                                token: e.target.value,
                              },
                            },
                          })
                        }
                        label="Token"
                        value={
                          gemaltoConfiguration?.keysecure?.credentials?.token ||
                          ""
                        }
                        error={validationErrors["gemalto_token"] || ""}
                        required
                      />
                    </Grid>
                    <Grid item xs={12} className={classes.formFieldRow}>
                      <InputBoxWrapper
                        id="gemalto_domain"
                        name="gemalto_domain"
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          setGemaltoConfiguration({
                            ...gemaltoConfiguration,
                            keysecure: {
                              ...gemaltoConfiguration?.keysecure,
                              credentials: {
                                ...gemaltoConfiguration?.keysecure?.credentials,
                                domain: e.target.value,
                              },
                            },
                          })
                        }
                        label="Domain"
                        value={
                          gemaltoConfiguration?.keysecure?.credentials
                            ?.domain || ""
                        }
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
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          setGemaltoConfiguration({
                            ...gemaltoConfiguration,
                            keysecure: {
                              ...gemaltoConfiguration?.keysecure,
                              credentials: {
                                ...gemaltoConfiguration?.keysecure?.credentials,
                                retry: e.target.value,
                              },
                            },
                          })
                        }
                        label="Retry (seconds)"
                        value={
                          gemaltoConfiguration?.keysecure?.credentials?.retry ||
                          ""
                        }
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
                  className={classes.formFieldRow}
                >
                  <fieldset className={classes.fieldGroup}>
                    <legend className={classes.descriptionText}>
                      Custom CA Root certificate verification
                    </legend>
                    {gemaltoCACertificateSecret ? (
                      <TLSCertificate
                        certificateInfo={gemaltoCACertificateSecret}
                        onDelete={() =>
                          removeCertificate(gemaltoCACertificateSecret)
                        }
                      />
                    ) : (
                      <FileSelector
                        onChange={(encodedValue, fileName) =>
                          setGemaltotCACertificate({
                            encoded_key:
                              gemaltoCACertificate?.encoded_key || "",
                            id: gemaltoCACertificate?.id || "",
                            key: gemaltoCACertificate?.key || "",
                            cert: fileName || "",
                            encoded_cert: encodedValue || "",
                          })
                        }
                        accept=".cer,.crt,.cert,.pem"
                        id="gemalto_ca"
                        name="gemalto_ca"
                        label="CA"
                        value={gemaltoCACertificate?.cert || ""}
                      />
                    )}
                  </fieldset>
                </Grid>
              </Fragment>
            )}
            <Grid item xs={12} className={classes.formFieldRow}>
              <Stack>
                <StackRow
                  sx={{
                    borderBottom: "1px solid #eaeaea",
                    margin: 0,
                    marginBottom: 1,
                  }}
                >
                  <h3
                    style={{
                      marginBottom: 8,
                    }}
                  >
                    Additional Configuration for KES
                  </h3>
                </StackRow>

                <FormSwitchWrapper
                  value="enableCustomCertsForKES"
                  id="enableCustomCertsForKES"
                  name="enableCustomCertsForKES"
                  checked={enabledCustomCertificates}
                  onChange={() =>
                    setEnabledCustomCertificates(!enabledCustomCertificates)
                  }
                  label={"Custom Certificates"}
                />
              </Stack>
            </Grid>
            {enabledCustomCertificates && (
              <Fragment>
                <Grid item xs={12} className={classes.formFieldRow}>
                  <fieldset className={classes.fieldGroup}>
                    <legend className={classes.descriptionText}>
                      KES server TLS Certificates (optional)
                    </legend>
                    {serverTLSCertificateSecret ? (
                      <TLSCertificate
                        certificateInfo={serverTLSCertificateSecret}
                        onDelete={() =>
                          removeCertificate(serverTLSCertificateSecret)
                        }
                      />
                    ) : (
                      <Fragment>
                        <FileSelector
                          onChange={(encodedValue, fileName) => {
                            setServerCertificate({
                              encoded_key: encodedValue || "",
                              id: serverCertificate?.id || "",
                              key: fileName || "",
                              cert: serverCertificate?.cert || "",
                              encoded_cert:
                                serverCertificate?.encoded_cert || "",
                            });
                            cleanValidation("serverKey");
                          }}
                          accept=".key,.pem"
                          id="serverKey"
                          name="serverKey"
                          label="Key"
                          value={serverCertificate?.key}
                        />
                        <FileSelector
                          onChange={(encodedValue, fileName) => {
                            setServerCertificate({
                              encoded_key: serverCertificate?.encoded_key || "",
                              id: serverCertificate?.id || "",
                              key: serverCertificate?.key || "",
                              cert: fileName || "",
                              encoded_cert: encodedValue || "",
                            });
                            cleanValidation("serverCert");
                          }}
                          accept=".cer,.crt,.cert,.pem"
                          id="serverCert"
                          name="serverCert"
                          label="Cert"
                          value={serverCertificate?.cert}
                        />
                      </Fragment>
                    )}
                  </fieldset>
                </Grid>
                <Grid item xs={12} className={classes.formFieldRow}>
                  <fieldset className={classes.fieldGroup}>
                    <legend className={classes.descriptionText}>
                      Mutual TLS authentication with MinIO (optional)
                    </legend>
                    {mTLSCertificateSecret ? (
                      <TLSCertificate
                        certificateInfo={mTLSCertificateSecret}
                        onDelete={() =>
                          removeCertificate(mTLSCertificateSecret)
                        }
                      />
                    ) : (
                      <Fragment>
                        <FileSelector
                          onChange={(encodedValue, fileName) => {
                            setMTLSCertificate({
                              encoded_key: encodedValue || "",
                              id: mTLSCertificate?.id || "",
                              key: fileName || "",
                              cert: mTLSCertificate?.cert || "",
                              encoded_cert: mTLSCertificate?.encoded_cert || "",
                            });
                            cleanValidation("clientKey");
                          }}
                          accept=".key,.pem"
                          id="clientKey"
                          name="clientKey"
                          label="Key"
                          value={mTLSCertificate?.key}
                        />
                        <FileSelector
                          onChange={(encodedValue, fileName) => {
                            setMTLSCertificate({
                              encoded_key: mTLSCertificate?.encoded_key || "",
                              id: mTLSCertificate?.id || "",
                              key: mTLSCertificate?.key || "",
                              cert: fileName || "",
                              encoded_cert: encodedValue || "",
                            });
                            cleanValidation("clientCert");
                          }}
                          accept=".cer,.crt,.cert,.pem"
                          id="clientCert"
                          name="clientCert"
                          label="Cert"
                          value={mTLSCertificate?.cert}
                        />
                      </Fragment>
                    )}
                  </fieldset>
                </Grid>
              </Fragment>
            )}
            <Grid item xs={12} className={classes.formFieldRow}>
              <InputBoxWrapper
                type="text"
                id="image"
                name="image"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setImage(e.target.value)
                }
                label="Image"
                placeholder="minio/kes:v0.17.6"
                value={image}
              />
            </Grid>
            <Grid item xs={12} className={classes.formFieldRow}>
              <InputBoxWrapper
                type="number"
                min="1"
                id="replicas"
                name="replicas"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setReplicas(e.target.value)
                }
                label="Replicas"
                value={replicas}
                required
                error={validationErrors["replicas"] || ""}
              />
            </Grid>
            <Grid item xs={12} className={classes.formFieldRow}>
              <Stack>
                <StackRow
                  sx={{
                    borderBottom: "1px solid #eaeaea",
                    margin: 0,
                    marginBottom: 1,
                  }}
                >
                  <h3
                    style={{
                      marginBottom: 10,
                    }}
                  >
                    SecurityContext for KES
                  </h3>
                </StackRow>
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
                          setSecurityContext({
                            ...securityContext,
                            runAsUser: e.target.value,
                          });
                        }}
                        label="Run As User"
                        value={securityContext.runAsUser}
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
                          setSecurityContext({
                            ...securityContext,
                            runAsGroup: e.target.value,
                          });
                        }}
                        label="Run As Group"
                        value={securityContext.runAsGroup}
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
                          setSecurityContext({
                            ...securityContext,
                            fsGroup: e.target.value,
                          });
                        }}
                        label="FsGroup"
                        value={securityContext.fsGroup}
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
                  <FormSwitchWrapper
                    value="kesSecurityContextRunAsNonRoot"
                    id="kes_securityContext_runAsNonRoot"
                    name="kes_securityContext_runAsNonRoot"
                    checked={securityContext.runAsNonRoot}
                    onChange={(e) => {
                      const targetD = e.target;
                      const checked = targetD.checked;
                      setSecurityContext({
                        ...securityContext,
                        runAsNonRoot: checked,
                      });
                    }}
                    label={"Do not run as Root"}
                  />
                </Grid>
              </Stack>
            </Grid>
          </Grid>
        )}
        <Grid item xs={12} className={classes.buttonContainer}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={!isFormValid}
            onClick={() => setConfirmOpen(true)}
          >
            Save
          </Button>
        </Grid>
      </Fragment>
    </React.Fragment>
  );
};

const mapState = (state: AppState) => ({
  loadingTenant: state.tenants.tenantDetails.loadingTenant,
  selectedTenant: state.tenants.tenantDetails.currentTenant,
  tenant: state.tenants.tenantDetails.tenantInfo,
});

const mapDispatchToProps = {
  setErrorSnackMessage,
  setTenantDetailsLoad,
};

const connector = connect(mapState, mapDispatchToProps);

export default withStyles(styles)(connector(TenantEncryption));
