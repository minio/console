// This file is part of MinIO Console Server
// Copyright (c) 2023 MinIO, Inc.
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

import React, { Fragment, useEffect, useState } from "react";
import {
  Box,
  Button,
  CallHomeMenuIcon,
  FormLayout,
  HelpBox,
  Loader,
  PageLayout,
  Switch,
} from "mds";
import { Link, useNavigate } from "react-router-dom";
import api from "../../../common/api";
import { ErrorResponseHandler } from "../../../common/types";
import { setErrorSnackMessage, setHelpName } from "../../../systemSlice";
import { useAppDispatch } from "../../../store";
import { ICallHomeResponse } from "./types";
import { registeredCluster } from "../../../config";
import CallHomeConfirmation from "./CallHomeConfirmation";
import RegisterCluster from "./RegisterCluster";
import PageHeaderWrapper from "../Common/PageHeaderWrapper/PageHeaderWrapper";
import HelpMenu from "../HelpMenu";

const CallHome = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [loading, setLoading] = useState<boolean>(true);
  const [showConfirmation, setShowConfirmation] = useState<boolean>(false);
  const [diagEnabled, setDiagEnabled] = useState<boolean>(false);
  const [oDiagEnabled, setODiagEnabled] = useState<boolean>(false);
  const [disableMode, setDisableMode] = useState<boolean>(false);

  const clusterRegistered = registeredCluster();

  useEffect(() => {
    if (loading) {
      api
        .invoke("GET", `/api/v1/support/callhome`)
        .then((res: ICallHomeResponse) => {
          setLoading(false);

          setDiagEnabled(!!res.diagnosticsStatus);

          setODiagEnabled(!!res.diagnosticsStatus);
        })
        .catch((err: ErrorResponseHandler) => {
          setLoading(false);
          dispatch(setErrorSnackMessage(err));
        });
    }
  }, [loading, dispatch]);

  const callHomeClose = (refresh: boolean) => {
    if (refresh) {
      setLoading(true);
    }
    setShowConfirmation(false);
  };

  const confirmCallHomeAction = () => {
    if (!clusterRegistered) {
      navigate("/support/register");
      return;
    }
    setDisableMode(false);
    setShowConfirmation(true);
  };

  const disableCallHomeAction = () => {
    setDisableMode(true);
    setShowConfirmation(true);
  };

  let mainVariant: "regular" | "callAction" = "regular";

  if (clusterRegistered && diagEnabled !== oDiagEnabled) {
    mainVariant = "callAction";
  }

  useEffect(() => {
    dispatch(setHelpName("call_home"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Fragment>
      {showConfirmation && (
        <CallHomeConfirmation
          onClose={callHomeClose}
          open={showConfirmation}
          diagStatus={diagEnabled}
          disable={disableMode}
        />
      )}
      <PageHeaderWrapper label="Call Home" actions={<HelpMenu />} />
      <PageLayout>
        {!clusterRegistered && <RegisterCluster compactMode />}
        <FormLayout
          helpBox={
            <HelpBox
              title={"Learn more about Call Home"}
              iconComponent={<CallHomeMenuIcon />}
              help={
                <Fragment>
                  <Box
                    sx={{
                      display: "flex",
                      flexFlow: "column",
                      fontSize: "14px",
                      flex: "2",
                      marginTop: "10px",
                    }}
                  >
                    <Box>
                      Enabling Call Home sends cluster health & status to your
                      registered MinIO Subscription Network account every 24
                      hours.
                      <br />
                      <br />
                      This helps the MinIO support team to provide quick
                      incident responses along with suggestions for possible
                      improvements that can be made to your MinIO instances.
                      <br />
                      <br />
                      Your cluster must be{" "}
                      <Link to={"/support/register"}>registered</Link> in the
                      MinIO Subscription Network (SUBNET) before enabling this
                      feature.
                    </Box>
                  </Box>
                </Fragment>
              }
            />
          }
        >
          {loading ? (
            <span style={{ marginLeft: 5 }}>
              <Loader style={{ width: 16, height: 16 }} />
            </span>
          ) : (
            <Fragment>
              <Switch
                value="enableDiag"
                id="enableDiag"
                name="enableDiag"
                checked={diagEnabled}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  setDiagEnabled(event.target.checked);
                }}
                label={"Daily Health Report"}
                disabled={!clusterRegistered}
                description={
                  "Daily Health Report enables you to proactively identify potential issues in your deployment before they escalate."
                }
              />
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "flex-end",
                  marginTop: "55px",
                  gap: "0px 10px",
                }}
              >
                {oDiagEnabled && (
                  <Button
                    id={"callhome-action"}
                    variant={"secondary"}
                    data-test-id="call-home-toggle-button"
                    onClick={disableCallHomeAction}
                    disabled={loading || !clusterRegistered}
                  >
                    Disable Call Home
                  </Button>
                )}
                <Button
                  id={"callhome-action"}
                  type="button"
                  variant={mainVariant}
                  data-test-id="call-home-toggle-button"
                  onClick={confirmCallHomeAction}
                  disabled={loading || !clusterRegistered}
                >
                  Save Configuration
                </Button>
              </Box>
            </Fragment>
          )}
        </FormLayout>
      </PageLayout>
    </Fragment>
  );
};

export default CallHome;
