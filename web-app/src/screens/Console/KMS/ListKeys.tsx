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

import React, { useEffect, useState } from "react";
import { AddIcon, Button, DataTable, Grid, PageLayout, RefreshIcon } from "mds";
import { useNavigate } from "react-router-dom";
import api from "../../../common/api";
import {
  hasPermission,
  SecureComponent,
} from "../../../common/SecureComponent";
import {
  CONSOLE_UI_RESOURCE,
  IAM_PAGES,
  IAM_SCOPES,
} from "../../../common/SecureComponent/permissions";
import { ErrorResponseHandler } from "../../../common/types";
import { useAppDispatch } from "../../../store";
import { setErrorSnackMessage, setHelpName } from "../../../systemSlice";
import SearchBox from "../Common/SearchBox";
import TooltipWrapper from "../Common/TooltipWrapper/TooltipWrapper";
import PageHeaderWrapper from "../Common/PageHeaderWrapper/PageHeaderWrapper";
import HelpMenu from "../HelpMenu";

const ListKeys = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [filter, setFilter] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [records, setRecords] = useState<[]>([]);

  const createKey = hasPermission(CONSOLE_UI_RESOURCE, [
    IAM_SCOPES.KMS_CREATE_KEY,
  ]);

  const displayKeys = hasPermission(CONSOLE_UI_RESOURCE, [
    IAM_SCOPES.KMS_LIST_KEYS,
  ]);

  useEffect(() => {
    fetchRecords();
  }, []);

  useEffect(() => {
    setLoading(true);
  }, [filter]);

  useEffect(() => {
    if (loading) {
      if (displayKeys) {
        let pattern = filter.trim() === "" ? "*" : filter.trim();
        api
          .invoke("GET", `/api/v1/kms/keys?pattern=${pattern}`)
          .then((res) => {
            setLoading(false);
            setRecords(res.results);
          })
          .catch((err: ErrorResponseHandler) => {
            setLoading(false);
            dispatch(setErrorSnackMessage(err));
          });
      } else {
        setLoading(false);
      }
    }
  }, [loading, setLoading, setRecords, dispatch, displayKeys, filter]);

  const fetchRecords = () => {
    setLoading(true);
  };

  useEffect(() => {
    dispatch(setHelpName("list_keys"));
  }, [dispatch]);

  return (
    <React.Fragment>
      <PageHeaderWrapper
        label="Key Management Service Keys"
        actions={<HelpMenu />}
      />

      <PageLayout>
        <Grid container>
          <Grid
            item
            xs={12}
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
              "& button": {
                marginLeft: "8px",
              },
            }}
          >
            <SecureComponent
              scopes={[IAM_SCOPES.KMS_LIST_KEYS]}
              resource={CONSOLE_UI_RESOURCE}
              errorProps={{ disabled: true }}
            >
              <SearchBox
                onChange={setFilter}
                placeholder="Search Keys with pattern"
                value={filter}
              />
            </SecureComponent>

            <SecureComponent
              scopes={[IAM_SCOPES.KMS_LIST_KEYS]}
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
            {createKey ? (
              <SecureComponent
                scopes={[IAM_SCOPES.KMS_CREATE_KEY]}
                resource={CONSOLE_UI_RESOURCE}
                errorProps={{ disabled: true }}
              >
                <TooltipWrapper tooltip={"Create Key"}>
                  <Button
                    id={"create-key"}
                    label={"Create Key"}
                    variant={"callAction"}
                    icon={<AddIcon />}
                    onClick={() => navigate(IAM_PAGES.KMS_KEYS_ADD)}
                  />
                </TooltipWrapper>
              </SecureComponent>
            ) : null}
          </Grid>
          <Grid item xs={12} sx={{ marginTop: "5px" }}>
            <SecureComponent
              scopes={[IAM_SCOPES.KMS_LIST_KEYS]}
              resource={CONSOLE_UI_RESOURCE}
              errorProps={{ disabled: true }}
            >
              <DataTable
                columns={[
                  { label: "Name", elementKey: "name" },
                  { label: "Created By", elementKey: "createdBy" },
                  { label: "Created At", elementKey: "createdAt" },
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
    </React.Fragment>
  );
};

export default ListKeys;
