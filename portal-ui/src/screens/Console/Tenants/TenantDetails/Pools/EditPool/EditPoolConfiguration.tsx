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
} from "../../../../Common/FormComponents/common/styleLibrary";
import { isEditPoolPageValid, setEditPoolField } from "../../../actions";
import { AppState } from "../../../../../../store";
import { clearValidationError } from "../../../utils";
import {
  commonFormValidation,
  IValidation,
} from "../../../../../../utils/validationFunctions";
import FormSwitchWrapper from "../../../../Common/FormComponents/FormSwitchWrapper/FormSwitchWrapper";
import InputBoxWrapper from "../../../../Common/FormComponents/InputBoxWrapper/InputBoxWrapper";
import { ISecurityContext } from "../../../types";

interface IConfigureProps {
  setEditPoolField: typeof setEditPoolField;
  isEditPoolPageValid: typeof isEditPoolPageValid;
  classes: any;
  securityContextEnabled: boolean;
  securityContext: ISecurityContext;
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


    ...modalBasic,
    ...wizardCommon,
  });

const PoolConfiguration = ({
  classes,
  setEditPoolField,
  securityContextEnabled,
  isEditPoolPageValid,
  securityContext,
}: IConfigureProps) => {
  const [validationErrors, setValidationErrors] = useState<any>({});

  // Common
  const updateField = useCallback(
    (field: string, value: any) => {
      setEditPoolField("configuration", field, value);
    },
    [setEditPoolField]
  );

  // Validation
  useEffect(() => {
    let customAccountValidation: IValidation[] = [];
    if (securityContextEnabled) {
      customAccountValidation = [
        ...customAccountValidation,
        {
          fieldKey: "pool_securityContext_runAsUser",
          required: true,
          value: securityContext.runAsUser,
          customValidation:
            securityContext.runAsUser === "" ||
            parseInt(securityContext.runAsUser) < 0,
          customValidationMessage: `runAsUser must be present and be 0 or more`,
        },
        {
          fieldKey: "pool_securityContext_runAsGroup",
          required: true,
          value: securityContext.runAsGroup,
          customValidation:
            securityContext.runAsGroup === "" ||
            parseInt(securityContext.runAsGroup) < 0,
          customValidationMessage: `runAsGroup must be present and be 0 or more`,
        },
        {
          fieldKey: "pool_securityContext_fsGroup",
          required: true,
          value: securityContext.fsGroup,
          customValidation:
            securityContext.fsGroup === "" ||
            parseInt(securityContext.fsGroup) < 0,
          customValidationMessage: `fsGroup must be present and be 0 or more`,
        },
      ];
    }

    const commonVal = commonFormValidation(customAccountValidation);

    isEditPoolPageValid("configure", Object.keys(commonVal).length === 0);

    setValidationErrors(commonVal);
  }, [isEditPoolPageValid, securityContextEnabled, securityContext]);

  const cleanValidation = (fieldName: string) => {
    setValidationErrors(clearValidationError(validationErrors, fieldName));
  };

  return (
    <Paper className={classes.paperWrapper}>
      <div className={classes.headerElement}>
        <h3 className={classes.h3Section}>Configure</h3>
      </div>
      <Grid item xs={12} className={classes.configSectionItem}>
        <FormSwitchWrapper
          value="tenantConfig"
          id="pool_configuration"
          name="pool_configuration"
          checked={securityContextEnabled}
          onChange={(e) => {
            const targetD = e.target;
            const checked = targetD.checked;

            updateField("securityContextEnabled", checked);
          }}
          label={"Security Context"}
        />
      </Grid>
      {securityContextEnabled && (
        <Grid item xs={12} className={classes.tenantCustomizationFields}>
          <fieldset className={classes.fieldGroup}>
            <legend className={classes.descriptionText}>
              Pool's Security Context
            </legend>
            <Grid item xs={12} className={`${classes.configSectionItem}`}>
              <div
                className={`${classes.multiContainer} ${classes.responsiveSectionItem}`}
              >
                <div className={classes.containerItem}>
                  <InputBoxWrapper
                    type="number"
                    id="pool_securityContext_runAsUser"
                    name="pool_securityContext_runAsUser"
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      updateField("securityContext", {
                        ...securityContext,
                        runAsUser: e.target.value,
                      });
                      cleanValidation("pool_securityContext_runAsUser");
                    }}
                    label="Run As User"
                    value={securityContext.runAsUser}
                    required
                    error={
                      validationErrors["pool_securityContext_runAsUser"] || ""
                    }
                    min="0"
                  />
                </div>
                <div className={classes.containerItem}>
                  <InputBoxWrapper
                    type="number"
                    id="pool_securityContext_runAsGroup"
                    name="pool_securityContext_runAsGroup"
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      updateField("securityContext", {
                        ...securityContext,
                        runAsGroup: e.target.value,
                      });
                      cleanValidation("pool_securityContext_runAsGroup");
                    }}
                    label="Run As Group"
                    value={securityContext.runAsGroup}
                    required
                    error={
                      validationErrors["pool_securityContext_runAsGroup"] || ""
                    }
                    min="0"
                  />
                </div>
                <div className={classes.containerItem}>
                  <InputBoxWrapper
                    type="number"
                    id="pool_securityContext_fsGroup"
                    name="pool_securityContext_fsGroup"
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      updateField("securityContext", {
                        ...securityContext,
                        fsGroup: e.target.value,
                      });
                      cleanValidation("pool_securityContext_fsGroup");
                    }}
                    label="FsGroup"
                    value={securityContext.fsGroup}
                    required
                    error={
                      validationErrors["pool_securityContext_fsGroup"] || ""
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
                  value="securityContextRunAsNonRoot"
                  id="pool_securityContext_runAsNonRoot"
                  name="pool_securityContext_runAsNonRoot"
                  checked={securityContext.runAsNonRoot}
                  onChange={(e) => {
                    const targetD = e.target;
                    const checked = targetD.checked;
                    updateField("securityContext", {
                      ...securityContext,
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

const mapState = (state: AppState) => {
  const configuration = state.tenants.editPool.fields.configuration;

  return {
    securityContextEnabled: configuration.securityContextEnabled,
    securityContext: configuration.securityContext,
  };
};

const connector = connect(mapState, {
  setEditPoolField,
  isEditPoolPageValid,
});

export default withStyles(styles)(connector(PoolConfiguration));
