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
import { useNavigate } from "react-router-dom";
import {
  ActionLink,
  AddIcon,
  Box,
  Button,
  ClustersIcon,
  ConfirmDeleteIcon,
  Grid,
  HelpBox,
  Loader,
  PageLayout,
  RecoverIcon,
  SectionTitle,
  TrashIcon,
} from "mds";
import { ErrorResponseHandler } from "../../../../common/types";
import { IAM_PAGES } from "../../../../common/SecureComponent/permissions";
import {
  setErrorSnackMessage,
  setHelpName,
  setSnackBarMessage,
} from "../../../../systemSlice";
import { useAppDispatch } from "../../../../store";
import ConfirmDialog from "../../Common/ModalWrapper/ConfirmDialog";
import useApi from "../../Common/Hooks/useApi";
import ReplicationSites from "./ReplicationSites";
import TooltipWrapper from "../../Common/TooltipWrapper/TooltipWrapper";
import PageHeaderWrapper from "../../Common/PageHeaderWrapper/PageHeaderWrapper";
import HelpMenu from "../../HelpMenu";

export type ReplicationSite = {
  deploymentID: string;
  endpoint: string;
  name: string;
  isCurrent?: boolean;
};

const SiteReplication = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

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
    },
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
    },
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

  useEffect(() => {
    dispatch(setHelpName("site-replication"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Fragment>
      <PageHeaderWrapper label={"Site Replication"} actions={<HelpMenu />} />
      <PageLayout>
        <SectionTitle
          separator={!!hasSites}
          sx={{ marginBottom: 15 }}
          actions={
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-end",
                gap: 8,
              }}
            >
              {hasSites ? (
                <Fragment>
                  <TooltipWrapper tooltip={"Delete All"}>
                    <Button
                      id={"delete-all"}
                      label={"Delete All"}
                      variant="secondary"
                      disabled={isRemoving}
                      icon={<TrashIcon />}
                      onClick={() => {
                        setIsDeleteAll(true);
                      }}
                    />
                  </TooltipWrapper>
                  <TooltipWrapper tooltip={"Replication Status"}>
                    <Button
                      id={"replication-status"}
                      label={"Replication Status"}
                      variant="regular"
                      icon={<RecoverIcon />}
                      onClick={(e) => {
                        e.preventDefault();
                        navigate(IAM_PAGES.SITE_REPLICATION_STATUS);
                      }}
                    />
                  </TooltipWrapper>
                </Fragment>
              ) : null}
              <TooltipWrapper tooltip={"Add Replication Sites"}>
                <Button
                  id={"add-replication-site"}
                  label={"Add Sites"}
                  variant="callAction"
                  disabled={isRemoving}
                  icon={<AddIcon />}
                  onClick={() => {
                    navigate(IAM_PAGES.SITE_REPLICATION_ADD);
                  }}
                />
              </TooltipWrapper>
            </Box>
          }
        >
          {hasSites ? "List of Replicated Sites" : ""}
        </SectionTitle>
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
          <Grid container>
            <Grid item xs={8}>
              <HelpBox
                title={"Site Replication"}
                iconComponent={<ClustersIcon />}
                help={
                  <Fragment>
                    This feature allows multiple independent MinIO sites (or
                    clusters) that are using the same external IDentity Provider
                    (IDP) to be configured as replicas.
                    <br />
                    <br />
                    To get started,{" "}
                    <ActionLink
                      isLoading={false}
                      label={""}
                      onClick={() => {
                        navigate(IAM_PAGES.SITE_REPLICATION_ADD);
                      }}
                    >
                      Add a Replication Site
                    </ActionLink>
                    .
                    <br />
                    You can learn more at our{" "}
                    <a
                      href="https://min.io/docs/minio/linux/operations/install-deploy-manage/multi-site-replication.html?ref=con"
                      target="_blank"
                      rel="noopener"
                    >
                      documentation
                    </a>
                    .
                  </Fragment>
                }
              />
            </Grid>
          </Grid>
        ) : null}
        {hasSites && !isSiteInfoLoading ? (
          <HelpBox
            title={"Site Replication"}
            iconComponent={<ClustersIcon />}
            help={
              <Fragment>
                This feature allows multiple independent MinIO sites (or
                clusters) that are using the same external IDentity Provider
                (IDP) to be configured as replicas. In this situation the set of
                replica sites are referred to as peer sites or just sites.
                <br />
                <br />
                Initially, only one of the sites added for replication may have
                data. After site-replication is successfully configured, this
                data is replicated to the other (initially empty) sites.
                Subsequently, objects may be written to any of the sites, and
                they will be replicated to all other sites.
                <br />
                <br />
                All sites must have the same deployment credentials (i.e.
                MINIO_ROOT_USER, MINIO_ROOT_PASSWORD).
                <br />
                <br />
                All sites must be using the same external IDP(s) if any.
                <br />
                <br />
                For SSE-S3 or SSE-KMS encryption via KMS, all sites must have
                access to a central KMS deployment server.
                <br />
                <br />
                You can learn more at our{" "}
                <a
                  href="https://github.com/minio/minio/tree/master/docs/site-replication?ref=con"
                  target="_blank"
                  rel="noopener"
                >
                  documentation
                </a>
                .
              </Fragment>
            }
          />
        ) : null}

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
              <Fragment>
                Are you sure you want to remove all the replication sites?.
              </Fragment>
            }
          />
        ) : null}
      </PageLayout>
    </Fragment>
  );
};

export default SiteReplication;
