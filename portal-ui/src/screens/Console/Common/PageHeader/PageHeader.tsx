import React from "react";
import Grid from "@material-ui/core/Grid";
import { createStyles, Theme, withStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";

interface IPageHeader {
  classes: any;
  label: any;
  actions?: any;
}

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
      marginLeft: 55,
      marginTop: 8,
    },
    rightMenu: {
      marginTop: 16,
      marginRight: 8,
    },
  });

const PageHeader = ({ classes, label, actions }: IPageHeader) => {
  return (
    <Grid
      container
      className={classes.headerContainer}
      justify={"space-between"}
    >
      <Grid item className={classes.label}>
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

export default withStyles(styles)(PageHeader);
