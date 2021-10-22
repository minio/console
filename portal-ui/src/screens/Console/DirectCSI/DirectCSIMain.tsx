// This file is part of MinIO Console Server
// Copyright (c) 2021 MinIO, Inc.
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

import React, { Fragment, useState } from "react";
import { connect } from "react-redux";
import { Theme } from "@mui/material/styles";
import createStyles from "@mui/styles/createStyles";
import withStyles from "@mui/styles/withStyles";
import { Grid, Tab, Tabs } from "@mui/material";
import { setErrorSnackMessage } from "../../../actions";
import {
  actionsTray,
  containerForHeader,
  searchField,
} from "../Common/FormComponents/common/styleLibrary";
import { selectDrive } from "./actions";
import PageHeader from "../Common/PageHeader/PageHeader";
import DirectCSIDrives from "./DirectCSIDrives";
import DirectCSIVolumes from "./DirectCSIVolumes";

interface IDirectCSIMain {
  classes: any;
  setErrorSnackMessage: typeof setErrorSnackMessage;
  selectDrive: typeof selectDrive;
}

const styles = (theme: Theme) =>
  createStyles({
    headerLabel: {
      fontSize: 22,
      fontWeight: 600,
      color: "#000",
      marginTop: 4,
    },
    tabsContainer: {
      marginBottom: 15,
    },
    ...actionsTray,
    ...searchField,
    ...containerForHeader(theme.spacing(4)),
  });

const DirectCSIMain = ({
  classes,
  selectDrive,
  setErrorSnackMessage,
}: IDirectCSIMain) => {
  const [selectedTab, setSelectedTab] = useState<number>(0);

  return (
    <Fragment>
      <PageHeader label={"Direct CSI"} />
      <Grid container>
        <Grid item xs={12} className={classes.container}>
          <Grid item xs={12} className={classes.tabsContainer}>
            <Tabs
              value={selectedTab}
              onChange={(e: React.ChangeEvent<{}>, newValue: number) => {
                setSelectedTab(newValue);
              }}
              indicatorColor="primary"
              textColor="primary"
              aria-label="cluster-tabs"
            >
              <Tab label="Drives" />
              <Tab label="Volumes" />
            </Tabs>
          </Grid>
          {selectedTab === 0 && <DirectCSIDrives />}
          {selectedTab === 1 && <DirectCSIVolumes />}
        </Grid>
      </Grid>
    </Fragment>
  );
};

const mapDispatchToProps = {
  setErrorSnackMessage,
  selectDrive,
};

const connector = connect(null, mapDispatchToProps);

export default withStyles(styles)(connector(DirectCSIMain));
