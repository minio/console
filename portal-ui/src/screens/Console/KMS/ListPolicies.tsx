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

import { Grid, Theme } from "@mui/material";
import { createStyles, withStyles } from "@mui/styles";
import { Button } from "mds";
import React, { useEffect, useState } from "react";
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
import { AddIcon, RefreshIcon } from "../../../icons";
import { useAppDispatch } from "../../../store";
import { setErrorSnackMessage } from "../../../systemSlice";
import withSuspense from "../Common/Components/withSuspense";
import { containerForHeader } from "../Common/FormComponents/common/styleLibrary";
import PageLayout from "../Common/Layout/PageLayout";
import PageHeader from "../Common/PageHeader/PageHeader";
import SearchBox from "../Common/SearchBox";
import TableWrapper from "../Common/TableWrapper/TableWrapper";
import TooltipWrapper from "../Common/TooltipWrapper/TooltipWrapper";

const DeleteKMSModal = withSuspense(
  React.lazy(() => import("./DeleteKMSModal"))
);

const styles = (theme: Theme) =>
  createStyles({
    ...containerForHeader(theme.spacing(4)),
  });

interface IPoliciesProps {
  classes: any;
}

const ListPolicies = ({ classes }: IPoliciesProps) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [filter, setFilter] = useState<string>("");
  const [deleteOpen, setDeleteOpen] = useState<boolean>(false);
  const [selectedPolicy, setSelectedPolicy] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [records, setRecords] = useState<[]>([]);

  const deletePolicy = hasPermission(CONSOLE_UI_RESOURCE, [
    IAM_SCOPES.KMS_DELETE_POLICY,
  ]);

  const displayPolicies = hasPermission(CONSOLE_UI_RESOURCE, [
    IAM_SCOPES.KMS_LIST_POLICIES,
  ]);

  const viewPolicy = hasPermission(CONSOLE_UI_RESOURCE, [
    IAM_SCOPES.KMS_GET_POLICY,
  ]);

  useEffect(() => {
    fetchRecords();
  }, []);

  useEffect(() => {
    setLoading(true);
  }, [filter]);

  useEffect(() => {
    if (loading) {
      if (displayPolicies) {
        let pattern = filter.trim() === "" ? "*" : filter.trim();
        api
          .invoke("GET", `/api/v1/kms/policies?pattern=${pattern}`)
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
  }, [loading, setLoading, setRecords, dispatch, displayPolicies, filter]);

  const fetchRecords = () => {
    setLoading(true);
  };

  const confirmDeletePolicy = (policy: string) => {
    setDeleteOpen(true);
    setSelectedPolicy(policy);
  };

  const closeDeleteModalAndRefresh = (refresh: boolean) => {
    setDeleteOpen(false);

    if (refresh) {
      fetchRecords();
    }
  };

  const tableActions = [
    {
      type: "view",
      onClick: (policy: any) =>
        navigate(`${IAM_PAGES.KMS_POLICIES}/${policy.name}`),
      disableButtonFunction: () => !viewPolicy,
    },
    {
      type: "delete",
      onClick: confirmDeletePolicy,
      sendOnlyId: true,
      disableButtonFunction: () => !deletePolicy,
    },
  ];

  return (
    <React.Fragment>
      {deleteOpen && (
        <DeleteKMSModal
          deleteOpen={deleteOpen}
          selectedItem={selectedPolicy}
          endpoint={"/api/v1/kms/policies/"}
          element={"Policy"}
          closeDeleteModalAndRefresh={closeDeleteModalAndRefresh}
        />
      )}
      <PageHeader label="Key Management Service Policies" />
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
              scopes={[IAM_SCOPES.KMS_LIST_POLICIES]}
              resource={CONSOLE_UI_RESOURCE}
              errorProps={{ disabled: true }}
            >
              <SearchBox
                onChange={setFilter}
                placeholder="Search Policies with pattern"
                value={filter}
              />
            </SecureComponent>

            <SecureComponent
              scopes={[IAM_SCOPES.KMS_LIST_POLICIES]}
              resource={CONSOLE_UI_RESOURCE}
              errorProps={{ disabled: true }}
            >
              <TooltipWrapper tooltip={"Refresh"}>
                <Button
                  id={"refresh-policies"}
                  variant="regular"
                  icon={<RefreshIcon />}
                  onClick={() => setLoading(true)}
                />
              </TooltipWrapper>
            </SecureComponent>

            <SecureComponent
              scopes={[IAM_SCOPES.KMS_SET_POLICY]}
              resource={CONSOLE_UI_RESOURCE}
              errorProps={{ disabled: true }}
            >
              <TooltipWrapper tooltip={"Create Policy"}>
                <Button
                  id={"create-policy"}
                  label={"Create policy"}
                  variant={"callAction"}
                  icon={<AddIcon />}
                  onClick={() => navigate(IAM_PAGES.KMS_POLICIES_ADD)}
                />
              </TooltipWrapper>
            </SecureComponent>
          </Grid>
          <Grid item xs={12} className={classes.tableBlock}>
            <SecureComponent
              scopes={[IAM_SCOPES.KMS_LIST_POLICIES]}
              resource={CONSOLE_UI_RESOURCE}
              errorProps={{ disabled: true }}
            >
              <TableWrapper
                itemActions={tableActions}
                columns={[
                  { label: "Name", elementKey: "name" },
                  { label: "Created By", elementKey: "createdBy" },
                  { label: "Created At", elementKey: "createdAt" },
                ]}
                isLoading={loading}
                records={records}
                entityName="Policies"
                idField="name"
              />
            </SecureComponent>
          </Grid>
        </Grid>
      </PageLayout>
    </React.Fragment>
  );
};

export default withStyles(styles)(ListPolicies);
