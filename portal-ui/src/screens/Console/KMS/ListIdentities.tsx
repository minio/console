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
import api from "../../../common/api";
import {
  hasPermission,
  SecureComponent,
} from "../../../common/SecureComponent";
import {
  CONSOLE_UI_RESOURCE,
  IAM_SCOPES,
} from "../../../common/SecureComponent/permissions";
import { ErrorResponseHandler } from "../../../common/types";
import { RefreshIcon } from "../../../icons";
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

interface IIdentitiesProps {
  classes: any;
}

const ListIdentities = ({ classes }: IIdentitiesProps) => {
  const dispatch = useAppDispatch();
  const [filter, setFilter] = useState<string>("");
  const [deleteOpen, setDeleteOpen] = useState<boolean>(false);
  const [selectedIdentity, setSelectedIdentity] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [records, setRecords] = useState<[]>([]);

  const deleteIdentity = hasPermission(CONSOLE_UI_RESOURCE, [
    IAM_SCOPES.KMS_DELETE_IDENTITY,
  ]);

  const displayIdentities = hasPermission(CONSOLE_UI_RESOURCE, [
    IAM_SCOPES.KMS_LIST_IDENTITIES,
  ]);

  useEffect(() => {
    fetchRecords();
  }, []);

  useEffect(() => {
    setLoading(true);
  }, [filter]);

  useEffect(() => {
    if (loading) {
      if (displayIdentities) {
        let pattern = filter.trim() === "" ? "*" : filter.trim();
        api
          .invoke("GET", `/api/v1/kms/identities?pattern=${pattern}`)
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
  }, [loading, setLoading, setRecords, dispatch, displayIdentities, filter]);

  const fetchRecords = () => {
    setLoading(true);
  };

  const confirmDeleteIdentity = (identity: string) => {
    setDeleteOpen(true);
    setSelectedIdentity(identity);
  };

  const closeDeleteModalAndRefresh = (refresh: boolean) => {
    setDeleteOpen(false);

    if (refresh) {
      fetchRecords();
    }
  };

  const tableActions = [
    {
      type: "delete",
      onClick: confirmDeleteIdentity,
      sendOnlyId: true,
      disableButtonFunction: () => !deleteIdentity,
    },
  ];

  return (
    <React.Fragment>
      {deleteOpen && (
        <DeleteKMSModal
          deleteOpen={deleteOpen}
          selectedItem={selectedIdentity}
          endpoint={"/api/v1/kms/identities/"}
          element={"Identity"}
          closeDeleteModalAndRefresh={closeDeleteModalAndRefresh}
        />
      )}
      <PageHeader label="Key Management Service Identities" />
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
              scopes={[IAM_SCOPES.KMS_LIST_IDENTITIES]}
              resource={CONSOLE_UI_RESOURCE}
              errorProps={{ disabled: true }}
            >
              <SearchBox
                onChange={setFilter}
                placeholder="Search Identities with pattern"
                overrideClass={classes.searchField}
                value={filter}
              />
            </SecureComponent>
            <SecureComponent
              scopes={[IAM_SCOPES.KMS_LIST_IDENTITIES]}
              resource={CONSOLE_UI_RESOURCE}
              errorProps={{ disabled: true }}
            >
              <TooltipWrapper tooltip={"Refresh"}>
                <Button
                  id={"refresh-identities"}
                  variant="regular"
                  icon={<RefreshIcon />}
                  onClick={() => setLoading(true)}
                />
              </TooltipWrapper>
            </SecureComponent>
          </Grid>
          <Grid item xs={12} className={classes.tableBlock}>
            <SecureComponent
              scopes={[IAM_SCOPES.KMS_LIST_IDENTITIES]}
              resource={CONSOLE_UI_RESOURCE}
              errorProps={{ disabled: true }}
            >
              <TableWrapper
                itemActions={tableActions}
                columns={[
                  { label: "Identity", elementKey: "identity" },
                  { label: "Policy", elementKey: "policy" },
                  { label: "Created By", elementKey: "createdBy" },
                  { label: "Created At", elementKey: "createdAt" },
                ]}
                isLoading={loading}
                records={records}
                entityName="Identities"
                idField="identity"
              />
            </SecureComponent>
          </Grid>
        </Grid>
      </PageLayout>
    </React.Fragment>
  );
};

export default withStyles(styles)(ListIdentities);
