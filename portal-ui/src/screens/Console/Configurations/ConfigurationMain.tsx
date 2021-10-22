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

<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> a4de76c3... Restructured settings page to use URL navigation (#1138)
=======
>>>>>>> a4de76c3... Restructured settings page to use URL navigation (#1138)
import React from "react";
import { Route, Router, Switch } from "react-router-dom";
import history from "../../../history";
import ConfigurationOptions from "./ConfigurationPanels/ConfigurationOptions";
import ConfigurationForm from "./ConfigurationPanels/ConfigurationForm";
import NotFoundPage from "../../NotFoundPage";
<<<<<<< HEAD
<<<<<<< HEAD
=======
import React, { Fragment } from "react";
import PageHeader from "../Common/PageHeader/PageHeader";
import { Grid } from "@mui/material";
import { Theme } from "@mui/material/styles";
import createStyles from "@mui/styles/createStyles";
import withStyles from "@mui/styles/withStyles";
import { containerForHeader } from "../Common/FormComponents/common/styleLibrary";
import ConfigurationsList from "./ConfigurationPanels/ConfigurationsList";
import { ISessionResponse } from "../types";
>>>>>>> 3fabfb96... Updated material-ui dependencies to mui 5 & fixed issues with migration (#1119)
=======
>>>>>>> a4de76c3... Restructured settings page to use URL navigation (#1138)
=======
>>>>>>> a4de76c3... Restructured settings page to use URL navigation (#1138)

const ConfigurationMain = () => {
  return (
    <Router history={history}>
      <Switch>
        <Route path="/settings" exact component={ConfigurationOptions} />
        <Route path="/settings/:option" component={ConfigurationForm} />
        <Route component={NotFoundPage} />
      </Switch>
    </Router>
  );
};

export default ConfigurationMain;
