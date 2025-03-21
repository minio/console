//  This file is part of MinIO Console Server
//  Copyright (c) 2022 MinIO, Inc.
//
//  This program is free software: you can redistribute it and/or modify
//  it under the terms of the GNU Affero General Public License as published by
//  the Free Software Foundation, either version 3 of the License, or
//  (at your option) any later version.
//
//  This program is distributed in the hope that it will be useful,
//  but WITHOUT ANY WARRANTY; without even the implied warranty of
//  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
//  GNU Affero General Public License for more details.
//
//  You should have received a copy of the GNU Affero General Public License
//  along with this program.  If not, see <http://www.gnu.org/licenses/>.
import * as React from "react";
import { Fragment } from "react";
import { KBarProvider } from "kbar";
import Console from "./Console";
import { useSelector } from "react-redux";
import CommandBar from "./CommandBar";
import { selFeatures } from "./consoleSlice";
import TrafficMonitor from "./Common/ObjectManager/TrafficMonitor";
import { AppState } from "../../store";
import AnonymousAccess from "../AnonymousAccess/AnonymousAccess";
import LicenseConsentModal from "./License/LicenseConsentModal";

const ConsoleKBar = () => {
  const features = useSelector(selFeatures);
  const anonymousMode = useSelector(
    (state: AppState) => state.system.anonymousMode,
  );

  // if we are hiding the menu also disable the k-bar so just return console
  if (features?.includes("hide-menu")) {
    return (
      <Fragment>
        <TrafficMonitor />
        <Console />
      </Fragment>
    );
  }
  // for anonymous mode, we don't load Console, only AnonymousAccess
  if (anonymousMode) {
    return (
      <Fragment>
        <TrafficMonitor />
        <AnonymousAccess />
      </Fragment>
    );
  }

  return (
    <KBarProvider
      options={{
        enableHistory: true,
      }}
    >
      <TrafficMonitor />
      <CommandBar />
      <LicenseConsentModal />
      <Console />
    </KBarProvider>
  );
};

export default ConsoleKBar;
