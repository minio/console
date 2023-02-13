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

import React, { useState } from "react";
import { Box, Button, Grid, HelpBox, MinIOTierIcon, SectionTitle } from "mds";
import { helpInformationGenerator } from "./utils";
import { IReleaseChanges, IReleaseMetrics } from "./types";
import UpgradeConfirm from "./UpgradeConfirm";
import { useSelector } from "react-redux";
import { AppState } from "../../../store";
import TooltipWrapper from "../Common/TooltipWrapper/TooltipWrapper";

interface IUpgradeScreen {
  name: string;
  releaseName: string;
  releaseNotes?: React.ReactNode;
  curatedDescription?: string;
  detailedInformation?: IReleaseMetrics;
  highlights?: IReleaseChanges[];
}

const UpgradeScreen = ({
  name,
  releaseName,
  releaseNotes,
  curatedDescription,
  detailedInformation,
  highlights,
}: IUpgradeScreen) => {
  const isK8S = useSelector((state: AppState) => state.login.isK8S);

  const [displayNotes, setDisplayNotes] = useState<boolean>(false);
  const [upgradeConfirmOpen, setUpgradeConfirmOpen] = useState<boolean>(false);

  const helpInformation =
    curatedDescription && curatedDescription !== ""
      ? curatedDescription
      : helpInformationGenerator(name);

  const openModeInformation = () => {
    setDisplayNotes(!displayNotes);
  };

  const hasSecurityFixes =
    detailedInformation?.security && detailedInformation?.security > 0;
  const hasBugFixes =
    detailedInformation?.bug_fixes && detailedInformation?.bug_fixes > 0;
  const hasNewFeatures =
    detailedInformation?.new_feature && detailedInformation?.new_feature > 0;
  const hasChanges =
    detailedInformation?.changes && detailedInformation?.changes > 0;

  const closeConfirmOpen = (reload: boolean) => {
    setUpgradeConfirmOpen(false);

    if (reload) {
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    }
  };

  return (
    <Grid container>
      {upgradeConfirmOpen && (
        <UpgradeConfirm
          confirmOpen={upgradeConfirmOpen}
          onClose={closeConfirmOpen}
          upgradeVersion={releaseName}
        />
      )}
      <Grid item xs={12}>
        <HelpBox
          iconComponent={<MinIOTierIcon style={{ height: 40 }} />}
          title={
            <Grid
              item
              xs={12}
              sx={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "10px",
              }}
            >
              RELEASE.{releaseName}{" "}
              <TooltipWrapper
                tooltip={
                  isK8S
                    ? "You are running under a K8s deployment. Please request your administrator to install this update"
                    : ""
                }
              >
                <Button
                  id={"upgrade-version"}
                  variant={"callAction"}
                  onClick={() => {
                    setUpgradeConfirmOpen(true);
                  }}
                  disabled={isK8S}
                >
                  Upgrade Now
                </Button>
              </TooltipWrapper>
            </Grid>
          }
          help={
            <Grid container>
              <Grid item xs={12} sx={{ marginTop: 5, fontSize: 14 }}>
                {helpInformation}
                {detailedInformation && (
                  <Box sx={{ marginTop: 15 }}>
                    Your current MinIO version is{" "}
                    <b>{detailedInformation.releases}</b> releases behind this
                    version
                    {(hasSecurityFixes || hasNewFeatures) &&
                      ", you are missing these important changes:"}
                    <ul>
                      {hasSecurityFixes && (
                        <li>
                          <b>{detailedInformation.security || ""}</b> Security
                          fix
                          {detailedInformation.security !== 1 ? "es" : ""}
                        </li>
                      )}
                      {hasBugFixes && (
                        <li>
                          <b>{detailedInformation.bug_fixes || ""}</b> Bug fix
                          {detailedInformation.bug_fixes !== 1 ? "es" : ""}
                        </li>
                      )}
                      {hasNewFeatures && (
                        <li>
                          <b>{detailedInformation.new_feature || ""}</b> New
                          Feature
                          {detailedInformation.new_feature !== 1 ? "s" : ""}
                        </li>
                      )}
                      {hasChanges && (
                        <li>
                          <b>{detailedInformation.changes || ""}</b> New Change
                          {detailedInformation.changes !== 1 ? "s" : ""}
                        </li>
                      )}
                    </ul>
                  </Box>
                )}
                {highlights && highlights.length > 0 && (
                  <Box sx={{ marginTop: 5 }}>
                    <SectionTitle>Highlights</SectionTitle>
                    <ul style={{ margin: "0px 20px" }}>
                      {highlights.map((item) => {
                        return <li>{item.title}</li>;
                      })}
                    </ul>
                  </Box>
                )}
              </Grid>
              <Grid
                item
                xs={12}
                sx={{
                  textAlign: "right",
                  marginTop: 15,
                  "& button": {
                    cursor: "pointer",
                    color: "#07193E",
                    backgroundColor: "transparent",
                    border: 0,
                    "&:hover": {
                      color: "#0D2453",
                      textDecoration: "underline",
                    },
                  },
                }}
              >
                <button
                  id={"more-information"}
                  onClick={() => openModeInformation()}
                >
                  {displayNotes ? "Hide Information" : "More Information"}
                </button>
              </Grid>
            </Grid>
          }
        />
      </Grid>
      {releaseNotes && (
        <Grid item xs={12} sx={{ marginTop: 15 }}>
          {displayNotes && (
            <Box
              sx={{
                border: "1px solid #eaeaea",
                borderRadius: "2px",
                display: "flex",
                flexFlow: "column",
                padding: "10px 30px",
              }}
            >
              {releaseNotes}
            </Box>
          )}
        </Grid>
      )}
    </Grid>
  );
};

export default UpgradeScreen;
