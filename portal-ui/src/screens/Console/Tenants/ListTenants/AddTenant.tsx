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

import React, { useCallback, useEffect, useMemo, useState } from "react";
import debounce from "lodash/debounce";
import get from "lodash/get";
import ModalWrapper from "../../Common/ModalWrapper/ModalWrapper";
import Grid from "@material-ui/core/Grid";
import InputBoxWrapper from "../../Common/FormComponents/InputBoxWrapper/InputBoxWrapper";
import { Button, LinearProgress, Typography } from "@material-ui/core";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";
import api from "../../../../common/api";
import { createStyles, Theme, withStyles } from "@material-ui/core/styles";
import { modalBasic } from "../../Common/FormComponents/common/styleLibrary";
import FormSwitchWrapper from "../../Common/FormComponents/FormSwitchWrapper/FormSwitchWrapper";
import SelectWrapper from "../../Common/FormComponents/SelectWrapper/SelectWrapper";
import {
  calculateDistribution,
  erasureCodeCalc,
  generatePoolName,
  getBytes,
  k8sfactorForDropdown,
  niceBytes,
  setMemoryResource,
} from "../../../../common/utils";
import {
  commonFormValidation,
  IValidation,
} from "../../../../utils/validationFunctions";
import GenericWizard from "../../Common/GenericWizard/GenericWizard";
import { IWizardElement } from "../../Common/GenericWizard/types";
import { NewServiceAccount } from "../../Common/CredentialsPrompt/types";
import RadioGroupSelector from "../../Common/FormComponents/RadioGroupSelector/RadioGroupSelector";
import FileSelector from "../../Common/FormComponents/FileSelector/FileSelector";
import {
  IAffinityModel,
  ICapacity,
  IErasureCodeCalc,
  ITenantCreator,
} from "../../../../common/types";
import {
  ecListTransform,
  getLimitSizes,
  IQuotaElement,
  IQuotas,
  Opts,
  KeyPair,
} from "./utils";
import { IMemorySize } from "./types";
import Divider from "@material-ui/core/Divider";
import { connect } from "react-redux";
import { setModalErrorSnackMessage } from "../../../../actions";

interface IAddTenantProps {
  open: boolean;
  closeModalAndRefresh: (
    reloadData: boolean,
    res: NewServiceAccount | null
  ) => any;
  setModalErrorSnackMessage: typeof setModalErrorSnackMessage;
  classes: any;
}

const styles = (theme: Theme) =>
  createStyles({
    buttonContainer: {
      textAlign: "right",
    },
    multiContainer: {
      display: "flex",
      alignItems: "center" as const,
      justifyContent: "flex-start" as const,
    },
    sizeFactorContainer: {
      marginLeft: 8,
      alignSelf: "flex-start" as const,
    },
    headerElement: {
      position: "sticky",
      top: 0,
      paddingTop: 5,
      marginBottom: 10,
      backgroundColor: "#fff",
      zIndex: 500,
    },
    tableTitle: {
      fontWeight: 700,
      width: "30%",
    },
    poolError: {
      color: "#dc1f2e",
      fontSize: "0.75rem",
      paddingLeft: 120,
    },
    error: {
      color: "#dc1f2e",
      fontSize: "0.75rem",
    },
    h3Section: {
      marginTop: 0,
    },
    descriptionText: {
      fontSize: 13,
      color: "#777777",
    },
    ...modalBasic,
  });

