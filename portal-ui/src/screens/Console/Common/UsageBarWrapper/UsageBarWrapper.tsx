import React from "react";
import { createStyles, Theme, withStyles } from "@material-ui/core/styles";
import { LinearProgress } from "@material-ui/core";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import CircularProgress from "@material-ui/core/CircularProgress";

interface IProgressBar {
  maxValue: number;
  currValue: number;
  label: string;
  renderFunction?: (element: string) => any;
  error: string;
  loading: boolean;
  classes: any;
}

const styles = (theme: Theme) =>
  createStyles({
    paperContainer: {
      padding: 15,
    },
    allValue: {
      fontSize: 16,
      fontWeight: 700,
      marginBottom: 8,
    },
    currentUsage: {
      fontSize: 12,
      marginTop: 8,
    },
    centerItem: {
      textAlign: "center",
    },
    error: {
      color: "#9c9c9c",
    },
  });

const BorderLinearProgress = withStyles((theme) => ({
  root: {
    height: 10,
    borderRadius: 5,
  },
  colorPrimary: {
    backgroundColor: "#F4F4F4",
  },
  bar: {
    borderRadius: 5,
    backgroundColor: "#081C42",
  },
}))(LinearProgress);

const UsageBarWrapper = ({
  classes,
  maxValue,
  currValue,
  label,
  renderFunction,
  loading,
  error,
}: IProgressBar) => {
  const porcentualValue = (currValue * 100) / maxValue;

  const renderComponent = () => {
    if (!loading) {
      return error !== "" ? (
        <React.Fragment>
          <span className={classes.error}>{error}</span>
        </React.Fragment>
      ) : (
        <React.Fragment>
          <Grid item xs={12} className={classes.allValue}>
            {label}{" "}
            {renderFunction ? renderFunction(maxValue.toString()) : maxValue}
          </Grid>
          <BorderLinearProgress variant="determinate" value={porcentualValue} />
          <Grid item xs={12} className={classes.currentUsage}>
            Used:{" "}
            {renderFunction ? renderFunction(currValue.toString()) : currValue}
          </Grid>
        </React.Fragment>
      );
    }

    return null;
  };

  return (
    <React.Fragment>
      <Paper className={classes.paperContainer}>
        {loading && (
          <React.Fragment>
            <Grid item xs={12} className={classes.centerItem}>
              <CircularProgress
                color="primary"
                size={40}
                variant="indeterminate"
              />
            </Grid>
          </React.Fragment>
        )}
        {renderComponent()}
      </Paper>
    </React.Fragment>
  );
};

export default withStyles(styles)(UsageBarWrapper);
