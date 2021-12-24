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
import { connect } from "react-redux";
import Grid from "@mui/material/Grid";
import { LinearProgress } from "@mui/material";

import { Theme } from "@mui/material/styles";
import createStyles from "@mui/styles/createStyles";
import withStyles from "@mui/styles/withStyles";
import {
  modalBasic,
  settingsCommon,
  wizardCommon,
} from "../../Common/FormComponents/common/styleLibrary";
import api from "../../../../common/api";
import { generatePoolName } from "../../../../common/utils";
import GenericWizard from "../../Common/GenericWizard/GenericWizard";
import { IWizardElement } from "../../Common/GenericWizard/types";
import { NewServiceAccount } from "../../Common/CredentialsPrompt/types";
import { ErrorResponseHandler, ITenantCreator } from "../../../../common/types";
import { KeyPair } from "../ListTenants/utils";

import { setErrorSnackMessage } from "../../../../actions";
import { getDefaultAffinity, getNodeSelector } from "../TenantDetails/utils";
import CredentialsPrompt from "../../Common/CredentialsPrompt/CredentialsPrompt";
import { AppState } from "../../../../store";
import { ICertificatesItems, IFieldStore } from "../types";
import { resetAddTenantForm, updateAddField } from "../actions";
import Configure from "./Steps/Configure";
import IdentityProvider from "./Steps/IdentityProvider";
import Security from "./Steps/Security";
import Encryption from "./Steps/Encryption";
import Affinity from "./Steps/Affinity";
import PageHeader from "../../Common/PageHeader/PageHeader";
import history from "../../../../history";
import Images from "./Steps/Images";
import PageLayout from "../../Common/Layout/PageLayout";
import BackLink from "../../../../common/BackLink";
import TenantResources from "./Steps/TenantResources/TenantResources";

interface IAddTenantProps {
  setErrorSnackMessage: typeof setErrorSnackMessage;
  resetAddTenantForm: typeof resetAddTenantForm;
  updateAddField: typeof updateAddField;
  fields: IFieldStore;
  certificates: ICertificatesItems;
  selectedStorageClass: string;
  namespace: string;
  validPages: string[];
  classes: any;
}

const styles = (theme: Theme) =>
  createStyles({
    pageBox: {
      border: "1px solid #EAEAEA",
    },
    ...modalBasic,
    ...wizardCommon,
    ...settingsCommon,
  });

