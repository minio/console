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

import React, { Fragment, useEffect, useState } from "react";

import { Theme } from "@mui/material/styles";
import createStyles from "@mui/styles/createStyles";
import withStyles from "@mui/styles/withStyles";

import {
  fieldBasic,
  settingsCommon,
} from "../../Common/FormComponents/common/styleLibrary";

import TableWrapper from "../../Common/TableWrapper/TableWrapper";

const styles = (theme: Theme) =>
  createStyles({
    ...fieldBasic,
    ...settingsCommon,
    settingsFormContainer: {
      display: "grid",
      gridTemplateColumns: "1fr",
      gridGap: "10px",
    },
  });

interface IEndpointDisplayProps {
  // selectedConfiguration: IConfigurationElement;
  classes: any;
  configSubsysList: any[];
  className?: string;
}

const EndpointDisplay = ({
  // selectedConfiguration,
  classes,
  configSubsysList,
  className = "",
}: IEndpointDisplayProps) => {
  const [configRecords, setConfigRecords] = useState<any>([]);

  useEffect(() => {
    let records: any[] = [];
    if (configSubsysList !== null) {
      configSubsysList.forEach((config) => {
        if (config.name !== null && config.key_values !== null) {
          records.push({
            name: config.name,
            endpoint: config.key_values[0]["value"],
          });
          if (config.key_values[0]["value"] === "off") {
            records = [];
          }
        }
      });
      setConfigRecords(records);
    }
  }, [configSubsysList]);

  return (
    <Fragment>
      <h3>Currently Configured Endpoints</h3>

      <TableWrapper
        columns={[
          { label: "Name", elementKey: "name" },
          { label: "Endpoint", elementKey: "endpoint" },
        ]}
        idField="config-id"
        isLoading={false}
        records={configRecords}
        classes={classes}
        entityName="endpoints"
      />
    </Fragment>
  );
};

export default withStyles(styles)(EndpointDisplay);
