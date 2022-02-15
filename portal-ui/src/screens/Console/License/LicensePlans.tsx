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

import React, {Fragment, useEffect, useState} from "react";
import clsx from "clsx";
import { planDetails, planItems} from "./utils";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import Button from "@mui/material/Button";
import {Theme, useTheme} from "@mui/material/styles";
import createStyles from "@mui/styles/createStyles";
import {SubnetInfo} from "./types";
import withStyles from "@mui/styles/withStyles";
import {Box, Tooltip} from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";
import HelpIcon from "../../../icons/HelpIcon";

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


const formatLabel = (label = "", isLink = false, isSmallScreen = false, setLicenseModal:any) => {

    const lbl = label === "N/A" ? (
        isSmallScreen ? label : ""
    ) : label === "Yes" ? (
        <CheckCircleIcon className="min-icon"/>
    ) : (
        <Fragment>
            {isLink ? (
                <Button
                    sx={{
                        textDecoration:"underline"
                    }}
                    disableRipple
                    disableFocusRipple
                    variant="text"
                    color="primary"
                    size="small"
                     onClick={() => setLicenseModal && setLicenseModal(true)}
                >
                    {label}
                </Button>
            ) : (
                label
            )}
        </Fragment>
    )

    return lbl;
}

const PlanHeader = ({
                        isActive,
                        isXsViewActive,
                        title,
                        tooltipText = "",
                        onClick
                    }: {
    isActive: boolean,
    isXsViewActive: boolean,
    title: string,
    price?: string,
    capacity: string,
    tooltipText?: string,
    onClick: any
}) => {

    const plan = title.toLowerCase()
    return (
        <Box className={clsx({
            "active": isActive,
            [`xs-active`]: isXsViewActive,
        })
        }

             onClick={() => {
                 onClick && onClick(plan)
             }}

             sx={
                 {
                     display: "flex",
                     alignItems: "center",
                     justifyContent: "center",
                     flexFlow: "column",
                     borderLeft: "1px solid #eaeaea",
                     "& .plan-header": {
                         display: "flex",
                         alignItems: "center",
                         justifyContent: "center",
                         flexFlow: "column"
                     },

                     "& .title-block": {
                         paddingTop: "20px",
                         paddingBottom: "20px",

                         "& .title": {
                             fontSize: "19px",
                             fontWeight: 600
                         },

                     },
                     "& .cur-plan-text": {
                         padding: "10px",
                         fontSize: "12px",
                     },

                     "@media (max-width: 600px)": {
                         cursor: "pointer",
                         "& .title-block": {
                             "& .title": {
                                 fontSize: "14px",
                                 fontWeight: 600
                             }
                         }
                     },

                     "&.active, &.active.xs-active": {
                         borderTop: "3px solid #2781B0",
                         color: "#000000"
                     },
                     "&.active": {
                         background: "#2781B0",
                         color: "#ffffff"
                     },
                     "&.xs-active": {
                         background: "#eaeaea"
                     }


                 }
             }
        >
            <Box className="title-block">
                <div className="title">{title}</div>
                <Tooltip title={tooltipText} placement="top-start">
                    <div className="tool-tip">
                        <HelpIcon/>
                    </div>
                </Tooltip>

            </Box>
            <div className="cur-plan-text">{isActive ? "Current Plan" : ""}</div>

        </Box>
    )
}

const LICENSE_PLANS={
    COMMUNITY:"community",
    STANDARD:"standard",
    ENTERPRISE:"enterprise"
}

