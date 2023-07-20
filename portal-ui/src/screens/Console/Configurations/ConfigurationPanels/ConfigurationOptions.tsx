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

import React, { Fragment, useCallback, useEffect, useState } from "react";
import { Theme } from "@mui/material/styles";
import createStyles from "@mui/styles/createStyles";
import withStyles from "@mui/styles/withStyles";
import Grid from "@mui/material/Grid";

import { configurationElements } from "../utils";
import {
  actionsTray,
  containerForHeader,
  searchField,
} from "../../Common/FormComponents/common/styleLibrary";
import { HelpBox, PageLayout, SettingsIcon } from "mds";
import { Link, Navigate, Route, Routes, useLocation } from "react-router-dom";
import VerticalTabs from "../../Common/VerticalTabs/VerticalTabs";
import ScreenTitle from "../../Common/ScreenTitle/ScreenTitle";
import ConfigurationForm from "./ConfigurationForm";
import { IAM_PAGES } from "../../../../common/SecureComponent/permissions";
import PageHeaderWrapper from "../../Common/PageHeaderWrapper/PageHeaderWrapper";
import ExportConfigButton from "./ExportConfigButton";
import ImportConfigButton from "./ImportConfigButton";
import { Box } from "@mui/material";
import HelpMenu from "../../HelpMenu";
import { setErrorSnackMessage, setHelpName } from "../../../../systemSlice";
import { useAppDispatch } from "../../../../store";
import { api } from "../../../../api";
import { IElement } from "../types";
import { errorToHandler } from "../../../../api/errors";

interface IConfigurationOptions {
  classes: any;
}

const styles = (theme: Theme) =>
  createStyles({
    settingsOptionsContainer: {
      display: "flex" as const,
      flexDirection: "row" as const,
      justifyContent: "flex-start" as const,
      flexWrap: "wrap" as const,
      border: "#E5E5E5 1px solid",
      borderRadius: 2,
      backgroundColor: "#fff",
    },
    ...searchField,
    ...actionsTray,
    ...containerForHeader,
  });

const getRoutePath = (path: string) => {
  return `${IAM_PAGES.SETTINGS}/${path}`;
};

// region is not part of config subsystem list.
const NON_SUB_SYS_CONFIG_ITEMS = ["region"];
const IGNORED_CONFIG_SUB_SYS = ["cache"]; // cache config is not supported.

const ConfigurationOptions = ({ classes }: IConfigurationOptions) => {
  const { pathname = "" } = useLocation();
  const dispatch = useAppDispatch();

  const [configSubSysList, setConfigSubSysList] = useState<string[]>([]);
  const fetchConfigSubSysList = useCallback(async () => {
    api.configs
      .listConfig() // get a list of available config subsystems.
      .then((res) => {
        if (res && res?.data && res?.data?.configurations) {
          const confSubSysList = (res?.data?.configurations || []).reduce(
            (acc: string[], { key = "" }) => {
              if (!IGNORED_CONFIG_SUB_SYS.includes(key)) {
                acc.push(key);
              }
              return acc;
            },
            [],
          );

          setConfigSubSysList(confSubSysList);
        }
      })
      .catch((err) => {
        dispatch(setErrorSnackMessage(errorToHandler(err)));
      });
  }, [dispatch]);

  let selConfigTab = pathname.substring(pathname.lastIndexOf("/") + 1);
  selConfigTab = selConfigTab === "settings" ? "region" : selConfigTab;
  useEffect(() => {
    fetchConfigSubSysList();
    dispatch(setHelpName("settings_Region"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const availableConfigSubSys = configurationElements.filter(
    ({ configuration_id }: IElement) => {
      return (
        NON_SUB_SYS_CONFIG_ITEMS.includes(configuration_id) ||
        configSubSysList.includes(configuration_id) ||
        !configSubSysList.length
      );
    },
  );

  return (
    <Fragment>
      <PageHeaderWrapper label={"Settings"} actions={<HelpMenu />} />
      <PageLayout>
        <Grid item xs={12}>
          <div
            id="settings-container"
            className={classes.settingsOptionsContainer}
          >
            <ScreenTitle
              icon={<SettingsIcon />}
              title={"MinIO Configuration:"}
              actions={
                <Box
                  sx={{
                    display: "flex",
                    gap: 2,
                  }}
                >
                  <ImportConfigButton />
                  <ExportConfigButton />
                </Box>
              }
            />
            <VerticalTabs
              selectedTab={selConfigTab}
              isRouteTabs
              routes={
                <Routes>
                  {availableConfigSubSys.map((element) => (
                    <Route
                      key={`configItem-${element.configuration_label}`}
                      path={`${element.configuration_id}`}
                      element={<ConfigurationForm />}
                    />
                  ))}
                  <Route
                    path={"/"}
                    element={<Navigate to={`${IAM_PAGES.SETTINGS}/region`} />}
                  />
                </Routes>
              }
            >
              {availableConfigSubSys.map((element) => {
                const { configuration_id, configuration_label, icon } = element;
                return {
                  tabConfig: {
                    label: configuration_label,
                    value: configuration_id,
                    icon: icon,
                    component: Link,
                    to: getRoutePath(configuration_id),
                  },
                };
              })}
            </VerticalTabs>
          </div>
        </Grid>
        <Grid item xs={12} sx={{ paddingTop: "15px" }}>
          <HelpBox
            title={"Learn more about Configurations"}
            iconComponent={<SettingsIcon />}
            help={
              <Fragment>
                MinIO supports a variety of configurations ranging from
                encryption, compression, region, notifications, etc.
                <br />
                <br />
                You can learn more at our{" "}
                <a
                  href="https://min.io/docs/minio/linux/reference/minio-mc-admin/mc-admin-config.html?ref=con#id4"
                  target="_blank"
                  rel="noopener"
                >
                  documentation
                </a>
                .
              </Fragment>
            }
          />
        </Grid>
      </PageLayout>
    </Fragment>
  );
};

export default withStyles(styles)(ConfigurationOptions);
