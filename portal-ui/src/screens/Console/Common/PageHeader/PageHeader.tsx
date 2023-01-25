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

import React, { Fragment } from "react";
import { Theme } from "@mui/material/styles";
import { useSelector } from "react-redux";
import Grid from "@mui/material/Grid";
import createStyles from "@mui/styles/createStyles";
import withStyles from "@mui/styles/withStyles";
import { AppState } from "../../../../store";

import { ApplicationLogo } from "mds";
import { Box } from "@mui/material";
import { selFeatures } from "../../consoleSlice";
import { selDirectPVMode, selOpMode } from "../../../../systemSlice";
import ObjectManagerButton from "../ObjectManager/ObjectManagerButton";
import { getLogoVar } from "../../../../config";

const styles = (theme: Theme) =>
  createStyles({
    headerContainer: {
      width: "100%",
      minHeight: 83,
      display: "flex",
      backgroundColor: "#fff",
      left: 0,
      borderBottom: "1px solid #E5E5E5",
    },
    label: {
      display: "flex",
      justifyContent: "flex-start",
      alignItems: "center",
    },
    rightMenu: {
      display: "flex",
      justifyContent: "flex-end",
      paddingRight: 20,
      "& button": {
        marginLeft: 8,
      },
    },
    logo: {
      marginLeft: 34,
      "& svg": {
        width: 150,
      },
    },
    middleComponent: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    },
  });

interface IPageHeader {
  classes: any;
  label: any;
  actions?: any;
  middleComponent?: React.ReactNode;
}

const PageHeader = ({
  classes,
  label,
  actions,
  middleComponent,
}: IPageHeader) => {
  const sidebarOpen = useSelector(
    (state: AppState) => state.system.sidebarOpen
  );
  const operatorMode = useSelector(selOpMode);
  const directPVMode = useSelector(selDirectPVMode);
  const features = useSelector(selFeatures);

  if (features.includes("hide-menu")) {
    return <Fragment />;
  }
  return (
    <Grid
      container
      className={`${classes.headerContainer} page-header`}
      direction="row"
      alignItems="center"
    >
      <Grid
        item
        xs={12}
        sm={12}
        md={middleComponent ? 4 : 6}
        className={classes.label}
        sx={{
          paddingTop: ["15px", "15px", "0", "0"],
        }}
      >
        {!sidebarOpen && (
          <div className={classes.logo}>
            {!operatorMode && !directPVMode ? (
              <ApplicationLogo
                applicationName={"console"}
                subVariant={getLogoVar()}
              />
            ) : (
              <Fragment>
                {directPVMode ? (
                  <ApplicationLogo applicationName={"directpv"} />
                ) : (
                  <ApplicationLogo applicationName={"operator"} />
                )}
              </Fragment>
            )}
          </div>
        )}
        <Box
          sx={{
            color: "#000",
            fontSize: 18,
            fontWeight: 700,
            marginLeft: "21px",
            display: "flex",
          }}
        >
          {label}
        </Box>
      </Grid>
      {middleComponent && (
        <Grid
          item
          xs={12}
          sm={12}
          md={4}
          className={classes.middleComponent}
          sx={{ marginTop: ["10px", "10px", "0", "0"] }}
        >
          {middleComponent}
        </Grid>
      )}
      <Grid
        item
        xs={12}
        sm={12}
        md={middleComponent ? 4 : 6}
        className={classes.rightMenu}
      >
        {actions && actions}
        <ObjectManagerButton />
      </Grid>
    </Grid>
  );
};

export default withStyles(styles)(PageHeader);
