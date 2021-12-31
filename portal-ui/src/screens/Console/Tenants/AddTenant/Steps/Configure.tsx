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

import React, { useCallback, useEffect, useState } from "react";
import { connect } from "react-redux";
import { Theme } from "@mui/material/styles";
import createStyles from "@mui/styles/createStyles";
import withStyles from "@mui/styles/withStyles";
import { Grid, Paper, SelectChangeEvent } from "@mui/material";
import {
  createTenantCommon,
  modalBasic,
  wizardCommon,
} from "../../../Common/FormComponents/common/styleLibrary";
import { isPageValid, updateAddField } from "../../actions";
import { AppState } from "../../../../../store";
import { clearValidationError } from "../../utils";
import {
  commonFormValidation,
  IValidation,
} from "../../../../../utils/validationFunctions";
import FormSwitchWrapper from "../../../Common/FormComponents/FormSwitchWrapper/FormSwitchWrapper";
import InputBoxWrapper from "../../../Common/FormComponents/InputBoxWrapper/InputBoxWrapper";
import SelectWrapper from "../../../Common/FormComponents/SelectWrapper/SelectWrapper";
import { ISecurityContext } from "../../types";

interface IConfigureProps {
  updateAddField: typeof updateAddField;
  isPageValid: typeof isPageValid;
  storageClasses: any;
  classes: any;
  customImage: boolean;
  imageName: string;
  customDockerhub: boolean;
  imageRegistry: string;
  imageRegistryUsername: string;
  imageRegistryPassword: string;
  exposeMinIO: boolean;
  exposeConsole: boolean;
  prometheusCustom: boolean;
  tenantCustom: boolean;
  logSearchCustom: boolean;
  logSearchVolumeSize: string;
  logSearchSizeFactor: string;
  prometheusVolumeSize: string;
  prometheusSizeFactor: string;
  logSearchSelectedStorageClass: string;
  logSearchImage: string;
  kesImage: string;
  logSearchPostgresImage: string;
  logSearchPostgresInitImage: string;
  prometheusSelectedStorageClass: string;
  prometheusImage: string;
  prometheusSidecarImage: string;
  prometheusInitImage: string;
  selectedStorageClass: string;
  tenantSecurityContext: ISecurityContext;
  logSearchSecurityContext: ISecurityContext;
  logSearchPostgresSecurityContext: ISecurityContext;
  prometheusSecurityContext: ISecurityContext;
}

const styles = (theme: Theme) =>
  createStyles({
    configSectionItem: {
      marginRight: 15,

      "& .multiContainer": {
        border: "1px solid red",
      },
    },
    tenantCustomizationFields: {
      marginLeft: 30, // 2nd Level(15+15)
      width: "88%",
      margin: "auto",
    },
    containerItem: {
      marginRight: 15,
    },
    fieldGroup: {
      ...createTenantCommon.fieldGroup,
      paddingTop: 15,
      marginBottom: 25,
    },
    responsiveSectionItem: {
      "@media (max-width: 900px)": {
        flexFlow: "column",
        alignItems: "flex-start",

        "& div > div": {
          marginBottom: 5,
          marginRight: 0,
        },
      },
    },

    logSearchCustomFields: {
      marginLeft: 20, // 2nd Level(15+15)
      padding: 10,
      width: "90%",
      margin: "auto",
    },
    fieldSpaceTop: {
      marginTop: 15,
    },
    prometheusCustomFields: {
      marginLeft: 20, // 2nd Level(15+15)
      padding: 10,
      width: "90%",
      margin: "auto",
    },
    ...modalBasic,
    ...wizardCommon,
  });

