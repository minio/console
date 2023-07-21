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
import { AddIcon, Button, PageLayout, RefreshIcon, Grid, DataTable } from "mds";
import { useNavigate } from "react-router-dom";
import { api } from "api";
import { errorToHandler } from "api/errors";
import { useAppDispatch } from "../../../store";
import {
  CONSOLE_UI_RESOURCE,
  IAM_SCOPES,
} from "../../../common/SecureComponent/permissions";
import {
  hasPermission,
  SecureComponent,
} from "../../../common/SecureComponent";
import { setErrorSnackMessage, setHelpName } from "../../../systemSlice";
import { actionsTray } from "../Common/FormComponents/common/styleLibrary";
import TooltipWrapper from "../Common/TooltipWrapper/TooltipWrapper";
import DeleteIDPConfigurationModal from "./DeleteIDPConfigurationModal";
import PageHeaderWrapper from "../Common/PageHeaderWrapper/PageHeaderWrapper";
import HelpMenu from "../HelpMenu";

type IDPConfigurationsProps = {
  idpType: string;
};

const IDPConfigurations = ({ idpType }: IDPConfigurationsProps) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [deleteOpen, setDeleteOpen] = useState<boolean>(false);
  const [selectedIDP, setSelectedIDP] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [records, setRecords] = useState<any[]>([]);

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
        api.idp
          .listConfigurations(idpType)
          .then((res) => {
            setLoading(false);
            if (res.data.results) {
              setRecords(
                res.data.results.map((r: any) => {
                  r.name = r.name === "_" ? "Default" : r.name;
                  r.enabled = r.enabled === true ? "Enabled" : "Disabled";
                  return r;
                }),
              );
            }
          })
          .catch((err) => {
            setLoading(false);
            dispatch(setErrorSnackMessage(errorToHandler(err.error)));
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

  useEffect(() => {
    dispatch(setHelpName("idp_configs"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
      <PageHeaderWrapper
        label={`${idpType.toUpperCase()} Configurations`}
        actions={<HelpMenu />}
      />
      <PageLayout>
        <Grid container>
          <Grid
            item
            xs={12}
            sx={{
              ...actionsTray.actionsTray,
              justifyContent: "flex-end",
              gap: 8,
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
          <Grid item xs={12}>
            <SecureComponent
              scopes={[IAM_SCOPES.ADMIN_CONFIG_UPDATE]}
              resource={CONSOLE_UI_RESOURCE}
              errorProps={{ disabled: true }}
            >
              <DataTable
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

export default IDPConfigurations;
