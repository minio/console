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

import React, { Fragment, useCallback, useEffect, useState } from "react";
import get from "lodash/get";
import { BackLink, Button, FormLayout, Grid, InputBox, PageLayout } from "mds";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "api";
import { errorToHandler } from "api/errors";
import {
  destinationList,
  notificationEndpointsFields,
  notifyMysql,
  notifyPostgres,
  removeEmptyFields,
} from "./utils";
import { IElementValue } from "../Configurations/types";
import { IAM_PAGES } from "../../../common/SecureComponent/permissions";
import {
  setErrorSnackMessage,
  setHelpName,
  setServerNeedsRestart,
} from "../../../systemSlice";
import { useAppDispatch } from "../../../store";
import { setDestinationLoading } from "./destinationsSlice";
import withSuspense from "../Common/Components/withSuspense";
import PageHeaderWrapper from "../Common/PageHeaderWrapper/PageHeaderWrapper";
import TargetTitle from "./TargetTitle";
import HelpMenu from "../HelpMenu";

const ConfMySql = withSuspense(
  React.lazy(() => import("./CustomForms/ConfMySql")),
);

const ConfTargetGeneric = withSuspense(
  React.lazy(() => import("./ConfTargetGeneric")),
);

const ConfPostgres = withSuspense(
  React.lazy(() => import("./CustomForms/ConfPostgres")),
);

interface IAddNotificationEndpointProps {
  saveAndRefresh: any;
}

const AddEventDestination = ({
  saveAndRefresh,
}: IAddNotificationEndpointProps) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const params = useParams();

  //Local States
  const [valuesArr, setValueArr] = useState<IElementValue[]>([]);
  const [identifier, setIdentifier] = useState<string>("");
  const [saving, setSaving] = useState<boolean>(false);
  const service = params.service || "";

  //Effects
  useEffect(() => {
    if (saving) {
      const payload = {
        key_values: removeEmptyFields(valuesArr),
      };
      api.configs
        .setConfig(`${service}:${identifier}`, payload)
        .then(() => {
          setSaving(false);
          dispatch(setServerNeedsRestart(true));
          dispatch(setDestinationLoading(true));
          navigate(IAM_PAGES.EVENT_DESTINATIONS);
        })
        .catch((err) => {
          setSaving(false);
          dispatch(setErrorSnackMessage(errorToHandler(err.error)));
        });
    }
  }, [
    saving,
    service,
    valuesArr,
    saveAndRefresh,
    dispatch,
    navigate,
    identifier,
  ]);

  //Fetch Actions
  const submitForm = (event: React.FormEvent) => {
    event.preventDefault();
    setSaving(true);
  };

  const onValueChange = useCallback(
    (newValue: IElementValue[]) => {
      setValueArr(newValue);
    },
    [setValueArr],
  );

  let srvComponent;
  switch (service) {
    case notifyPostgres: {
      srvComponent = <ConfPostgres onChange={onValueChange} />;
      break;
    }
    case notifyMysql: {
      srvComponent = <ConfMySql onChange={onValueChange} />;
      break;
    }
    default: {
      const fields = get(notificationEndpointsFields, service, []);

      srvComponent = (
        <ConfTargetGeneric fields={fields} onChange={onValueChange} />
      );
    }
  }

  const targetElement = destinationList.find(
    (element) => element.actionTrigger === service,
  );

  useEffect(() => {
    dispatch(setHelpName("add_notification_endpoint"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Fragment>
      <PageHeaderWrapper
        label={
          <Fragment>
            <BackLink
              label="Event Destinations"
              onClick={() => navigate(IAM_PAGES.EVENT_DESTINATIONS_ADD)}
            />
          </Fragment>
        }
        actions={<HelpMenu />}
      />

      <PageLayout>
        <form noValidate onSubmit={submitForm}>
          {service !== "" && (
            <Fragment>
              <Grid item xs={12}>
                {targetElement && (
                  <TargetTitle
                    logoSrc={targetElement.logo}
                    title={targetElement ? targetElement.targetTitle : ""}
                  />
                )}
              </Grid>
              <FormLayout>
                <InputBox
                  id={"identifier-field"}
                  name={"identifier-field"}
                  label={"Identifier"}
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  tooltip={"Unique descriptive string for this destination"}
                  placeholder="Enter Destination Identifier"
                  required
                />
                <Grid item xs={12}>
                  {srvComponent}
                </Grid>
                <Grid
                  item
                  xs={12}
                  sx={{
                    display: "flex",
                    justifyContent: "flex-end",
                    marginTop: 15,
                  }}
                >
                  <Button
                    id={"save-notification-target"}
                    type="submit"
                    variant="callAction"
                    disabled={saving || identifier.trim() === ""}
                    label={"Save Event Destination"}
                  />
                </Grid>
              </FormLayout>
            </Fragment>
          )}
        </form>
      </PageLayout>
    </Fragment>
  );
};

export default AddEventDestination;
