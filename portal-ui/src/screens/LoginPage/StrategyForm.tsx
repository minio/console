// This file is part of MinIO Console Server
// Copyright (c) 2022 MinIO, Inc.
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

import React, { Fragment, useState } from "react";
import {
  Box,
  Button,
  DropdownSelector,
  Grid,
  InputBox,
  LockFilledIcon,
  LogoutIcon,
  PasswordKeyIcon,
  ProgressBar,
  Select,
  UserFilledIcon,
} from "mds";
import {
  setAccessKey,
  setDisplayEmbeddedIDPForms,
  setSecretKey,
  setSTS,
  setUseSTS,
} from "./loginSlice";

import { AppState, useAppDispatch } from "../../store";
import { useSelector } from "react-redux";
import { doLoginAsync } from "./loginThunks";
import { RedirectRule } from "api/consoleApi";

const StrategyForm = ({ redirectRules }: { redirectRules: RedirectRule[] }) => {
  const dispatch = useAppDispatch();

  const [ssoOptionsOpen, ssoOptionsSetOpen] = useState<boolean>(false);
  const [anchorEl, setAnchorEl] = React.useState<
    (EventTarget & HTMLButtonElement) | null
  >(null);

  const accessKey = useSelector((state: AppState) => state.login.accessKey);
  const secretKey = useSelector((state: AppState) => state.login.secretKey);
  const sts = useSelector((state: AppState) => state.login.sts);
  const useSTS = useSelector((state: AppState) => state.login.useSTS);
  const displaySSOForm = useSelector(
    (state: AppState) => state.login.ssoEmbeddedIDPDisplay,
  );

  const loginSending = useSelector(
    (state: AppState) => state.login.loginSending,
  );

  const formSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    dispatch(doLoginAsync());
  };

  let selectOptions = [
    {
      label: useSTS ? "Use Credentials" : "Use STS",
      value: useSTS ? "use-sts-cred" : "use-sts",
    },
  ];
  let ssoOptions: any[] = [];

  if (redirectRules.length > 0) {
    ssoOptions = redirectRules.map((r) => ({
      label: `${r.displayName}${r.serviceType ? ` - ${r.serviceType}` : ""}`,
      value: r.redirect,
      icon: <LogoutIcon />,
    }));

    selectOptions = [
      { label: "Use Credentials", value: "use-sts-cred" },
      { label: "Use STS", value: "use-sts" },
    ];
  }

  const extraActionSelector = (value: string) => {
    if (value) {
      if (redirectRules.length > 0) {
        let stsState = true;

        if (value === "use-sts-cred") {
          stsState = false;
        }

        dispatch(setUseSTS(stsState));
        dispatch(setDisplayEmbeddedIDPForms(true));

        return;
      }

      if (value.includes("use-sts")) {
        dispatch(setUseSTS(!useSTS));
        return;
      }
    }
  };

  const submitSSOInitRequest = (value: string) => {
    window.location.href = value;
  };

  return (
    <React.Fragment>
      {redirectRules.length > 0 && (
        <Fragment>
          <Box sx={{ marginBottom: 40 }}>
            <Button
              id={"SSOSelector"}
              variant={"subAction"}
              label={
                redirectRules.length === 1
                  ? `${redirectRules[0].displayName}${
                      redirectRules[0].serviceType
                        ? ` - ${redirectRules[0].serviceType}`
                        : ""
                    }`
                  : `Login with SSO`
              }
              fullWidth
              sx={{ height: 50 }}
              onClick={(e) => {
                if (redirectRules.length > 1) {
                  ssoOptionsSetOpen(!ssoOptionsOpen);
                  setAnchorEl(e.currentTarget);
                  return;
                }
                submitSSOInitRequest(`${redirectRules[0].redirect}`);
              }}
            />
            {redirectRules.length > 1 && (
              <DropdownSelector
                id={"redirect-rules"}
                options={ssoOptions}
                selectedOption={""}
                onSelect={(nValue) => submitSSOInitRequest(nValue)}
                hideTriggerAction={() => {
                  ssoOptionsSetOpen(false);
                }}
                open={ssoOptionsOpen}
                anchorEl={anchorEl}
                useAnchorWidth={true}
              />
            )}
          </Box>
        </Fragment>
      )}

      <form noValidate onSubmit={formSubmit} style={{ width: "100%" }}>
        {((displaySSOForm && redirectRules.length > 0) ||
          redirectRules.length === 0) && (
          <Fragment>
            <Grid
              container
              sx={{
                marginTop: redirectRules.length > 0 ? 55 : 0,
              }}
            >
              <Grid item xs={12} sx={{ marginBottom: 14 }}>
                <InputBox
                  fullWidth
                  id="accessKey"
                  value={accessKey}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    dispatch(setAccessKey(e.target.value))
                  }
                  placeholder={useSTS ? "STS Username" : "Username"}
                  name="accessKey"
                  autoComplete="username"
                  disabled={loginSending}
                  startIcon={<UserFilledIcon />}
                />
              </Grid>
              <Grid item xs={12} sx={{ marginBottom: useSTS ? 14 : 0 }}>
                <InputBox
                  fullWidth
                  value={secretKey}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    dispatch(setSecretKey(e.target.value))
                  }
                  name="secretKey"
                  type="password"
                  id="secretKey"
                  autoComplete="current-password"
                  disabled={loginSending}
                  placeholder={useSTS ? "STS Secret" : "Password"}
                  startIcon={<LockFilledIcon />}
                />
              </Grid>
              {useSTS && (
                <Grid item xs={12}>
                  <InputBox
                    fullWidth
                    id="sts"
                    value={sts}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      dispatch(setSTS(e.target.value))
                    }
                    placeholder={"STS Token"}
                    name="STS"
                    autoComplete="sts"
                    disabled={loginSending}
                    startIcon={<PasswordKeyIcon />}
                  />
                </Grid>
              )}
            </Grid>

            <Grid
              item
              xs={12}
              sx={{
                textAlign: "right",
                marginTop: 30,
              }}
            >
              <Button
                type="submit"
                variant="callAction"
                color="primary"
                id="do-login"
                disabled={
                  (!useSTS && (accessKey === "" || secretKey === "")) ||
                  (useSTS &&
                    (accessKey === "" || secretKey === "" || sts === "")) ||
                  loginSending
                }
                label={"Login"}
                sx={{
                  margin: "30px 0px 8px",
                  height: 40,
                  width: "100%",
                  boxShadow: "none",
                  padding: "16px 30px",
                }}
                fullWidth
              />
            </Grid>
            <Grid
              item
              xs={12}
              sx={{
                height: 10,
              }}
            >
              {loginSending && <ProgressBar />}
            </Grid>
          </Fragment>
        )}
        <Grid item xs={12} sx={{ marginTop: 45 }}>
          <Select
            id="alternativeMethods"
            name="alternativeMethods"
            fixedLabel="Other Authentication Methods"
            options={selectOptions}
            onChange={extraActionSelector}
            value={""}
          />
        </Grid>
      </form>
    </React.Fragment>
  );
};

export default StrategyForm;
