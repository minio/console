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

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  IAddPoolFields,
  IEditPoolFields,
  IFieldStore,
  ITenantState,
  LabelKeyPair,
} from "./types";
import { getRandomString } from "./utils";
import {
  ITolerationEffect,
  ITolerationModel,
  ITolerationOperator,
} from "../../../common/types";
import {
  IMkEnvs,
  IntegrationConfiguration,
  mkPanelConfigurations,
  resourcesConfigurations,
} from "./AddTenant/Steps/TenantResources/utils";
import get from "lodash/get";
import { getBytesNumber } from "../../../common/utils";
import { has } from "lodash";
import { KeyPair, Opts } from "./ListTenants/utils";
import { IPool, ITenant } from "./ListTenants/types";

export interface FileValue {
  fileName: string;
  value: string;
}

export interface KeyFileValue {
  key: string;
  fileName: string;
  value: string;
}

export interface CertificateFile {
  id: string;
  key: string;
  fileName: string;
  value: string;
}

export interface PageFieldValue {
  page: keyof IEditPoolFields;
  field: string;
  value: any;
}

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

export const tenantSlice = createSlice({
  name: "tenant",
  initialState,
  reducers: {
    setTenantWizardPage: (state, action: PayloadAction<number>) => {
      state.createTenant.page = action.payload;
    },
    updateAddField: (
      state,
      action: PayloadAction<{
        pageName: keyof IFieldStore;
        field: string;
        value: any;
      }>
    ) => {
      if (
        has(
          state.createTenant.fields,
          `${action.payload.pageName}.${action.payload.field}`
        )
      ) {
        const originPageNameItems = get(
          state.createTenant.fields,
          `${action.payload.pageName}`,
          {}
        );

        let newValue: any = {};
        newValue[action.payload.field] = action.payload.value;

        const joinValue = { ...originPageNameItems, ...newValue };

        state.createTenant.fields[action.payload.pageName] = { ...joinValue };
      }
      return state;
    },
    isPageValid: (
      state,
      action: PayloadAction<{
        pageName: keyof IFieldStore;
        valid: boolean;
      }>
    ) => {
      let originValidPages = state.createTenant.validPages;

      if (action.payload.valid) {
        if (!originValidPages.includes(action.payload.pageName)) {
          originValidPages.push(action.payload.pageName);

          state.createTenant.validPages = [...originValidPages];
        }
      } else {
        const newSetOfPages = originValidPages.filter(
          (elm) => elm !== action.payload.pageName
        );

        state.createTenant.validPages = [...newSetOfPages];
      }
    },
    setStorageClassesList: (state, action: PayloadAction<Opts[]>) => {
      state.createTenant.storageClasses = action.payload;
    },
    setStorageType: (
      state,
      action: PayloadAction<{
        storageType: string;
        features?: string[];
      }>
    ) => {
      let size = state.createTenant.fields.tenantSize.volumeSize;
      let sizeFactor = state.createTenant.fields.tenantSize.sizeFactor;
      let volumeSize = state.createTenant.fields.tenantSize.volumeSize;
      let selectedStorageClass =
        state.createTenant.fields.nameTenant.selectedStorageClass;
      // for the aws marketplace integration we have some constraints
      // on the minimum cluster size

      if (
        action.payload.features !== undefined &&
        action.payload.features.length > 0
      ) {
        let formToRender = IMkEnvs.default;
        const possibleVariables = Object.keys(resourcesConfigurations);

        possibleVariables.forEach((element) => {
          if (
            action.payload.features !== undefined &&
            action.payload.features.includes(element)
          ) {
            formToRender = get(
              resourcesConfigurations,
              element,
              IMkEnvs.default
            );
          }
        });

        // if the size is less than the minimum for the selected storage type
        // we will override the current total storage entered amount with the minimum
        if (formToRender !== undefined) {
          const setConfigs = mkPanelConfigurations[formToRender];
          const keyCount = Object.keys(setConfigs).length;

          //Configuration is filled
          if (keyCount > 0) {
            const configs: IntegrationConfiguration[] = get(
              setConfigs,
              "configurations",
              []
            );
            const mainSelection = configs.find(
              (item) => item.typeSelection === action.payload.storageType
            );
            if (mainSelection !== undefined) {
              // store the selected storage class
              selectedStorageClass = mainSelection.storageClass;
              if (mainSelection.minimumVolumeSize) {
                const minimumSize = getBytesNumber(
                  mainSelection.minimumVolumeSize?.driveSize,
                  mainSelection.minimumVolumeSize?.sizeUnit,
                  true
                );

                const drivesPerServer =
                  state.createTenant.fields.tenantSize.drivesPerServer;
                const nodes =
                  state.createTenant.fields.tenantSize.drivesPerServer;

                const currentSize = getBytesNumber(
                  size.toString(),
                  sizeFactor,
                  true
                );
                if (currentSize < minimumSize) {
                  // size = minimumSize.toString(10);
                  const totalSize =
                    parseInt(nodes) *
                    parseInt(drivesPerServer) *
                    parseInt(mainSelection.minimumVolumeSize.driveSize);

                  volumeSize = totalSize.toString(10);
                  sizeFactor = mainSelection.minimumVolumeSize.sizeUnit;
                }
              }
            }
          }
        }
      }

      state.createTenant.fields.nameTenant.selectedStorageType =
        action.payload.storageType;
      state.createTenant.fields.nameTenant.selectedStorageClass =
        selectedStorageClass;

      // left intentionally here since the original reducer had it
      // state.createTenant.fields.tenantSize.size = size;
      state.createTenant.fields.tenantSize.volumeSize = volumeSize;
      state.createTenant.fields.tenantSize.sizeFactor = sizeFactor;
    },
    setLimitSize: (state, action: PayloadAction<any>) => {
      state.createTenant.limitSize = action.payload;
    },
    addKeyPair: (state) => {
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
      state.createTenant.certificates.minioCertificates = [...minioCerts];
    },
    addFileToKeyPair: (state, action: PayloadAction<CertificateFile>) => {
      const minioCertificates =
        state.createTenant.certificates.minioCertificates;

      const NCertList = minioCertificates.map((item: KeyPair) => {
        if (item.id === action.payload.id) {
          return {
            ...item,
            [action.payload.key]: action.payload.fileName,
            [`encoded_${action.payload.key}`]: action.payload.value,
          };
        }
        return item;
      });
      state.createTenant.certificates.minioCertificates = [...NCertList];
    },
    deleteKeyPair: (state, action: PayloadAction<string>) => {
      const minioCertsList = state.createTenant.certificates.minioCertificates;

      if (minioCertsList.length > 1) {
        state.createTenant.certificates.minioCertificates =
          minioCertsList.filter((item: KeyPair) => item.id !== action.payload);
      }
    },
    addCaCertificate: (state) => {
      state.createTenant.certificates.caCertificates.push({
        id: Date.now().toString(),
        key: "",
        cert: "",
        encoded_key: "",
        encoded_cert: "",
      });
    },
    addFileToCaCertificates: (
      state,
      action: PayloadAction<CertificateFile>
    ) => {
      const caCertificates = state.createTenant.certificates.caCertificates;

      const NACList = caCertificates.map((item: KeyPair) => {
        if (item.id === action.payload.id) {
          return {
            ...item,
            [action.payload.key]: action.payload.fileName,
            [`encoded_${action.payload.key}`]: action.payload.value,
          };
        }
        return item;
      });
      state.createTenant.certificates.caCertificates = NACList;
    },
    deleteCaCertificate: (state, action: PayloadAction<string>) => {
      const CACertsList = state.createTenant.certificates.caCertificates;
      if (CACertsList.length > 1) {
        const cleanCaCertsList = CACertsList.filter(
          (item: KeyPair) => item.id !== action.payload
        );
        state.createTenant.certificates.caCertificates = cleanCaCertsList;
      }
    },
    addConsoleCertificate: (state, action: PayloadAction<CertificateFile>) => {
      const consoleCert = state.createTenant.certificates.consoleCertificate;
      state.createTenant.certificates.consoleCertificate = {
        ...consoleCert,
        [action.payload.key]: action.payload.fileName,
        [`encoded_${action.payload.key}`]: action.payload.value,
      };
    },
    addConsoleCaCertificate: (state) => {
      state.createTenant.certificates.consoleCaCertificates.push({
        id: Date.now().toString(),
        key: "",
        cert: "",
        encoded_key: "",
        encoded_cert: "",
      });
    },
    addFileToConsoleCaCertificates: (
      state,
      action: PayloadAction<CertificateFile>
    ) => {
      const consoleCaCertificates =
        state.createTenant.certificates.consoleCaCertificates;

      state.createTenant.certificates.consoleCaCertificates =
        consoleCaCertificates.map((item: KeyPair) => {
          if (item.id === action.payload.id) {
            return {
              ...item,
              [action.payload.key]: action.payload.fileName,
              [`encoded_${action.payload.key}`]: action.payload.value,
            };
          }
          return item;
        });
    },
    deleteConsoleCaCertificate: (state, action: PayloadAction<string>) => {
      const consoleCACertsList =
        state.createTenant.certificates.consoleCaCertificates;
      if (consoleCACertsList.length > 1) {
        state.createTenant.certificates.consoleCaCertificates =
          consoleCACertsList.filter(
            (item: KeyPair) => item.id !== action.payload
          );
      }
    },
    addFileServerCert: (state, action: PayloadAction<KeyFileValue>) => {
      const encServerCert = state.createTenant.certificates.serverCertificate;

      state.createTenant.certificates.serverCertificate = {
        ...encServerCert,
        [action.payload.key]: action.payload.fileName,
        [`encoded_${action.payload.key}`]: action.payload.value,
      };
    },
    addFileClientCert: (state, action: PayloadAction<KeyFileValue>) => {
      const encClientCert = state.createTenant.certificates.clientCertificate;

      state.createTenant.certificates.clientCertificate = {
        ...encClientCert,
        [action.payload.key]: action.payload.fileName,
        [`encoded_${action.payload.key}`]: action.payload.value,
      };
    },
    addFileVaultCert: (state, action: PayloadAction<KeyFileValue>) => {
      const encVaultCert = state.createTenant.certificates.vaultCertificate;

      state.createTenant.certificates.vaultCertificate = {
        ...encVaultCert,
        [action.payload.key]: action.payload.fileName,
        [`encoded_${action.payload.key}`]: action.payload.value,
      };
    },
    addFileVaultCa: (state, action: PayloadAction<FileValue>) => {
      const encVaultCA = state.createTenant.certificates.vaultCA;

      state.createTenant.certificates.vaultCA = {
        ...encVaultCA,
        cert: action.payload.fileName,
        encoded_cert: action.payload.value,
      };
    },
    addFileGemaltoCa: (state, action: PayloadAction<FileValue>) => {
      const encGemaltoCA = state.createTenant.certificates.gemaltoCA;

      state.createTenant.certificates.gemaltoCA = {
        ...encGemaltoCA,
        cert: action.payload.fileName,
        encoded_cert: action.payload.value,
      };
    },
    resetAddTenantForm: (state) => {
      state.createTenant = {
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
      };
    },
    setKeyValuePairs: (state, action: PayloadAction<LabelKeyPair[]>) => {
      state.createTenant.nodeSelectorPairs = action.payload;
    },
    setTenantDetailsLoad: (state, action: PayloadAction<boolean>) => {
      state.tenantDetails.loadingTenant = action.payload;
    },
    setTenantName: (
      state,
      action: PayloadAction<{
        name: string;
        namespace: string;
      }>
    ) => {
      state.tenantDetails.currentTenant = action.payload.name;
      state.tenantDetails.currentNamespace = action.payload.namespace;
    },
    setTenantInfo: (state, action: PayloadAction<ITenant | null>) => {
      if (action.payload) {
        state.tenantDetails.tenantInfo = action.payload;
      }
    },
    setTenantTab: (state, action: PayloadAction<string>) => {
      state.tenantDetails.currentTab = action.payload;
    },
    setTolerationInfo: (
      state,
      action: PayloadAction<{
        index: number;
        tolerationValue: ITolerationModel;
      }>
    ) => {
      state.createTenant.tolerations[action.payload.index] =
        action.payload.tolerationValue;
    },
    addNewToleration: (state) => {
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
    },
    removeToleration: (state, action: PayloadAction<number>) => {
      state.createTenant.tolerations = state.createTenant.tolerations.filter(
        (_, index) => index !== action.payload
      );
    },
    addNewMinIODomain: (state) => {
      state.createTenant.fields.configure.minioDomains.push("");
    },
    removeMinIODomain: (state, action: PayloadAction<number>) => {
      state.createTenant.fields.configure.minioDomains =
        state.createTenant.fields.configure.minioDomains.filter(
          (_, index) => index !== action.payload
        );
    },
    setPoolLoading: (state, action: PayloadAction<boolean>) => {
      state.addPool.addPoolLoading = action.payload;
    },
    setPoolField: (
      state,
      action: PayloadAction<{
        page: keyof IAddPoolFields;
        field: string;
        value: any;
      }>
    ) => {
      if (
        has(
          state.addPool.fields,
          `${action.payload.page}.${action.payload.field}`
        )
      ) {
        const originPageNameItems = get(
          state.addPool.fields,
          `${action.payload.page}`,
          {}
        );

        let newValue: any = {};
        newValue[action.payload.field] = action.payload.value;

        state.addPool.fields[action.payload.page] = {
          ...originPageNameItems,
          ...newValue,
        };
      }
    },
    isPoolPageValid: (
      state,
      action: PayloadAction<{
        page: string;
        status: boolean;
      }>
    ) => {
      if (action.payload.status) {
        if (!state.addPool.validPages.includes(action.payload.page)) {
          state.addPool.validPages.push(action.payload.page);
        }
      } else {
        state.addPool.validPages = state.addPool.validPages.filter(
          (elm) => elm !== action.payload.page
        );
      }
    },
    setPoolStorageClasses: (state, action: PayloadAction<Opts[]>) => {
      state.addPool.storageClasses = action.payload;
    },
    setPoolTolerationInfo: (
      state,
      action: PayloadAction<{
        index: number;
        tolerationValue: ITolerationModel;
      }>
    ) => {
      state.addPool.fields.tolerations[action.payload.index] =
        action.payload.tolerationValue;
    },
    addNewPoolToleration: (state) => {
      state.addPool.fields.tolerations.push({
        key: "",
        tolerationSeconds: { seconds: 0 },
        value: "",
        effect: ITolerationEffect.NoSchedule,
        operator: ITolerationOperator.Equal,
      });
    },
    removePoolToleration: (state, action: PayloadAction<number>) => {
      state.addPool.fields.tolerations =
        state.addPool.fields.tolerations.filter(
          (_, index) => index !== action.payload
        );
    },
    setPoolKeyValuePairs: (state, action: PayloadAction<LabelKeyPair[]>) => {
      state.addPool.fields.nodeSelectorPairs = action.payload;
    },
    resetPoolForm: (state) => {
      state.addPool = {
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
      };
    },
    setSelectedPool: (state, action: PayloadAction<string | null>) => {
      state.tenantDetails.selectedPool = action.payload;
    },
    setOpenPoolDetails: (state, action: PayloadAction<boolean>) => {
      state.tenantDetails.poolDetailsOpen = action.payload;
    },
    setInitialPoolDetails: (state, action: PayloadAction<IPool>) => {
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

      if (action.payload.affinity?.nodeAffinity) {
        podAffinity = "nodeSelector";
        if (action.payload.affinity?.podAntiAffinity) {
          withPodAntiAffinity = true;
        }
      } else if (action.payload.affinity?.podAntiAffinity) {
        podAffinity = "default";
      }

      if (action.payload.affinity?.nodeAffinity) {
        let labelItems: string[] = [];
        nodeSelectorPairs = [];

        action.payload.affinity.nodeAffinity.requiredDuringSchedulingIgnoredDuringExecution.nodeSelectorTerms.forEach(
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

      if (action.payload.securityContext) {
        securityContextOption =
          !!action.payload.securityContext.runAsUser ||
          !!action.payload.securityContext.runAsGroup ||
          !!action.payload.securityContext.fsGroup;
      }

      if (action.payload.tolerations) {
        tolerations = action.payload.tolerations?.map((toleration) => {
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

      const volSizeVars = action.payload.volume_configuration.size / 1073741824;

      const newPoolInfoFields: IEditPoolFields = {
        setup: {
          numberOfNodes: action.payload.servers,
          storageClass: action.payload.volume_configuration.storage_class_name,
          volumeSize: volSizeVars,
          volumesPerServer: action.payload.volumes_per_server,
        },
        configuration: {
          securityContextEnabled: securityContextOption,
          securityContext: {
            runAsUser: action.payload.securityContext?.runAsUser || "",
            runAsGroup: action.payload.securityContext?.runAsGroup || "",
            fsGroup: action.payload.securityContext?.fsGroup || "",
            runAsNonRoot: !!action.payload.securityContext?.runAsNonRoot,
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

      state.editPool.fields = {
        ...state.editPool.fields,
        ...newPoolInfoFields,
      };
    },
    setEditPoolLoading: (state, action: PayloadAction<boolean>) => {
      state.editPool.editPoolLoading = action.payload;
    },
    setEditPoolField: (state, action: PayloadAction<PageFieldValue>) => {
      if (
        has(
          state.editPool.fields,
          `${action.payload.page}.${action.payload.field}`
        )
      ) {
        const originPageNameItems = get(
          state.editPool.fields,
          `${action.payload.page}`,
          {}
        );

        let newValue: any = {};
        newValue[action.payload.field] = action.payload.value;

        const joinValue = { ...originPageNameItems, ...newValue };

        state.editPool.fields[action.payload.page] = { ...joinValue };
      }
    },
    isEditPoolPageValid: (
      state,
      action: PayloadAction<{
        page: string;
        status: boolean;
      }>
    ) => {
      const edPoolPV = [...state.editPool.validPages];

      if (action.payload.status) {
        if (!edPoolPV.includes(action.payload.page)) {
          edPoolPV.push(action.payload.page);

          state.editPool.validPages = [...edPoolPV];
        }
      } else {
        const newSetOfPages = edPoolPV.filter(
          (elm) => elm !== action.payload.page
        );

        state.editPool.validPages = [...newSetOfPages];
      }
    },
    setEditPoolStorageClasses: (state, action: PayloadAction<Opts[]>) => {
      state.editPool.storageClasses = action.payload;
    },
    setEditPoolTolerationInfo: (
      state,
      action: PayloadAction<{
        index: number;
        tolerationValue: ITolerationModel;
      }>
    ) => {
      const editPoolTolerationValue = [...state.editPool.fields.tolerations];

      editPoolTolerationValue[action.payload.index] =
        action.payload.tolerationValue;
      state.editPool.fields.tolerations = editPoolTolerationValue;
    },
    addNewEditPoolToleration: (state) => {
      state.editPool.fields.tolerations.push({
        key: "",
        tolerationSeconds: { seconds: 0 },
        value: "",
        effect: ITolerationEffect.NoSchedule,
        operator: ITolerationOperator.Equal,
      });
    },
    removeEditPoolToleration: (state, action: PayloadAction<number>) => {
      state.editPool.fields.tolerations =
        state.editPool.fields.tolerations.filter(
          (_, index) => index !== action.payload
        );
    },
    setEditPoolKeyValuePairs: (
      state,
      action: PayloadAction<LabelKeyPair[]>
    ) => {
      state.editPool.fields.nodeSelectorPairs = action.payload;
    },
    resetEditPoolForm: (state) => {
      state.editPool = {
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
      };
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  setTenantWizardPage,
  updateAddField,
  isPageValid,
  setStorageClassesList,
  setStorageType,
  setLimitSize,
  addCaCertificate,
  deleteCaCertificate,
  addFileToCaCertificates,
  addConsoleCaCertificate,
  deleteConsoleCaCertificate,
  addFileToConsoleCaCertificates,
  addKeyPair,
  deleteKeyPair,
  addFileToKeyPair,
  addConsoleCertificate,
  addFileServerCert,
  addFileClientCert,
  addFileVaultCert,
  addFileVaultCa,
  addFileGemaltoCa,
  resetAddTenantForm,
  setTenantDetailsLoad,
  setTenantName,
  setTenantInfo,
  setTenantTab,
  setKeyValuePairs,
  setTolerationInfo,
  addNewToleration,
  removeToleration,
  addNewMinIODomain,
  removeMinIODomain,
  setPoolLoading,
  resetPoolForm,
  setPoolField,
  isPoolPageValid,
  setPoolStorageClasses,
  setPoolTolerationInfo,
  addNewPoolToleration,
  removePoolToleration,
  setPoolKeyValuePairs,
  setSelectedPool,
  setOpenPoolDetails,
  setInitialPoolDetails,
  setEditPoolLoading,
  resetEditPoolForm,
  setEditPoolField,
  isEditPoolPageValid,
  setEditPoolStorageClasses,
  setEditPoolTolerationInfo,
  addNewEditPoolToleration,
  removeEditPoolToleration,
  setEditPoolKeyValuePairs,
} = tenantSlice.actions;

export default tenantSlice.reducer;

export const pfv = (
  page: keyof IEditPoolFields,
  field: string,
  value: any
): PageFieldValue => {
  return {
    page: page,
    field: field,
    value: value,
  };
};
