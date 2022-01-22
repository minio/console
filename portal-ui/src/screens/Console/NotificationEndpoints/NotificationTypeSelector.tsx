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
import { Theme } from "@mui/material/styles";
import createStyles from "@mui/styles/createStyles";
import withStyles from "@mui/styles/withStyles";
import { servicesList } from "./utils";
import {
  settingsCommon,
  typesSelection,
} from "../Common/FormComponents/common/styleLibrary";
import PageHeader from "../Common/PageHeader/PageHeader";
import history from "../../../history";
import BackLink from "../../../common/BackLink";
import PageLayout from "../Common/Layout/PageLayout";
import { IAM_PAGES } from "../../../common/SecureComponent/permissions";

interface INotificationTypeSelector {
  classes: any;
}

const withLogos = servicesList.filter((elService) => elService.logo !== "");

const styles = (theme: Theme) =>
  createStyles({
    ...settingsCommon,
    ...typesSelection,
  });

const NotificationTypeSelector = ({ classes }: INotificationTypeSelector) => {
  return (
    <Fragment>
      <PageHeader label="Notification Endpoints" />
      <BackLink
        to={IAM_PAGES.NOTIFICATIONS_ENDPOINTS}
        label="Return to Configured Endpoints"
        className={classes.link}
      />
      <PageLayout>
        <div className={classes.iconContainer}>
          {withLogos.map((item) => {
            return (
              <button
                key={`icon-${item.targetTitle}`}
                className={classes.lambdaNotif}
                onClick={() => {
                  history.push(
                    `${IAM_PAGES.NOTIFICATIONS_ENDPOINTS_ADD}/${item.actionTrigger}`
                  );
                }}
              >
                <div className={classes.lambdaNotifIcon}>
                  <img
                    src={item.logo}
                    className={classes.logoButton}
                    alt={item.targetTitle}
                  />
                </div>

                <div className={classes.lambdaNotifTitle}>
                  <b>{item.targetTitle}</b>
                </div>
              </button>
            );
          })}
        </div>
      </PageLayout>
    </Fragment>
  );
};

export default withStyles(styles)(NotificationTypeSelector);
