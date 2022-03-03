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

import React, { Fragment, useEffect, useState } from "react";
import clsx from "clsx";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import Button from "@mui/material/Button";
import { Theme, useTheme } from "@mui/material/styles";
import createStyles from "@mui/styles/createStyles";
import { SubnetInfo } from "./types";
import withStyles from "@mui/styles/withStyles";
import { Box, Tooltip } from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";
import { HelpIconFilled, LicenseDocIcon, OpenSourceIcon } from "../../../icons";
import {
  LICENSE_PLANS,
  FEATURE_ITEMS,
  COMMUNITY_PLAN_FEATURES,
  STANDARD_PLAN_FEATURES,
  ENTERPRISE_PLAN_FEATURES,
  PAID_PLANS,
} from "./utils";

const styles = (theme: Theme) =>
  createStyles({
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

const PlanHeader = ({
  isActive,
  isXsViewActive,
  title,
  onClick,
  children,
}: {
  isActive: boolean;
  isXsViewActive: boolean;
  title: string;
  price?: string;
  tooltipText?: string;
  onClick: any;
  children: any;
}) => {
  const plan = title.toLowerCase();
  return (
    <Box
      className={clsx({
        "plan-header": true,
        active: isActive,
        [`xs-active`]: isXsViewActive,
      })}
      onClick={() => {
        onClick && onClick(plan);
      }}
      sx={{
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "center",
        flexFlow: "column",
        paddingLeft: "26px",
        borderLeft: "1px solid #eaeaea",
        "& .plan-header": {
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexFlow: "column",
        },

        "& .title-block": {
          paddingTop: "20px",
          display: "flex",
          alignItems: "flex-start",
          flexFlow: "column",
          width: "100%",

          marginTop: "auto",
          marginBottom: "auto",
          "& .title-main": {
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flex: 1,
          },
          "& .min-icon": {
            marginLeft: "13px",
            height: "13px",
            width: "13px",
          },

          "& .title": {
            fontSize: "22px",
            fontWeight: 600,
          },
        },

        "& .price-line": {
          fontSize: "16px",
          fontWeight: 600,
        },
        "& .minimum-cost": {
          fontSize: "14px",
          fontWeight: 400,
          marginBottom: "5px",
        },
        "& .open-source": {
          fontSize: "14px",
          display: "flex",
          marginBottom: "5px",
          alignItems: "center",
          "& .min-icon": {
            marginRight: "8px",
            height: "12px",
            width: "12px",
          },
        },

        "& .cur-plan-text": {
          fontSize: "12px",
          textTransform: "uppercase",
        },

        "@media (max-width: 600px)": {
          cursor: "pointer",
          "& .title-block": {
            "& .title": {
              fontSize: "14px",
              fontWeight: 600,
            },
          },
        },

        "&.active, &.active.xs-active": {
          borderTop: "3px solid #2781B0",
          color: "#ffffff",

          "& .min-icon": {
            fill: "#ffffff",
          },
        },
        "&.active": {
          background: "#2781B0",
          color: "#ffffff",
        },
        "&.xs-active": {
          background: "#eaeaea",
        },
      }}
    >
      {children}
    </Box>
  );
};

const FeatureTitleRowCmp = (props: { featureLabel: any }) => {
  return (
    <Box className="feature-title">
      <Box className="feature-title-info">
        <div className="xs-only">{props.featureLabel} </div>
      </Box>
    </Box>
  );
};

const PricingFeatureItem = (props: {
  featureLabel: any;
  label?: string;
  detail?: string;
  xsLabel?: string;
}) => {
  return (
    <Box className="feature-item">
      <Box className="feature-item-info">
        <div className="xs-only">{props.featureLabel} </div>
        <Box className="plan-feature">
          <div>{props.label || ""}</div>
          {props.detail ? <div>{props.detail}</div> : null}
          <div className="xs-only">{props.xsLabel} </div>
        </Box>
      </Box>
    </Box>
  );
};

const LicensePlans = ({
  licenseInfo,
  setLicenseModal,
  operatorMode,
}: IRegisterStatus) => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  let currentPlan = !licenseInfo
    ? "community"
    : licenseInfo?.plan?.toLowerCase();

  const isCommunityPlan = currentPlan === LICENSE_PLANS.COMMUNITY;
  const isStandardPlan = currentPlan === LICENSE_PLANS.STANDARD;
  const isEnterprisePlan = currentPlan === LICENSE_PLANS.ENTERPRISE;

  const isPaidPlan = PAID_PLANS.includes(currentPlan);

  /*In smaller screen use tabbed view to show features*/
  const [xsPlanView, setXsPlanView] = useState("");
  let isXsViewCommunity = xsPlanView === LICENSE_PLANS.COMMUNITY;
  let isXsViewStandard = xsPlanView === LICENSE_PLANS.STANDARD;
  let isXsViewEnterprise = xsPlanView === LICENSE_PLANS.ENTERPRISE;

  const getCommunityPlanHeader = () => {
    const tooltipText =
      "Designed for developers who are building open source applications in compliance with the AGPL v3 license and are able to support themselves. The community version of MinIO has all the functionality of the Standard and Enterprise editions.";

    return (
      <PlanHeader
        isActive={isCommunityPlan}
        isXsViewActive={isXsViewCommunity}
        title={"community"}
        onClick={isSmallScreen ? onPlanClick : null}
      >
        <Box className="title-block">
          <Box className="title-main">
            <div className="title">Community</div>
            <Tooltip title={tooltipText} placement="top-start">
              <div className="tool-tip">
                <HelpIconFilled />
              </div>
            </Tooltip>
          </Box>
          <div className="cur-plan-text">
            {isCommunityPlan ? "Current Plan" : ""}
          </div>
        </Box>
        <div className="open-source">
          <OpenSourceIcon />
          Open Source
        </div>
      </PlanHeader>
    );
  };

  const getStandardPlanHeader = () => {
    const tooltipText =
      "Designed for customers who require a commercial license and can mostly self-support but want the peace of mind that comes with the MinIO Subscription Network’s suite of operational capabilities and direct-to-engineer interaction. The Standard version is fully featured but with SLA limitations. ";

    return (
      <PlanHeader
        isActive={isStandardPlan}
        isXsViewActive={isXsViewStandard}
        title={"Standard"}
        onClick={isSmallScreen ? onPlanClick : null}
      >
        <Box className="title-block">
          <Box className="title-main">
            <div className="title">Standard</div>
            <Tooltip title={tooltipText} placement="top-start">
              <div className="tool-tip">
                <HelpIconFilled />
              </div>
            </Tooltip>
          </Box>
          <div className="cur-plan-text">
            {isStandardPlan ? "Current Plan" : ""}
          </div>
        </Box>
        <div className="price-line">$10 per TiB per month</div>
        <div className="minimum-cost">(Minimum of 100TiB)</div>
      </PlanHeader>
    );
  };

  const getEnterpriseHeader = () => {
    const tooltipText =
      "Designed for mission critical environments where both a license and strict SLAs are required. The Enterprise version is fully featured but comes with additional capabilities. ";

    return (
      <PlanHeader
        isActive={isEnterprisePlan}
        isXsViewActive={isXsViewEnterprise}
        title={"Enterprise"}
        onClick={isSmallScreen ? onPlanClick : null}
      >
        <Box className="title-block">
          <Box className="title-main">
            <div className="title">Enterprise</div>
            <Tooltip title={tooltipText} placement="top-start">
              <div className="tool-tip">
                <HelpIconFilled />
              </div>
            </Tooltip>
          </Box>
          <div className="cur-plan-text">
            {isEnterprisePlan ? "Current Plan" : ""}
          </div>
        </Box>
        <div className="price-line">$20 per TiB per month</div>
        <div className="minimum-cost">(Minimum of 100TiB)</div>
      </PlanHeader>
    );
  };

  const getButton = (
    link: string,
    btnText: string,
    variant: any,
    plan: string
  ) => {
    let linkToNav =
      currentPlan !== "community" ? "https://subnet.min.io" : link;
    return (
      <Button
        variant={variant}
        color="primary"
        target="_blank"
        rel="noopener noreferrer"
        sx={{
          "&.MuiButton-contained": {
            padding: 0,
            paddingLeft: "8px",
            paddingRight: "8px",
          },
        }}
        href={linkToNav}
        disabled={
          currentPlan !== LICENSE_PLANS.COMMUNITY && currentPlan !== plan
        }
        onClick={(e) => {
          e.preventDefault();

          window.open(
            `${linkToNav}?ref=${operatorMode ? "op" : "con"}`,
            "_blank"
          );
        }}
      >
        {btnText}
      </Button>
    );
  };

  const onPlanClick = (plan: string) => {
    setXsPlanView(plan);
  };

  useEffect(() => {
    if (isSmallScreen) {
      setXsPlanView(currentPlan || "community");
    } else {
      setXsPlanView("");
    }
  }, [isSmallScreen, currentPlan]);

  const linkTracker = `?ref=${operatorMode ? "op" : "con"}`;

  const featureList = FEATURE_ITEMS;
  return (
    <Fragment>
      <Box
        sx={{
          border: "1px solid #eaeaea",
          borderTop: "0px",
          marginBottom: "45px",
          overflow: "auto",
          overflowY: "hidden",
          "&::-webkit-scrollbar": {
            width: "5px",
            height: "5px",
          },
          "&::-webkit-scrollbar-track": {
            background: "#F0F0F0",
            borderRadius: 0,
            boxShadow: "inset 0px 0px 0px 0px #F0F0F0",
          },
          "&::-webkit-scrollbar-thumb": {
            background: "#777474",
            borderRadius: 0,
          },
          "&::-webkit-scrollbar-thumb:hover": {
            background: "#5A6375",
          },
        }}
      >
        <Box
          className={"title-blue-bar"}
          sx={{
            height: "8px",
            borderBottom: "8px solid rgb(6 48 83)",
          }}
        />
        <Box
          className={isPaidPlan ? "paid-plans-only" : ""}
          sx={{
            display: "grid",

            margin: "0 1.5rem 0 1.5rem",

            gridTemplateColumns: {
              sm: "1fr 1fr 1fr 1fr",
              xs: "1fr 1fr 1fr",
            },

            "&.paid-plans-only": {
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
            },

            "& .features-col": {
              flex: 1,
              minWidth: "260px",

              "@media (max-width: 600px)": {
                display: "none",
              },
            },

            "& .xs-only": {
              display: "none",
            },

            "& .button-box": {
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "5px 0px 5px 0px",
              borderLeft: "1px solid #eaeaea",
            },
            "& .plan-header": {
              height: "153px",
              borderBottom: "1px solid #eaeaea",
            },
            "& .feature-title": {
              height: "25px",
              paddingLeft: "26px",
              fontSize: "14px",
              background: "#E5E5E5",

              "@media (max-width: 600px)": {
                "& .feature-title-info .xs-only": {
                  display: "block",
                },
              },
            },
            "& .feature-name": {
              minHeight: "60px",
              padding: "5px",
              borderBottom: "1px solid #eaeaea",
              display: "flex",
              alignItems: "center",
              paddingLeft: "26px",
              fontSize: "14px",
              fontWeight: 600,
            },
            "& .feature-item": {
              display: "flex",
              flexFlow: "column",
              alignItems: "flex-start",
              justifyContent: "center",
              minHeight: "60px",
              padding: "5px",
              borderBottom: "1px solid #eaeaea",
              borderLeft: " 1px solid #eaeaea",
              paddingLeft: "26px",
              fontSize: "14px",

              "@media (max-width: 900px)": {
                maxHeight: "30px",
                overflow: "hidden",
              },

              "& .link-text": {
                color: "#2781B0",
              },

              "&.icon-yes": {
                width: "15px",
                height: "15px",
              },
            },

            "& .feature-item-info": {
              flex: 1,
              display: "flex",
              flexFlow: "column",
              alignItems: "flex-start",
              justifyContent: "space-around",

              "@media (max-width: 600px)": {
                display: "flex",
                flexFlow: "row",
                alignItems: "center",
                justifyContent: "space-between",
                width: "100%",
                "& .xs-only": {
                  display: "block",
                  flex: 1,
                },
                "& .plan-feature": {
                  flex: 1,
                  textAlign: "right",
                  paddingRight: "10px",
                },
              },
            },

            "& .plan-col": {
              minWidth: "260px",
              flex: 1,
            },

            "& .active-plan-col": {
              background: "#FDFDFD 0% 0% no-repeat padding-box",
              boxShadow: " 0px 3px 20px #00000038",

              "& .plan-header": {
                backgroundColor: "#2781B0",
              },

              "& .feature-title": {
                background: "#F7F7F7",
              },

              "& .title-main": {
                position: "relative",
                top: "-17px",
              },
              "& .cur-plan-text": {
                position: "relative",
                top: "-17px",
              },
            },
          }}
        >
          <Box className="features-col">
            {featureList.map((fi) => {
              const featureTitleRow = fi.featureTitleRow;
              const isHeader = fi.isHeader;

              if (isHeader) {
                if (isPaidPlan) {
                  return (
                    <Box
                      key={fi.desc}
                      className="plan-header"
                      sx={{
                        fontSize: "14px",
                        paddingLeft: "26px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "flex-start",

                        "& .link-text": {
                          color: "#2781B0",
                        },

                        "& .min-icon": {
                          marginRight: "10px",
                          color: "#2781B0",
                          fill: "#2781B0",
                        },
                      }}
                    >
                      <LicenseDocIcon />
                      <a
                        href={`https://subnet.min.io/terms-and-conditions/${currentPlan}`}
                        rel="noreferrer noopener"
                        className={"link-text"}
                      >
                        View License agreement <br />
                        for the registered plan.
                      </a>
                    </Box>
                  );
                }

                return (
                  <Box
                    key={fi.desc}
                    className={`plan-header`}
                    sx={{
                      fontSize: "14px",
                      fontWeight: 600,
                      paddingLeft: "26px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "flex-start",
                    }}
                  >
                    {fi.label}
                  </Box>
                );
              }
              if (featureTitleRow) {
                return (
                  <Box
                    key={fi.desc}
                    className="feature-title"
                    sx={{
                      fontSize: "14px",
                      fontWeight: 600,
                      textTransform: "uppercase",
                    }}
                  >
                    <div>{fi.desc} </div>
                  </Box>
                );
              }
              return (
                <Box key={fi.desc} className="feature-name">
                  <div>{fi.desc} </div>
                </Box>
              );
            })}
          </Box>
          {!isPaidPlan ? (
            <Box
              className={`plan-col ${
                isCommunityPlan ? "active-plan-col" : "non-active-plan-col"
              }`}
            >
              {COMMUNITY_PLAN_FEATURES.map((fi, idx) => {
                const featureLabel = featureList[idx].desc;
                const { featureTitleRow, isHeader, isOssLicenseLink } = fi;

                if (isHeader) {
                  return getCommunityPlanHeader();
                }
                if (featureTitleRow) {
                  return (
                    <FeatureTitleRowCmp
                      key={fi.id}
                      featureLabel={featureLabel}
                    />
                  );
                }

                if (isOssLicenseLink) {
                  return (
                    <Box
                      key={fi.id}
                      className="feature-item"
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <a
                        href={"https://www.gnu.org/licenses/agpl-3.0.en.html"}
                        rel="noreferrer noopener"
                        className={"link-text"}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setLicenseModal && setLicenseModal(true);
                        }}
                      >
                        GNU AGPL v3
                      </a>
                    </Box>
                  );
                }
                return (
                  <PricingFeatureItem
                    key={fi.id}
                    featureLabel={featureLabel}
                    label={fi.label}
                    detail={fi.detail}
                    xsLabel={fi.xsLabel}
                  />
                );
              })}
              <Box className="button-box">
                {getButton(
                  `https://slack.min.io${linkTracker}`,
                  "Join Slack",
                  "outlined",
                  LICENSE_PLANS.COMMUNITY
                )}
              </Box>
            </Box>
          ) : null}
          <Box
            className={`plan-col ${
              isStandardPlan ? "active-plan-col" : "non-active-plan-col"
            }`}
          >
            {STANDARD_PLAN_FEATURES.map((fi, idx) => {
              const featureLabel = featureList[idx].desc;
              const featureTitleRow = fi.featureTitleRow;
              const isHeader = fi.isHeader;

              if (isHeader) {
                return getStandardPlanHeader();
              }
              if (featureTitleRow) {
                return (
                  <FeatureTitleRowCmp key={fi.id} featureLabel={featureLabel} />
                );
              }
              return (
                <PricingFeatureItem
                  key={fi.id}
                  featureLabel={featureLabel}
                  label={fi.label}
                  detail={fi.detail}
                  xsLabel={fi.xsLabel}
                />
              );
            })}

            <Box className="button-box">
              {getButton(
                `https://min.io/signup${linkTracker}`,
                !PAID_PLANS.includes(currentPlan)
                  ? "Subscribe"
                  : "Login to SUBNET",
                "contained",
                LICENSE_PLANS.STANDARD
              )}
            </Box>
          </Box>
          <Box
            className={`plan-col ${
              isEnterprisePlan ? "active-plan-col" : "non-active-plan-col"
            }`}
          >
            {ENTERPRISE_PLAN_FEATURES.map((fi, idx) => {
              const featureLabel = featureList[idx].desc;
              const { featureTitleRow, isHeader, yesIcon } = fi;

              if (isHeader) {
                return getEnterpriseHeader();
              }

              if (featureTitleRow) {
                return (
                  <FeatureTitleRowCmp key={fi.id} featureLabel={featureLabel} />
                );
              }

              if (yesIcon) {
                return (
                  <Box className="feature-item">
                    <Box className="feature-item-info">
                      <div className="xs-only"> </div>
                      <Box className="plan-feature">
                        <CheckCircleIcon />
                      </Box>
                    </Box>
                  </Box>
                );
              }
              return (
                <PricingFeatureItem
                  key={fi.id}
                  featureLabel={featureLabel}
                  label={fi.label}
                  detail={fi.detail}
                />
              );
            })}
            <Box className="button-box">
              {getButton(
                `https://min.io/signup${linkTracker}`,
                !PAID_PLANS.includes(currentPlan)
                  ? "Subscribe"
                  : "Login to SUBNET",
                "contained",
                LICENSE_PLANS.ENTERPRISE
              )}
            </Box>
          </Box>
        </Box>
      </Box>
    </Fragment>
  );
};

export default withStyles(styles)(LicensePlans);
