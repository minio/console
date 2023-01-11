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

import React, { Fragment } from "react";

import Grid from "@mui/material/Grid";
import PageHeader from "../Common/PageHeader/PageHeader";
import BackLink from "../../../common/BackLink";
import { IAM_PAGES } from "../../../common/SecureComponent/permissions";
import { ErrorResponseHandler } from "../../../common/types";
import { setErrorSnackMessage } from "../../../systemSlice";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../../store";
import AddKeyForm from "./AddKeyForm";

const AddKey = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const onSuccess = () => navigate(`${IAM_PAGES.KMS_KEYS}`);

  const onError = (err: ErrorResponseHandler) =>
    dispatch(setErrorSnackMessage(err));

  return (
    <Fragment>
      <Grid item xs={12}>
        <PageHeader
          label={<BackLink to={IAM_PAGES.KMS_KEYS} label={"Keys"} />}
        />
        <AddKeyForm onError={onError} onSuccess={onSuccess} />
      </Grid>
    </Fragment>
  );
};

export default AddKey;
