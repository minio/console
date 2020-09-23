// This file is part of MinIO Console Server
// Copyright (c) 2020 MinIO, Inc.
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

import React, { useCallback, useEffect, useState } from "react";
import debounce from "lodash/debounce";
import get from "lodash/get";
import ModalWrapper from "../../Common/ModalWrapper/ModalWrapper";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import InputBoxWrapper from "../../Common/FormComponents/InputBoxWrapper/InputBoxWrapper";
import { LinearProgress } from "@material-ui/core";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";
import api from "../../../../common/api";
import { createStyles, Theme, withStyles } from "@material-ui/core/styles";
import { modalBasic } from "../../Common/FormComponents/common/styleLibrary";
import CheckboxWrapper from "../../Common/FormComponents/CheckboxWrapper/CheckboxWrapper";
import SelectWrapper from "../../Common/FormComponents/SelectWrapper/SelectWrapper";
import {
  calculateDistribution,
  generateZoneName,
  getBytes,
  k8sfactorForDropdown,
  niceBytes,
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
  ITenantCreator,
} from "../../../../common/types";
import { NewTenantCredential } from "./TenantCredentialsPrompt/types";

interface IAddTenantProps {
  open: boolean;
  closeModalAndRefresh: (
    reloadData: boolean,
    res: NewTenantCredential | null
  ) => any;
  classes: any;
}

const styles = (theme: Theme) =>
  createStyles({
    errorBlock: {
      color: "red",
    },
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
    zoneError: {
      color: "#dc1f2e",
      fontSize: "0.75rem",
      paddingLeft: 120,
    },
    error: {
      color: "#dc1f2e",
      fontSize: "0.75rem",
    },
    ...modalBasic,
  });

interface Opts {
  label: string;
  value: string;
}

