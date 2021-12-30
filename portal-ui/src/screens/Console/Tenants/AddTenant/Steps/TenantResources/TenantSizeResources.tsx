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

import React, { Fragment, useCallback, useEffect } from "react";
import { connect } from "react-redux";
import { Theme } from "@mui/material/styles";
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
import { IResourcesSize } from "../../../ListTenants/types";
import { AllocableResourcesResponse } from "../../../types";
import api from "../../../../../../common/api";
import InputBoxWrapper from "../../../../Common/FormComponents/InputBoxWrapper/InputBoxWrapper";
import FormSwitchWrapper from "../../../../Common/FormComponents/FormSwitchWrapper/FormSwitchWrapper";
import { floor } from "lodash";

interface ITenantSizeResourcesProps {
  classes: any;
  updateAddField: typeof updateAddField;
  isPageValid: typeof isPageValid;
  nodes: string;
  resourcesSize: IResourcesSize;
  selectedStorageClass: string;
  maxAllocatableResources: AllocableResourcesResponse;
  maxCPUsUse: string;
  maxMemorySize: string;

  resourcesSpecifyLimit: boolean;
  resourcesCPURequestError: string;
  resourcesCPURequest: string;
  resourcesCPULimitError: string;
  resourcesCPULimit: string;
  resourcesMemoryRequestError: string;
  resourcesMemoryRequest: string;
  resourcesMemoryLimitError: string;
  resourcesMemoryLimit: string;
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

const TenantSizeResources = ({
  classes,
  updateAddField,
  isPageValid,
  nodes,

  resourcesSize,
  selectedStorageClass,
  maxAllocatableResources,
  maxCPUsUse,
  maxMemorySize,
  resourcesSpecifyLimit,
  resourcesCPURequestError,
  resourcesCPURequest,
  resourcesCPULimitError,
  resourcesCPULimit,
  resourcesMemoryRequestError,
  resourcesMemoryRequest,
  resourcesMemoryLimitError,
  resourcesMemoryLimit,
}: ITenantSizeResourcesProps) => {
  // Common
  const updateField = useCallback(
    (field: string, value: any) => {
      updateAddField("tenantSize", field, value);
    },
    [updateAddField]
  );

  /*Debounce functions*/

  useEffect(() => {
    isPageValid(
      "tenantSize",
      resourcesMemoryRequestError === "" &&
        resourcesMemoryLimitError === "" &&
        resourcesCPURequestError === "" &&
        resourcesCPULimitError === ""
    );
  }, [
    isPageValid,
    resourcesMemoryRequestError,
    resourcesMemoryLimitError,
    resourcesCPURequestError,
    resourcesCPULimitError,
  ]);

  /*End debounce functions*/

  /*Calculate Allocation*/
  useEffect(() => {
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

          updateField("maxMemorySize", "");
          updateField("maxCPUsUse", "");

          return;
        }

        const maxMemory = floor(
          res.mem_priority.max_allocatable_mem / 1024 / 1024 / 1024
        );
        // We default to Best CPU Configuration
        updateField("maxMemorySize", maxMemory.toString());
        updateField(
          "maxCPUsUse",
          res.cpu_priority.max_allocatable_cpu.toString()
        );

        const maxAllocatableCPU = get(
          maxAllocatableResources,
          "cpu_priority.max_allocatable_cpu",
          0
        );

        const baseCpuUse = Math.max(1, floor(maxAllocatableCPU / 2));
        updateField("resourcesCPURequest", baseCpuUse);

        const baseMemoryUse = Math.max(2, floor(maxMemory / 2));
        updateField("resourcesMemoryRequest", baseMemoryUse);
      })
      .catch((err: any) => {
        updateField("maxMemorySize", 0);
        updateField("resourcesCPURequest", "");

        console.error(err);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nodes, updateField]);

  /*Calculate Allocation End*/

