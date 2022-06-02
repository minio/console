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
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { Theme } from "@mui/material/styles";
import createStyles from "@mui/styles/createStyles";
import { Paper } from "@mui/material";
import { ErrorResponseHandler } from "../../../../common/types";
import TableWrapper from "../../Common/TableWrapper/TableWrapper";
import api from "../../../../common/api";

import AddIcon from "../../../../icons/AddIcon";
import Grid from "@mui/material/Grid";
import {
  actionsTray,
  containerForHeader,
  objectBrowserCommon,
  searchField,
  tableStyles,
} from "../../Common/FormComponents/common/styleLibrary";
import { IAM_SCOPES } from "../../../../common/SecureComponent/permissions";
import PanelTitle from "../../Common/PanelTitle/PanelTitle";
import {
  hasPermission,
  SecureComponent,
} from "../../../../common/SecureComponent";

import withSuspense from "../../Common/Components/withSuspense";
import RBIconButton from "./SummaryItems/RBIconButton";
import { setErrorSnackMessage } from "../../../../systemSlice";
import makeStyles from "@mui/styles/makeStyles";
import { selBucketDetailsLoading } from "./bucketDetailsSlice";

const AddAccessRuleModal = withSuspense(
  React.lazy(() => import("./AddAccessRule"))
);
const DeleteAccessRuleModal = withSuspense(
  React.lazy(() => import("./DeleteAccessRule"))
);
const EditAccessRuleModal = withSuspense(
  React.lazy(() => import("./EditAccessRule"))
);

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    "@global": {
      ".rowLine:hover  .iconFileElm": {
        backgroundImage: "url(/images/ob_file_filled.svg)",
      },
      ".rowLine:hover  .iconFolderElm": {
        backgroundImage: "url(/images/ob_folder_filled.svg)",
      },
    },
    ...tableStyles,
    ...actionsTray,
    ...searchField,
    ...objectBrowserCommon,
    ...containerForHeader(theme.spacing(4)),
  })
);

const AccessRule = () => {
  const dispatch = useDispatch();
  const classes = useStyles();
  const params = useParams();

  const loadingBucket = useSelector(selBucketDetailsLoading);

  const [loadingAccessRules, setLoadingAccessRules] = useState<boolean>(true);
  const [accessRules, setAccessRules] = useState([]);
  const [addAccessRuleOpen, setAddAccessRuleOpen] = useState<boolean>(false);
  const [deleteAccessRuleOpen, setDeleteAccessRuleOpen] =
    useState<boolean>(false);
  const [accessRuleToDelete, setAccessRuleToDelete] = useState<string>("");
  const [editAccessRuleOpen, setEditAccessRuleOpen] = useState<boolean>(false);
  const [accessRuleToEdit, setAccessRuleToEdit] = useState<string>("");
  const [initialAccess, setInitialAccess] = useState<string>("");

  const bucketName = params.bucketName || "";

  const displayAccessRules = hasPermission(bucketName, [
    IAM_SCOPES.S3_GET_BUCKET_POLICY,
  ]);

  const deleteAccessRules = hasPermission(bucketName, [
    IAM_SCOPES.S3_DELETE_BUCKET_POLICY,
  ]);

  const editAccessRules = hasPermission(bucketName, [
    IAM_SCOPES.S3_PUT_BUCKET_POLICY,
  ]);

  useEffect(() => {
    if (loadingBucket) {
      setLoadingAccessRules(true);
    }
  }, [loadingBucket, setLoadingAccessRules]);

  const AccessRuleActions = [
    {
      type: "delete",
      disableButtonFunction: () => !deleteAccessRules,
      onClick: (accessRule: any) => {
        setDeleteAccessRuleOpen(true);
        setAccessRuleToDelete(accessRule.prefix);
      },
    },
    {
      type: "view",
      disableButtonFunction: () => !editAccessRules,
      onClick: (accessRule: any) => {
        setAccessRuleToEdit(accessRule.prefix);
        setInitialAccess(accessRule.access);
        setEditAccessRuleOpen(true);
      },
    },
  ];

  useEffect(() => {
    if (loadingAccessRules) {
      if (displayAccessRules) {
        api
          .invoke("GET", `/api/v1/bucket/${bucketName}/access-rules`)
          .then((res: any) => {
            setAccessRules(res.accessRules);
            setLoadingAccessRules(false);
          })
          .catch((err: ErrorResponseHandler) => {
            dispatch(setErrorSnackMessage(err));
            setLoadingAccessRules(false);
          });
      } else {
        setLoadingAccessRules(false);
      }
    }
  }, [loadingAccessRules, dispatch, displayAccessRules, bucketName]);

  const closeAddAccessRuleModal = () => {
    setAddAccessRuleOpen(false);
    setLoadingAccessRules(true);
  };

  const closeDeleteAccessRuleModal = () => {
    setDeleteAccessRuleOpen(false);
    setLoadingAccessRules(true);
  };

  const closeEditAccessRuleModal = () => {
    setEditAccessRuleOpen(false);
    setLoadingAccessRules(true);
  };

  return (
    <Fragment>
      {addAccessRuleOpen && (
        <AddAccessRuleModal
          modalOpen={addAccessRuleOpen}
          onClose={closeAddAccessRuleModal}
          bucket={bucketName}
        />
      )}
      {deleteAccessRuleOpen && (
        <DeleteAccessRuleModal
          modalOpen={deleteAccessRuleOpen}
          onClose={closeDeleteAccessRuleModal}
          bucket={bucketName}
          toDelete={accessRuleToDelete}
        />
      )}
      {editAccessRuleOpen && (
        <EditAccessRuleModal
          modalOpen={editAccessRuleOpen}
          onClose={closeEditAccessRuleModal}
          bucket={bucketName}
          toEdit={accessRuleToEdit}
          initial={initialAccess}
        />
      )}
      <Grid item xs={12} className={classes.actionsTray}>
        <PanelTitle>Access Rules</PanelTitle>
        <SecureComponent
          scopes={[
            IAM_SCOPES.S3_GET_BUCKET_POLICY,
            IAM_SCOPES.S3_PUT_BUCKET_POLICY,
          ]}
          resource={bucketName}
          matchAll
          errorProps={{ disabled: true }}
        >
          <RBIconButton
            tooltip={"Add Access Rule"}
            onClick={() => {
              setAddAccessRuleOpen(true);
            }}
            text={"Add Access Rule"}
            icon={<AddIcon />}
            color="primary"
            variant={"contained"}
          />
        </SecureComponent>
      </Grid>
      <Paper className={classes.tableBlock}>
        <SecureComponent
          scopes={[IAM_SCOPES.S3_GET_BUCKET_POLICY]}
          resource={bucketName}
          errorProps={{ disabled: true }}
        >
          <TableWrapper
            noBackground={true}
            itemActions={AccessRuleActions}
            columns={[
              { label: "Prefix", elementKey: "prefix" },
              { label: "Access", elementKey: "access" },
            ]}
            isLoading={loadingAccessRules}
            records={accessRules}
            entityName="Access Rules"
            idField="prefix"
          />
        </SecureComponent>
      </Paper>
    </Fragment>
  );
};

export default AccessRule;
