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

import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import {
  Box,
  InputAdornment,
  LinearProgress,
  TextFieldProps,
} from "@mui/material";
import { Theme, useTheme } from "@mui/material/styles";
import createStyles from "@mui/styles/createStyles";
import makeStyles from "@mui/styles/makeStyles";
import withStyles from "@mui/styles/withStyles";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import { ILoginDetails, loginStrategyType } from "./types";
import { ErrorResponseHandler } from "../../common/types";
import api from "../../common/api";
import history from "../../history";
import RefreshIcon from "../../icons/RefreshIcon";
import MainError from "../Console/Common/MainError/MainError";
import {
  ConsoleLogo,
  DocumentationIcon,
  DownloadIcon,
  LockIcon,
  MinIOTierIconXs,
  OperatorLogo,
} from "../../icons";
import { spacingUtils } from "../Console/Common/FormComponents/common/styleLibrary";
import CssBaseline from "@mui/material/CssBaseline";
import LockFilledIcon from "../../icons/LockFilledIcon";
import UserFilledIcon from "../../icons/UsersFilledIcon";
import { SupportMenuIcon } from "../../icons/SidebarMenus";
import GithubIcon from "../../icons/GithubIcon";
import clsx from "clsx";
import Loader from "../Console/Common/Loader/Loader";
import { setErrorSnackMessage, userLogged } from "../../systemSlice";

const styles = (theme: Theme) =>
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
    learnMore: {
      textAlign: "center",
      fontSize: 10,
      "& a": {
        color: "#2781B0",
      },
      "& .min-icon": {
        marginLeft: 12,
        marginTop: 2,
        width: 10,
      },
    },
    separator: {
      marginLeft: 8,
      marginRight: 8,
    },
    linkHolder: {
      marginTop: 20,
      font: "normal normal normal 14px/16px Lato",
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
          font: " 100 44px 'Lato'",
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
    loadingLoginStrategy: {
      textAlign: "center",
      width: 40,
      height: 40,
    },
    submitContainer: {
      textAlign: "right",
    },
    linearPredef: {
      height: 10,
    },

    loaderAlignment: {
      display: "flex",
      width: "100%",
      height: "100%",
      justifyContent: "center",
      alignItems: "center",
      flexDirection: "column",
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
  });

const inputStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      "& .MuiOutlinedInput-root": {
        paddingLeft: 0,
        "& svg": {
          marginLeft: 4,
          height: 14,
          color: theme.palette.primary.main,
        },
        "& input": {
          padding: 10,
          fontSize: 14,
          paddingLeft: 0,
          "&::placeholder": {
            fontSize: 12,
          },
          "@media (max-width: 900px)": {
            padding: 10,
          },
        },
        "& fieldset": {},

        "& fieldset:hover": {
          borderBottom: "2px solid #000000",
          borderRadius: 0,
        },
      },
    },
  })
);

function LoginField(props: TextFieldProps) {
  const classes = inputStyles();

  return (
    <TextField
      classes={{
        root: classes.root,
      }}
      variant="standard"
      {...props}
    />
  );
}

// The inferred type will look like:
// {isOn: boolean, toggleOn: () => void}

interface ILoginProps {
  classes: any;
}

interface LoginStrategyRoutes {
  [key: string]: string;
}

interface LoginStrategyPayload {
  [key: string]: any;
}

