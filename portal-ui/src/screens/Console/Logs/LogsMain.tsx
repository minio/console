import React, { Fragment, useState } from "react";
import PageHeader from "../Common/PageHeader/PageHeader";
import { Grid } from "@material-ui/core";
import { createStyles, Theme, withStyles } from "@material-ui/core/styles";
import Tab from "@material-ui/core/Tab";
import Tabs from "@material-ui/core/Tabs";
import ErrorLogs from "./ErrorLogs/ErrorLogs";
import LogsSearchMain from "./LogSearch/LogsSearchMain";
import { containerForHeader } from "../Common/FormComponents/common/styleLibrary";

interface ILogsMainProps {
  classes: any;
}

const styles = (theme: Theme) =>
  createStyles({
    headerLabel: {
      fontSize: 22,
      fontWeight: 600,
      color: "#000",
      marginTop: 4,
    },
    ...containerForHeader(theme.spacing(4)),
  });

const LogsMain = ({ classes }: ILogsMainProps) => {
  const [currentTab, setCurrentTab] = useState<number>(0);
  return (
    <Fragment>
      <PageHeader label="Logs" />
      <Grid container>
        <Grid item xs={12} className={classes.container}>
          <Grid item xs={12} className={classes.headerLabel}>
            All Logs
          </Grid>
          <Tabs
            value={currentTab}
            onChange={(e: React.ChangeEvent<{}>, newValue: number) => {
              setCurrentTab(newValue);
            }}
            indicatorColor="primary"
            textColor="primary"
            aria-label="cluster-tabs"
          >
            <Tab label="Error Logs" />
            <Tab label="Logs Search" />
          </Tabs>
        </Grid>
        <Grid item xs={12}>
          {currentTab === 0 && (
            <Grid item xs={12}>
              <ErrorLogs />
            </Grid>
          )}
          {currentTab === 1 && (
            <Grid item xs={12}>
              <LogsSearchMain />
            </Grid>
          )}
        </Grid>
      </Grid>
    </Fragment>
  );
};

export default withStyles(styles)(LogsMain);
