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
import get from "lodash/get";
import { useSelector } from "react-redux";
import { Button, FormLayout, ReadBox, Grid, ProgressBar } from "mds";

import { ErrorResponseHandler } from "../../../common/types";
import { setModalErrorSnackMessage } from "../../../systemSlice";
import { AppState, useAppDispatch } from "../../../store";
import { modalStyleUtils } from "../Common/FormComponents/common/styleLibrary";
import { User } from "../Users/types";
import { setSelectedPolicies } from "../Users/AddUsersSlice";
import ModalWrapper from "../Common/ModalWrapper/ModalWrapper";
import PolicySelectors from "./PolicySelectors";
import api from "../../../common/api";

interface ISetPolicyProps {
  closeModalAndRefresh: () => void;
  selectedUser: User | null;
  selectedGroups: string[] | null;
  open: boolean;
}

const SetPolicy = ({
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
    (state: AppState) => state.createUser.selectedPolicies,
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
        .invoke("GET", `/api/v1/group/${encodeURIComponent(selectedGroups[0])}`)
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
      <FormLayout withBorders={false} containerPadding={false}>
        {(selectedGroups?.length === 1 || selectedUser != null) && (
          <Fragment>
            <ReadBox
              label={`Selected ${selectedGroups !== null ? "Group" : "User"}`}
              sx={{ width: "100%" }}
            >
              {selectedGroups !== null ? selectedGroups[0] : userName}
            </ReadBox>
            <ReadBox label={"Current Policy"} sx={{ width: "100%" }}>
              {actualPolicy.join(", ")}
            </ReadBox>
          </Fragment>
        )}
        {selectedGroups && selectedGroups?.length > 1 && (
          <ReadBox label={"Selected Groups"} sx={{ width: "100%" }}>
            {selectedGroups.join(", ")}
          </ReadBox>
        )}
        <Grid item xs={12}>
          <PolicySelectors selectedPolicy={selectedPolicy} />
        </Grid>
      </FormLayout>
      <Grid item xs={12} sx={modalStyleUtils.modalButtonBar}>
        <Button
          id={"reset"}
          type="button"
          variant="regular"
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
          <ProgressBar />
        </Grid>
      )}
    </ModalWrapper>
  );
};

export default SetPolicy;
