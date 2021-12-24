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
import { SelectChangeEvent } from "@mui/material";
import get from "lodash/get";
import createStyles from "@mui/styles/createStyles";
import withStyles from "@mui/styles/withStyles";
import { AppState } from "../../../../../../store";
import { isPageValid, updateAddField } from "../../../actions";
import {
  formFieldStyles,
  modalBasic,
  wizardCommon,
} from "../../../../Common/FormComponents/common/styleLibrary";
import Grid from "@mui/material/Grid";
import { erasureCodeCalc, getBytes } from "../../../../../../common/utils";
import { clearValidationError } from "../../../utils";
import { ecListTransform, Opts } from "../../../ListTenants/utils";
import { IResourcesSize } from "../../../ListTenants/types";
import {
  IErasureCodeCalc,
  IStorageDistribution,
} from "../../../../../../common/types";
import { commonFormValidation } from "../../../../../../utils/validationFunctions";
import api from "../../../../../../common/api";
import InputBoxWrapper from "../../../../Common/FormComponents/InputBoxWrapper/InputBoxWrapper";
import SelectWrapper from "../../../../Common/FormComponents/SelectWrapper/SelectWrapper";
import {
  IMkEnvs,
  IntegrationConfiguration,
  mkPanelConfigurations,
} from "./utils";

interface ITenantSizeAWSProps {
  classes: any;
  updateAddField: typeof updateAddField;
  isPageValid: typeof isPageValid;
  volumeSize: string;
  sizeFactor: string;
  drivesPerServer: string;
  nodes: string;
  memoryNode: string;
  ecParity: string;
  ecParityChoices: Opts[];
  cleanECChoices: string[];
  resourcesSize: IResourcesSize;
  distribution: any;
  ecParityCalc: IErasureCodeCalc;
  limitSize: any;
  selectedStorageType: string;
  cpuToUse: string;
  maxCPUsUse: string;
  formToRender?: IMkEnvs;
  integrationSelection: IntegrationConfiguration;
}

const styles = (theme: Theme) =>
  createStyles({
    compositeFieldContainer: {
      display: "flex",
      alignItems: "center",
    },
    compositeAddOn: {
      marginLeft: 10,
      "& div": {
        marginBottom: 0,
      },
      "@media (max-width: 900px)": {
        "& div": {
          marginTop: 5,
        },
      },
    },
    ...formFieldStyles,
    ...modalBasic,
    ...wizardCommon,
  });

