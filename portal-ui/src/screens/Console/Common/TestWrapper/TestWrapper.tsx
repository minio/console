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

import React, { Fragment, useState, useEffect } from "react";
import { Theme } from "@mui/material/styles";
import createStyles from "@mui/styles/createStyles";
import withStyles from "@mui/styles/withStyles";
import { CircularProgress, Grid } from "@mui/material";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { DrivesIcon, VersionIcon } from "../../../../icons";
import { ServerInfo, Usage } from "../../Dashboard/types";
import { ErrorResponseHandler } from "../../../../common/types";
import api from "../../../../common/api";

interface ITestWrapper {
  title: any;
  children: any;
  classes: any;
  advancedVisible: boolean;
  advancedContent?: any;
}

const styles = (theme: Theme) =>
  createStyles({
    titleBar: {
      borderBottom: "#E5E5E5 1px solid",
      padding: "30px 25px",
      fontSize: 20,
      color: "#07193E",
      fontWeight: "bold",
      borderRadius: "10px 10px 0px 0px",
      paddingTop: 0,
    },
    divisorContainer: {
      padding: 25,
    },
    serversData: {
      color: "#07193E",
      fontSize: 18,
      display: "flex",
      alignItems: "center",
      "& svg": {
        marginRight: 10,
      },
    },
    minioVersionContainer: {
      fontSize: 12,
      color: "#07193E",
      justifyContent: "center",
      alignSelf: "center",
      alignItems: "center",
      display: "flex",
    },
    versionIcon: {
      color: "#07193E",
      marginRight: 20,
    },
    loaderAlign: {
      textAlign: "center",
    },
    advancedContainer: {
      justifyContent: "flex-end",
      display: "flex",
    },
    optionsContainer: {
      padding: 0,
      marginBottom: 25,
    },
    advancedConfiguration: {
      color: "#2781B0",
      fontSize: 10,
      textDecoration: "underline",
      border: "none",
      backgroundColor: "transparent",
      cursor: "pointer",
      alignItems: "center",
      display: "flex",

      "&:hover": {
        color: "#07193E",
      },

      "& svg": {
        width: 10,
        alignSelf: "center",
        marginLeft: 5,
      },
    },
    advancedOpen: {
      transform: "rotateZ(-90deg) translateX(-4px) translateY(2px)",
    },
    advancedClosed: {
      transform: "rotateZ(90deg)",
    },
    advancedContent: {
      backgroundColor: "#F5F7F9",
      maxHeight: 0,
      transitionDuration: "0.3s",
      overflow: "hidden",
      padding: "0 15px",
      "&.open": {
        maxHeight: 400,
        padding: 15,
      },
    },
  });

const TestWrapper = ({
  title,
  children,
  classes,
  advancedVisible,
  advancedContent,
}: ITestWrapper) => {
  const [version, setVersion] = useState<string>("N/A");
  const [totalNodes, setTotalNodes] = useState<number>(0);
  const [totalDrives, setTotalDrives] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [advancedOpen, setAdvancedOpen] = useState<boolean>(false);

  useEffect(() => {
    if (loading) {
      api
        .invoke("GET", `/api/v1/admin/info?defaultOnly=true`)
        .then((res: Usage) => {
          const totalServers = res.servers?.length;
          setTotalNodes(totalServers);

          if (res.servers.length > 0) {
            setVersion(res.servers[0].version);

            const totalServers = res.servers.reduce(
              (prevTotal: number, currentElement: ServerInfo) => {
                return prevTotal + currentElement.drives.length;
              },
              0
            );
            setTotalDrives(totalServers);
          }

          setLoading(false);
        })
        .catch((err: ErrorResponseHandler) => {
          setLoading(false);
        });
    }
  }, [loading]);

  return (
    <Grid item xs={12}>
      <Grid item xs={12} className={classes.titleBar}>
        {title}
      </Grid>
      <Grid item xs={12}>
        <Grid item xs={12} className={classes.optionsContainer}>
          <Grid container className={classes.divisorContainer}>
            {!loading ? (
              <Fragment>
                <Grid item xs={12} md={4} className={classes.serversData}>
                  <DrivesIcon /> <strong>{totalNodes}</strong>
                  &nbsp;nodes,&nbsp;
                  <strong>{totalDrives}</strong>&nbsp; drives
                </Grid>
                <Grid
                  item
                  xs={12}
                  md={4}
                  className={classes.minioVersionContainer}
                >
                  <span className={classes.versionIcon}>
                    <VersionIcon />
                  </span>{" "}
                  MinIO VERSION&nbsp;<strong>{version}</strong>
                </Grid>
                <Grid item xs={12} md={4} className={classes.advancedContainer}>
                  {advancedVisible && (
                    <button
                      onClick={() => {
                        setAdvancedOpen(!advancedOpen);
                      }}
                      className={classes.advancedConfiguration}
                    >
                      Advanced configurations{" "}
                      <span
                        className={
                          advancedOpen
                            ? classes.advancedOpen
                            : classes.advancedClosed
                        }
                      >
                        <ArrowForwardIosIcon />
                      </span>
                    </button>
                  )}
                </Grid>
              </Fragment>
            ) : (
              <Fragment>
                <Grid item xs={12} className={classes.loaderAlign}>
                  <CircularProgress size={25} />
                </Grid>
              </Fragment>
            )}
          </Grid>
          {advancedContent && (
            <Grid
              xs={12}
              className={`${classes.advancedContent} ${
                advancedOpen ? "open" : ""
              }`}
            >
              {advancedContent}
            </Grid>
          )}
        </Grid>
        {children}
      </Grid>
    </Grid>
  );
};

export default withStyles(styles)(TestWrapper);
