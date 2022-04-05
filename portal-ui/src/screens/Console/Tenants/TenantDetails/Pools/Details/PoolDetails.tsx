// This file is part of MinIO Console Server
// Copyright (c) 2022 MinIO, Inc.
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
import {
  containerForHeader,
  spacingUtils,
  tableStyles,
  tenantDetailsStyles,
  textStyleUtils,
} from "../../../../Common/FormComponents/common/styleLibrary";
import { setErrorSnackMessage } from "../../../../../../actions";
import { AppState } from "../../../../../../store";
import { setTenantDetailsLoad } from "../../../actions";
import { Box } from "@mui/material";
import { ITenant } from "../../../ListTenants/types";
import Grid from "@mui/material/Grid";
import LabelValuePair from "../../../../Common/UsageBarWrapper/LabelValuePair";
import { niceBytesInt } from "../../../../../../common/utils";

interface IPoolDetails {
  classes: any;
  loadingTenant: boolean;
  tenant: ITenant | null;
  selectedPool: string | null;
  closeDetailsView: () => void;
  setTenantDetailsLoad: typeof setTenantDetailsLoad;
}

const styles = (theme: Theme) =>
  createStyles({
    ...spacingUtils,
    ...textStyleUtils,
    ...tenantDetailsStyles,
    ...tableStyles,
    ...containerForHeader(theme.spacing(4)),
  });

const twoColCssGridLayoutConfig = {
  display: "grid",
  gridTemplateColumns: { xs: "1fr", sm: "2fr 1fr" },
  gridAutoFlow: { xs: "dense", sm: "row" },
  gap: 2,
};

const PoolDetails = ({
  closeDetailsView,
  tenant,
  selectedPool,
}: IPoolDetails) => {
  const poolInformation =
    tenant?.pools.find((pool) => pool.name === selectedPool) || null;

  if (poolInformation === null) {
    return null;
  }

  return (
    <Fragment>
      <Grid item xs={12}>
        <Grid container>
          <Grid item xs={8}>
            <h4>Pool Configuration</h4>
          </Grid>
          <Grid item xs={4} />
        </Grid>
        <Box sx={{ ...twoColCssGridLayoutConfig }}>
          <LabelValuePair label={"Pool Name"} value={poolInformation.label} />
          <LabelValuePair
            label={"Total Volumes"}
            value={poolInformation.volumes}
          />
          <LabelValuePair
            label={"Volumes per server"}
            value={poolInformation.volumes_per_server}
          />
          <LabelValuePair label={"Capacity"} value={poolInformation.capacity} />
        </Box>
        <Grid container>
          <Grid item xs={8}>
            <h4>Resources</h4>
          </Grid>
          <Grid item xs={4} />
        </Grid>
        <Box sx={{ ...twoColCssGridLayoutConfig }}>
          {poolInformation.resources && (
            <Fragment>
              <LabelValuePair
                label={"CPU"}
                value={poolInformation.resources.requests.cpu}
              />
              <LabelValuePair
                label={"Memory"}
                value={niceBytesInt(poolInformation.resources.requests.memory)}
              />
            </Fragment>
          )}
          <LabelValuePair
            label={"Volume Size"}
            value={niceBytesInt(poolInformation.volume_configuration.size)}
          />
          <LabelValuePair
            label={"Storage Class Name"}
            value={poolInformation.volume_configuration.storage_class_name}
          />
        </Box>
      </Grid>
    </Fragment>
  );
};

const mapState = (state: AppState) => ({
  loadingTenant: state.tenants.tenantDetails.loadingTenant,
  selectedTenant: state.tenants.tenantDetails.currentTenant,
  tenant: state.tenants.tenantDetails.tenantInfo,
  selectedPool: state.tenants.tenantDetails.selectedPool,
});
const connector = connect(mapState, {
  setErrorSnackMessage,
  setTenantDetailsLoad,
});

export default withStyles(styles)(connector(PoolDetails));
