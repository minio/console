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
import { FEATURE_ITEMS, FeatureItem, LICENSE_PLANS_INFORMATION } from "./utils";
import styled from "styled-components";
import get from "lodash/get";
import CheckIcon from "./CheckIcon";

const LicensesInformation = styled.div(({ theme }) => ({
  display: "grid",
  gridTemplateColumns: "repeat(3, minmax(270px, 320px))",
  justifyContent: "flex-start",
  marginTop: 30,
  marginLeft: 30,
  "& > div": {
    borderBottom: `${get(theme, "borderColor", "#EAEAEA")} 1px solid`,
    padding: "25px 30px",
    justifyContent: "center",
    "&.first": {
      padding: 0,
    },
    "&.openSource": {
      borderRight: `${get(theme, "signalColors.main", "#002562")} 2px solid`,
      borderLeft: `${get(theme, "signalColors.main", "#002562")} 2px solid`,
      "&.first": {
        borderTop: `${get(theme, "signalColors.main", "#002562")} 2px solid`,
        borderTopLeftRadius: 12,
        borderTopRightRadius: 12,
      },
      "&.last": {
        paddingBottom: 30,
        borderBottom: `${get(theme, "signalColors.main", "#002562")} 2px solid`,
        borderBottomLeftRadius: 12,
        borderBottomRightRadius: 12,
      },
    },
    "&.enterprise": {
      borderRight: `#a0a0a0 2px solid`,
      borderLeft: `#a0a0a0 2px solid`,
      "&.first": {
        borderTop: `#a0a0a0 2px solid`,
        borderTopLeftRadius: 12,
        borderTopRightRadius: 12,
      },
      "&.last": {
        paddingBottom: 30,
        borderBottom: `#a0a0a0 2px solid`,
        borderBottomLeftRadius: 12,
        borderBottomRightRadius: 12,
      },
    },
    "&.feature-information": {
      textAlign: "center" as const,
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
    fontSize: 18,
    textAlign: "center" as const,
    color: "#fff",
    marginBottom: 30,
    padding: "8px 0",
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    "&.openSource": {
      backgroundColor: `${get(theme, "signalColors.main", "#002562")}`,
    },
    "&.enterprise": {
      backgroundColor: "#a0a0a0",
    },
  },
  "& .planIcon": {
    height: 90,
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "center",
    "& svg": {
      height: 50,
    },
  },
  "& .planDescription": {
    display: "flex",
    justifyContent: "center",
  },
}));

const LicensePlans = () => {
  let currentPlan = "community";

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
          height: "40px",
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
            <Box
              className={`first ${index === 1 ? "openSource" : index === 2 ? "enterprise" : ""}`}
            >
              {element !== null && (
                <Box>
                  <Box
                    className={`planName  ${index === 1 ? "openSource" : index === 2 ? "enterprise" : ""}`}
                  >
                    {element.planName}
                  </Box>
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
              <Box className={`feature-information enterprise ${lastItem}`}>
                {renderFeatureInformation(feature.featurePlans.eosPlus || null)}
              </Box>
            </Fragment>
          );
        })}
        {[null, ...LICENSE_PLANS_INFORMATION].map((element, index) => {
          return (
            <Box
              className={`last ${
                index === 1 ? "openSource" : index === 2 ? "enterprise" : ""
              } noBorderBottom`}
              sx={{
                display: "flex",
                justifyContent: "center",
              }}
            >
              {element &&
                getButton(
                  `https://min.io/signup`,
                  element.planType === "commercial" ? "Upgrade" : "Join Slack",
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
