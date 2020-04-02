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
import request from "superagent";
import storage from "local-storage-fallback";
import { connect, ConnectedProps } from "react-redux";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import { Paper } from "@material-ui/core";
import { createStyles, Theme, withStyles } from "@material-ui/core/styles";
import { SystemState } from "../types";
import { userLoggedIn } from "../actions";
import history from "../history";

const styles = (theme: Theme) =>
  createStyles({
    "@global": {
      body: {
        backgroundColor: "#F4F4F4"
      }
    },
    paper: {
      marginTop: theme.spacing(16),
      borderRadius: "3px",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      width: "800px",
      margin: "auto"
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
    mainContainer: {
      borderRadius: "3px"
    },
    theOcean: {
      borderTopLeftRadius: "3px",
      borderBottomLeftRadius: "3px",
      background:
        "transparent linear-gradient(333deg, #281B6F 1%, #271260 13%, #120D53 83%) 0% 0% no-repeat padding-box;",
    },
      oceanBg:{
          backgroundImage:'url(/images/BG_Illustration.svg)',
          backgroundRepeat:'no-repeat',
          backgroundPosition:'bottom left',
          height:'100%',
          width:'100%',
      },
    theLogin: {
      padding: "76px 62px 20px 62px"
    }
  });

const mapState = (state: SystemState) => ({
  loggedIn: state.loggedIn
});

const connector = connect(mapState, { userLoggedIn });

// The inferred type will look like:
// {isOn: boolean, toggleOn: () => void}
type PropsFromRedux = ConnectedProps<typeof connector>;
type Props = PropsFromRedux & {};

interface LoginProps {
  userLoggedIn: typeof userLoggedIn;
  classes: any;
}

class Login extends React.Component<LoginProps> {
  state = {
    accessKey: "",
    secretKey: "",
    error: ""
  };

  formSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const url = "/api/v1/login";
    const { accessKey, secretKey } = this.state;

    request
      .post(url)
      .send({ accessKey, secretKey })
      .then((res: any) => {
        const bodyResponse = res.body;

        if (bodyResponse.sessionId) {
          // store the jwt token
          storage.setItem("token", bodyResponse.sessionId);
          //return res.body.sessionId;
        } else if (bodyResponse.error) {
          // throw will be moved to catch block once bad login returns 403
          throw bodyResponse.error;
        }
      })
      .then(() => {
        // We set the state in redux
        this.props.userLoggedIn(true);
        // We push to history the new URL.
        history.push("/dashboard");
      })
      .catch(err => {
        this.setState({ error: `${err}` });
      });
  };

  render() {
    const { error, accessKey, secretKey } = this.state;
    const { classes } = this.props;
    return (
      <Paper className={classes.paper}>
        <Grid container className={classes.mainContainer}>
          <Grid item xs={7} className={classes.theOcean}>
              <div className={classes.oceanBg}></div>
          </Grid>
          <Grid item xs={5} className={classes.theLogin}>
            <Typography component="h1" variant="h6">
              Login
            </Typography>
            <form
              className={classes.form}
              noValidate
              onSubmit={this.formSubmit}
            >
              <Grid container spacing={2}>
                {error !== "" && (
                  <Grid item xs={12}>
                    <Typography
                      component="p"
                      variant="body1"
                      className={classes.errorBlock}
                    >
                      {error}
                    </Typography>
                  </Grid>
                )}
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    id="accessKey"
                    value={accessKey}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      this.setState({ accessKey: e.target.value })
                    }
                    label="Access Key"
                    name="accessKey"
                    autoComplete="username"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    value={secretKey}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      this.setState({ secretKey: e.target.value })
                    }
                    name="secretKey"
                    label="Secret Key"
                    type="password"
                    id="secretKey"
                    autoComplete="current-password"
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
                Login
              </Button>
            </form>
          </Grid>
        </Grid>
      </Paper>
    );
  }
}

export default connector(withStyles(styles)(Login));
