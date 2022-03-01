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
import { Grid, Paper } from "@mui/material";
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
import { ISecurityContext } from "../../types";

interface IConfigureProps {
  updateAddField: typeof updateAddField;
  isPageValid: typeof isPageValid;
  classes: any;
  exposeMinIO: boolean;
  exposeConsole: boolean;
  tenantCustom: boolean;
  tenantSecurityContext: ISecurityContext;
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

    fieldSpaceTop: {
      marginTop: 15,
    },

    ...modalBasic,
    ...wizardCommon,
  });

const Configure = ({
  classes,
  exposeMinIO,
  exposeConsole,
  tenantCustom,
  updateAddField,
  isPageValid,
  tenantSecurityContext,
}: IConfigureProps) => {
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

    const commonVal = commonFormValidation(customAccountValidation);

    isPageValid("configure", Object.keys(commonVal).length === 0);

    setValidationErrors(commonVal);
  }, [isPageValid, tenantCustom, tenantSecurityContext]);

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
        <h3 className={classes.h3Section}>Services</h3>
        <span className={classes.descriptionText}>
          Whether the tenant's services should request an external IP via
          LoadBalancer service type.
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
          label={"Security Context"}
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
    </Paper>
  );
};

const mapState = (state: AppState) => ({
  exposeMinIO: state.tenants.createTenant.fields.configure.exposeMinIO,
  exposeConsole: state.tenants.createTenant.fields.configure.exposeConsole,
  tenantCustom: state.tenants.createTenant.fields.configure.tenantCustom,
  tenantSecurityContext:
    state.tenants.createTenant.fields.configure.tenantSecurityContext,
});

const connector = connect(mapState, {
  updateAddField,
  isPageValid,
});

export default withStyles(styles)(connector(Configure));