const Login = ({ classes }: ILoginProps) => {
  const dispatch = useDispatch();

  const [accessKey, setAccessKey] = useState<string>("");
  const [jwt, setJwt] = useState<string>("");
  const [secretKey, setSecretKey] = useState<string>("");
  const [loginStrategy, setLoginStrategy] = useState<ILoginDetails>({
    loginStrategy: loginStrategyType.unknown,
    redirect: "",
  });
  const [loginSending, setLoginSending] = useState<boolean>(false);
  const [loadingFetchConfiguration, setLoadingFetchConfiguration] =
    useState<boolean>(true);

  const [latestMinIOVersion, setLatestMinIOVersion] = useState<string>("");
  const [loadingVersion, setLoadingVersion] = useState<boolean>(true);

  const loginStrategyEndpoints: LoginStrategyRoutes = {
    form: "/api/v1/login",
    "service-account": "/api/v1/login/operator",
  };
  const loginStrategyPayload: LoginStrategyPayload = {
    form: { accessKey, secretKey },
    "service-account": { jwt },
  };

  const fetchConfiguration = () => {
    setLoadingFetchConfiguration(true);
  };

  const formSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoginSending(true);
    api
      .invoke(
        "POST",
        loginStrategyEndpoints[loginStrategy.loginStrategy] || "/api/v1/login",
        loginStrategyPayload[loginStrategy.loginStrategy]
      )
      .then(() => {
        // We set the state in redux
        dispatch(userLogged(true));
        if (loginStrategy.loginStrategy === loginStrategyType.form) {
          localStorage.setItem("userLoggedIn", accessKey);
        }
        let targetPath = "/";
        if (
          localStorage.getItem("redirect-path") &&
          localStorage.getItem("redirect-path") !== ""
        ) {
          targetPath = `${localStorage.getItem("redirect-path")}`;
          localStorage.setItem("redirect-path", "");
        }
        history.push(targetPath);
      })
      .catch((err) => {
        setLoginSending(false);
        dispatch(setErrorSnackMessage(err));
      });
  };

  useEffect(() => {
    if (loadingFetchConfiguration) {
      api
        .invoke("GET", "/api/v1/login")
        .then((loginDetails: ILoginDetails) => {
          setLoginStrategy(loginDetails);
          setLoadingFetchConfiguration(false);
        })
        .catch((err: ErrorResponseHandler) => {
          dispatch(setErrorSnackMessage(err));
          setLoadingFetchConfiguration(false);
        });
    }
  }, [loadingFetchConfiguration, dispatch]);

  useEffect(() => {
    if (loadingVersion) {
      api
        .invoke("GET", "/api/v1/check-version")
        .then(
          ({
            current_version,
            latest_version,
          }: {
            current_version: string;
            latest_version: string;
          }) => {
            setLatestMinIOVersion(latest_version);
            setLoadingVersion(false);
          }
        )
        .catch((err: ErrorResponseHandler) => {
          // try the operator version
          api
            .invoke("GET", "/api/v1/check-operator-version")
            .then(
              ({
                current_version,
                latest_version,
              }: {
                current_version: string;
                latest_version: string;
              }) => {
                setLatestMinIOVersion(latest_version);
                setLoadingVersion(false);
              }
            )
            .catch((err: ErrorResponseHandler) => {
              setLoadingVersion(false);
            });
        });
    }
  }, [loadingVersion, setLoadingVersion, setLatestMinIOVersion]);

  let loginComponent = null;

  switch (loginStrategy.loginStrategy) {
    case loginStrategyType.form: {
      loginComponent = (
        <React.Fragment>
          <form className={classes.form} noValidate onSubmit={formSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12} className={classes.spacerBottom}>
                <LoginField
                  fullWidth
                  id="accessKey"
                  className={classes.inputField}
                  value={accessKey}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setAccessKey(e.target.value)
                  }
                  placeholder={"Username"}
                  name="accessKey"
                  autoComplete="username"
                  disabled={loginSending}
                  variant={"outlined"}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment
                        position="start"
                        className={classes.iconColor}
                      >
                        <UserFilledIcon />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <LoginField
                  fullWidth
                  className={classes.inputField}
                  value={secretKey}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setSecretKey(e.target.value)
                  }
                  name="secretKey"
                  type="password"
                  id="secretKey"
                  autoComplete="current-password"
                  disabled={loginSending}
                  placeholder={"Password"}
                  variant={"outlined"}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment
                        position="start"
                        className={classes.iconColor}
                      >
                        <LockFilledIcon />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
            </Grid>
            <Grid item xs={12} className={classes.submitContainer}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                id="do-login"
                className={classes.submit}
                disabled={secretKey === "" || accessKey === "" || loginSending}
              >
                Login
              </Button>
            </Grid>
            <Grid item xs={12} className={classes.linearPredef}>
              {loginSending && <LinearProgress />}
            </Grid>
          </form>
        </React.Fragment>
      );
      break;
    }
    case loginStrategyType.redirect:
    case loginStrategyType.redirectServiceAccount: {
      loginComponent = (
        <React.Fragment>
          <Button
            component={"a"}
            href={loginStrategy.redirect}
            type="submit"
            variant="contained"
            color="primary"
            id="sso-login"
            className={classes.submit}
          >
            Login with SSO
          </Button>
        </React.Fragment>
      );
      break;
    }
    case loginStrategyType.serviceAccount: {
      loginComponent = (
        <React.Fragment>
          <form className={classes.form} noValidate onSubmit={formSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <LoginField
                  required
                  className={classes.inputField}
                  fullWidth
                  id="jwt"
                  value={jwt}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setJwt(e.target.value)
                  }
                  name="jwt"
                  autoComplete="off"
                  disabled={loginSending}
                  placeholder={"Enter JWT"}
                  variant={"outlined"}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockIcon />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
            </Grid>
            <Grid item xs={12} className={classes.submitContainer}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                id="do-login"
                className={classes.submit}
                disabled={jwt === "" || loginSending}
              >
                Login
              </Button>
            </Grid>
            <Grid item xs={12} className={classes.linearPredef}>
              {loginSending && <LinearProgress />}
            </Grid>
          </form>
        </React.Fragment>
      );
      break;
    }
    default:
      loginComponent = (
        <div className={classes.loaderAlignment}>
          {loadingFetchConfiguration ? (
            <Loader className={classes.loadingLoginStrategy} />
          ) : (
            <React.Fragment>
              <div>
                <p style={{ color: "#000", textAlign: "center" }}>
                  An error has occurred
                  <br />
                  The backend cannot be reached.
                </p>
              </div>
              <div>
                <Button
                  onClick={() => {
                    fetchConfiguration();
                  }}
                  endIcon={<RefreshIcon />}
                  color={"primary"}
                  variant="outlined"
                  id="retry"
                  className={classes.retryButton}
                >
                  Retry
                </Button>
              </div>
            </React.Fragment>
          )}
        </div>
      );
  }

  const isOperator =
    loginStrategy.loginStrategy === loginStrategyType.serviceAccount ||
    loginStrategy.loginStrategy === loginStrategyType.redirectServiceAccount;

  const consoleText = isOperator ? <OperatorLogo /> : <ConsoleLogo />;

  const hyperLink = isOperator
    ? "https://docs.min.io/minio/k8s/operator-console/operator-console.html?ref=con"
    : "https://docs.min.io/minio/baremetal/console/minio-console.html?ref=con";

  const theme = useTheme();
  return (
    <div className={classes.root}>
      <CssBaseline />
      <MainError />
      <div className={classes.loginPage}>
        <Grid
          container
          style={{
            maxWidth: 400,
            margin: "auto",
          }}
        >
          <Grid
            item
            xs={12}
            style={{
              background:
                "transparent linear-gradient(180deg, #FBFAFA 0%, #E4E4E4 100%) 0% 0% no-repeat padding-box",
              padding: 40,
              color: theme.palette.primary.main,
            }}
            sx={{
              marginTop: {
                md: 16,
                sm: 8,
                xs: 3,
              },
            }}
          >
            <Box className={classes.iconLogo}>{consoleText}</Box>
            <Box
              style={{
                font: "normal normal normal 20px/24px Lato",
              }}
            >
              Multicloud Object Storage
            </Box>
          </Grid>
          <Grid
            item
            xs={12}
            style={{
              backgroundColor: "white",
              padding: 40,
              color: theme.palette.primary.main,
            }}
          >
            {loginComponent}
            <Box
              style={{
                textAlign: "center",
                marginTop: 20,
              }}
            >
              <a
                href={hyperLink}
                target="_blank"
                rel="noreferrer"
                style={{
                  color: theme.colors.link,
                  font: "normal normal normal 12px/15px Lato",
                }}
              >
                Learn more about {isOperator ? "OPERATOR CONSOLE" : "CONSOLE"}
              </a>
              <a
                href={hyperLink}
                target="_blank"
                rel="noreferrer"
                style={{
                  color: theme.colors.link,
                  font: "normal normal normal 12px/15px Lato",
                  textDecoration: "none",
                  fontWeight: "bold",
                  paddingLeft: 4,
                }}
              >
                ➔
              </a>
            </Box>
          </Grid>
          <Grid item xs={12} className={classes.linkHolder}>
            <div className={classes.miniLinks}>
              <a
                href="https://docs.min.io/?ref=con"
                target="_blank"
                rel="noreferrer"
              >
                <DocumentationIcon /> Documentation
              </a>
              <span className={classes.separator}>|</span>
              <a
                href="https://github.com/minio/minio"
                target="_blank"
                rel="noreferrer"
              >
                <GithubIcon /> Github
              </a>
              <span className={classes.separator}>|</span>
              <a
                href="https://subnet.min.io/?ref=con"
                target="_blank"
                rel="noreferrer"
              >
                <SupportMenuIcon /> Support
              </a>
              <span className={classes.separator}>|</span>
              <a
                href="https://min.io/download/?ref=con"
                target="_blank"
                rel="noreferrer"
              >
                <DownloadIcon /> Download
              </a>
            </div>
            <div className={clsx(classes.miniLinks, classes.miniLogo)}>
              <a
                href={"https://github.com/minio/minio/releases"}
                target="_blank"
                rel="noreferrer"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: 20,
                }}
              >
                <MinIOTierIconXs /> <b>Latest Version:</b>&nbsp;
                {!loadingVersion && latestMinIOVersion !== "" && (
                  <React.Fragment>{latestMinIOVersion}</React.Fragment>
                )}
              </a>
            </div>
          </Grid>
        </Grid>
      </div>
    </div>
  );
};

export default withStyles(styles)(Login);