const PAID_PLANS = [LICENSE_PLANS.STANDARD, LICENSE_PLANS.ENTERPRISE]
const LicensePlans = ({
                          licenseInfo,
                          setLicenseModal,
                          operatorMode,
                      }: IRegisterStatus) => {


    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

    let currentPlan = !licenseInfo ? "community" : licenseInfo?.plan?.toLowerCase()

    const isCommunityPlan = currentPlan === LICENSE_PLANS.COMMUNITY
    const isStandardPlan = currentPlan === LICENSE_PLANS.STANDARD
    const isEnterprisePlan = currentPlan === LICENSE_PLANS.ENTERPRISE


    /*In smaller screen use tabbed view to show features*/
    const [xsPlanView, setXsPlanView] = useState("")
    let isXsViewCommunity = xsPlanView === LICENSE_PLANS.COMMUNITY
    let isXsViewStandard = xsPlanView === LICENSE_PLANS.STANDARD
    let isXsViewEnterprise = xsPlanView === LICENSE_PLANS.ENTERPRISE


    const [communityHeader, standardHeader, enterpriseHeader] = planDetails

    const getButton = (link:string, btnText:string, variant:any, plan:string) =>{
        let linkToNav = currentPlan!=="community"  ? "https://subnet.min.io": link
        return(
            <Button
                variant={variant}
                color="primary"
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                    "&.MuiButton-contained":{
                        padding:0,
                        paddingLeft:"8px",
                        paddingRight:"8px"
                    }
                }}
                href={linkToNav}
                disabled={currentPlan !==LICENSE_PLANS.COMMUNITY && currentPlan !== plan}
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
        )
    }

    const onPlanClick = (plan: string) => {
        setXsPlanView(plan)
    }

    useEffect(() => {

        if (isSmallScreen) {
            setXsPlanView(currentPlan || "community")
        } else {
            setXsPlanView("")
        }
    }, [isSmallScreen,currentPlan])
    return (
        <Fragment>


            <Box sx={{
                display: "flex",
                flexFlow: "column",
            }}>

                <Box sx={{
                    height: "8px",
                    background: "rgb(6 48 83)"
                }}>

                </Box>
                <Box sx={{
                    border: "1px solid #eaeaea",
                    paddingLeft: "20px",
                    paddingRight: "20px",
                    paddingBottom: "20px",
                    "@media (max-width: 600px)": {
                        paddingLeft: "0px",
                        paddingRight: "0px",
                    }
                }}>
                    <Box sx={{
                        display: "grid",
                        gridTemplateRows: "1fr",
                        gridTemplateColumns: {
                            sm: "1fr 1fr 1fr 1fr",
                            xs: "1fr 1fr 1fr"
                        },

                        "@media (max-width: 600px)": {
                            "& .tool-tip, .plan-price, .plan-capacity": {
                                display: "none"
                            },

                            "& .feature-col": {
                                display: "none"
                            },
                            "& .title-block": {
                                padding: ".2rem",
                            },
                            "& .plan-header": {
                                paddingBottom: "0"
                            },

                            "& .feature-title-row": {
                                paddingLeft: "5px",
                            }

                        },
                        "& .plan-header": {
                            paddingBottom: "1.5rem"
                        },
                        "& .title-block": {
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",

                            "& .title": {
                                fontSize: "16px",
                            },

                            "& .tool-tip": {
                                marginLeft: "8px",
                                "& .min-icon": {
                                    height: "12px",
                                    width: "12px"
                                }
                            }
                        }

                    }}>
                        <Box className="feature-col">
                            {/*Spacer*/}
                        </Box>
                        <PlanHeader
                            isActive={isCommunityPlan}
                            isXsViewActive={isXsViewCommunity}
                            capacity={communityHeader.capacityMax || ""}
                            title={communityHeader.title}
                            price={communityHeader.price}
                            onClick={isSmallScreen ? onPlanClick : null}
                            tooltipText={"Designed for developers who are building open source applications in compliance with the AGPL v3 license and are able to support themselves. The community version of MinIO has all the functionality of the Standard and Enterprise editions."}
                        />

                        <PlanHeader
                            isActive={isStandardPlan}
                            isXsViewActive={isXsViewStandard}
                            capacity={standardHeader.capacityMax || ""}
                            title={standardHeader.title}
                            price={standardHeader.price}
                            onClick={isSmallScreen ? onPlanClick : null}
                            tooltipText={"Designed for customers who require a commercial license and can mostly self-support but want the peace of mind that comes with the MinIO Subscription Network’s suite of operational capabilities and direct-to-engineer interaction. The Standard version is fully featured but with SLA limitations. "}
                        />

                        <PlanHeader
                            isActive={isEnterprisePlan}
                            isXsViewActive={isXsViewEnterprise}
                            capacity={enterpriseHeader.capacityMax || ""}
                            title={enterpriseHeader.title}
                            price={enterpriseHeader.price}
                            onClick={isSmallScreen ? onPlanClick : null}
                            tooltipText={"Designed for mission critical environments where both a license and strict SLAs are required. The Enterprise version is fully featured but comes with additional capabilities. "}
                        />
                    </Box>
                    <Box sx={{
                        display: "grid",
                        gridTemplateRows: "1fr",
                        gridTemplateColumns: "1fr",
                        "& .feature-title-row": {
                            paddingLeft: "10px",
                            background: "rgb(247 247 247)",
                            height: "32px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "flex-start"
                        }

                    }}>
                        <div className="feature-title-row">Features</div>
                    </Box>
                    <Box sx={{
                        display: "grid",
                        gridTemplateRows: "1fr",
                        borderBottom: "0",
                        gridTemplateColumns: {
                            sm: "1fr 1fr 1fr 1fr",
                            xs: "1fr"
                        },
                        "& .feature-row": {
                            display: "flex",
                            flexFlow: "column",
                            alignItems: "center",
                            justifyContent: "center",
                            textAlign: "center",
                        },

                        "& .plan-col": {
                            borderBottom: "1px solid #eaeaea",
                            borderLeft: "1px solid #eaeaea",
                            minHeight: "50px",
                            padding: "5px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",

                            "& .min-icon": {
                                height: "16px",
                                width: "16px",
                                fill: "#385973"
                            },

                            "&.unit-price": {
                                "& .feature-main": {
                                    fontSize: "17px",
                                    fontWeight: 500,
                                },

                                "& .feature-sub": {
                                    fontSize: "15px",
                                    color: "#4b4b4b",
                                    fontWeight: 500,
                                }
                            }
                        },
                        "& .feature-col": {
                            display: "flex",
                            alignItems: "center",
                            borderBottom: "1px solid #eaeaea",
                            minHeight: "50px",
                            padding: "5px",
                        },
                        "& .xs-only-feature-col": {
                            maxWidth: '80px',
                            display: "none",
                        },
                        "@media (max-width: 600px)": {

                            "& .feature-row": {
                                maxWidth: "160px",
                                display: "flex",
                                justifyContent: "flex-end",
                                flexFlow: "column",
                                alignItems: "flex-end",
                                textAlign: "end",
                            },
                            "& .xs-only-feature-col": {
                                display: "block"
                            },
                            "& .feature-col": {
                                display: "none"
                            },

                            "& .plan-col": {
                                display: "none",
                                borderLeft: "0px",
                                borderBottom: "1px solid #eaeaea",
                                minHeight: "50px",
                                padding: "5px",

                                "&.active": {
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "space-between"

                                }
                            }
                        },


                    }}>

                        {planItems.map((item: any, index:number) => {

                            const clsName = item.className || ""
                            const community = item.plans["Community"]
                            const standard = item.plans["Standard"]
                            const enterprise = item.plans["Enterprise"]

                            const linkTracker = `?ref=${operatorMode ? "op" : "con"}`
                            return (
                                <Fragment key={item.id}>
                                    <Box className="feature-col">
                                        {item.field}
                                    </Box>
                                    <Box className={
                                        clsx("plan-col", {
                                            "active": isXsViewCommunity,
                                            [clsName]: true
                                        })
                                    }>
                                        <div className="xs-only-feature-col"> {item.field}</div>
                                        <div className="feature-row">
                                            <span
                                                className="feature-main">{formatLabel(community.label, community.link, isSmallScreen, setLicenseModal)}</span>
                                            <span className="feature-sub">{community.detail}</span>
                                        </div>
                                    </Box>
                                    <Box className={
                                        clsx("plan-col", {
                                            "active": isXsViewStandard,
                                            [clsName]: true
                                        })
                                    }>
                                        <div className="xs-only-feature-col"> {item.field}</div>
                                        <div className="feature-row">
                                            <span
                                                className="feature-main">{formatLabel(standard.label, standard.link, isSmallScreen,null)}</span>
                                            <span className="feature-sub"> {standard.detail}</span>
                                        </div>
                                    </Box>
                                    <Box className={
                                        clsx("plan-col", {
                                            "active": isXsViewEnterprise,
                                            [clsName]: true
                                        })
                                    }>
                                        <div className="xs-only-feature-col"> {item.field}</div>
                                        <div className="feature-row">
                                            <span
                                                className="feature-main">{formatLabel(enterprise.label, enterprise.link, isSmallScreen,null)}</span>
                                            <span className="feature-sub">{enterprise.detail}</span>
                                        </div>
                                    </Box>

                                    {
                                        index+1 === planItems.length?(
                                            <Fragment>
                                                <Box className="feature-col">
                                                    {/*Space Col*/}
                                                </Box>
                                                <Box className={
                                                    clsx("plan-col", {
                                                        "active": isXsViewCommunity
                                                    })
                                                }>

                                                    {
                                                        getButton(`https://slack.min.io${linkTracker}`, "Join Slack", "outlined", LICENSE_PLANS.COMMUNITY)
                                                    }

                                                </Box>
                                                <Box className={
                                                    clsx("plan-col", {
                                                        "active": isXsViewStandard,
                                                    })
                                                }>
                                                    {
                                                        getButton(`https://min.io/signup${linkTracker}`, !PAID_PLANS.includes(currentPlan)  ?"Subscribe":"Login to SUBNET", "contained",LICENSE_PLANS.STANDARD)
                                                    }
                                                </Box>
                                                <Box className={
                                                    clsx("plan-col", {
                                                        "active": isXsViewEnterprise
                                                    })
                                                }>
                                                    {
                                                        getButton(`https://min.io/signup${linkTracker}`, !PAID_PLANS.includes(currentPlan)  ?"Subscribe":"Login to SUBNET","contained", LICENSE_PLANS.ENTERPRISE)
                                                    }
                                                </Box>
                                            </Fragment>
                                        ):null
                                    }

                                </Fragment>
                            )
                        })}
                    </Box>
                </Box>
            </Box>
        </Fragment>
    );
};

export default withStyles(styles)(LicensePlans);