const Configure = ({
  classes,
  storageClasses,
  customImage,
  imageName,
  customDockerhub,
  imageRegistry,
  imageRegistryUsername,
  imageRegistryPassword,
  exposeMinIO,
  exposeConsole,
  prometheusCustom,
  tenantCustom,
  logSearchCustom,
  logSearchVolumeSize,
  logSearchSizeFactor,
  logSearchImage,
  kesImage,
  logSearchPostgresImage,
  logSearchPostgresInitImage,
  prometheusVolumeSize,
  prometheusSizeFactor,
  logSearchSelectedStorageClass,
  prometheusSelectedStorageClass,
  prometheusImage,
  prometheusSidecarImage,
  prometheusInitImage,
  updateAddField,
  isPageValid,
  selectedStorageClass,
  tenantSecurityContext,
  logSearchSecurityContext,
  logSearchPostgresSecurityContext,
  prometheusSecurityContext,
}: IConfigureProps) => {
  const [validationErrors, setValidationErrors] = useState<any>({});

  const configureSTClasses = [
    { label: "Default", value: "default" },
    ...storageClasses,
  ];

  // Common
  const updateField = useCallback(
    (field: string, value: any) => {
      updateAddField("configure", field, value);
    },
    [updateAddField]
  );

  // Validation
  useEffect(() => {
    let customAccountValidation: IValidation[] = [];
    if (tenantCustom) {
      customAccountValidation = [
        ...customAccountValidation,
        {
          fieldKey: "tenant_securityContext_runAsUser",
          required: true,
          value: tenantSecurityContext.runAsUser,
          customValidation:
            tenantSecurityContext.runAsUser === "" ||
            parseInt(tenantSecurityContext.runAsUser) < 0,
          customValidationMessage: `runAsUser must be present and be 0 or more`,
        },
        {
          fieldKey: "tenant_securityContext_runAsGroup",
          required: true,
          value: tenantSecurityContext.runAsGroup,
          customValidation:
            tenantSecurityContext.runAsGroup === "" ||
            parseInt(tenantSecurityContext.runAsGroup) < 0,
          customValidationMessage: `runAsGroup must be present and be 0 or more`,
        },
        {
          fieldKey: "tenant_securityContext_fsGroup",
          required: true,
          value: tenantSecurityContext.fsGroup,
          customValidation:
            tenantSecurityContext.fsGroup === "" ||
            parseInt(tenantSecurityContext.fsGroup) < 0,
          customValidationMessage: `fsGroup must be present and be 0 or more`,
        },
      ];
    }
    if (prometheusCustom) {
      customAccountValidation = [
        ...customAccountValidation,
        {
          fieldKey: "prometheus_storage_class",
          required: true,
          value: prometheusSelectedStorageClass,
          customValidation: prometheusSelectedStorageClass === "",
          customValidationMessage: "Field cannot be empty",
        },
        {
          fieldKey: "prometheus_volume_size",
          required: true,
          value: prometheusVolumeSize,
          customValidation:
            prometheusVolumeSize === "" || parseInt(prometheusVolumeSize) <= 0,
          customValidationMessage: `Volume size must be present and be greater than 0`,
        },
        {
          fieldKey: "prometheus_securityContext_runAsUser",
          required: true,
          value: prometheusSecurityContext.runAsUser,
          customValidation:
            prometheusSecurityContext.runAsUser === "" ||
            parseInt(prometheusSecurityContext.runAsUser) < 0,
          customValidationMessage: `runAsUser must be present and be 0 or more`,
        },
        {
          fieldKey: "prometheus_securityContext_runAsGroup",
          required: true,
          value: prometheusSecurityContext.runAsGroup,
          customValidation:
            prometheusSecurityContext.runAsGroup === "" ||
            parseInt(prometheusSecurityContext.runAsGroup) < 0,
          customValidationMessage: `runAsGroup must be present and be 0 or more`,
        },
        {
          fieldKey: "prometheus_securityContext_fsGroup",
          required: true,
          value: prometheusSecurityContext.fsGroup,
          customValidation:
            prometheusSecurityContext.fsGroup === "" ||
            parseInt(prometheusSecurityContext.fsGroup) < 0,
          customValidationMessage: `fsGroup must be present and be 0 or more`,
        },
      ];
    }
    if (logSearchCustom) {
      customAccountValidation = [
        ...customAccountValidation,
        {
          fieldKey: "log_search_storage_class",
          required: true,
          value: logSearchSelectedStorageClass,
          customValidation: logSearchSelectedStorageClass === "",
          customValidationMessage: "Field cannot be empty",
        },
        {
          fieldKey: "log_search_volume_size",
          required: true,
          value: logSearchVolumeSize,
          customValidation:
            logSearchVolumeSize === "" || parseInt(logSearchVolumeSize) <= 0,
          customValidationMessage: `Volume size must be present and be greatter than 0`,
        },
        {
          fieldKey: "logSearch_securityContext_runAsUser",
          required: true,
          value: logSearchSecurityContext.runAsUser,
          customValidation:
            logSearchSecurityContext.runAsUser === "" ||
            parseInt(logSearchSecurityContext.runAsUser) < 0,
          customValidationMessage: `runAsUser must be present and be 0 or more`,
        },
        {
          fieldKey: "logSearch_securityContext_runAsGroup",
          required: true,
          value: logSearchSecurityContext.runAsGroup,
          customValidation:
            logSearchSecurityContext.runAsGroup === "" ||
            parseInt(logSearchSecurityContext.runAsGroup) < 0,
          customValidationMessage: `runAsGroup must be present and be 0 or more`,
        },
        {
          fieldKey: "logSearch_securityContext_fsGroup",
          required: true,
          value: logSearchSecurityContext.fsGroup,
          customValidation:
            logSearchSecurityContext.fsGroup === "" ||
            parseInt(logSearchSecurityContext.fsGroup) < 0,
          customValidationMessage: `fsGroup must be present and be 0 or more`,
        },
        {
          fieldKey: "postgres_securityContext_runAsUser",
          required: true,
          value: logSearchPostgresSecurityContext.runAsUser,
          customValidation:
            logSearchPostgresSecurityContext.runAsUser === "" ||
            parseInt(logSearchPostgresSecurityContext.runAsUser) < 0,
          customValidationMessage: `runAsUser must be present and be 0 or more`,
        },
        {
          fieldKey: "postgres_securityContext_runAsGroup",
          required: true,
          value: prometheusSecurityContext.runAsGroup,
          customValidation:
            logSearchPostgresSecurityContext.runAsGroup === "" ||
            parseInt(logSearchPostgresSecurityContext.runAsGroup) < 0,
          customValidationMessage: `runAsGroup must be present and be 0 or more`,
        },
        {
          fieldKey: "postgres_securityContext_fsGroup",
          required: true,
          value: logSearchPostgresSecurityContext.fsGroup,
          customValidation:
            logSearchPostgresSecurityContext.fsGroup === "" ||
            parseInt(logSearchPostgresSecurityContext.fsGroup) < 0,
          customValidationMessage: `fsGroup must be present and be 0 or more`,
        },
      ];
    }

    if (customImage) {
      customAccountValidation = [
        ...customAccountValidation,
        {
          fieldKey: "image",
          required: false,
          value: imageName,
          pattern: /^((.*?)\/(.*?):(.+))$/,
          customPatternMessage: "Format must be of form: 'minio/minio:VERSION'",
        },
        {
          fieldKey: "logSearchImage",
          required: false,
          value: logSearchImage,
          pattern: /^((.*?)\/(.*?):(.+))$/,
          customPatternMessage:
            "Format must be of form: 'minio/logsearchapi:VERSION'",
        },
        {
          fieldKey: "kesImage",
          required: false,
          value: kesImage,
          pattern: /^((.*?)\/(.*?):(.+))$/,
          customPatternMessage: "Format must be of form: 'minio/kes:VERSION'",
        },
        {
          fieldKey: "logSearchPostgresImage",
          required: false,
          value: logSearchPostgresImage,
          pattern: /^((.*?)\/(.*?):(.+))$/,
          customPatternMessage:
            "Format must be of form: 'library/postgres:VERSION'",
        },
        {
          fieldKey: "logSearchPostgresInitImage",
          required: false,
          value: logSearchPostgresInitImage,
          pattern: /^((.*?)\/(.*?):(.+))$/,
          customPatternMessage:
            "Format must be of form: 'library/busybox:VERSION'",
        },
        {
          fieldKey: "prometheusImage",
          required: false,
          value: prometheusImage,
          pattern: /^((.*?)\/(.*?):(.+))$/,
          customPatternMessage:
            "Format must be of form: 'minio/prometheus:VERSION'",
        },
        {
          fieldKey: "prometheusSidecarImage",
          required: false,
          value: prometheusSidecarImage,
          pattern: /^((.*?)\/(.*?):(.+))$/,
          customPatternMessage:
            "Format must be of form: 'project/container:VERSION'",
        },
        {
          fieldKey: "prometheusInitImage",
          required: false,
          value: prometheusInitImage,
          pattern: /^((.*?)\/(.*?):(.+))$/,
          customPatternMessage:
            "Format must be of form: 'library/busybox:VERSION'",
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

    isPageValid("configure", Object.keys(commonVal).length === 0);

    setValidationErrors(commonVal);
  }, [
    customImage,
    imageName,
    logSearchImage,
    kesImage,
    logSearchPostgresImage,
    logSearchPostgresInitImage,
    prometheusImage,
    prometheusSidecarImage,
    prometheusInitImage,
    customDockerhub,
    imageRegistry,
    imageRegistryUsername,
    imageRegistryPassword,
    isPageValid,
    prometheusCustom,
    tenantCustom,
    logSearchCustom,
    prometheusSelectedStorageClass,
    prometheusVolumeSize,
    logSearchSelectedStorageClass,
    logSearchVolumeSize,
    tenantSecurityContext,
    logSearchSecurityContext,
    logSearchPostgresSecurityContext,
    prometheusSecurityContext,
  ]);

  useEffect(() => {
    // New default values in current selection is invalid
    if (storageClasses.length > 0) {
      const filterPrometheus = storageClasses.filter(
        (item: any) => item.value === prometheusSelectedStorageClass
      );
      if (filterPrometheus.length === 0) {
        updateField("prometheusSelectedStorageClass", "default");
      }

      const filterLogSearch = storageClasses.filter(
        (item: any) => item.value === logSearchSelectedStorageClass
      );
      if (filterLogSearch.length === 0) {
        updateField("logSearchSelectedStorageClass", "default");
      }
    }
  }, [
    logSearchSelectedStorageClass,
    prometheusSelectedStorageClass,
    selectedStorageClass,
    storageClasses,
    updateField,
  ]);

  const cleanValidation = (fieldName: string) => {
    setValidationErrors(clearValidationError(validationErrors, fieldName));
  };

  return (
    <Paper className={classes.paperWrapper}>
      <div className={classes.headerElement}>
        <h3 className={classes.h3Section}>Configure</h3>
        <span className={classes.descriptionText}>
          Basic configurations for tenant management
        </span>
      </div>
      <div className={classes.headerElement}>
        <h3 className={classes.h3Section}>Expose Services</h3>
        <span className={classes.descriptionText}>
          Whether the tenant's services should request an external IP.
        </span>
      </div>
      <Grid item xs={12} className={classes.configSectionItem}>
        <FormSwitchWrapper
          value="expose_minio"
          id="expose_minio"
          name="expose_minio"
          checked={exposeMinIO}
          onChange={(e) => {
            const targetD = e.target;
            const checked = targetD.checked;

            updateField("exposeMinIO", checked);
          }}
          label={"Expose MiniO Service"}
        />
      </Grid>
      <Grid item xs={12} className={classes.configSectionItem}>
        <FormSwitchWrapper
          value="expose_console"
          id="expose_console"
          name="expose_console"
          checked={exposeConsole}
          onChange={(e) => {
            const targetD = e.target;
            const checked = targetD.checked;

            updateField("exposeConsole", checked);
          }}
          label={"Expose Console Service"}
        />
      </Grid>

      <div className={classes.headerElement}>
        <h3 className={classes.h3Section}>Additional Configurations</h3>
        <span className={classes.descriptionText}>
          Configure SecurityContext, Storage Classes & Storage size for Log
          Search, Prometheus add-ons and your Tenant
        </span>
      </div>
      <Grid item xs={12} className={classes.configSectionItem}>
        <FormSwitchWrapper
          value="tenantConfig"
          id="tenant_configuration"
          name="tenant_configuration"
          checked={tenantCustom}
          onChange={(e) => {
            const targetD = e.target;
            const checked = targetD.checked;

            updateField("tenantCustom", checked);
          }}
          label={"Override Tenant defaults"}
        />
      </Grid>
      {tenantCustom && (
        <Grid item xs={12} className={classes.tenantCustomizationFields}>
          <fieldset className={classes.fieldGroup}>
            <legend className={classes.descriptionText}>
              SecurityContext for MinIO
            </legend>
            <Grid item xs={12} className={`${classes.configSectionItem}`}>
              <div
                className={`${classes.multiContainer} ${classes.responsiveSectionItem}`}
              >
                <div className={classes.containerItem}>
                  <InputBoxWrapper
                    type="number"
                    id="tenant_securityContext_runAsUser"
                    name="tenant_securityContext_runAsUser"
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      updateField("tenantSecurityContext", {
                        ...tenantSecurityContext,
                        runAsUser: e.target.value,
                      });
                      cleanValidation("tenant_securityContext_runAsUser");
                    }}
                    label="Run As User"
                    value={tenantSecurityContext.runAsUser}
                    required
                    error={
                      validationErrors["tenant_securityContext_runAsUser"] || ""
                    }
                    min="0"
                  />
                </div>
                <div className={classes.containerItem}>
                  <InputBoxWrapper
                    type="number"
                    id="tenant_securityContext_runAsGroup"
                    name="tenant_securityContext_runAsGroup"
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      updateField("tenantSecurityContext", {
                        ...tenantSecurityContext,
                        runAsGroup: e.target.value,
                      });
                      cleanValidation("tenant_securityContext_runAsGroup");
                    }}
                    label="Run As Group"
                    value={tenantSecurityContext.runAsGroup}
                    required
                    error={
                      validationErrors["tenant_securityContext_runAsGroup"] ||
                      ""
                    }
                    min="0"
                  />
                </div>
                <div className={classes.containerItem}>
                  <InputBoxWrapper
                    type="number"
                    id="tenant_securityContext_fsGroup"
                    name="tenant_securityContext_fsGroup"
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      updateField("tenantSecurityContext", {
                        ...tenantSecurityContext,
                        fsGroup: e.target.value,
                      });
                      cleanValidation("tenant_securityContext_fsGroup");
                    }}
                    label="FsGroup"
                    value={tenantSecurityContext.fsGroup}
                    required
                    error={
                      validationErrors["tenant_securityContext_fsGroup"] || ""
                    }
                    min="0"
                  />
                </div>
              </div>
            </Grid>
            <br />
            <Grid item xs={12} className={classes.configSectionItem}>
              <div className={classes.multiContainer}>
                <FormSwitchWrapper
                  value="tenantSecurityContextRunAsNonRoot"
                  id="tenant_securityContext_runAsNonRoot"
                  name="tenant_securityContext_runAsNonRoot"
                  checked={tenantSecurityContext.runAsNonRoot}
                  onChange={(e) => {
                    const targetD = e.target;
                    const checked = targetD.checked;
                    updateField("tenantSecurityContext", {
                      ...tenantSecurityContext,
                      runAsNonRoot: checked,
                    });
                  }}
                  label={"Do not run as Root"}
                />
              </div>
            </Grid>
          </fieldset>
        </Grid>
      )}
      <Grid item xs={12} className={classes.configSectionItem}>
        <FormSwitchWrapper
          value="logSearchConfig"
          id="log_search_configuration"
          name="log_search_configuration"
          checked={logSearchCustom}
          onChange={(e) => {
            const targetD = e.target;
            const checked = targetD.checked;

            updateField("logSearchCustom", checked);
          }}
          label={"Override Log Search defaults"}
        />
      </Grid>
      {logSearchCustom && (
        <Grid xs={12} className={classes.logSearchCustomFields}>
          <Grid item xs={12}>
            <SelectWrapper
              id="log_search_storage_class"
              name="log_search_storage_class"
              onChange={(e: SelectChangeEvent<string>) => {
                updateField(
                  "logSearchSelectedStorageClass",
                  e.target.value as string
                );
              }}
              label="Log Search Storage Class"
              value={logSearchSelectedStorageClass}
              options={configureSTClasses}
              disabled={configureSTClasses.length < 1}
            />
          </Grid>
          <Grid item xs={12}>
            <div className={classes.multiContainer}>
              <InputBoxWrapper
                type="number"
                id="log_search_volume_size"
                name="log_search_volume_size"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  updateField("logSearchVolumeSize", e.target.value);
                  cleanValidation("log_search_volume_size");
                }}
                label="Storage Size [Gi]"
                value={logSearchVolumeSize}
                required
                error={validationErrors["log_search_volume_size"] || ""}
                min="0"
              />
            </div>
          </Grid>

          <fieldset
            className={`${classes.fieldGroup} ${classes.fieldSpaceTop}`}
          >
            <legend className={classes.descriptionText}>
              SecurityContext for LogSearch
            </legend>

            <Grid item xs={12}>
              <div
                className={`${classes.multiContainer} ${classes.responsiveSectionItem}`}
              >
                <div className={classes.configSectionItem}>
                  <InputBoxWrapper
                    type="number"
                    id="logSearch_securityContext_runAsUser"
                    name="logSearch_securityContext_runAsUser"
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      updateField("logSearchSecurityContext", {
                        ...logSearchSecurityContext,
                        runAsUser: e.target.value,
                      });
                      cleanValidation("logSearch_securityContext_runAsUser");
                    }}
                    label="Run As User"
                    value={logSearchSecurityContext.runAsUser}
                    required
                    error={
                      validationErrors["logSearch_securityContext_runAsUser"] ||
                      ""
                    }
                    min="0"
                  />
                </div>
                <div className={classes.configSectionItem}>
                  <InputBoxWrapper
                    type="number"
                    id="logSearch_securityContext_runAsGroup"
                    name="logSearch_securityContext_runAsGroup"
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      updateField("logSearchSecurityContext", {
                        ...logSearchSecurityContext,
                        runAsGroup: e.target.value,
                      });
                      cleanValidation("logSearch_securityContext_runAsGroup");
                    }}
                    label="Run As Group"
                    value={logSearchSecurityContext.runAsGroup}
                    required
                    error={
                      validationErrors[
                        "logSearch_securityContext_runAsGroup"
                      ] || ""
                    }
                    min="0"
                  />
                </div>
                <div className={classes.configSectionItem}>
                  <InputBoxWrapper
                    type="number"
                    id="logSearch_securityContext_fsGroup"
                    name="logSearch_securityContext_fsGroup"
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      updateField("logSearchSecurityContext", {
                        ...logSearchSecurityContext,
                        fsGroup: e.target.value,
                      });
                      cleanValidation("logSearch_securityContext_fsGroup");
                    }}
                    label="FsGroup"
                    value={logSearchSecurityContext.fsGroup}
                    required
                    error={
                      validationErrors["logSearch_securityContext_fsGroup"] ||
                      ""
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
                  value="logSearchSecurityContextRunAsNonRoot"
                  id="logSearch_securityContext_runAsNonRoot"
                  name="logSearch_securityContext_runAsNonRoot"
                  checked={logSearchSecurityContext.runAsNonRoot}
                  onChange={(e) => {
                    const targetD = e.target;
                    const checked = targetD.checked;
                    updateField("logSearchSecurityContext", {
                      ...logSearchSecurityContext,
                      runAsNonRoot: checked,
                    });
                  }}
                  label={"Do not run as Root"}
                />
              </div>
            </Grid>
          </fieldset>
          <fieldset className={classes.fieldGroup}>
            <legend className={classes.descriptionText}>
              SecurityContext for PostgreSQL
            </legend>

            <Grid item xs={12}>
              <div
                className={`${classes.multiContainer} ${classes.responsiveSectionItem}`}
              >
                <div className={classes.configSectionItem}>
                  <InputBoxWrapper
                    type="number"
                    id="postgres_securityContext_runAsUser"
                    name="postgres_securityContext_runAsUser"
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      updateField("logSearchPostgresSecurityContext", {
                        ...logSearchPostgresSecurityContext,
                        runAsUser: e.target.value,
                      });
                      cleanValidation("postgres_securityContext_runAsUser");
                    }}
                    label="Run As User"
                    value={logSearchPostgresSecurityContext.runAsUser}
                    required
                    error={
                      validationErrors["postgres_securityContext_runAsUser"] ||
                      ""
                    }
                    min="0"
                  />
                </div>
                <div className={classes.configSectionItem}>
                  <InputBoxWrapper
                    type="number"
                    id="postgres_securityContext_runAsGroup"
                    name="postgres_securityContext_runAsGroup"
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      updateField("logSearchPostgresSecurityContext", {
                        ...logSearchPostgresSecurityContext,
                        runAsGroup: e.target.value,
                      });
                      cleanValidation("postgres_securityContext_runAsGroup");
                    }}
                    label="Run As Group"
                    value={logSearchPostgresSecurityContext.runAsGroup}
                    required
                    error={
                      validationErrors["postgres_securityContext_runAsGroup"] ||
                      ""
                    }
                    min="0"
                  />
                </div>
                <div className={classes.configSectionItem}>
                  <InputBoxWrapper
                    type="number"
                    id="postgres_securityContext_fsGroup"
                    name="postgres_securityContext_fsGroup"
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      updateField("logSearchPostgresSecurityContext", {
                        ...logSearchPostgresSecurityContext,
                        fsGroup: e.target.value,
                      });
                      cleanValidation("postgres_securityContext_fsGroup");
                    }}
                    label="FsGroup"
                    value={logSearchPostgresSecurityContext.fsGroup}
                    required
                    error={
                      validationErrors["postgres_securityContext_fsGroup"] || ""
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
                  value="postgresSecurityContextRunAsNonRoot"
                  id="postgres_securityContext_runAsNonRoot"
                  name="postgres_securityContext_runAsNonRoot"
                  checked={logSearchPostgresSecurityContext.runAsNonRoot}
                  onChange={(e) => {
                    const targetD = e.target;
                    const checked = targetD.checked;
                    updateField("logSearchPostgresSecurityContext", {
                      ...logSearchPostgresSecurityContext,
                      runAsNonRoot: checked,
                    });
                  }}
                  label={"Do not run as Root"}
                />
              </div>
            </Grid>
          </fieldset>
        </Grid>
      )}
      <Grid item xs={12} className={classes.configSectionItem}>
        <FormSwitchWrapper
          value="prometheusConfig"
          id="prometheus_configuration"
          name="prometheus_configuration"
          checked={prometheusCustom}
          onChange={(e) => {
            const targetD = e.target;
            const checked = targetD.checked;

            updateField("prometheusCustom", checked);
          }}
          label={"Override Prometheus defaults"}
        />
      </Grid>
      {prometheusCustom && (
        <Grid xs={12} className={classes.prometheusCustomFields}>
          <Grid item xs={12}>
            <SelectWrapper
              id="prometheus_storage_class"
              name="prometheus_storage_class"
              onChange={(e: SelectChangeEvent<string>) => {
                updateField(
                  "prometheusSelectedStorageClass",
                  e.target.value as string
                );
              }}
              label="Prometheus Storage Class"
              value={prometheusSelectedStorageClass}
              options={configureSTClasses}
              disabled={configureSTClasses.length < 1}
            />
          </Grid>
          <Grid item xs={12}>
            <div className={classes.multiContainer}>
              <InputBoxWrapper
                type="number"
                id="prometheus_volume_size"
                name="prometheus_volume_size"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  updateField("prometheusVolumeSize", e.target.value);
                  cleanValidation("prometheus_volume_size");
                }}
                label="Storage Size [Gi]"
                value={prometheusVolumeSize}
                required
                error={validationErrors["prometheus_volume_size"] || ""}
                min="0"
              />
            </div>
          </Grid>
          <fieldset
            className={`${classes.fieldGroup} ${classes.fieldSpaceTop}`}
          >
            <legend className={classes.descriptionText}>
              SecurityContext for Prometheus
            </legend>
            <Grid item xs={12} className={classes.configSectionItem}>
              <div
                className={`${classes.multiContainer} ${classes.responsiveSectionItem}`}
              >
                <div className={classes.configSectionItem}>
                  <InputBoxWrapper
                    type="number"
                    id="prometheus_securityContext_runAsUser"
                    name="prometheus_securityContext_runAsUser"
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      updateField("prometheusSecurityContext", {
                        ...prometheusSecurityContext,
                        runAsUser: e.target.value,
                      });
                      cleanValidation("prometheus_securityContext_runAsUser");
                    }}
                    label="Run As User"
                    value={prometheusSecurityContext.runAsUser}
                    required
                    error={
                      validationErrors[
                        "prometheus_securityContext_runAsUser"
                      ] || ""
                    }
                    min="0"
                  />
                </div>
                <div className={classes.configSectionItem}>
                  <InputBoxWrapper
                    type="number"
                    id="prometheus_securityContext_runAsGroup"
                    name="prometheus_securityContext_runAsGroup"
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      updateField("prometheusSecurityContext", {
                        ...prometheusSecurityContext,
                        runAsGroup: e.target.value,
                      });
                      cleanValidation("prometheus_securityContext_runAsGroup");
                    }}
                    label="Run As Group"
                    value={prometheusSecurityContext.runAsGroup}
                    required
                    error={
                      validationErrors[
                        "prometheus_securityContext_runAsGroup"
                      ] || ""
                    }
                    min="0"
                  />
                </div>
                <div className={classes.configSectionItem}>
                  <InputBoxWrapper
                    type="number"
                    id="prometheus_securityContext_fsGroup"
                    name="prometheus_securityContext_fsGroup"
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      updateField("prometheusSecurityContext", {
                        ...prometheusSecurityContext,
                        fsGroup: e.target.value,
                      });
                      cleanValidation("prometheus_securityContext_fsGroup");
                    }}
                    label="FsGroup"
                    value={prometheusSecurityContext.fsGroup}
                    required
                    error={
                      validationErrors["prometheus_securityContext_fsGroup"] ||
                      ""
                    }
                    min="0"
                  />
                </div>
              </div>
            </Grid>
            <Grid item xs={12} className={classes.configSectionItem}>
              <div
                className={`${classes.multiContainer} ${classes.fieldSpaceTop}`}
              >
                <FormSwitchWrapper
                  value="prometheusSecurityContextRunAsNonRoot"
                  id="prometheus_securityContext_runAsNonRoot"
                  name="prometheus_securityContext_runAsNonRoot"
                  checked={prometheusSecurityContext.runAsNonRoot}
                  onChange={(e) => {
                    const targetD = e.target;
                    const checked = targetD.checked;
                    updateField("prometheusSecurityContext", {
                      ...prometheusSecurityContext,
                      runAsNonRoot: checked,
                    });
                  }}
                  label={"Do not run as Root"}
                />
              </div>
            </Grid>
          </fieldset>
        </Grid>
      )}
    </Paper>
  );
};

