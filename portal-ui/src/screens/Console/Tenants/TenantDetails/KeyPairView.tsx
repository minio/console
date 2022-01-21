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
import get from "lodash/get";
import createStyles from "@mui/styles/createStyles";
import withStyles from "@mui/styles/withStyles";
import { Theme } from "@mui/material/styles";
import {
  containerForHeader,
  tenantDetailsStyles,
} from "../../Common/FormComponents/common/styleLibrary";
import { AppState } from "../../../../store";
import TableWrapper from "../../Common/TableWrapper/TableWrapper";
import { IKeyValue } from "../ListTenants/types";

interface IKeyPairView {
  classes: any;
  records: IKeyValue[];
  recordName: string;
}

const styles = (theme: Theme) =>
  createStyles({
    ...tenantDetailsStyles,
    centerAlign: {
      textAlign: "center",
    },
    listHeight: {
      height: "50",
    },
    ...containerForHeader(theme.spacing(4)),
  });

const KeyPairView = ({ classes, records, recordName }: IKeyPairView) => {
  return (
    <Fragment>
      <TableWrapper
        columns={[
          { label: "Key", elementKey: "key" },
          { label: "Value", elementKey: "value" },
        ]}
        isLoading={false}
        records={records}
        itemActions={[]}
        entityName={recordName}
        idField="name"
        customPaperHeight={classes.listHeight}
      />
    </Fragment>
  );
};

const mapState = (state: AppState) => ({
  loadingTenant: state.tenants.tenantDetails.loadingTenant,
  selectedTenant: state.tenants.tenantDetails.currentTenant,
  tenant: state.tenants.tenantDetails.tenantInfo,
  logEnabled: get(state.tenants.tenantDetails.tenantInfo, "logEnabled", false),
  monitoringEnabled: get(
    state.tenants.tenantDetails.tenantInfo,
    "monitoringEnabled",
    false
  ),
  encryptionEnabled: get(
    state.tenants.tenantDetails.tenantInfo,
    "encryptionEnabled",
    false
  ),
  minioTLS: get(state.tenants.tenantDetails.tenantInfo, "minioTLS", false),
  consoleTLS: get(state.tenants.tenantDetails.tenantInfo, "consoleTLS", false),
  consoleEnabled: get(
    state.tenants.tenantDetails.tenantInfo,
    "consoleEnabled",
    false
  ),
  adEnabled: get(state.tenants.tenantDetails.tenantInfo, "idpAdEnabled", false),
  oidcEnabled: get(
    state.tenants.tenantDetails.tenantInfo,
    "idpOidcEnabled",
    false
  ),
});

const connector = connect(mapState, null);

export default withStyles(styles)(connector(KeyPairView));
