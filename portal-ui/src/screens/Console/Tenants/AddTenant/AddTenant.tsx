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

import React, { useEffect, useState, Fragment } from "react";
import { connect } from "react-redux";
import Grid from "@material-ui/core/Grid";
import { LinearProgress } from "@material-ui/core";

import { createStyles, Theme, withStyles } from "@material-ui/core/styles";
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
import { IAffinityModel, ITenantCreator } from "../../../../common/types";
import { KeyPair } from "../ListTenants/utils";

import { setModalErrorSnackMessage } from "../../../../actions";
import { getHardcodedAffinity } from "../TenantDetails/utils";
import CredentialsPrompt from "../../Common/CredentialsPrompt/CredentialsPrompt";
import NameTenant from "./Steps/NameTenant";
import { AppState } from "../../../../store";
import { ICertificatesItems, IFieldStore } from "../types";
import { updateAddField } from "../actions";
import Configure from "./Steps/Configure";
import IdentityProvider from "./Steps/IdentityProvider";
import Security from "./Steps/Security";
import Encryption from "./Steps/Encryption";
import TenantSize from "./Steps/TenantSize";
import Preview from "./Steps/Preview";

interface IAddTenantProps {
  closeAndRefresh: (reloadData: boolean) => any;
  setModalErrorSnackMessage: typeof setModalErrorSnackMessage;
  updateAddField: typeof updateAddField;
  fields: IFieldStore;
  certificates: ICertificatesItems;
  namespace: string;
  validPages: string[];
  advancedMode: boolean;
  classes: any;
}

const styles = (theme: Theme) =>
  createStyles({
    buttonContainer: {
      textAlign: "right",
    },
    ...modalBasic,
    ...wizardCommon,
    ...settingsCommon,
  });

