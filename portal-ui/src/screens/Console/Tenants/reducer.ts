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
import has from "lodash/has";
import get from "lodash/get";
import {
  ADD_POOL_ADD_NEW_TOLERATION,
  ADD_POOL_REMOVE_TOLERATION_ROW,
  ADD_POOL_RESET_FORM,
  ADD_POOL_SET_KEY_PAIR_VALUE,
  ADD_POOL_SET_LOADING,
  ADD_POOL_SET_PAGE_VALID,
  ADD_POOL_SET_POOL_STORAGE_CLASSES,
  ADD_POOL_SET_TOLERATION_VALUE,
  ADD_POOL_SET_VALUE,
  ADD_TENANT_ADD_CA_KEYPAIR,
  ADD_TENANT_ADD_CONSOLE_CA_KEYPAIR,
  ADD_TENANT_ADD_CONSOLE_CERT,
  ADD_TENANT_ADD_FILE_TO_CA_KEYPAIR,
  ADD_TENANT_ADD_FILE_TO_CONSOLE_CA_KEYPAIR,
  ADD_TENANT_ADD_FILE_TO_MINIO_KEYPAIR,
  ADD_TENANT_ADD_MINIO_DOMAIN,
  ADD_TENANT_ADD_MINIO_KEYPAIR,
  ADD_TENANT_ADD_NEW_TOLERATION,
  ADD_TENANT_DELETE_CA_KEYPAIR,
  ADD_TENANT_DELETE_CONSOLE_CA_KEYPAIR,
  ADD_TENANT_DELETE_MINIO_DOMAIN,
  ADD_TENANT_DELETE_MINIO_KEYPAIR,
  ADD_TENANT_ENCRYPTION_CLIENT_CERT,
  ADD_TENANT_ENCRYPTION_GEMALTO_CA,
  ADD_TENANT_ENCRYPTION_SERVER_CERT,
  ADD_TENANT_ENCRYPTION_VAULT_CA,
  ADD_TENANT_ENCRYPTION_VAULT_CERT,
  ADD_TENANT_REMOVE_TOLERATION_ROW,
  ADD_TENANT_RESET_FORM,
  ADD_TENANT_SET_CURRENT_PAGE,
  ADD_TENANT_SET_KEY_PAIR_VALUE,
  ADD_TENANT_SET_LIMIT_SIZE,
  ADD_TENANT_SET_PAGE_VALID,
  ADD_TENANT_SET_STORAGE_CLASSES_LIST,
  ADD_TENANT_SET_STORAGE_TYPE,
  ADD_TENANT_SET_TOLERATION_VALUE,
  ADD_TENANT_UPDATE_FIELD,
  EDIT_POOL_ADD_NEW_TOLERATION,
  EDIT_POOL_REMOVE_TOLERATION_ROW,
  EDIT_POOL_RESET_FORM,
  EDIT_POOL_SET_INITIAL_INFO,
  EDIT_POOL_SET_KEY_PAIR_VALUE,
  EDIT_POOL_SET_LOADING,
  EDIT_POOL_SET_PAGE_VALID,
  EDIT_POOL_SET_POOL_STORAGE_CLASSES,
  EDIT_POOL_SET_TOLERATION_VALUE,
  EDIT_POOL_SET_VALUE,
  IEditPoolFields,
  ITenantState,
  LabelKeyPair,
  POOL_DETAILS_SET_OPEN_DETAILS,
  POOL_DETAILS_SET_SELECTED_POOL,
  TENANT_DETAILS_SET_CURRENT_TENANT,
  TENANT_DETAILS_SET_LOADING,
  TENANT_DETAILS_SET_TAB,
  TENANT_DETAILS_SET_TENANT,
  TenantsManagementTypes,
} from "./types";
import { KeyPair } from "./ListTenants/utils";
import { getRandomString } from "./utils";
import { addTenantSetStorageTypeReducer } from "./reducers/add-tenant-reducer";
import {
  ITolerationEffect,
  ITolerationModel,
  ITolerationOperator,
} from "../../../common/types";

