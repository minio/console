import React from "react";
import { Theme } from "@mui/material/styles";
import { connect } from "react-redux";
import { Box } from "@mui/material";
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
}

const styles = (theme: Theme) =>
  createStyles({
    headerContainer: {
      // position: "absolute",
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
  });

const PageHeader = ({
  classes,
  label,
  actions,
  sidebarOpen,
  operatorMode,
  managerObjects,
  toggleList,
}: IPageHeader) => {
  return (
    <Grid
      container
      className={`${classes.headerContainer} page-header`}
      direction="row"
      alignItems="center"
    >
      <Box display={{ xs: "block", sm: "block", md: "none" }}>
        <Grid item xs={12} style={{ height: 10 }}>
          &nbsp;
        </Grid>
      </Box>
      <Grid item xs={12} sm={12} md={6} className={classes.label}>
        {!sidebarOpen && (
          <div className={classes.logo}>
            {operatorMode ? <OperatorLogo /> : <ConsoleLogo />}
          </div>
        )}
        <Typography variant="h4" className={classes.labelStyle}>
          {label}
        </Typography>
      </Grid>
      <Grid item xs={12} sm={12} md={6} className={classes.rightMenu}>
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
});

const mapDispatchToProps = {
  toggleList,
};

const connector = connect(mapState, mapDispatchToProps);

export default connector(withStyles(styles)(PageHeader));
