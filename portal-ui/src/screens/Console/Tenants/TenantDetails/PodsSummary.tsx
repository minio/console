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

import React, { Fragment, useEffect, useState } from "react";
import { connect } from "react-redux";
import { createStyles, Theme, withStyles } from "@material-ui/core/styles";
import {
  containerForHeader,
  tenantDetailsStyles,
} from "../../Common/FormComponents/common/styleLibrary";
import { niceDays } from "../../../../common/utils";
import { IPodListElement } from "../ListTenants/types";
import { setErrorSnackMessage } from "../../../../actions";
import api from "../../../../common/api";
import TableWrapper from "../../Common/TableWrapper/TableWrapper";

interface IPodsSummary {
  match: any;
  history: any;
}

const styles = (theme: Theme) =>
  createStyles({
    ...tenantDetailsStyles,
    ...containerForHeader(theme.spacing(4)),
  });

const PodsSummary = ({ match, history }: IPodsSummary) => {
  const [pods, setPods] = useState<IPodListElement[]>([]);
  const [loadingPods, setLoadingPods] = useState<boolean>(true);

  const tenantName = match.params["tenantName"];
  const tenantNamespace = match.params["tenantNamespace"];

  const podViewAction = (pod: IPodListElement) => {
    history.push(
      `/namespaces/${tenantNamespace}/tenants/${tenantName}/pods/${pod.name}`
    );
    return;
  };
  const podTableActions = [{ type: "view", onClick: podViewAction }];

  useEffect(() => {
    if (loadingPods) {
      api
        .invoke(
          "GET",
          `/api/v1/namespaces/${tenantNamespace}/tenants/${tenantName}/pods`
        )
        .then((result: IPodListElement[]) => {
          for (let i = 0; i < result.length; i++) {
            let currentTime = new Date().getSeconds();
            result[i].time = niceDays(
              (currentTime - parseInt(result[i].timeCreated)).toString()
            );
          }
          setPods(result);
          setLoadingPods(false);
        })
        .catch((err) => {
          setErrorSnackMessage("Error loading pods");
        });
    }
  }, [loadingPods, tenantName, tenantNamespace]);

  return (
    <Fragment>
      <br />
      <TableWrapper
        columns={[
          { label: "Name", elementKey: "name" },
          { label: "Status", elementKey: "status" },
          { label: "Age", elementKey: "time" },
          { label: "Pod IP", elementKey: "podIP" },
          {
            label: "Restarts",
            elementKey: "restarts",
            renderFunction: (input) => {
              return input != null ? input : 0;
            },
          },
          { label: "Node", elementKey: "node" },
        ]}
        isLoading={loadingPods}
        records={pods}
        itemActions={podTableActions}
        entityName="Servers"
        idField="name"
      />
    </Fragment>
  );
};

const connector = connect(null, {
  setErrorSnackMessage,
});

export default withStyles(styles)(connector(PodsSummary));
