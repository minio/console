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
import { useNavigate } from "react-router-dom";
import { Box, breakPoints, Button, Grid, HelpBox, WarnIcon } from "mds";

interface IRegisterCluster {
  compactMode?: boolean;
}

const RegisterCluster = ({ compactMode = false }: IRegisterCluster) => {
  const navigate = useNavigate();

  const redirectButton = (
    <Button
      id={"go-to-register"}
      type="submit"
      variant="callAction"
      color="primary"
      onClick={() => navigate("/support/register")}
    >
      Register your Cluster
    </Button>
  );

  const registerMessage =
    "Please use your MinIO Subscription Network login credentials to register this cluster and enable this feature.";

  if (compactMode) {
    return (
      <Fragment>
        <Grid
          sx={{
            "& div.leftItems": {
              marginBottom: 0,
            },
          }}
        >
          <HelpBox
            title={
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexGrow: 1,
                }}
              >
                <span>{registerMessage}</span> {redirectButton}
              </div>
            }
            iconComponent={<WarnIcon />}
            help={null}
          />
        </Grid>
        <br />
      </Fragment>
    );
  }

  return (
    <Box
      sx={{
        padding: "25px",
        border: "1px solid #eaeaea",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexFlow: "row",
        marginBottom: "15px",
        [`@media (max-width: ${breakPoints.sm}px)`]: {
          flexFlow: "column",
        },
      }}
    >
      <Grid container>
        <Grid item xs={12}>
          <Box
            sx={{
              marginRight: "8px",
              fontSize: "16px",
              fontWeight: 600,
              display: "flex",
              alignItems: "center",

              "& .min-icon": {
                width: "83px",
                height: "14px",
                marginLeft: "5px",
                marginRight: "5px",
              },
            }}
          >
            Register your cluster
          </Box>
        </Grid>
        <Grid item xs={12}>
          <Box
            sx={{
              display: "flex",
              flexFlow: "row",
              [`@media (max-width: ${breakPoints.sm}px)`]: {
                flexFlow: "column",
              },
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexFlow: "column",
                flex: "2",
              }}
            >
              <Box
                sx={{
                  fontSize: "16px",
                  display: "flex",
                  flexFlow: "column",
                  marginTop: "15px",
                  marginBottom: "15px",
                }}
              >
                {registerMessage}
              </Box>
              <Box
                sx={{
                  flex: "1",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "flex-end",
                  }}
                >
                  {redirectButton}
                </Box>
              </Box>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default RegisterCluster;
