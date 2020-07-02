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

import React, { useEffect, useState } from "react";
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
import { IVolumeConfiguration, IZone } from "./types";
import CheckboxWrapper from "../../Common/FormComponents/CheckboxWrapper/CheckboxWrapper";
import SelectWrapper from "../../Common/FormComponents/SelectWrapper/SelectWrapper";
import { k8sfactorForDropdown } from "../../../../common/utils";
import ZonesMultiSelector from "./ZonesMultiSelector";
import {
  commonFormValidation,
  IValidation,
} from "../../../../utils/validationFunctions";
import GenericWizard from "../../Common/GenericWizard/GenericWizard";
import { IWizardElement } from "../../Common/GenericWizard/types";
import { NewServiceAccount } from "../../Common/CredentialsPrompt/types";

interface IAddTenantProps {
  open: boolean;
  closeModalAndRefresh: (
    reloadData: boolean,
    res: NewServiceAccount | null
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
  const [serviceName, setServiceName] = useState<string>("");
  const [zones, setZones] = useState<IZone[]>([]);
  const [volumesPerServer, setVolumesPerServer] = useState<number>(0);
  const [volumeConfiguration, setVolumeConfiguration] = useState<
    IVolumeConfiguration
  >({ size: 0, storage_class: "" });
  const [mountPath, setMountPath] = useState<string>("");
  const [accessKey, setAccessKey] = useState<string>("");
  const [secretKey, setSecretKey] = useState<string>("");
  const [enableMCS, setEnableMCS] = useState<boolean>(true);
  const [enableSSL, setEnableSSL] = useState<boolean>(false);
  const [sizeFactor, setSizeFactor] = useState<string>("Gi");
  const [storageClasses, setStorageClassesList] = useState<Opts[]>([]);
  const [validationErrors, setValidationErrors] = useState<any>({});
  const [namespace, setNamespace] = useState<string>("");
  const [advancedMode, setAdvancedMode] = useState<boolean>(false);

  // Forms Validation
  const [nameTenantValid, setNameTenantValid] = useState<boolean>(false);
  const [configValid, setConfigValid] = useState<boolean>(false);
  const [configureValid, setConfigureValid] = useState<boolean>(false);
  const [zonesValid, setZonesValid] = useState<boolean>(false);

  // Custom Elements
  const [customACCK, setCustomACCK] = useState<boolean>(false);
  const [customDockerhub, setCustomDockerhub] = useState<boolean>(false);

  useEffect(() => {
    fetchStorageClassList();
  }, []);

  /* Validations of pages */
  useEffect(() => {
    const commonValidation = commonFormValidation([validationElements[0]]);

    setNameTenantValid(!("tenant-name" in commonValidation));

    setValidationErrors(commonValidation);
  }, [tenantName]);

  useEffect(() => {
    let subValidation = validationElements.slice(1, 3);

    if (!advancedMode) {
      subValidation.push({
        fieldKey: "servers",
        required: true,
        pattern: /\d+/,
        customPatternMessage: "Field must be numeric",
        value: zones.length > 0 ? zones[0].servers.toString(10) : "0",
      });
    }

    const commonValidation = commonFormValidation(subValidation);

    setConfigValid(
      !("volumes_per_server" in commonValidation) &&
        !("volume_size" in commonValidation) &&
        !("servers" in commonValidation)
    );

    setValidationErrors(commonValidation);
  }, [volumesPerServer, volumeConfiguration, zones]);

  useEffect(() => {
    let customAccountValidation: IValidation[] = [];
    if (customACCK) {
      customAccountValidation = [
        ...customAccountValidation,
        {
          fieldKey: "access_key",
          required: true,
          value: accessKey,
        },
        {
          fieldKey: "secret_key",
          required: true,
          value: secretKey,
        },
      ];
    }

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
  }, [customACCK, customDockerhub, accessKey, secretKey, imageName]);

  useEffect(() => {
    const filteredZones = zones.filter(
      (zone) => zone.name !== "" && zone.servers !== 0 && !isNaN(zone.servers)
    );

    if (filteredZones.length > 0) {
      setZonesValid(true);
      setValidationErrors({});

      return;
    }

    setZonesValid(false);
    setValidationErrors({ zones_selector: "Please add a valid zone" });
  }, [zones]);

  /* End Validation of pages */

  const validationElements: IValidation[] = [
    {
      fieldKey: "tenant-name",
      required: true,
      pattern: /^[a-z0-9-]{3,63}$/,
      customPatternMessage:
        "Name only can contain lowercase letters, numbers and '-'. Min. Length: 3",
      value: tenantName,
    },
    {
      fieldKey: "volumes_per_server",
      required: true,
      pattern: /\d+/,
      customPatternMessage: "Field must be numeric",
      value: volumesPerServer.toString(10),
    },
    {
      fieldKey: "volume_size",
      required: true,
      pattern: /\d+/,
      customPatternMessage: "Field must be numeric",
      value: volumeConfiguration.size.toString(10),
    },

    {
      fieldKey: "service_name",
      required: false,
      value: serviceName,
    },
  ];

  const clearValidationError = (fieldKey: string) => {
    const newValidationElement = { ...validationErrors };
    delete newValidationElement[fieldKey];

    setValidationErrors(newValidationElement);
  };

  useEffect(() => {
    if (addSending) {
      let cleanZones = zones.filter(
        (zone) => zone.name !== "" && zone.servers > 0 && !isNaN(zone.servers)
      );

      const commonValidation = commonFormValidation(validationElements);

      setValidationErrors(commonValidation);

      if (Object.keys(commonValidation).length === 0) {
        const data: { [key: string]: any } = {
          name: tenantName,
          service_name: tenantName,
          image: imageName,
          enable_ssl: enableSSL,
          enable_mcs: enableMCS,
          access_key: accessKey,
          secret_key: secretKey,
          volumes_per_server: volumesPerServer,
          volume_configuration: {
            size: `${volumeConfiguration.size}${sizeFactor}`,
            storage_class: volumeConfiguration.storage_class,
          },
          zones: cleanZones,
        };

        api
          .invoke("POST", `/api/v1/tenants`, data)
          .then((res) => {
            const newSrvAcc: NewServiceAccount = {
              accessKey: res.access_key,
              secretKey: res.secret_key,
            };

            setAddSending(false);
            setAddError("");
            closeModalAndRefresh(true, newSrvAcc);
          })
          .catch((err) => {
            setAddSending(false);
            setAddError(err);
          });
      } else {
        setAddSending(false);
        setAddError("Please fix the errors in the form and try again");
      }
    }
  }, [addSending]);

  useEffect(() => {
    if (advancedMode) {
      setZones([{ name: "zone-1", servers: 0, capacity: "0", volumes: 0 }]);
    } else {
      setZones([{ name: "zone-1", servers: 1, capacity: "0", volumes: 0 }]);
    }
  }, [advancedMode]);

  const setVolumeConfig = (item: string, value: string) => {
    const volumeCopy: IVolumeConfiguration = {
      size: item !== "size" ? volumeConfiguration.size : parseInt(value),
      storage_class:
        item !== "storage_class" ? volumeConfiguration.storage_class : value,
    };

    setVolumeConfiguration(volumeCopy);
  };

  const setServersSimple = (value: string) => {
    const copyZone = [...zones];

    copyZone[0].servers = parseInt(value, 10);

    setZones(copyZone);
  };

  const fetchStorageClassList = () => {
    api
      .invoke("GET", `/api/v1/storage-classes`)
      .then((res: string[]) => {
        let classes: string[] = [];
        if (res !== null) {
          classes = res;
        }
        setStorageClassesList(
          classes.map((s: string) => ({
            label: s,
            value: s,
          }))
        );

        const newStorage = { ...volumeConfiguration };
        newStorage.storage_class = res[0];

        setVolumeConfiguration(newStorage);
      })
      .catch((err: any) => {
        console.log(err);
      });
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
              label="Tenant Name"
              value={tenantName}
              required
              error={validationErrors["tenant-name"] || ""}
            />
          </Grid>
          <Grid item xs={12}>
            <br />
            <span>
              Use Advanced mode to configure additional options in the tenant
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
      componentRender: (
        <React.Fragment>
          <div className={classes.headerElement}>
            <h3>Configure</h3>
            <span>Basic configurations for tenant management</span>
          </div>
          <Grid item xs={12}>
            <CheckboxWrapper
              value="custom_acck"
              id="custom_acck"
              name="custom_acck"
              checked={customACCK}
              onChange={(e) => {
                const targetD = e.target;
                const checked = targetD.checked;

                setCustomACCK(checked);
              }}
              label={"Use Custom Access Keys"}
            />
          </Grid>
          {customACCK && (
            <React.Fragment>
              Please enter your access & secret keys
              <Grid item xs={12}>
                <InputBoxWrapper
                  id="access_key"
                  name="access_key"
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    setAccessKey(e.target.value);
                    clearValidationError("access_key");
                  }}
                  label="Access Key"
                  value={accessKey}
                  error={validationErrors["access_key"] || ""}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <InputBoxWrapper
                  id="secret_key"
                  name="secret_key"
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    setSecretKey(e.target.value);
                    clearValidationError("secret_key");
                  }}
                  label="Secret Key"
                  value={secretKey}
                  error={validationErrors["secret_key"] || ""}
                  required
                />
              </Grid>
            </React.Fragment>
          )}

          {advancedMode && (
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
          )}

          {customDockerhub && (
            <React.Fragment>
              Please enter the MinIO image from dockerhub
              <Grid item xs={12}>
                <InputBoxWrapper
                  id="image"
                  name="image"
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    setImageName(e.target.value);
                    clearValidationError("image");
                  }}
                  label="MinIO Image"
                  value={imageName}
                  error={validationErrors["image"] || ""}
                  placeholder="Eg. minio/minio:RELEASE.2020-05-08T02-40-49Z"
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
        { label: "Next", type: "next", enabled: configureValid },
      ],
    },
    {
      label: "Service Configuration",
      advancedOnly: true,
      componentRender: (
        <React.Fragment>
          <div className={classes.headerElement}>
            <h3>Service Configuration</h3>
          </div>
          <Grid item xs={12}>
            <InputBoxWrapper
              id="service_name"
              name="service_name"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setServiceName(e.target.value);
                clearValidationError("service_name");
              }}
              label="Service Name"
              value={serviceName}
              error={validationErrors["service_name"] || ""}
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
            />
          </Grid>
        </React.Fragment>
      ),
      buttons: [
        cancelButton,
        { label: "Back", type: "back", enabled: true },
        { label: "Next", type: "next", enabled: true },
      ],
    },
    {
      label: "Storage Class",
      advancedOnly: true,
      componentRender: (
        <React.Fragment>
          <div className={classes.headerElement}>
            <h3>Choose your prefered Storage Class</h3>
            <span>
              Review the storage classes available in the tenant and decide
              which one to allocate the tenant to
            </span>
          </div>
          <Grid item xs={12}>
            <SelectWrapper
              id="storage_class"
              name="storage_class"
              onChange={(e: React.ChangeEvent<{ value: unknown }>) => {
                setVolumeConfig("storage_class", e.target.value as string);
              }}
              label="Storage Class"
              value={volumeConfiguration.storage_class}
              options={storageClasses}
            />
          </Grid>
        </React.Fragment>
      ),
      buttons: [
        cancelButton,
        { label: "Back", type: "back", enabled: true },
        { label: "Next", type: "next", enabled: true },
      ],
    },
    {
      label: "Server Configuration",
      componentRender: (
        <React.Fragment>
          <div className={classes.headerElement}>
            <h3>Server Configuration</h3>
            <span>Define the server configuration</span>
          </div>
          {advancedMode && (
            <Grid item xs={12}>
              <InputBoxWrapper
                id="mount_path"
                name="mount_path"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setMountPath(e.target.value);
                }}
                label="Mount Path"
                value={mountPath}
              />
            </Grid>
          )}

          {!advancedMode && (
            <Grid item xs={12}>
              <InputBoxWrapper
                id="servers"
                name="servers"
                type="number"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setServersSimple(e.target.value);
                  clearValidationError("servers");
                }}
                label="Number of Servers"
                value={zones.length > 0 ? zones[0].servers.toString(10) : "0"}
                min="0"
                required
                error={validationErrors["servers"] || ""}
              />
            </Grid>
          )}
          <Grid item xs={12}>
            <InputBoxWrapper
              id="volumes_per_server"
              name="volumes_per_server"
              type="number"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setVolumesPerServer(parseInt(e.target.value));
                clearValidationError("volumes_per_server");
              }}
              label="Volumes per Server"
              value={volumesPerServer.toString(10)}
              min="0"
              required
              error={validationErrors["volumes_per_server"] || ""}
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
                    setVolumeConfig("size", e.target.value);
                    clearValidationError("volume_size");
                  }}
                  label="Size"
                  value={volumeConfiguration.size.toString(10)}
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
        </React.Fragment>
      ),
      buttons: [
        cancelButton,
        { label: "Back", type: "back", enabled: true },
        { label: "Next", type: "next", enabled: configValid },
      ],
    },
    {
      label: "Zones Definition",
      advancedOnly: true,
      componentRender: (
        <React.Fragment>
          <div className={classes.headerElement}>
            <h3>Zones Definition</h3>
            <span>Define the size of the tenant by defining the zone size</span>
          </div>
          <Grid item xs={12}>
            <div>
              <ZonesMultiSelector
                label="Zones"
                name="zones_selector"
                onChange={(elements: IZone[]) => {
                  setZones(elements);
                }}
                elements={zones}
              />
            </div>
            <div className={classes.zoneError}>
              {validationErrors["zones_selector"] || ""}
            </div>
          </Grid>
        </React.Fragment>
      ),
      buttons: [
        cancelButton,
        { label: "Back", type: "back", enabled: true },
        { label: "Next", type: "next", enabled: zonesValid },
      ],
    },
    {
      label: "Extra Configurations",
      advancedOnly: true,
      componentRender: (
        <React.Fragment>
          <div className={classes.headerElement}>
            <h3>Extra Configurations</h3>
          </div>
          <Grid item xs={12}>
            <CheckboxWrapper
              value="enabled_mcs"
              id="enabled_mcs"
              name="enabled_mcs"
              checked={enableMCS}
              onChange={(e) => {
                const targetD = e.target;
                const checked = targetD.checked;

                setEnableMCS(checked);
              }}
              label={"Enable Console"}
            />
          </Grid>
          <Grid item xs={12}>
            <CheckboxWrapper
              value="enable_ssl"
              id="enable_ssl"
              name="enable_ssl"
              checked={enableSSL}
              onChange={(e) => {
                const targetD = e.target;
                const checked = targetD.checked;

                setEnableSSL(checked);
              }}
              label={"Enable SSL"}
            />
          </Grid>
        </React.Fragment>
      ),
      buttons: [
        cancelButton,
        { label: "Back", type: "back", enabled: true },
        { label: "Next", type: "next", enabled: true },
      ],
    },
    {
      label: "Review",
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
              {customACCK && (
                <React.Fragment>
                  <TableRow>
                    <TableCell align="right" className={classes.tableTitle}>
                      Access Key
                    </TableCell>
                    <TableCell>{accessKey}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell align="right" className={classes.tableTitle}>
                      Secret Key
                    </TableCell>
                    <TableCell>{secretKey}</TableCell>
                  </TableRow>
                </React.Fragment>
              )}

              {customDockerhub && (
                <TableRow>
                  <TableCell align="right" className={classes.tableTitle}>
                    MinIO Image
                  </TableCell>
                  <TableCell>{imageName}</TableCell>
                </TableRow>
              )}

              {serviceName !== "" && (
                <TableRow>
                  <TableCell align="right" className={classes.tableTitle}>
                    Service Name
                  </TableCell>
                  <TableCell>{serviceName}</TableCell>
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
                <TableCell>{volumeConfiguration.storage_class}</TableCell>
              </TableRow>
              {mountPath !== "" && (
                <TableRow>
                  <TableCell align="right" className={classes.tableTitle}>
                    Mount Path
                  </TableCell>
                  <TableCell>{mountPath}</TableCell>
                </TableRow>
              )}

              <TableRow>
                <TableCell align="right" className={classes.tableTitle}>
                  Volumes per Server
                </TableCell>
                <TableCell>{volumesPerServer}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell align="right" className={classes.tableTitle}>
                  Volume Size
                </TableCell>
                <TableCell>
                  {volumeConfiguration.size} {sizeFactor}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell align="right" className={classes.tableTitle}>
                  Total Zones
                </TableCell>
                <TableCell>{zones.length}</TableCell>
              </TableRow>
              {advancedMode && (
                <React.Fragment>
                  <TableRow>
                    <TableCell align="right" className={classes.tableTitle}>
                      Enable SSL
                    </TableCell>
                    <TableCell>{enableSSL ? "Enabled" : "Disabled"}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell align="right" className={classes.tableTitle}>
                      Enable MCS
                    </TableCell>
                    <TableCell>{enableMCS ? "Enabled" : "Disabled"}</TableCell>
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
