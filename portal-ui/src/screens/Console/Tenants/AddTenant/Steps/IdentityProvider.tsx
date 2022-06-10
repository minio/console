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

import React from "react";
import { useSelector } from "react-redux";
import { Theme } from "@mui/material/styles";
import createStyles from "@mui/styles/createStyles";
import { Grid, Paper } from "@mui/material";
import {
  createTenantCommon,
  modalBasic,
  wizardCommon,
} from "../../../Common/FormComponents/common/styleLibrary";
import { AppState, useAppDispatch } from "../../../../../store";
import RadioGroupSelector from "../../../Common/FormComponents/RadioGroupSelector/RadioGroupSelector";
import { setIDP } from "../createTenantSlice";
import IDPActiveDirectory from "./IdentityProvider/IDPActiveDirectory";
import IDPOpenID from "./IdentityProvider/IDPOpenID";
import makeStyles from "@mui/styles/makeStyles";
import IDPBuiltIn from "./IdentityProvider/IDPBuiltIn";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    protocolRadioOptions: {
      display: "flex",
      flexFlow: "column",
      marginBottom: 10,

      "& label": {
        fontSize: 14,
      },
      "& div": {
        display: "flex",
        flexFlow: "column",
        alignItems: "baseline",
      },
    },
    ...createTenantCommon,
    ...modalBasic,
    ...wizardCommon,
  })
);

const IdentityProvider = () => {
  const dispatch = useAppDispatch();
  const classes = useStyles();

  const idpSelection = useSelector(
    (state: AppState) => state.createTenant.fields.identityProvider.idpSelection
  );

  return (
    <Paper className={classes.paperWrapper}>
      <div className={classes.headerElement}>
        <h3 className={classes.h3Section}>Identity Provider</h3>
        <span className={classes.descriptionText}>
          Access to the tenant can be controlled via an external Identity
          Manager.
        </span>
      </div>
      <Grid item xs={12} className={classes.protocolRadioOptions}>
        <label>Protocol</label>
        <RadioGroupSelector
          currentSelection={idpSelection}
          id="idp-options"
          name="idp-options"
          label=" "
          onChange={(e) => {
            dispatch(setIDP(e.target.value));
          }}
          selectorOptions={[
            { label: "Built-in", value: "Built-in" },
            { label: "OpenID", value: "OpenID" },
            { label: "Active Directory", value: "AD" },
          ]}
        />
      </Grid>
      {idpSelection === "Built-in" && <IDPBuiltIn />}
      {idpSelection === "OpenID" && <IDPOpenID />}
      {idpSelection === "AD" && <IDPActiveDirectory />}
    </Paper>
  );
};

export default IdentityProvider;
