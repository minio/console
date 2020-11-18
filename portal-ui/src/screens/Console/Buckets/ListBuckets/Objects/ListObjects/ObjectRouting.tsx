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
