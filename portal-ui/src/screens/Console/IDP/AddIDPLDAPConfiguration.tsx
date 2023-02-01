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
import LoginIcon from "@mui/icons-material/Login";
import { IAM_PAGES } from "../../../common/SecureComponent/permissions";
import AddIDPConfiguration from "./AddIDPConfiguration";
import { ldapFormFields, ldapHelpBoxContents } from "./utils";
import AddIDPConfigurationHelpBox from "./AddIDPConfigurationHelpbox";

const AddIDPLDAPConfiguration = () => {
  return (
    <AddIDPConfiguration
      icon={<LoginIcon />}
      helpBox={
        <AddIDPConfigurationHelpBox
          helpText={"Learn more about LDAP Configurations"}
          contents={ldapHelpBoxContents}
          docLink={
            "https://min.io/docs/minio/linux/operations/external-iam.html?ref=con#minio-external-iam-ad-ldap"
          }
          docText={"Learn more about LDAP Configurations"}
        />
      }
      header={"LDAP Configurations"}
      backLink={IAM_PAGES.IDP_LDAP_CONFIGURATIONS}
      title={"Create LDAP Configuration"}
      endpoint={"/api/v1/idp/ldap/"}
      formFields={ldapFormFields}
    />
  );
};

export default AddIDPLDAPConfiguration;
