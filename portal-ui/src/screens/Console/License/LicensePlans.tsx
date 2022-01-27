//  This file is part of MinIO Console Server
//  Copyright (c) 2022 MinIO, Inc.
//
//  This program is free software: you can redistribute it and/or modify
//  it under the terms of the GNU Affero General Public License as published by
//  the Free Software Foundation, either version 3 of the License, or
//  (at your option) any later version.
//
//  This program is distributed in the hope that it will be useful,
//  but WITHOUT ANY WARRANTY; without even the implied warranty of
//  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
//  GNU Affero General Public License for more details.
//
//  You should have received a copy of the GNU Affero General Public License
//  along with this program.  If not, see <http://www.gnu.org/licenses/>.

import React, { Fragment } from "react";
import Grid from "@mui/material/Grid";
import clsx from "clsx";
import ActivationModal from "./ActivationModal";
import { planButtons, planDetails, planItems } from "./utils";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import Button from "@mui/material/Button";
import { Theme } from "@mui/material/styles";
import createStyles from "@mui/styles/createStyles";
import { SubnetInfo } from "./types";
import withStyles from "@mui/styles/withStyles";

const styles = (theme: Theme) =>
  createStyles({
    planItemsPadding: {
      border: "1px solid #EAEDEE",
      borderTop: 0,
      maxWidth: 1180,
    },
    planItemsBorder: {
      height: 7,
      backgroundColor: "#07193E",
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
    detailsContainerBorder: {
      borderLeft: "1px solid #e2e2e2",
    },
    detailsTitle: {
      fontSize: 19,
      fontWeight: 700,
      marginBottom: 26,
      paddingTop: 18,
      lineHeight: 1,
    },
    currPlan: {
      color: "white",
      backgroundColor: "#2781B0",
    },
    planHeader: {
      padding: 8,
    },
    detailsPrice: {
      fontSize: 13,
      fontWeight: 700,
    },
    detailsCapacityMax: {
      minHeight: 28,
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
      borderTop: "1px solid #e5e5e5",
    },

    itemFirst: {
      borderLeft: 0,
      borderRight: 0,
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
    activateLink: {
      color: "#1C5A8D",
      fontWeight: "bold",
      clear: "both",
      background: "none",
      border: "none",
      textDecoration: "underline",
      cursor: "pointer",
    },
    currentPlanBG: {
      background: "#022A4A 0% 0% no-repeat padding-box",
      color: "#FFFFFF",
      borderTop: "1px solid #52687d",
    },
  });

interface IRegisterStatus {
  classes: any;
  activateProductModal: any;
  closeModalAndFetchLicenseInfo: any;
  licenseInfo: SubnetInfo | undefined;
  setLicenseModal: React.Dispatch<React.SetStateAction<boolean>>;
  operatorMode: boolean;
  currentPlanID: number;
  setActivateProductModal: any;
}

const LicensePlans = ({
  classes,
  activateProductModal,
  closeModalAndFetchLicenseInfo,
  licenseInfo,
  setLicenseModal,
  operatorMode,
  currentPlanID,
  setActivateProductModal,
}: IRegisterStatus) => {
  const planDetailsFiltered = planDetails.filter((item) => {
    if (licenseInfo) {
      if (item.title === "Community") {
        return false;
      }
    }
    return true;
  });

  const planButtonsFiltered = planButtons.filter((item) => {
    if (licenseInfo) {
      if (item.plan === "Community") {
        return false;
      }
    }
    return true;
  });

  const gridColWidth = licenseInfo ? 4 : 3;

  return (
    <Fragment>
      <Grid item xs={12}>
        <div className={classes.planItemsBorder} />
      </Grid>
      <Grid item xs={12} className={clsx(classes.planItemsPadding)}>
        <Grid container>
          <ActivationModal
            open={activateProductModal}
            closeModal={() => closeModalAndFetchLicenseInfo()}
          />
          <Grid container item xs={12} className={classes.tableContainer}>
            <Grid container item xs={12}>
              <Grid item xs={gridColWidth} />
              {planDetailsFiltered.map((details: any) => {
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
                    xs={gridColWidth}
                    justifyContent={"center"}
                    className={clsx(classes.detailsContainerBorder, {
                      [classes.currPlan]: currentPlan,
                    })}
                  >
                    <Grid item xs={10} className={classes.planHeader}></Grid>
                    <Grid item xs={10} className={classes.detailsTitle}>
                      {details.title}
                      {currentPlan && (
                        <Fragment>
                          <div style={{ fontSize: 10 }}>CURRENT PLAN</div>
                        </Fragment>
                      )}
                    </Grid>
                    <Grid item xs={10} className={classes.detailsPrice}>
                      {details.price}
                    </Grid>
                    <Grid item xs={10} className={classes.detailsCapacityMax}>
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
                    xs={gridColWidth}
                    className={clsx(
                      classes.item,
                      classes.field,
                      classes.itemFirst
                    )}
                  >
                    {item.field}
                  </Grid>
                  {planDetailsFiltered.map((pd) => {
                    return (
                      <Fragment>
                        <Grid
                          container
                          item
                          xs={gridColWidth}
                          className={clsx(classes.item)}
                        >
                          <Grid item xs={12}>
                            {item.plans[pd.title].label === "N/A" ? (
                              ""
                            ) : item.plans[pd.title].label === "Yes" ? (
                              <CheckCircleIcon className={classes.checkIcon} />
                            ) : (
                              <Fragment>
                                {item.plans[pd.title].link ? (
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
                                    {item.plans[pd.title].label}
                                  </Button>
                                ) : (
                                  item.plans[pd.title].label
                                )}
                              </Fragment>
                            )}
                          </Grid>
                          {item.plans[pd.title].detail !== undefined && (
                            <Grid item xs={12}>
                              {item.plans[pd.title].detail}
                            </Grid>
                          )}
                        </Grid>
                      </Fragment>
                    );
                  })}
                </Grid>
              );
            })}
            <Grid container item xs={12}>
              <Grid
                item
                xs={gridColWidth}
                className={clsx(
                  classes.buttonContainer,
                  classes.buttonContainerBlank
                )}
              />
              {planButtonsFiltered.map((button: any, index: any) => {
                return (
                  <Grid
                    key={button.id}
                    container
                    item
                    xs={gridColWidth}
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
                            `${button.link}?ref=${operatorMode ? "op" : "con"}`,
                            "_blank"
                          );
                        }}
                      >
                        {currentPlanID !== index && index > 0
                          ? button.text2
                          : button.text}
                      </Button>
                    </Grid>
                  </Grid>
                );
              })}
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Fragment>
  );
};

export default withStyles(styles)(LicensePlans);
