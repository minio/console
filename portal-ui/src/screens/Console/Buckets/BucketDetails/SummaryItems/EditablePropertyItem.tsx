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
import LabelValuePair from "../../../Common/UsageBarWrapper/LabelValuePair";
import SecureComponent from "../../../../../common/SecureComponent/SecureComponent";
import ActionLink from "./ActionLink";
import { Box } from "@mui/material";
import EditActionButton from "./EditActionButton";

type PolicyItemProps = {
  isLoading: boolean;
  resourceName: string;
  iamScopes: string[];
  property: any;
  value: any;
  onEdit: () => void;
};

const SecureAction = ({
  resourceName,
  iamScopes,
  children,
}: {
  resourceName: string;
  iamScopes: string[];
  children: any;
}) => {
  return (
    <SecureComponent
      scopes={iamScopes}
      resource={resourceName}
      errorProps={{ disabled: true }}
    >
      {children}
    </SecureComponent>
  );
};

const EditablePropertyItem = ({
  isLoading = true,
  resourceName = "",
  iamScopes,
  property = null,
  value = null,
  onEdit,
}: PolicyItemProps) => {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "baseline",
        justifyContent: "flex-start",
      }}
    >
      <LabelValuePair
        label={property}
        value={
          <SecureAction resourceName={resourceName} iamScopes={iamScopes}>
            <ActionLink isLoading={isLoading} onClick={onEdit} label={value} />
          </SecureAction>
        }
      />
      <SecureAction resourceName={resourceName} iamScopes={iamScopes}>
        <EditActionButton
          onClick={onEdit}
          sx={{
            background: "#f8f8f8",
            marginLeft: "3px",
            top: 3,
            "& .min-icon": {
              width: "16px",
              height: "16px",
            },
          }}
        />
      </SecureAction>
    </Box>
  );
};

export default EditablePropertyItem;