const AddTenant = ({
  open,
  closeModalAndRefresh,
  classes,
}: IAddTenantProps) => {
  // Fields
  const [addSending, setAddSending] = useState<boolean>(false);
  const [addError, setAddError] = useState<string>("");
  const [tenantName, setTenantName] = useState<string>("");
  const [imageName, setImageName] = useState<string>("");
  const [volumeSize, setVolumeSize] = useState<string>("100");
  const [enableTLS, setEnableTLS] = useState<boolean>(true);
  const [sizeFactor, setSizeFactor] = useState<string>("Gi");
  const [storageClasses, setStorageClassesList] = useState<Opts[]>([]);
  const [selectedStorageClass, setSelectedStorageClass] = useState<string>("");
  const [validationErrors, setValidationErrors] = useState<any>({});
  const [namespace, setNamespace] = useState<string>("");
  const [advancedMode, setAdvancedMode] = useState<boolean>(false);
  const [enablePrometheus, setEnablePrometheus] = useState<boolean>(false);
  const [consoleImage, setConsoleImage] = useState<string>("");
  const [idpSelection, setIdpSelection] = useState<string>("none");
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
  const [tlsType, setTLSType] = useState<string>("autocert");
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
  const [nodes, setNodes] = useState<string>("4");
  const [memoryNode, setMemoryNode] = useState<string>("2");
  const [ecParity, setECParity] = useState<string>("");
  const [distribution, setDistribution] = useState<any>({
    error: "",
    nodes: 0,
    persistentVolumes: 0,
    disks: 0,
    volumePerDisk: 0,
  });

  // Forms Validation
  const [nameTenantValid, setNameTenantValid] = useState<boolean>(false);
  const [configValid, setConfigValid] = useState<boolean>(false);
  const [configureValid, setConfigureValid] = useState<boolean>(false);

  // Custom Elements
  const [customDockerhub, setCustomDockerhub] = useState<boolean>(false);

  // FilesBase64
  const [filesBase64, setFilesBase64] = useState<any>({
    tlsKey: "",
    tlsCert: "",
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

  /*Debounce functions*/

  // Storage Quotas
  const getNamespaceInformation = () => {
    setSelectedStorageClass("");
    setStorageClassesList([]);
    api
      .invoke(
        "GET",
        `/api/v1/namespaces/${namespace}/resourcequotas/${namespace}-storagequota`
      )
      .then((res: string[]) => {
        const elements = get(res, "elements", []);

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
  };

  const debounceNamespace = useCallback(
    debounce(getNamespaceInformation, 500),
    [namespace]
  );

  useEffect(() => {
    if (namespace !== "") {
      debounceNamespace();

      // Cancel previous debounce calls during useEffect cleanup.
      return debounceNamespace.cancel;
    }
  }, [namespace, debounceNamespace]);
  /*End debounce functions*/

  /*Calculate Allocation*/
  useEffect(() => {
    validateClusterSize();
  }, [nodes, volumeSize, sizeFactor]);

  const validateClusterSize = () => {
    const size = volumeSize;
    const factor = sizeFactor;
    const limitSize = getBytes("12", "Ti", true);

    const capacityElement: ICapacity = {
      unit: factor,
      value: size.toString(),
    };

    const distrCalculate = calculateDistribution(
      capacityElement,
      parseInt(nodes),
      parseInt(limitSize)
    );

    setDistribution(distrCalculate);
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
        value: tenantName,
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
        customValidation: parseInt(parsedSize) < 1073741824,
        customValidationMessage: "Volume size must be greater than 1Gi",
      },
      {
        fieldKey: "memory_per_node",
        required: true,
        value: memoryNode,
        customValidation: parseInt(memoryNode) < 2,
        customValidationMessage: "Memory size must be greater than 2Gi",
      },
    ]);

    setConfigValid(
      !("nodes" in commonValidation) &&
        !("volume_size" in commonValidation) &&
        !("memory_per_node" in commonValidation) &&
        distribution.error === ""
    );

    setValidationErrors(commonValidation);
  }, [nodes, volumeSize, sizeFactor, memoryNode, distribution]);

  useEffect(() => {
    let customAccountValidation: IValidation[] = [];

    if (customDockerhub) {
      customAccountValidation = [
        ...customAccountValidation,
        {
          fieldKey: "image",
          required: true,
          value: imageName,
          pattern: /^((.*?)\/(.*?):(.+))$/,
          customPatternMessage: "Format must be of form: 'minio/minio:VERSION'",
        },
      ];
    }

    const commonVal = commonFormValidation(customAccountValidation);

    setConfigureValid(Object.keys(commonVal).length === 0);

    setValidationErrors(commonVal);
  }, [customDockerhub, imageName]);

  const clearValidationError = (fieldKey: string) => {
    const newValidationElement = { ...validationErrors };
    delete newValidationElement[fieldKey];

    setValidationErrors(newValidationElement);
  };

  /* End Validation of pages */

  /* Send Information to backend */
  useEffect(() => {
    if (addSending) {
      const zoneName = generateZoneName([]);

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
                    key: "v1.min.io/zone",
                    operator: "In",
                    values: [zoneName],
                  },
                ],
              },
              topologyKey: "kubernetes.io/hostname",
            },
          ],
        },
      };

      const ecLimit = "EC:0";

      const erasureCode = ecLimit.split(":")[1];

      let dataSend: ITenantCreator = {
        name: tenantName,
        namespace: namespace,
        access_key: "",
        secret_key: "",
        enable_tls: enableTLS && tlsType === "autocert",
        enable_console: true,
        enable_prometheus: enablePrometheus,
        service_name: "",
        image: imageName,
        console_image: consoleImage,
        zones: [
          {
            name: zoneName,
            servers: distribution.nodes,
            volumes_per_server: distribution.disks,
            volume_configuration: {
              size: distribution.pvSize,
              storage_class_name: selectedStorageClass,
            },
            resources: {
              requests: {
                memory: parseInt(getBytes(memoryNode, "Gi")),
              },
            },
            affinity: hardCodedAffinity,
          },
        ],
        erasureCodingParity: parseInt(erasureCode, 10),
      };

      if (tlsType === "customcert") {
        let tenantCerts: any = null;
        let consoleCerts: any = null;
        if (filesBase64.tlsCert !== "" && filesBase64.tlsKey !== "") {
          tenantCerts = {
            minio: {
              crt: filesBase64.tlsCert,
              key: filesBase64.tlsKey,
            },
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
      }

      if (enableEncryption) {
        let insertEncrypt = {};

        switch (encryptionType) {
          case "gemalto":
            insertEncrypt = {
              gemalto: {
                keysecure: {
                  endpoint: gemaltoEndpoint,
                  credentials: {
                    token: gemaltoToken,
                    domain: gemaltoDomain,
                    retry: gemaltoRetry,
                  },
                  tls: {
                    ca: filesBase64.gemaltoCA,
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
                  retry: vaultRetry,
                },
                tls: {
                  key: filesBase64.vaultKey,
                  crt: filesBase64.vaultCert,
                  ca: filesBase64.vaultCA,
                },
                status: {
                  ping: vaultPing,
                },
              },
            };
            break;
        }

        dataSend = {
          ...dataSend,
          encryption: {
            client: {
              key: filesBase64.clientKey,
              crt: filesBase64.clientCert,
            },
            server: {
              key: filesBase64.serverKey,
              crt: filesBase64.serverCert,
            },
            ...insertEncrypt,
          },
        };
      }

      if (idpSelection !== "none") {
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
          const newSrvAcc: NewTenantCredential = {
            accessKey: res.access_key,
            secretKey: res.secret_key,
            console: {
              accessKey: res.console.access_key,
              secretKey: res.console.secret_key,
            },
          };

          setAddSending(false);
          setAddError("");
          closeModalAndRefresh(true, newSrvAcc);
        })
        .catch((err) => {
          setAddSending(false);
          setAddError(err);
        });
    }
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

  const wizardSteps: IWizardElement[] = [
    {
      label: "Name Tenant",
      componentRender: (
        <React.Fragment>
          <div className={classes.headerElement}>
            <h3>Name Tenant</h3>
            <span>How would you like to name this new tenant?</span>
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
                console.log(e.target.value as string);
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
            <span>
              Check 'Advanced Mode' for additional configuration options, such
              as IDP, Disk Encryption, and customized TLS/SSL Certificates.
              <br />
              Leave 'Advanced Mode' unchecked to use the secure default settings
              for the tenant.
            </span>
            <br />
            <br />
            <CheckboxWrapper
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
            <h3>Configure</h3>
            <span>Basic configurations for tenant management</span>
          </div>

          <Grid item xs={12}>
            <CheckboxWrapper
              value="custom_dockerhub"
              id="custom_dockerhub"
              name="custom_dockerhub"
              checked={customDockerhub}
              onChange={(e) => {
                const targetD = e.target;
                const checked = targetD.checked;

                setCustomDockerhub(checked);
              }}
              label={"Use custom image"}
            />
          </Grid>
          {customDockerhub && (
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
                  placeholder="Eg. minio/minio:RELEASE.2020-05-08T02-40-49Z"
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
                  placeholder="Eg. minio/console:v0.3.13"
                  required
                />
              </Grid>
            </React.Fragment>
          )}
          <Grid item xs={12}>
            <CheckboxWrapper
              value="enable_prometheus"
              id="enable_prometheus"
              name="enable_prometheus"
              checked={enablePrometheus}
              onChange={(e) => {
                const targetD = e.target;
                const checked = targetD.checked;

                setEnablePrometheus(checked);
              }}
              label={"Enable prometheus integration"}
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
      label: "IDP",
      advancedOnly: true,
      componentRender: (
        <React.Fragment>
          <div className={classes.headerElement}>
            <h3>IDP</h3>
            <span>
              Access to the tenant can be controlled via an external Identity
              Manager.
            </span>
          </div>
          <Grid item xs={12}>
            <RadioGroupSelector
              currentSelection={idpSelection}
              id="idp-options"
              name="idp-options"
              label="IDP Selection"
              onChange={(e) => {
                setIdpSelection(e.target.value);
              }}
              selectorOptions={[
                { label: "None", value: "none" },
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
                <CheckboxWrapper
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
                <CheckboxWrapper
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
        { label: "Next", type: "next", enabled: true },
      ],
    },
    {
      label: "Security",
      advancedOnly: true,
      componentRender: (
        <React.Fragment>
          <div className={classes.headerElement}>
            <h3>Security</h3>
          </div>
          <Grid item xs={12}>
            <CheckboxWrapper
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
          </Grid>
          {enableTLS && (
            <React.Fragment>
              <Grid item xs={12}>
                <RadioGroupSelector
                  currentSelection={tlsType}
                  id="tls-options"
                  name="tls-options"
                  label="TLS Options"
                  onChange={(e) => {
                    setTLSType(e.target.value);
                  }}
                  selectorOptions={[
                    { label: "Autocert", value: "autocert" },
                    { label: "Custom Certificate", value: "customcert" },
                  ]}
                />
              </Grid>
              {tlsType !== "autocert" && (
                <React.Fragment>
                  <h5>MinIO TLS Certs</h5>
                  <Grid item xs={12}>
                    <FileSelector
                      onChange={(encodedValue) => {
                        storeCertInObject("tlsKey", encodedValue);
                      }}
                      accept=".key,.pem"
                      id="tlsKey"
                      name="tlsKey"
                      label="Key"
                      required
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <FileSelector
                      onChange={(encodedValue) => {
                        storeCertInObject("tlsCert", encodedValue);
                      }}
                      accept=".cer,.crt,.cert,.pem"
                      id="tlsCert"
                      name="tlsCert"
                      label="Cert"
                      required
                    />
                  </Grid>
                  <h5>Console TLS Certs</h5>
                  <Grid item xs={12}>
                    <FileSelector
                      onChange={(encodedValue) => {
                        storeCertInObject("consoleKey", encodedValue);
                      }}
                      accept=".key,.pem"
                      id="consoleKey"
                      name="consoleKey"
                      label="Key"
                      required
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <FileSelector
                      onChange={(encodedValue) => {
                        storeCertInObject("consoleCert", encodedValue);
                      }}
                      accept=".cer,.crt,.cert,.pem"
                      id="consoleCert"
                      name="consoleCert"
                      label="Cert"
                      required
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
        { label: "Next", type: "next", enabled: true },
      ],
    },
    {
      label: "Encryption",
      advancedOnly: true,
      componentRender: (
        <React.Fragment>
          <div className={classes.headerElement}>
            <h3>Encryption</h3>
            <span>How would you like to encrypt the information at rest.</span>
          </div>
          <Grid item xs={12}>
            <CheckboxWrapper
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
              disabled={!enableTLS}
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

              {enableTLS && tlsType !== "autocert" && (
                <React.Fragment>
                  <h5>Server</h5>
                  <Grid item xs={12}>
                    <FileSelector
                      onChange={(encodedValue) => {
                        storeCertInObject("serverKey", encodedValue);
                      }}
                      accept=".key,.pem"
                      id="serverKey"
                      name="serverKey"
                      label="Key"
                      required
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <FileSelector
                      onChange={(encodedValue) => {
                        storeCertInObject("serverCert", encodedValue);
                      }}
                      accept=".cer,.crt,.cert,.pem"
                      id="serverCert"
                      name="serverCert"
                      label="Cert"
                      required
                    />
                  </Grid>
                  <h5>Client</h5>
                  <Grid item xs={12}>
                    <FileSelector
                      onChange={(encodedValue) => {
                        storeCertInObject("clientKey", encodedValue);
                      }}
                      accept=".key,.pem"
                      id="clientKey"
                      name="clientKey"
                      label="Key"
                      required
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <FileSelector
                      onChange={(encodedValue) => {
                        storeCertInObject("clientCert", encodedValue);
                      }}
                      accept=".cer,.crt,.cert,.pem"
                      id="clientCert"
                      name="clientCert"
                      label="Cert"
                      required
                    />
                  </Grid>
                </React.Fragment>
              )}

              {encryptionType === "vault" && (
                <React.Fragment>
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
                      }}
                      label="Engine"
                      value={vaultEngine}
                      required
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
                      label="Id"
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
                      label="Id"
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
                      }}
                      label="Retry"
                      value={vaultRetry}
                      required
                    />
                  </Grid>
                  <h5>TLS</h5>
                  <Grid item xs={12}>
                    <FileSelector
                      onChange={(encodedValue) => {
                        storeCertInObject("vaultKey", encodedValue);
                      }}
                      accept=".key,.pem"
                      id="vault_key"
                      name="vault_key"
                      label="Key"
                      required
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <FileSelector
                      onChange={(encodedValue) => {
                        storeCertInObject("vaultCert", encodedValue);
                      }}
                      accept=".cer,.crt,.cert,.pem"
                      id="vault_cert"
                      name="vault_cert"
                      label="Cert"
                      required
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <FileSelector
                      onChange={(encodedValue) => {
                        storeCertInObject("vaultCA", encodedValue);
                      }}
                      accept=".cer,.crt,.cert,.pem"
                      id="vault_ca"
                      name="vault_ca"
                      label="CA"
                      required
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
                      }}
                      label="Ping"
                      value={vaultPing}
                      required
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
                      label="Secret Key"
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
                        clearValidationError("gemalto_endpoint");
                      }}
                      label="Token"
                      value={gemaltoToken}
                      error={validationErrors["gemalto_endpoint"] || ""}
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
                      }}
                      label="Domain"
                      value={gemaltoRetry}
                      error={validationErrors["gemalto_retry"] || ""}
                    />
                  </Grid>
                  <h5>TLS</h5>
                  <Grid item xs={12}>
                    <FileSelector
                      onChange={(encodedValue) => {
                        storeCertInObject("gemaltoCA", encodedValue);
                      }}
                      accept=".cer,.crt,.cert,.pem"
                      id="gemalto_ca"
                      name="gemalto_ca"
                      label="CA"
                      required
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
        { label: "Next", type: "next", enabled: true },
      ],
    },
    {
      label: "Tenant Size",
      componentRender: (
        <React.Fragment>
          <div className={classes.headerElement}>
            <h3>Tenant Size</h3>
            <span>Please select the desired capacity</span>
          </div>
          <span className={classes.error}>{distribution.error}</span>
          <Grid item xs={12}>
            <InputBoxWrapper
              id="nodes"
              name="nodes"
              type="number"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setNodes(e.target.value);
                clearValidationError("nodes");
              }}
              label="Number of Nodes"
              value={nodes}
              min="4"
              required
              error={validationErrors["nodes"] || ""}
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
                  label="Size"
                  value={volumeSize}
                  required
                  error={validationErrors["volume_size"] || ""}
                  min="0"
                />
              </div>
              <div className={classes.sizeFactorContainer}>
                <SelectWrapper
                  label=""
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
          {advancedMode && (
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
              <span>
                Please select the desired parity. This setting will change the
                max usable capacity in the cluster
              </span>
            </Grid>
          )}
          <h5>Resource Allocation</h5>
          <Table className={classes.table} aria-label="simple table">
            <TableBody>
              <TableRow>
                <TableCell component="th" scope="row">
                  Volumes per Node
                </TableCell>
                <TableCell align="right">
                  {distribution ? distribution.disks : "-"}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell component="th" scope="row">
                  Disk Size
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
            </TableBody>
          </Table>
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
            <h3>Review</h3>
            <span>Review the details of the new tenant</span>
          </div>
          {addError !== "" && (
            <Grid item xs={12}>
              <Typography
                component="p"
                variant="body1"
                className={classes.errorBlock}
              >
                {addError}
              </Typography>
            </Grid>
          )}

          <Table size="small">
            <TableBody>
              <TableRow>
                <TableCell align="right" className={classes.tableTitle}>
                  Tenant Name
                </TableCell>
                <TableCell>{tenantName}</TableCell>
              </TableRow>

              {customDockerhub && (
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
                  Volume Size
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
        setAddError("");
        closeModalAndRefresh(false, null);
      }}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
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

export default withStyles(styles)(AddTenant);
