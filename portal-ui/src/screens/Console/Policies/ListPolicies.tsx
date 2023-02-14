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
import { AddIcon, Button, HelpBox, IAMPoliciesIcon } from "mds";
import { useNavigate } from "react-router-dom";
import get from "lodash/get";
import { Theme } from "@mui/material/styles";
import createStyles from "@mui/styles/createStyles";
import withStyles from "@mui/styles/withStyles";
import Grid from "@mui/material/Grid";
import { Policy, PolicyList } from "./types";

import {
  actionsTray,
  containerForHeader,
  searchField,
} from "../Common/FormComponents/common/styleLibrary";
import { ErrorResponseHandler } from "../../../common/types";

import TableWrapper from "../Common/TableWrapper/TableWrapper";
import api from "../../../common/api";
import PageLayout from "../Common/Layout/PageLayout";
import {
  CONSOLE_UI_RESOURCE,
  createPolicyPermissions,
  deletePolicyPermissions,
  IAM_PAGES,
  IAM_SCOPES,
  listPolicyPermissions,
  permissionTooltipHelper,
  viewPolicyPermissions,
} from "../../../common/SecureComponent/permissions";
import {
  hasPermission,
  SecureComponent,
} from "../../../common/SecureComponent";
import SearchBox from "../Common/SearchBox";

import withSuspense from "../Common/Components/withSuspense";

import { encodeURLString } from "../../../common/utils";
import { setErrorSnackMessage } from "../../../systemSlice";
import { useAppDispatch } from "../../../store";
import TooltipWrapper from "../Common/TooltipWrapper/TooltipWrapper";
import PageHeaderWrapper from "../Common/PageHeaderWrapper/PageHeaderWrapper";

const DeletePolicy = withSuspense(React.lazy(() => import("./DeletePolicy")));

const styles = (theme: Theme) =>
  createStyles({
    ...actionsTray,
    ...searchField,
    searchField: {
      ...searchField.searchField,
      maxWidth: 380,
    },
    ...containerForHeader,
  });

interface IPoliciesProps {
  classes: any;
}

