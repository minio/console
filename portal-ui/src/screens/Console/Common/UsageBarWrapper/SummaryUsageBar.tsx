import React from "react";
import { Theme } from "@mui/material/styles";
import createStyles from "@mui/styles/createStyles";
import withStyles from "@mui/styles/withStyles";
import { LinearProgress, Stack } from "@mui/material";
import Grid from "@mui/material/Grid";
import CircularProgress from "@mui/material/CircularProgress";
import ErrorBlock from "../../../shared/ErrorBlock";
import { CircleIcon } from "../../../../icons";
import LabelValuePair from "./LabelValuePair";

interface IProgressBar {
  maxValue: number;
  currValue: number;
  label: string;
  renderFunction?: (element: string) => any;
  error: string;
  loading: boolean;
  classes: any;
  labels?: boolean;
  healthStatus?: string;
}

const styles = (theme: Theme) =>
  createStyles({
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

const SummaryUsageBar = ({
  classes,
  maxValue,
  currValue,
  healthStatus,
  renderFunction,
  loading,
  error,
}: IProgressBar) => {
  const porcentualValue = (currValue * 100) / maxValue;

  const renderComponent = () => {
    if (!loading) {
      return error !== "" ? (
        <ErrorBlock errorMessage={error} withBreak={false} />
      ) : (
        <Grid item xs={12}>
          <BorderLinearProgress variant="determinate" value={porcentualValue} />
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={{ xs: 1, sm: 2, md: 4 }}
            alignItems={"stretch"}
            margin={"15px 0 15px 0"}
          >
            <LabelValuePair
              label={"Storage Capacity:"}
              orientation={"row"}
              value={
                renderFunction ? renderFunction(maxValue.toString()) : maxValue
              }
            />
            <LabelValuePair
              label={"Used:"}
              orientation={"row"}
              value={
                renderFunction
                  ? renderFunction(currValue.toString())
                  : currValue
              }
            />
            {healthStatus && (
              <LabelValuePair
                orientation={"row"}
                label={"Health:"}
                value={
                  <span className={healthStatus}>
                    <CircleIcon />
                  </span>
                }
              />
            )}
          </Stack>
        </Grid>
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

export default withStyles(styles)(SummaryUsageBar);
