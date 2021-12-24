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
import createStyles from "@mui/styles/createStyles";
import withStyles from "@mui/styles/withStyles";
import get from "lodash/get";
import { AppState } from "../../../../../../store";
import { isPageValid, updateAddField } from "../../../actions";
import {
  formFieldStyles,
  modalBasic,
  wizardCommon,
} from "../../../../Common/FormComponents/common/styleLibrary";
import Grid from "@mui/material/Grid";
import {
  calculateDistribution,
  erasureCodeCalc,
  getBytes,
  k8sfactorForDropdown,
  niceBytes,
  setResourcesValidation,
} from "../../../../../../common/utils";
import { clearValidationError } from "../../../utils";
import { ecListTransform, Opts } from "../../../ListTenants/utils";
import { IResourcesSize } from "../../../ListTenants/types";
import { AllocableResourcesResponse } from "../../../types";
import { ICapacity, IErasureCodeCalc } from "../../../../../../common/types";
import { commonFormValidation } from "../../../../../../utils/validationFunctions";
import api from "../../../../../../common/api";
import InputBoxWrapper from "../../../../Common/FormComponents/InputBoxWrapper/InputBoxWrapper";
import SelectWrapper from "../../../../Common/FormComponents/SelectWrapper/SelectWrapper";

interface ITenantSizeProps {
  classes: any;
  updateAddField: typeof updateAddField;
  isPageValid: typeof isPageValid;
  advancedMode: boolean;
  volumeSize: string;
  sizeFactor: string;
  drivesPerServer: string;
  nodes: string;
  memoryNode: string;
  ecParity: string;
  ecParityChoices: Opts[];
  cleanECChoices: string[];
  maxAllocableMemo: number;
  resourcesSize: IResourcesSize;
  distribution: any;
  ecParityCalc: IErasureCodeCalc;
  limitSize: any;
  selectedStorageClass: string;
  cpuToUse: string;
  maxAllocatableResources: AllocableResourcesResponse;
  maxCPUsUse: string;
  maxMemorySize: string;
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

const TenantSize = ({
  classes,
  updateAddField,
  isPageValid,
  advancedMode,
  volumeSize,
  sizeFactor,
  drivesPerServer,
  nodes,
  memoryNode,
  ecParity,
  ecParityChoices,
  cleanECChoices,
  maxAllocableMemo,
  resourcesSize,
  distribution,
  ecParityCalc,
  limitSize,
  cpuToUse,
  selectedStorageClass,
  maxAllocatableResources,
  maxCPUsUse,
  maxMemorySize,
}: ITenantSizeProps) => {
  const [validationErrors, setValidationErrors] = useState<any>({});
  const [errorFlag, setErrorFlag] = useState<boolean>(false);
  const [nodeError, setNodeError] = useState<string>("");

  // Common
  const updateField = useCallback(
    (field: string, value: any) => {
      updateAddField("tenantSize", field, value);
    },
    [updateAddField]
  );

  const cleanValidation = (fieldName: string) => {
    setValidationErrors(clearValidationError(validationErrors, fieldName));
  };

  /*Debounce functions*/

  // Storage Quotas

  const validateResourcesSize = useCallback(() => {
    const memSize = memoryNode || "0";
    const cpusSelected = cpuToUse;

    const resourcesSize = setResourcesValidation(
      parseInt(memSize),
      parseInt(cpusSelected),
      maxAllocatableResources
    );

    updateField("resourcesSize", resourcesSize);
  }, [memoryNode, cpuToUse, maxAllocatableResources, updateField]);

  useEffect(() => {
    validateResourcesSize();
  }, [memoryNode, cpuToUse, validateResourcesSize]);

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

  /*Calculate Allocation*/
  useEffect(() => {
    //Validate Cluster Size
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

    updateField("distribution", distrCalculate);
    setErrorFlag(false);
    setNodeError("");

    // Get allocatable Resources
    api
      .invoke("GET", `api/v1/cluster/allocatable-resources?num_nodes=${nodes}`)
      .then((res: AllocableResourcesResponse) => {
        updateField("maxAllocatableResources", res);

        const maxAllocatableResources = res;

        const memoryExists = get(
          maxAllocatableResources,
          "min_allocatable_mem",
          false
        );

        const cpuExists = get(
          maxAllocatableResources,
          "min_allocatable_cpu",
          false
        );

        if (memoryExists === false || cpuExists === false) {
          updateField("cpuToUse", 0);

          updateField("maxMemorySize", "0");
          updateField("maxCPUsUse", "0");

          validateResourcesSize();
          return;
        }

        // We default to Best CPU Configuration
        updateField(
          "maxMemorySize",
          res.mem_priority.max_allocatable_mem.toString()
        );
        updateField(
          "maxCPUsUse",
          res.cpu_priority.max_allocatable_cpu.toString()
        );

        updateField("maxAllocableMemo", res.mem_priority.max_allocatable_mem);

        const cpuInt = parseInt(cpuToUse);
        const maxAlocatableCPU = get(
          maxAllocatableResources,
          "cpu_priority.max_allocatable_cpu",
          0
        );

        if (cpuInt === 0 && cpuInt !== maxAlocatableCPU) {
          updateField("cpuToUse", maxAlocatableCPU);
        } else if (cpuInt > maxAlocatableCPU) {
          updateField("cpuToUse", maxAlocatableCPU);
        }

        // We reset error states
        validateResourcesSize();
      })
      .catch((err: any) => {
        updateField("maxAllocableMemo", 0);
        updateField("cpuToUse", "0");
        setErrorFlag(true);
        setNodeError(err.errorMessage);
        console.error(err);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nodes, volumeSize, sizeFactor, updateField]);

  /*Calculate Allocation End*/

  /* Validations of pages */

  useEffect(() => {
    const parsedSize = getBytes(volumeSize, sizeFactor, true);

    const commonValidation = commonFormValidation([
      {
        fieldKey: "nodes",
        required: true,
        value: nodes,
        customValidation: errorFlag,
        customValidationMessage: nodeError,
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

    isPageValid(
      "tenantSize",
      !("nodes" in commonValidation) &&
        !("volume_size" in commonValidation) &&
        !("memory_per_node" in commonValidation) &&
        !("drivesps" in commonValidation) &&
        distribution.error === "" &&
        ecParityCalc.error === 0 &&
        resourcesSize.error === "" &&
        parseInt(cpuToUse) <= parseInt(maxCPUsUse) &&
        parseInt(cpuToUse) > 0 &&
        ecParity !== ""
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
    selectedStorageClass,
    cpuToUse,
    maxCPUsUse,
    isPageValid,
    errorFlag,
    nodeError,
    drivesPerServer,
    ecParity,
  ]);

  useEffect(() => {
    if (distribution.error === "") {
      // Get EC Value
      updateField("ecParity", "");

      if (nodes.trim() !== "" && distribution.disks !== 0) {
        api
          .invoke("GET", `api/v1/get-parity/${nodes}/${distribution.disks}`)
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
  }, [distribution, isPageValid, updateField, nodes]);

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
          disabled={selectedStorageClass === ""}
          value={nodes}
          min="4"
          required
          error={validationErrors["nodes"] || ""}
          pattern={"[0-9]*"}
        />
      </Grid>
      <Grid item xs={12} className={classes.formFieldRow}>
        <InputBoxWrapper
          id="drivesps"
          name="drivesps"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            if (e.target.validity.valid) {
              updateField("drivesPerServer", e.target.value);
              cleanValidation("drivesps");
            }
          }}
          label="Number of Drives per Server"
          value={drivesPerServer}
          disabled={selectedStorageClass === ""}
          min="1"
          required
          error={validationErrors["drivesps"] || ""}
          pattern={"[0-9]*"}
        />
      </Grid>
      <Grid item xs={12}>
        <div className={classes.multiContainer}>
          <div className={classes.formFieldRow}>
            <div className={classes.compositeFieldContainer}>
              <InputBoxWrapper
                type="number"
                id="volume_size"
                name="volume_size"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  updateField("volumeSize", e.target.value);
                  cleanValidation("volume_size");
                }}
                label="Total Size"
                value={volumeSize}
                disabled={selectedStorageClass === ""}
                required
                error={validationErrors["volume_size"] || ""}
                min="0"
              />
              <div className={classes.compositeAddOn}>
                <SelectWrapper
                  label={""}
                  id="size_factor"
                  name="size_factor"
                  value={sizeFactor}
                  disabled={selectedStorageClass === ""}
                  onChange={(e: SelectChangeEvent<string>) => {
                    updateField("sizeFactor", e.target.value as string);
                  }}
                  options={k8sfactorForDropdown()}
                />
              </div>
            </div>
          </div>
        </div>
      </Grid>

      <Grid item xs={12} className={classes.formFieldRow}>
        <InputBoxWrapper
          label={"CPU Selection"}
          id={"cpuToUse"}
          name={"cpuToUse"}
          onChange={(e) => {
            if (e.target.validity.valid) {
              updateField("cpuToUse", e.target.value);
            }
          }}
          value={cpuToUse}
          disabled={selectedStorageClass === ""}
          min="1"
          max={maxCPUsUse}
          error={
            parseInt(cpuToUse) > parseInt(maxCPUsUse) ||
            parseInt(cpuToUse) <= 0 ||
            isNaN(parseInt(cpuToUse))
              ? "Invalid CPU Configuration"
              : ""
          }
          pattern={"[0-9]*"}
        />
      </Grid>

      <Grid item xs={12} className={classes.formFieldRow}>
        <InputBoxWrapper
          type="number"
          id="memory_per_node"
          name="memory_per_node"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            updateField("memoryNode", e.target.value);
            cleanValidation("memory_per_node");
          }}
          label="Memory per Node [Gi]"
          value={memoryNode}
          disabled={selectedStorageClass === ""}
          required
          error={validationErrors["memory_per_node"] || ""}
          min="2"
          max={maxMemorySize}
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
          disabled={selectedStorageClass === ""}
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
  advancedMode: state.tenants.createTenant.advancedModeOn,
  volumeSize: state.tenants.createTenant.fields.tenantSize.volumeSize,
  sizeFactor: state.tenants.createTenant.fields.tenantSize.sizeFactor,
  drivesPerServer: state.tenants.createTenant.fields.tenantSize.drivesPerServer,
  nodes: state.tenants.createTenant.fields.tenantSize.nodes,
  memoryNode: state.tenants.createTenant.fields.tenantSize.memoryNode,
  ecParity: state.tenants.createTenant.fields.tenantSize.ecParity,
  ecParityChoices: state.tenants.createTenant.fields.tenantSize.ecParityChoices,
  cleanECChoices: state.tenants.createTenant.fields.tenantSize.cleanECChoices,
  maxAllocableMemo:
    state.tenants.createTenant.fields.tenantSize.maxAllocableMemo,
  resourcesSize: state.tenants.createTenant.fields.tenantSize.resourcesSize,
  distribution: state.tenants.createTenant.fields.tenantSize.distribution,
  ecParityCalc: state.tenants.createTenant.fields.tenantSize.ecParityCalc,
  limitSize: state.tenants.createTenant.limitSize,
  selectedStorageClass:
    state.tenants.createTenant.fields.nameTenant.selectedStorageClass,
  cpuToUse: state.tenants.createTenant.fields.tenantSize.cpuToUse,
  maxAllocatableResources:
    state.tenants.createTenant.fields.tenantSize.maxAllocatableResources,
  maxCPUsUse: state.tenants.createTenant.fields.tenantSize.maxCPUsUse,
  maxMemorySize: state.tenants.createTenant.fields.tenantSize.maxMemorySize,
});

const connector = connect(mapState, {
  updateAddField,
  isPageValid,
});

export default withStyles(styles)(connector(TenantSize));