const ListPolicies = ({ classes }: IPoliciesProps) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [records, setRecords] = useState<Policy[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [deleteOpen, setDeleteOpen] = useState<boolean>(false);
  const [selectedPolicy, setSelectedPolicy] = useState<string>("");
  const [filterPolicies, setFilterPolicies] = useState<string>("");
  const viewPolicy = hasPermission(CONSOLE_UI_RESOURCE, [
    IAM_SCOPES.ADMIN_GET_POLICY,
  ]);

  const canDeletePolicy = hasPermission(
    CONSOLE_UI_RESOURCE,
    deletePolicyPermissions
  );

  const canDisplayPolicies = hasPermission(
    CONSOLE_UI_RESOURCE,
    listPolicyPermissions
  );

  const canCreatePolicy = hasPermission(
    CONSOLE_UI_RESOURCE,
    createPolicyPermissions
  );

  const canViewPolicy = hasPermission(
    CONSOLE_UI_RESOURCE,
    viewPolicyPermissions
  );

  useEffect(() => {
    fetchRecords();
  }, []);

  useEffect(() => {
    if (loading) {
      if (canDisplayPolicies) {
        api
          .invoke("GET", `/api/v1/policies`)
          .then((res: PolicyList) => {
            const policies = get(res, "policies", []);

            policies.sort((pa, pb) => {
              if (pa.name > pb.name) {
                return 1;
              }

              if (pa.name < pb.name) {
                return -1;
              }

              return 0;
            });

            setLoading(false);
            setRecords(policies);
          })
          .catch((err: ErrorResponseHandler) => {
            setLoading(false);
            dispatch(setErrorSnackMessage(err));
          });
      } else {
        setLoading(false);
      }
    }
  }, [loading, setLoading, setRecords, dispatch, canDisplayPolicies]);

  const fetchRecords = () => {
    setLoading(true);
  };

  const closeDeleteModalAndRefresh = (refresh: boolean) => {
    setDeleteOpen(false);

    if (refresh) {
      fetchRecords();
    }
  };

  const confirmDeletePolicy = (policy: string) => {
    setDeleteOpen(true);
    setSelectedPolicy(policy);
  };

  const viewAction = (policy: any) => {
    navigate(`${IAM_PAGES.POLICIES}/${encodeURLString(policy.name)}`);
  };

  const tableActions = [
    {
      type: "view",
      onClick: viewAction,
      disableButtonFunction: () => !viewPolicy,
    },
    {
      type: "delete",
      onClick: confirmDeletePolicy,
      sendOnlyId: true,
      disableButtonFunction: () => !canDeletePolicy,
    },
  ];

  const filteredRecords = records.filter((elementItem) =>
    elementItem.name.includes(filterPolicies)
  );

  return (
    <React.Fragment>
      {deleteOpen && (
        <DeletePolicy
          deleteOpen={deleteOpen}
          selectedPolicy={selectedPolicy}
          closeDeleteModalAndRefresh={closeDeleteModalAndRefresh}
        />
      )}
      <PageHeaderWrapper label="IAM Policies" />
      <PageLayout className={classes.pageContainer}>
        <Grid container spacing={1}>
          <Grid item xs={12} className={classes.actionsTray}>
            <SearchBox
              onChange={setFilterPolicies}
              placeholder="Search Policies"
              overrideClass={classes.searchField}
              value={filterPolicies}
            />

            <SecureComponent
              scopes={[IAM_SCOPES.ADMIN_CREATE_POLICY]}
              resource={CONSOLE_UI_RESOURCE}
              errorProps={{ disabled: true }}
            >
              <TooltipWrapper
                tooltip={
                  canCreatePolicy
                    ? ""
                    : permissionTooltipHelper(
                        createPolicyPermissions,
                        "create a Policy"
                      )
                }
              >
                <Button
                  id={"create-policy"}
                  label={"Create Policy"}
                  variant="callAction"
                  icon={<AddIcon />}
                  onClick={() => {
                    navigate(`${IAM_PAGES.POLICY_ADD}`);
                  }}
                  disabled={!canCreatePolicy}
                />
              </TooltipWrapper>
            </SecureComponent>
          </Grid>
          <Grid item xs={12} className={classes.tableBlock}>
            <SecureComponent
              scopes={[IAM_SCOPES.ADMIN_LIST_USER_POLICIES]}
              resource={CONSOLE_UI_RESOURCE}
              errorProps={{ disabled: true }}
            >
              <TableWrapper
                itemActions={tableActions}
                columns={[{ label: "Name", elementKey: "name" }]}
                isLoading={loading}
                records={filteredRecords}
                entityName="Policies"
                idField="name"
                tooltip={
                  canViewPolicy
                    ? ""
                    : permissionTooltipHelper(
                        viewPolicyPermissions,
                        "view Policy details"
                      )
                }
              />
            </SecureComponent>
          </Grid>
          <Grid item xs={12}>
            <HelpBox
              title={"Learn more about IAM POLICIES"}
              iconComponent={<IAMPoliciesIcon />}
              help={
                <Fragment>
                  MinIO uses Policy-Based Access Control (PBAC) to define the
                  authorized actions and resources to which an authenticated
                  user has access. Each policy describes one or more actions and
                  conditions that outline the permissions of a user or group of
                  users.
                  <br />
                  <br />
                  MinIO PBAC is built for compatibility with AWS IAM policy
                  syntax, structure, and behavior. The MinIO documentation makes
                  a best-effort to cover IAM-specific behavior and
                  functionality. Consider deferring to the IAM documentation for
                  more complete documentation on AWS IAM-specific topics.
                  <br />
                  <br />
                  You can learn more at our{" "}
                  <a
                    href="https://min.io/docs/minio/linux/administration/identity-access-management.html?ref=con#access-management"
                    target="_blank"
                    rel="noopener"
                  >
                    documentation
                  </a>
                  .
                </Fragment>
              }
            />
          </Grid>
        </Grid>
      </PageLayout>
    </React.Fragment>
  );
};

export default withStyles(styles)(ListPolicies);
