// This file is part of MinIO Kubernetes Cloud
// Copyright (c) 2020 MinIO, Inc.
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

import React from "react";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import request from "superagent";
import { useHistory } from "react-router";
import { CircularProgress } from "@material-ui/core";
import storage from "local-storage-fallback";
import Copyright from "../common/Copyright";

const useStyles = makeStyles(theme => ({
  "@global": {
    body: {
      backgroundColor: theme.palette.common.white
    }
  },
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(3)
  },
  submit: {
    margin: theme.spacing(3, 0, 2)
  },
  errorBlock: {
    color: "red"
  },
  spinner: {
    margin: "auto"
  }
}));
const CreatePassword: React.FC = () => {
  const classes = useStyles();
  const { push } = useHistory();
  const [password, setPassword] = React.useState<string>("");
  const [token, setToken] = React.useState<string>("");
  const [tokenValidated, setTokenValidated] = React.useState<boolean>(false);
  const [tokenValid, setTokenValid] = React.useState<boolean>(true);
  const [repeatPassword, setRepeatPassword] = React.useState<string>("");
  const [error, setError] = React.useState<string>("");

  const formSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (password !== repeatPassword) {
      setError("Passwords don't match");
      return;
    }
    if (password.length < 8) {
      setError("Password should longer than 8 characters");
      return;
    }
    const url = "/api/v1/users/set_password";
    request
      .post(url)
      .send({
        url_token: token,
        password: password
      })
      .then((res: any) => {
        if (res.body.jwt_token) {
          // store the jwt token
          storage.setItem("token", res.body.jwt_token);
          return res.body.jwt_token;
        } else if (res.body.error) {
          // throw will be moved to catch block once bad CreatePassword returns 403
          throw res.body.error;
        }
      })
      .then(() => {
        push("/");
      })
      .catch(err => {
        setError(err);
      });
  };

  // validate the token passed via url

  React.useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const urlToken = urlParams.get("t") as string;
    if (urlToken === null || urlToken === "") {
      return;
    }

    setToken(urlToken);
    const url = "/api/v1/validate_invite";
    request
      .post(url)
      .send({ url_token: urlToken })
      .then((res: any) => {
        console.log(res);
        // store the email to display
        setTokenValidated(true);
      })
      .catch(err => {
        setError(err);
        setTokenValidated(true);
        setTokenValid(false);
      });
  }, []); // empty array ensures the effect is ran only once on component mount

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Create Password
        </Typography>
        {!tokenValidated && (
          <Grid container spacing={2}>
            <Grid item xs={12} alignItems="center" justify="center">
              <Grid
                container
                spacing={0}
                direction="column"
                alignItems="center"
                justify="center"
              >
                <Grid item xs={12} alignItems="center" justify="center">
                  <CircularProgress />
                </Grid>
                <Grid item xs={12} alignItems="center" justify="center">
                  <Typography variant="body1" gutterBottom>
                    Validating token.
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        )}
        {tokenValidated && !tokenValid && (
          <Grid container spacing={2}>
            <Grid item xs={12} alignItems="center" justify="center">
              <Grid
                container
                spacing={0}
                direction="column"
                alignItems="center"
                justify="center"
              >
                <Grid item xs={12} alignItems="center" justify="center">
                  <Typography variant="body1" gutterBottom>
                    This token is invalid.
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        )}
        {tokenValidated && tokenValid && (
          <form className={classes.form} noValidate onSubmit={formSubmit}>
            <Grid container spacing={2}>
              {error !== "" && (
                <Grid item xs={12}>
                  <Typography
                    component="p"
                    variant="body1"
                    className={classes.errorBlock}
                  >
                    {`${error}`}
                  </Typography>
                </Grid>
              )}

              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  required
                  fullWidth
                  value={password}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setPassword(e.target.value)
                  }
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  required
                  fullWidth
                  value={repeatPassword}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setRepeatPassword(e.target.value)
                  }
                  name="repeat_password"
                  label="Repeat Password"
                  type="password"
                  id="repeat_password"
                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
            >
              Create Password
            </Button>
          </form>
        )}
      </div>
      <Box mt={5}>
        <Copyright />
      </Box>
    </Container>
  );
};

export default CreatePassword;
