import React, { Fragment } from "react";
import { Theme } from "@mui/material/styles";
import createStyles from "@mui/styles/createStyles";
import withStyles from "@mui/styles/withStyles";
import { LinearProgress } from "@mui/material";
import Grid from "@mui/material/Grid";
import CircularProgress from "@mui/material/CircularProgress";
import ErrorBlock from "../../../shared/ErrorBlock";

interface IProgressBar {
  maxValue: number;
  currValue: number;
  label: string;
  renderFunction?: (element: string) => any;
  error: string;
  loading: boolean;
  classes: any;
  labels?: boolean;
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
  });

export const BorderLinearProgress = withStyles((theme) => ({
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
  padChart: {
    padding: "5px",
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
  labels = true,
}: IProgressBar) => {
  const porcentualValue = (currValue * 100) / maxValue;

  const renderComponent = () => {
    if (!loading) {
      return error !== "" ? (
        <ErrorBlock errorMessage={error} withBreak={false} />
      ) : (
        <React.Fragment>
          <Grid item xs={12} className={classes.allValue}>
            {labels && (
              <Fragment>
                {label}{" "}
                {renderFunction
                  ? renderFunction(maxValue.toString())
                  : maxValue}
              </Fragment>
            )}
          </Grid>
          <BorderLinearProgress variant="determinate" value={porcentualValue} />
          <Grid item xs={12} className={classes.currentUsage}>
            {labels && (
              <Fragment>
                Used:{" "}
                {renderFunction
                  ? renderFunction(currValue.toString())
                  : currValue}
              </Fragment>
            )}
          </Grid>
        </React.Fragment>
      );
    }

    return null;
  };

  return (
    <React.Fragment>
      {loading && (
        <div className={classes.padChart}>
          <Grid item xs={12} className={classes.centerItem}>
            <CircularProgress
              color="primary"
              size={40}
              variant="indeterminate"
            />
          </Grid>
        </div>
      )}
      {renderComponent()}
    </React.Fragment>
  );
};

export default withStyles(styles)(UsageBarWrapper);
