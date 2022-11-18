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

import React, { Fragment } from "react";
import { Theme } from "@mui/material/styles";
import createStyles from "@mui/styles/createStyles";
import withStyles from "@mui/styles/withStyles";
import {
  modalStyleUtils,
  serviceAccountStyles,
} from "../Common/FormComponents/common/styleLibrary";
import { NewServiceAccount } from "../Common/CredentialsPrompt/types";

const styles = (theme: Theme) =>
  createStyles({
    ...serviceAccountStyles,
    ...modalStyleUtils,
  });

interface IAddUserServiceAccountProps {
  classes: any;
  open: boolean;
  user: string;
  closeModalAndRefresh: (res: NewServiceAccount | null) => void;
}

const AddUserServiceAccount = ({
  classes,
  open,
  closeModalAndRefresh,
  user,
}: IAddUserServiceAccountProps) => {
  return <Fragment />;
};

export default withStyles(styles)(AddUserServiceAccount);