const AddTenant = ({
  open,
  closeModalAndRefresh,
  setModalErrorSnackMessage,
  classes,
}: IAddTenantProps) => {
  // Fields
  const [addSending, setAddSending] = useState<boolean>(false);
  const [tenantName, setTenantName] = useState<string>("");
  const [imageName, setImageName] = useState<string>("");
  const [volumeSize, setVolumeSize] = useState<string>("100");
  const [enableTLS, setEnableTLS] = useState<boolean>(true);
  const [enableAutoCert, setEnableAutoCert] = useState<boolean>(true);
  const [enableCustomCerts, setEnableCustomCerts] = useState<boolean>(false);
  const [
    enableCustomCertsForKES,
    setEnableCustomCertsForKES,
  ] = useState<boolean>(false);
  const [sizeFactor, setSizeFactor] = useState<string>("Gi");
  const [storageClasses, setStorageClassesList] = useState<Opts[]>([]);
  const [selectedStorageClass, setSelectedStorageClass] = useState<string>("");
  const [validationErrors, setValidationErrors] = useState<any>({});
  const [namespace, setNamespace] = useState<string>("");
  const [advancedMode, setAdvancedMode] = useState<boolean>(false);
  const [consoleImage, setConsoleImage] = useState<string>("");
  const [idpSelection, setIdpSelection] = useState<string>("Built-in");
  const [openIDURL, setOpenIDURL] = useState<string>("");
  const [openIDClientID, setOpenIDClientID] = useState<string>("");
  const [openIDSecretID, setOpenIDSecretID] = useState<string>("");
  const [ADURL, setADURL] = useState<string>("");
  const [ADSkipTLS, setADSkipTLS] = useState<boolean>(false);
  const [ADServerInsecure, setADServerInsecure] = useState<boolean>(false);
  const [ADUserNameFilter, setADUserNameFilter] = useState<string>("");
  const [ADGroupBaseDN, setADGroupBaseDN] = useState<string>("");
  const [ADGroupSearchFilter, setADGroupSearchFilter] = useState<string>("");
  const [ADNameAttribute, setADNameAttribute] = useState<string>("");
  const [enableEncryption, setEnableEncryption] = useState<boolean>(false);
  const [encryptionType, setEncryptionType] = useState<string>("vault");
  const [gemaltoEndpoint, setGemaltoEndpoint] = useState<string>("");
  const [gemaltoToken, setGemaltoToken] = useState<string>("");
  const [gemaltoDomain, setGemaltoDomain] = useState<string>("");
  const [gemaltoRetry, setGemaltoRetry] = useState<string>("0");
  const [awsEndpoint, setAWSEndpoint] = useState<string>("");
  const [awsRegion, setAWSRegion] = useState<string>("");
  const [awsKMSKey, setAWSKMSKey] = useState<string>("");
  const [awsAccessKey, setAWSAccessKey] = useState<string>("");
  const [awsSecretKey, setAWSSecretKey] = useState<string>("");
  const [awsToken, setAWSToken] = useState<string>("");
  const [vaultEndpoint, setVaultEndpoint] = useState<string>("");
  const [vaultEngine, setVaultEngine] = useState<string>("");
  const [vaultNamespace, setVaultNamespace] = useState<string>("");
  const [vaultPrefix, setVaultPrefix] = useState<string>("");
  const [vaultAppRoleEngine, setVaultAppRoleEngine] = useState<string>("");
  const [vaultId, setVaultId] = useState<string>("");
  const [vaultSecret, setVaultSecret] = useState<string>("");
  const [vaultRetry, setVaultRetry] = useState<string>("0");
  const [vaultPing, setVaultPing] = useState<string>("0");
  const [ecParityChoices, setECParityChoices] = useState<Opts[]>([]);
  const [cleanECChoices, setCleanECChoices] = useState<string[]>([]);
  const [nodes, setNodes] = useState<string>("4");
  const [drivesPerServer, setDrivesPerServer] = useState<string>("1");
  const [memoryNode, setMemoryNode] = useState<string>("2");
  const [ecParity, setECParity] = useState<string>("");
  const [maxAllocableMemo, setMaxAllocableMemo] = useState<number>(0);
  const [limitSize, setLimitSize] = useState<any>({});
  const [memorySize, setMemorySize] = useState<IMemorySize>({
    error: "",
    limit: 0,
    request: 0,
  });
  const [distribution, setDistribution] = useState<any>({
    error: "",
    nodes: 0,
    persistentVolumes: 0,
    disks: 0,
    volumePerDisk: 0,
  });
  const [ecParityCalc, setEcParityCalc] = useState<IErasureCodeCalc>({
    error: 0,
    defaultEC: "",
    erasureCodeSet: 0,
    maxEC: "",
    rawCapacity: "0",
    storageFactors: [],
  });
  const [exposeMinIO, setExposeMinIO] = useState<boolean>(true);
  const [exposeConsole, setExposeConsole] = useState<boolean>(true);

  // Forms Validation
  const [nameTenantValid, setNameTenantValid] = useState<boolean>(false);
  const [configValid, setConfigValid] = useState<boolean>(false);
  const [configureValid, setConfigureValid] = useState<boolean>(false);
  const [idpValid, setIdpValid] = useState<boolean>(false);
  const [securityValid, setSecurityValid] = useState<boolean>(false);
  const [encryptionValid, setEncryptionValid] = useState<boolean>(false);

  // Custom Elements
  const [customImage, setCustomImage] = useState<boolean>(false);
  const [customDockerhub, setCustomDockerhub] = useState<boolean>(false);
  const [imageRegistry, setImageRegistry] = useState<string>("");
  const [imageRegistryUsername, setImageRegistryUsername] = useState<string>(
    ""
  );
  const [imageRegistryPassword, setImageRegistryPassword] = useState<string>(
    ""
  );

  // FilesBase64
  const [filesBase64, setFilesBase64] = useState<any>({
    consoleKey: "",
    consoleCert: "",
    serverKey: "",
    serverCert: "",
    clientKey: "",
    clientCert: "",
    vaultKey: "",
    vaultCert: "",
    vaultCA: "",
    gemaltoCA: "",
  });

  // Files States
  const [minioCertificates, setMinioCertificates] = useState<KeyPair[]>([
    {
      id: Date.now().toString(),
      key: "",
      cert: "",
      encoded_key: "",
      encoded_cert: "",
    },
  ]);
  const [consoleKeyVal, setConsoleKeyVal] = useState<string>("");
  const [consoleCertVal, setConsoleCertVal] = useState<string>("");
  const [serverKeyVal, setServerKeyVal] = useState<string>("");
  const [serverCertVal, setServerCertVal] = useState<string>("");
  const [clientKeyVal, setClientKeyVal] = useState<string>("");
  const [clientCertVal, setClientCertVal] = useState<string>("");
  const [vaultKeyVal, setVaultKeyVal] = useState<string>("");
  const [vaultCertVal, setVaultCertVal] = useState<string>("");
  const [vaultCAVal, setVaultCAVal] = useState<string>("");
  const [gemaltoCAVal, setGemaltoCAVal] = useState<string>("");

  // Certificates functions
  const addKeyPair = () => {
    setMinioCertificates((currentCertificates) => [
      ...currentCertificates,
      {
        id: Date.now().toString(),
        key: "",
        cert: "",
        encoded_key: "",
        encoded_cert: "",
      },
    ]);
  };

  const deleteKeyPair = (id: string) => {
    if (minioCertificates.length > 1) {
      setMinioCertificates(
        minioCertificates.filter((item: KeyPair) => item.id !== id)
      );
    }
  };

  const addFileToKeyPair = (
    id: string,
    key: string,
    fileName: string,
    value: string
  ) => {
    setMinioCertificates(
      minioCertificates.map((item: KeyPair) => {
        if (item.id === id) {
          return {
            ...item,
            [key]: fileName,
            [`encoded_${key}`]: value,
          };
        }
        return item;
      })
    );
  };

  /*Debounce functions*/

  // Storage Quotas
  const getNamespaceInformation = useCallback(() => {
    setSelectedStorageClass("");
    setStorageClassesList([]);
    api
      .invoke(
        "GET",
        `/api/v1/namespaces/${namespace}/resourcequotas/${namespace}-storagequota`
      )
      .then((res: IQuotas) => {
        const elements: IQuotaElement[] = get(res, "elements", []);
        setLimitSize(getLimitSizes(res));

        const newStorage = elements.map((storageClass: any) => {
          const name = get(storageClass, "name", "").split(
            ".storageclass.storage.k8s.io/requests.storage"
          )[0];

          return { label: name, value: name };
        });

        setStorageClassesList(newStorage);

        if (newStorage.length > 0) {
          setSelectedStorageClass(newStorage[0].value);
        }
      })
      .catch((err: any) => {
        console.log(err);
      });
  }, [namespace]);

  const validateMemorySize = useCallback(() => {
    const memSize = parseInt(memoryNode) || 0;
    const clusterSize = volumeSize || 0;
    const maxMemSize = maxAllocableMemo || 0;
    const clusterSizeFactor = sizeFactor;

    const clusterSizeBytes = getBytes(
      clusterSize.toString(10),
      clusterSizeFactor
    );
    const memoSize = setMemoryResource(memSize, clusterSizeBytes, maxMemSize);

    setMemorySize(memoSize);
  }, [maxAllocableMemo, memoryNode, sizeFactor, volumeSize]);

  const getMaxAllocableMemory = (nodes: string) => {
    if (nodes !== "" && !isNaN(parseInt(nodes))) {
      api
        .invoke(
          "GET",
          `/api/v1/cluster/max-allocatable-memory?num_nodes=${nodes}`
        )
        .then((res: { max_memory: number }) => {
          const maxMemory = res.max_memory ? res.max_memory : 0;
          setMaxAllocableMemo(maxMemory);
        })
        .catch((err: any) => {
          setMaxAllocableMemo(0);
          console.error(err);
        });
    }
  };

  useEffect(() => {
    validateMemorySize();
  }, [memoryNode, validateMemorySize]);

  useEffect(() => {
    validateMemorySize();
  }, [maxAllocableMemo, validateMemorySize]);

  const debounceNamespace = useMemo(
    () => debounce(getNamespaceInformation, 500),
    [getNamespaceInformation]
  );

  useEffect(() => {
    if (namespace !== "") {
      debounceNamespace();

      // Cancel previous debounce calls during useEffect cleanup.
      return debounceNamespace.cancel;
    }
  }, [namespace, debounceNamespace]);

  useEffect(() => {
    if (ecParityChoices.length > 0 && distribution.error === "") {
      const ecCodeValidated = erasureCodeCalc(
        cleanECChoices,
        distribution.persistentVolumes,
        distribution.pvSize,
        distribution.nodes
      );

      setEcParityCalc(ecCodeValidated);
      setECParity(ecCodeValidated.defaultEC);
    }
  }, [ecParityChoices.length, distribution, cleanECChoices]);
  /*End debounce functions*/

  /*Calculate Allocation*/
  useEffect(() => {
    validateClusterSize();
    getECValue();
    getMaxAllocableMemory(nodes);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nodes, volumeSize, sizeFactor, drivesPerServer]);

  const validateClusterSize = () => {
    const size = volumeSize;
    const factor = sizeFactor;
    const limitSize = getBytes("12", "Ti", true);

    const clusterCapacity: ICapacity = {
      unit: factor,
      value: size.toString(),
    };

    const distrCalculate = calculateDistribution(
      clusterCapacity,
      parseInt(nodes),
      parseInt(limitSize),
      parseInt(drivesPerServer)
    );

    setDistribution(distrCalculate);
  };

  const getECValue = () => {
    setECParity("");

    if (nodes.trim() !== "" && drivesPerServer.trim() !== "") {
      api
        .invoke("GET", `/api/v1/get-parity/${nodes}/${drivesPerServer}`)
        .then((ecList: string[]) => {
          setECParityChoices(ecListTransform(ecList));
          setCleanECChoices(ecList);
        })
        .catch((err: any) => {
          setECParityChoices([]);
          setConfigValid(false);
          setECParity("");
        });
    }
  };
  /*Calculate Allocation End*/

  /* Validations of pages */
  useEffect(() => {
    const commonValidation = commonFormValidation([
      {
        fieldKey: "tenant-name",
        required: true,
        pattern: /^[a-z0-9-]{3,63}$/,
        customPatternMessage:
          "Name only can contain lowercase letters, numbers and '-'. Min. Length: 3",
        value: tenantName,
      },
      {
        fieldKey: "namespace",
        required: true,
        value: namespace,
        customValidation: storageClasses.length < 1,
        customValidationMessage: "Please enter a valid namespace",
      },
    ]);

    setNameTenantValid(
      !("tenant-name" in commonValidation) &&
        !("namespace" in commonValidation) &&
        storageClasses.length > 0
    );

    setValidationErrors(commonValidation);
  }, [tenantName, namespace, selectedStorageClass, storageClasses]);

  useEffect(() => {
    const parsedSize = getBytes(volumeSize, sizeFactor, true);

    const commonValidation = commonFormValidation([
      {
        fieldKey: "nodes",
        required: true,
        value: nodes,
        customValidation: parseInt(nodes) < 4,
        customValidationMessage: "Number of nodes cannot be less than 4",
      },
      {
        fieldKey: "volume_size",
        required: true,
        value: volumeSize,
        customValidation:
          parseInt(parsedSize) < 1073741824 ||
          parseInt(parsedSize) > limitSize[selectedStorageClass],
        customValidationMessage: `Volume size must be greater than 1Gi and less than ${niceBytes(
          limitSize[selectedStorageClass],
          true
        )}`,
      },
      {
        fieldKey: "memory_per_node",
        required: true,
        value: memoryNode,
        customValidation: parseInt(memoryNode) < 2,
        customValidationMessage: "Memory size must be greater than 2Gi",
      },
      {
        fieldKey: "drivesps",
        required: true,
        value: drivesPerServer,
        customValidation: parseInt(drivesPerServer) < 1,
        customValidationMessage: "There must be at least one drive",
      },
    ]);

    setConfigValid(
      !("nodes" in commonValidation) &&
        !("volume_size" in commonValidation) &&
        !("memory_per_node" in commonValidation) &&
        !("drivesps" in commonValidation) &&
        distribution.error === "" &&
        ecParityCalc.error === 0 &&
        memorySize.error === ""
    );

    setValidationErrors(commonValidation);
  }, [
    nodes,
    volumeSize,
    sizeFactor,
    memoryNode,
    distribution,
    drivesPerServer,
    ecParityCalc,
    memorySize,
    limitSize,
    selectedStorageClass,
  ]);

  useEffect(() => {
    let customAccountValidation: IValidation[] = [];

    if (customImage) {
      customAccountValidation = [
        ...customAccountValidation,
        {
          fieldKey: "image",
          required: true,
          value: imageName,
          pattern: /^((.*?)\/(.*?):(.+))$/,
          customPatternMessage: "Format must be of form: 'minio/minio:VERSION'",
        },
        {
          fieldKey: "consoleImage",
          required: true,
          value: consoleImage,
          pattern: /^((.*?)\/(.*?):(.+))$/,
          customPatternMessage:
            "Format must be of form: 'minio/console:VERSION'",
        },
      ];
      if (customDockerhub) {
        customAccountValidation = [
          ...customAccountValidation,
          {
            fieldKey: "registry",
            required: true,
            value: imageRegistry,
          },
          {
            fieldKey: "registryUsername",
            required: true,
            value: imageRegistryUsername,
          },
          {
            fieldKey: "registryPassword",
            required: true,
            value: imageRegistryPassword,
          },
        ];
      }
    }

    const commonVal = commonFormValidation(customAccountValidation);

    setConfigureValid(Object.keys(commonVal).length === 0);

    setValidationErrors(commonVal);
  }, [
    customImage,
    imageName,
    consoleImage,
    customDockerhub,
    imageRegistry,
    imageRegistryUsername,
    imageRegistryPassword,
  ]);

  useEffect(() => {
    let customIDPValidation: IValidation[] = [];

    if (idpSelection === "Built-in") {
      setIdpValid(true);
      setValidationErrors({});

      return;
    }

    if (idpSelection === "OpenID") {
      customIDPValidation = [
        ...customIDPValidation,
        {
          fieldKey: "openID_URL",
          required: true,
          value: openIDURL,
        },
        {
          fieldKey: "openID_clientID",
          required: true,
          value: openIDClientID,
        },
        {
          fieldKey: "openID_secretID",
          required: true,
          value: openIDSecretID,
        },
      ];
    }

    if (idpSelection === "AD") {
      customIDPValidation = [
        ...customIDPValidation,
        {
          fieldKey: "AD_URL",
          required: true,
          value: ADURL,
        },
        {
          fieldKey: "ad_userNameFilter",
          required: true,
          value: ADUserNameFilter,
        },
        {
          fieldKey: "ad_groupBaseDN",
          required: true,
          value: ADGroupBaseDN,
        },
        {
          fieldKey: "ad_groupSearchFilter",
          required: true,
          value: ADGroupSearchFilter,
        },
        {
          fieldKey: "ad_nameAttribute",
          required: true,
          value: ADNameAttribute,
        },
      ];
    }

    const commonVal = commonFormValidation(customIDPValidation);

    setIdpValid(Object.keys(commonVal).length === 0);

    setValidationErrors(commonVal);
  }, [
    idpSelection,
    openIDURL,
    openIDClientID,
    openIDSecretID,
    ADURL,
    ADUserNameFilter,
    ADGroupBaseDN,
    ADGroupSearchFilter,
    ADNameAttribute,
  ]);

  useEffect(() => {
    if (!enableTLS) {
      setSecurityValid(true);
      setValidationErrors({});
      return;
    }
    if (enableAutoCert) {
      setSecurityValid(true);
      setValidationErrors({});
      return;
    }
    if (enableCustomCerts) {
      setSecurityValid(true);
      setValidationErrors({});
      return;
    }
    setSecurityValid(false);
  }, [enableTLS, enableAutoCert, enableCustomCerts]);

  useEffect(() => {
    let encryptionValidation: IValidation[] = [];

    if (enableEncryption) {
      if (enableCustomCerts) {
        encryptionValidation = [
          ...encryptionValidation,
          {
            fieldKey: "serverKey",
            required: !enableAutoCert,
            value: filesBase64.serverKey,
          },
          {
            fieldKey: "serverCert",
            required: !enableAutoCert,
            value: filesBase64.serverCert,
          },
          {
            fieldKey: "clientKey",
            required: !enableAutoCert,
            value: filesBase64.clientKey,
          },
          {
            fieldKey: "clientCert",
            required: !enableAutoCert,
            value: filesBase64.clientCert,
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
    }

    const commonVal = commonFormValidation(encryptionValidation);

    setEncryptionValid(Object.keys(commonVal).length === 0);

    setValidationErrors(commonVal);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    enableEncryption,
    encryptionType,
    filesBase64,
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
  ]);

  const clearValidationError = (fieldKey: string) => {
    const newValidationElement = { ...validationErrors };
    delete newValidationElement[fieldKey];

    setValidationErrors(newValidationElement);
  };

  /* End Validation of pages */

  /* Send Information to backend */
  useEffect(() => {
    if (addSending) {
      const poolName = generatePoolName([]);

      const hardCodedAffinity: IAffinityModel = {
        podAntiAffinity: {
          requiredDuringSchedulingIgnoredDuringExecution: [
            {
              labelSelector: {
                matchExpressions: [
                  {
                    key: "v1.min.io/tenant",
                    operator: "In",
                    values: [tenantName],
                  },
                  {
                    key: "v1.min.io/pool",
                    operator: "In",
                    values: [poolName],
                  },
                ],
              },
              topologyKey: "kubernetes.io/hostname",
            },
          ],
        },
      };

      const erasureCode = ecParity.split(":")[1];

      let dataSend: ITenantCreator = {
        name: tenantName,
        namespace: namespace,
        access_key: "",
        secret_key: "",
        enable_tls: enableAutoCert,
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

      let tenantCerts: any = null;
      let consoleCerts: any = null;
      if (minioCertificates.length > 0) {
        tenantCerts = {
          minio: minioCertificates
            .map((keyPair: KeyPair) => ({
              crt: keyPair.encoded_cert,
              key: keyPair.encoded_key,
            }))
            .filter((keyPair) => keyPair.crt && keyPair.key),
        };
      }

      if (filesBase64.consoleCert !== "" && filesBase64.consoleKey !== "") {
        consoleCerts = {
          console: {
            crt: filesBase64.consoleCert,
            key: filesBase64.consoleKey,
          },
        };
      }

      if (tenantCerts || consoleCerts) {
        dataSend = {
          ...dataSend,
          tls: {
            ...tenantCerts,
            ...consoleCerts,
          },
        };
      }

      if (enableEncryption) {
        let insertEncrypt = {};

        switch (encryptionType) {
          case "gemalto":
            let gemaltoCA = {};
            if (filesBase64.gemaltoCA !== "") {
              gemaltoCA = {
                ca: filesBase64.gemaltoCA,
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
                    ...gemaltoCA,
                  },
                },
              },
            };
            break;
          case "AWS":
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
          case "vault":
            let vaultKeyPair = null;
            let vaultCA = null;
            if (filesBase64.vaultKey !== "" && filesBase64.vaultCert !== "") {
              vaultKeyPair = {
                key: filesBase64.vaultKey,
                crt: filesBase64.vaultCert,
              };
            }
            if (filesBase64.vaultCA !== "") {
              vaultCA = {
                ca: filesBase64.vaultCA,
              };
            }
            let vaultTLS = null;
            if (vaultKeyPair || vaultCA) {
              vaultTLS = {
                tls: {
                  ...vaultKeyPair,
                  ...vaultCA,
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

        if (filesBase64.clientKey !== "" && filesBase64.clientCert !== "") {
          encryptionClientKeyPair = {
            client: {
              key: filesBase64.clientKey,
              crt: filesBase64.clientCert,
            },
          };
        }

        if (filesBase64.serverKey !== "" && filesBase64.serverCert !== "") {
          encryptionServerKeyPair = {
            server: {
              key: filesBase64.serverKey,
              crt: filesBase64.serverCert,
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

      if (idpSelection !== "Built-in") {
        let dataIDP: any = {};

        switch (idpSelection) {
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
      }

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
          closeModalAndRefresh(true, newSrvAcc);
        })
        .catch((err) => {
          setAddSending(false);
          setModalErrorSnackMessage(err);
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [addSending]);

  const storeCertInObject = (certName: string, certValue: string) => {
    const copyCurrentList = { ...filesBase64 };

    copyCurrentList[certName] = certValue;

    setFilesBase64(copyCurrentList);
  };

  const cancelButton = {
    label: "Cancel",
    type: "other",
    enabled: true,
    action: () => {
      closeModalAndRefresh(false, null);
    },
  };

  const usableInformation = ecParityCalc.storageFactors.find(
    (element) => element.erasureCode === ecParity
  );

  let encryptionAvailable = false;
  if (
    enableTLS &&
    (enableAutoCert ||
      minioCertificates.filter((item) => item.encoded_key && item.encoded_cert)
        .length > 0)
  ) {
    encryptionAvailable = true;
  }

  const wizardSteps: IWizardElement[] = [
    {
      label: "Name Tenant",
      componentRender: (
        <React.Fragment>
          <div className={classes.headerElement}>
            <h3 className={classes.h3Section}>Name Tenant</h3>
            <span className={classes.descriptionText}>
              How would you like to name this new tenant?
            </span>
          </div>
          <Grid item xs={12}>
            <InputBoxWrapper
              id="tenant-name"
              name="tenant-name"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setTenantName(e.target.value);
                clearValidationError("tenant-name");
              }}
              label="Name"
              value={tenantName}
              required
              error={validationErrors["tenant-name"] || ""}
            />
          </Grid>
          <Grid item xs={12}>
            <InputBoxWrapper
              id="namespace"
              name="namespace"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setNamespace(e.target.value);
                clearValidationError("namespace");
              }}
              label="Namespace"
              value={namespace}
              error={validationErrors["namespace"] || ""}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <SelectWrapper
              id="storage_class"
              name="storage_class"
              onChange={(e: React.ChangeEvent<{ value: unknown }>) => {
                setSelectedStorageClass(e.target.value as string);
              }}
              label="Storage Class"
              value={selectedStorageClass || ""}
              options={storageClasses}
              disabled={storageClasses.length < 1}
            />
          </Grid>
          <Grid item xs={12}>
            <br />
            <span className={classes.descriptionText}>
              Check 'Advanced Mode' for additional configuration options, such
              as configuring an Identity Provider, Encryption at rest, and
              customized TLS/SSL Certificates.
              <br />
              Leave 'Advanced Mode' unchecked to use the secure default settings
              for the tenant.
            </span>
            <br />
            <br />
            <FormSwitchWrapper
              value="adv_mode"
              id="adv_mode"
              name="adv_mode"
              checked={advancedMode}
              onChange={(e) => {
                const targetD = e.target;
                const checked = targetD.checked;

                setAdvancedMode(checked);
              }}
              label={"Advanced Mode"}
            />
          </Grid>
        </React.Fragment>
      ),
      buttons: [
        cancelButton,
        { label: "Next", type: "next", enabled: nameTenantValid },
      ],
    },
    {
      label: "Configure",
      advancedOnly: true,
      componentRender: (
        <React.Fragment>
          <div className={classes.headerElement}>
            <h3 className={classes.h3Section}>Configure</h3>
            <span className={classes.descriptionText}>
              Basic configurations for tenant management
            </span>
          </div>

          <Grid item xs={12}>
            <FormSwitchWrapper
              value="custom_image"
              id="custom_image"
              name="custom_image"
              checked={customImage}
              onChange={(e) => {
                const targetD = e.target;
                const checked = targetD.checked;

                setCustomImage(checked);
              }}
              label={"Use custom image"}
            />
          </Grid>
          {customImage && (
            <React.Fragment>
              Please enter the MinIO image from dockerhub to use
              <Grid item xs={12}>
                <InputBoxWrapper
                  id="image"
                  name="image"
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    setImageName(e.target.value);
                    clearValidationError("image");
                  }}
                  label="MinIO's Image"
                  value={imageName}
                  error={validationErrors["image"] || ""}
                  placeholder="E.g. minio/minio:RELEASE.2020-05-08T02-40-49Z"
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <InputBoxWrapper
                  id="consoleImage"
                  name="consoleImage"
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    setConsoleImage(e.target.value);
                    clearValidationError("consoleImage");
                  }}
                  label="Console's Image"
                  value={consoleImage}
                  error={validationErrors["consoleImage"] || ""}
                  placeholder="E.g. minio/console:v0.3.13"
                  required
                />
              </Grid>
            </React.Fragment>
          )}
          {customImage && (
            <React.Fragment>
              <Grid item xs={12}>
                <FormSwitchWrapper
                  value="custom_docker_hub"
                  id="custom_docker_hub"
                  name="custom_docker_hub"
                  checked={customDockerhub}
                  onChange={(e) => {
                    const targetD = e.target;
                    const checked = targetD.checked;

                    setCustomDockerhub(checked);
                  }}
                  label={"Set/Update Image Registry"}
                />
              </Grid>
            </React.Fragment>
          )}
          {customDockerhub && (
            <React.Fragment>
              <Grid item xs={12}>
                <InputBoxWrapper
                  id="registry"
                  name="registry"
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    setImageRegistry(e.target.value);
                  }}
                  label="Endpoint"
                  value={imageRegistry}
                  error={validationErrors["registry"] || ""}
                  placeholder="E.g. https://index.docker.io/v1/"
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <InputBoxWrapper
                  id="registryUsername"
                  name="registryUsername"
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    setImageRegistryUsername(e.target.value);
                  }}
                  label="Username"
                  value={imageRegistryUsername}
                  error={validationErrors["registryUsername"] || ""}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <InputBoxWrapper
                  id="registryPassword"
                  name="registryPassword"
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    setImageRegistryPassword(e.target.value);
                  }}
                  label="Password"
                  value={imageRegistryPassword}
                  error={validationErrors["registryPassword"] || ""}
                  required
                />
              </Grid>
            </React.Fragment>
          )}
          <div className={classes.headerElement}>
            <h3 className={classes.h3Section}>Expose Services</h3>
            <span className={classes.descriptionText}>
              Whether the tenant's services should request an external IP.
            </span>
          </div>
          <Grid item xs={12}>
            <FormSwitchWrapper
              value="expose_minio"
              id="expose_minio"
              name="expose_minio"
              checked={exposeMinIO}
              onChange={(e) => {
                const targetD = e.target;
                const checked = targetD.checked;

                setExposeMinIO(checked);
              }}
              label={"Expose MiniO Service"}
            />
          </Grid>
          <Grid item xs={12}>
            <FormSwitchWrapper
              value="expose_console"
              id="expose_console"
              name="expose_console"
              checked={exposeConsole}
              onChange={(e) => {
                const targetD = e.target;
                const checked = targetD.checked;

                setExposeConsole(checked);
              }}
              label={"Expose Console Service"}
            />
          </Grid>
        </React.Fragment>
      ),
      buttons: [
        cancelButton,
        { label: "Back", type: "back", enabled: true },
        { label: "Next", type: "next", enabled: configureValid },
      ],
    },
    {
      label: "Identity Provider",
      advancedOnly: true,
      componentRender: (
        <React.Fragment>
          <div className={classes.headerElement}>
            <h3 className={classes.h3Section}>Identity Provider</h3>
            <span className={classes.descriptionText}>
              Access to the tenant can be controlled via an external Identity
              Manager.
            </span>
          </div>
          <Grid item xs={12}>
            <RadioGroupSelector
              currentSelection={idpSelection}
              id="idp-options"
              name="idp-options"
              label="Protocol"
              onChange={(e) => {
                setIdpSelection(e.target.value);
              }}
              selectorOptions={[
                { label: "Built-in", value: "Built-in" },
                { label: "OpenID", value: "OpenID" },
                { label: "Active Directory", value: "AD" },
              ]}
            />
            MinIO supports both OpenID and Active Directory
          </Grid>

          {idpSelection === "OpenID" && (
            <React.Fragment>
              <Grid item xs={12}>
                <InputBoxWrapper
                  id="openID_URL"
                  name="openID_URl"
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    setOpenIDURL(e.target.value);
                    clearValidationError("openID_URL");
                  }}
                  label="URL"
                  value={openIDURL}
                  error={validationErrors["openID_URL"] || ""}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <InputBoxWrapper
                  id="openID_clientID"
                  name="openID_clientID"
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    setOpenIDClientID(e.target.value);
                    clearValidationError("openID_clientID");
                  }}
                  label="Client ID"
                  value={openIDClientID}
                  error={validationErrors["openID_clientID"] || ""}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <InputBoxWrapper
                  id="openID_secretID"
                  name="openID_secretID"
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    setOpenIDSecretID(e.target.value);
                    clearValidationError("openID_secretID");
                  }}
                  label="Secret ID"
                  value={openIDSecretID}
                  error={validationErrors["openID_secretID"] || ""}
                  required
                />
              </Grid>
            </React.Fragment>
          )}
          {idpSelection === "AD" && (
            <React.Fragment>
              <Grid item xs={12}>
                <InputBoxWrapper
                  id="AD_URL"
                  name="AD_URL"
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    setADURL(e.target.value);
                    clearValidationError("AD_URL");
                  }}
                  label="URL"
                  value={ADURL}
                  error={validationErrors["AD_URL"] || ""}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <FormSwitchWrapper
                  value="ad_skipTLS"
                  id="ad_skipTLS"
                  name="ad_skipTLS"
                  checked={ADSkipTLS}
                  onChange={(e) => {
                    const targetD = e.target;
                    const checked = targetD.checked;

                    setADSkipTLS(checked);
                  }}
                  label={"Skip TLS Verification"}
                />
              </Grid>
              <Grid item xs={12}>
                <FormSwitchWrapper
                  value="ad_serverInsecure"
                  id="ad_serverInsecure"
                  name="ad_serverInsecure"
                  checked={ADServerInsecure}
                  onChange={(e) => {
                    const targetD = e.target;
                    const checked = targetD.checked;

                    setADServerInsecure(checked);
                  }}
                  label={"Server Insecure"}
                />
              </Grid>
              {ADServerInsecure ? (
                <Grid item xs={12}>
                  <Typography
                    className={classes.error}
                    variant="caption"
                    display="block"
                    gutterBottom
                  >
                    Warning: All traffic with Active Directory will be
                    unencrypted
                  </Typography>
                  <br />
                </Grid>
              ) : null}
              <Grid item xs={12}>
                <InputBoxWrapper
                  id="ad_userNameFilter"
                  name="ad_userNameFilter"
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    setADUserNameFilter(e.target.value);
                    clearValidationError("ad_userNameFilter");
                  }}
                  label="User Search Filter"
                  value={ADUserNameFilter}
                  error={validationErrors["ad_userNameFilter"] || ""}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <InputBoxWrapper
                  id="ad_groupBaseDN"
                  name="ad_groupBaseDN"
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    setADGroupBaseDN(e.target.value);
                    clearValidationError("ad_groupBaseDN");
                  }}
                  label="Group Search Base DN"
                  value={ADGroupBaseDN}
                  error={validationErrors["ad_groupBaseDN"] || ""}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <InputBoxWrapper
                  id="ad_groupSearchFilter"
                  name="ad_groupSearchFilter"
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    setADGroupSearchFilter(e.target.value);
                    clearValidationError("ad_groupSearchFilter");
                  }}
                  label="Group Search Filter"
                  value={ADGroupSearchFilter}
                  error={validationErrors["ad_groupSearchFilter"] || ""}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <InputBoxWrapper
                  id="ad_nameAttribute"
                  name="ad_nameAttribute"
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    setADNameAttribute(e.target.value);
                    clearValidationError("ad_nameAttribute");
                  }}
                  label="Group Name Attribute"
                  value={ADNameAttribute}
                  error={validationErrors["ad_nameAttribute"] || ""}
                  required
                />
              </Grid>
            </React.Fragment>
          )}
        </React.Fragment>
      ),
      buttons: [
        cancelButton,
        { label: "Back", type: "back", enabled: true },
        { label: "Next", type: "next", enabled: idpValid },
      ],
    },
    {
      label: "Security",
      advancedOnly: true,
      componentRender: (
        <React.Fragment>
          <div className={classes.headerElement}>
            <h3 className={classes.h3Section}>Security</h3>
          </div>
          <Grid item xs={12}>
            <FormSwitchWrapper
              value="enableTLS"
              id="enableTLS"
              name="enableTLS"
              checked={enableTLS}
              onChange={(e) => {
                const targetD = e.target;
                const checked = targetD.checked;

                setEnableTLS(checked);
              }}
              label={"Enable TLS"}
            />
            Enable TLS for the tenant, this is required for Encryption
            Configuration
            {enableTLS && (
              <React.Fragment>
                <br />
                <br />
                <Typography variant="caption" display="block" gutterBottom>
                  AutoCert: MinIO Operator will generate all TLS certificates
                  automatically
                </Typography>
                <Typography variant="caption" display="block" gutterBottom>
                  Custom certificates: Allow user to provide your own
                  certificates
                </Typography>
                <br />
              </React.Fragment>
            )}
          </Grid>
          {enableTLS && (
            <React.Fragment>
              <Grid item xs={12}>
                <FormSwitchWrapper
                  value="enableAutoCert"
                  id="enableAutoCert"
                  name="enableAutoCert"
                  checked={enableAutoCert}
                  onChange={(e) => {
                    const targetD = e.target;
                    const checked = targetD.checked;

                    setEnableAutoCert(checked);
                  }}
                  label={"Enable AutoCert"}
                />
                <FormSwitchWrapper
                  value="enableCustomCerts"
                  id="enableCustomCerts"
                  name="enableCustomCerts"
                  checked={enableCustomCerts}
                  onChange={(e) => {
                    const targetD = e.target;
                    const checked = targetD.checked;

                    setEnableCustomCerts(checked);
                  }}
                  label={"Custom Certificates"}
                />
              </Grid>
              {enableCustomCerts && (
                <React.Fragment>
                  <Grid container>
                    <Grid item xs={12}>
                      <Typography
                        variant="overline"
                        display="block"
                        gutterBottom
                      >
                        MinIO Certificates
                      </Typography>
                    </Grid>
                    {minioCertificates.map((keyPair: KeyPair) => (
                      <React.Fragment key={keyPair.id}>
                        <Grid item xs={5}>
                          <FileSelector
                            onChange={(encodedValue, fileName) => {
                              addFileToKeyPair(
                                keyPair.id,
                                "key",
                                fileName,
                                encodedValue
                              );
                            }}
                            accept=".key,.pem"
                            id="tlsKey"
                            name="tlsKey"
                            label="Key"
                            value={keyPair.key}
                          />
                        </Grid>
                        <Grid item xs={5}>
                          <FileSelector
                            onChange={(encodedValue, fileName) => {
                              addFileToKeyPair(
                                keyPair.id,
                                "cert",
                                fileName,
                                encodedValue
                              );
                            }}
                            accept=".cer,.crt,.cert,.pem"
                            id="tlsCert"
                            name="tlsCert"
                            label="Cert"
                            value={keyPair.cert}
                          />
                        </Grid>
                        <Grid item xs={1}>
                          <Button
                            onClick={() => {
                              deleteKeyPair(keyPair.id);
                            }}
                            color="secondary"
                          >
                            Remove
                          </Button>
                        </Grid>
                      </React.Fragment>
                    ))}
                    <Grid item xs={12}>
                      <Button onClick={addKeyPair} color="primary">
                        Add More
                      </Button>
                    </Grid>
                  </Grid>
                  <Grid container>
                    <Grid item xs={12}>
                      <br />
                      <Divider />
                      <br />
                    </Grid>
                  </Grid>
                  <Grid container>
                    <Grid item xs={12}>
                      <Typography
                        variant="overline"
                        display="block"
                        gutterBottom
                      >
                        Console Certificates
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <FileSelector
                        onChange={(encodedValue, fileName) => {
                          storeCertInObject("consoleKey", encodedValue);
                          setConsoleKeyVal(fileName);
                        }}
                        accept=".key,.pem"
                        id="consoleKey"
                        name="consoleKey"
                        label="Key"
                        value={consoleKeyVal}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <FileSelector
                        onChange={(encodedValue, fileName) => {
                          storeCertInObject("consoleCert", encodedValue);
                          setConsoleCertVal(fileName);
                        }}
                        accept=".cer,.crt,.cert,.pem"
                        id="consoleCert"
                        name="consoleCert"
                        label="Cert"
                        value={consoleCertVal}
                      />
                    </Grid>
                  </Grid>
                </React.Fragment>
              )}
            </React.Fragment>
          )}
        </React.Fragment>
      ),
      buttons: [
        cancelButton,
        { label: "Back", type: "back", enabled: true },
        { label: "Next", type: "next", enabled: securityValid },
      ],
    },
    {
      label: "Encryption",
      advancedOnly: true,
      componentRender: (
        <React.Fragment>
          <div className={classes.headerElement}>
            <h3 className={classes.h3Section}>Encryption</h3>
            <span className={classes.descriptionText}>
              How would you like to encrypt the information at rest.
            </span>
          </div>
          <Grid item xs={12}>
            <FormSwitchWrapper
              value="enableEncryption"
              id="enableEncryption"
              name="enableEncryption"
              checked={enableEncryption}
              onChange={(e) => {
                const targetD = e.target;
                const checked = targetD.checked;

                setEnableEncryption(checked);
              }}
              label={"Enable Server Side Encryption"}
              disabled={!encryptionAvailable}
            />
          </Grid>
          {enableEncryption && (
            <React.Fragment>
              <Grid item xs={12}>
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
                  ]}
                />
              </Grid>
              {encryptionType === "vault" && (
                <React.Fragment>
                  <Grid item xs={12}>
                    <FormSwitchWrapper
                      value="enableCustomCertsForKES"
                      id="enableCustomCertsForKES"
                      name="enableCustomCertsForKES"
                      checked={enableCustomCertsForKES || !enableAutoCert}
                      onChange={(e) => {
                        const targetD = e.target;
                        const checked = targetD.checked;

                        setEnableCustomCertsForKES(checked);
                      }}
                      label={"Custom Certificates"}
                      disabled={!enableAutoCert}
                    />
                  </Grid>
                  {(enableCustomCertsForKES || !enableAutoCert) && (
                    <React.Fragment>
                      <Grid item xs={12}>
                        <Typography
                          variant="overline"
                          display="block"
                          gutterBottom
                        >
                          Encryption Service Certificates
                        </Typography>
                      </Grid>
                      <Grid container>
                        <Grid item xs={6}>
                          <FileSelector
                            onChange={(encodedValue, fileName) => {
                              storeCertInObject("serverKey", encodedValue);
                              setServerKeyVal(fileName);
                              clearValidationError("serverKey");
                            }}
                            accept=".key,.pem"
                            id="serverKey"
                            name="serverKey"
                            label="Key"
                            error={validationErrors["serverKey"] || ""}
                            value={serverKeyVal}
                            required={!enableAutoCert}
                          />
                        </Grid>
                        <Grid item xs={6}>
                          <FileSelector
                            onChange={(encodedValue, fileName) => {
                              storeCertInObject("serverCert", encodedValue);
                              setServerCertVal(fileName);
                              clearValidationError("serverCert");
                            }}
                            accept=".cer,.crt,.cert,.pem"
                            id="serverCert"
                            name="serverCert"
                            label="Cert"
                            error={validationErrors["serverCert"] || ""}
                            value={serverCertVal}
                            required={!enableAutoCert}
                          />
                        </Grid>
                      </Grid>

                      <Grid item xs={12}>
                        <Typography
                          variant="overline"
                          display="block"
                          gutterBottom
                        >
                          Mutual TLS authentication
                        </Typography>
                      </Grid>
                      <Grid container>
                        <Grid item xs={6}>
                          <FileSelector
                            onChange={(encodedValue, fileName) => {
                              storeCertInObject("clientKey", encodedValue);
                              setClientKeyVal(fileName);
                              clearValidationError("clientKey");
                            }}
                            accept=".key,.pem"
                            id="clientKey"
                            name="clientKey"
                            label="Key"
                            error={validationErrors["clientKey"] || ""}
                            value={clientKeyVal}
                            required={!enableAutoCert}
                          />
                        </Grid>
                        <Grid item xs={6}>
                          <FileSelector
                            onChange={(encodedValue, fileName) => {
                              storeCertInObject("clientCert", encodedValue);
                              setClientCertVal(fileName);
                              clearValidationError("clientCert");
                            }}
                            accept=".cer,.crt,.cert,.pem"
                            id="clientCert"
                            name="clientCert"
                            label="Cert"
                            error={validationErrors["clientCert"] || ""}
                            value={clientCertVal}
                            required={!enableAutoCert}
                          />
                        </Grid>
                      </Grid>
                    </React.Fragment>
                  )}
                  <Grid item xs={12}>
                    <InputBoxWrapper
                      id="vault_endpoint"
                      name="vault_endpoint"
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        setVaultEndpoint(e.target.value);
                        clearValidationError("vault_endpoint");
                      }}
                      label="Endpoint"
                      value={vaultEndpoint}
                      error={validationErrors["vault_endpoint"] || ""}
                      required
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <InputBoxWrapper
                      id="vault_engine"
                      name="vault_engine"
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        setVaultEngine(e.target.value);
                        clearValidationError("vault_engine");
                      }}
                      label="Engine"
                      value={vaultEngine}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <InputBoxWrapper
                      id="vault_namespace"
                      name="vault_namespace"
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        setVaultNamespace(e.target.value);
                      }}
                      label="Namespace"
                      value={vaultNamespace}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <InputBoxWrapper
                      id="vault_prefix"
                      name="vault_prefix"
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        setVaultPrefix(e.target.value);
                      }}
                      label="Prefix"
                      value={vaultPrefix}
                    />
                  </Grid>
                  <h5>App Role</h5>
                  <Grid item xs={12}>
                    <InputBoxWrapper
                      id="vault_approle_engine"
                      name="vault_approle_engine"
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        setVaultAppRoleEngine(e.target.value);
                      }}
                      label="Engine"
                      value={vaultAppRoleEngine}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <InputBoxWrapper
                      id="vault_id"
                      name="vault_id"
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        setVaultId(e.target.value);
                        clearValidationError("vault_id");
                      }}
                      label="AppRole ID"
                      value={vaultId}
                      error={validationErrors["vault_id"] || ""}
                      required
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <InputBoxWrapper
                      id="vault_secret"
                      name="vault_secret"
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        setVaultSecret(e.target.value);
                        clearValidationError("vault_secret");
                      }}
                      label="AppRole Secret"
                      value={vaultSecret}
                      error={validationErrors["vault_secret"] || ""}
                      required
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <InputBoxWrapper
                      type="number"
                      min="0"
                      id="vault_retry"
                      name="vault_retry"
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        setVaultRetry(e.target.value);
                        clearValidationError("vault_retry");
                      }}
                      label="Retry (Seconds)"
                      value={vaultRetry}
                      error={validationErrors["vault_retry"] || ""}
                    />
                  </Grid>
                  <h5>Mutual TLS authentication (optional)</h5>
                  <Grid container>
                    <Grid item xs={6}>
                      <FileSelector
                        onChange={(encodedValue, fileName) => {
                          storeCertInObject("vaultKey", encodedValue);
                          setVaultKeyVal(fileName);
                          clearValidationError("vault_key");
                        }}
                        accept=".key,.pem"
                        id="vault_key"
                        name="vault_key"
                        label="Key"
                        value={vaultKeyVal}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <FileSelector
                        onChange={(encodedValue, fileName) => {
                          storeCertInObject("vaultCert", encodedValue);
                          setVaultCertVal(fileName);
                          clearValidationError("vault_cert");
                        }}
                        accept=".cer,.crt,.cert,.pem"
                        id="vault_cert"
                        name="vault_cert"
                        label="Cert"
                        value={vaultCertVal}
                      />
                    </Grid>
                  </Grid>
                  <Grid item xs={12}>
                    <FileSelector
                      onChange={(encodedValue, fileName) => {
                        storeCertInObject("vaultCA", encodedValue);
                        setVaultCAVal(fileName);
                        clearValidationError("vault_ca");
                      }}
                      accept=".cer,.crt,.cert,.pem"
                      id="vault_ca"
                      name="vault_ca"
                      label="CA"
                      value={vaultCAVal}
                    />
                  </Grid>
                  <h5>Status</h5>
                  <Grid item xs={12}>
                    <InputBoxWrapper
                      type="number"
                      min="0"
                      id="vault_ping"
                      name="vault_ping"
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        setVaultPing(e.target.value);
                        clearValidationError("vault_ping");
                      }}
                      label="Ping (Seconds)"
                      value={vaultPing}
                      error={validationErrors["vault_ping"] || ""}
                    />
                  </Grid>
                </React.Fragment>
              )}
              {encryptionType === "aws" && (
                <React.Fragment>
                  <Grid item xs={12}>
                    <InputBoxWrapper
                      id="aws_endpoint"
                      name="aws_endpoint"
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        setAWSEndpoint(e.target.value);
                        clearValidationError("aws_endpoint");
                      }}
                      label="Endpoint"
                      value={awsEndpoint}
                      error={validationErrors["aws_endpoint"] || ""}
                      required
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <InputBoxWrapper
                      id="aws_region"
                      name="aws_region"
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        setAWSRegion(e.target.value);
                        clearValidationError("aws_region");
                      }}
                      label="Region"
                      value={awsRegion}
                      error={validationErrors["aws_region"] || ""}
                      required
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <InputBoxWrapper
                      id="aws_kmsKey"
                      name="aws_kmsKey"
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        setAWSKMSKey(e.target.value);
                      }}
                      label="KMS Key"
                      value={awsKMSKey}
                    />
                  </Grid>
                  <h5>Credentials</h5>
                  <Grid item xs={12}>
                    <InputBoxWrapper
                      id="aws_accessKey"
                      name="aws_accessKey"
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        setAWSAccessKey(e.target.value);
                        clearValidationError("aws_accessKey");
                      }}
                      label="Access Key"
                      value={awsAccessKey}
                      error={validationErrors["aws_accessKey"] || ""}
                      required
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <InputBoxWrapper
                      id="aws_secretKey"
                      name="aws_secretKey"
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        setAWSSecretKey(e.target.value);
                        clearValidationError("aws_secretKey");
                      }}
                      label="Secret Key"
                      value={awsSecretKey}
                      error={validationErrors["aws_secretKey"] || ""}
                      required
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <InputBoxWrapper
                      id="aws_token"
                      name="aws_token"
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        setAWSToken(e.target.value);
                      }}
                      label="Token"
                      value={awsToken}
                    />
                  </Grid>
                </React.Fragment>
              )}
              {encryptionType === "gemalto" && (
                <React.Fragment>
                  <Grid item xs={12}>
                    <InputBoxWrapper
                      id="gemalto_endpoint"
                      name="gemalto_endpoint"
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        setGemaltoEndpoint(e.target.value);
                        clearValidationError("gemalto_endpoint");
                      }}
                      label="Endpoint"
                      value={gemaltoEndpoint}
                      error={validationErrors["gemalto_endpoint"] || ""}
                      required
                    />
                  </Grid>
                  <h5>Credentials</h5>
                  <Grid item xs={12}>
                    <InputBoxWrapper
                      id="gemalto_token"
                      name="gemalto_token"
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        setGemaltoToken(e.target.value);
                        clearValidationError("gemalto_token");
                      }}
                      label="Token"
                      value={gemaltoToken}
                      error={validationErrors["gemalto_token"] || ""}
                      required
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <InputBoxWrapper
                      id="gemalto_domain"
                      name="gemalto_domain"
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        setGemaltoDomain(e.target.value);
                        clearValidationError("gemalto_domain");
                      }}
                      label="Domain"
                      value={gemaltoDomain}
                      error={validationErrors["gemalto_domain"] || ""}
                      required
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <InputBoxWrapper
                      type="number"
                      min="0"
                      id="gemalto_retry"
                      name="gemalto_retry"
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        setGemaltoRetry(e.target.value);
                        clearValidationError("gemalto_retry");
                      }}
                      label="Retry (seconds)"
                      value={gemaltoRetry}
                      error={validationErrors["gemalto_retry"] || ""}
                    />
                  </Grid>
                  <h5>Custom CA Root certificate verification</h5>
                  <Grid item xs={12}>
                    <FileSelector
                      onChange={(encodedValue, fileName) => {
                        storeCertInObject("gemaltoCA", encodedValue);
                        setGemaltoCAVal(fileName);
                        clearValidationError("gemalto_ca");
                      }}
                      accept=".cer,.crt,.cert,.pem"
                      id="gemalto_ca"
                      name="gemalto_ca"
                      label="CA"
                      value={gemaltoCAVal}
                    />
                  </Grid>
                </React.Fragment>
              )}
            </React.Fragment>
          )}
        </React.Fragment>
      ),
      buttons: [
        cancelButton,
        { label: "Back", type: "back", enabled: true },
        { label: "Next", type: "next", enabled: encryptionValid },
      ],
    },
    {
      label: "Tenant Size",
      componentRender: (
        <React.Fragment>
          <div className={classes.headerElement}>
            <h3 className={classes.h3Section}>Tenant Size</h3>
            <span className={classes.descriptionText}>
              Please select the desired capacity
            </span>
          </div>
          <span className={classes.error}>{distribution.error}</span>
          <span className={classes.error}>{memorySize.error}</span>
          <Grid item xs={12}>
            <InputBoxWrapper
              id="nodes"
              name="nodes"
              type="number"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setNodes(e.target.value);
                clearValidationError("nodes");
              }}
              label="Number of Servers"
              value={nodes}
              min="4"
              required
              error={validationErrors["nodes"] || ""}
            />
          </Grid>
          <Grid item xs={12}>
            <InputBoxWrapper
              id="drivesps"
              name="drivesps"
              type="number"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setDrivesPerServer(e.target.value);
                clearValidationError("drivesps");
              }}
              label="Number of Drives per Server"
              value={drivesPerServer}
              min="1"
              required
              error={validationErrors["drivesps"] || ""}
            />
          </Grid>
          <Grid item xs={12}>
            <div className={classes.multiContainer}>
              <div>
                <InputBoxWrapper
                  type="number"
                  id="volume_size"
                  name="volume_size"
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    setVolumeSize(e.target.value);
                    clearValidationError("volume_size");
                  }}
                  label="Total Size"
                  value={volumeSize}
                  required
                  error={validationErrors["volume_size"] || ""}
                  min="0"
                />
              </div>
              <div className={classes.sizeFactorContainer}>
                <SelectWrapper
                  label={"Unit"}
                  id="size_factor"
                  name="size_factor"
                  value={sizeFactor}
                  onChange={(e: React.ChangeEvent<{ value: unknown }>) => {
                    setSizeFactor(e.target.value as string);
                  }}
                  options={k8sfactorForDropdown()}
                />
              </div>
            </div>
          </Grid>
          {advancedMode && (
            <React.Fragment>
              <Grid item xs={12}>
                <InputBoxWrapper
                  type="number"
                  id="memory_per_node"
                  name="memory_per_node"
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    setMemoryNode(e.target.value);
                    clearValidationError("memory_per_node");
                  }}
                  label="Memory per Node [Gi]"
                  value={memoryNode}
                  required
                  error={validationErrors["memory_per_node"] || ""}
                  min="2"
                />
              </Grid>
              <Grid item xs={12}>
                <SelectWrapper
                  id="ec_parity"
                  name="ec_parity"
                  onChange={(e: React.ChangeEvent<{ value: unknown }>) => {
                    setECParity(e.target.value as string);
                  }}
                  label="Erasure Code Parity"
                  value={ecParity}
                  options={ecParityChoices}
                />
                <span className={classes.descriptionText}>
                  Please select the desired parity. This setting will change the
                  max usable capacity in the cluster
                </span>
              </Grid>
            </React.Fragment>
          )}
          <h4>Resource Allocation</h4>
          <Table className={classes.table} aria-label="simple table">
            <TableBody>
              <TableRow>
                <TableCell component="th" scope="row">
                  Number of Servers
                </TableCell>
                <TableCell align="right">
                  {parseInt(nodes) > 0 ? nodes : "-"}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell component="th" scope="row">
                  Drives per Server
                </TableCell>
                <TableCell align="right">
                  {distribution ? distribution.disks : "-"}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell component="th" scope="row">
                  Drive Capacity
                </TableCell>
                <TableCell align="right">
                  {distribution ? niceBytes(distribution.pvSize) : "-"}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell component="th" scope="row">
                  Total Number of Volumes
                </TableCell>
                <TableCell align="right">
                  {distribution ? distribution.persistentVolumes : "-"}
                </TableCell>
              </TableRow>
              {!advancedMode && (
                <TableRow>
                  <TableCell component="th" scope="row">
                    Memory per Node
                  </TableCell>
                  <TableCell align="right">{memoryNode} Gi</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          {ecParityCalc.error === 0 && usableInformation && (
            <React.Fragment>
              <h4>Erasure Code Configuration</h4>
              <Table className={classes.table} aria-label="simple table">
                <TableBody>
                  <TableRow>
                    <TableCell component="th" scope="row">
                      EC Parity
                    </TableCell>
                    <TableCell align="right">
                      {ecParity !== "" ? ecParity : "-"}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell component="th" scope="row">
                      Raw Capacity
                    </TableCell>
                    <TableCell align="right">
                      {niceBytes(ecParityCalc.rawCapacity)}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell component="th" scope="row">
                      Usable Capacity
                    </TableCell>
                    <TableCell align="right">
                      {niceBytes(usableInformation.maxCapacity)}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell component="th" scope="row">
                      Number of server failures to tolerate
                    </TableCell>
                    <TableCell align="right">
                      {distribution
                        ? Math.floor(
                            usableInformation.maxFailureTolerations /
                              distribution.disks
                          )
                        : "-"}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </React.Fragment>
          )}
        </React.Fragment>
      ),
      buttons: [
        cancelButton,
        { label: "Back", type: "back", enabled: true },
        { label: "Next", type: "next", enabled: configValid },
      ],
    },
    {
      label: "Preview Configuration",
      componentRender: (
        <React.Fragment>
          <div className={classes.headerElement}>
            <h3 className={classes.h3Section}>Review</h3>
            <span className={classes.descriptionText}>
              Review the details of the new tenant
            </span>
          </div>
          <Table size="small">
            <TableBody>
              <TableRow>
                <TableCell align="right" className={classes.tableTitle}>
                  Tenant Name
                </TableCell>
                <TableCell>{tenantName}</TableCell>
              </TableRow>

              {customImage && (
                <TableRow>
                  <TableCell align="right" className={classes.tableTitle}>
                    MinIO Image
                  </TableCell>
                  <TableCell>{imageName}</TableCell>
                </TableRow>
              )}

              {namespace !== "" && (
                <TableRow>
                  <TableCell align="right" className={classes.tableTitle}>
                    Namespace
                  </TableCell>
                  <TableCell>{namespace}</TableCell>
                </TableRow>
              )}

              <TableRow>
                <TableCell align="right" className={classes.tableTitle}>
                  Storage Class
                </TableCell>
                <TableCell>{selectedStorageClass}</TableCell>
              </TableRow>

              <TableRow>
                <TableCell align="right" className={classes.tableTitle}>
                  Total Size
                </TableCell>
                <TableCell>
                  {volumeSize} {sizeFactor}
                </TableCell>
              </TableRow>
              {advancedMode && (
                <React.Fragment>
                  <TableRow>
                    <TableCell align="right" className={classes.tableTitle}>
                      Enable TLS
                    </TableCell>
                    <TableCell>{enableTLS ? "Enabled" : "Disabled"}</TableCell>
                  </TableRow>
                </React.Fragment>
              )}
            </TableBody>
          </Table>
        </React.Fragment>
      ),
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

  return (
    <ModalWrapper
      title="Create Tenant"
      modalOpen={open}
      onClose={() => {
        closeModalAndRefresh(false, null);
      }}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      wideLimit={false}
    >
      {addSending && (
        <Grid item xs={12}>
          <LinearProgress />
        </Grid>
      )}
      <GenericWizard wizardSteps={filteredWizardSteps} />
    </ModalWrapper>
  );
};

const connector = connect(null, {
  setModalErrorSnackMessage,
});

export default withStyles(styles)(connector(AddTenant));
