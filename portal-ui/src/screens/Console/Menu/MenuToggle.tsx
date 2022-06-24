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
import OperatorLogo from "../../../icons/OperatorLogo";
import { LoginMinIOLogo, VersionIcon } from "../../../icons";
import { Box, IconButton } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import LicensedConsoleLogo from "../Common/Components/LicensedConsoleLogo";
import { useSelector } from "react-redux";
import useApi from "../Common/Hooks/useApi";
import { setLicenseInfo } from "../../../systemSlice";
import { AppState, useAppDispatch } from "../../../store";
import MenuToggleIcon from "../../../icons/MenuToggleIcon";

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
  const operatorMode = useSelector(
    (state: AppState) => state.system.operatorMode
  );

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

  return (
    <Box
      sx={{
        width: "100%",
        boxShadow: "0 3px 10px -6px #426198",
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
            "&.wide": {
              flex: "1",
              "& svg": {
                fill: "white",
                width: 120,
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
          <div className={`logo ${stateClsName}`}>
            {operatorMode ? (
              <OperatorLogo />
            ) : (
              <Fragment>
                <div
                  style={{ marginLeft: "4px", width: 100, textAlign: "right" }}
                >
                  <LoginMinIOLogo style={{ width: 100 }} />
                  <br />
                  <LicensedConsoleLogo
                    plan={plan}
                    isLoading={isLicenseLoading}
                  />
                </div>
              </Fragment>
            )}
          </div>
        ) : (
          <div className={`logo ${stateClsName}`}>
            <Suspense fallback={<div>...</div>}>
              <VersionIcon />
            </Suspense>
          </div>
        )}

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
            if (isOpen) {
              onToggle(false);
            } else {
              onToggle(true);
            }
          }}
          size="small"
        >
          {isOpen ? <MenuToggleIcon /> : <MenuIcon />}
        </IconButton>
      </Box>
    </Box>
  );
};

export default MenuToggle;