  return (
    <Fragment>
      <Grid item xs={12}>
        <div className={classes.headerElement}>
          <h3 className={classes.h3Section}>Resources</h3>
          <span className={classes.descriptionText}>
            You may specify the amount of CPU and Memory that MinIO servers
            should reserve on each node.
          </span>
        </div>
      </Grid>
      {resourcesSize.error !== "" && (
        <Grid item xs={12}>
          <div className={classes.error}>{resourcesSize.error}</div>
        </Grid>
      )}

      <Grid item xs={12} className={classes.formFieldRow}>
        <InputBoxWrapper
          label={"CPU Request"}
          id={"resourcesCPURequest"}
          name={"resourcesCPURequest"}
          onChange={(e) => {
            let value = parseInt(e.target.value);
            if (e.target.value === "") {
              updateField("resourcesCPURequestError", "");
            } else if (isNaN(value)) {
              updateField("resourcesCPURequestError", "Invalid number");
            } else if (value > parseInt(maxCPUsUse)) {
              updateField(
                "resourcesCPURequestError",
                `Request exceeds available cores (${maxCPUsUse})`
              );
            } else if (e.target.validity.valid) {
              updateField("resourcesCPURequestError", "");
            } else {
              updateField("resourcesCPURequestError", "Invalid configuration");
            }
            updateField("resourcesCPURequest", e.target.value);
          }}
          value={resourcesCPURequest}
          disabled={selectedStorageClass === ""}
          max={maxCPUsUse}
          error={resourcesCPURequestError}
          pattern={"[0-9]*"}
        />
      </Grid>

      <Grid item xs={12} className={classes.formFieldRow}>
        <InputBoxWrapper
          id="resourcesMemoryRequest"
          name="resourcesMemoryRequest"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            let value = parseInt(e.target.value);
            if (e.target.value === "") {
              updateField("resourcesMemoryRequestError", "");
            } else if (isNaN(value)) {
              updateField("resourcesMemoryRequestError", "Invalid number");
            } else if (value > parseInt(maxMemorySize)) {
              updateField(
                "resourcesMemoryRequestError",
                `Request exceeds available memory across ${nodes} nodes (${maxMemorySize}Gi)`
              );
            } else if (value < 2) {
              updateField(
                "resourcesMemoryRequestError",
                "At least 2Gi must be requested"
              );
            } else if (e.target.validity.valid) {
              updateField("resourcesMemoryRequestError", "");
            } else {
              updateField(
                "resourcesMemoryRequestError",
                "Invalid configuration"
              );
            }
            updateField("resourcesMemoryRequest", e.target.value);
          }}
          label="Memory Request [Gi]"
          value={resourcesMemoryRequest}
          disabled={selectedStorageClass === ""}
          error={resourcesMemoryRequestError}
          pattern={"[0-9]*"}
        />
      </Grid>

      <Grid item xs={12}>
        <FormSwitchWrapper
          value="resourcesSpecifyLimit"
          id="resourcesSpecifyLimit"
          name="resourcesSpecifyLimit"
          checked={resourcesSpecifyLimit}
          onChange={(e) => {
            const targetD = e.target;
            const checked = targetD.checked;

            updateField("resourcesSpecifyLimit", checked);
          }}
          label={"Specify Limit"}
        />
      </Grid>

      {resourcesSpecifyLimit && (
        <Fragment>
          <Grid item xs={12} className={classes.formFieldRow}>
            <InputBoxWrapper
              label={"CPU Limit"}
              id={"resourcesCPULimit"}
              name={"resourcesCPULimit"}
              onChange={(e) => {
                let value = parseInt(e.target.value);
                if (e.target.value === "") {
                  updateField("resourcesCPULimitError", "");
                } else if (isNaN(value)) {
                  updateField("resourcesCPULimitError", "Invalid number");
                } else if (e.target.validity.valid) {
                  updateField("resourcesCPULimitError", "");
                } else {
                  updateField(
                    "resourcesCPULimitError",
                    "Invalid configuration"
                  );
                }
                updateField("resourcesCPULimit", e.target.value);
              }}
              value={resourcesCPULimit}
              disabled={selectedStorageClass === ""}
              max={maxCPUsUse}
              error={resourcesCPULimitError}
              pattern={"[0-9]*"}
            />
          </Grid>

          <Grid item xs={12} className={classes.formFieldRow}>
            <InputBoxWrapper
              id="resourcesMemoryLimit"
              name="resourcesMemoryLimit"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                let value = parseInt(e.target.value);
                console.log("value", value);
                if (e.target.value === "") {
                  updateField("resourcesMemoryLimitError", "");
                } else if (isNaN(value)) {
                  updateField("resourcesMemoryLimitError", "Invalid number");
                } else if (e.target.validity.valid) {
                  updateField("resourcesMemoryLimitError", "");
                } else {
                  updateField(
                    "resourcesMemoryLimitError",
                    "Invalid configuration"
                  );
                }
                updateField("resourcesMemoryLimit", e.target.value);
              }}
              label="Memory Limit [Gi]"
              value={resourcesMemoryLimit}
              disabled={selectedStorageClass === ""}
              error={resourcesMemoryLimitError}
              pattern={"[0-9]*"}
            />
          </Grid>
        </Fragment>
      )}
    </Fragment>
  );
};

const mapState = (state: AppState) => ({
  nodes: state.tenants.createTenant.fields.tenantSize.nodes,

  resourcesSize: state.tenants.createTenant.fields.tenantSize.resourcesSize,
  selectedStorageClass:
    state.tenants.createTenant.fields.nameTenant.selectedStorageClass,
  maxAllocatableResources:
    state.tenants.createTenant.fields.tenantSize.maxAllocatableResources,
  maxCPUsUse: state.tenants.createTenant.fields.tenantSize.maxCPUsUse,
  maxMemorySize: state.tenants.createTenant.fields.tenantSize.maxMemorySize,

  resourcesSpecifyLimit:
    state.tenants.createTenant.fields.tenantSize.resourcesSpecifyLimit,

  resourcesCPURequestError:
    state.tenants.createTenant.fields.tenantSize.resourcesCPURequestError,
  resourcesCPURequest:
    state.tenants.createTenant.fields.tenantSize.resourcesCPURequest,
  resourcesCPULimitError:
    state.tenants.createTenant.fields.tenantSize.resourcesCPULimitError,
  resourcesCPULimit:
    state.tenants.createTenant.fields.tenantSize.resourcesCPULimit,

  resourcesMemoryRequestError:
    state.tenants.createTenant.fields.tenantSize.resourcesMemoryRequestError,
  resourcesMemoryRequest:
    state.tenants.createTenant.fields.tenantSize.resourcesMemoryRequest,
  resourcesMemoryLimitError:
    state.tenants.createTenant.fields.tenantSize.resourcesMemoryLimitError,
  resourcesMemoryLimit:
    state.tenants.createTenant.fields.tenantSize.resourcesMemoryLimit,
});

const connector = connect(mapState, {
  updateAddField,
  isPageValid,
});

export default withStyles(styles)(connector(TenantSizeResources));
