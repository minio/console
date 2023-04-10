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

import React, { Fragment, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Loader, LoginWrapper, RefreshIcon } from "mds";
import { Theme } from "@mui/material/styles";
import createStyles from "@mui/styles/createStyles";
import makeStyles from "@mui/styles/makeStyles";
import { loginStrategyType, redirectRule } from "./types";
import MainError from "../Console/Common/MainError/MainError";
import { spacingUtils } from "../Console/Common/FormComponents/common/styleLibrary";
import { AppState, useAppDispatch } from "../../store";
import { useSelector } from "react-redux";
import { getFetchConfigurationAsync, getVersionAsync } from "./loginThunks";
import { resetForm } from "./loginSlice";
import StrategyForm from "./StrategyForm";
import { redirectRules } from "../../utils/sortFunctions";
import { getLogoVar } from "../../config";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      overflow: "auto",
    },
    form: {
      width: "100%", // Fix IE 11 issue.
    },
    submit: {
      margin: "30px 0px 8px",
      height: 40,
      width: "100%",
      boxShadow: "none",
      padding: "16px 30px",
    },
    loginSsoText: {
      fontWeight: "700",
      marginBottom: "15px",
    },
    ssoSelect: {
      width: "100%",
      fontSize: "13px",
      fontWeight: "700",
      color: "grey",
    },
    ssoMenuItem: {
      fontSize: "15px",
      fontWeight: "700",
      color: theme.palette.primary.light,
      "&.MuiMenuItem-divider:last-of-type": {
        borderBottom: "none",
      },
      "&.Mui-focusVisible": {
        backgroundColor: theme.palette.grey["100"],
      },
    },
    ssoLoginIcon: {
      height: "13px",
      marginRight: "25px",
    },
    ssoSubmit: {
      marginTop: "15px",
      "&:first-of-type": {
        marginTop: 0,
      },
    },
    separator: {
      marginLeft: 4,
      marginRight: 4,
    },
    linkHolder: {
      marginTop: 20,
      font: "normal normal normal 14px/16px Inter",
    },
    miniLinks: {
      margin: "auto",
      textAlign: "center",
      color: "#B2DEF5",
      "& a": {
        color: "#B2DEF5",
        textDecoration: "none",
      },
      "& .min-icon": {
        width: 10,
        color: "#B2DEF5",
      },
    },
    miniLogo: {
      marginTop: 8,
      "& .min-icon": {
        height: 12,
        paddingTop: 2,
        marginRight: 2,
      },
    },
    loginPage: {
      height: "100%",
      margin: "auto",
    },
    buttonRetry: {
      display: "flex",
      justifyContent: "center",
    },
    loginContainer: {
      flexDirection: "column",
      maxWidth: 400,
      margin: "auto",
      "& .right-items": {
        backgroundColor: "white",
        padding: 40,
      },
      "& .consoleTextBanner": {
        fontWeight: 300,
        fontSize: "calc(3vw + 3vh + 1.5vmin)",
        lineHeight: 1.15,
        color: theme.palette.primary.main,
        flex: 1,
        height: "100%",
        display: "flex",
        justifyContent: "flex-start",
        margin: "auto",

        "& .logoLine": {
          display: "flex",
          alignItems: "center",
          fontSize: 18,
        },
        "& .left-items": {
          marginTop: 100,
          background:
            "transparent linear-gradient(180deg, #FBFAFA 0%, #E4E4E4 100%) 0% 0% no-repeat padding-box",
          padding: 40,
        },
        "& .left-logo": {
          "& .min-icon": {
            color: theme.palette.primary.main,
            width: 108,
          },
          marginBottom: 10,
        },
        "& .text-line1": {
          font: " 100 44px 'Inter'",
        },
        "& .text-line2": {
          fontSize: 80,
          fontWeight: 100,
          textTransform: "uppercase",
        },
        "& .text-line3": {
          fontSize: 14,
          fontWeight: "bold",
        },
        "& .logo-console": {
          display: "flex",
          alignItems: "center",

          "@media (max-width: 900px)": {
            marginTop: 20,
            flexFlow: "column",

            "& svg": {
              width: "50%",
            },
          },
        },
      },
    },
    "@media (max-width: 900px)": {
      loginContainer: {
        display: "flex",
        flexFlow: "column",

        "& .consoleTextBanner": {
          margin: 0,
          flex: 2,

          "& .left-items": {
            alignItems: "center",
            textAlign: "center",
          },

          "& .logoLine": {
            justifyContent: "center",
          },
        },
      },
    },
    loginStrategyMessage: {
      textAlign: "center",
    },
    loadingLoginStrategy: {
      textAlign: "center",
      width: 40,
      height: 40,
    },
    submitContainer: {
      textAlign: "right",
      marginTop: 30,
    },
    linearPredef: {
      height: 10,
    },
    retryButton: {
      alignSelf: "flex-end",
    },
    iconLogo: {
      "& .min-icon": {
        width: "100%",
      },
    },
    ...spacingUtils,
  })
);

