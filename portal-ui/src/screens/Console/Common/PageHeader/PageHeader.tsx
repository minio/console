import React, { Fragment } from "react";
import Grid from "@material-ui/core/Grid";
import { createStyles, Theme, withStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import { AppState } from "../../../../store";
import { connect } from "react-redux";
import { setMenuOpen, userLoggedIn } from "../../../../actions";
import OperatorLogo from "../../../../icons/OperatorLogo";
import ConsoleLogo from "../../../../icons/ConsoleLogo";

const styles = (theme: Theme) =>
  createStyles({
    headerContainer: {
      position: "absolute",
      width: "100%",
      height: 77,
      display: "flex",
      backgroundColor: "#fff",
      borderBottom: "2px solid",
      borderBottomColor: "#e8e8e8",
      left: 0,
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
      marginTop: 16,
      marginRight: 8,
    },
    logo: {
      marginLeft: 34,
      fill: theme.palette.primary.main,
      width: 120,
    },
  });

interface IPageHeader {
  classes: any;
  sidebarOpen?: boolean;
  operatorMode?: boolean;
  label: any;
  actions?: any;
}

const PageHeader = ({
  classes,
  label,
  actions,
  sidebarOpen,
  operatorMode,
}: IPageHeader) => {
  return (
    <Grid
      container
      className={classes.headerContainer}
      justify={"space-between"}
    >
      <Grid item className={classes.label}>
        {!sidebarOpen && (
          <div className={classes.logo}>
            {operatorMode ? <OperatorLogo /> : <ConsoleLogo />}
          </div>
        )}
        <Typography variant="h4" className={classes.labelStyle}>
          {label}
        </Typography>
      </Grid>
      {actions && (
        <Grid item className={classes.rightMenu}>
          {actions}
        </Grid>
      )}
    </Grid>
  );
};

const mapState = (state: AppState) => ({
  sidebarOpen: state.system.sidebarOpen,
  operatorMode: state.system.operatorMode,
});

const connector = connect(mapState, null);

export default connector(withStyles(styles)(PageHeader));
