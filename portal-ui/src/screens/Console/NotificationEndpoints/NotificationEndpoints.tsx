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

import React, { Fragment } from "react";
import PageHeader from "../Common/PageHeader/PageHeader";
import { Theme } from "@mui/material/styles";
import createStyles from "@mui/styles/createStyles";
import withStyles from "@mui/styles/withStyles";
import { containerForHeader } from "../Common/FormComponents/common/styleLibrary";

import { AppState } from "../../../store";
import { connect } from "react-redux";
import { ISessionResponse } from "../types";
import ListNotificationEndpoints from "./ListNotificationEndpoints";

interface INotificationEndpoints {
  classes: any;
  session: ISessionResponse;
  distributedSetup: boolean;
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

const NotificationEndpoints = ({
  classes,
  session,
  distributedSetup,
}: INotificationEndpoints) => {
  return (
    <Fragment>
      <PageHeader label="Notification Endpoints" />
      <ListNotificationEndpoints />
    </Fragment>
  );
};

const mapState = (state: AppState) => ({
  session: state.console.session,
  distributedSetup: state.system.distributedSetup,
});

const connector = connect(mapState, {});

export default withStyles(styles)(connector(NotificationEndpoints));