export interface LoginStrategyPayload {
  accessKey: string;
  secretKey: string;
  sts?: string;
}

export const getTargetPath = () => {
  let targetPath = "/";
  if (
    localStorage.getItem("redirect-path") &&
    localStorage.getItem("redirect-path") !== ""
  ) {
    targetPath = `${localStorage.getItem("redirect-path")}`;
    localStorage.setItem("redirect-path", "");
  }
  return targetPath;
};

const Login = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const classes = useStyles();

  const loginStrategy = useSelector(
    (state: AppState) => state.login.loginStrategy
  );
  const loadingFetchConfiguration = useSelector(
    (state: AppState) => state.login.loadingFetchConfiguration
  );
  const loadingVersion = useSelector(
    (state: AppState) => state.login.loadingVersion
  );
  const navigateTo = useSelector((state: AppState) => state.login.navigateTo);

  const isK8S = useSelector((state: AppState) => state.login.isK8S);

  useEffect(() => {
    if (navigateTo !== "") {
      dispatch(resetForm());
      navigate(navigateTo);
    }
  }, [navigateTo, dispatch, navigate]);

  useEffect(() => {
    if (loadingFetchConfiguration) {
      dispatch(getFetchConfigurationAsync());
    }
  }, [loadingFetchConfiguration, dispatch]);

  useEffect(() => {
    if (loadingVersion) {
      dispatch(getVersionAsync());
    }
  }, [dispatch, loadingVersion]);

  let loginComponent;

  switch (loginStrategy.loginStrategy) {
    case loginStrategyType.redirect:
    case loginStrategyType.form: {
      let redirectItems: redirectRule[] = [];

      if (
        loginStrategy.redirectRules &&
        loginStrategy.redirectRules.length > 0
      ) {
        redirectItems = [...loginStrategy.redirectRules].sort(redirectRules);
      }

      loginComponent = <StrategyForm redirectRules={redirectItems} />;
      break;
    }
    default:
      loginComponent = (
        <div style={{ textAlign: "center" }}>
          {loadingFetchConfiguration ? (
            <Loader className={classes.loadingLoginStrategy} />
          ) : (
            <Fragment>
              <div>
                <p style={{ color: "#000", textAlign: "center" }}>
                  An error has occurred
                  <br />
                  The backend cannot be reached.
                </p>
              </div>
              <div className={classes.buttonRetry}>
                <Button
                  onClick={() => {
                    dispatch(getFetchConfigurationAsync());
                  }}
                  icon={<RefreshIcon />}
                  iconLocation={"end"}
                  variant="regular"
                  id="retry"
                  label={"Retry"}
                />
              </div>
            </Fragment>
          )}
        </div>
      );
  }

  let docsURL = "https://min.io/docs/minio/linux/index.html?ref=con";
  if (isK8S) {
    docsURL =
      "https://min.io/docs/minio/kubernetes/upstream/index.html?ref=con";
  }

  return (
    <Fragment>
      <MainError />
      <LoginWrapper
        logoProps={{ applicationName: "console", subVariant: getLogoVar() }}
        form={loginComponent}
        formFooter={
          <Fragment>
            <a href={docsURL} target="_blank" rel="noopener">
              Documentation
            </a>
            <span className={classes.separator}>|</span>
            <a
              href="https://github.com/minio/minio"
              target="_blank"
              rel="noopener"
            >
              GitHub
            </a>
            <span className={classes.separator}>|</span>
            <a
              href="https://subnet.min.io/?ref=con"
              target="_blank"
              rel="noopener"
            >
              Support
            </a>
            <span className={classes.separator}>|</span>
            <a
              href="https://min.io/download/?ref=con"
              target="_blank"
              rel="noopener"
            >
              Download
            </a>
          </Fragment>
        }
        promoHeader={
          <span style={{ fontSize: 28 }}>High-Performance Object Store</span>
        }
        promoInfo={
          <span style={{ fontSize: 14, lineHeight: 1 }}>
            MinIO is a cloud-native object store built to run on any
            infrastructure - public, private or edge clouds. Primary use cases
            include data lakes, databases, AI/ML, SaaS applications and fast
            backup & recovery. MinIO is dual licensed under GNU AGPL v3 and
            commercial license. To learn more, visit{" "}
            <a href={"https://min.io/?ref=con"} target="_blank" rel="noopener">
              www.min.io
            </a>
            .
          </span>
        }
      />
    </Fragment>
  );
};

export default Login;
