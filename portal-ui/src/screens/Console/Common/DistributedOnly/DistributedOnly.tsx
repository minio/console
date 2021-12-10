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

import React, { Fragment } from "react";
import { Grid } from "@mui/material";
import HelpBox from "../../../../common/HelpBox";

interface IDistributedOnly {
  iconComponent: any;
  entity: string;
}

const DistributedOnly = ({ iconComponent, entity }: IDistributedOnly) => {
  return (
    <Grid
      container
      justifyContent={"center"}
      alignContent={"center"}
      alignItems={"center"}
    >
      <Grid item xs={8}>
        <HelpBox
          title={`${entity} not available`}
          iconComponent={iconComponent}
          help={
            <Fragment>
              This feature is not available for a single-disk setup.
              <br />
              Please deploy a server in{" "}
              <a
                href="https://docs.min.io/minio/baremetal/installation/deploy-minio-distributed.html?ref=con"
                target="_blank"
                rel="noreferrer"
              >
                Distributed Mode
              </a>{" "}
              to use this feature.
            </Fragment>
          }
        />
      </Grid>
    </Grid>
  );
};

export default DistributedOnly;
