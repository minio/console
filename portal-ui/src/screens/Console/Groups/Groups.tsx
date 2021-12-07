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
import { Theme } from "@mui/material/styles";
import createStyles from "@mui/styles/createStyles";
import withStyles from "@mui/styles/withStyles";
import Grid from "@mui/material/Grid";
import { Button, LinearProgress } from "@mui/material";
import { AddIcon, GroupsIcon, UsersIcon } from "../../../icons";
import { setErrorSnackMessage } from "../../../actions";
import { GroupsList } from "./types";
import { stringSort } from "../../../utils/sortFunctions";
import {
  actionsTray,
  containerForHeader,
  searchField,
  tableStyles,
} from "../Common/FormComponents/common/styleLibrary";
import { ErrorResponseHandler } from "../../../common/types";
import api from "../../../common/api";
import TableWrapper from "../Common/TableWrapper/TableWrapper";
import PageHeader from "../Common/PageHeader/PageHeader";
import HelpBox from "../../../common/HelpBox";
import history from "../../../history";
import AButton from "../Common/AButton/AButton";
import PageLayout from "../Common/Layout/PageLayout";
import SearchBox from "../Common/SearchBox";
import {
  CONSOLE_UI_RESOURCE,
  IAM_SCOPES,
} from "../../../common/SecureComponent/permissions";
import SecureComponent, {
  hasPermission,
} from "../../../common/SecureComponent/SecureComponent";

import withSuspense from "../Common/Components/withSuspense";

const DeleteGroup = withSuspense(React.lazy(() => import("./DeleteGroup")));
const AddGroup = withSuspense(React.lazy(() => import("../Groups/AddGroup")));
const SetPolicy = withSuspense(
  React.lazy(() => import("../Policies/SetPolicy"))
);

interface IGroupsProps {
  classes: any;
  openGroupModal: any;
  setErrorSnackMessage: typeof setErrorSnackMessage;
}

const styles = (theme: Theme) =>
  createStyles({
    tableBlock: {
      ...tableStyles.tableBlock,
      marginTop: 15,
    },
    ...actionsTray,
    searchField: {
      ...searchField.searchField,
      maxWidth: 380,
    },
    ...containerForHeader(theme.spacing(4)),
  });

