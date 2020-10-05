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

import React, { useState } from "react";
import get from "lodash/get";
import { createStyles, Theme, withStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import { TextField } from "@material-ui/core";
import InputAdornment from "@material-ui/core/InputAdornment";
import SearchIcon from "@material-ui/icons/Search";
import history from "../../../../history";
import TableWrapper from "../../Common/TableWrapper/TableWrapper";
import { configurationElements } from "../utils";
import { IConfigurationElement } from "../types";
import EditConfiguration from "../CustomForms/EditConfiguration";
import { containerForHeader } from "../../Common/FormComponents/common/styleLibrary";
import PageHeader from "../../Common/PageHeader/PageHeader";

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
    actionsTray: {
      textAlign: "right",
      "& button": {
        marginLeft: 10,
      },
    },
    searchField: {
      background: "#FFFFFF",
      padding: 12,
      borderRadius: 5,
      boxShadow: "0px 3px 6px #00000012",
    },
    iconText: {
      lineHeight: "24px",
    },
    ...containerForHeader(theme.spacing(4)),
  });

const ConfigurationsList = ({ classes }: IListConfiguration) => {
  const [editScreenOpen, setEditScreenOpen] = useState(false);
  const [selectedConfiguration, setSelectedConfiguration] = useState({
    configuration_id: "",
    configuration_label: "",
  });
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("");

  const tableActions = [
    {
      type: "edit",
      onClick: (element: IConfigurationElement) => {
        const url = get(element, "url", "");
        if (url !== "") {
          // We redirect Browser
          history.push(url);
        } else {
          setSelectedConfiguration(element);
          setEditScreenOpen(true);
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

  return (
    <React.Fragment>
      {editScreenOpen && (
        <EditConfiguration
          open={editScreenOpen}
          closeModalAndRefresh={() => {
            setEditScreenOpen(false);
          }}
          selectedConfiguration={selectedConfiguration}
        />
      )}
      <PageHeader label="Configurations List" />
      <Grid container>
        <Grid item xs={12} className={classes.container}>
          {error !== "" && <Grid container>{error}</Grid>}
          <Grid item xs={12} className={classes.actionsTray}>
            <TextField
              placeholder="Filter"
              className={classes.searchField}
              id="search-resource"
              label=""
              onChange={(event) => {
                setFilter(event.target.value);
              }}
              InputProps={{
                disableUnderline: true,
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <br />
          </Grid>
          <Grid item xs={12}>
            <TableWrapper
              itemActions={tableActions}
              columns={[
                { label: "Configuration", elementKey: "configuration_id" },
              ]}
              isLoading={false}
              records={filteredRecords}
              entityName="Configurations"
              idField="configuration_id"
            />
          </Grid>
        </Grid>
      </Grid>
    </React.Fragment>
  );
};

export default withStyles(styles)(ConfigurationsList);
