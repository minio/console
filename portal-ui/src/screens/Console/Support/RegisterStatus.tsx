//  This file is part of MinIO Console Server
//  Copyright (c) 2022 MinIO, Inc.
//
//  This program is free software: you can redistribute it and/or modify
//  it under the terms of the GNU Affero General Public License as published by
//  the Free Software Foundation, either version 3 of the License, or
//  (at your option) any later version.
//
//  This program is distributed in the hope that it will be useful,
//  but WITHOUT ANY WARRANTY; without even the implied warranty of
//  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
//  GNU Affero General Public License for more details.
//
//  You should have received a copy of the GNU Affero General Public License
//  along with this program.  If not, see <http://www.gnu.org/licenses/>.

import { Box, Grid } from "@mui/material";
import VerifiedIcon from "../../../icons/VerifiedIcon";
import React from "react";
import { Theme } from "@mui/material/styles";
import createStyles from "@mui/styles/createStyles";
import withStyles from "@mui/styles/withStyles";
import RegisterHelpBox from "./RegisterHelpBox";
import Link from "@mui/material/Link";

const styles = (theme: Theme) =>
  createStyles({
    registeredStatus: {
      border: "1px solid #E2E2E2",
      display: "flex",
      alignItems: "center",
      padding: "24px",
      borderRadius: 2,
      backgroundColor: "#FBFAFA",
      "& .min-icon": {
        width: 20,
        height: 20,
        marginRight: 13,
        verticalAlign: "middle",
      },
      "& span": {
        fontWeight: "bold",
      },
    },
  });

interface IRegisterStatus {
  classes: any;
  showHelp?: boolean;
}

function RegisterStatus({ classes, showHelp }: IRegisterStatus) {
  return (
    <Grid container>
      <Grid
        item
        xs={12}
        className={classes.registeredStatus}
        marginBottom={"25px"}
      >
        <VerifiedIcon />
        <span>Registered with MinIO SUBNET</span>
      </Grid>
      {showHelp ? (
        <React.Fragment>
          <Grid item xs={12} marginTop={"25px"}>
            <Box
              sx={{
                padding: "20px",
                border: "1px solid #eaeaea",
                "& a": {
                  color: "#2781B0",
                  cursor: "pointer",
                },
              }}
            >
              Login to{" "}
              <Link
                href="https://subnet.min.io"
                target="_blank"
                className={classes.link}
              >
                SUBNET
              </Link>{" "}
              to avail technical product support for this MinIO cluster
            </Box>
          </Grid>
          <Grid item xs={12} marginTop={"25px"} marginBottom={"25px"}>
            <RegisterHelpBox hasMargin={false} />
          </Grid>
        </React.Fragment>
      ) : null}
    </Grid>
  );
}

export default withStyles(styles)(RegisterStatus);