const initialState: ITenantState = {
  createTenant: {
    page: 0,
    // We can assume all the other pages are valid with default configuration except for 'nameTenant'
    // because the user still have to choose a namespace and a name for the tenant
    validPages: [
      "tenantSize",
      "configure",
      "affinity",
      "identityProvider",
      "security",
      "encryption",
    ],
    storageClasses: [],
    limitSize: {},
    fields: {
      nameTenant: {
        tenantName: "",
        namespace: "",
        selectedStorageClass: "",
        selectedStorageType: "",
      },
      configure: {
        customImage: true,
        imageName: "",
        customDockerhub: false,
        imageRegistry: "",
        imageRegistryUsername: "",
        imageRegistryPassword: "",
        exposeMinIO: true,
        exposeConsole: true,
        tenantCustom: false,
        logSearchEnabled: true,
        prometheusEnabled: true,
        logSearchVolumeSize: "5",
        logSearchSizeFactor: "Gi",
        logSearchImage: "",
        kesImage: "",
        logSearchPostgresImage: "",
        logSearchPostgresInitImage: "",
        prometheusVolumeSize: "5",
        prometheusSizeFactor: "Gi",
        logSearchSelectedStorageClass: "default",
        prometheusSelectedStorageClass: "default",
        prometheusImage: "",
        prometheusSidecarImage: "",
        prometheusInitImage: "",
        setDomains: false,
        consoleDomain: "",
        minioDomains: [""],
        tenantSecurityContext: {
          runAsUser: "1000",
          runAsGroup: "1000",
          fsGroup: "1000",
          runAsNonRoot: true,
        },
        logSearchSecurityContext: {
          runAsUser: "1000",
          runAsGroup: "1000",
          fsGroup: "1000",
          runAsNonRoot: true,
        },
        logSearchPostgresSecurityContext: {
          runAsUser: "999",
          runAsGroup: "999",
          fsGroup: "999",
          runAsNonRoot: true,
        },
        prometheusSecurityContext: {
          runAsUser: "1000",
          runAsGroup: "1000",
          fsGroup: "1000",
          runAsNonRoot: true,
        },
      },
      identityProvider: {
        idpSelection: "Built-in",
        accessKeys: [getRandomString(16)],
        secretKeys: [getRandomString(32)],
        openIDConfigurationURL: "",
        openIDClientID: "",
        openIDSecretID: "",
        openIDCallbackURL: "",
        openIDClaimName: "",
        openIDScopes: "",
        ADURL: "",
        ADSkipTLS: false,
        ADServerInsecure: false,
        ADGroupSearchBaseDN: "",
        ADGroupSearchFilter: "",
        ADUserDNs: [""],
        ADLookupBindDN: "",
        ADLookupBindPassword: "",
        ADUserDNSearchBaseDN: "",
        ADUserDNSearchFilter: "",
        ADServerStartTLS: false,
      },
      security: {
        enableAutoCert: true,
        enableCustomCerts: false,
        enableTLS: true,
      },
      encryption: {
        enableEncryption: false,
        encryptionType: "vault",
        gemaltoEndpoint: "",
        gemaltoToken: "",
        gemaltoDomain: "",
        gemaltoRetry: "0",
        awsEndpoint: "",
        awsRegion: "",
        awsKMSKey: "",
        awsAccessKey: "",
        awsSecretKey: "",
        awsToken: "",
        vaultEndpoint: "",
        vaultEngine: "",
        vaultNamespace: "",
        vaultPrefix: "",
        vaultAppRoleEngine: "",
        vaultId: "",
        vaultSecret: "",
        vaultRetry: "0",
        vaultPing: "0",
        azureEndpoint: "",
        azureTenantID: "",
        azureClientID: "",
        azureClientSecret: "",
        gcpProjectID: "",
        gcpEndpoint: "",
        gcpClientEmail: "",
        gcpClientID: "",
        gcpPrivateKeyID: "",
        gcpPrivateKey: "",
        enableCustomCertsForKES: false,
        replicas: "1",
        kesSecurityContext: {
          runAsUser: "1000",
          runAsGroup: "1000",
          fsGroup: "1000",
          runAsNonRoot: true,
        },
      },
      tenantSize: {
        volumeSize: "1024",
        sizeFactor: "Gi",
        drivesPerServer: "4",
        nodes: "4",
        memoryNode: "2",
        ecParity: "",
        ecParityChoices: [],
        cleanECChoices: [],
        untouchedECField: true,
        cpuToUse: "0",
        // resource request
        resourcesSpecifyLimit: false,
        resourcesCPURequestError: "",
        resourcesCPURequest: "",
        resourcesCPULimitError: "",
        resourcesCPULimit: "",
        resourcesMemoryRequestError: "",
        resourcesMemoryRequest: "",
        resourcesMemoryLimitError: "",
        resourcesMemoryLimit: "",
        resourcesSize: {
          error: "",
          memoryRequest: 0,
          memoryLimit: 0,
          cpuRequest: 0,
          cpuLimit: 0,
        },
        distribution: {
          error: "",
          nodes: 0,
          persistentVolumes: 0,
          disks: 0,
        },
        ecParityCalc: {
          error: 0,
          defaultEC: "",
          erasureCodeSet: 0,
          maxEC: "",
          rawCapacity: "0",
          storageFactors: [],
        },
        limitSize: {},
        maxAllocatableResources: {
          min_allocatable_mem: 0,
          min_allocatable_cpu: 0,
          cpu_priority: {
            max_allocatable_cpu: 0,
            max_allocatable_mem: 0,
          },
          mem_priority: {
            max_allocatable_cpu: 0,
            max_allocatable_mem: 0,
          },
        },
        maxCPUsUse: "0",
        maxMemorySize: "0",
        integrationSelection: {
          driveSize: { driveSize: "0", sizeUnit: "B" },
          CPU: 0,
          typeSelection: "",
          memory: 0,
          drivesPerServer: 0,
          storageClass: "",
        },
      },
      affinity: {
        nodeSelectorLabels: "",
        podAffinity: "default",
        withPodAntiAffinity: true,
      },
    },
    certificates: {
      minioCertificates: [
        {
          id: Date.now().toString(),
          key: "",
          cert: "",
          encoded_key: "",
          encoded_cert: "",
        },
      ],
      caCertificates: [
        {
          id: Date.now().toString(),
          key: "",
          cert: "",
          encoded_key: "",
          encoded_cert: "",
        },
      ],
      consoleCaCertificates: [
        {
          id: Date.now().toString(),
          key: "",
          cert: "",
          encoded_key: "",
          encoded_cert: "",
        },
      ],
      consoleCertificate: {
        id: "console_cert_pair",
        key: "",
        cert: "",
        encoded_key: "",
        encoded_cert: "",
      },
      serverCertificate: {
        id: "encryptionServerCertificate",
        key: "",
        cert: "",
        encoded_key: "",
        encoded_cert: "",
      },
      clientCertificate: {
        id: "encryptionClientCertificate",
        key: "",
        cert: "",
        encoded_key: "",
        encoded_cert: "",
      },
      vaultCertificate: {
        id: "encryptionVaultCertificate",
        key: "",
        cert: "",
        encoded_key: "",
        encoded_cert: "",
      },
      vaultCA: {
        id: "encryptionVaultCA",
        key: "",
        cert: "",
        encoded_key: "",
        encoded_cert: "",
      },
      gemaltoCA: {
        id: "encryptionGemaltoCA",
        key: "",
        cert: "",
        encoded_key: "",
        encoded_cert: "",
      },
    },
    nodeSelectorPairs: [{ key: "", value: "" }],
    tolerations: [
      {
        key: "",
        tolerationSeconds: { seconds: 0 },
        value: "",
        effect: ITolerationEffect.NoSchedule,
        operator: ITolerationOperator.Equal,
      },
    ],
  },
  tenantDetails: {
    currentTenant: "",
    currentNamespace: "",
    loadingTenant: false,
    tenantInfo: null,
    currentTab: "summary",
    selectedPool: null,
    poolDetailsOpen: false,
  },
  addPool: {
    addPoolLoading: false,
    validPages: ["affinity", "configure"],
    storageClasses: [],
    limitSize: {},
    fields: {
      setup: {
        numberOfNodes: 0,
        storageClass: "",
        volumeSize: 0,
        volumesPerServer: 0,
      },
      affinity: {
        nodeSelectorLabels: "",
        podAffinity: "default",
        withPodAntiAffinity: true,
      },
      configuration: {
        securityContextEnabled: false,
        securityContext: {
          runAsUser: "1000",
          runAsGroup: "1000",
          fsGroup: "1000",
          runAsNonRoot: true,
        },
      },
      nodeSelectorPairs: [{ key: "", value: "" }],
      tolerations: [
        {
          key: "",
          tolerationSeconds: { seconds: 0 },
          value: "",
          effect: ITolerationEffect.NoSchedule,
          operator: ITolerationOperator.Equal,
        },
      ],
    },
  },
  editPool: {
    editPoolLoading: false,
    validPages: ["setup", "affinity", "configure"],
    storageClasses: [],
    limitSize: {},
    fields: {
      setup: {
        numberOfNodes: 0,
        storageClass: "",
        volumeSize: 0,
        volumesPerServer: 0,
      },
      affinity: {
        nodeSelectorLabels: "",
        podAffinity: "default",
        withPodAntiAffinity: true,
      },
      configuration: {
        securityContextEnabled: false,
        securityContext: {
          runAsUser: "1000",
          runAsGroup: "1000",
          fsGroup: "1000",
          runAsNonRoot: true,
        },
      },
      nodeSelectorPairs: [{ key: "", value: "" }],
      tolerations: [
        {
          key: "",
          tolerationSeconds: { seconds: 0 },
          value: "",
          effect: ITolerationEffect.NoSchedule,
          operator: ITolerationOperator.Equal,
        },
      ],
    },
  },
};

