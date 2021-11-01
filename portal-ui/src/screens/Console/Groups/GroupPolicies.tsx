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
import { useParams } from "react-router";
import { Box, Button, Grid } from "@mui/material";
import PageHeader from "../Common/PageHeader/PageHeader";
import api from "../../../common/api";
import { useAsync } from "react-async-hook";
import PredefinedList from "../Common/FormComponents/PredefinedList/PredefinedList";
import PolicySelectors from "../Policies/PolicySelectors";
import { setModalErrorSnackMessage, setSnackBarMessage } from "../../../actions";
import { useDispatch } from "react-redux";
import { ErrorResponseHandler } from "../../../common/types";

import { GroupInfo, fetchGroupInfo, formatPolicy, getPoliciesAsString } from "./Utils";
import ReturnToGroups from "./ReturnToGroups";
import FormTitle from "./FormTitle";

import { Theme } from "@mui/material/styles";
import createStyles from "@mui/styles/createStyles";
import { actionsTray } from "../Common/FormComponents/common/styleLibrary";
import withStyles from "@mui/styles/withStyles";
import { groupPageStyles } from "./Styles";
import { IAMPoliciesIcon } from "../../../icons";


const styles = (theme: Theme) =>
  createStyles({
    ...actionsTray,
    ...groupPageStyles

  });

type GroupPoliciesProps = {
  classes?: any,
}

const GroupPolicies = ({ classes }: GroupPoliciesProps) => {

  const {
    groupName: selectedGroup
  } = useParams<{ groupName?: string }>();

  const {
    error,
    result = {},
    execute: refreshGroupInfo
  } = useAsync<GroupInfo>(fetchGroupInfo, [selectedGroup]);

  const dispatch = useDispatch();
  const [actualPolicy, setActualPolicy] = useState<string[]>([]);
  const [selectedPolicy, setSelectedPolicy] = useState<string[]>([]);
  const [saving, setSaving] = useState<boolean>(false);

  const {
    policy
  } = result as GroupInfo;

  if (error) {
    // @ts-ignore
    dispatch(setModalErrorSnackMessage(error));
  }

  const attachPolicyToGroup = () => {
    setSaving(true);
    api
      .invoke("PUT", `/api/v1/set-policy`, {
        entityName: selectedGroup,
        entityType: "group",
        name: selectedPolicy
      })
      .then(async () => {
        setSaving(false);
        await refreshGroupInfo(selectedGroup);
        dispatch(setSnackBarMessage(`Successfully saved.`));
      })
      .catch((err: ErrorResponseHandler) => {
        setSaving(false);
        setModalErrorSnackMessage(err);
      });
  };


  useEffect(() => {
    const formattedPolicy: string[] = formatPolicy(policy);
    setActualPolicy(formattedPolicy);
    setSelectedPolicy(formattedPolicy);
  }, [selectedGroup, policy]);


  const isSelectionChanged = getPoliciesAsString(actualPolicy) === getPoliciesAsString(selectedPolicy);

  return (
    <Fragment>
      <PageHeader
        label={
          <Fragment>
            Groups
          </Fragment>
        }
      />
      <Grid container>
        <Grid item xs={12} className={classes.pageContainer}>
          <ReturnToGroups />

          <Box className={classes.pageBox}>
            <FormTitle title={"Set policies"}
                       icon={<IAMPoliciesIcon />}
                       rightItems={null} />

            <Grid item xs={12} className={classes.fieldContainer}>
              <PredefinedList
                label={`Selected Group`}
                content={selectedGroup}
              />
            </Grid>
            <Grid item xs={12} className={classes.fieldContainer}>
              <PredefinedList
                label={"Current Policy"}
                content={actualPolicy.join(", ")}
              />
            </Grid>

            <Grid item xs={12}>
              <Box className={classes.sectionBox}>
                <PolicySelectors
                  classes={{
                    paper: classes.multiSelectorPaper,
                    tableBlock: classes.tableBlock,
                    multiSelectTable: classes.multiSelectTable,
                    filterField: classes.filterField
                  }}
                  selectedPolicy={selectedPolicy}
                  setSelectedPolicy={setSelectedPolicy}
                />
              </Box>
            </Grid>

            <Grid item xs={12} className={classes.buttonBar}>
              <Button
                type="button"
                color="primary"
                variant="outlined"
                onClick={() => {
                  setSelectedPolicy(actualPolicy);
                }}
              >
                Reset
              </Button>

              <Button
                type="button"
                variant="contained"
                color="primary"
                disabled={saving || isSelectionChanged}
                onClick={attachPolicyToGroup}
              >
                Save
              </Button>
            </Grid>
          </Box>
        </Grid>
      </Grid>
    </Fragment>

  );
};


export default withStyles(styles)(GroupPolicies);
