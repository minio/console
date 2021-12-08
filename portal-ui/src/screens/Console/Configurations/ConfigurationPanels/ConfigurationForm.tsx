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
import get from "lodash/get";
import Grid from "@mui/material/Grid";
import { configurationElements } from "../utils";
import EditConfiguration from "../../NotificationEndpoints/CustomForms/EditConfiguration";

interface IConfigurationForm {
  match: any;
  history: any;
}

const ConfigurationsList = ({ match, history }: IConfigurationForm) => {
  const activeConfRoute = get(match, "url", "");

  const configName = activeConfRoute.substring(
    activeConfRoute.lastIndexOf("/") + 1
  );

  const validActiveConfig = configurationElements.find(
    (element) => element.configuration_id === configName
  );
  const containerClassName = `${configName}`;
  return (
    <Grid item xs={12}>
      {validActiveConfig && (
        <EditConfiguration
          className={`${containerClassName}`}
          selectedConfiguration={validActiveConfig}
          history={history}
        />
      )}
    </Grid>
  );
};

export default ConfigurationsList;
