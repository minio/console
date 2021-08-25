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
import { createStyles, Theme, withStyles } from "@material-ui/core/styles";
import { Link } from "react-router-dom";
import { CircularProgress, IconButton } from "@material-ui/core";
import PageHeader from "../../../Common/PageHeader/PageHeader";
import { containerForHeader } from "../../../Common/FormComponents/common/styleLibrary";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import history from "./../../../../../history";
import RefreshIcon from "../../../../../icons/RefreshIcon";

interface IHopSimple {
  classes: any;
  match: any;
}

const styles = (theme: Theme) =>
  createStyles({
    breadcrumLink: {
      textDecoration: "none",
      color: "black",
    },
    iframeStyle: {
      border: 0,
      position: "absolute",
      height: "calc(100vh - 77px)",
      width: "100%",
    },
    divContainer: {
      position: "absolute",
      left: 0,
      top: 77,
      height: "calc(100vh - 77px)",
      width: "100%",
    },
    loader: {
      width: 100,
      margin: "auto",
      marginTop: 80,
    },
    ...containerForHeader(theme.spacing(4)),
  });

const Hop = ({ classes, match }: IHopSimple) => {
  const [loading, setLoading] = useState<boolean>(true);

  const tenantName = match.params["tenantName"];
  const tenantNamespace = match.params["tenantNamespace"];
  const consoleFrame = React.useRef<HTMLIFrameElement>(null);

  return (
    <React.Fragment>
      <PageHeader
        label={
          <Fragment>
            <Link to={"/tenants"} className={classes.breadcrumLink}>
              Tenants
            </Link>
            {` > `}
            <Link
              to={`/namespaces/${tenantNamespace}/tenants/${tenantName}`}
              className={classes.breadcrumLink}
            >
              {match.params["tenantName"]}
            </Link>
            {` > Management`}
          </Fragment>
        }
        actions={
          <React.Fragment>
            <IconButton
              color="primary"
              aria-label="Refresh List"
              component="span"
              onClick={() => {
                if (
                  consoleFrame !== null &&
                  consoleFrame.current !== null &&
                  consoleFrame.current.contentDocument !== null
                ) {
                  consoleFrame.current.contentDocument.location.reload(true);
                }
              }}
            >
              <RefreshIcon />
            </IconButton>
            <IconButton
              color="primary"
              aria-label="Refresh List"
              component="span"
              onClick={() => {
                history.push(
                  `/namespaces/${tenantNamespace}/tenants/${tenantName}`
                );
              }}
            >
              <ExitToAppIcon />
            </IconButton>
          </React.Fragment>
        }
      />
      <div className={classes.divContainer}>
        {loading && (
          <div className={classes.loader}>
            <CircularProgress />
          </div>
        )}
        <iframe
          ref={consoleFrame}
          className={classes.iframeStyle}
          title={"metrics"}
          src={`/api/proxy/${tenantNamespace}/${tenantName}/`}
          onLoad={(val) => {
            setLoading(false);
          }}
        />
      </div>
    </React.Fragment>
  );
};

export default withStyles(styles)(Hop);
