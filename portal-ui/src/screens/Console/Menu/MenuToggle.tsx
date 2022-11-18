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

import React, { Fragment, Suspense, useEffect } from "react";
import { ApplicationLogo } from "mds";

import { VersionIcon } from "../../../icons";
import { Box, IconButton } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useSelector } from "react-redux";
import useApi from "../Common/Hooks/useApi";
import {
  selDirectPVMode,
  selOpMode,
  setLicenseInfo,
} from "../../../systemSlice";
import { AppState, useAppDispatch } from "../../../store";
import TooltipWrapper from "../Common/TooltipWrapper/TooltipWrapper";

type MenuToggleProps = {
  isOpen: boolean;
  onToggle: (nextState: boolean) => void;
};
const MenuToggle = ({ isOpen, onToggle }: MenuToggleProps) => {
  const stateClsName = isOpen ? "wide" : "mini";

  const dispatch = useAppDispatch();

  const licenseInfo = useSelector(
    (state: AppState) => state?.system?.licenseInfo
  );
  const operatorMode = useSelector(selOpMode);

  const directPVMode = useSelector(selDirectPVMode);

  const [isLicenseLoading, invokeLicenseInfoApi] = useApi(
    (res: any) => {
      dispatch(setLicenseInfo(res));
    },
    () => {
      dispatch(setLicenseInfo(null));
    }
  );

  //Get License info from SUBNET
  useEffect(() => {
    if (!operatorMode) {
      invokeLicenseInfoApi("GET", `/api/v1/subnet/info`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { plan = "" } = licenseInfo || {};

  let logoPlan = "simple";

  if (!isLicenseLoading) {
    if (plan === "STANDARD" || plan === "ENTERPRISE") {
      logoPlan = plan.toLowerCase();
    } else {
      logoPlan = "AGPL";
    }
  }

  return (
    <Box
      className={`${stateClsName}`}
      sx={{
        width: "100%",
        cursor: "pointer",
        "&::after": {
          width: "80%",
          height: "1px",
          display: "block",
          content: "' '",
          backgroundColor: "#0F446C",
          margin: "0px auto",
        },
        "&.wide:hover": {
          background:
            "transparent linear-gradient(270deg, #00000000 0%, #051d39 53%, #54545400 100%) 0% 0% no-repeat padding-box",
        },
      }}
      onClick={() => {
        if (isOpen) {
          onToggle(false);
        }
      }}
    >
      <Box
        className={`${stateClsName}`}
        sx={{
          marginLeft: "26px",
          marginRight: "8px",
          display: "flex",
          alignItems: "center",
          height: "83px",

          "&.mini": {
            flexFlow: "column",
            display: "flex",
            justifyContent: "center",
            gap: "3px",
            alignItems: "center",
            marginLeft: "auto",
            marginRight: "auto",
          },
          "& .logo": {
            background: "transparent",
            width: "180px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            "&.wide": {
              flex: "1",
              "& svg": {
                width: "100%",
                maxWidth: 180,
                fill: "white",
              },
            },
            "&.mini": {
              color: "#ffffff",
              "& svg": {
                width: 24,
                fill: "rgba(255, 255, 255, 0.8)",
              },
            },
          },
        }}
      >
        {isOpen ? (
          <TooltipWrapper
            tooltip={"Click to Collapse Menu"}
            placement={"right"}
          >
            <div className={`logo ${stateClsName}`}>
              {!operatorMode && !directPVMode ? (
                <Fragment>
                  <ApplicationLogo
                    applicationName={"console"}
                    subVariant={
                      logoPlan as
                        | "AGPL"
                        | "simple"
                        | "standard"
                        | "enterprise"
                        | undefined
                    }
                    inverse
                  />
                </Fragment>
              ) : (
                <Fragment>
                  {directPVMode ? (
                    <ApplicationLogo applicationName={"directpv"} inverse />
                  ) : (
                    <ApplicationLogo applicationName={"operator"} inverse />
                  )}
                </Fragment>
              )}
            </div>
          </TooltipWrapper>
        ) : (
          <div className={`logo ${stateClsName}`}>
            <Suspense fallback={<div>...</div>}>
              <VersionIcon />
            </Suspense>
          </div>
        )}

        {!isOpen && (
          <IconButton
            className={`${stateClsName}`}
            sx={{
              height: "30px",
              width: "30px",
              "&.mini": {
                "&:hover": {
                  background: "#081C42",
                },
              },

              "&:hover": {
                borderRadius: "50%",
                background: "#073052",
              },
              "& svg": {
                fill: "#ffffff",
                height: "18px",
                width: "18px",
              },
            }}
            onClick={() => {
              onToggle(true);
            }}
            size="small"
          >
            <MenuIcon />
          </IconButton>
        )}
      </Box>
    </Box>
  );
};

export default MenuToggle;
