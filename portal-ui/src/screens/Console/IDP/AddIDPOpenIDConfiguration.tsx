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

import React from "react";

import { Theme } from "@mui/material/styles";
import createStyles from "@mui/styles/createStyles";
import withStyles from "@mui/styles/withStyles";
import { IAM_PAGES } from "../../../common/SecureComponent/permissions";
import { LockIcon } from "../../../icons";
import AddIDPConfiguration from "./AddIDPConfiguration";
import { openIDFormFields } from "./utils";
import AddIDPConfigurationHelpBox from "./AddIDPConfigurationHelpbox";

type AddIDPOpenIDConfigurationProps = {
  classes?: any;
};

const styles = (theme: Theme) => createStyles({});

const AddIDPOpenIDConfiguration = ({
  classes,
}: AddIDPOpenIDConfigurationProps) => {
  const helpBoxContents = [
    {
      text: "MinIO supports using an OpenID Connect (OIDC) compatible IDentity Provider (IDP) such as Okta, KeyCloak, Dex, Google, or Facebook for external management of user identities.",
      icon: <LockIcon />,
      iconDescription: "Create Configurations",
    },
    {
      text: "Configuring an external IDP enables Single-Sign On workflows, where applications authenticate against the external IDP before accessing MinIO.",
      icon: null,
      iconDescription: "",
    },
  ];
  return (
    <AddIDPConfiguration
      icon={<LockIcon />}
      helpBox={
        <AddIDPConfigurationHelpBox
          helpText={"Learn more about OpenID Connect Configurations"}
          contents={helpBoxContents}
          docLink={
            "https://min.io/docs/minio/linux/operations/external-iam.html?ref=con#minio-external-iam-oidc"
          }
          docText={"Learn more about OpenID Connect Configurations"}
        />
      }
      header={"OpenID Configurations"}
      backLink={IAM_PAGES.IDP_OPENID_CONFIGURATIONS}
      title={"Create OpenID Configuration"}
      endpoint={"/api/v1/idp/openid/"}
      formFields={openIDFormFields}
    />
  );
};

export default withStyles(styles)(AddIDPOpenIDConfiguration);
