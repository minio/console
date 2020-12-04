// This file is part of MinIO Console Server
// Copyright (c) 2020 MinIO, Inc.
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

import React, { useState, Fragment } from "react";
import get from "lodash/get";
import { createStyles, Theme, withStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import { TextField } from "@material-ui/core";
import InputAdornment from "@material-ui/core/InputAdornment";
import SearchIcon from "@material-ui/icons/Search";
import history from "../../../../history";
import TableWrapper from "../../Common/TableWrapper/TableWrapper";
import { configurationElements } from "../utils";
import { IConfigurationElement } from "../types";
import EditConfiguration from "../CustomForms/EditConfiguration";
import {
  actionsTray,
  containerForHeader,
  searchField,
  settingsCommon,
} from "../../Common/FormComponents/common/styleLibrary";
import SlideOptions from "../../Common/SlideOptions/SlideOptions";
import BackSettingsIcon from "../../../../icons/BackSettingsIcon";

interface IListConfiguration {
  classes: any;
}

const styles = (theme: Theme) =>
  createStyles({
    errorBlock: {
      color: "red",
    },
    strongText: {
      fontWeight: 700,
    },
    keyName: {
      marginLeft: 5,
    },
    iconText: {
      lineHeight: "24px",
    },
    customConfigurationPage: {
      height: "calc(100vh - 324px)",
      scrollbarWidth: "none" as const,
      "&::-webkit-scrollbar": {
        display: "none",
      },
    },
    settingsOptionsContainer: {
      height: "calc(100vh - 244px)",
      backgroundColor: "#fff",
      border: "#EAEDEE 1px solid",
      borderRadius: 3,
      marginTop: 15,
    },
    backButton: {
      cursor: "pointer",
      fontSize: 10,
      fontWeight: 600,
      color: "#000",
      backgroundColor: "transparent",
      border: 0,
      padding: 0,
      display: "flex",
      alignItems: "center",
      "&:active, &:focus": {
        outline: 0,
      },
      "& svg": {
        width: 10,
        marginRight: 4,
      },
    },
    backContainer: {
      margin: "20px 38px 0",
    },
    ...searchField,
    ...actionsTray,
    ...settingsCommon,
    ...containerForHeader(theme.spacing(4)),
  });

const initialConfiguration = {
  configuration_id: "",
  configuration_label: "",
};

const ConfigurationsList = ({ classes }: IListConfiguration) => {
  const [editScreenOpen, setEditScreenOpen] = useState(false);
  const [selectedConfiguration, setSelectedConfiguration] = useState(
    initialConfiguration
  );
  const [filter, setFilter] = useState("");
  const [currentConfiguration, setCurrentConfiguration] = useState<number>(0);

  const tableActions = [
    {
      type: "edit",
      onClick: (element: IConfigurationElement) => {
        const url = get(element, "url", "");
        if (url !== "") {
          // We redirect Browser
          history.push(url);
        } else {
          setCurrentConfiguration(1);
          setSelectedConfiguration(element);
        }
      },
    },
  ];

  const filteredRecords: IConfigurationElement[] = configurationElements.filter(
    (elementItem) =>
      elementItem.configuration_id
        .toLocaleLowerCase()
        .includes(filter.toLocaleLowerCase())
  );

  const backToInitialConfig = () => {
    setCurrentConfiguration(0);
    setSelectedConfiguration(initialConfiguration);
  };

  return (
    <React.Fragment>
      <Grid container>
        <Grid item xs={12}>
          <Grid item xs={12}>
            <div className={classes.settingsOptionsContainer}>
              <SlideOptions
                slideOptions={[
                  <Fragment>
                    <Grid item xs={12} className={classes.customTitle}>
                      Configuration Types
                    </Grid>
                    <TableWrapper
                      itemActions={tableActions}
                      columns={[
                        {
                          label: "Configuration",
                          elementKey: "configuration_id",
                        },
                      ]}
                      isLoading={false}
                      records={filteredRecords}
                      entityName="Configurations"
                      idField="configuration_id"
                      customPaperHeight={classes.customConfigurationPage}
                      noBackground
                    />
                  </Fragment>,
                  <Fragment>
                    <Grid item xs={12} className={classes.backContainer}>
                      <button
                        onClick={backToInitialConfig}
                        className={classes.backButton}
                      >
                        <BackSettingsIcon />
                        Back To Configurations
                      </button>
                    </Grid>
                    <Grid item xs={12}>
                      {currentConfiguration === 1 ? (
                        <EditConfiguration
                          closeModalAndRefresh={() => {
                            setCurrentConfiguration(0);
                          }}
                          selectedConfiguration={selectedConfiguration}
                        />
                      ) : null}
                    </Grid>
                  </Fragment>,
                ]}
                currentSlide={currentConfiguration}
              />
            </div>
          </Grid>
        </Grid>
      </Grid>
    </React.Fragment>
  );
};

export default withStyles(styles)(ConfigurationsList);
