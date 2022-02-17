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
import { Theme } from "@mui/material/styles";
import { Menu, MenuItem } from "@mui/material";
import createStyles from "@mui/styles/createStyles";
import withStyles from "@mui/styles/withStyles";
import ListItemText from "@mui/material/ListItemText";
import ListItemIcon from "@mui/material/ListItemIcon";
import { UploadFolderIcon, UploadIcon } from "../../../../icons";
import RBIconButton from "../BucketDetails/SummaryItems/RBIconButton";
import { IAM_SCOPES } from "../../../../common/SecureComponent/permissions";
import { hasPermission } from "../../../../common/SecureComponent";

interface IUploadFilesButton {
  uploadPath: string;
  bucketName: string;
  forceDisable?: boolean;
  uploadFileFunction: (closeFunction: () => void) => void;
  uploadFolderFunction: (closeFunction: () => void) => void;
  classes: any;
}

const styles = (theme: Theme) =>
  createStyles({
    listUploadIcons: {
      height: 20,
      "& .min-icon": {
        width: 18,
        fill: "rgba(0,0,0,0.87)",
      },
    },
  });

const UploadFilesButton = ({
  uploadPath,
  bucketName,
  forceDisable = false,
  uploadFileFunction,
  uploadFolderFunction,
  classes,
}: IUploadFilesButton) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const openUploadMenu = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleCloseUpload = () => {
    setAnchorEl(null);
  };

  const uploadObjectAllowed = hasPermission(uploadPath, [
    IAM_SCOPES.S3_PUT_OBJECT,
  ]);
  const uploadFolderAllowed = hasPermission(
    bucketName,
    [IAM_SCOPES.S3_PUT_OBJECT],
    false,
    true
  );

  const uploadEnabled: boolean = uploadObjectAllowed || uploadFolderAllowed;

  return (
    <Fragment>
      <RBIconButton
        id={"upload-main"}
        tooltip={"Upload Files"}
        aria-controls={`upload-main-menu`}
        aria-haspopup="true"
        aria-expanded={openUploadMenu ? "true" : undefined}
        onClick={handleClick}
        text={"Upload"}
        icon={<UploadIcon />}
        color="primary"
        variant={"contained"}
        disabled={forceDisable || !uploadEnabled}
      />
      <Menu
        id={`upload-main-menu`}
        aria-labelledby={`upload-main`}
        anchorEl={anchorEl}
        open={openUploadMenu}
        onClose={() => {
          handleCloseUpload();
        }}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
      >
        <MenuItem
          onClick={() => {
            uploadFileFunction(handleCloseUpload);
          }}
          disabled={!uploadObjectAllowed || forceDisable}
        >
          <ListItemIcon className={classes.listUploadIcons}>
            <UploadIcon />
          </ListItemIcon>
          <ListItemText>Upload File</ListItemText>
        </MenuItem>
        <MenuItem
          onClick={() => {
            uploadFolderFunction(handleCloseUpload);
          }}
          disabled={!uploadFolderAllowed || forceDisable}
        >
          <ListItemIcon className={classes.listUploadIcons}>
            <UploadFolderIcon />
          </ListItemIcon>
          <ListItemText>Upload Folder</ListItemText>
        </MenuItem>
      </Menu>
    </Fragment>
  );
};

export default withStyles(styles)(UploadFilesButton);
