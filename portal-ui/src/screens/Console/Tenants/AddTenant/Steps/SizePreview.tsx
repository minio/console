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
import { AppState } from "../../../../../store";
import { isPageValid, updateAddField } from "../../actions";
import {
  modalBasic,
  wizardCommon,
} from "../../../Common/FormComponents/common/styleLibrary";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import {
  calculateDistribution,
  erasureCodeCalc,
  getBytes,
  niceBytes,
  setMemoryResource,
} from "../../../../../common/utils";
import { ecListTransform, Opts } from "../../ListTenants/utils";
import { IMemorySize } from "../../ListTenants/types";
import {
  ErrorResponseHandler,
  ICapacity,
  IErasureCodeCalc,
} from "../../../../../common/types";
import { commonFormValidation } from "../../../../../utils/validationFunctions";
import api from "../../../../../common/api";
import { Divider } from "@mui/material";

interface ISizePreviewProps {
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
    root: {
      margin: 4,
    },
    table: {
      "& .MuiTableCell-root": {
        fontSize: 13,
      },
    },
    ...modalBasic,
    ...wizardCommon,
  });

const SizePreview = ({
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
}: ISizePreviewProps) => {
  const [errorFlag, setErrorFlag] = useState<boolean>(false);
  const [nodeError, setNodeError] = useState<string>("");
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
      setNodeError("");
      api
        .invoke(
          "GET",
          `/api/v1/cluster/max-allocatable-memory?num_nodes=${nodes}`
        )
        .then((res: { max_memory: number }) => {
          const maxMemory = res.max_memory ? res.max_memory : 0;
          updateField("maxAllocableMemo", maxMemory);
        })
        .catch((err: ErrorResponseHandler) => {
          setErrorFlag(true);
          setNodeError(err.errorMessage);
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
        .catch((err: ErrorResponseHandler) => {
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
        memorySize.error === ""
    );
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
    errorFlag,
    nodeError,
  ]);

  /* End Validation of pages */

  return (
    <div className={classes.root}>
      <h4>Resource Allocation</h4>
      <Divider />
      <Table className={classes.table} aria-label="simple table" size={"small"}>
        <TableBody>
          <TableRow>
            <TableCell scope="row">Number of Servers</TableCell>
            <TableCell align="right">
              {parseInt(nodes) > 0 ? nodes : "-"}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell scope="row">Drives per Server</TableCell>
            <TableCell align="right">
              {distribution ? distribution.disks : "-"}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell scope="row">Drive Capacity</TableCell>
            <TableCell align="right">
              {distribution ? niceBytes(distribution.pvSize) : "-"}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell scope="row">Total Volumes</TableCell>
            <TableCell align="right">
              {distribution ? distribution.persistentVolumes : "-"}
            </TableCell>
          </TableRow>
          {!advancedMode && (
            <TableRow>
              <TableCell scope="row">Memory per Node</TableCell>
              <TableCell align="right">{memoryNode} Gi</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      {ecParityCalc.error === 0 && usableInformation && (
        <Fragment>
          <h4>Erasure Code Configuration</h4>
          <Divider />
          <Table
            className={classes.table}
            aria-label="simple table"
            size={"small"}
          >
            <TableBody>
              <TableRow>
                <TableCell scope="row">EC Parity</TableCell>
                <TableCell align="right">
                  {ecParity !== "" ? ecParity : "-"}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell scope="row">Raw Capacity</TableCell>
                <TableCell align="right">
                  {niceBytes(ecParityCalc.rawCapacity)}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell scope="row">Usable Capacity</TableCell>
                <TableCell align="right">
                  {niceBytes(usableInformation.maxCapacity)}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell scope="row">Server Failures Tolerated</TableCell>
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
    </div>
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

export default withStyles(styles)(connector(SizePreview));