const TenantSizeMK = ({
  classes,
  updateAddField,
  isPageValid,
  volumeSize,
  sizeFactor,
  drivesPerServer,
  nodes,
  memoryNode,
  ecParity,
  ecParityChoices,
  cleanECChoices,
  resourcesSize,
  distribution,
  ecParityCalc,
  limitSize,
  cpuToUse,
  selectedStorageType,
  maxCPUsUse,
  formToRender,
  integrationSelection,
}: ITenantSizeAWSProps) => {
  const [validationErrors, setValidationErrors] = useState<any>({});

  // Common
  const updateField = useCallback(
    (field: string, value: any) => {
      updateAddField("tenantSize", field, value);
    },
    [updateAddField]
  );

  const updateMainField = useCallback(
    (field: string, value: string) => {
      updateAddField("nameTenant", field, value);
    },
    [updateAddField]
  );

  const cleanValidation = (fieldName: string) => {
    setValidationErrors(clearValidationError(validationErrors, fieldName));
  };

  /*Debounce functions*/

  // Storage Quotas
  useEffect(() => {
    if (ecParityChoices.length > 0 && distribution.error === "") {
      const ecCodeValidated = erasureCodeCalc(
        cleanECChoices,
        distribution.persistentVolumes,
        distribution.pvSize,
        distribution.nodes
      );

      updateField("ecParityCalc", ecCodeValidated);
      updateField("ecParity", ecCodeValidated.defaultEC);
    }
  }, [ecParityChoices.length, distribution, cleanECChoices, updateField]);
  /*End debounce functions*/

  /*Set location Storage Types*/
  useEffect(() => {
    if (formToRender !== undefined && parseInt(nodes) >= 4) {
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
          (item) => item.typeSelection === selectedStorageType
        );

        if (mainSelection) {
          updateField("integrationSelection", mainSelection);
          updateMainField("selectedStorageClass", mainSelection.storageClass);

          let pvSize = parseInt(
            getBytes(
              mainSelection.driveSize.driveSize,
              mainSelection.driveSize.sizeUnit,
              true
            ),
            10
          );

          const distrCalculate: IStorageDistribution = {
            pvSize,
            nodes: parseInt(nodes),
            disks: mainSelection.drivesPerServer,
            persistentVolumes: mainSelection.drivesPerServer * parseInt(nodes),
            error: "",
          };

          updateField("distribution", distrCalculate);
        }
      }
    }
  }, [nodes, selectedStorageType, formToRender, updateField, updateMainField]);

  /*Calculate Allocation End*/

  /* Validations of pages */

  useEffect(() => {
    const commonValidation = commonFormValidation([
      {
        fieldKey: "nodes",
        required: true,
        value: nodes,
        customValidation: parseInt(nodes) < 4,
        customValidationMessage: "Al least 4 servers must be selected",
      },
    ]);

    isPageValid(
      "tenantSize",
      !("nodes" in commonValidation) &&
        distribution.error === "" &&
        ecParityCalc.error === 0 &&
        resourcesSize.error === "" &&
        ecParity !== "" &&
        parseInt(nodes) >= 4
    );

    setValidationErrors(commonValidation);
  }, [
    nodes,
    volumeSize,
    sizeFactor,
    memoryNode,
    distribution,
    ecParityCalc,
    resourcesSize,
    limitSize,
    selectedStorageType,
    cpuToUse,
    maxCPUsUse,
    isPageValid,
    drivesPerServer,
    ecParity,
  ]);

  useEffect(() => {
    if (integrationSelection.drivesPerServer !== 0) {
      // Get EC Value
      updateField("ecParity", "");

      if (nodes.trim() !== "") {
        api
          .invoke(
            "GET",
            `api/v1/get-parity/${nodes}/${integrationSelection.drivesPerServer}`
          )
          .then((ecList: string[]) => {
            updateField("ecParityChoices", ecListTransform(ecList));
            updateField("cleanECChoices", ecList);
          })
          .catch((err: any) => {
            updateField("ecparityChoices", []);
            isPageValid("tenantSize", false);
            updateField("ecParity", "");
          });
      }
    }
  }, [integrationSelection, nodes, isPageValid, updateField]);

  /* End Validation of pages */

  return (
    <Fragment>
      <Grid item xs={12}>
        <div className={classes.headerElement}>
          <h3 className={classes.h3Section}>Tenant Size</h3>
          <span className={classes.descriptionText}>
            Please select the desired capacity
          </span>
        </div>
      </Grid>
      {distribution.error !== "" && (
        <Grid item xs={12}>
          <div className={classes.error}>{distribution.error}</div>
        </Grid>
      )}
      {resourcesSize.error !== "" && (
        <Grid item xs={12}>
          <div className={classes.error}>{resourcesSize.error}</div>
        </Grid>
      )}
      <Grid item xs={12} className={classes.formFieldRow}>
        <InputBoxWrapper
          id="nodes"
          name="nodes"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            if (e.target.validity.valid) {
              updateField("nodes", e.target.value);
              cleanValidation("nodes");
            }
          }}
          label="Number of Servers"
          disabled={selectedStorageType === ""}
          value={nodes}
          min="4"
          required
          error={validationErrors["nodes"] || ""}
          pattern={"[0-9]*"}
        />
      </Grid>
      <Grid item xs={12} className={classes.formFieldRow}>
        <SelectWrapper
          id="ec_parity"
          name="ec_parity"
          onChange={(e: SelectChangeEvent<string>) => {
            updateField("ecParity", e.target.value as string);
          }}
          label="Erasure Code Parity"
          disabled={selectedStorageType === ""}
          value={ecParity}
          options={ecParityChoices}
        />
        <span className={classes.descriptionText}>
          Please select the desired parity. This setting will change the max
          usable capacity in the cluster
        </span>
      </Grid>
    </Fragment>
  );
};

const mapState = (state: AppState) => ({
  volumeSize: state.tenants.createTenant.fields.tenantSize.volumeSize,
  sizeFactor: state.tenants.createTenant.fields.tenantSize.sizeFactor,
  drivesPerServer: state.tenants.createTenant.fields.tenantSize.drivesPerServer,
  nodes: state.tenants.createTenant.fields.tenantSize.nodes,
  memoryNode: state.tenants.createTenant.fields.tenantSize.memoryNode,
  ecParity: state.tenants.createTenant.fields.tenantSize.ecParity,
  ecParityChoices: state.tenants.createTenant.fields.tenantSize.ecParityChoices,
  cleanECChoices: state.tenants.createTenant.fields.tenantSize.cleanECChoices,
  resourcesSize: state.tenants.createTenant.fields.tenantSize.resourcesSize,
  distribution: state.tenants.createTenant.fields.tenantSize.distribution,
  ecParityCalc: state.tenants.createTenant.fields.tenantSize.ecParityCalc,
  limitSize: state.tenants.createTenant.limitSize,
  selectedStorageType:
    state.tenants.createTenant.fields.nameTenant.selectedStorageType,
  cpuToUse: state.tenants.createTenant.fields.tenantSize.cpuToUse,
  maxCPUsUse: state.tenants.createTenant.fields.tenantSize.maxCPUsUse,
  integrationSelection:
    state.tenants.createTenant.fields.tenantSize.integrationSelection,
});

const connector = connect(mapState, {
  updateAddField,
  isPageValid,
});

export default withStyles(styles)(connector(TenantSizeMK));
