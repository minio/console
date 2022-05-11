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
import { LinearProgress, Box } from "@mui/material";
import { AddIcon, GroupsIcon, UsersIcon, DeleteIcon, IAMPoliciesIcon } from "../../../icons";
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
import AButton from "../Common/AButton/AButton";
import PageLayout from "../Common/Layout/PageLayout";
import SearchBox from "../Common/SearchBox";
import {
  CONSOLE_UI_RESOURCE,
  IAM_PAGES,
  IAM_SCOPES,
} from "../../../common/SecureComponent/permissions";
import {
  hasPermission,
  SecureComponent,
} from "../../../common/SecureComponent";

import withSuspense from "../Common/Components/withSuspense";
import RBIconButton from "../Buckets/BucketDetails/SummaryItems/RBIconButton";

const DeleteGroup = withSuspense(React.lazy(() => import("./DeleteGroup")));
const SetPolicy = withSuspense(
  React.lazy(() => import("../Policies/SetPolicy"))
);

interface IGroupsProps {
  classes: any;
  openGroupModal: any;
  setErrorSnackMessage: typeof setErrorSnackMessage;
  history: any;
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

const Groups = ({ classes, setErrorSnackMessage, history }: IGroupsProps) => {
  const [deleteOpen, setDeleteOpen] = useState<boolean>(false);
  const [loading, isLoading] = useState<boolean>(false);
  const [records, setRecords] = useState<any[]>([]);
  const [filter, setFilter] = useState<string>("");
  const [policyOpen, setPolicyOpen] = useState<boolean>(false);
  const [checkedGroups, setCheckedGroups] = useState<string[]>([]);

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

  const selectionChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { target: { value = "", checked = false } = {} } = e;      

    let elements: string[] = [...checkedGroups]; // We clone the checkedUsers array

    if (checked) {
      // If the user has checked this field we need to push this to checkedUsersList
      elements.push(value);
    } else {
      // User has unchecked this field, we need to remove it from the list
      elements = elements.filter((element) => element !== value);
    }

    setCheckedGroups(elements);

    return elements;
  };

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

  const closeDeleteModalAndRefresh = (refresh: boolean) => {
    setDeleteOpen(false);
    setCheckedGroups([]);
    if (refresh) {
      isLoading(true);
    }
  };

  const filteredRecords = records.filter((elementItem) =>
    elementItem.includes(filter)
  );

  const viewAction = (group: any) => {
    history.push(`${IAM_PAGES.GROUPS}/${group}`);
  };


  const tableActions = [
    {
      type: "view",
      onClick: viewAction,
      disableButtonFunction: () => !getGroup,
    },
    {
      type: "edit",
     onClick: viewAction,
      disableButtonFunction: () => !getGroup,
    },
  ];


  return (
    <React.Fragment>
      {deleteOpen && (
        <DeleteGroup
          deleteOpen={deleteOpen}
          selectedGroups={checkedGroups}
          closeDeleteModalAndRefresh={closeDeleteModalAndRefresh}
        />
      )}
      {policyOpen && (
        <SetPolicy
          open={policyOpen}
          selectedGroup={checkedGroups[0]}
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
            <SearchBox
              placeholder={"Search Groups"}
              onChange={setFilter}
              overrideClass={classes.searchField}
              value={filter}
            />
          </SecureComponent> 
          <Box
            sx={{
              display: "flex",
            }}
          >
            {" "}
            <SecureComponent
            resource={CONSOLE_UI_RESOURCE}
            scopes={[
              IAM_SCOPES.ADMIN_ATTACH_USER_OR_GROUP_POLICY
            ]}
            matchAll
            errorProps={{ disabled: true }}
          >
          <RBIconButton
              tooltip={"Select Policy"}
              onClick={() => {
                setPolicyOpen(true);
              }}
              text={"Assign Policy"}
              icon={<IAMPoliciesIcon />}
              color="primary"
              disabled={checkedGroups.length < 1}
              variant={"outlined"}
            />
            
           </SecureComponent>
          <SecureComponent
            resource={CONSOLE_UI_RESOURCE}
            scopes={[
              IAM_SCOPES.ADMIN_REMOVE_USER_FROM_GROUP
            ]}
            matchAll
            errorProps={{ disabled: true }}
          >
          <RBIconButton
              tooltip={"Delete Selected"}
              onClick={() => {
                setDeleteOpen(true);
              }}
              text={"Delete Selected"}
              icon={<DeleteIcon />}
              color="secondary"
              disabled={checkedGroups.length === 0}
              variant={"outlined"}
            />
            
           </SecureComponent>
          <SecureComponent
            resource={CONSOLE_UI_RESOURCE}
            scopes={[
              IAM_SCOPES.ADMIN_ADD_USER_TO_GROUP,
              IAM_SCOPES.ADMIN_LIST_USERS,
            ]}
            matchAll
            errorProps={{ disabled: true }}
          >
            <RBIconButton
              tooltip={"Create Group"}
              text={"Create Group"}
              variant="contained"
              color="primary"
              icon={<AddIcon />}
              onClick={() => {
                history.push(`${IAM_PAGES.GROUPS_ADD}`);
              }}
            />
          </SecureComponent>
          </Box>
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
                      selectedItems={checkedGroups}
                      onSelect={deleteGroup ? selectionChanged : undefined}
                      records={filteredRecords}
                      entityName="Groups"
                      idField=""
                    />
                  </SecureComponent>
                </Grid>
                <Grid item xs={12} marginTop={"25px"}>
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
                              history.push(`${IAM_PAGES.GROUPS_ADD}`);
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
