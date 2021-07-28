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

import React, { useEffect, useState, Fragment } from "react";
import { connect } from "react-redux";
import { createStyles, Theme, withStyles } from "@material-ui/core/styles";
import { CircularProgress, LinearProgress } from "@material-ui/core";
import clsx from "clsx";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import Moment from "react-moment";
import Typography from "@material-ui/core/Typography";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import { LicenseInfo } from "./types";
import { AppState } from "../../../store";
import { niceBytes } from "../../../common/utils";
import { ErrorResponseHandler } from "../../../common/types";
import { containerForHeader } from "../Common/FormComponents/common/styleLibrary";
import { planDetails, planItems, planButtons } from "./utils";
import PageHeader from "../Common/PageHeader/PageHeader";
import ActivationModal from "./ActivationModal";
import LicenseModal from "./LicenseModal";
import api from "../../../common/api";

const mapState = (state: AppState) => ({
  operatorMode: state.system.operatorMode,
});

const connector = connect(mapState, null);

const styles = (theme: Theme) =>
  createStyles({
    pageTitle: {
      fontSize: 18,
      marginBottom: 20,
    },
    paper: {
      padding: "20px 52px 20px 28px",
      backgroundColor: "#FFFFFF",
    },
    licenseContainer: {
      display: "flex",
      flexWrap: "wrap",
      flexDirection: "row",
      padding: "30px 30px 0px 30px",
      background: "#032F51",
      boxShadow: "0px 3px 7px #00000014",
      "& h2": {
        color: "#FFF",
        flexDirection: "row",
      },
      "& a": {
        textDecoration: "none",
        flexDirection: "row",
      },
      "& h3": {
        color: "#FFFFFF",
        marginBottom: "30px",
        fontWeight: "bold",
      },
      "& h6": {
        color: "#FFFFFF !important",
      },
    },
    tableContainer: {
      marginLeft: 28,
    },
    detailsContainer: {
      textAlign: "center",
      paddingBottom: 12,
      borderRadius: "3px 3px 0 0",
      marginLeft: 8,
      maxWidth: "calc(25% - 8px)",
    },
    detailsContainerBorder: {
      border: "1px solid #e2e2e2",
      borderBottom: 0,
      borderRadius: "4px 4px 0px 0px",
    },
    detailsContainerBorderHighlighted: {
      border: "1px solid #B5B5B5",
      borderBottom: 0,
    },
    detailsTitle: {
      fontSize: 19,
      fontWeight: 700,
      marginBottom: 26,
      paddingTop: 18,
    },
    activePlanHeader: {
      fontWeight: 700,
      background: "#D5DDE5",
      borderRadius: "3px 3px 0px 0px",
      color: "#121212",
      padding: 8,
      borderTop: "1px solid #D5DDE5",
      marginTop: -2,
    },
    planHeader: {
      background: "#FFFFFF",
      borderRadius: "3px 3px 0px 0px",
      padding: 8,
      borderTop: "1px solid #D5DDE5",
    },
    detailsPrice: {
      fontSize: 13,
      fontWeight: 700,
      marginBottom: 8,
    },
    detailsCapacityMax: {
      minHeight: 28,
      fontSize: 10,
      fontWeight: 700,
      marginBottom: 12,
      padding: "0% 15%",
    },
    detailsCapacityMin: {
      fontSize: 10,
    },
    itemContainer: {
      height: 36,
    },
    itemContainerDetail: {
      height: 48,
    },
    item: {
      height: "100%",
      borderLeft: "1px solid #e2e2e2",
      borderRight: "1px solid #e2e2e2",
      textAlign: "center",
      fontSize: 10,
      fontWeight: 700,
      display: "flex",
      alignItems: "center",
      alignContent: "center",
      marginLeft: 8,
      maxWidth: "calc(25% - 8px)",
      borderTop: "1px solid #e5e5e5",
    },
    itemFirst: {
      borderLeft: 0,
      borderRight: 0,
    },
    itemHighlighted: {
      borderLeft: "1px solid #B5B5B5",
      borderRight: "1px solid #B5B5B5",
    },
    field: {
      textAlign: "left",
      fontWeight: 400,
      fontSize: 12,
    },
    checkIcon: {
      height: 12,
      color:
        "transparent linear-gradient(90deg, #073052 0%, #081c42 100%) 0% 0% no-repeat padding-box",
    },
    buttonContainer: {
      paddingTop: 8,
      paddingBottom: 24,
      height: "100%",
      display: "flex",
      justifyContent: "center",
      borderRadius: "0 0 3px 3px",
      border: "1px solid #e2e2e2",
      borderTop: 0,
      marginLeft: 8,
      maxWidth: "calc(25% - 8px)",
    },
    buttonContainerBlank: {
      border: 0,
    },
    buttonContainerHighlighted: {
      border: "1px solid #B5B5B5",
      borderTop: 0,
    },
    button: {
      textTransform: "none",
      fontSize: 15,
      fontWeight: 700,
    },
    licenseButton: {
      float: "right",
      marginTop: 25,
      marginRight: 25,
    },
    openSourcePolicy: {
      color: "#1C5A8D",
      fontWeight: "bold",
    },
    activateLink: {
      color: "#1C5A8D",
      fontWeight: "bold",
      clear: "both",
      background: "none",
      border: "none",
      textDecoration: "underline",
      cursor: "pointer",
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
    fullWidth: {
      width: "100%",
      height: "100%",
    },
    licenseInfo: { color: "#FFFFFF", position: "relative" },
    licenseInfoTitle: {
      textTransform: "none",
      color: "#BFBFBF",
      fontSize: 11,
    },
    licenseInfoValue: {
      textTransform: "none",
      fontSize: 14,
      fontWeight: "bold",
    },
    licenseDescription: {
      background: "#032F51",
      padding: "30px 30px",
      borderTop: "1px solid #e2e5e4",
      borderLeft: "1px solid #e2e5e4",
      borderRight: "1px solid #e2e5e4",
      alignSelf: "flex-end",
    },
    currentPlanBG: {
      background: "#022A4A 0% 0% no-repeat padding-box",
      color: "#FFFFFF",
      borderTop: "1px solid #52687d",
    },
    currentPlanButton: {
      background: "#FFFFFF",
      color: "#022A4A",
      "&:hover": {
        background: "#FFFFFF",
      },
    },
    planItemsPadding: {
      padding: "23px 33px",
    },
    subnetSubTitle: {
      fontSize: 12,
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
  });

interface ILicenseProps {
  classes: any;
  operatorMode: boolean;
}

const License = ({ classes, operatorMode }: ILicenseProps) => {
  const closeModalAndFetchLicenseInfo = () => {
    setActivateProductModal(false);
    fetchLicenseInfo();
  };
  const fetchLicenseInfo = () => {
    setLoadingLicenseInfo(true);
    api
      .invoke("GET", `/api/v1/subscription/info`)
      .then((res: LicenseInfo) => {
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
        setLoadingLicenseInfo(false);
      })
      .catch(() => {
        setLoadingLicenseInfo(false);
      });
  };
  const refreshLicense = () => {
    setLoadingRefreshLicense(true);
    api
      .invoke("POST", `/api/v1/subscription/refresh`, {})
      .then((res: LicenseInfo) => {
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

  const [activateProductModal, setActivateProductModal] =
    useState<boolean>(false);

  const [licenseModal, setLicenseModal] = useState<boolean>(false);

  const [licenseInfo, setLicenseInfo] = useState<LicenseInfo>();
  const [currentPlanID, setCurrentPlanID] = useState<number>(0);
  const [loadingLicenseInfo, setLoadingLicenseInfo] = useState<boolean>(true);
  const [loadingRefreshLicense, setLoadingRefreshLicense] =
    useState<boolean>(false);

  useEffect(() => {
    fetchLicenseInfo();
  }, []);

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
        <Grid container>
          <Grid container xs={12} className={classes.container}>
            <Grid item xs={12} lg={8} className={`${classes.licenseContainer}`}>
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
                            .toString(10)
                        )}
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
                          {licenseInfo.expires_at}
                        </Moment>
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
                        Requester
                      </Typography>
                      <Typography
                        variant="overline"
                        display="block"
                        gutterBottom
                        className={classes.licenseInfoValue}
                      >
                        {licenseInfo.email}
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
                  <Grid container>
                    <img src="/agpl.svg" height={40} alt="agpl" />
                  </Grid>
                  <Grid container>
                    <Typography component="h2" variant="h6">
                      GNU Affero General Public License
                    </Typography>
                  </Grid>
                  <Grid container className={classes.licenseDescription}>
                    <a onClick={() => setLicenseModal(true)} href="#">
                      <Typography component="h3">Version 3</Typography>
                      <Typography component="h6">
                        The GNU Affero General Public License is a free,
                        copyleft license for software and other kinds of works,
                        specifically designed to ensure cooperation with the
                        Community in the case of network server software.
                      </Typography>
                    </a>
                  </Grid>
                </Fragment>
              )}
            </Grid>
            <Grid item xs={12} lg={4} className={`${classes.paper}`}>
              {licenseInfo ? (
                <Fragment>
                  <Typography
                    component="h2"
                    variant="h6"
                    className={classes.pageTitle}
                  >
                    Login to MinIO SUBNET !
                  </Typography>
                  <Typography component="h6" className={classes.subnetSubTitle}>
                    It combines a commercial license with a support experience
                    unlike any other.
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
                        Refresh Licence
                      </button>
                      {loadingRefreshLicense && (
                        <CircularProgress
                          size={16}
                          className={classes.loadingLoginStrategy}
                        />
                      )}
                    </Fragment>
                  )}
                </Fragment>
              ) : (
                <Fragment>
                  <Typography
                    component="h2"
                    variant="h6"
                    className={classes.pageTitle}
                  >
                    Choosing between GNU AGPL v3 and Commercial License
                  </Typography>
                  <Typography component="h6">
                    If you are building proprietary applications, you may want
                    to choose the commercial license included as part of the
                    Standard and Enterprise subscription plans. Applications
                    must otherwise comply with all the GNU AGPLv3 License &
                    Trademark obligations. Follow the links below to learn more
                    about the compliance policy.
                  </Typography>
                  <br />
                  <a
                    href={`https://min.io/compliance?ref=${
                      operatorMode ? "op" : "con"
                    }`}
                    className={classes.openSourcePolicy}
                    target="_blank"
                    rel="nofollow noopener noreferrer"
                  >
                    Open Source Policy Compliance
                  </a>
                  <br />
                  <br />
                  <a
                    href={`https://min.io/logo?ref=${
                      operatorMode ? "op" : "con"
                    }`}
                    className={classes.openSourcePolicy}
                    target="_blank"
                    rel="nofollow noopener noreferrer"
                  >
                    Trademark Policy
                  </a>
                </Fragment>
              )}
            </Grid>
          </Grid>
          <Grid item xs={12} className={clsx(classes.planItemsPadding)}>
            <Paper
              className={classes.paper}
              style={{ borderRadius: "0px 0px 3px 3px" }}
            >
              <Grid container>
                {operatorMode ? (
                  <ActivationModal
                    open={activateProductModal}
                    closeModal={() => closeModalAndFetchLicenseInfo()}
                  />
                ) : null}
                <Grid container item xs={12} className={classes.tableContainer}>
                  <Grid container item xs={12}>
                    <Grid item xs={3} className={classes.detailsContainer} />
                    {planDetails.map((details: any) => {
                      let currentPlan =
                        (!licenseInfo && details.title === "Community") ||
                        (licenseInfo &&
                          licenseInfo.plan.toLowerCase() ===
                            details.title.toLowerCase());
                      return (
                        <Grid
                          key={details.id}
                          container
                          item
                          xs={3}
                          className={clsx(
                            classes.detailsContainer,
                            classes.detailsContainerBorder,
                            {
                              [classes.detailsContainerBorderHighlighted]:
                                details.title !== "Community",
                            },
                            currentPlan ? classes.currentPlanBG : ""
                          )}
                        >
                          <Grid
                            item
                            xs={12}
                            className={
                              currentPlan
                                ? classes.activePlanHeader
                                : classes.planHeader
                            }
                          >
                            {currentPlan ? "Current Plan" : "\u00A0"}
                          </Grid>
                          <Grid item xs={12} className={classes.detailsTitle}>
                            {details.title}
                          </Grid>
                          <Grid item xs={12} className={classes.detailsPrice}>
                            {details.price}
                          </Grid>
                          <Grid
                            item
                            xs={12}
                            className={classes.detailsCapacityMax}
                          >
                            {details.capacityMax || ""}
                          </Grid>
                        </Grid>
                      );
                    })}
                  </Grid>
                  {planItems.map((item: any) => {
                    return (
                      <Grid
                        key={item.id}
                        container
                        item
                        xs={12}
                        className={clsx(
                          classes.itemContainer,
                          item.communityDetail && classes.itemContainerDetail
                        )}
                      >
                        <Grid
                          item
                          xs={3}
                          className={clsx(
                            classes.item,
                            classes.field,
                            classes.itemFirst
                          )}
                        >
                          {item.field}
                        </Grid>
                        <Grid
                          container
                          item
                          xs={3}
                          className={clsx(
                            classes.item,
                            currentPlanID === 0 ? classes.currentPlanBG : ""
                          )}
                        >
                          <Grid item xs={12}>
                            {item.community === "N/A" ? (
                              ""
                            ) : item.community === "Yes" ? (
                              <CheckCircleIcon className={classes.checkIcon} />
                            ) : (
                              item.community
                            )}
                          </Grid>
                          {item.communityDetail !== undefined && (
                            <Grid item xs={12}>
                              {item.communityDetail}
                            </Grid>
                          )}
                        </Grid>
                        <Grid
                          container
                          item
                          xs={3}
                          className={clsx(
                            classes.item,
                            classes.itemHighlighted,
                            currentPlanID === 1 ? classes.currentPlanBG : ""
                          )}
                        >
                          <Grid item xs={12}>
                            {item.standard === "N/A" ? (
                              ""
                            ) : item.standard === "Yes" ? (
                              <CheckCircleIcon className={classes.checkIcon} />
                            ) : (
                              item.standard
                            )}
                          </Grid>
                        </Grid>
                        <Grid
                          container
                          item
                          xs={3}
                          className={clsx(
                            classes.item,
                            classes.itemHighlighted,
                            currentPlanID === 2 ? classes.currentPlanBG : ""
                          )}
                        >
                          <Grid item xs={12}>
                            {item.enterprise === "N/A" ? (
                              ""
                            ) : item.enterprise === "Yes" ? (
                              <CheckCircleIcon className={classes.checkIcon} />
                            ) : (
                              item.enterprise
                            )}
                          </Grid>
                        </Grid>
                      </Grid>
                    );
                  })}
                  <Grid container item xs={12}>
                    <Grid
                      item
                      xs={3}
                      className={clsx(
                        classes.buttonContainer,
                        classes.buttonContainerBlank
                      )}
                    />
                    {planButtons.map((button: any, index: any) => {
                      return (
                        <Grid
                          key={button.id}
                          container
                          item
                          xs={3}
                          style={{ textAlign: "center" }}
                          className={clsx(
                            classes.buttonContainer,
                            currentPlanID === index
                              ? classes.currentPlanBG
                              : "",
                            {
                              [classes.buttonContainerHighlighted]:
                                button.text === "Subscribe",
                            }
                          )}
                        >
                          <Grid item xs={12}>
                            <Button
                              variant="contained"
                              color="primary"
                              className={clsx(
                                classes.button,
                                currentPlanID === index
                                  ? classes.currentPlanButton
                                  : ""
                              )}
                              target="_blank"
                              rel="noopener noreferrer"
                              href="#"
                              disabled={
                                licenseInfo &&
                                licenseInfo.plan.toLowerCase() ===
                                  button.plan.toLowerCase()
                              }
                              onClick={(e) => {
                                e.preventDefault();
                                window.open(
                                  `${button.link}/?ref=${
                                    operatorMode ? "op" : "con"
                                  }`,
                                  "_blank"
                                );
                              }}
                            >
                              {currentPlanID !== index && index > 0
                                ? button.text2
                                : button.text}
                            </Button>
                          </Grid>
                          {operatorMode &&
                            button.text === "Subscribe" &&
                            !(
                              licenseInfo &&
                              licenseInfo.plan.toLowerCase() ===
                                button.plan.toLowerCase()
                            ) && (
                              <Grid item xs={12} style={{ marginTop: "10px" }}>
                                <button
                                  className={classes.activateLink}
                                  onClick={(e) => {
                                    e.preventDefault();
                                    setActivateProductModal(true);
                                  }}
                                >
                                  Activate
                                </button>
                              </Grid>
                            )}
                        </Grid>
                      );
                    })}
                  </Grid>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
        </Grid>
      </Fragment>
    </Fragment>
  );
};

export default connector(withStyles(styles)(License));
