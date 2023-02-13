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
import { Box,  Tab, Tabs } from "@mui/material";
import {
  Button,
  DownloadStatIcon,
  Grid,
  PageHeader,
} from "mds";
import { useNavigate } from "react-router-dom";
import PageLayout from "../Common/Layout/PageLayout";
import { Theme } from "@mui/material/styles";
import createStyles from "@mui/styles/createStyles";
import withStyles from "@mui/styles/withStyles";
import { setErrorSnackMessage } from "../../../systemSlice";
import { useAppDispatch } from "../../../store";
import RegisterCluster from "../Support/RegisterCluster";
import { registeredCluster } from "../../../config";
import ScreenTitle from "../Common/ScreenTitle/ScreenTitle";
import { hasPermission } from "../../../common/SecureComponent";
import { CONSOLE_UI_RESOURCE, IAM_SCOPES, permissionTooltipHelper } from "../../../common/SecureComponent/permissions";
import TooltipWrapper from "../Common/TooltipWrapper/TooltipWrapper";
import VerticalTabs from "../Common/VerticalTabs/VerticalTabs";
import api from "../../../common/api";
import { ErrorResponseHandler } from "../../../common/types";
import { Usage } from "../Dashboard/types";
import { ReactMarkdown } from "react-markdown/lib/react-markdown";
import { TabPanel } from "../../shared/tabs";
import SearchBox from "../Common/SearchBox";

const styles = (theme: Theme) =>
  createStyles({
  });

const mdTabs = [
  {label: "Notes", field: "notesContent"},
  {label: "New Features", field: "newFeaturesContent"},
  {label: "Security", field: "securityContent"},
  {label: "Breaking Changes", field: "breakingChangesContent"},
];

const Releases = ({ classes }: { classes: any }) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [curTab, setCurTab] = useState<number>(0);
  const [releases, setReleases] = useState<Array<any>>([]);
  const [filterReleases, setFilterReleases] = useState<string>("");
  const [loadingReleases, setLoadingReleases] = useState<boolean>(false);
  const [initialLoading, seInitialLoading] = useState<boolean>(true);
  const [loadingCurrentRelease, setLoadingCurrentRelease] = useState<boolean>(true);
  const [currentRelease, setCurrentRelease] = useState<string>("");


  const clusterRegistered = registeredCluster();

  const canRetrieveReleases = hasPermission(
    CONSOLE_UI_RESOURCE,
    [IAM_SCOPES.ADMIN_SERVER_INFO],
  );

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
      console.log("loading releases", loadingReleases, canRetrieveReleases, currentRelease);
      if (loadingReleases && canRetrieveReleases && currentRelease) {
          api
            .invoke(
              "GET",
              `/api/v1/releases?current=${currentRelease}&repo=minio&filter=${filterReleases}`
            )
            .then((res: any) => {
              if (res.results) {
                res.results = res.results.reverse();
              }
              setReleases(res.results || []);
              setLoadingReleases(false);
            })
            .catch((err: ErrorResponseHandler) => {
              dispatch(setErrorSnackMessage(err));
              setLoadingReleases(false);
            });
        }
    };
  
    loadReleases();
  }, [loadingReleases, canRetrieveReleases, currentRelease, dispatch, filterReleases]);

  const renderReleases = () => {
    return releases.map((release: any, index) => {
      let releasesBehind = Math.abs(index - releases.length);
      let isLatest = index === 0;
      let metadata = release.metadata;
      let parts = metadata.tag_name.split(".");
      let tag = parts.length > 1 ? parts[1] : "";
      let filteredTabs = mdTabs.filter((tab) => release[tab.field]);
      return {
        tabConfig: { label: tag },
        content: (
          <Fragment key={tag}>
            <p>Your release <b>{currentRelease}</b> is <b>{releasesBehind}</b> releases behind {isLatest ? "the latest" : "" } <b>{tag}</b></p>
            <h2>{metadata.name}</h2>
            <Box
            sx={{
              maxHeight: "600px",
              overflow: "auto",
            }}
          >

            <ReactMarkdown >{release.contextContent}</ReactMarkdown>
          </Box>
            <Tabs
          value={curTab}
          onChange={(e: React.ChangeEvent<{}>, newValue: number) => {
            setCurTab(newValue);
          }}
          indicatorColor="primary"
          textColor="primary"
          aria-label="cluster-tabs"
          variant="scrollable"
          scrollButtons="auto"
        >
          {filteredTabs.map((mdTab, index) => {
            return (
              <Tab
                key={index}
                label={mdTab.label}
                id={`simple-tab-${index}`}
                aria-controls={`simple-tabpanel-${index}`}
              />
            );
          })}
        </Tabs>
        {filteredTabs.map((mdTab, index) => {
          return (
            <TabPanel key={index} index={index} value={curTab}>
          <Box
            sx={{
              border: "1px solid #eaeaea",
              borderRadius: "2px",
              display: "flex",
              flexFlow: "column",
              padding: "43px",
            }}
          >
            <ReactMarkdown >{release[mdTab.field]}</ReactMarkdown>
          </Box>
        </TabPanel>
          );

        })}
          </Fragment>
        ),
      }
    });
  };

  return (
    <Fragment>
      <PageHeader label={"Releases"} />
      <PageLayout >
        {!clusterRegistered && <RegisterCluster compactMode />}
        {currentRelease && 
        (
          <Fragment>

          
        <Grid item xs={12}>
          <ScreenTitle
            title={`Your Release: ${currentRelease}`}
            actions={
              <Fragment>
                {clusterRegistered && <SearchBox
              onChange={(v) => {
                setFilterReleases(v);
                setLoadingReleases(true);
              }}
              placeholder="Filter Releases"
              value={filterReleases}
            />}
                  <TooltipWrapper
                    tooltip={
                        permissionTooltipHelper(
                          [IAM_SCOPES.ADMIN_SERVER_INFO],
                            "retrieve releases"
                          )
                    }
                  >
                    <Button
                      id={"retrieve-releases"}
                      label={"Retrieve Releases"}
                      variant="regular"
                      icon={<DownloadStatIcon />}
                      onClick={retrieveReleases}
                      disabled={!canRetrieveReleases}
                    />
                  </TooltipWrapper>
              </Fragment>
            }
          />
        </Grid>
        {releases.length > 0 && 
        <Box
        sx={{
          maxHeight: "600px",
          overflow: "auto",
        }}>
        <VerticalTabs children={renderReleases()} />
        </Box>
        }
        </Fragment>)}
      </PageLayout>
    </Fragment>
  );
};

export default withStyles(styles)(Releases);
