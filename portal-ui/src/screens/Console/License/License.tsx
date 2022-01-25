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
import { connect } from "react-redux";
import { Theme } from "@mui/material/styles";
import createStyles from "@mui/styles/createStyles";
import withStyles from "@mui/styles/withStyles";
import { CircularProgress, LinearProgress } from "@mui/material";
import clsx from "clsx";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import Moment from "react-moment";
import Typography from "@mui/material/Typography";
import { SubnetInfo } from "./types";
import { AppState } from "../../../store";
import { niceBytes } from "../../../common/utils";
import { ErrorResponseHandler } from "../../../common/types";
import { containerForHeader } from "../Common/FormComponents/common/styleLibrary";
import PageHeader from "../Common/PageHeader/PageHeader";
import LicenseModal from "./LicenseModal";
import api from "../../../common/api";
import { LicenseIcon } from "../../../icons";
import { hasPermission } from "../../../common/SecureComponent/SecureComponent";
import {
  CONSOLE_UI_RESOURCE,
  IAM_PAGES,
  IAM_PAGES_PERMISSIONS,
} from "../../../common/SecureComponent/permissions";
import RegisterStatus from "../Support/RegisterStatus";
import LicensePlans from "./LicensePlans";
import { Link } from "react-router-dom";

const mapState = (state: AppState) => ({
  operatorMode: state.system.operatorMode,
});

const connector = connect(mapState, null);

const styles = (theme: Theme) =>
  createStyles({
    pageTitle: {
      backgroundColor: "rgb(250,250,252)",
      marginTop: 40,
      border: "1px solid #EAEDEE",
      padding: 25,
      fontSize: 16,
      fontWeight: "bold",
      "& ul": {
        listStyleType: "square",
        "& li": {
          float: "left",
          fontSize: 14,
          marginRight: 40,
        },
        "& li::before": {
          color: "red",
          content: "•",
        },
      },
    },
    licDet: {
      fontSize: 11,
      color: "#5E5E5E",
    },
    linkMore: {
      marginTop: 10,
      marginBottom: 20,
    },
    chooseFlavorText: {
      color: "#000000",
      fontSize: 14,
    },
    licenseContainer: {
      display: "flex",
      flexWrap: "wrap",
      flexDirection: "row",
      padding: "30px 30px 0px 30px",
      border: "1px solid #EAEDEE",
      "& h2": {
        // color: "#FFF",
        flexDirection: "row",
      },
      "& a": {
        textDecoration: "none",
        flexDirection: "row",
      },
      "& h3": {
        // color: "#FFFFFF",
        marginBottom: "30px",
        fontWeight: "bold",
      },
      "& h6": {
        // color: "#FFFFFF !important",
      },
    },
    link: {
      textDecoration: "underline !important",
      color: theme.palette.info.main,
    },
    linkButton: {
      fontFamily: '"Lato", sans-serif',
      fontWeight: "normal",
      textTransform: "none",
      fontSize: "inherit",
      height: 0,
      padding: 0,
      margin: 0,
    },

    button: {
      textTransform: "none",
      fontSize: 15,
      fontWeight: 700,
    },
    openSourcePolicy: {
      fontSize: 14,
      color: "#1C5A8D",
      fontWeight: "bold",
    },
    subnetRefreshLicenseLink: {
      color: "#1C5A8D",
      fontWeight: "bold",
      clear: "both",
      background: "none",
      border: "none",
      textDecoration: "underline",
      cursor: "pointer",
      fontSize: 13,
    },
    licenseInfo: {
      position: "relative",
    },
    licenseInfoTitle: {
      textTransform: "none",
      color: "#999999",
      fontSize: 11,
    },
    licenseInfoValue: {
      textTransform: "none",
      fontSize: 14,
      fontWeight: "bold",
    },
    subnetSubTitle: {
      fontSize: 14,
    },
    verifiedIcon: {
      width: 96,
      position: "absolute",
      right: 0,
      bottom: 29,
    },
    loadingLoginStrategy: {
      textAlign: "center",
    },
    ...containerForHeader(theme.spacing(4)),
    mainContainer: {
      border: "1px solid #EAEDEE",
      padding: 40,
      margin: 40,
    },
    icon: {
      color: theme.palette.primary.main,
      fontSize: 16,
      fontWeight: "bold",
      marginBottom: 20,
      "& .min-icon": {
        width: 44,
        height: 44,
        marginRight: 15,
      },
    },
  });