const Groups = ({ classes, setErrorSnackMessage }: IGroupsProps) => {
  const [addGroupOpen, setGroupOpen] = useState<boolean>(false);
  const [selectedGroup, setSelectedGroup] = useState<any>(null);
  const [deleteOpen, setDeleteOpen] = useState<boolean>(false);
  const [loading, isLoading] = useState<boolean>(false);
  const [records, setRecords] = useState<any[]>([]);
  const [filter, setFilter] = useState<string>("");
  const [policyOpen, setPolicyOpen] = useState<boolean>(false);

  useEffect(() => {
    isLoading(true);
  }, []);

  useEffect(() => {
    isLoading(true);
  }, []);

  const displayGroups = hasPermission(CONSOLE_UI_RESOURCE, [
    IAM_SCOPES.ADMIN_LIST_GROUPS,
  ]);

  const deleteGroup = hasPermission(CONSOLE_UI_RESOURCE, [
    IAM_SCOPES.ADMIN_REMOVE_USER_FROM_GROUP,
  ]);

  const getGroup = hasPermission(CONSOLE_UI_RESOURCE, [
    IAM_SCOPES.ADMIN_GET_GROUP,
  ]);

  useEffect(() => {
    if (loading) {
      if (displayGroups) {
        const fetchRecords = () => {
          api
            .invoke("GET", `/api/v1/groups`)
            .then((res: GroupsList) => {
              let resGroups: string[] = [];
              if (res.groups !== null) {
                resGroups = res.groups.sort(stringSort);
              }
              setRecords(resGroups);
              isLoading(false);
            })
            .catch((err: ErrorResponseHandler) => {
              setErrorSnackMessage(err);
              isLoading(false);
            });
        };
        fetchRecords();
      } else {
        isLoading(false);
      }
    }
  }, [loading, setErrorSnackMessage, displayGroups]);

  const closeAddModalAndRefresh = () => {
    setGroupOpen(false);
    isLoading(true);
  };

  const closeDeleteModalAndRefresh = (refresh: boolean) => {
    setDeleteOpen(false);

    if (refresh) {
      isLoading(true);
    }
  };

  const filteredRecords = records.filter((elementItem) =>
    elementItem.includes(filter)
  );

  const viewAction = (group: any) => {
    history.push(`/groups/${group}`);
  };

  const deleteAction = (group: any) => {
    setDeleteOpen(true);
    setSelectedGroup(group);
  };

  const tableActions = [
    {
      type: "view",
      onClick: viewAction,
      disableButtonFunction: () => !getGroup,
    },
    {
      type: "delete",
      onClick: deleteAction,
      disableButtonFunction: () => !deleteGroup,
    },
  ];

  return (
    <React.Fragment>
      {addGroupOpen && (
        <AddGroup
          open={addGroupOpen}
          selectedGroup={selectedGroup}
          closeModalAndRefresh={closeAddModalAndRefresh}
        />
      )}
      {deleteOpen && (
        <DeleteGroup
          deleteOpen={deleteOpen}
          selectedGroup={selectedGroup}
          closeDeleteModalAndRefresh={closeDeleteModalAndRefresh}
        />
      )}
      {setPolicyOpen && (
        <SetPolicy
          open={policyOpen}
          selectedGroup={selectedGroup}
          selectedUser={null}
          closeModalAndRefresh={() => {
            setPolicyOpen(false);
          }}
        />
      )}
      <PageHeader label={"Groups"} />

      <PageLayout>
        <Grid item xs={12} className={classes.actionsTray}>
          <SecureComponent
            resource={CONSOLE_UI_RESOURCE}
            scopes={[IAM_SCOPES.ADMIN_LIST_GROUPS]}
            errorProps={{ disabled: true }}
          >
            <SearchBox placeholder={"Search Groups"} onChange={setFilter} overrideClass={classes.searchField} />
          </SecureComponent>

          <SecureComponent
            resource={CONSOLE_UI_RESOURCE}
            scopes={[
              IAM_SCOPES.ADMIN_ADD_USER_TO_GROUP,
              IAM_SCOPES.ADMIN_LIST_USERS,
            ]}
            matchAll
          >
            <Button
              variant="contained"
              color="primary"
              endIcon={<AddIcon />}
              onClick={() => {
                setSelectedGroup(null);
                setGroupOpen(true);
              }}
            >
              Create Group
            </Button>
          </SecureComponent>
        </Grid>
        {loading && <LinearProgress />}
        {!loading && (
          <Fragment>
            {records.length > 0 && (
              <Fragment>
                <Grid item xs={12} className={classes.tableBlock}>
                  <SecureComponent
                    resource={CONSOLE_UI_RESOURCE}
                    scopes={[IAM_SCOPES.ADMIN_LIST_GROUPS]}
                    errorProps={{ disabled: true }}
                  >
                    <TableWrapper
                      itemActions={tableActions}
                      columns={[{ label: "Name", elementKey: "" }]}
                      isLoading={loading}
                      records={filteredRecords}
                      entityName="Groups"
                      idField=""
                    />
                  </SecureComponent>
                </Grid>
                <Grid item xs={12}>
                  <HelpBox
                    title={"Groups"}
                    iconComponent={<GroupsIcon />}
                    help={
                      <Fragment>
                        A group can have one attached IAM policy, where all
                        users with membership in that group inherit that policy.
                        Groups support more simplified management of user
                        permissions on the MinIO Tenant.
                        <br />
                        <br />
                        You can learn more at our{" "}
                        <a
                          href="https://docs.min.io/minio/k8s/tutorials/group-management.html?ref=con"
                          target="_blank"
                          rel="noreferrer"
                        >
                          documentation
                        </a>
                        .
                      </Fragment>
                    }
                  />
                </Grid>
              </Fragment>
            )}
            {records.length === 0 && (
              <Grid
                container
                justifyContent={"center"}
                alignContent={"center"}
                alignItems={"center"}
              >
                <Grid item xs={8}>
                  <HelpBox
                    title={"Groups"}
                    iconComponent={<UsersIcon />}
                    help={
                      <Fragment>
                        A group can have one attached IAM policy, where all
                        users with membership in that group inherit that policy.
                        Groups support more simplified management of user
                        permissions on the MinIO Tenant.
                        <SecureComponent
                          resource={CONSOLE_UI_RESOURCE}
                          scopes={[
                            IAM_SCOPES.ADMIN_ADD_USER_TO_GROUP,
                            IAM_SCOPES.ADMIN_LIST_USERS,
                          ]}
                          matchAll
                        >
                          <br />
                          <br />
                          To get started,{" "}
                          <AButton
                            onClick={() => {
                              setSelectedGroup(null);
                              setGroupOpen(true);
                            }}
                          >
                            Create a Group
                          </AButton>
                          .
                        </SecureComponent>
                      </Fragment>
                    }
                  />
                </Grid>
              </Grid>
            )}
          </Fragment>
        )}
      </PageLayout>
    </React.Fragment>
  );
};

const mapDispatchToProps = {
  setErrorSnackMessage,
};

const connector = connect(null, mapDispatchToProps);

export default withStyles(styles)(connector(Groups));
