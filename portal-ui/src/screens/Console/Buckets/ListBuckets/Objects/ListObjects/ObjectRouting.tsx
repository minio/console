import React, { useEffect, useState } from "react";
import ListObjects from "./ListObjects";
import ObjectDetails from "../ObjectDetails/ObjectDetails";
import get from "lodash/get";
import { addRoute, setAllRoutes } from "../../../../ObjectBrowser/actions";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { ObjectBrowserState, Route } from "../../../../ObjectBrowser/reducers";

interface ObjectBrowserReducer {
  objectBrowser: ObjectBrowserState;
}

interface ObjectRoutingProps {
  routesList: Route[];
  match: any;
}

const ObjectRouting = ({ routesList, match }: ObjectRoutingProps) => {
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

const mapDispatchToProps = (dispatch: any) => {
  return {
    dispatchSetAllRoutes: (route: string) => dispatch(setAllRoutes(route)),
  };
};

const connector = connect(mapStateToProps, mapDispatchToProps);

export default withRouter(connector(ObjectRouting));
