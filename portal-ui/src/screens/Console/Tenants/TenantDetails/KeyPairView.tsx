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
  loadingTenant: state.tenants.loadingTenant,
  selectedTenant: state.tenants.currentTenant,
  tenant: state.tenants.tenantInfo,
  logEnabled: get(state.tenants.tenantInfo, "logEnabled", false),
  monitoringEnabled: get(state.tenants.tenantInfo, "monitoringEnabled", false),
  encryptionEnabled: get(state.tenants.tenantInfo, "encryptionEnabled", false),
  minioTLS: get(state.tenants.tenantInfo, "minioTLS", false),
  consoleTLS: get(state.tenants.tenantInfo, "consoleTLS", false),
  consoleEnabled: get(state.tenants.tenantInfo, "consoleEnabled", false),
  adEnabled: get(state.tenants.tenantInfo, "idpAdEnabled", false),
  oidcEnabled: get(state.tenants.tenantInfo, "idpOidcEnabled", false),
});

const connector = connect(mapState, null);

export default withStyles(styles)(connector(KeyPairView));
