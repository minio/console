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

import React, { useEffect, useState } from "react";
import clsx from "clsx";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import { createStyles, Theme, withStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import PageHeader from "../Common/PageHeader/PageHeader";
import { containerForHeader } from "../Common/FormComponents/common/styleLibrary";
import { planDetails, planItems, planButtons } from "./utils";
import ActivationModal from "./ActivationModal";
import api from "../../../common/api";
import { LicenseInfo } from "./types";
import { LinearProgress } from "@material-ui/core";
import { AppState } from "../../../store";
import { connect } from "react-redux";

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
    },
    licenseContainer: {
      padding: "20px 52px 0px 28px",
      background:
        "transparent linear-gradient(180deg, #ffffff 0%, #d6e1e8 100%) 0% 0% no-repeat padding-box",
      boxShadow: "0px 3px 7px #00000014",
      "& h2": {
        color: "#000",
        marginBottom: "50px",
      },
      "& a": {
        textDecoration: "none",
      },
      "& h3": {
        color: "#000",
        marginBottom: "30px",
        fontWeight: "bold",
      },
      "& h6": {
        color: "#000 !important",
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
    },
    detailsContainerBorderHighlighted: {
      border: "1px solid #9a93ad",
      borderBottom: 0,
    },
    detailsTitle: {
      fontSize: 17,
      fontWeight: 700,
      marginBottom: 26,
      paddingTop: 18,
    },
    currentPlan: {
      fontWeight: 700,
      background:
        "transparent linear-gradient(90deg, #073052 0%, #081C42 100%) 0% 0% no-repeat padding-box",
      boxShadow: "0px 3px 7px #00000014",
      color: "#fff",
    },
    detailsPrice: {
      fontSize: 12,
      fontWeight: 700,
      marginBottom: 8,
    },
    detailsCapacityMax: {
      minHeight: 28,
      fontSize: 10,
      fontWeight: 700,
      marginBottom: 12,
      padding: "0% 15%",
      color: "#474747",
    },
    detailsCapacityMin: {
      fontSize: 10,
    },
    itemContainer: {
      height: 36,
      borderTop: "1px solid #e5e5e5",
    },
    itemContainerDetail: {
      height: 48,
      borderTop: "1px solid #e5e5e5",
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
    },
    itemFirst: {
      borderLeft: 0,
      borderRight: 0,
    },
    itemHighlighted: {
      borderLeft: "1px solid #9a93ad",
      borderRight: "1px solid #9a93ad",
    },
    field: {
      textAlign: "left",
      fontWeight: 400,
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
      border: "1px solid #000",
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
    fullWidth: {
      width: "100%",
      height: "100%",
    },
    midWidth: {
      width: "70%",
      float: "left",
      height: "100%",
    },
    smallWidth: {
      width: "30%",
      float: "right",
      height: "100%",
      borderRadius: "0px 3px 0px 0px !important",
    },
    licenseInfo: { color: "#000" },
    licenseInfoTitle: {
      textTransform: "none",
      color: "#000",
    },
    licenseInfoValue: {
      textTransform: "none",
      fontSize: 17,
    },
    licenseDescription: {
      background: "#fff",
      padding: "30px 30px",
      border: "1px solid #e2e5e4",
      borderRadius: "5px 5px 0px 0px",
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
        setLicenseInfo(res);
        setLoadingLicenseInfo(false);
      })
      .catch((err: any) => {
        setLoadingLicenseInfo(false);
      });
  };

  const [activateProductModal, setActivateProductModal] = useState<boolean>(
    false
  );

  const [licenseInfo, setLicenseInfo] = useState<LicenseInfo>();
  const [loadingLicenseInfo, setLoadingLicenseInfo] = useState<boolean>(true);

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
    <React.Fragment>
      <React.Fragment>
        <PageHeader label="License" />
        <Grid container>
          <Grid item xs={operatorMode ? 12 : 6} className={classes.container}>
            <Paper
              className={`${classes.licenseContainer} ${
                operatorMode ? classes.midWidth : classes.fullWidth
              }`}
            >
              {licenseInfo ? (
                <React.Fragment>
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
                        {licenseInfo.storage_capacity}
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
                        {licenseInfo.expires_at}
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
                  </Grid>
                </React.Fragment>
              ) : (
                <React.Fragment>
                  <img src="agpl.png" height={40} alt="agpl" />
                  <Typography component="h2" variant="h6">
                    GNU Affero General Public License
                  </Typography>
                  <a
                    href={"https://www.gnu.org/licenses/agpl-3.0.html"}
                    target="_blank"
                    rel="nofollow noopener noreferrer"
                  >
                    <div className={classes.licenseDescription}>
                      <Typography component="h3">Version 3</Typography>
                      <Typography component="h6">
                        The GNU Affero General Public License is a free,
                        copyleft license for software and other kinds of works,
                        specifically designed to ensure cooperation with the
                        Community in the case of network server software.
                      </Typography>
                    </div>
                  </a>
                </React.Fragment>
              )}
            </Paper>
            {operatorMode && !licenseInfo && (
              <Paper className={`${classes.paper} ${classes.smallWidth}`}>
                <Typography
                  component="h2"
                  variant="h6"
                  className={classes.pageTitle}
                >
                  Choosing between GNU AGPL v3 and Commercial License
                </Typography>
                <Typography component="h6">
                  If you are building proprietary applications, you may want to
                  choose the commercial license included as part of the Standard
                  and Enterprise subscription plans. Applications must otherwise
                  comply with all GNU AGPLv3 obligations and requirements. Click
                  the link below to learn more about Open Source license
                  compliance.
                </Typography>
                <br />
                <a
                  href="https://min.io/compliance"
                  className={classes.openSourcePolicy}
                  target="_blank"
                  rel="nofollow noopener noreferrer"
                >
                  Open Source Policy Compliance
                </a>
              </Paper>
            )}
          </Grid>
          <Grid
            item
            xs={12}
            className={classes.container}
            style={{ padding: "0px 33px" }}
          >
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
                            }
                          )}
                        >
                          {(!licenseInfo && details.title === "Community") ||
                          (licenseInfo &&
                            licenseInfo.plan.toLowerCase() ===
                              details.title.toLowerCase()) ? (
                            <Grid item xs={12} className={classes.currentPlan}>
                              Current Plan
                            </Grid>
                          ) : null}
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
                          <Grid
                            item
                            xs={12}
                            className={classes.detailsCapacityMin}
                          >
                            {details.capacityMin}
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
                        <Grid container item xs={3} className={classes.item}>
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
                            classes.itemHighlighted
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
                            classes.itemHighlighted
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
                    {planButtons.map((button: any) => {
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
                              variant="contained"
                              color="primary"
                              className={classes.button}
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
                                window.open(button.link, "_blank");
                              }}
                            >
                              {button.text}
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
      </React.Fragment>
    </React.Fragment>
  );
};

export default connector(withStyles(styles)(License));
