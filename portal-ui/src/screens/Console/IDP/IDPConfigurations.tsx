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

import React, { Fragment, useEffect, useState } from "react";

import { Theme } from "@mui/material/styles";
import createStyles from "@mui/styles/createStyles";
import withStyles from "@mui/styles/withStyles";
import { useAppDispatch } from "../../../store";
import { useNavigate } from "react-router-dom";
import {
  CONSOLE_UI_RESOURCE,
  IAM_SCOPES,
} from "../../../common/SecureComponent/permissions";
import {
  hasPermission,
  SecureComponent,
} from "../../../common/SecureComponent";
import api from "../../../common/api";
import { ErrorResponseHandler } from "../../../common/types";
import { setErrorSnackMessage } from "../../../systemSlice";
import PageLayout from "../Common/Layout/PageLayout";
import { containerForHeader } from "../Common/FormComponents/common/styleLibrary";
import { Grid } from "@mui/material";
import TooltipWrapper from "../Common/TooltipWrapper/TooltipWrapper";
import { AddIcon, Button, PageHeader, RefreshIcon } from "mds";
import TableWrapper from "../Common/TableWrapper/TableWrapper";
import DeleteIDPConfigurationModal from "./DeleteIDPConfigurationModal";

type IDPConfigurationsProps = {
  classes?: any;
  idpType: string;
};

const styles = (theme: Theme) =>
  createStyles({
    ...containerForHeader(theme.spacing(4)),
  });

const IDPConfigurations = ({ classes, idpType }: IDPConfigurationsProps) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [deleteOpen, setDeleteOpen] = useState<boolean>(false);
  const [selectedIDP, setSelectedIDP] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [records, setRecords] = useState<[]>([]);

  const deleteIDP = hasPermission(CONSOLE_UI_RESOURCE, [
    IAM_SCOPES.ADMIN_CONFIG_UPDATE,
  ]);

  const viewIDP = hasPermission(CONSOLE_UI_RESOURCE, [
    IAM_SCOPES.ADMIN_CONFIG_UPDATE,
  ]);

  const displayIDPs = hasPermission(CONSOLE_UI_RESOURCE, [
    IAM_SCOPES.ADMIN_CONFIG_UPDATE,
  ]);

  useEffect(() => {
    fetchRecords();
  }, []);

  useEffect(() => {
    if (loading) {
      if (displayIDPs) {
        api
          .invoke("GET", `/api/v1/idp/${idpType}`)
          .then((res) => {
            setLoading(false);
            setRecords(
              res.results.map((r: any) => {
                r.name = r.name === "_" ? "Default" : r.name;
                r.enabled = r.enabled === true ? "Enabled" : "Disabled";
                return r;
              })
            );
          })
          .catch((err: ErrorResponseHandler) => {
            setLoading(false);
            dispatch(setErrorSnackMessage(err));
          });
      } else {
        setLoading(false);
      }
    }
  }, [loading, setLoading, setRecords, dispatch, displayIDPs, idpType]);

  const fetchRecords = () => {
    setLoading(true);
  };

  const confirmDeleteIDP = (idp: string) => {
    setDeleteOpen(true);
    idp = idp === "Default" ? "_" : idp;
    setSelectedIDP(idp);
  };

  const viewAction = (idp: any) => {
    let name = idp.name === "Default" ? "_" : idp.name;
    navigate(`/identity/idp/${idpType}/configurations/${name}`);
  };

  const closeDeleteModalAndRefresh = async (refresh: boolean) => {
    setDeleteOpen(false);

    if (refresh) {
      fetchRecords();
    }
  };

  const tableActions = [
    {
      type: "view",
      onClick: viewAction,
      disableButtonFunction: () => !viewIDP,
    },
    {
      type: "delete",
      onClick: confirmDeleteIDP,
      sendOnlyId: true,
      disableButtonFunction: (idp: string) => !deleteIDP || idp === "Default",
    },
  ];

  return (
    <Fragment>
      {deleteOpen && (
        <DeleteIDPConfigurationModal
          deleteOpen={deleteOpen}
          idp={selectedIDP}
          idpType={idpType}
          closeDeleteModalAndRefresh={closeDeleteModalAndRefresh}
        />
      )}
      <PageHeader label={`${idpType.toUpperCase()} Configurations`} />
      <PageLayout className={classes.pageContainer}>
        <Grid container spacing={1}>
          <Grid
            item
            xs={12}
            display={"flex"}
            alignItems={"center"}
            justifyContent={"flex-end"}
            sx={{
              "& button": {
                marginLeft: "8px",
              },
            }}
          >
            <SecureComponent
              scopes={[IAM_SCOPES.ADMIN_CONFIG_UPDATE]}
              resource={CONSOLE_UI_RESOURCE}
              errorProps={{ disabled: true }}
            >
              <TooltipWrapper tooltip={"Refresh"}>
                <Button
                  id={"refresh-keys"}
                  variant="regular"
                  icon={<RefreshIcon />}
                  onClick={() => setLoading(true)}
                />
              </TooltipWrapper>
            </SecureComponent>
            <SecureComponent
              scopes={[IAM_SCOPES.ADMIN_CONFIG_UPDATE]}
              resource={CONSOLE_UI_RESOURCE}
              errorProps={{ disabled: true }}
            >
              <TooltipWrapper tooltip={`Create ${idpType} configuration`}>
                <Button
                  id={"create-idp"}
                  label={"Create Configuration"}
                  variant={"callAction"}
                  icon={<AddIcon />}
                  onClick={() =>
                    navigate(`/identity/idp/${idpType}/configurations/add-idp`)
                  }
                />
              </TooltipWrapper>
            </SecureComponent>
          </Grid>
          <Grid item xs={12} className={classes.tableBlock}>
            <SecureComponent
              scopes={[IAM_SCOPES.ADMIN_CONFIG_UPDATE]}
              resource={CONSOLE_UI_RESOURCE}
              errorProps={{ disabled: true }}
            >
              <TableWrapper
                itemActions={tableActions}
                columns={[
                  { label: "Name", elementKey: "name" },
                  { label: "Type", elementKey: "type" },
                  { label: "Enabled", elementKey: "enabled" },
                ]}
                isLoading={loading}
                records={records}
                entityName="Keys"
                idField="name"
              />
            </SecureComponent>
          </Grid>
        </Grid>
      </PageLayout>
    </Fragment>
  );
};

export default withStyles(styles)(IDPConfigurations);
