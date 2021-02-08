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
import request from "superagent";
import { connect } from "react-redux";
import ErrorIcon from "@material-ui/icons/Error";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import {
  CircularProgress,
  LinearProgress,
  Paper,
  TextFieldProps,
} from "@material-ui/core";
import {
  createStyles,
  makeStyles,
  Theme,
  withStyles,
} from "@material-ui/core/styles";
import { SystemState } from "../../types";
import { userLoggedIn } from "../../actions";
import api from "../../common/api";
import { ILoginDetails, loginStrategyType } from "./types";
import history from "../../history";
import { OutlinedInputProps } from "@material-ui/core/OutlinedInput";

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
      {...props}
    />
  );
}

const mapState = (state: SystemState) => ({
  loggedIn: state.loggedIn,
});

const connector = connect(mapState, { userLoggedIn });

// The inferred type will look like:
// {isOn: boolean, toggleOn: () => void}

interface ILoginProps {
  userLoggedIn: typeof userLoggedIn;
  classes: any;
}

interface LoginStrategyRoutes {
  [key: string]: string;
}

interface LoginStrategyPayload {
  [key: string]: any;
}

const Login = ({ classes, userLoggedIn }: ILoginProps) => {
  const [accessKey, setAccessKey] = useState<string>("");
  const [jwt, setJwt] = useState<string>("");
  const [secretKey, setSecretKey] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [loginStrategy, setLoginStrategy] = useState<ILoginDetails>({
    loginStrategy: loginStrategyType.unknown,
    redirect: "",
  });
  const [loginSending, setLoginSending] = useState<boolean>(false);

  const loginStrategyEndpoints: LoginStrategyRoutes = {
    form: "/api/v1/login",
    "service-account": "/api/v1/login/operator",
  };
  const loginStrategyPayload: LoginStrategyPayload = {
    form: { accessKey, secretKey },
    "service-account": { jwt },
  };

  const fetchConfiguration = () => {
    api
      .invoke("GET", "/api/v1/login")
      .then((loginDetails: ILoginDetails) => {
        setLoginStrategy(loginDetails);
        setError("");
        if (
          loginDetails.loginStrategy === "redirect" &&
          loginDetails.redirect !== ""
        ) {
          //location.href = loginDetails.redirect;
        }
      })
      .catch((err: any) => {
        setError(err);
      });
  };

  const formSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoginSending(true);
    request
      .post(
        loginStrategyEndpoints[loginStrategy.loginStrategy] || "/api/v1/login"
      )
      .send(loginStrategyPayload[loginStrategy.loginStrategy])
      .then((res: any) => {
        const bodyResponse = res.body;
        if (bodyResponse.error) {
          setLoginSending(false);
          // throw will be moved to catch block once bad login returns 403
          throw bodyResponse.error;
        }
      })
      .then(() => {
        // We set the state in redux
        userLoggedIn(true);
        history.push("/");
      })
      .catch((err) => {
        setLoginSending(false);
        setError(err.message);
      });
  };

  useEffect(() => {
    fetchConfiguration();
  }, []);

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
                  label="Enter Access Key"
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
                  label="Enter Secret Key"
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
            <Grid item xs={12} className={classes.disclaimer}>
              <strong>Don't have an access key?</strong>
              <br />
              <br />
              Contact your administrator to have one made
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
            href={loginStrategy.redirect.replace(
              "%5BHOSTNAME%5D",
              window.location.hostname
            )}
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
            <Grid item xs={12} className={classes.disclaimer}>
              <strong>Don't have an access key?</strong>
              <br />
              Contact your administrator to have one made
            </Grid>
          </form>
        </React.Fragment>
      );
      break;
    }
    default:
      loginComponent = (
        <CircularProgress className={classes.loadingLoginStrategy} />
      );
  }

  return (
    <React.Fragment>
      {error !== "" && (
        <div className={classes.errorBlock}>
          <ErrorIcon fontSize="small" className={classes.errorIconStyle} />{" "}
          {error}
        </div>
      )}
      <Paper className={classes.paper}>
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