const AddTenant = ({
  classes,
  fields,
  certificates,
  selectedStorageClass,
  namespace,
  validPages,
  setErrorSnackMessage,
  resetAddTenantForm,
}: IAddTenantProps) => {
  // Modals
  const [showNewCredentials, setShowNewCredentials] = useState<boolean>(false);
  const [createdAccount, setCreatedAccount] =
    useState<NewServiceAccount | null>(null);

  // Fields
  const [addSending, setAddSending] = useState<boolean>(false);

  /* Send Information to backend */
  useEffect(() => {
    const tenantName = fields.nameTenant.tenantName;
    const selectedStorageClass = fields.nameTenant.selectedStorageClass;
    const imageName = fields.configure.imageName;
    const customDockerhub = fields.configure.customDockerhub;
    const imageRegistry = fields.configure.imageRegistry;
    const imageRegistryUsername = fields.configure.imageRegistryUsername;
    const imageRegistryPassword = fields.configure.imageRegistryPassword;
    const exposeMinIO = fields.configure.exposeMinIO;
    const exposeConsole = fields.configure.exposeConsole;
    const idpSelection = fields.identityProvider.idpSelection;
    const openIDConfigurationURL =
      fields.identityProvider.openIDConfigurationURL;
    const openIDClientID = fields.identityProvider.openIDClientID;
    const openIDClaimName = fields.identityProvider.openIDClaimName;
    const openIDCallbackURL = fields.identityProvider.openIDCallbackURL;
    const openIDScopes = fields.identityProvider.openIDScopes;
    const openIDSecretID = fields.identityProvider.openIDSecretID;
    const ADURL = fields.identityProvider.ADURL;
    const ADSkipTLS = fields.identityProvider.ADSkipTLS;
    const ADServerInsecure = fields.identityProvider.ADServerInsecure;
    const ADUserNameSearchFilter =
      fields.identityProvider.ADUserNameSearchFilter;
    const ADGroupSearchBaseDN = fields.identityProvider.ADGroupSearchBaseDN;
    const ADGroupSearchFilter = fields.identityProvider.ADGroupSearchFilter;
    const ADGroupNameAttribute = fields.identityProvider.ADGroupNameAttribute;
    const ADUserDNs = fields.identityProvider.ADUserDNs;
    const ADUserNameFormat = fields.identityProvider.ADUserNameFormat;
    const ADLookupBindDN = fields.identityProvider.ADLookupBindDN;
    const ADLookupBindPassword = fields.identityProvider.ADLookupBindPassword;
    const ADUserDNSearchBaseDN = fields.identityProvider.ADUserDNSearchBaseDN;
    const ADUserDNSearchFilter = fields.identityProvider.ADUserDNSearchFilter;
    const ADServerStartTLS = fields.identityProvider.ADServerStartTLS;
    const accessKeys = fields.identityProvider.accessKeys;
    const secretKeys = fields.identityProvider.secretKeys;
    const minioCertificates = certificates.minioCertificates;
    const caCertificates = certificates.caCertificates;
    const consoleCaCertificates = certificates.consoleCaCertificates;
    const consoleCertificate = certificates.consoleCertificate;
    const serverCertificate = certificates.serverCertificate;
    const clientCertificate = certificates.clientCertificate;
    const vaultCertificate = certificates.vaultCertificate;
    const vaultCA = certificates.vaultCA;
    const gemaltoCA = certificates.gemaltoCA;
    const enableEncryption = fields.encryption.enableEncryption;
    const encryptionType = fields.encryption.encryptionType;
    const gemaltoEndpoint = fields.encryption.gemaltoEndpoint;
    const gemaltoToken = fields.encryption.gemaltoToken;
    const gemaltoDomain = fields.encryption.gemaltoDomain;
    const gemaltoRetry = fields.encryption.gemaltoRetry;
    const awsEndpoint = fields.encryption.awsEndpoint;
    const awsRegion = fields.encryption.awsRegion;
    const awsKMSKey = fields.encryption.awsKMSKey;
    const awsAccessKey = fields.encryption.awsAccessKey;
    const awsSecretKey = fields.encryption.awsSecretKey;
    const awsToken = fields.encryption.awsToken;
    const vaultEndpoint = fields.encryption.vaultEndpoint;
    const vaultEngine = fields.encryption.vaultEngine;
    const vaultNamespace = fields.encryption.vaultNamespace;
    const vaultPrefix = fields.encryption.vaultPrefix;
    const vaultAppRoleEngine = fields.encryption.vaultAppRoleEngine;
    const vaultId = fields.encryption.vaultId;
    const vaultSecret = fields.encryption.vaultSecret;
    const vaultRetry = fields.encryption.vaultRetry;
    const vaultPing = fields.encryption.vaultPing;
    const azureEndpoint = fields.encryption.azureEndpoint;
    const azureTenantID = fields.encryption.azureTenantID;
    const azureClientID = fields.encryption.azureClientID;
    const azureClientSecret = fields.encryption.azureClientSecret;
    const gcpProjectID = fields.encryption.gcpProjectID;
    const gcpEndpoint = fields.encryption.gcpEndpoint;
    const gcpClientEmail = fields.encryption.gcpClientEmail;
    const gcpClientID = fields.encryption.gcpClientID;
    const gcpPrivateKeyID = fields.encryption.gcpPrivateKeyID;
    const gcpPrivateKey = fields.encryption.gcpPrivateKey;
    const enableAutoCert = fields.security.enableAutoCert;
    const enableTLS = fields.security.enableTLS;
    const ecParity = fields.tenantSize.ecParity;
    const distribution = fields.tenantSize.distribution;
    const resourcesSize = fields.tenantSize.resourcesSize;
    const tenantCustom = fields.configure.tenantCustom;
    const logSearchCustom = fields.configure.logSearchCustom;
    const prometheusCustom = fields.configure.prometheusCustom;
    const logSearchVolumeSize = fields.configure.logSearchVolumeSize;
    const logSearchSelectedStorageClass =
      fields.configure.logSearchSelectedStorageClass;
    const logSearchImage = fields.configure.logSearchImage;
    const kesImage = fields.configure.kesImage;
    const logSearchPostgresImage = fields.configure.logSearchPostgresImage;
    const logSearchPostgresInitImage =
      fields.configure.logSearchPostgresInitImage;
    const prometheusImage = fields.configure.prometheusImage;
    const prometheusSidecarImage = fields.configure.prometheusSidecarImage;
    const prometheusInitImage = fields.configure.prometheusInitImage;
    const prometheusSelectedStorageClass =
      fields.configure.prometheusSelectedStorageClass;
    const prometheusVolumeSize = fields.configure.prometheusVolumeSize;
    const affinityType = fields.affinity.podAffinity;
    const nodeSelectorLabels = fields.affinity.nodeSelectorLabels;
    const withPodAntiAffinity = fields.affinity.withPodAntiAffinity;

    const tenantSecurityContext = fields.configure.tenantSecurityContext;
    const logSearchSecurityContext = fields.configure.logSearchSecurityContext;
    const logSearchPostgresSecurityContext =
      fields.configure.logSearchPostgresSecurityContext;
    const prometheusSecurityContext =
      fields.configure.prometheusSecurityContext;
    const kesSecurityContext = fields.encryption.kesSecurityContext;
    const kesReplicas = fields.encryption.replicas;

    if (addSending) {
      const poolName = generatePoolName([]);

      let affinityObject = {};

      switch (affinityType) {
        case "default":
          affinityObject = {
            affinity: getDefaultAffinity(tenantName, poolName),
          };
          break;
        case "nodeSelector":
          affinityObject = {
            affinity: getNodeSelector(
              nodeSelectorLabels,
              withPodAntiAffinity,
              tenantName,
              poolName
            ),
          };
          break;
      }

      const erasureCode = ecParity.split(":")[1];

      let dataSend: ITenantCreator = {
        name: tenantName,
        namespace: namespace,
        access_key: "",
        secret_key: "",
        access_keys: [],
        secret_keys: [],
        enable_tls: enableTLS && enableAutoCert,
        enable_console: true,
        enable_prometheus: true,
        service_name: "",
        image: imageName,
        expose_minio: exposeMinIO,
        expose_console: exposeConsole,
        pools: [
          {
            name: poolName,
            servers: distribution.nodes,
            volumes_per_server: distribution.disks,
            volume_configuration: {
              size: distribution.pvSize,
              storage_class_name: selectedStorageClass,
            },
            resources: {
              requests: {
                memory: resourcesSize.memoryRequest,
                cpu: resourcesSize.cpuRequest,
              },
              limits: {
                memory: resourcesSize.memoryRequest,
                cpu: resourcesSize.cpuRequest,
              },
            },
            securityContext: tenantCustom ? tenantSecurityContext : null,
            ...affinityObject,
          },
        ],
        erasureCodingParity: parseInt(erasureCode, 10),
      };

      if (customDockerhub) {
        dataSend = {
          ...dataSend,
          image_registry: {
            registry: imageRegistry,
            username: imageRegistryUsername,
            password: imageRegistryPassword,
          },
        };
      }

      if (logSearchCustom) {
        dataSend = {
          ...dataSend,
          logSearchConfiguration: {
            storageClass:
              logSearchSelectedStorageClass === "default"
                ? ""
                : logSearchSelectedStorageClass,
            storageSize: parseInt(logSearchVolumeSize),
            image: logSearchImage,
            postgres_image: logSearchPostgresImage,
            postgres_init_image: logSearchPostgresInitImage,
            securityContext: logSearchSecurityContext,
            postgres_securityContext: logSearchPostgresSecurityContext,
          },
        };
      } else {
        dataSend = {
          ...dataSend,
          logSearchConfiguration: {
            image: logSearchImage,
            postgres_image: logSearchPostgresImage,
            postgres_init_image: logSearchPostgresInitImage,
          },
        };
      }

      if (prometheusCustom) {
        dataSend = {
          ...dataSend,
          prometheusConfiguration: {
            storageClass:
              prometheusSelectedStorageClass === "default"
                ? ""
                : prometheusSelectedStorageClass,
            storageSize: parseInt(prometheusVolumeSize),
            image: prometheusImage,
            sidecar_image: prometheusSidecarImage,
            init_image: prometheusInitImage,
            securityContext: prometheusSecurityContext,
          },
        };
      } else {
        dataSend = {
          ...dataSend,
          prometheusConfiguration: {
            image: prometheusImage,
            sidecar_image: prometheusSidecarImage,
            init_image: prometheusInitImage,
          },
        };
      }

      let tenantCerts: any = null;
      let consoleCerts: any = null;
      let caCerts: any = null;
      let consoleCaCerts: any = null;

      if (caCertificates.length > 0) {
        caCerts = {
          ca_certificates: caCertificates
            .map((keyPair: KeyPair) => keyPair.encoded_cert)
            .filter((keyPair) => keyPair),
        };
      }

      if (consoleCaCertificates.length > 0) {
        consoleCaCerts = {
          console_ca_certificates: consoleCaCertificates
            .map((keyPair: KeyPair) => keyPair.encoded_cert)
            .filter((keyPair) => keyPair),
        };
      }

      if (enableTLS && minioCertificates.length > 0) {
        tenantCerts = {
          minio: minioCertificates
            .map((keyPair: KeyPair) => ({
              crt: keyPair.encoded_cert,
              key: keyPair.encoded_key,
            }))
            .filter((keyPair) => keyPair.crt && keyPair.key),
        };
      }

      if (
        enableTLS &&
        consoleCertificate.encoded_cert !== "" &&
        consoleCertificate.encoded_key !== ""
      ) {
        consoleCerts = {
          console: {
            crt: consoleCertificate.encoded_cert,
            key: consoleCertificate.encoded_key,
          },
        };
      }

      if (tenantCerts || consoleCerts || caCerts || consoleCaCerts) {
        dataSend = {
          ...dataSend,
          tls: {
            ...tenantCerts,
            ...consoleCerts,
            ...caCerts,
            ...consoleCaCerts,
          },
        };
      }

      if (enableEncryption) {
        let insertEncrypt = {};

        switch (encryptionType) {
          case "gemalto":
            let gemaltoCAIntroduce = {};

            if (gemaltoCA.encoded_cert !== "") {
              gemaltoCAIntroduce = {
                ca: gemaltoCA.encoded_cert,
              };
            }
            insertEncrypt = {
              gemalto: {
                keysecure: {
                  endpoint: gemaltoEndpoint,
                  credentials: {
                    token: gemaltoToken,
                    domain: gemaltoDomain,
                    retry: parseInt(gemaltoRetry),
                  },
                  tls: {
                    ...gemaltoCAIntroduce,
                  },
                },
              },
            };
            break;
          case "aws":
            insertEncrypt = {
              aws: {
                secretsmanager: {
                  endpoint: awsEndpoint,
                  region: awsRegion,
                  kmskey: awsKMSKey,
                  credentials: {
                    accesskey: awsAccessKey,
                    secretkey: awsSecretKey,
                    token: awsToken,
                  },
                },
              },
            };
            break;
          case "azure":
            insertEncrypt = {
              azure: {
                keyvault: {
                  endpoint: azureEndpoint,
                  credentials: {
                    tenant_id: azureTenantID,
                    client_id: azureClientID,
                    client_secret: azureClientSecret,
                  },
                },
              },
            };
            break;
          case "gcp":
            insertEncrypt = {
              gcp: {
                secretmanager: {
                  project_id: gcpProjectID,
                  endpoint: gcpEndpoint,
                  credentials: {
                    client_email: gcpClientEmail,
                    client_id: gcpClientID,
                    private_key_id: gcpPrivateKeyID,
                    private_key: gcpPrivateKey,
                  },
                },
              },
            };
            break;
          case "vault":
            let vaultKeyPair = null;
            let vaultCAInsert = null;
            if (
              vaultCertificate.encoded_key !== "" &&
              vaultCertificate.encoded_cert !== ""
            ) {
              vaultKeyPair = {
                key: vaultCertificate.encoded_key,
                crt: vaultCertificate.encoded_cert,
              };
            }
            if (vaultCA.encoded_cert !== "") {
              vaultCAInsert = {
                ca: vaultCA.encoded_cert,
              };
            }
            let vaultTLS = null;
            if (vaultKeyPair || vaultCA) {
              vaultTLS = {
                tls: {
                  ...vaultKeyPair,
                  ...vaultCAInsert,
                },
              };
            }
            insertEncrypt = {
              vault: {
                endpoint: vaultEndpoint,
                engine: vaultEngine,
                namespace: vaultNamespace,
                prefix: vaultPrefix,
                approle: {
                  engine: vaultAppRoleEngine,
                  id: vaultId,
                  secret: vaultSecret,
                  retry: parseInt(vaultRetry),
                },
                ...vaultTLS,
                status: {
                  ping: parseInt(vaultPing),
                },
              },
            };
            break;
        }

        let encryptionServerKeyPair: any = {};
        let encryptionClientKeyPair: any = {};

        if (
          clientCertificate.encoded_key !== "" &&
          clientCertificate.encoded_cert !== ""
        ) {
          encryptionClientKeyPair = {
            client: {
              key: clientCertificate.encoded_key,
              crt: clientCertificate.encoded_cert,
            },
          };
        }

        if (
          serverCertificate.encoded_key !== "" &&
          serverCertificate.encoded_cert !== ""
        ) {
          encryptionServerKeyPair = {
            server: {
              key: serverCertificate.encoded_key,
              crt: serverCertificate.encoded_cert,
            },
          };
        }

        dataSend = {
          ...dataSend,
          encryption: {
            replicas: kesReplicas,
            securityContext: kesSecurityContext,
            image: kesImage,
            ...encryptionClientKeyPair,
            ...encryptionServerKeyPair,
            ...insertEncrypt,
          },
        };
      }

      let dataIDP: any = {};
      switch (idpSelection) {
        case "Built-in":
          let keyarray = [];
          for (let i = 0; i < accessKeys.length; i++) {
            keyarray.push({
              access_key: accessKeys[i],
              secret_key: secretKeys[i],
            });
          }
          dataIDP = {
            keys: keyarray,
          };
          break;
        case "OpenID":
          dataIDP = {
            oidc: {
              configuration_url: openIDConfigurationURL,
              client_id: openIDClientID,
              secret_id: openIDSecretID,
              claim_name: openIDClaimName,
              callback_url: openIDCallbackURL,
              scopes: openIDScopes,
            },
          };
          break;
        case "AD":
          dataIDP = {
            active_directory: {
              url: ADURL,
              skip_tls_verification: ADSkipTLS,
              server_insecure: ADServerInsecure,
              username_format: ADUserNameFormat,
              username_search_filter: ADUserNameSearchFilter,
              group_search_base_dn: ADGroupSearchBaseDN,
              group_search_filter: ADGroupSearchFilter,
              group_name_attribute: ADGroupNameAttribute,
              user_dns: ADUserDNs,
              lookup_bind_dn: ADLookupBindDN,
              lookup_bind_password: ADLookupBindPassword,
              user_dn_search_base_dn: ADUserDNSearchBaseDN,
              user_dn_search_filter: ADUserDNSearchFilter,
              server_start_tls: ADServerStartTLS,
            },
          };
          break;
      }

      dataSend = {
        ...dataSend,
        idp: { ...dataIDP },
      };
      api
        .invoke("POST", `/api/v1/tenants`, dataSend)
        .then((res) => {
          const consoleSAList = get(res, "console", []);

          let newSrvAcc: NewServiceAccount = {
            idp: get(res, "externalIDP", false),
            console: [],
          };

          if (consoleSAList) {
            if (Array.isArray(consoleSAList)) {
              const consoleItem = consoleSAList.map((consoleKey) => {
                return {
                  accessKey: consoleKey.access_key,
                  secretKey: consoleKey.secret_key,
                };
              });

              newSrvAcc.console = consoleItem;
            } else {
              newSrvAcc = {
                console: {
                  accessKey: res.console.access_key,
                  secretKey: res.console.secret_key,
                },
              };
            }
          }
          setAddSending(false);
          setShowNewCredentials(true);
          setCreatedAccount(newSrvAcc);
        })
        .catch((err: ErrorResponseHandler) => {
          setAddSending(false);
          setErrorSnackMessage(err);
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [addSending]);

  const cancelButton = {
    label: "Cancel",
    type: "other",
    enabled: true,
    action: () => {
      history.push("/tenants");
    },
  };
  const requiredPages = [
    "nameTenant",
    "tenantSize",
    "configure",
    "affinity",
    "identityProvider",
    "security",
    "encryption",
  ];
  const createButton = {
    label: "Create",
    type: "submit",
    enabled:
      !addSending &&
      selectedStorageClass !== "" &&
      requiredPages.every((v) => validPages.includes(v)),
    action: () => {
      setAddSending(true);
    },
  };

  const wizardSteps: IWizardElement[] = [
    {
      label: "Setup",
      componentRender: <TenantResources />,
      buttons: [cancelButton, createButton],
    },
    {
      label: "Configure",
      advancedOnly: true,
      componentRender: <Configure />,
      buttons: [cancelButton, createButton],
    },
    {
      label: "Images",
      advancedOnly: true,
      componentRender: <Images />,
      buttons: [cancelButton, createButton],
    },
    {
      label: "Pod Placement",
      advancedOnly: true,
      componentRender: <Affinity />,
      buttons: [cancelButton, createButton],
    },
    {
      label: "Identity Provider",
      advancedOnly: true,
      componentRender: <IdentityProvider />,
      buttons: [cancelButton, createButton],
    },
    {
      label: "Security",
      advancedOnly: true,
      componentRender: <Security />,
      buttons: [cancelButton, createButton],
    },
    {
      label: "Encryption",
      advancedOnly: true,
      componentRender: <Encryption />,
      buttons: [cancelButton, createButton],
    },
  ];

  let filteredWizardSteps = wizardSteps;

  const closeCredentialsModal = () => {
    resetAddTenantForm();
    history.push("/tenants");
  };

  return (
    <Fragment>
      {showNewCredentials && (
        <CredentialsPrompt
          newServiceAccount={createdAccount}
          open={showNewCredentials}
          closeModal={() => {
            closeCredentialsModal();
          }}
          entity="Tenant"
        />
      )}
      <PageHeader label={"Create New Tenant"} />
      <BackLink to={"/tenants"} label={"Return to Tenant List"} />
      <PageLayout>
        {addSending && (
          <Grid item xs={12}>
            <LinearProgress />
          </Grid>
        )}
        <Grid item xs={12} className={classes.pageBox}>
          <GenericWizard wizardSteps={filteredWizardSteps} />
        </Grid>
      </PageLayout>
    </Fragment>
  );
};

const mapState = (state: AppState) => ({
  namespace: state.tenants.createTenant.fields.nameTenant.namespace,
  validPages: state.tenants.createTenant.validPages,
  fields: state.tenants.createTenant.fields,
  certificates: state.tenants.createTenant.certificates,
  selectedStorageClass:
    state.tenants.createTenant.fields.nameTenant.selectedStorageClass,
});

const connector = connect(mapState, {
  setErrorSnackMessage,
  updateAddField,
  resetAddTenantForm,
});

export default withStyles(styles)(connector(AddTenant));
