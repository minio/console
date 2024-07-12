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
import { Box, Button } from "mds";
import { SubnetInfo } from "./types";
import { FEATURE_ITEMS, FeatureItem, LICENSE_PLANS_INFORMATION } from "./utils";
import styled from "styled-components";
import get from "lodash/get";
import CheckIcon from "./CheckIcon";

interface IRegisterStatus {
  activateProductModal: any;
  closeModalAndFetchLicenseInfo: any;
  licenseInfo: SubnetInfo | undefined;
  currentPlanID: number;
  setActivateProductModal: any;
}

const LicensesInformation = styled.div(({ theme }) => ({
  display: "grid",
  gridTemplateColumns: "repeat(4, minmax(350px, 400px));",
  justifyContent: "flex-start",
  marginTop: 30,
  marginLeft: 30,
  "& > div": {
    borderBottom: `${get(theme, "borderColor", "#EAEAEA")} 1px solid`,
    padding: "25px 40px",
    justifyContent: "center",
    "&.openSource": {
      borderRight: `#002562 2px solid`,
      borderLeft: `#002562 2px solid`,
      position: "relative",
      "&.first:before": {
        content: "' '",
        width: "calc(100% + 4px)",
        height: 16,
        display: "block",
        backgroundColor: "#001F55",
        position: "absolute",
        top: -14,
        left: -2,
        border: `#002562 2px solid`,
        borderBottom: 0,
        borderTopLeftRadius: 12,
        borderTopRightRadius: 12,
      },
      "&.last": {
        paddingBottom: 30,
        "&:after": {
          content: "' '",
          width: "calc(100% + 4px)",
          height: 16,
          display: "block",
          position: "absolute",
          bottom: -14,
          left: -2,
          border: `#002562 2px solid`,
          borderTop: 0,
          borderBottomLeftRadius: 12,
          borderBottomRightRadius: 12,
        },
      },
    },
    "&.feature-information": {
      textAlign: "center",
    },
    "&.feature-label": {
      paddingLeft: 5,
    },
    "&.noBorderBottom": {
      borderBottom: 0,
    },
  },
  "& .planName": {
    fontWeight: 600,
    fontSize: 35,
    marginBottom: 20,
    textAlign: "center",
    marginTop: 10,
  },
  "& .planIcon": {
    height: 45,
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "center",
    "& svg": {
      height: 35,
    },
    "&.commercial": {
      "& svg": {
        height: 20,
      },
    },
  },
  "& .planDescription": {
    display: "flex",
    justifyContent: "center",
  },
}));

const LicensePlans = ({ licenseInfo }: IRegisterStatus) => {
  let currentPlan = !licenseInfo
    ? "community"
    : licenseInfo?.plan?.toLowerCase();

  const getButton = (link: string, btnText: string, variant: any) => {
    let linkToNav =
      currentPlan !== "community" ? "https://subnet.min.io" : link;
    return (
      <Button
        id={`license-action-${link}`}
        variant={variant}
        sx={{
          marginTop: "12px",
          width: "80%",
          height: "55px",
        }}
        onClick={(e) => {
          e.preventDefault();

          window.open(`${linkToNav}?ref=con`, "_blank");
        }}
        label={btnText}
      />
    );
  };

  const renderFeatureInformation = (content: FeatureItem | null) => {
    if (content) {
      return (
        <Fragment>
          {content.content}
          {content.isCheck && <CheckIcon style={{ width: 16, height: 16 }} />}
        </Fragment>
      );
    }
    return <Fragment />;
  };

  return (
    <Fragment>
      <LicensesInformation>
        {[null, ...LICENSE_PLANS_INFORMATION].map((element, index) => {
          return (
            <Box className={`${index === 1 ? "openSource first" : ""}`}>
              {element !== null && (
                <Box>
                  <Box className={"planName"}>{element.planName}</Box>
                  <Box
                    className={`planIcon ${
                      element.planType === "commercial" ? "commercial" : ""
                    }`}
                  >
                    {element?.planIcon}
                  </Box>
                  <Box className={"planDescription"}>
                    {element?.planDescription}
                  </Box>
                </Box>
              )}
            </Box>
          );
        })}
        {FEATURE_ITEMS.map((feature, index) => {
          const lastItem =
            index === FEATURE_ITEMS.length - 1 ? "noBorderBottom" : "";

          return (
            <Fragment>
              <Box className={`feature-label ${lastItem}`}>
                {feature.featureLabel}
              </Box>
              <Box className={`feature-information  openSource ${lastItem}`}>
                {renderFeatureInformation(
                  feature.featurePlans.openSource || null,
                )}
              </Box>
              <Box className={`feature-information ${lastItem}`}>
                {renderFeatureInformation(feature.featurePlans.eosLite || null)}
              </Box>
              <Box className={`feature-information ${lastItem}`}>
                {renderFeatureInformation(feature.featurePlans.eosPlus || null)}
              </Box>
            </Fragment>
          );
        })}
        {[null, ...LICENSE_PLANS_INFORMATION].map((element, index) => {
          return (
            <Box
              className={`${
                index === 1 ? "openSource last" : ""
              } noBorderBottom`}
              sx={{
                display: "flex",
                justifyContent: "center",
              }}
            >
              {element &&
                getButton(
                  `https://min.io/signup`,
                  element.planType === "commercial"
                    ? "Subscribe"
                    : "Join Slack",
                  element.planType === "commercial" ? "callAction" : "regular",
                )}
            </Box>
          );
        })}
      </LicensesInformation>
    </Fragment>
  );
};

export default LicensePlans;
