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
    tableContainer: {
      marginLeft: 28,
    },
    detailsContainer: {
      textAlign: "center",
      paddingTop: 18,
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
      border: "1px solid #9a93ad",
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
  console.log("operatorMode", operatorMode);
  return (
    <React.Fragment>
      {licenseInfo ? (
        <React.Fragment>
          <PageHeader label="License" />
          <Grid item xs={12} className={classes.container}>
            <Paper className={classes.paper}>
              <Grid container>
                <Grid item xs={12}>
                  <Typography
                    component="h2"
                    variant="h6"
                    className={classes.pageTitle}
                  >
                    Subscription Information
                  </Typography>
                  Account ID: {licenseInfo.account_id}
                  <br />
                  <br />
                  Email: {licenseInfo.email}
                  <br />
                  <br />
                  Plan: {licenseInfo.plan}
                  <br />
                  <br />
                  Organization: {licenseInfo.organization}
                  <br />
                  <br />
                  Storage Capacity: {licenseInfo.storage_capacity}
                  <br />
                  <br />
                  Expiration: {licenseInfo.expires_at}
                </Grid>
              </Grid>
            </Paper>
          </Grid>
        </React.Fragment>
      ) : (
        <React.Fragment>
          <PageHeader label="License" />
          {operatorMode ? (
            <Button
              className={classes.licenseButton}
              variant="contained"
              color="primary"
              onClick={() => setActivateProductModal(true)}
            >
              Activate Product
            </Button>
          ) : null}
          <Grid container>
            <Grid item xs={12} className={classes.container}>
              <Paper className={classes.paper}>
                <Grid container>
                  {operatorMode ? (
                    <ActivationModal
                      open={activateProductModal}
                      closeModal={() => closeModalAndFetchLicenseInfo()}
                    />
                  ) : null}
                  <Grid item xs={12}>
                    <Typography
                      component="h2"
                      variant="h6"
                      className={classes.pageTitle}
                    >
                      Upgrade to commercial license
                    </Typography>
                  </Grid>
                  <Grid
                    container
                    item
                    xs={12}
                    className={classes.tableContainer}
                  >
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
                                <CheckCircleIcon
                                  className={classes.checkIcon}
                                />
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
                                <CheckCircleIcon
                                  className={classes.checkIcon}
                                />
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
                                <CheckCircleIcon
                                  className={classes.checkIcon}
                                />
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
                            className={clsx(classes.buttonContainer, {
                              [classes.buttonContainerHighlighted]:
                                button.text === "Subscribe",
                            })}
                          >
                            <Button
                              variant={
                                button.text === "Subscribe"
                                  ? "contained"
                                  : "outlined"
                              }
                              color="primary"
                              className={classes.button}
                              target="_blank"
                              href={button.link}
                            >
                              {button.text}
                            </Button>
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
      )}
    </React.Fragment>
  );
};

export default connector(withStyles(styles)(License));
