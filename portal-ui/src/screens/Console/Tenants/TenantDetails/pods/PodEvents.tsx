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
import { Theme } from "@mui/material/styles";
import createStyles from "@mui/styles/createStyles";
import withStyles from "@mui/styles/withStyles";
import {
  actionsTray,
  buttonsStyles,
  hrClass,
  searchField,
} from "../../../Common/FormComponents/common/styleLibrary";
import Grid from "@mui/material/Grid";
import { IEvent } from "../../ListTenants/types";
import { setErrorSnackMessage } from "../../../../../actions";
import { niceDays } from "../../../../../common/utils";
import { ErrorResponseHandler } from "../../../../../common/types";
import TableWrapper from "../../../Common/TableWrapper/TableWrapper";
import api from "../../../../../common/api";
import { AppState } from "../../../../../store";

interface IPodEventsProps {
  classes: any;
  tenant: string;
  namespace: string;
  podName: string;
  propLoading: boolean;
  setErrorSnackMessage: typeof setErrorSnackMessage;
  loadingTenant: boolean;
}

const styles = (theme: Theme) =>
  createStyles({
    ...actionsTray,
    ...buttonsStyles,
    ...searchField,
    ...hrClass,
    actionsTray: {
      ...actionsTray.actionsTray,
      padding: "15px 0 0",
    },
  });

const PodEvents = ({
  classes,
  tenant,
  namespace,
  podName,
  propLoading,
  setErrorSnackMessage,
  loadingTenant,
}: IPodEventsProps) => {
  const [event, setEvent] = useState<IEvent[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (propLoading) {
      setLoading(true);
    }
  }, [propLoading]);

  useEffect(() => {
    if (loadingTenant) {
      setLoading(true);
    }
  }, [loadingTenant]);

  useEffect(() => {
    if (loading) {
      api
        .invoke(
          "GET",
          `/api/v1/namespaces/${namespace}/tenants/${tenant}/pods/${podName}/events`
        )
        .then((res: IEvent[]) => {
          for (let i = 0; i < res.length; i++) {
            let currentTime = (Date.now() / 1000) | 0;

            res[i].seen = niceDays((currentTime - res[i].last_seen).toString());
          }
          setEvent(res);
          setLoading(false);
        })
        .catch((err: ErrorResponseHandler) => {
          setErrorSnackMessage(err);
          setLoading(false);
        });
    }
  }, [loading, podName, namespace, tenant, setErrorSnackMessage]);

  return (
    <React.Fragment>
      <Grid item xs={12} className={classes.actionsTray}>
        <TableWrapper
          itemActions={[]}
          columns={[
            { label: "Namespace", elementKey: "namespace" },
            { label: "Last Seen", elementKey: "seen" },
            { label: "Message", elementKey: "message" },
            { label: "Event Type", elementKey: "event_type" },
            { label: "Reason", elementKey: "reason" },
          ]}
          isLoading={loading}
          records={event}
          entityName="Events"
          idField="event"
        />
      </Grid>
    </React.Fragment>
  );
};
const mapState = (state: AppState) => ({
  loadingTenant: state.tenants.tenantDetails.loadingTenant,
});
const connector = connect(mapState, {
  setErrorSnackMessage,
});

export default withStyles(styles)(connector(PodEvents));
