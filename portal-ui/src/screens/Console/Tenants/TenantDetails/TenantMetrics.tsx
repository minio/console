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

import React, { useState } from "react";
import { connect } from "react-redux";
import get from "lodash/get";
import { Theme } from "@mui/material/styles";
import createStyles from "@mui/styles/createStyles";
import withStyles from "@mui/styles/withStyles";
import {
  containerForHeader,
  tenantDetailsStyles,
} from "../../Common/FormComponents/common/styleLibrary";
import { ITenant } from "../ListTenants/types";
import { setErrorSnackMessage } from "../../../../actions";
import { AppState } from "../../../../store";
import { LinearProgress } from "@mui/material";

interface ITenantMetrics {
  classes: any;
  match: any;
  tenant: ITenant | null;

  setErrorSnackMessage: typeof setErrorSnackMessage;
}

const styles = (theme: Theme) =>
  createStyles({
    ...tenantDetailsStyles,
    flexBox: {
      display: "flex",
      flexFlow: "column",
    },
    iframeStyle: {
      border: "0px",
      flex: "1 1 auto",
      minHeight: "800px",
      width: "100%",
    },
    ...containerForHeader(theme.spacing(4)),
  });

const TenantMetrics = ({ classes, match }: ITenantMetrics) => {
  const tenantName = match.params["tenantName"];
  const tenantNamespace = match.params["tenantNamespace"];

  const [loading, setLoading] = useState<boolean>(true);

  return (
    <React.Fragment>
      <h1 className={classes.sectionTitle}>Metrics</h1>
      {loading && (
        <div style={{ marginTop: "80px" }}>
          <LinearProgress />
        </div>
      )}
      <iframe
        className={classes.iframeStyle}
        title={"metrics"}
        src={`/api/proxy/${tenantNamespace}/${tenantName}/metrics?cp=y`}
        onLoad={() => {
          setLoading(false);
        }}
      />
    </React.Fragment>
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
  adEnabled: get(state.tenants.tenantDetails.tenantInfo, "idpAdEnabled", false),
  oidcEnabled: get(
    state.tenants.tenantDetails.tenantInfo,
    "idpOidcEnabled",
    false
  ),
});

const connector = connect(mapState, {
  setErrorSnackMessage,
});

export default withStyles(styles)(connector(TenantMetrics));
