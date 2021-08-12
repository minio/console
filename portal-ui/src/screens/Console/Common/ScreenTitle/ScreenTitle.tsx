import React from "react";
import Grid from "@material-ui/core/Grid";
import { createStyles, Theme, withStyles } from "@material-ui/core/styles";
import { ClustersIcon } from "../../../../icons";

interface IScreenTitle {
  classes: any;
  icon?: any;
  title?: any;
  subTitle?: any;
  actions?: any;
}

const styles = (theme: Theme) =>
  createStyles({
    headerBarIcon: {
      float: "left",
      paddingTop: 10,
      marginRight: 12,
      color: theme.palette.primary.main,
    },
    headerBarSubheader: {
      color: "grey",
    },
  });

const ScreenTitle = ({
  classes,
  icon,
  title,
  subTitle,
  actions,
}: IScreenTitle) => {
  return (
    <Grid container>
      <Grid item xs={12} style={{ paddingTop: 8 }}>
        <div className={classes.headerBarIcon}>{icon}</div>
        <div style={{ float: "left" }}>
          <h1 style={{ margin: 0 }}>{title}</h1>
          <span className={classes.headerBarSubheader}>{subTitle}</span>
        </div>
        <div style={{ float: "right", paddingTop: 12 }}>{actions}</div>
      </Grid>
      <Grid item xs={12}>
        <hr style={{ border: 0, borderTop: "1px solid #EAEAEA" }} />
      </Grid>
    </Grid>
  );
};

export default withStyles(styles)(ScreenTitle);
