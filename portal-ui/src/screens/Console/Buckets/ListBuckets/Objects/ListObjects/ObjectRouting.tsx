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

import React, { useEffect } from "react";
import ListObjects from "./ListObjects";
import ObjectDetails from "../ObjectDetails/ObjectDetails";
import get from "lodash/get";
import { setAllRoutes } from "../../../../ObjectBrowser/actions";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { ObjectBrowserState, Route } from "../../../../ObjectBrowser/reducers";

interface ObjectBrowserReducer {
  objectBrowser: ObjectBrowserState;
}

interface ObjectRoutingProps {
  routesList: Route[];
  setAllRoutes: (path: string) => any;
  match: any;
}

const ObjectRouting = ({
  routesList,
  match,
  setAllRoutes,
}: ObjectRoutingProps) => {
  const currentItem = routesList[routesList.length - 1];

  useEffect(() => {
    const url = get(match, "url", "/object-browser");

    if (url !== routesList[routesList.length - 1].route) {
      setAllRoutes(url);
    }
  }, [match, routesList, setAllRoutes]);

  return currentItem.type === "path" ? (
    <ListObjects />
  ) : (
    <ObjectDetails routesList={routesList} />
  );
};

const mapStateToProps = ({ objectBrowser }: ObjectBrowserReducer) => ({
  routesList: get(objectBrowser, "routesList", []),
});

const mapDispatchToProps = {
  setAllRoutes,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

export default withRouter(connector(ObjectRouting));