const mapState = (state: AppState) => ({
  storageClasses: state.tenants.createTenant.storageClasses,
  customImage: state.tenants.createTenant.fields.configure.customImage,
  imageName: state.tenants.createTenant.fields.configure.imageName,
  customDockerhub: state.tenants.createTenant.fields.configure.customDockerhub,
  imageRegistry: state.tenants.createTenant.fields.configure.imageRegistry,
  imageRegistryUsername:
    state.tenants.createTenant.fields.configure.imageRegistryUsername,
  imageRegistryPassword:
    state.tenants.createTenant.fields.configure.imageRegistryPassword,
  exposeMinIO: state.tenants.createTenant.fields.configure.exposeMinIO,
  exposeConsole: state.tenants.createTenant.fields.configure.exposeConsole,
  prometheusCustom:
    state.tenants.createTenant.fields.configure.prometheusCustom,
  tenantCustom: state.tenants.createTenant.fields.configure.tenantCustom,
  logSearchCustom: state.tenants.createTenant.fields.configure.logSearchCustom,
  logSearchVolumeSize:
    state.tenants.createTenant.fields.configure.logSearchVolumeSize,
  logSearchSizeFactor:
    state.tenants.createTenant.fields.configure.logSearchSizeFactor,
  prometheusVolumeSize:
    state.tenants.createTenant.fields.configure.prometheusVolumeSize,
  prometheusSizeFactor:
    state.tenants.createTenant.fields.configure.prometheusSizeFactor,
  logSearchSelectedStorageClass:
    state.tenants.createTenant.fields.configure.logSearchSelectedStorageClass,
  logSearchImage: state.tenants.createTenant.fields.configure.logSearchImage,
  kesImage: state.tenants.createTenant.fields.configure.kesImage,
  logSearchPostgresImage:
    state.tenants.createTenant.fields.configure.logSearchPostgresImage,
  logSearchPostgresInitImage:
    state.tenants.createTenant.fields.configure.logSearchPostgresInitImage,
  prometheusSelectedStorageClass:
    state.tenants.createTenant.fields.configure.prometheusSelectedStorageClass,
  prometheusImage: state.tenants.createTenant.fields.configure.prometheusImage,
  prometheusSidecarImage:
    state.tenants.createTenant.fields.configure.prometheusSidecarImage,
  prometheusInitImage:
    state.tenants.createTenant.fields.configure.prometheusInitImage,
  selectedStorageClass:
    state.tenants.createTenant.fields.nameTenant.selectedStorageClass,
  tenantSecurityContext:
    state.tenants.createTenant.fields.configure.tenantSecurityContext,
  logSearchSecurityContext:
    state.tenants.createTenant.fields.configure.logSearchSecurityContext,
  logSearchPostgresSecurityContext:
    state.tenants.createTenant.fields.configure
      .logSearchPostgresSecurityContext,
  prometheusSecurityContext:
    state.tenants.createTenant.fields.configure.prometheusSecurityContext,
});

const connector = connect(mapState, {
  updateAddField,
  isPageValid,
});

export default withStyles(styles)(connector(Configure));
