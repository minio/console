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

import React, { useEffect, useState, Fragment } from "react";
import get from "lodash/get";
import { Theme } from "@mui/material/styles";
import { Button } from "mds";
import createStyles from "@mui/styles/createStyles";
import withStyles from "@mui/styles/withStyles";
import { LinearProgress } from "@mui/material";
import Grid from "@mui/material/Grid";
import {
  modalBasic,
  spacingUtils,
  tableStyles,
} from "../Common/FormComponents/common/styleLibrary";
import { User } from "../Users/types";

import { ErrorResponseHandler } from "../../../common/types";
import ModalWrapper from "../Common/ModalWrapper/ModalWrapper";
import api from "../../../common/api";
import PolicySelectors from "./PolicySelectors";
import PredefinedList from "../Common/FormComponents/PredefinedList/PredefinedList";
import { encodeURLString } from "../../../common/utils";
import { setModalErrorSnackMessage } from "../../../systemSlice";
import { AppState, useAppDispatch } from "../../../store";

import { useSelector } from "react-redux";
import { setSelectedPolicies } from "../Users/AddUsersSlice";

interface ISetPolicyProps {
  classes: any;
  closeModalAndRefresh: () => void;
  selectedUser: User | null;
  selectedGroups: string[] | null;
  open: boolean;
}

const styles = (theme: Theme) =>
  createStyles({
    ...modalBasic,
    ...spacingUtils,
    tableBlock: {
      ...tableStyles.tableBlock,
      marginTop: 15,
    },
    buttonContainer: {
      display: "flex",
      justifyContent: "flex-end",
      marginTop: ".9rem",
      "& button": {
        marginLeft: 8,
      },
    },
  });

const SetPolicy = ({
  classes,
  closeModalAndRefresh,
  selectedUser,
  selectedGroups,
  open,
}: ISetPolicyProps) => {
  const dispatch = useAppDispatch();
  //Local States
  const [loading, setLoading] = useState<boolean>(false);
  const [actualPolicy, setActualPolicy] = useState<string[]>([]);
  const [selectedPolicy, setSelectedPolicy] = useState<string[]>([]);
  const currentPolicies = useSelector(
    (state: AppState) => state.createUser.selectedPolicies
  );
  const setPolicyAction = () => {
    let users = null;
    let groups = null;
    if (selectedGroups !== null) {
      groups = selectedGroups;
    } else {
      if (selectedUser !== null) {
        users = [selectedUser.accessKey] || [" "];
      }
    }

    setLoading(true);

    api
      .invoke("PUT", `/api/v1/set-policy-multi`, {
        name: currentPolicies,
        groups: groups,
        users: users,
      })
      .then(() => {
        setLoading(false);
        closeModalAndRefresh();
      })
      .catch((err: ErrorResponseHandler) => {
        setLoading(false);
        dispatch(setModalErrorSnackMessage(err));
      });
  };

  const fetchGroupInformation = () => {
    if (selectedGroups?.length === 1) {
      api
        .invoke("GET", `/api/v1/group/${encodeURLString(selectedGroups[0])}`)
        .then((res: any) => {
          const groupPolicy: String = get(res, "policy", "");
          setActualPolicy(groupPolicy.split(","));
          setSelectedPolicy(groupPolicy.split(","));
          dispatch(setSelectedPolicies(groupPolicy.split(",")));
        })
        .catch((err: ErrorResponseHandler) => {
          dispatch(setModalErrorSnackMessage(err));
          setLoading(false);
        });
    }
  };

  const resetSelection = () => {
    setSelectedPolicy(actualPolicy);
    dispatch(setSelectedPolicies(actualPolicy));
  };

  useEffect(() => {
    if (open) {
      if (selectedGroups?.length === 1) {
        fetchGroupInformation();
        return;
      }

      const userPolicy: string[] = get(selectedUser, "policy", []);
      setActualPolicy(userPolicy);
      setSelectedPolicy(userPolicy);
      dispatch(setSelectedPolicies(userPolicy));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, selectedGroups?.length, selectedUser]);

  const userName = get(selectedUser, "accessKey", "");

  return (
    <ModalWrapper
      onClose={() => {
        closeModalAndRefresh();
      }}
      modalOpen={open}
      title="Set Policies"
    >
      <Grid container>
        {(selectedGroups?.length === 1 || selectedUser != null) && (
          <Fragment>
            <Grid item xs={12}>
              <PredefinedList
                label={`Selected ${selectedGroups !== null ? "Group" : "User"}`}
                content={selectedGroups !== null ? selectedGroups[0] : userName}
              />
            </Grid>
            <Grid item xs={12}>
              <PredefinedList
                label={"Current Policy"}
                content={actualPolicy.join(", ")}
              />
            </Grid>
          </Fragment>
        )}
        {selectedGroups && selectedGroups?.length > 1 && (
          <PredefinedList
            label={"Selected Groups"}
            content={selectedGroups.join(", ")}
          />
        )}
        <Grid item xs={12}>
          <div className={classes.tableBlock}>
            <PolicySelectors selectedPolicy={selectedPolicy} />
          </div>
        </Grid>
      </Grid>
      <Grid item xs={12} className={classes.buttonContainer}>
        <Button
          id={"reset"}
          type="button"
          variant="regular"
          className={classes.spacerRight}
          onClick={resetSelection}
          label={"Reset"}
        />
        <Button
          id={"save"}
          type="button"
          variant="callAction"
          color="primary"
          disabled={loading}
          onClick={setPolicyAction}
          label={"Save"}
        />
      </Grid>
      {loading && (
        <Grid item xs={12}>
          <LinearProgress />
        </Grid>
      )}
    </ModalWrapper>
  );
};

export default withStyles(styles)(SetPolicy);
