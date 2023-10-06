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
import {
  Box,
  Button,
  FormLayout,
  IAMPoliciesIcon,
  ProgressBar,
  Grid,
} from "mds";
import { useSelector } from "react-redux";
import { modalStyleUtils } from "../Common/FormComponents/common/styleLibrary";
import { IPolicyItem } from "../Users/types";
import { ErrorResponseHandler } from "../../../common/types";
import { setModalErrorSnackMessage } from "../../../systemSlice";
import { AppState, useAppDispatch } from "../../../store";
import { setSelectedPolicies } from "./AddUsersSlice";
import ModalWrapper from "../Common/ModalWrapper/ModalWrapper";
import api from "../../../common/api";
import PolicySelectors from "../Policies/PolicySelectors";

interface ISetUserPoliciesProps {
  closeModalAndRefresh: () => void;
  selectedUser: string;
  currentPolicies: IPolicyItem[];
  open: boolean;
}

const SetUserPolicies = ({
  closeModalAndRefresh,
  selectedUser,
  currentPolicies,
  open,
}: ISetUserPoliciesProps) => {
  const dispatch = useAppDispatch();
  //Local States
  const [loading, setLoading] = useState<boolean>(false);
  const [actualPolicy, setActualPolicy] = useState<string[]>([]);

  const statePolicies = useSelector(
    (state: AppState) => state.createUser.selectedPolicies,
  );

  const SetUserPoliciesAction = () => {
    let entity = "user";
    let value = selectedUser;

    setLoading(true);

    api
      .invoke("PUT", `/api/v1/set-policy`, {
        name: statePolicies,
        entityName: value,
        entityType: entity,
      })
      .then(() => {
        setLoading(false);
        dispatch(setSelectedPolicies([]));
        closeModalAndRefresh();
      })
      .catch((err: ErrorResponseHandler) => {
        setLoading(false);
        dispatch(setModalErrorSnackMessage(err));
      });
  };

  const resetSelection = () => {
    dispatch(setSelectedPolicies(actualPolicy));
  };

  useEffect(() => {
    if (open) {
      const userPolicy: string[] = currentPolicies.map((pol) => {
        return pol.policy;
      });
      setActualPolicy(userPolicy);
      dispatch(setSelectedPolicies(userPolicy));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, selectedUser]);

  return (
    <ModalWrapper
      onClose={() => {
        closeModalAndRefresh();
      }}
      modalOpen={open}
      title="Set Policies"
      titleIcon={<IAMPoliciesIcon />}
    >
      <FormLayout withBorders={false} containerPadding={false}>
        <PolicySelectors selectedPolicy={statePolicies} />
      </FormLayout>
      <Box sx={modalStyleUtils.modalButtonBar}>
        <Button
          id={"reset-user-policies"}
          type="button"
          variant="regular"
          color="primary"
          onClick={resetSelection}
          label={"Reset"}
        />
        <Button
          id={"save-user-policy"}
          type="button"
          variant="callAction"
          color="primary"
          disabled={loading}
          onClick={SetUserPoliciesAction}
          label={"Save"}
        />
      </Box>
      {loading && (
        <Grid item xs={12}>
          <ProgressBar />
        </Grid>
      )}
    </ModalWrapper>
  );
};

export default SetUserPolicies;
