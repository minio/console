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

import React, { Fragment } from "react";
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
import { niceBytes } from "../../../../../common/utils";
import { Opts } from "../../ListTenants/utils";
import { IResourcesSize } from "../../ListTenants/types";
import { IErasureCodeCalc } from "../../../../../common/types";

import { Divider } from "@mui/material";
import { IntegrationConfiguration } from "./TenantResources/utils";

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
  resourcesSize: IResourcesSize;
  distribution: any;
  ecParityCalc: IErasureCodeCalc;
  limitSize: any;
  selectedStorageClass: string;
  cpuToUse: string;
  integrationSelection: IntegrationConfiguration;
}

const styles = (theme: Theme) =>
  createStyles({
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
  resourcesSize,
  distribution,
  ecParityCalc,
  limitSize,
  selectedStorageClass,
  cpuToUse,
  integrationSelection,
}: ISizePreviewProps) => {
  const usableInformation = ecParityCalc.storageFactors.find(
    (element) => element.erasureCode === ecParity
  );

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
          {integrationSelection.typeSelection === "" &&
            integrationSelection.storageClass === "" && (
              <Fragment>
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
              </Fragment>
            )}

          <TableRow>
            <TableCell scope="row">Total Volumes</TableCell>
            <TableCell align="right">
              {distribution ? distribution.persistentVolumes : "-"}
            </TableCell>
          </TableRow>
          {integrationSelection.typeSelection === "" &&
            integrationSelection.storageClass === "" && (
              <Fragment>
                <TableRow>
                  <TableCell scope="row">Memory per Node</TableCell>
                  <TableCell align="right">{memoryNode} Gi</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell style={{ borderBottom: 0 }} scope="row">
                    CPU Selection
                  </TableCell>
                  <TableCell style={{ borderBottom: 0 }} align="right">
                    {cpuToUse}
                  </TableCell>
                </TableRow>
              </Fragment>
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
                <TableCell style={{ borderBottom: 0 }} scope="row">
                  Server Failures Tolerated
                </TableCell>
                <TableCell style={{ borderBottom: 0 }} align="right">
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
      {integrationSelection.typeSelection !== "" &&
        integrationSelection.storageClass !== "" && (
          <Fragment>
            <h4>Single Instance Configuration</h4>
            <Divider />
            <Table
              className={classes.table}
              aria-label="simple table"
              size={"small"}
            >
              <TableBody>
                <TableRow>
                  <TableCell scope="row">CPU</TableCell>
                  <TableCell align="right">
                    {integrationSelection.CPU !== 0
                      ? integrationSelection.CPU
                      : "-"}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell scope="row">Memory</TableCell>
                  <TableCell align="right">
                    {integrationSelection.memory !== 0
                      ? `${integrationSelection.memory} Gi`
                      : "-"}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell scope="row">Drives per Server</TableCell>
                  <TableCell align="right">
                    {integrationSelection.drivesPerServer !== 0
                      ? `${integrationSelection.drivesPerServer}`
                      : "-"}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell style={{ borderBottom: 0 }} scope="row">
                    Drive Size
                  </TableCell>
                  <TableCell style={{ borderBottom: 0 }} align="right">
                    {integrationSelection.driveSize.driveSize}
                    {integrationSelection.driveSize.sizeUnit}
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
  resourcesSize: state.tenants.createTenant.fields.tenantSize.resourcesSize,
  distribution: state.tenants.createTenant.fields.tenantSize.distribution,
  ecParityCalc: state.tenants.createTenant.fields.tenantSize.ecParityCalc,
  limitSize: state.tenants.createTenant.fields.tenantSize.limitSize,
  selectedStorageClass:
    state.tenants.createTenant.fields.nameTenant.selectedStorageClass,
  cpuToUse: state.tenants.createTenant.fields.tenantSize.cpuToUse,
  integrationSelection:
    state.tenants.createTenant.fields.tenantSize.integrationSelection,
});

const connector = connect(mapState, {
  updateAddField,
  isPageValid,
});

export default withStyles(styles)(connector(SizePreview));
