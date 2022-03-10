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

import React, { Fragment, useEffect, useState } from "react";
import { connect } from "react-redux";
import { Theme } from "@mui/material/styles";
import createStyles from "@mui/styles/createStyles";
import withStyles from "@mui/styles/withStyles";
import Grid from "@mui/material/Grid";
import {
  containerForHeader,
  tenantDetailsStyles,
} from "../../Common/FormComponents/common/styleLibrary";
import { ITenant } from "../ListTenants/types";
import { SubnetInfo } from "../../License/types";
import { setErrorSnackMessage } from "../../../../actions";
import { AppState } from "../../../../store";
import { setTenantDetailsLoad } from "../actions";
import { ErrorResponseHandler } from "../../../../common/types";
import SubnetLicenseTenant from "./SubnetLicenseTenant";
import api from "../../../../common/api";
import Loader from "../../Common/Loader/Loader";

interface ITenantLicense {
  classes: any;
  loadingTenant: boolean;
  tenant: ITenant | null;
  setTenantDetailsLoad: typeof setTenantDetailsLoad;
}

const styles = (theme: Theme) =>
  createStyles({
    ...tenantDetailsStyles,
    loaderAlign: {
      textAlign: "center",
    },
    ...containerForHeader(theme.spacing(4)),
  });

const TenantLicense = ({
  classes,
  tenant,
  loadingTenant,
  setTenantDetailsLoad,
}: ITenantLicense) => {
  const [licenseInfo, setLicenseInfo] = useState<SubnetInfo>();
  const [loadingLicenseInfo, setLoadingLicenseInfo] = useState<boolean>(true);
  const [loadingActivateProduct, setLoadingActivateProduct] =
    useState<boolean>(false);

  const activateProduct = (namespace: string, tenant: string) => {
    if (loadingActivateProduct) {
      return;
    }
    setLoadingActivateProduct(true);
    api
      .invoke(
        "POST",
        `/api/v1/subscription/namespaces/${namespace}/tenants/${tenant}/activate`,
        {}
      )
      .then(() => {
        setLoadingActivateProduct(false);
        setTenantDetailsLoad(true);
        setLoadingLicenseInfo(true);
      })
      .catch((err: ErrorResponseHandler) => {
        setLoadingActivateProduct(false);
        setErrorSnackMessage(err);
      });
  };

  useEffect(() => {
    if (loadingLicenseInfo) {
      api
        .invoke("GET", `/api/v1/subscription/info`)
        .then((res: SubnetInfo) => {
          setLicenseInfo(res);
          setLoadingLicenseInfo(false);
        })
        .catch((err: ErrorResponseHandler) => {
          setLoadingLicenseInfo(false);
        });
    }
  }, [loadingLicenseInfo]);

  return (
    <Fragment>
      <h1 className={classes.sectionTitle}>License</h1>
      {loadingTenant ? (
        <div className={classes.loaderAlign}>
          <Loader />
        </div>
      ) : (
        <Fragment>
          {tenant && (
            <Grid container>
              <Grid item xs={12}>
                <SubnetLicenseTenant
                  tenant={tenant}
                  loadingLicenseInfo={loadingLicenseInfo}
                  loadingActivateProduct={loadingActivateProduct}
                  licenseInfo={licenseInfo}
                  activateProduct={activateProduct}
                />
              </Grid>
            </Grid>
          )}
        </Fragment>
      )}
    </Fragment>
  );
};

const mapState = (state: AppState) => ({
  loadingTenant: state.tenants.tenantDetails.loadingTenant,
  tenant: state.tenants.tenantDetails.tenantInfo,
});

const connector = connect(mapState, {
  setErrorSnackMessage,
  setTenantDetailsLoad,
});

export default withStyles(styles)(connector(TenantLicense));
