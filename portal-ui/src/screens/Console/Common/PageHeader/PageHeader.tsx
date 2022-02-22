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
import { connect } from "react-redux";
import Grid from "@mui/material/Grid";
import createStyles from "@mui/styles/createStyles";
import withStyles from "@mui/styles/withStyles";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import { AppState } from "../../../../store";
import OperatorLogo from "../../../../icons/OperatorLogo";
import ConsoleLogo from "../../../../icons/ConsoleLogo";
import { IFileItem } from "../../ObjectBrowser/reducers";
import { toggleList } from "../../ObjectBrowser/actions";
import { ObjectManagerIcon } from "../../../../icons";

interface IPageHeader {
  classes: any;
  sidebarOpen?: boolean;
  operatorMode?: boolean;
  label: any;
  actions?: any;
  managerObjects?: IFileItem[];
  toggleList: typeof toggleList;
  middleComponent?: React.ReactNode;
  features: string[];
}

const styles = (theme: Theme) =>
  createStyles({
    headerContainer: {
      width: "100%",
      minHeight: 79,
      display: "flex",
      backgroundColor: "#fff",
      left: 0,
      boxShadow: "rgba(0,0,0,.08) 0 3px 10px",
    },
    label: {
      display: "flex",
      justifyContent: "flex-start",
      alignItems: "center",
    },
    labelStyle: {
      color: "#000",
      fontSize: 18,
      fontWeight: 700,
      marginLeft: 34,
      marginTop: 8,
    },
    rightMenu: {
      textAlign: "right",
    },
    logo: {
      marginLeft: 34,
      fill: theme.palette.primary.main,
      "& .min-icon": {
        width: 120,
      },
    },
    middleComponent: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    },
  });

const PageHeader = ({
  classes,
  label,
  actions,
  sidebarOpen,
  operatorMode,
  managerObjects,
  toggleList,
  middleComponent,
  features,
}: IPageHeader) => {
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
        md={middleComponent ? 3 : 6}
        className={classes.label}
        sx={{
          paddingTop: ["15px", "15px", "0", "0"],
        }}
      >
        {!sidebarOpen && (
          <div className={classes.logo}>
            {operatorMode ? <OperatorLogo /> : <ConsoleLogo />}
          </div>
        )}
        <Typography variant="h4" className={classes.labelStyle}>
          {label}
        </Typography>
      </Grid>
      {middleComponent && (
        <Grid
          item
          xs={12}
          sm={12}
          md={6}
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
        md={middleComponent ? 3 : 6}
        className={classes.rightMenu}
      >
        {actions && actions}
        {managerObjects && managerObjects.length > 0 && (
          <IconButton
            color="primary"
            aria-label="Refresh List"
            component="span"
            onClick={() => {
              toggleList();
            }}
            size="large"
          >
            <ObjectManagerIcon />
          </IconButton>
        )}
      </Grid>
    </Grid>
  );
};

const mapState = (state: AppState) => ({
  sidebarOpen: state.system.sidebarOpen,
  operatorMode: state.system.operatorMode,
  managerObjects: state.objectBrowser.objectManager.objectsToManage,
  features: state.console.session.features,
});

const mapDispatchToProps = {
  toggleList,
};

const connector = connect(mapState, mapDispatchToProps);

export default connector(withStyles(styles)(PageHeader));
