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
import Grid from "@mui/material/Grid";
import { Button } from "@mui/material";
import { setErrorSnackMessage } from "../../../actions";
import { GroupsList } from "./types";
import { stringSort } from "../../../utils/sortFunctions";
import {
  actionsTray
} from "../Common/FormComponents/common/styleLibrary";
import { ErrorResponseHandler } from "../../../common/types";
import api from "../../../common/api";
import DeleteGroup from "./DeleteGroup";
import TableWrapper from "../Common/TableWrapper/TableWrapper";
import history from "../../../history";
import GroupHelpBox from "./GroupHelpBox";
import PageHeader from "./GroupPageHeader";
import AddIcon from "@mui/icons-material/Add";


interface IGroupsProps {
  classes: any;
  openGroupModal: any;
  setErrorSnackMessage: typeof setErrorSnackMessage;
}

const styles = (theme: Theme) =>
  createStyles({
    ...actionsTray,
    pageContainer: {
      padding: "20px 35px 0"//page spacing.
    },
    addButton: {
      width: "20px"
    }
  });

const Groups = ({ classes, setErrorSnackMessage }: IGroupsProps) => {
  const [selectedGroup, setSelectedGroup] = useState<any>(null);
  const [deleteOpen, setDeleteOpen] = useState<boolean>(false);
  const [loading, isLoading] = useState<boolean>(false);
  const [records, setRecords] = useState<any[]>([]);
  const [filter, setFilter] = useState<string>("");

  useEffect(() => {
    isLoading(true);
  }, []);

  useEffect(() => {
    if (loading) {
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
    }
  }, [loading, setErrorSnackMessage]);


  const closeDeleteModalAndRefresh = (refresh: boolean) => {
    setDeleteOpen(false);

    if (refresh) {
      isLoading(true);
    }
  };

  const filteredRecords = records.filter((elementItem) =>
    elementItem.toLowerCase().includes(filter.toLowerCase())
  );

  const viewAction = (group: string | null) => {
    if (group) {
      history.push(`/groups/edit/${group}`);
    } else {
      history.push(`/groups/new`);
    }
  };

  const deleteAction = (group: any) => {
    setSelectedGroup(group);
    setDeleteOpen(true);
  };

  const setPolicyAction = (selectionElement: any): void => {
    history.push(`/groups/set-policies/${selectionElement}`);
  };

  const tableActions = [
    { type: "view", onClick: viewAction },
    { type: "description", onClick: setPolicyAction },
    { type: "delete", onClick: deleteAction }
  ];

  return (
    <React.Fragment>
      <PageHeader hasOptions setFilter={setFilter} />
      <Grid container>
        <Grid item xs={12} className={classes.pageContainer}>
          <Grid item xs={12} className={classes.actionsTray} paddingBottom={"1.5rem"}>
            <Grid item xs={12}>
            </Grid>

            <Button
              className={classes.addButton}
              variant="contained"
              color="primary"
              onClick={() => {
                viewAction(null);
              }}
            >
              <AddIcon />
            </Button>
          </Grid>

          {records.length > 0 ? <Grid item xs={12} flexGrow={1}>
            <TableWrapper
              itemActions={tableActions}
              columns={[{ label: "Name", elementKey: "", enableSort: true }]}
              isLoading={loading}
              records={filteredRecords}
              entityName="Groups"
              idField=""
            />
          </Grid> : (
            <Grid item xs={12}>
              <GroupHelpBox />
            </Grid>
          )}

        </Grid>
      </Grid>

      {deleteOpen && (
        <DeleteGroup
          deleteOpen={deleteOpen}
          selectedGroup={selectedGroup}
          closeDeleteModalAndRefresh={closeDeleteModalAndRefresh}
        />
      )}
    </React.Fragment>
  );
};

const mapDispatchToProps = {
  setErrorSnackMessage
};

const connector = connect(null, mapDispatchToProps);

export default withStyles(styles)(connector(Groups));
