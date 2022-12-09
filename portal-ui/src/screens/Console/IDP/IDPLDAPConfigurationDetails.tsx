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
import { ldapFormFields } from "./utils";
import LoginIcon from "@mui/icons-material/Login";
import IDPConfigurationDetails from "./IDPConfigurationDetails";
import { IAM_PAGES } from "../../../common/SecureComponent/permissions";

type IDPLDAPConfigurationDetailsProps = {
  classes?: any;
};

const styles = (theme: Theme) => createStyles({});

const IDPLDAPConfigurationDetails = ({
  classes,
}: IDPLDAPConfigurationDetailsProps) => {
  return (
    <IDPConfigurationDetails
      backLink={IAM_PAGES.IDP_LDAP_CONFIGURATIONS}
      header={"LDAP Configurations"}
      endpoint={"/api/v1/idp/ldap/"}
      idpType={"ldap"}
      formFields={ldapFormFields}
      icon={<LoginIcon width={40} />}
    />
  );
};

export default withStyles(styles)(IDPLDAPConfigurationDetails);
