import React, { Fragment, useState } from "react";
import PageHeader from "../Common/PageHeader/PageHeader";
import { Grid } from "@material-ui/core";
import { createStyles, Theme, withStyles } from "@material-ui/core/styles";
import { containerForHeader } from "../Common/FormComponents/common/styleLibrary";
import Tab from "@material-ui/core/Tab";
import Tabs from "@material-ui/core/Tabs";
import ListTenants from "./ListTenants/ListTenants";

interface IConfigurationMain {
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

const TenantsMain = ({ classes }: IConfigurationMain) => {
  const [selectedTab, setSelectedTab] = useState<number>(0);
  return (
    <Fragment>
      <PageHeader label="Tenants" />
      <Grid container>
        <Grid item xs={12} className={classes.container}>
          <Grid item xs={12} className={classes.headerLabel}>
            Tenants Management
          </Grid>
          <Tabs
            value={selectedTab}
            indicatorColor="primary"
            textColor="primary"
            onChange={(_, newValue: number) => {
              setSelectedTab(newValue);
            }}
            aria-label="tenant-tabs"
          >
            <Tab label="Tenants" />
          </Tabs>
          <Grid item xs={12}>
            {selectedTab === 0 && (
              <Grid item xs={12}>
                <ListTenants />
              </Grid>
            )}
          </Grid>
        </Grid>
      </Grid>
    </Fragment>
  );
};

export default withStyles(styles)(TenantsMain);
