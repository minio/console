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
import { Box, Grid } from "@mui/material";
import { HelpBox } from "mds";

interface IFeatureNotAvailable {
  iconComponent?: any;
  title?: string;
  helpCls?: any;
  message?: any;
}

const FeatureNotAvailable = ({
  iconComponent = null,
  title = "",
  message = "",
}: IFeatureNotAvailable) => {
  return (
    <Grid container alignItems={"center"}>
      <Grid item xs={12}>
        <HelpBox
          title={title}
          iconComponent={iconComponent}
          help={
            <Box
              sx={{
                fontSize: "14px",
                display: "flex",
                border: "none",
                flexFlow: {
                  xs: "column",
                  md: "row",
                },
                "& a": {
                  color: (theme) => theme.colors.link,
                  textDecoration: "underline",
                },
              }}
            >
              {message}
            </Box>
          }
        />
      </Grid>
    </Grid>
  );
};

export default FeatureNotAvailable;
