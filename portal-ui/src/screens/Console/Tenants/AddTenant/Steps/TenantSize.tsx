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

import React, { Fragment, useState, useEffect, useCallback } from "react";
import { connect } from "react-redux";
import { createStyles, Theme, withStyles } from "@material-ui/core/styles";
import { AppState } from "../../../../../store";
import { updateAddField, isPageValid } from "../../actions";
import {
  wizardCommon,
  modalBasic,
} from "../../../Common/FormComponents/common/styleLibrary";
import Grid from "@material-ui/core/Grid";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";
import {
  getBytes,
  k8sfactorForDropdown,
  niceBytes,
  calculateDistribution,
  erasureCodeCalc,
  setMemoryResource,
} from "../../../../../common/utils";
import { clearValidationError } from "../../utils";
import { ecListTransform, Opts } from "../../ListTenants/utils";
import { IMemorySize } from "../../ListTenants/types";
import { ICapacity, IErasureCodeCalc } from "../../../../../common/types";
import api from "../../../../../common/api";
import InputBoxWrapper from "../../../Common/FormComponents/InputBoxWrapper/InputBoxWrapper";
import SelectWrapper from "../../../Common/FormComponents/SelectWrapper/SelectWrapper";
import { commonFormValidation } from "../../../../../utils/validationFunctions";

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
  memorySize: IMemorySize;
  distribution: any;
  ecParityCalc: IErasureCodeCalc;
  limitSize: any;
  selectedStorageClass: string;
}

const styles = (theme: Theme) =>
  createStyles({
    buttonContainer: {
      textAlign: "right",
    },
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
  memorySize,
  distribution,
  ecParityCalc,
  limitSize,
  selectedStorageClass,
}: ITenantSizeProps) => {
  const [validationErrors, setValidationErrors] = useState<any>({});
  const usableInformation = ecParityCalc.storageFactors.find(
    (element) => element.erasureCode === ecParity
  );

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

    updateField("memorySize", memoSize);
  }, [maxAllocableMemo, memoryNode, sizeFactor, updateField, volumeSize]);

  const getMaxAllocableMemory = (nodes: string) => {
    if (nodes !== "" && !isNaN(parseInt(nodes))) {
      api
        .invoke(
          "GET",
          `/api/v1/cluster/max-allocatable-memory?num_nodes=${nodes}`
        )
        .then((res: { max_memory: number }) => {
          const maxMemory = res.max_memory ? res.max_memory : 0;
          updateField("maxAllocableMemo", maxMemory);
        })
        .catch((err: any) => {
          updateField("maxAllocableMemo", 0);
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

    updateField("distribution", distrCalculate);
  };

  const getECValue = () => {
    updateField("ecParity", "");

    if (nodes.trim() !== "" && drivesPerServer.trim() !== "") {
      api
        .invoke("GET", `/api/v1/get-parity/${nodes}/${drivesPerServer}`)
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
  };
  /*Calculate Allocation End*/

  /* Validations of pages */

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

    isPageValid(
      "tenantSize",
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
    isPageValid,
  ]);

  /* End Validation of pages */

  return (
    <Fragment>
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
            updateField("nodes", e.target.value);
            cleanValidation("nodes");
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
            updateField("drivesPerServer", e.target.value);
            cleanValidation("drivesps");
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
                updateField("volumeSize", e.target.value);
                cleanValidation("volume_size");
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
                updateField("sizeFactor", e.target.value as string);
              }}
              options={k8sfactorForDropdown()}
            />
          </div>
        </div>
      </Grid>
      {advancedMode && (
        <Fragment>
          <Grid item xs={12}>
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
                updateField("ecParity", e.target.value as string);
              }}
              label="Erasure Code Parity"
              value={ecParity}
              options={ecParityChoices}
            />
            <span className={classes.descriptionText}>
              Please select the desired parity. This setting will change the max
              usable capacity in the cluster
            </span>
          </Grid>
        </Fragment>
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
        <Fragment>
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
        </Fragment>
      )}
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
  memorySize: state.tenants.createTenant.fields.tenantSize.memorySize,
  distribution: state.tenants.createTenant.fields.tenantSize.distribution,
  ecParityCalc: state.tenants.createTenant.fields.tenantSize.ecParityCalc,
  limitSize: state.tenants.createTenant.fields.tenantSize.limitSize,
  selectedStorageClass:
    state.tenants.createTenant.fields.nameTenant.selectedStorageClass,
});

const connector = connect(mapState, {
  updateAddField,
  isPageValid,
});

export default withStyles(styles)(connector(TenantSize));
