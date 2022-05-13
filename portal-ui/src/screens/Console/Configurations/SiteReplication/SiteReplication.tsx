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

import React, { Fragment, useEffect, useState } from "react";
import PageHeader from "../../Common/PageHeader/PageHeader";
import PageLayout from "../../Common/Layout/PageLayout";
import { Box, DialogContentText } from "@mui/material";
import useApi from "../../Common/Hooks/useApi";
import ReplicationSites from "./ReplicationSites";
import TrashIcon from "../../../../icons/TrashIcon";
import RBIconButton from "../../Buckets/BucketDetails/SummaryItems/RBIconButton";
import Loader from "../../Common/Loader/Loader";
import {
  AddIcon,
  ClustersIcon,
  ConfirmDeleteIcon,
  RecoverIcon,
} from "../../../../icons";
import { useDispatch } from "react-redux";
import { ErrorResponseHandler } from "../../../../common/types";
import HelpBox from "../../../../common/HelpBox";
import ConfirmDialog from "../../Common/ModalWrapper/ConfirmDialog";
import history from "../../../../history";
import { IAM_PAGES } from "../../../../common/SecureComponent/permissions";
import {
  setErrorSnackMessage,
  setSnackBarMessage,
} from "../../../../systemSlice";

export type ReplicationSite = {
  deploymentID: string;
  endpoint: string;
  name: string;
  isCurrent?: boolean;
};

const SiteReplication = () => {
  const dispatch = useDispatch();
  const [sites, setSites] = useState([]);

  const [deleteAll, setIsDeleteAll] = useState(false);
  const [isSiteInfoLoading, invokeSiteInfoApi] = useApi(
    (res: any) => {
      const { sites: siteList, name: curSiteName } = res;
      // current site name to be the fist one.
      const foundIdx = siteList.findIndex((el: any) => el.name === curSiteName);
      if (foundIdx !== -1) {
        let curSite = siteList[foundIdx];
        curSite = {
          ...curSite,
          isCurrent: true,
        };
        siteList.splice(foundIdx, 1, curSite);
      }

      siteList.sort((x: any, y: any) => {
        return x.name === curSiteName ? -1 : y.name === curSiteName ? 1 : 0;
      });
      setSites(siteList);
    },
    (err: any) => {
      setSites([]);
    }
  );

  const getSites = () => {
    invokeSiteInfoApi("GET", `api/v1/admin/site-replication`);
  };

  const [isRemoving, invokeSiteRemoveApi] = useApi(
    (res: any) => {
      setIsDeleteAll(false);
      dispatch(setSnackBarMessage(`Successfully deleted.`));
      getSites();
    },
    (err: ErrorResponseHandler) => {
      dispatch(setErrorSnackMessage(err));
    }
  );

  const removeSites = (isAll: boolean = false, delSites: string[] = []) => {
    invokeSiteRemoveApi("DELETE", `api/v1/admin/site-replication`, {
      all: isAll,
      sites: delSites,
    });
  };

  useEffect(() => {
    getSites();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const hasSites = sites?.length;

  return (
    <Fragment>
      <PageHeader label={"Site Replication"} />
      <PageLayout>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
          }}
        >
          {hasSites ? (
            <Box>
              <RBIconButton
                tooltip={"Delete All"}
                text={"Delete All"}
                variant="outlined"
                color="secondary"
                disabled={isRemoving}
                icon={<TrashIcon />}
                onClick={() => {
                  setIsDeleteAll(true);
                }}
              />
              <RBIconButton
                tooltip={"Replication Status"}
                text={"Replication Status"}
                variant="outlined"
                color="primary"
                icon={<RecoverIcon />}
                onClick={(e) => {
                  e.preventDefault();
                  history.push(IAM_PAGES.SITE_REPLICATION_STATUS);
                }}
              />
            </Box>
          ) : null}
          <RBIconButton
            tooltip={"Add Replication Sites"}
            text={"Add Sites"}
            variant="contained"
            color="primary"
            disabled={isRemoving}
            icon={<AddIcon />}
            onClick={() => {
              history.push(IAM_PAGES.SITE_REPLICATION_ADD);
            }}
          />
        </Box>
        {hasSites ? (
          <ReplicationSites
            sites={sites}
            onDeleteSite={removeSites}
            onRefresh={getSites}
          />
        ) : null}
        {isSiteInfoLoading ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "calc( 100vh - 450px )",
            }}
          >
            <Loader style={{ width: 16, height: 16 }} />
          </Box>
        ) : null}
        {!hasSites && !isSiteInfoLoading ? (
          <Box
            sx={{
              padding: "30px",
              border: "1px solid #eaeaea",
              marginTop: "15px",
              marginBottom: "15px",
              height: "calc( 100vh - 450px )",
            }}
          >
            Site Replication is not configured.
          </Box>
        ) : null}

        <HelpBox
          title={"Site Replication"}
          iconComponent={<ClustersIcon />}
          help={
            <Fragment>
              This feature allows multiple independent MinIO sites (or clusters)
              that are using the same external IDentity Provider (IDP) to be
              configured as replicas. In this situation the set of replica sites
              are referred to as peer sites or just sites.
              <br />
              <Box>
                <ul>
                  <li>
                    Initially, only one of the sites added for replication may
                    have data. After site-replication is successfully
                    configured, this data is replicated to the other (initially
                    empty) sites. Subsequently, objects may be written to any of
                    the sites, and they will be replicated to all other sites.
                  </li>
                  <li>
                    All sites must have the same deployment credentials (i.e.
                    MINIO_ROOT_USER, MINIO_ROOT_PASSWORD).
                  </li>
                  <li>
                    All sites must be using the same external IDP(s) if any.
                  </li>
                  <li>
                    For SSE-S3 or SSE-KMS encryption via KMS, all sites must
                    have access to a central KMS deployment. server.
                  </li>
                </ul>
              </Box>
              <br />
              You can learn more at our{" "}
              <a
                href="https://github.com/minio/minio/tree/master/docs/site-replication?ref=con"
                target="_blank"
                rel="noreferrer"
              >
                documentation
              </a>
              .
            </Fragment>
          }
        />

        {deleteAll ? (
          <ConfirmDialog
            title={`Delete All`}
            confirmText={"Delete"}
            isOpen={true}
            titleIcon={<ConfirmDeleteIcon />}
            isLoading={false}
            onConfirm={() => {
              const siteNames = sites.map((s: any) => s.name);
              removeSites(true, siteNames);
            }}
            onClose={() => {
              setIsDeleteAll(false);
            }}
            confirmationContent={
              <DialogContentText>
                Are you sure you want to remove all the replication sites?.
              </DialogContentText>
            }
          />
        ) : null}
      </PageLayout>
    </Fragment>
  );
};

export default SiteReplication;