interface ILicenseProps {
  classes: any;
  operatorMode: boolean;
}

const License = ({ classes, operatorMode }: ILicenseProps) => {
  const [activateProductModal, setActivateProductModal] =
    useState<boolean>(false);

  const [licenseModal, setLicenseModal] = useState<boolean>(false);

  const [licenseInfo, setLicenseInfo] = useState<SubnetInfo>();
  const [currentPlanID, setCurrentPlanID] = useState<number>(0);
  const [loadingLicenseInfo, setLoadingLicenseInfo] = useState<boolean>(false);
  const [initialLicenseLoading, setInitialLicenseLoading] =
    useState<boolean>(true);
  const [loadingRefreshLicense, setLoadingRefreshLicense] =
    useState<boolean>(false);
  const [clusterRegistered, setClusterRegistered] = useState<boolean>(false);

  const getSubnetInfo = hasPermission(
    CONSOLE_UI_RESOURCE,
    IAM_PAGES_PERMISSIONS[IAM_PAGES.LICENSE],
    true
  );

  const closeModalAndFetchLicenseInfo = () => {
    setActivateProductModal(false);
    fetchLicenseInfo();
  };

  const fetchLicenseInfo = useCallback(() => {
    if (loadingLicenseInfo) {
      return;
    }
    if (getSubnetInfo) {
      setLoadingLicenseInfo(true);
      api
        .invoke("GET", `/api/v1/subnet/info`)
        .then((res: SubnetInfo) => {
          if (res) {
            if (res.plan === "STANDARD") {
              setCurrentPlanID(1);
            } else if (res.plan === "ENTERPRISE") {
              setCurrentPlanID(2);
            } else {
              setCurrentPlanID(1);
            }
            setLicenseInfo(res);
          }
          setClusterRegistered(true);
          setLoadingLicenseInfo(false);
        })
        .catch(() => {
          setClusterRegistered(false);
          setLoadingLicenseInfo(false);
        });
    } else {
      setLoadingLicenseInfo(false);
    }
  }, [loadingLicenseInfo, getSubnetInfo]);

  const refreshLicense = () => {
    setLoadingRefreshLicense(true);
    api
      .invoke("POST", `/api/v1/subscription/refresh`, {})
      .then((res: SubnetInfo) => {
        if (res) {
          if (res.plan === "STANDARD") {
            setCurrentPlanID(1);
          } else if (res.plan === "ENTERPRISE") {
            setCurrentPlanID(2);
          } else {
            setCurrentPlanID(1);
          }
          setLicenseInfo(res);
        }
        setLoadingRefreshLicense(false);
      })
      .catch((err: ErrorResponseHandler) => {
        setLoadingRefreshLicense(false);
      });
  };

  useEffect(() => {
    if (initialLicenseLoading) {
      fetchLicenseInfo();
      setInitialLicenseLoading(false);
    }
  }, [fetchLicenseInfo, initialLicenseLoading, setInitialLicenseLoading]);

  if (loadingLicenseInfo) {
    return (
      <Grid item xs={12}>
        <LinearProgress />
      </Grid>
    );
  }

  return (
    <Fragment>
      <Fragment>
        <PageHeader label="License" />

        <div className={clsx(classes.container, classes.mainContainer)}>
          <Grid container>
            <Grid xs={12}>{licenseInfo && <RegisterStatus />}</Grid>
            {!clusterRegistered && (
              <Fragment>
                <Grid xs={12} className={classes.icon}>
                  <LicenseIcon />
                  GNU Affero General Public License
                </Grid>
                <Grid item xs={12}>
                  <Grid container>
                    <Grid
                      item
                      xs={12}
                      lg={12}
                      className={`${classes.licenseContainer}`}
                    >
                      {licenseInfo ? (
                        <Fragment>
                          <Grid container className={classes.licenseInfo}>
                            <Grid item xs={6}>
                              <Typography
                                variant="button"
                                display="block"
                                gutterBottom
                                className={classes.licenseInfoTitle}
                              >
                                License
                              </Typography>
                              <Typography
                                variant="overline"
                                display="block"
                                gutterBottom
                                className={classes.licenseInfoValue}
                              >
                                Commercial License
                              </Typography>
                              <Typography
                                variant="button"
                                display="block"
                                gutterBottom
                                className={classes.licenseInfoTitle}
                              >
                                Organization
                              </Typography>
                              <Typography
                                variant="overline"
                                display="block"
                                gutterBottom
                                className={classes.licenseInfoValue}
                              >
                                {licenseInfo.organization}
                              </Typography>
                              <Typography
                                variant="button"
                                display="block"
                                gutterBottom
                                className={classes.licenseInfoTitle}
                              >
                                Registered Capacity
                              </Typography>
                              <Typography
                                variant="overline"
                                display="block"
                                gutterBottom
                                className={classes.licenseInfoValue}
                              >
                                {niceBytes(
                                  (licenseInfo.storage_capacity * 1099511627776) // 1 Terabyte = 1099511627776 Bytes
                                    .toString(10),
                                  false
                                )}
                              </Typography>
                            </Grid>
                            <Grid item xs={6}>
                              <Typography
                                variant="button"
                                display="block"
                                gutterBottom
                                className={classes.licenseInfoTitle}
                              >
                                Subscription Plan
                              </Typography>
                              <Typography
                                variant="overline"
                                display="block"
                                gutterBottom
                                className={classes.licenseInfoValue}
                              >
                                {licenseInfo.plan}
                              </Typography>
                              <Typography
                                variant="button"
                                display="block"
                                gutterBottom
                                className={classes.licenseInfoTitle}
                              >
                                Requestor
                              </Typography>
                              <Typography
                                variant="overline"
                                display="block"
                                gutterBottom
                                className={classes.licenseInfoValue}
                              >
                                {licenseInfo.email}
                              </Typography>
                              <Typography
                                variant="button"
                                display="block"
                                gutterBottom
                                className={classes.licenseInfoTitle}
                              >
                                Expiry Date
                              </Typography>
                              <Typography
                                variant="overline"
                                display="block"
                                gutterBottom
                                className={classes.licenseInfoValue}
                              >
                                <Moment format="YYYY-MM-DD">
                                  {licenseInfo.expires_at
                                    .split(" ")
                                    .slice(0, 1)
                                    .join(" ")}
                                </Moment>
                              </Typography>
                            </Grid>
                            <img
                              className={classes.verifiedIcon}
                              src={"/verified.svg"}
                              alt="verified"
                            />
                          </Grid>
                        </Fragment>
                      ) : (
                        <Fragment>
                          <LicenseModal
                            open={licenseModal}
                            closeModal={() => setLicenseModal(false)}
                          />
                          <Grid container justifyContent={"space-between"}>
                            <Grid item>
                              <img
                                src="/agpl-logo.svg"
                                height={40}
                                alt="agpl"
                              />{" "}
                            </Grid>
                            <Grid item className={classes.licDet}>
                              <b>Version 3.</b> 19 November 2007{" "}
                            </Grid>
                          </Grid>

                          <Grid container>
                            <Typography>
                              The GNU Affero General Public License is a free,
                              copyleft license for software and other kinds of
                              works, specifically designed to ensure cooperation
                              with the Community in the case of network server
                              software.
                            </Typography>
                            <br />
                            <Typography>
                              The licenses for most software and other practical
                              works are designed to take away your freedom to
                              share and change the works. By contrast, our
                              General Public Licenses are intended to guarantee
                              your freedom to share and change all versions of a
                              program--to make sure it remains free software for
                              all its users.
                            </Typography>
                            <div className={classes.linkMore}>
                              <Button
                                variant="text"
                                color="primary"
                                size="small"
                                className={clsx(
                                  classes.link,
                                  classes.linkButton
                                )}
                                onClick={() => setLicenseModal(true)}
                              >
                                Read more
                              </Button>
                            </div>
                          </Grid>
                        </Fragment>
                      )}
                    </Grid>
                    <Grid item xs={12} lg={12}>
                      {licenseInfo ? (
                        <div className={classes.pageTitle}>
                          <Typography component="h2" variant="h6">
                            Login to MinIO SUBNET !
                          </Typography>
                          <Typography
                            component="p"
                            className={classes.subnetSubTitle}
                          >
                            It combines a commercial license with a support
                            experience unlike any other.
                          </Typography>
                          <br />
                          <Button
                            variant="contained"
                            color="primary"
                            className={classes.button}
                            target="_blank"
                            rel="noopener noreferrer"
                            href={`https://subnet.min.io/support/?ref=${
                              operatorMode ? "op" : "con"
                            }`}
                          >
                            Login to SUBNET
                          </Button>
                          {operatorMode && (
                            <Fragment>
                              {" "}
                              <br />
                              <br />
                              <button
                                className={classes.subnetRefreshLicenseLink}
                                onClick={(e) => {
                                  e.preventDefault();
                                  refreshLicense();
                                }}
                              >
                                Refresh License
                              </button>
                              {loadingRefreshLicense && (
                                <CircularProgress
                                  size={16}
                                  className={classes.loadingLoginStrategy}
                                />
                              )}
                            </Fragment>
                          )}
                        </div>
                      ) : (
                        <div className={classes.pageTitle}>
                          <Typography component="h2" variant="h6">
                            Choosing between GNU AGPL v3 and Commercial License
                          </Typography>
                          <br />
                          <Typography className={classes.chooseFlavorText}>
                            If you are building proprietary applications, you
                            may want to choose the commercial license included
                            as part of the Standard and Enterprise subscription
                            plans. Applications must otherwise comply with all
                            the GNU AGPLv3 License & Trademark obligations.
                            Follow the links below to learn more about the
                            compliance policy.
                          </Typography>
                          <ul>
                            <li>
                              <a
                                href={`https://min.io/compliance?ref=${
                                  operatorMode ? "op" : "con"
                                }`}
                                className={classes.openSourcePolicy}
                                target="_blank"
                                rel="nofollow noopener noreferrer"
                              >
                                Learn more about GNU AGPL v3
                              </a>
                            </li>
                            <li>
                              <a
                                href={`https://min.io/logo?ref=${
                                  operatorMode ? "op" : "con"
                                }`}
                                className={classes.openSourcePolicy}
                                target="_blank"
                                rel="nofollow noopener noreferrer"
                              >
                                MinIO Trademark Compliance
                              </a>
                            </li>
                          </ul>
                          <div style={{ clear: "both" }} />
                        </div>
                      )}
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item xs={12}>
                  <br />
                </Grid>
                <Grid item xs={12}>
                  <Link
                    to={IAM_PAGES.REGISTER_SUPPORT}
                    className={classes.link}
                    style={{ fontSize: 14 }}
                  >
                    Are you already a customer? Register Here →
                  </Link>
                </Grid>
                <Grid item xs={12}>
                  <br />
                </Grid>
              </Fragment>
            )}

            <LicensePlans
              activateProductModal={activateProductModal}
              closeModalAndFetchLicenseInfo={closeModalAndFetchLicenseInfo}
              licenseInfo={licenseInfo}
              setLicenseModal={setLicenseModal}
              operatorMode={operatorMode}
              currentPlanID={currentPlanID}
              setActivateProductModal={setActivateProductModal}
            />
          </Grid>
        </div>
      </Fragment>
    </Fragment>
  );
};

export default connector(withStyles(styles)(License));