const AddTenant = ({
  classes,
  advancedMode,
  fields,
  certificates,
  namespace,
  validPages,
  setModalErrorSnackMessage,
  closeAndRefresh,
}: IAddTenantProps) => {
  // Modals
  const [showNewCredentials, setShowNewCredentials] = useState<boolean>(false);
  const [
    createdAccount,
    setCreatedAccount,
  ] = useState<NewServiceAccount | null>(null);

  // Fields
  const [addSending, setAddSending] = useState<boolean>(false);

  /* Send Information to backend */
  useEffect(() => {
    const tenantName = fields.nameTenant.tenantName;
    const selectedStorageClass = fields.nameTenant.selectedStorageClass;
    const imageName = fields.configure.imageName;
    const consoleImage = fields.configure.consoleImage;
    const customDockerhub = fields.configure.customDockerhub;
    const imageRegistry = fields.configure.imageRegistry;
    const imageRegistryUsername = fields.configure.imageRegistryUsername;
    const imageRegistryPassword = fields.configure.imageRegistryPassword;
    const exposeMinIO = fields.configure.exposeMinIO;
    const exposeConsole = fields.configure.exposeConsole;
    const idpSelection = fields.identityProvider.idpSelection;
    const openIDURL = fields.identityProvider.openIDURL;
    const openIDClientID = fields.identityProvider.openIDClientID;
    const openIDSecretID = fields.identityProvider.openIDSecretID;
    const ADURL = fields.identityProvider.ADURL;
    const ADSkipTLS = fields.identityProvider.ADSkipTLS;
    const ADServerInsecure = fields.identityProvider.ADServerInsecure;
    const ADUserNameFilter = fields.identityProvider.ADUserNameFilter;
    const ADGroupBaseDN = fields.identityProvider.ADGroupBaseDN;
    const ADGroupSearchFilter = fields.identityProvider.ADGroupSearchFilter;
    const ADNameAttribute = fields.identityProvider.ADNameAttribute;
    const accessKeys = fields.identityProvider.accessKeys;
    const secretKeys = fields.identityProvider.secretKeys;
    const minioCertificates = certificates.minioCertificates;
    const caCertificates = certificates.caCertificates;
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
    const memorySize = fields.tenantSize.memorySize;
    const logSearchCustom = fields.configure.logSearchCustom;
    const prometheusCustom = fields.configure.prometheusCustom;
    const logSearchVolumeSize = fields.configure.logSearchVolumeSize;
    const logSearchSelectedStorageClass =
      fields.configure.logSearchSelectedStorageClass;
    const prometheusSelectedStorageClass =
      fields.configure.prometheusSelectedStorageClass;
    const prometheusVolumeSize = fields.configure.prometheusVolumeSize;

    if (addSending) {
      const poolName = generatePoolName([]);

      const hardCodedAffinity: IAffinityModel = getHardcodedAffinity(
        tenantName,
        poolName
      );

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
        console_image: consoleImage,
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
                memory: memorySize.request,
              },
              limits: {
                memory: memorySize.limit,
              },
            },
            affinity: hardCodedAffinity,
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
            storageClass: logSearchSelectedStorageClass,
            storageSize: parseInt(logSearchVolumeSize),
          },
        };
      }

      if (prometheusCustom) {
        dataSend = {
          ...dataSend,
          prometheusConfiguration: {
            storageClass: prometheusSelectedStorageClass,
            storageSize: parseInt(prometheusVolumeSize),
          },
        };
      }

      let tenantCerts: any = null;
      let consoleCerts: any = null;
      let caCerts: any = null;

      if (caCertificates.length > 0) {
        caCerts = {
          ca_certificates: caCertificates
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

      if (tenantCerts || consoleCerts || caCerts) {
        dataSend = {
          ...dataSend,
          tls: {
            ...tenantCerts,
            ...consoleCerts,
            ...caCerts,
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
              url: openIDURL,
              client_id: openIDClientID,
              secret_id: openIDSecretID,
            },
          };
          break;
        case "AD":
          dataIDP = {
            active_directory: {
              url: ADURL,
              skip_tls_verification: ADSkipTLS,
              server_insecure: ADServerInsecure,
              username_format: "",
              user_search_filter: ADUserNameFilter,
              group_search_base_dn: ADGroupBaseDN,
              group_search_filter: ADGroupSearchFilter,
              group_name_attribute: ADNameAttribute,
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
          const newSrvAcc: NewServiceAccount = {
            console: {
              accessKey: res.console.access_key,
              secretKey: res.console.secret_key,
            },
          };

          setAddSending(false);

          setShowNewCredentials(true);
          setCreatedAccount(newSrvAcc);
        })
        .catch((err) => {
          setAddSending(false);
          setModalErrorSnackMessage(err);
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [addSending]);

  const cancelButton = {
    label: "Cancel",
    type: "other",
    enabled: true,
    action: () => {
      closeAndRefresh(false);
    },
  };

  const wizardSteps: IWizardElement[] = [
    {
      label: "Name Tenant",
      componentRender: <NameTenant />,
      buttons: [
        cancelButton,
        {
          label: "Next",
          type: "next",
          enabled: validPages.includes("nameTenant"),
        },
      ],
    },
    {
      label: "Configure",
      advancedOnly: true,
      componentRender: <Configure />,
      buttons: [
        cancelButton,
        { label: "Back", type: "back", enabled: true },
        {
          label: "Next",
          type: "next",
          enabled: validPages.includes("configure"),
        },
      ],
    },
    {
      label: "Identity Provider",
      advancedOnly: true,
      componentRender: <IdentityProvider />,
      buttons: [
        cancelButton,
        { label: "Back", type: "back", enabled: true },
        {
          label: "Next",
          type: "next",
          enabled: validPages.includes("identityProvider"),
        },
      ],
    },
    {
      label: "Security",
      advancedOnly: true,
      componentRender: <Security />,
      buttons: [
        cancelButton,
        { label: "Back", type: "back", enabled: true },
        {
          label: "Next",
          type: "next",
          enabled: validPages.includes("security"),
        },
      ],
    },
    {
      label: "Encryption",
      advancedOnly: true,
      componentRender: <Encryption />,
      buttons: [
        cancelButton,
        { label: "Back", type: "back", enabled: true },
        {
          label: "Next",
          type: "next",
          enabled: validPages.includes("encryption"),
        },
      ],
    },
    {
      label: "Tenant Size",
      componentRender: <TenantSize />,
      buttons: [
        cancelButton,
        { label: "Back", type: "back", enabled: true },
        {
          label: "Next",
          type: "next",
          enabled: validPages.includes("tenantSize"),
        },
      ],
    },
    {
      label: "Preview Configuration",
      componentRender: <Preview />,
      buttons: [
        cancelButton,
        { label: "Back", type: "back", enabled: true },
        {
          label: "Create",
          type: "submit",
          enabled: !addSending,
          action: () => {
            setAddSending(true);
          },
        },
      ],
    },
  ];

  let filteredWizardSteps = wizardSteps;

  if (!advancedMode) {
    filteredWizardSteps = wizardSteps.filter((step) => !step.advancedOnly);
  }

  const closeCredentialsModal = () => {
    closeAndRefresh(true);
  };

  return (
    <Fragment>
      <Grid item xs={12} className={classes.customTitle}>
        Create New Tenant
      </Grid>
      {addSending && (
        <Grid item xs={12}>
          <LinearProgress />
        </Grid>
      )}
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
      <Grid container>
        <Grid item xs={12}>
          <GenericWizard wizardSteps={filteredWizardSteps} />
        </Grid>
      </Grid>
    </Fragment>
  );
};

const mapState = (state: AppState) => ({
  advancedMode: state.tenants.createTenant.advancedModeOn,
  namespace: state.tenants.createTenant.fields.nameTenant.namespace,
  validPages: state.tenants.createTenant.validPages,
  fields: state.tenants.createTenant.fields,
  certificates: state.tenants.createTenant.certificates,
});

const connector = connect(mapState, {
  setModalErrorSnackMessage,
  updateAddField,
});

export default withStyles(styles)(connector(AddTenant));
