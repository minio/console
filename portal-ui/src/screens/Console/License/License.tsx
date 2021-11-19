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

import React, { Fragment, useEffect, useState } from "react";
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
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { LicenseInfo } from "./types";
import { AppState } from "../../../store";
import { niceBytes } from "../../../common/utils";
import { ErrorResponseHandler } from "../../../common/types";
import { containerForHeader } from "../Common/FormComponents/common/styleLibrary";
import { planButtons, planDetails, planItems } from "./utils";
import PageHeader from "../Common/PageHeader/PageHeader";
import ActivationModal from "./ActivationModal";
import LicenseModal from "./LicenseModal";
import api from "../../../common/api";
import { LicenseIcon } from "../../../icons";

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
        // listStyleType: "none",
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
    paper: {
      padding: "20px 52px 20px 28px",
      backgroundColor: "#FFFFFF",
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
    tableContainer: {
      marginLeft: 28,
    },
    detailsContainer: {
      textAlign: "center",
      paddingBottom: 12,
      borderRadius: "3px 3px 0 0",
      maxWidth: "calc(25% - 8px)",
    },
    detailsContainerBorder: {
      borderLeft: "1px solid #e2e2e2",
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
    currPlan: {
      color: "white",
      backgroundColor: "#4CCB92",
      padding: 4,
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
      "& .item:last-child": {
        borderRight: "1px solid #e5e5e5",
      },
    },
    itemContainerDetail: {
      height: 48,
    },
    item: {
      height: "100%",
      borderLeft: "1px solid #e5e5e5",
      textAlign: "center",
      fontSize: 10,
      fontWeight: 700,
      display: "flex",
      alignItems: "center",
      alignContent: "center",
      maxWidth: "calc(25% - 8px)",
      borderTop: "1px solid #e5e5e5",
    },

    itemFirst: {
      borderLeft: 0,
      borderRight: 0,
    },
    itemHighlighted: {
      borderLeft: "1px solid #e5e5e5",
    },
    field: {
      textAlign: "left",
      fontWeight: 400,
      fontSize: 12,
    },
    checkIcon: {
      fontSize: 15,
      color: "#385973",
    },
    buttonContainer: {
      paddingTop: 8,
      paddingBottom: 24,
      height: "100%",
      display: "flex",
      justifyContent: "center",
      borderLeft: "1px solid #e2e2e2",
      maxWidth: "calc(25% - 8px)",
    },
    buttonContainerBlank: {
      border: 0,
    },
    buttonContainerHighlighted: {
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
      border: "1px solid #EAEDEE",
      borderTop: 0,
      maxWidth: 1180,
    },
    planItemsBorder: {
      height: 7,
      backgroundColor: "#07193E",
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
    clickableBlock: {
      cursor: "pointer",
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
        <div className={clsx(classes.container, classes.mainContainer)}>
          <Grid container>
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
                          <img src="/agpl-logo.svg" height={40} alt="agpl" />{" "}
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
                          works are designed to take away your freedom to share
                          and change the works. By contrast, our General Public
                          Licenses are intended to guarantee your freedom to
                          share and change all versions of a program--to make
                          sure it remains free software for all its users.
                        </Typography>
                        <div className={classes.linkMore}>
                          <Button
                            variant="text"
                            color="primary"
                            size="small"
                            className={clsx(classes.link, classes.linkButton)}
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
                        If you are building proprietary applications, you may
                        want to choose the commercial license included as part
                        of the Standard and Enterprise subscription plans.
                        Applications must otherwise comply with all the GNU
                        AGPLv3 License & Trademark obligations. Follow the links
                        below to learn more about the compliance policy.
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
              <b>Pricing</b>
            </Grid>
            <Grid item xs={12}>
              The MinIO Subscription Network provides exclusive benefits across
              licensing, operations and support. See the pricing table below for
              more information.
            </Grid>

            <Grid item xs={12}>
              <br />
            </Grid>
            <Grid item xs={12}>
              <div className={classes.planItemsBorder} />
            </Grid>
            <Grid item xs={12} className={clsx(classes.planItemsPadding)}>
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
                            classes.detailsContainerBorder
                          )}
                        >
                          <Grid
                            item
                            xs={12}
                            className={classes.planHeader}
                          ></Grid>
                          <Grid item xs={12} className={classes.detailsTitle}>
                            {details.title}
                          </Grid>
                          <Grid item xs={12} className={classes.detailsPrice}>
                            {currentPlan ? (
                              <span className={classes.currPlan}>
                                CURRENT PLAN
                              </span>
                            ) : (
                              details.price
                            )}
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
                          className={clsx(classes.item)}
                        >
                          <Grid item xs={12}>
                            {item.community === "N/A" ? (
                              ""
                            ) : item.community === "Yes" ? (
                              <CheckCircleIcon className={classes.checkIcon} />
                            ) : (
                              <Fragment>
                                {item.communityLink !== undefined &&
                                item.communityLink ? (
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
                                    {item.community}
                                  </Button>
                                ) : (
                                  item.community
                                )}
                              </Fragment>
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
                          {item.standardDetail !== undefined && (
                            <Grid item xs={12}>
                              {item.standardDetail}
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
                          {item.enterpriseDetail !== undefined && (
                            <Grid item xs={12}>
                              {item.enterpriseDetail}
                            </Grid>
                          )}
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
                          className={clsx(classes.buttonContainer, {
                            [classes.buttonContainerHighlighted]:
                              button.text === "Subscribe",
                          })}
                        >
                          <Grid item xs={12}>
                            <Button
                              variant={
                                button.text === "Join Slack"
                                  ? "outlined"
                                  : "contained"
                              }
                              color="primary"
                              className={clsx(classes.button)}
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
            </Grid>
          </Grid>
        </div>
      </Fragment>
    </Fragment>
  );
};

export default connector(withStyles(styles)(License));
