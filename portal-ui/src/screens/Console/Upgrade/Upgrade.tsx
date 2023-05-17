// This file is part of MinIO Console Server
// Copyright (c) 2023 MinIO, Inc.
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
import {
  Button,
  DownloadStatIcon,
  Grid,
  HelpBox,
  Loader,
  MinIOTierIcon,
  PageHeader,
  SectionTitle,
  PageLayout,
} from "mds";
import { setErrorSnackMessage } from "../../../systemSlice";
import { useAppDispatch } from "../../../store";
import { hasPermission } from "../../../common/SecureComponent";
import {
  CONSOLE_UI_RESOURCE,
  IAM_SCOPES,
} from "../../../common/SecureComponent/permissions";
import api from "../../../common/api";
import { ErrorResponseHandler } from "../../../common/types";
import { Usage } from "../Dashboard/types";
import { ReactMarkdown } from "react-markdown/lib/react-markdown";
import UpgradeScreen from "./UpgradeScreen";
import { IReleaseItem, IReleaseResponse } from "./types";
import { DateTime } from "luxon";
import { registeredCluster } from "../../../config";
import { useNavigate } from "react-router-dom";
import RegisterCluster from "../Support/RegisterCluster";

const Upgrade = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [release, setRelease] = useState<IReleaseItem | null>(null);
  const [loadingReleases, setLoadingReleases] = useState<boolean>(false);
  const [initialLoading, seInitialLoading] = useState<boolean>(true);
  const [loadingCurrentRelease, setLoadingCurrentRelease] =
    useState<boolean>(true);
  const [currentRelease, setCurrentRelease] = useState<string>("");

  const clusterRegistered = registeredCluster();

  const canRetrieveReleases = hasPermission(CONSOLE_UI_RESOURCE, [
    IAM_SCOPES.ADMIN_SERVER_INFO,
  ]);

  const retrieveReleases = () => {
    if (!clusterRegistered) {
      navigate("/support/register");
      return;
    }
    setLoadingReleases(true);
  };

  if (clusterRegistered && initialLoading) {
    retrieveReleases();
    seInitialLoading(false);
  }

  useEffect(() => {
    if (loadingCurrentRelease) {
      api
        .invoke("GET", "/api/v1/admin/info")
        .then((res: Usage) => {
          if (res.servers.length > 0) {
            setCurrentRelease(res.servers[0].version.replaceAll(":", "-"));
          }

          setLoadingCurrentRelease(false);
        })
        .catch((err: ErrorResponseHandler) => {
          setLoadingCurrentRelease(false);
        });
    }
  }, [loadingCurrentRelease]);

  useEffect(() => {
    const loadReleases = () => {
      if (loadingReleases && canRetrieveReleases && currentRelease) {
        api
          .invoke(
            "GET",
            `/api/v1/releases?current=RELEASE.${currentRelease}&repo=minio`
          )
          .then((res: IReleaseResponse) => {
            const rel = res.results[0];

            let parts = rel.release_tag.split(".");
            let tag = parts.length > 1 ? parts[1] : "";

            const curReleaseSplit = currentRelease.split("T");
            const releaseUpdtSplit = tag.split("T");

            const currentReleaseReplacedDate = `${
              curReleaseSplit[0]
            }T${curReleaseSplit[1].split("-").join(":")}`;
            const currentTagReplacedDate = `${
              releaseUpdtSplit[0]
            }T${releaseUpdtSplit[1].split("-").join(":")}`;

            const currentTimeStamp = DateTime.fromISO(
              currentReleaseReplacedDate
            );
            const releaseToUpdate = DateTime.fromISO(currentTagReplacedDate);

            if (
              currentTimeStamp.toUnixInteger() >=
              releaseToUpdate.toUnixInteger()
            ) {
              setRelease(null);
            } else {
              setRelease(rel);
            }
            setLoadingReleases(false);
          })
          .catch((err: ErrorResponseHandler) => {
            dispatch(setErrorSnackMessage(err));
            setLoadingReleases(false);
          });
      }
    };

    loadReleases();
  }, [loadingReleases, canRetrieveReleases, currentRelease, dispatch]);

  const renderReleases = (r: IReleaseItem) => {
    let parts = r.release_tag.split(".");
    let tag = parts.length > 1 ? parts[1] : "";

    return (
      <Fragment>
        <p>There is a new version available!</p>
        <UpgradeScreen
          name={r.name}
          curatedDescription={""}
          releaseName={tag}
          releaseNotes={
            <Fragment>
              <ReactMarkdown>{r.release_notes}</ReactMarkdown>
            </Fragment>
          }
          detailedInformation={r.metrics}
          highlights={r.changes}
        />
      </Fragment>
    );
  };

  return (
    <Fragment>
      <PageHeader label={"Updates"} />
      <PageLayout>
        {loadingReleases || (loadingCurrentRelease && <Loader />)}
        {!clusterRegistered && <RegisterCluster compactMode />}
        <Fragment>
          <Grid item xs={12}>
            <SectionTitle
              separator
              actions={
                <Fragment>
                  <Button
                    id={"retrieve-releases"}
                    label={"Check for Updates"}
                    variant="regular"
                    icon={<DownloadStatIcon />}
                    onClick={retrieveReleases}
                    disabled={
                      !canRetrieveReleases ||
                      loadingReleases ||
                      loadingCurrentRelease
                    }
                  />
                </Fragment>
              }
            >
              {loadingCurrentRelease ? (
                <Loader style={{ width: 16, height: 16 }} />
              ) : (
                <span>
                  Current MinIO version: <strong>{currentRelease}</strong>
                </span>
              )}
            </SectionTitle>
          </Grid>
          {loadingReleases ? (
            <Grid
              item
              xs={12}
              sx={{ marginTop: 15, display: "flex", justifyContent: "center" }}
            >
              <Loader />
            </Grid>
          ) : (
            clusterRegistered && <Fragment>
              {release !== null ? (
                renderReleases(release)
              ) : (
                <Grid
                  item
                  xs={12}
                  sx={{
                    marginTop: 15,
                  }}
                >
                  <HelpBox
                    iconComponent={<MinIOTierIcon style={{ height: 40 }} />}
                    help={
                      "Thank you for using the latest version of MinIO, This version includes the latest fixes and improvements for your deployment."
                    }
                    title={"Your MinIO is up to date"}
                  />
                </Grid>
              )}
            </Fragment>
          )}
        </Fragment>
      </PageLayout>
    </Fragment>
  );
};

export default Upgrade;
