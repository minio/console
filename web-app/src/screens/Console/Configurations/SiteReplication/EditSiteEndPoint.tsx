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

import React, { useState } from "react";
import { Box, Button, EditIcon, Grid, InputBox, InputLabel } from "mds";
import ModalWrapper from "../../Common/ModalWrapper/ModalWrapper";
import useApi from "../../Common/Hooks/useApi";
import {
  setErrorSnackMessage,
  setSnackBarMessage,
} from "../../../../systemSlice";
import { useAppDispatch } from "../../../../store";
import { modalStyleUtils } from "../../Common/FormComponents/common/styleLibrary";
import styled from "styled-components";
import get from "lodash/get";

const SiteEndpointContainer = styled.div(({ theme }) => ({
  "& .alertText": {
    color: get(theme, "signalColors.danger", "#C51B3F"),
  },
}));

const EditSiteEndPoint = ({
  editSite = {},
  onClose,
  onComplete,
}: {
  editSite: any;
  onClose: () => void;
  onComplete: () => void;
}) => {
  const dispatch = useAppDispatch();
  const [editEndPointName, setEditEndPointName] = useState<string>("");

  const [isEditing, invokeSiteEditApi] = useApi(
    (res: any) => {
      if (res.success) {
        dispatch(setSnackBarMessage(res.status));
      } else {
        dispatch(
          setErrorSnackMessage({
            errorMessage: "Error",
            detailedError: res.status,
          }),
        );
      }
      onComplete();
    },
    (err: any) => {
      dispatch(setErrorSnackMessage(err));
      onComplete();
    },
  );

  const updatePeerSite = () => {
    invokeSiteEditApi("PUT", `api/v1/admin/site-replication`, {
      endpoint: editEndPointName,
      name: editSite.name,
      deploymentId: editSite.deploymentID, // readonly
    });
  };

  let isValidEndPointUrl = false;

  try {
    new URL(editEndPointName);
    isValidEndPointUrl = true;
  } catch (err) {
    isValidEndPointUrl = false;
  }

  return (
    <ModalWrapper
      title={`Edit Replication Endpoint `}
      modalOpen={true}
      titleIcon={<EditIcon />}
      onClose={onClose}
    >
      <SiteEndpointContainer>
        <Box
          sx={{
            display: "flex",
            flexFlow: "column",
            marginBottom: "15px",
          }}
        >
          <Box sx={{ marginBottom: "10px" }}>
            <strong>Site:</strong> {"  "}
            {editSite.name}
          </Box>
          <Box sx={{ marginBottom: "10px" }}>
            <strong>Current Endpoint:</strong> {"  "}
            {editSite.endpoint}
          </Box>
        </Box>

        <Grid item xs={12}>
          <InputLabel sx={{ marginBottom: 5 }}>New Endpoint:</InputLabel>
          <InputBox
            id="edit-rep-peer-endpoint"
            name="edit-rep-peer-endpoint"
            placeholder={"https://dr.minio-storage:9000"}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              setEditEndPointName(event.target.value);
            }}
            label=""
            value={editEndPointName}
          />
        </Grid>
        <Grid
          item
          xs={12}
          sx={{
            marginBottom: 15,
            fontStyle: "italic",
            display: "flex",
            alignItems: "center",
            fontSize: "12px",
            marginTop: 2,
          }}
        >
          <strong>Note:</strong>&nbsp;
          <span className={"alertText"}>
            Access Key and Secret Key should be same on the new site/endpoint.
          </span>
        </Grid>
      </SiteEndpointContainer>

      <Grid item xs={12} sx={modalStyleUtils.modalButtonBar}>
        <Button
          id={"close"}
          type="button"
          variant="regular"
          onClick={onClose}
          label={"Cancel"}
        />
        <Button
          id={"update"}
          type="button"
          variant="callAction"
          disabled={isEditing || !isValidEndPointUrl}
          onClick={updatePeerSite}
          label={"Update"}
        />
      </Grid>
    </ModalWrapper>
  );
};
export default EditSiteEndPoint;
