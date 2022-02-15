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
import { Box, LinearProgress } from "@mui/material";
import clsx from "clsx";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { SubnetInfo } from "./types";
import { AppState } from "../../../store";
import { containerForHeader } from "../Common/FormComponents/common/styleLibrary";
import PageHeader from "../Common/PageHeader/PageHeader";
import LicenseModal from "./LicenseModal";
import api from "../../../common/api";
import { LicenseIcon } from "../../../icons";
import { hasPermission } from "../../../common/SecureComponent";
import {
  CONSOLE_UI_RESOURCE,
  IAM_PAGES,
  IAM_PAGES_PERMISSIONS,
} from "../../../common/SecureComponent/permissions";
import RegisterStatus from "../Support/RegisterStatus";
import LicensePlans from "./LicensePlans";
import { Link } from "react-router-dom";
import PageLayout from "../Common/Layout/PageLayout";

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

    openSourcePolicy: {
      fontSize: 14,
      color: "#1C5A8D",
      fontWeight: "bold",
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

  const isRegistered = licenseInfo && clusterRegistered;

  return (
    <Fragment>
      <PageHeader label="License" />
      <Box
        sx={{
          maxWidth: "1015px",
          margin: "auto",
        }}
      >
        <PageLayout>
          <Grid xs={12}>{isRegistered && <RegisterStatus />}</Grid>
          {!isRegistered && (
            <Grid
              item
              xs={12}
              sx={{
                display: "flex",
                flexFlow: "column",
              }}
            >
              <Box
                sx={{
                  padding: "25px",
                  border: "1px solid #eaeaea",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexFlow: {
                    sm: "row",
                    xs: "column",
                  },
                }}
              >
                <Box sx={{ marginRight: "8px" }}>
                  Are you already a customer of MinIO?
                </Box>
                <Link
                  to={IAM_PAGES.REGISTER_SUPPORT}
                  className={classes.link}
                  style={{ fontSize: 14 }}
                >
                  Register this cluster →
                </Link>
              </Box>

              <div className={classes.pageTitle}>
                <Typography component="h2" variant="h6">
                  Choosing between GNU AGPL v3 and Commercial License
                </Typography>
                <br />
                <Typography className={classes.chooseFlavorText}>
                  If you are building proprietary applications, you may want to
                  choose the commercial license included as part of the Standard
                  and Enterprise subscription plans. Applications must otherwise
                  comply with all the GNU AGPLv3 License & Trademark
                  obligations. Follow the links below to learn more about the
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

              <Box
                sx={{
                  padding: "30px 30px 30px 0px",
                  fontSize: "22px",
                  fontWeight: 600,
                }}
              >
                MinIO License and Support plans
              </Box>
            </Grid>
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

          <Grid item xs={12}>
            <Grid container marginTop="35px">
              <Grid item xs={12} lg={12}>
                <Fragment>
                  <LicenseModal
                    open={licenseModal}
                    closeModal={() => setLicenseModal(false)}
                  />
                  <Grid
                    xs={12}
                    className={classes.icon}
                    marginTop={"25px"}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <LicenseIcon />
                    GNU Affero General Public License
                  </Grid>
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
                      The GNU Affero General Public License is a free, copyleft
                      license for software and other kinds of works,
                      specifically designed to ensure cooperation with the
                      Community in the case of network server software.
                    </Typography>
                    <br />
                    <Typography>
                      The licenses for most software and other practical works
                      are designed to take away your freedom to share and change
                      the works. By contrast, our General Public Licenses are
                      intended to guarantee your freedom to share and change all
                      versions of a program--to make sure it remains free
                      software for all its users.
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
              </Grid>
            </Grid>
          </Grid>
        </PageLayout>
      </Box>
    </Fragment>
  );
};

export default connector(withStyles(styles)(License));
