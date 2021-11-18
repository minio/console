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
import { Button, LinearProgress } from "@mui/material";
import Grid from "@mui/material/Grid";
import { modalBasic } from "../Common/FormComponents/common/styleLibrary";
import { IPolicyItem } from "../Users/types";
import { setModalErrorSnackMessage } from "../../../actions";
import { ErrorResponseHandler } from "../../../common/types";
import ModalWrapper from "../Common/ModalWrapper/ModalWrapper";
import api from "../../../common/api";
import PolicySelectors from "../Policies/PolicySelectors";

interface ISetUserPoliciesProps {
  classes: any;
  closeModalAndRefresh: () => void;
  selectedUser: string;
  currentPolicies: IPolicyItem[];
  open: boolean;
  setModalErrorSnackMessage: typeof setModalErrorSnackMessage;
}

const styles = (theme: Theme) =>
  createStyles({
    ...modalBasic,
    buttonContainer: {
      textAlign: "right",
      marginTop: ".9rem",
    },
  });

const SetUserPolicies = ({
  classes,
  closeModalAndRefresh,
  selectedUser,
  currentPolicies,
  setModalErrorSnackMessage,
  open,
}: ISetUserPoliciesProps) => {
  //Local States
  const [loading, setLoading] = useState<boolean>(false);
  const [actualPolicy, setActualPolicy] = useState<string[]>([]);
  const [selectedPolicy, setSelectedPolicy] = useState<string[]>([]);

  const SetUserPoliciesAction = () => {
    let entity = "user";
    let value = selectedUser;

    setLoading(true);

    api
      .invoke("PUT", `/api/v1/set-policy`, {
        name: selectedPolicy,
        entityName: value,
        entityType: entity,
      })
      .then(() => {
        setLoading(false);
        closeModalAndRefresh();
      })
      .catch((err: ErrorResponseHandler) => {
        setLoading(false);
        setModalErrorSnackMessage(err);
      });
  };

  const resetSelection = () => {
    setSelectedPolicy(actualPolicy);
  };

  useEffect(() => {
    if (open) {
      const userPolicy: string[] = [];
      for (let pol of currentPolicies) {
        userPolicy.push(pol.policy);
      }
      setActualPolicy(userPolicy);
      setSelectedPolicy(userPolicy);
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
    >
      <PolicySelectors
        selectedPolicy={selectedPolicy}
        setSelectedPolicy={setSelectedPolicy}
      />
      <Grid item xs={12}>
        <br />
      </Grid>
      <Grid item xs={12} className={classes.buttonContainer}>
        <button
          type="button"
          color="primary"
          className={classes.clearButton}
          onClick={resetSelection}
        >
          Reset
        </button>
        <Button
          type="button"
          variant="contained"
          color="primary"
          disabled={loading}
          onClick={SetUserPoliciesAction}
        >
          Save
        </Button>
      </Grid>
      {loading && (
        <Grid item xs={12}>
          <LinearProgress />
        </Grid>
      )}
    </ModalWrapper>
  );
};

const mapDispatchToProps = {
  setModalErrorSnackMessage,
};

const connector = connect(null, mapDispatchToProps);

export default withStyles(styles)(connector(SetUserPolicies));
