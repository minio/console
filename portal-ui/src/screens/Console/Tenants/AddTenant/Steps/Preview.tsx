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
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import { AppState } from "../../../../../store";
import {
  modalBasic,
  wizardCommon,
} from "../../../Common/FormComponents/common/styleLibrary";
import { Paper } from "@mui/material";

interface IPreviewProps {
  classes: any;
  tenantName: string;
  customImage: boolean;
  imageName: string;
  namespace: string;
  selectedStorageClass: string;
  volumeSize: string;
  sizeFactor: string;
  advancedMode: boolean;
  enableTLS: boolean;
}

const styles = (theme: Theme) =>
  createStyles({
    buttonContainer: {
      textAlign: "right",
    },
    ...modalBasic,
    ...wizardCommon,
  });

const Preview = ({
  classes,
  tenantName,
  customImage,
  imageName,
  namespace,
  selectedStorageClass,
  volumeSize,
  sizeFactor,
  advancedMode,
  enableTLS,
}: IPreviewProps) => {
  return (
    <Paper className={classes.paperWrapper}>
      <div className={classes.headerElement}>
        <h3 className={classes.h3Section}>Review</h3>
        <span className={classes.descriptionText}>
          Review the details of the new tenant
        </span>
      </div>
      <Table size="small">
        <TableBody>
          <TableRow>
            <TableCell align="right" className={classes.tableTitle}>
              Tenant Name
            </TableCell>
            <TableCell>{tenantName}</TableCell>
          </TableRow>

          {customImage && (
            <Fragment>
              <TableRow>
                <TableCell align="right" className={classes.tableTitle}>
                  MinIO Image
                </TableCell>
                <TableCell>{imageName}</TableCell>
              </TableRow>
            </Fragment>
          )}

          {namespace !== "" && (
            <TableRow>
              <TableCell align="right" className={classes.tableTitle}>
                Namespace
              </TableCell>
              <TableCell>{namespace}</TableCell>
            </TableRow>
          )}

          <TableRow>
            <TableCell align="right" className={classes.tableTitle}>
              Storage Class
            </TableCell>
            <TableCell>{selectedStorageClass}</TableCell>
          </TableRow>

          <TableRow>
            <TableCell align="right" className={classes.tableTitle}>
              Total Size
            </TableCell>
            <TableCell>
              {volumeSize} {sizeFactor}
            </TableCell>
          </TableRow>
          {advancedMode && (
            <Fragment>
              <TableRow>
                <TableCell align="right" className={classes.tableTitle}>
                  Enable TLS
                </TableCell>
                <TableCell>{enableTLS ? "Enabled" : "Disabled"}</TableCell>
              </TableRow>
            </Fragment>
          )}
        </TableBody>
      </Table>
    </Paper>
  );
};

const mapState = (state: AppState) => ({
  advancedMode: state.tenants.createTenant.advancedModeOn,
  enableTLS: state.tenants.createTenant.fields.security.enableTLS,
  tenantName: state.tenants.createTenant.fields.nameTenant.tenantName,
  selectedStorageClass:
    state.tenants.createTenant.fields.nameTenant.selectedStorageClass,
  customImage: state.tenants.createTenant.fields.configure.customImage,
  imageName: state.tenants.createTenant.fields.configure.imageName,
  namespace: state.tenants.createTenant.fields.nameTenant.namespace,
  volumeSize: state.tenants.createTenant.fields.tenantSize.volumeSize,
  sizeFactor: state.tenants.createTenant.fields.tenantSize.sizeFactor,
});

const connector = connect(mapState, {});

export default withStyles(styles)(connector(Preview));
