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

const styles = (theme: Theme) =>
  createStyles({
    "@global": {
      body: {
        backgroundColor: "#FAFAFA",
      },
    },
    paper: {
      borderRadius: 8,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      width: 800,
      height: 424,
      margin: "auto",
      position: "absolute",
      top: "50%",
      left: "50%",
      marginLeft: -400,
      marginTop: -212,
      "&.MuiPaper-root": {
        borderRadius: 8,
      },
    },
    avatar: {
      margin: theme.spacing(1),
      backgroundColor: theme.palette.secondary.main,
    },
    form: {
      width: "100%", // Fix IE 11 issue.
    },
    submit: {
      margin: "30px 0px 16px",
      height: 40,
      boxShadow: "none",
      padding: "16px 30px",
    },
    errorBlock: {
      backgroundColor: "#C72C48",
      width: 800,
      height: 64,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      position: "absolute",
      left: "50%",
      top: "50%",
      marginLeft: -400,
      marginTop: -290,
      color: "#fff",
      fontWeight: 700,
      fontSize: 14,
      borderRadius: 8,
      padding: 10,
      boxSizing: "border-box",
    },
    mainContainer: {
      position: "relative",
      height: 424,
    },
    theOcean: {
      borderTopLeftRadius: 8,
      borderBottomLeftRadius: 8,
      background:
        "transparent linear-gradient(to bottom, #073052 0%,#05122b 100%); 0% 0% no-repeat padding-box;",
    },
    oceanBg: {
      backgroundImage: "url(/images/BG_Illustration.svg)",
      backgroundRepeat: "no-repeat",
      backgroundPosition: "bottom left",
      height: "100%",
      width: 324,
    },
    theLogin: {
      padding: "40px 45px 20px 45px",
    },
    loadingLoginStrategy: {
      textAlign: "center",
    },
    headerTitle: {
      marginBottom: 10,
    },
    submitContainer: {
      textAlign: "right",
    },
    disclaimer: {
      fontSize: 12,
      marginTop: 30,
    },
    jwtInput: {
      marginTop: 45,
    },
    linearPredef: {
      height: 10,
    },
    errorIconStyle: {
      marginRight: 3,
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
          localStorage.getItem("redirect-path") != ""
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
                  value={accessKey}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setAccessKey(e.target.value)
                  }
                  label="Enter Username"
                  name="accessKey"
                  autoComplete="username"
                  disabled={loginSending}
                />
              </Grid>
              <Grid item xs={12}>
                <LoginField
                  fullWidth
                  value={secretKey}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setSecretKey(e.target.value)
                  }
                  name="secretKey"
                  label="Enter Password"
                  type="password"
                  id="secretKey"
                  autoComplete="current-password"
                  disabled={loginSending}
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
          <Typography
            component="h1"
            variant="h6"
            className={classes.headerTitle}
          >
            Welcome
          </Typography>
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
                  fullWidth
                  id="jwt"
                  value={jwt}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setJwt(e.target.value)
                  }
                  label="JWT"
                  name="jwt"
                  autoComplete="off"
                  disabled={loginSending}
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
                  startIcon={<RefreshIcon />}
                  color={"primary"}
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

  return (
    <React.Fragment>
      <Paper className={classes.paper}>
        <MainError customStyle={{ marginTop: -140 }} />
        <Grid container className={classes.mainContainer}>
          <Grid item xs={7} className={classes.theOcean}>
            <div className={classes.oceanBg} />
          </Grid>
          <Grid item xs={5} className={classes.theLogin}>
            {loginComponent}
          </Grid>
        </Grid>
      </Paper>
    </React.Fragment>
  );
};

export default connector(withStyles(styles)(Login));