export function tenantsReducer(
  state = initialState,
  action: TenantsManagementTypes
): ITenantState {
  let newState: ITenantState = { ...state };

  switch (action.type) {
    case ADD_TENANT_SET_CURRENT_PAGE:
      newState.createTenant.page = action.page;

      return { ...newState };

    case ADD_TENANT_UPDATE_FIELD:
      if (
        has(newState.createTenant.fields, `${action.pageName}.${action.field}`)
      ) {
        const originPageNameItems = get(
          newState.createTenant.fields,
          `${action.pageName}`,
          {}
        );

        let newValue: any = {};
        newValue[action.field] = action.value;

        const joinValue = { ...originPageNameItems, ...newValue };

        newState.createTenant.fields[action.pageName] = { ...joinValue };

        return { ...newState };
      }
      return state;
    case ADD_TENANT_SET_PAGE_VALID:
      let originValidPages = state.createTenant.validPages;

      if (action.valid) {
        if (!originValidPages.includes(action.pageName)) {
          originValidPages.push(action.pageName);

          newState.createTenant.validPages = [...originValidPages];
        }
      } else {
        const newSetOfPages = originValidPages.filter(
          (elm) => elm !== action.pageName
        );

        newState.createTenant.validPages = [...newSetOfPages];
      }

      return { ...newState };
    case ADD_TENANT_SET_STORAGE_CLASSES_LIST:
      const changeCL = {
        ...state,
        createTenant: {
          ...state.createTenant,
          storageClasses: action.storageClasses,
        },
      };
      return { ...changeCL };
    case ADD_TENANT_SET_STORAGE_TYPE:
      return addTenantSetStorageTypeReducer(action, state);
    case ADD_TENANT_SET_LIMIT_SIZE:
      const changeSizeLimit = {
        ...state,
        createTenant: { ...state.createTenant, limitSize: action.limitSize },
      };

      return { ...changeSizeLimit };
    case ADD_TENANT_ADD_MINIO_KEYPAIR:
      const minioCerts = [
        ...state.createTenant.certificates.minioCertificates,
        {
          id: Date.now().toString(),
          key: "",
          cert: "",
          encoded_key: "",
          encoded_cert: "",
        },
      ];
      newState.createTenant.certificates.minioCertificates = [...minioCerts];
      return { ...newState };
    case ADD_TENANT_ADD_FILE_TO_MINIO_KEYPAIR:
      const minioCertificates =
        state.createTenant.certificates.minioCertificates;

      const NCertList = minioCertificates.map((item: KeyPair) => {
        if (item.id === action.id) {
          return {
            ...item,
            [action.key]: action.fileName,
            [`encoded_${action.key}`]: action.value,
          };
        }
        return item;
      });
      newState.createTenant.certificates.minioCertificates = [...NCertList];
      return { ...newState };
    case ADD_TENANT_DELETE_MINIO_KEYPAIR:
      const minioCertsList = state.createTenant.certificates.minioCertificates;

      if (minioCertsList.length > 1) {
        const cleanMinioCertsList = minioCertsList.filter(
          (item: KeyPair) => item.id !== action.id
        );
        newState.createTenant.certificates.minioCertificates = [
          ...cleanMinioCertsList,
        ];
        return { ...newState };
      }
      return { ...state };
    case ADD_TENANT_ADD_CA_KEYPAIR:
      const CACerts = [
        ...state.createTenant.certificates.caCertificates,
        {
          id: Date.now().toString(),
          key: "",
          cert: "",
          encoded_key: "",
          encoded_cert: "",
        },
      ];
      newState.createTenant.certificates.caCertificates = [...CACerts];
      return { ...newState };
    case ADD_TENANT_ADD_FILE_TO_CA_KEYPAIR:
      const caCertificates = state.createTenant.certificates.caCertificates;

      const NACList = caCertificates.map((item: KeyPair) => {
        if (item.id === action.id) {
          return {
            ...item,
            [action.key]: action.fileName,
            [`encoded_${action.key}`]: action.value,
          };
        }
        return item;
      });
      newState.createTenant.certificates.caCertificates = [...NACList];
      return { ...newState };
    case ADD_TENANT_DELETE_CA_KEYPAIR:
      const CACertsList = state.createTenant.certificates.caCertificates;
      if (CACertsList.length > 1) {
        const cleanCaCertsList = CACertsList.filter(
          (item: KeyPair) => item.id !== action.id
        );
        newState.createTenant.certificates.caCertificates = [
          ...cleanCaCertsList,
        ];
        return { ...newState };
      }
      return { ...state };
    case ADD_TENANT_ADD_CONSOLE_CERT:
      const consoleCert = state.createTenant.certificates.consoleCertificate;

      newState.createTenant.certificates.consoleCertificate = {
        ...consoleCert,
        [action.key]: action.fileName,
        [`encoded_${action.key}`]: action.value,
      };

      return { ...newState };
    case ADD_TENANT_ADD_CONSOLE_CA_KEYPAIR:
      const ConsoleCACerts = [
        ...state.createTenant.certificates.consoleCaCertificates,
        {
          id: Date.now().toString(),
          key: "",
          cert: "",
          encoded_key: "",
          encoded_cert: "",
        },
      ];
      newState.createTenant.certificates.consoleCaCertificates = [
        ...ConsoleCACerts,
      ];
      return { ...newState };
    case ADD_TENANT_ADD_FILE_TO_CONSOLE_CA_KEYPAIR:
      const consoleCaCertificates =
        state.createTenant.certificates.consoleCaCertificates;

      const consoleNACList = consoleCaCertificates.map((item: KeyPair) => {
        if (item.id === action.id) {
          return {
            ...item,
            [action.key]: action.fileName,
            [`encoded_${action.key}`]: action.value,
          };
        }
        return item;
      });
      newState.createTenant.certificates.consoleCaCertificates = [
        ...consoleNACList,
      ];
      return { ...newState };
    case ADD_TENANT_DELETE_CONSOLE_CA_KEYPAIR:
      const consoleCACertsList =
        state.createTenant.certificates.consoleCaCertificates;
      if (consoleCACertsList.length > 1) {
        const cleanCaCertsList = consoleCACertsList.filter(
          (item: KeyPair) => item.id !== action.id
        );
        newState.createTenant.certificates.consoleCaCertificates = [
          ...cleanCaCertsList,
        ];
        return { ...newState };
      }
      return { ...state };
    case ADD_TENANT_ENCRYPTION_SERVER_CERT:
      const encServerCert = state.createTenant.certificates.serverCertificate;

      newState.createTenant.certificates.serverCertificate = {
        ...encServerCert,
        [action.key]: action.fileName,
        [`encoded_${action.key}`]: action.value,
      };

      return { ...newState };
    case ADD_TENANT_ENCRYPTION_CLIENT_CERT:
      const encClientCert = state.createTenant.certificates.clientCertificate;

      newState.createTenant.certificates.clientCertificate = {
        ...encClientCert,
        [action.key]: action.fileName,
        [`encoded_${action.key}`]: action.value,
      };

      return { ...newState };
    case ADD_TENANT_ENCRYPTION_VAULT_CERT:
      const encVaultCert = state.createTenant.certificates.vaultCertificate;

      newState.createTenant.certificates.vaultCertificate = {
        ...encVaultCert,
        [action.key]: action.fileName,
        [`encoded_${action.key}`]: action.value,
      };

      return { ...newState };
    case ADD_TENANT_ENCRYPTION_VAULT_CA:
      const encVaultCA = state.createTenant.certificates.vaultCA;

      newState.createTenant.certificates.vaultCA = {
        ...encVaultCA,
        cert: action.fileName,
        encoded_cert: action.value,
      };

      return { ...newState };
    case ADD_TENANT_ENCRYPTION_GEMALTO_CA:
      const encGemaltoCA = state.createTenant.certificates.gemaltoCA;

      newState.createTenant.certificates.gemaltoCA = {
        ...encGemaltoCA,
        cert: action.fileName,
        encoded_cert: action.value,
      };

      return { ...newState };
    case ADD_TENANT_RESET_FORM:
      return {
        ...state,
        createTenant: {
          page: 0,
          // We can assume all the other pages are valid with default configuration except for 'nameTenant'
          // because the user still have to choose a namespace and a name for the tenant
          validPages: [
            "tenantSize",
            "configure",
            "affinity",
            "identityProvider",
            "security",
            "encryption",
          ],
          storageClasses: [],
          limitSize: {},
          fields: {
            nameTenant: {
              tenantName: "",
              namespace: "",
              selectedStorageClass: "",
              selectedStorageType: "",
            },
            configure: {
              customImage: false,
              imageName: "",
              customDockerhub: false,
              imageRegistry: "",
              imageRegistryUsername: "",
              imageRegistryPassword: "",
              exposeMinIO: true,
              exposeConsole: true,
              tenantCustom: false,
              logSearchEnabled: true,
              prometheusEnabled: true,
              logSearchVolumeSize: "5",
              logSearchSizeFactor: "Gi",
              logSearchSelectedStorageClass: "default",
              logSearchImage: "",
              kesImage: "",
              logSearchPostgresImage: "",
              logSearchPostgresInitImage: "",
              prometheusVolumeSize: "5",
              prometheusSizeFactor: "Gi",
              prometheusSelectedStorageClass: "default",
              prometheusImage: "",
              prometheusSidecarImage: "",
              prometheusInitImage: "",
              setDomains: false,
              consoleDomain: "",
              minioDomains: [""],
              tenantSecurityContext: {
                runAsUser: "1000",
                runAsGroup: "1000",
                fsGroup: "1000",
                runAsNonRoot: true,
              },
              logSearchSecurityContext: {
                runAsUser: "1000",
                runAsGroup: "1000",
                fsGroup: "1000",
                runAsNonRoot: true,
              },
              logSearchPostgresSecurityContext: {
                runAsUser: "999",
                runAsGroup: "999",
                fsGroup: "999",
                runAsNonRoot: true,
              },
              prometheusSecurityContext: {
                runAsUser: "1000",
                runAsGroup: "1000",
                fsGroup: "1000",
                runAsNonRoot: true,
              },
            },
            identityProvider: {
              idpSelection: "Built-in",
              accessKeys: [getRandomString(16)],
              secretKeys: [getRandomString(32)],
              openIDConfigurationURL: "",
              openIDClientID: "",
              openIDSecretID: "",
              openIDCallbackURL: "",
              openIDClaimName: "",
              openIDScopes: "",
              ADURL: "",
              ADSkipTLS: false,
              ADServerInsecure: false,
              ADGroupSearchBaseDN: "",
              ADGroupSearchFilter: "",
              ADUserDNs: [""],
              ADLookupBindDN: "",
              ADLookupBindPassword: "",
              ADUserDNSearchBaseDN: "",
              ADUserDNSearchFilter: "",
              ADServerStartTLS: false,
            },
            security: {
              enableAutoCert: true,
              enableCustomCerts: false,
              enableTLS: true,
            },
            encryption: {
              enableEncryption: false,
              encryptionType: "vault",
              gemaltoEndpoint: "",
              gemaltoToken: "",
              gemaltoDomain: "",
              gemaltoRetry: "0",
              awsEndpoint: "",
              awsRegion: "",
              awsKMSKey: "",
              awsAccessKey: "",
              awsSecretKey: "",
              awsToken: "",
              vaultEndpoint: "",
              vaultEngine: "",
              vaultNamespace: "",
              vaultPrefix: "",
              vaultAppRoleEngine: "",
              vaultId: "",
              vaultSecret: "",
              vaultRetry: "0",
              vaultPing: "0",
              azureEndpoint: "",
              azureTenantID: "",
              azureClientID: "",
              azureClientSecret: "",
              gcpProjectID: "",
              gcpEndpoint: "",
              gcpClientEmail: "",
              gcpClientID: "",
              gcpPrivateKeyID: "",
              gcpPrivateKey: "",
              enableCustomCertsForKES: false,
              replicas: "1",
              kesSecurityContext: {
                runAsUser: "1000",
                runAsGroup: "1000",
                fsGroup: "1000",
                runAsNonRoot: true,
              },
            },
            tenantSize: {
              volumeSize: "1024",
              sizeFactor: "Gi",
              drivesPerServer: "4",
              nodes: "4",
              memoryNode: "2",
              ecParity: "",
              ecParityChoices: [],
              cleanECChoices: [],
              untouchedECField: true,
              distribution: {
                error: "",
                nodes: 0,
                persistentVolumes: 0,
                disks: 0,
              },
              ecParityCalc: {
                error: 0,
                defaultEC: "",
                erasureCodeSet: 0,
                maxEC: "",
                rawCapacity: "0",
                storageFactors: [],
              },
              limitSize: {},
              cpuToUse: "0",
              // resource request
              resourcesSpecifyLimit: false,
              resourcesCPURequestError: "",
              resourcesCPURequest: "",
              resourcesCPULimitError: "",
              resourcesCPULimit: "",
              resourcesMemoryRequestError: "",
              resourcesMemoryRequest: "",
              resourcesMemoryLimitError: "",
              resourcesMemoryLimit: "",
              resourcesSize: {
                error: "",
                memoryRequest: 0,
                memoryLimit: 0,
                cpuRequest: 0,
                cpuLimit: 0,
              },
              maxAllocatableResources: {
                min_allocatable_mem: 0,
                min_allocatable_cpu: 0,
                cpu_priority: {
                  max_allocatable_cpu: 0,
                  max_allocatable_mem: 0,
                },
                mem_priority: {
                  max_allocatable_cpu: 0,
                  max_allocatable_mem: 0,
                },
              },
              maxCPUsUse: "0",
              maxMemorySize: "0",
              integrationSelection: {
                driveSize: { driveSize: "0", sizeUnit: "B" },
                CPU: 0,
                typeSelection: "",
                memory: 0,
                drivesPerServer: 0,
                storageClass: "",
              },
            },
            affinity: {
              nodeSelectorLabels: "",
              podAffinity: "default",
              withPodAntiAffinity: true,
            },
          },
          certificates: {
            minioCertificates: [
              {
                id: Date.now().toString(),
                key: "",
                cert: "",
                encoded_key: "",
                encoded_cert: "",
              },
            ],
            caCertificates: [
              {
                id: Date.now().toString(),
                key: "",
                cert: "",
                encoded_key: "",
                encoded_cert: "",
              },
            ],
            consoleCaCertificates: [
              {
                id: Date.now().toString(),
                key: "",
                cert: "",
                encoded_key: "",
                encoded_cert: "",
              },
            ],
            consoleCertificate: {
              id: "console_cert_pair",
              key: "",
              cert: "",
              encoded_key: "",
              encoded_cert: "",
            },
            serverCertificate: {
              id: "encryptionServerCertificate",
              key: "",
              cert: "",
              encoded_key: "",
              encoded_cert: "",
            },
            clientCertificate: {
              id: "encryptionClientCertificate",
              key: "",
              cert: "",
              encoded_key: "",
              encoded_cert: "",
            },
            vaultCertificate: {
              id: "encryptionVaultCertificate",
              key: "",
              cert: "",
              encoded_key: "",
              encoded_cert: "",
            },
            vaultCA: {
              id: "encryptionVaultCA",
              key: "",
              cert: "",
              encoded_key: "",
              encoded_cert: "",
            },
            gemaltoCA: {
              id: "encryptionGemaltoCA",
              key: "",
              cert: "",
              encoded_key: "",
              encoded_cert: "",
            },
          },
          nodeSelectorPairs: [{ key: "", value: "" }],
          tolerations: [
            {
              key: "",
              tolerationSeconds: { seconds: 0 },
              value: "",
              effect: ITolerationEffect.NoSchedule,
              operator: ITolerationOperator.Equal,
            },
          ],
        },
      };
    case ADD_TENANT_SET_KEY_PAIR_VALUE:
      return {
        ...state,
        createTenant: {
          ...state.createTenant,
          nodeSelectorPairs: action.newArray,
        },
      };
    case TENANT_DETAILS_SET_LOADING:
      const tenantDetails = {
        ...state.tenantDetails,
        loadingTenant: action.state,
      };
      return {
        ...state,
        tenantDetails: {
          ...tenantDetails,
        },
      };
    case TENANT_DETAILS_SET_CURRENT_TENANT:
      const currentTenant = {
        ...state.tenantDetails,
        currentTenant: action.name,
        currentNamespace: action.namespace,
      };
      return {
        ...state,
        tenantDetails: {
          ...currentTenant,
        },
      };
    case TENANT_DETAILS_SET_TENANT:
      let tenantData = null;
      if (action.tenant) {
        tenantData = { tenantInfo: { ...action.tenant } };
      }
      const setTenant = { ...state.tenantDetails, ...tenantData };
      return {
        ...state,
        tenantDetails: {
          ...setTenant,
        },
      };
    case TENANT_DETAILS_SET_TAB:
      const newTab = { ...state.tenantDetails, currentTab: action.tab };
      return {
        ...state,
        tenantDetails: {
          ...newTab,
        },
      };
    case ADD_TENANT_SET_TOLERATION_VALUE:
      const newSetTolerationValue = [...state.createTenant.tolerations];

      newSetTolerationValue[action.index] = action.toleration;

      return {
        ...state,
        createTenant: {
          ...state.createTenant,
          tolerations: [...newSetTolerationValue],
        },
      };
    case ADD_TENANT_ADD_NEW_TOLERATION:
      const newTolerationArray = [
        ...state.createTenant.tolerations,
        {
          key: "",
          tolerationSeconds: { seconds: 0 },
          value: "",
          effect: ITolerationEffect.NoSchedule,
          operator: ITolerationOperator.Equal,
        },
      ];
      return {
        ...state,
        createTenant: {
          ...state.createTenant,
          tolerations: [...newTolerationArray],
        },
      };
    case ADD_TENANT_REMOVE_TOLERATION_ROW:
      const cleanTolerationArray = state.createTenant.tolerations.filter(
        (_, index) => index !== action.index
      );

      return {
        ...state,
        createTenant: {
          ...state.createTenant,
          tolerations: [...cleanTolerationArray],
        },
      };
    case ADD_TENANT_ADD_MINIO_DOMAIN:
      const newDomainsList = [
        ...state.createTenant.fields.configure.minioDomains,
      ];
      newDomainsList.push("");
      return {
        ...state,
        createTenant: {
          ...state.createTenant,
          fields: {
            ...state.createTenant.fields,
            configure: {
              ...state.createTenant.fields.configure,
              minioDomains: newDomainsList,
            },
          },
        },
      };
    case ADD_TENANT_DELETE_MINIO_DOMAIN:
      const filteredDomains =
        state.createTenant.fields.configure.minioDomains.filter(
          (_, index) => index !== action.removeID
        );

      return {
        ...state,
        createTenant: {
          ...state.createTenant,
          fields: {
            ...state.createTenant.fields,
            configure: {
              ...state.createTenant.fields.configure,
              minioDomains: filteredDomains,
            },
          },
        },
      };

    case ADD_POOL_SET_LOADING:
      return {
        ...state,
        addPool: {
          ...state.addPool,
          addPoolLoading: action.state,
        },
      };
    case ADD_POOL_SET_VALUE:
      if (has(newState.addPool.fields, `${action.page}.${action.field}`)) {
        const originPageNameItems = get(
          newState.addPool.fields,
          `${action.page}`,
          {}
        );

        let newValue: any = {};
        newValue[action.field] = action.value;

        const joinValue = { ...originPageNameItems, ...newValue };

        newState.addPool.fields[action.page] = { ...joinValue };

        return { ...newState };
      }

      return state;
    case ADD_POOL_SET_PAGE_VALID:
      const nvPoolPV = [...state.addPool.validPages];

      if (action.status) {
        if (!nvPoolPV.includes(action.page)) {
          nvPoolPV.push(action.page);

          newState.addPool.validPages = [...nvPoolPV];
        }
      } else {
        const newSetOfPages = nvPoolPV.filter((elm) => elm !== action.page);

        newState.addPool.validPages = [...newSetOfPages];
      }

      return { ...newState };
    case ADD_POOL_SET_POOL_STORAGE_CLASSES:
      return {
        ...newState,
        addPool: {
          ...newState.addPool,
          storageClasses: action.storageClasses,
        },
      };
    case ADD_POOL_SET_TOLERATION_VALUE:
      const newPoolTolerationValue = [...state.addPool.fields.tolerations];

      newPoolTolerationValue[action.index] = action.toleration;

      return {
        ...state,
        addPool: {
          ...state.addPool,
          fields: {
            ...state.addPool.fields,
            tolerations: [...newPoolTolerationValue],
          },
        },
      };
    case ADD_POOL_ADD_NEW_TOLERATION:
      const newPoolTolerationArray = [
        ...state.addPool.fields.tolerations,
        {
          key: "",
          tolerationSeconds: { seconds: 0 },
          value: "",
          effect: ITolerationEffect.NoSchedule,
          operator: ITolerationOperator.Equal,
        },
      ];
      return {
        ...state,
        addPool: {
          ...state.addPool,
          fields: {
            ...state.addPool.fields,
            tolerations: [...newPoolTolerationArray],
          },
        },
      };
    case ADD_POOL_REMOVE_TOLERATION_ROW:
      const cleanPoolTolerationArray = state.addPool.fields.tolerations.filter(
        (_, index) => index !== action.index
      );

      return {
        ...state,
        addPool: {
          ...state.addPool,
          fields: {
            ...state.addPool.fields,
            tolerations: [...cleanPoolTolerationArray],
          },
        },
      };
    case ADD_POOL_SET_KEY_PAIR_VALUE:
      return {
        ...state,
        addPool: {
          ...state.addPool,
          fields: {
            ...state.addPool.fields,
            nodeSelectorPairs: action.newArray,
          },
        },
      };
    case ADD_POOL_RESET_FORM:
      return {
        ...state,
        addPool: {
          addPoolLoading: false,
          validPages: ["affinity", "configure"],
          storageClasses: [],
          limitSize: {},
          fields: {
            setup: {
              numberOfNodes: 0,
              storageClass: "",
              volumeSize: 0,
              volumesPerServer: 0,
            },
            affinity: {
              nodeSelectorLabels: "",
              podAffinity: "default",
              withPodAntiAffinity: true,
            },
            configuration: {
              securityContextEnabled: false,
              securityContext: {
                runAsUser: "1000",
                runAsGroup: "1000",
                fsGroup: "1000",
                runAsNonRoot: true,
              },
            },
            nodeSelectorPairs: [{ key: "", value: "" }],
            tolerations: [
              {
                key: "",
                tolerationSeconds: { seconds: 0 },
                value: "",
                effect: ITolerationEffect.NoSchedule,
                operator: ITolerationOperator.Equal,
              },
            ],
          },
        },
      };
    case POOL_DETAILS_SET_SELECTED_POOL:
      return {
        ...state,
        tenantDetails: {
          ...state.tenantDetails,
          selectedPool: action.pool,
        },
      };
    case POOL_DETAILS_SET_OPEN_DETAILS:
      return {
        ...state,
        tenantDetails: {
          ...state.tenantDetails,
          poolDetailsOpen: action.state,
        },
      };
    case EDIT_POOL_SET_INITIAL_INFO:
      let podAffinity: "default" | "nodeSelector" | "none" = "none";
      let withPodAntiAffinity = false;
      let nodeSelectorLabels = "";
      let tolerations: ITolerationModel[] = [
        {
          key: "",
          tolerationSeconds: { seconds: 0 },
          value: "",
          effect: ITolerationEffect.NoSchedule,
          operator: ITolerationOperator.Equal,
        },
      ];
      let nodeSelectorPairs: LabelKeyPair[] = [{ key: "", value: "" }];

      if (action.pool.affinity?.nodeAffinity) {
        podAffinity = "nodeSelector";
        if (action.pool.affinity?.podAntiAffinity) {
          withPodAntiAffinity = true;
        }
      } else if (action.pool.affinity?.podAntiAffinity) {
        podAffinity = "default";
      }

      if (action.pool.affinity?.nodeAffinity) {
        let labelItems: string[] = [];
        nodeSelectorPairs = [];

        action.pool.affinity.nodeAffinity.requiredDuringSchedulingIgnoredDuringExecution.nodeSelectorTerms.forEach(
          (labels) => {
            labels.matchExpressions.forEach((exp) => {
              labelItems.push(`${exp.key}=${exp.values.join(",")}`);
              nodeSelectorPairs.push({
                key: exp.key,
                value: exp.values.join(", "),
              });
            });
          }
        );
        nodeSelectorLabels = labelItems.join("&");
      }

      let securityContextOption = false;

      if (action.pool.securityContext) {
        securityContextOption =
          !!action.pool.securityContext.runAsUser ||
          !!action.pool.securityContext.runAsGroup ||
          !!action.pool.securityContext.fsGroup;
      }

      if (action.pool.tolerations) {
        tolerations = action.pool.tolerations?.map((toleration) => {
          const tolerationItem: ITolerationModel = {
            key: toleration.key,
            tolerationSeconds: toleration.tolerationSeconds,
            value: toleration.value,
            effect: toleration.effect,
            operator: toleration.operator,
          };
          return tolerationItem;
        });
      }

      const volSizeVars = action.pool.volume_configuration.size / 1073741824;

      const newPoolInfoFields: IEditPoolFields = {
        setup: {
          numberOfNodes: action.pool.servers,
          storageClass: action.pool.volume_configuration.storage_class_name,
          volumeSize: volSizeVars,
          volumesPerServer: action.pool.volumes_per_server,
        },
        configuration: {
          securityContextEnabled: securityContextOption,
          securityContext: {
            runAsUser: action.pool.securityContext?.runAsUser || "",
            runAsGroup: action.pool.securityContext?.runAsGroup || "",
            fsGroup: action.pool.securityContext?.fsGroup || "",
            runAsNonRoot: !!action.pool.securityContext?.runAsNonRoot,
          },
        },
        affinity: {
          podAffinity,
          withPodAntiAffinity,
          nodeSelectorLabels,
        },
        tolerations,
        nodeSelectorPairs,
      };

      return {
        ...state,
        editPool: {
          ...state.editPool,
          fields: {
            ...state.editPool.fields,
            ...newPoolInfoFields,
          },
        },
      };

    case EDIT_POOL_SET_LOADING:
      return {
        ...state,
        editPool: {
          ...state.editPool,
          editPoolLoading: action.state,
        },
      };
    case EDIT_POOL_SET_VALUE:
      if (has(newState.editPool.fields, `${action.page}.${action.field}`)) {
        const originPageNameItems = get(
          newState.editPool.fields,
          `${action.page}`,
          {}
        );

        let newValue: any = {};
        newValue[action.field] = action.value;

        const joinValue = { ...originPageNameItems, ...newValue };

        newState.editPool.fields[action.page] = { ...joinValue };

        return { ...newState };
      }

      return state;
    case EDIT_POOL_SET_PAGE_VALID:
      const edPoolPV = [...state.editPool.validPages];

      if (action.status) {
        if (!edPoolPV.includes(action.page)) {
          edPoolPV.push(action.page);

          newState.editPool.validPages = [...edPoolPV];
        }
      } else {
        const newSetOfPages = edPoolPV.filter((elm) => elm !== action.page);

        newState.editPool.validPages = [...newSetOfPages];
      }

      return { ...newState };
    case EDIT_POOL_SET_POOL_STORAGE_CLASSES:
      return {
        ...newState,
        editPool: {
          ...newState.editPool,
          storageClasses: action.storageClasses,
        },
      };
    case EDIT_POOL_SET_TOLERATION_VALUE:
      const editPoolTolerationValue = [...state.editPool.fields.tolerations];

      editPoolTolerationValue[action.index] = action.toleration;

      return {
        ...state,
        editPool: {
          ...state.editPool,
          fields: {
            ...state.editPool.fields,
            tolerations: [...editPoolTolerationValue],
          },
        },
      };
    case EDIT_POOL_ADD_NEW_TOLERATION:
      const editPoolTolerationArray = [
        ...state.editPool.fields.tolerations,
        {
          key: "",
          tolerationSeconds: { seconds: 0 },
          value: "",
          effect: ITolerationEffect.NoSchedule,
          operator: ITolerationOperator.Equal,
        },
      ];
      return {
        ...state,
        editPool: {
          ...state.editPool,
          fields: {
            ...state.editPool.fields,
            tolerations: [...editPoolTolerationArray],
          },
        },
      };
    case EDIT_POOL_REMOVE_TOLERATION_ROW:
      const removePoolTolerationArray =
        state.editPool.fields.tolerations.filter(
          (_, index) => index !== action.index
        );

      return {
        ...state,
        editPool: {
          ...state.editPool,
          fields: {
            ...state.editPool.fields,
            tolerations: [...removePoolTolerationArray],
          },
        },
      };
    case EDIT_POOL_SET_KEY_PAIR_VALUE:
      return {
        ...state,
        editPool: {
          ...state.editPool,
          fields: {
            ...state.editPool.fields,
            nodeSelectorPairs: action.newArray,
          },
        },
      };
    case EDIT_POOL_RESET_FORM:
      return {
        ...state,
        editPool: {
          editPoolLoading: false,
          validPages: ["setup", "affinity", "configure"],
          storageClasses: [],
          limitSize: {},
          fields: {
            setup: {
              numberOfNodes: 0,
              storageClass: "",
              volumeSize: 0,
              volumesPerServer: 0,
            },
            affinity: {
              nodeSelectorLabels: "",
              podAffinity: "default",
              withPodAntiAffinity: true,
            },
            configuration: {
              securityContextEnabled: false,
              securityContext: {
                runAsUser: "1000",
                runAsGroup: "1000",
                fsGroup: "1000",
                runAsNonRoot: true,
              },
            },
            nodeSelectorPairs: [{ key: "", value: "" }],
            tolerations: [
              {
                key: "",
                tolerationSeconds: { seconds: 0 },
                value: "",
                effect: ITolerationEffect.NoSchedule,
                operator: ITolerationOperator.Equal,
              },
            ],
          },
        },
      };

    default:
      return state;
  }
}
