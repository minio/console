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
import { IAM_PAGES } from "../../../common/SecureComponent/permissions";
import { LockIcon } from "mds";
import { openIDFormFields, openIDHelpBoxContents } from "./utils";
import IDPConfigurationDetails from "./IDPConfigurationDetails";
import AddIDPConfigurationHelpBox from "./AddIDPConfigurationHelpbox";

const IDPOpenIDConfigurationDetails = () => {
  return (
    <IDPConfigurationDetails
      backLink={IAM_PAGES.IDP_OPENID_CONFIGURATIONS}
      header={"OpenID Configurations"}
      endpoint={"/api/v1/idp/openid/"}
      idpType={"openid"}
      helpBox={
        <AddIDPConfigurationHelpBox
          helpText={"Learn more about OpenID Connect Configurations"}
          contents={openIDHelpBoxContents}
          docLink={
            "https://min.io/docs/minio/linux/operations/external-iam.html?ref=con#minio-external-iam-oidc"
          }
          docText={"Learn more about OpenID Connect Configurations"}
        />
      }
      formFields={openIDFormFields}
      icon={<LockIcon width={40} />}
    />
  );
};

export default IDPOpenIDConfigurationDetails;
