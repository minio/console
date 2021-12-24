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
import { connect } from "react-redux";
import { Theme } from "@mui/material/styles";
import createStyles from "@mui/styles/createStyles";
import withStyles from "@mui/styles/withStyles";
import { Grid, Paper } from "@mui/material";
import {
  formFieldStyles,
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

interface IImagesProps {
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
}

const styles = (theme: Theme) =>
  createStyles({
    ...formFieldStyles,
    ...modalBasic,
    ...wizardCommon,
  });

const Images = ({
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
}: IImagesProps) => {
  const [validationErrors, setValidationErrors] = useState<any>({});

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
          customValidationMessage: `Volume size must be present and be greatter than 0`,
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
  ]);

  const cleanValidation = (fieldName: string) => {
    setValidationErrors(clearValidationError(validationErrors, fieldName));
  };

  return (
    <Paper className={classes.paperWrapper}>
      <div className={classes.headerElement}>
        <h3 className={classes.h3Section}>Container Images</h3>
        <span className={classes.descriptionText}>
          Images used by the Tenant Deployment
        </span>
      </div>

      <Fragment>
        <Grid item xs={12} className={classes.formFieldRow}>
          <InputBoxWrapper
            id="image"
            name="image"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              updateField("imageName", e.target.value);
              cleanValidation("image");
            }}
            label="MinIO's Image"
            value={imageName}
            error={validationErrors["image"] || ""}
            placeholder="E.g. minio/minio:RELEASE.2021-08-20T18-32-01Z"
          />
        </Grid>
        <Grid item xs={12} className={classes.formFieldRow}>
          <InputBoxWrapper
            id="logSearchImage"
            name="logSearchImage"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              updateField("logSearchImage", e.target.value);
              cleanValidation("logSearchImage");
            }}
            label="Log Search API's Image"
            value={logSearchImage}
            error={validationErrors["logSearchImage"] || ""}
            placeholder="E.g. minio/logsearchapi:v4.1.1"
          />
        </Grid>
        <Grid item xs={12} className={classes.formFieldRow}>
          <InputBoxWrapper
            id="kesImage"
            name="kesImage"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              updateField("kesImage", e.target.value);
              cleanValidation("kesImage");
            }}
            label="KES Image"
            value={kesImage}
            error={validationErrors["kesImage"] || ""}
            placeholder="E.g. minio/kes:v0.14.0"
          />
        </Grid>
        <Grid item xs={12} className={classes.formFieldRow}>
          <InputBoxWrapper
            id="logSearchPostgresImage"
            name="logSearchPostgresImage"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              updateField("logSearchPostgresImage", e.target.value);
              cleanValidation("logSearchPostgresImage");
            }}
            label="Log Search Postgres's Image"
            value={logSearchPostgresImage}
            error={validationErrors["logSearchPostgresImage"] || ""}
            placeholder="E.g. library/postgres:13"
          />
        </Grid>
        <Grid item xs={12} className={classes.formFieldRow}>
          <InputBoxWrapper
            id="logSearchPostgresInitImage"
            name="logSearchPostgresInitImage"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              updateField("logSearchPostgresInitImage", e.target.value);
              cleanValidation("logSearchPostgresInitImage");
            }}
            label="Log Search Postgres's Init Image"
            value={logSearchPostgresInitImage}
            error={validationErrors["logSearchPostgresInitImage"] || ""}
            placeholder="E.g. library/busybox:1.33.1"
          />
        </Grid>
        <Grid item xs={12} className={classes.formFieldRow}>
          <InputBoxWrapper
            id="prometheusImage"
            name="prometheusImage"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              updateField("prometheusImage", e.target.value);
              cleanValidation("prometheusImage");
            }}
            label="Prometheus Image"
            value={prometheusImage}
            error={validationErrors["prometheusImage"] || ""}
            placeholder="E.g. quay.io/prometheus/prometheus:latest"
          />
        </Grid>
        <Grid item xs={12} className={classes.formFieldRow}>
          <InputBoxWrapper
            id="prometheusSidecarImage"
            name="prometheusSidecarImage"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              updateField("prometheusSidecarImage", e.target.value);
              cleanValidation("prometheusSidecarImage");
            }}
            label="Prometheus Sidecar Image"
            value={prometheusSidecarImage}
            error={validationErrors["prometheusSidecarImage"] || ""}
            placeholder="E.g. quay.io/prometheus/prometheus:latest"
          />
        </Grid>
        <Grid item xs={12} className={classes.formFieldRow}>
          <InputBoxWrapper
            id="prometheusInitImage"
            name="prometheusInitImage"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              updateField("prometheusInitImage", e.target.value);
              cleanValidation("prometheusInitImage");
            }}
            label="Prometheus Init Image"
            value={prometheusInitImage}
            error={validationErrors["prometheusInitImage"] || ""}
            placeholder="E.g. quay.io/prometheus/prometheus:latest"
          />
        </Grid>
      </Fragment>

      {customImage && (
        <Fragment>
          <Grid item xs={12} className={classes.formFieldRow}>
            <FormSwitchWrapper
              value="custom_docker_hub"
              id="custom_docker_hub"
              name="custom_docker_hub"
              checked={customDockerhub}
              onChange={(e) => {
                const targetD = e.target;
                const checked = targetD.checked;

                updateField("customDockerhub", checked);
              }}
              label={"Set/Update Image Registry"}
            />
          </Grid>
        </Fragment>
      )}
      {customDockerhub && (
        <Fragment>
          <Grid item xs={12} className={classes.formFieldRow}>
            <InputBoxWrapper
              id="registry"
              name="registry"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                updateField("imageRegistry", e.target.value);
              }}
              label="Endpoint"
              value={imageRegistry}
              error={validationErrors["registry"] || ""}
              placeholder="E.g. https://index.docker.io/v1/"
              required
            />
          </Grid>
          <Grid item xs={12} className={classes.formFieldRow}>
            <InputBoxWrapper
              id="registryUsername"
              name="registryUsername"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                updateField("imageRegistryUsername", e.target.value);
              }}
              label="Username"
              value={imageRegistryUsername}
              error={validationErrors["registryUsername"] || ""}
              required
            />
          </Grid>
          <Grid item xs={12} className={classes.formFieldRow}>
            <InputBoxWrapper
              id="registryPassword"
              name="registryPassword"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                updateField("imageRegistryPassword", e.target.value);
              }}
              label="Password"
              value={imageRegistryPassword}
              error={validationErrors["registryPassword"] || ""}
              required
            />
          </Grid>
        </Fragment>
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
});

const connector = connect(mapState, {
  updateAddField,
  isPageValid,
});

export default withStyles(styles)(connector(Images));
