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
import { connect } from "react-redux";
import { OutlinedInputProps } from "@mui/material/OutlinedInput";
import {
  CircularProgress,
  InputAdornment,
  LinearProgress,
  Paper,
  TextFieldProps,
} from "@mui/material";
import { Theme } from "@mui/material/styles";
import createStyles from "@mui/styles/createStyles";
import makeStyles from "@mui/styles/makeStyles";
import withStyles from "@mui/styles/withStyles";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { ILoginDetails, loginStrategyType } from "./types";
import { SystemState } from "../../types";
import { setErrorSnackMessage, userLoggedIn } from "../../actions";
import { ErrorResponseHandler } from "../../common/types";
import api from "../../common/api";
import history from "../../history";
import RefreshIcon from "../../icons/RefreshIcon";
import MainError from "../Console/Common/MainError/MainError";
import { encodeFileName } from "../../common/utils";
import { LockIcon, UsersIcon, VersionIcon } from "../../icons";

const styles = (theme: Theme) =>
  createStyles({
    form: {
      width: "100%", // Fix IE 11 issue.
    },
    submit: {
      margin: "30px 0px 16px",
      height: 40,
      boxShadow: "none",
      padding: "16px 30px",
    },
    loginPage: {
      height: "100%",
      display: "flex",
      flexFlow: "column",
      alignItems: "stretch",
      position: "relative",
      padding: 84,

      "@media (max-width: 900px)": {
        padding: 0,
      },
    },
    shadowBox: {
      boxShadow: "0px 3px 10px #00000014",
      height: "100%",
    },
    loginContainer: {
      flex: 1,
      height: "100%",

      "& .right-items": {
        padding: 50,
        flex: 1,
        height: "100%",
        display: "flex",
        flexFlow: "column",
        alignItems: "center",
        justifyContent: "center",
        maxWidth: "33%",

        "@media (max-width: 900px)": {
          maxWidth: "100%",
          margin: "auto",
        },
      },
      "& .consoleTextBanner": {
        fontWeight: 300,
        fontSize: "calc(3vw + 3vh + 1.5vmin)",
        lineHeight: 1.15,
        color: "#ffffff",
        flex: 1,
        textAlign: "center",
        height: "100%",
        display: "flex",
        justifyContent: "flex-start",
        margin: "auto",
        flexFlow: "column",
        background: "linear-gradient(120deg,#081c42,#073052)",

        "& .logoLine": {
          display: "flex",
          alignItems: "center",
          fontSize: 18,
          marginTop: 40,
        },
        "& .left-items": {
          margin: "auto",
          textAlign: "left",
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
    inputField: {
      "& input": {
        padding: 5,
        "&::placeholder": {
          fontSize: 12,
        },
        "@media (max-width: 900px)": {
          padding: 10,
        },
      },
      "& svg": { height: 16 },
    },

    loadingLoginStrategy: {
      textAlign: "center",
    },
    headerTitle: {
      marginRight: "auto",
      marginBottom: 15,
    },
    submitContainer: {
      textAlign: "right",
    },
    jwtInput: {
      marginTop: 45,
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
  });

const inputStyles = makeStyles((theme: Theme) =>
  createStyles({
    disabled: {
      "&.MuiInput-underline::before": {
        borderColor: "#eaeaea",
        borderBottomStyle: "solid",
      },
    },
  })
);

function LoginField(props: TextFieldProps) {
  const classes = inputStyles();

  return (
    <TextField
      InputProps={{ classes } as Partial<OutlinedInputProps>}
      variant="standard"
      {...props}
    />
  );
}

const mapState = (state: SystemState) => ({
  loggedIn: state.loggedIn,
});

const connector = connect(mapState, { userLoggedIn, setErrorSnackMessage });

// The inferred type will look like:
// {isOn: boolean, toggleOn: () => void}

interface ILoginProps {
  userLoggedIn: typeof userLoggedIn;
  setErrorSnackMessage: typeof setErrorSnackMessage;
  classes: any;
}

interface LoginStrategyRoutes {
  [key: string]: string;
}

interface LoginStrategyPayload {
  [key: string]: any;
}

const Login = ({
  classes,
  userLoggedIn,
  setErrorSnackMessage,
}: ILoginProps) => {
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
        userLoggedIn(true);
        if (loginStrategy.loginStrategy === loginStrategyType.form) {
          localStorage.setItem("userLoggedIn", encodeFileName(accessKey));
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
        setErrorSnackMessage(err);
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
          setErrorSnackMessage(err);
          setLoadingFetchConfiguration(false);
        });
    }
  }, [loadingFetchConfiguration, setErrorSnackMessage]);

  let loginComponent = null;

  switch (loginStrategy.loginStrategy) {
    case loginStrategyType.form: {
      loginComponent = (
        <React.Fragment>
          <Typography
            component="h1"
            variant="h6"
            className={classes.headerTitle}
          >
            Console Login
          </Typography>
          <form className={classes.form} noValidate onSubmit={formSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <LoginField
                  fullWidth
                  id="accessKey"
                  className={classes.inputField}
                  value={accessKey}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setAccessKey(e.target.value)
                  }
                  placeholder={"Enter Username"}
                  name="accessKey"
                  autoComplete="username"
                  disabled={loginSending}
                  variant={"outlined"}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <UsersIcon />
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
                  placeholder={"Enter Password"}
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
    case loginStrategyType.redirect: {
      loginComponent = (
        <React.Fragment>
          <Button
            component={"a"}
            href={loginStrategy.redirect}
            type="submit"
            variant="contained"
            color="primary"
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
          <Typography
            component="h1"
            variant="h6"
            className={classes.headerTitle}
          >
            Operator Login
          </Typography>
          <form className={classes.form} noValidate onSubmit={formSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12} className={classes.jwtInput}>
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
            <CircularProgress className={classes.loadingLoginStrategy} />
          ) : (
            <React.Fragment>
              <div>
                <p>An error has occurred, the backend cannot be reached.</p>
              </div>
              <div>
                <Button
                  onClick={() => {
                    fetchConfiguration();
                  }}
                  endIcon={<RefreshIcon />}
                  color={"primary"}
                  variant="outlined"
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

  const consoleText =
    loginStrategy.loginStrategy === loginStrategyType.serviceAccount
      ? "Operator"
      : "Console";

  return (
    <React.Fragment>
      <Paper className={classes.loginPage}>
        <MainError />
        <div className={classes.shadowBox}>
          <Grid container className={classes.loginContainer}>
            <Grid item className="consoleTextBanner">
              <div className="left-items">
                <div className="text-line1">Welcome to</div>
                <div className="text-line2">{consoleText}</div>
                <div className="logoLine">
                  <VersionIcon /> MinIO {consoleText}
                </div>
              </div>
            </Grid>
            <Grid item className="right-items">
              {loginComponent}
            </Grid>
          </Grid>
        </div>
      </Paper>
    </React.Fragment>
  );
};

export default connector(withStyles(styles)(Login));
