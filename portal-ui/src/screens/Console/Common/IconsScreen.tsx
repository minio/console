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

import React from "react";
import { containerForHeader } from "../Common/FormComponents/common/styleLibrary";
import { Theme } from "@mui/material/styles";
import createStyles from "@mui/styles/createStyles";
import withStyles from "@mui/styles/withStyles";
import { Grid } from "@mui/material";
import {
  AccountIcon,
  AddFolderIcon,
  AddIcon,
  AllBucketsIcon,
  ArrowRightIcon,
  BackSettingsIcon,
  BucketsIcon,
  CalendarIcon,
  CircleIcon,
  ClustersIcon,
  ComputerLineIcon,
  ConfigurationsListIcon,
  ConsoleIcon,
  ConsoleLogo,
  CopyIcon,
  CreateIcon,
  DashboardIcon,
  DeleteIcon,
  DiagnosticIcon,
  DiagnosticsIcon,
  DocumentationIcon,
  DownloadIcon,
  DownloadStatIcon,
  DrivesIcon,
  EditIcon,
  EgressIcon,
  FileBookIcon,
  FileCloudIcon,
  FileCodeIcon,
  FileConfigIcon,
  FileDbIcon,
  FileFontIcon,
  FileImageIcon,
  FileLinkIcon,
  FileLockIcon,
  FileMissingIcon,
  FileMusicIcon,
  FilePdfIcon,
  FilePptIcon,
  FileTxtIcon,
  FileVideoIcon,
  FileWorldIcon,
  FileXlsIcon,
  FileZipIcon,
  FolderIcon,
  GroupsIcon,
  HealIcon,
  HelpIcon,
  HistoryIcon,
  IAMPoliciesIcon,
  JSONIcon,
  LambdaIcon,
  LambdaNotificationsIcon,
  LicenseIcon,
  LockIcon,
  LogoutIcon,
  LogsIcon,
  MirroringIcon,
  NextArrowIcon,
  ObjectBrowser1Icon,
  ObjectBrowserFolderIcon,
  ObjectBrowserIcon,
  OpenListIcon,
  OperatorLogo,
  PermissionIcon,
  PreviewIcon,
  PrometheusIcon,
  RecoverIcon,
  RedoIcon,
  RefreshIcon,
  RemoveIcon,
  ReportedUsageIcon,
  SearchIcon,
  SelectMultipleIcon,
  ServersIcon,
  ServiceAccountIcon,
  ServiceAccountsIcon,
  SettingsIcon,
  ShareIcon,
  StorageIcon,
  SyncIcon,
  TenantsIcon,
  TenantsOutlineIcon,
  TiersIcon,
  ToolsIcon,
  TotalObjectsIcon,
  TraceIcon,
  TrashIcon,
  UploadFile,
  UploadIcon,
  UploadStatIcon,
  UptimeIcon,
  UsersIcon,
  VersionIcon,
  WarpIcon,
  WatchIcon,
} from "../../../icons";
import WarnIcon from "../../../icons/WarnIcon";

interface IIconsScreenSimple {
  classes: any;
}

const styles = (theme: Theme) =>
  createStyles({
    ...containerForHeader(theme.spacing(4)),
    root: {
      fontSize: 12,
    },
  });

const IconsScreen = ({ classes }: IIconsScreenSimple) => {
  return (
    <div className={classes.container}>
      <Grid container spacing={4} textAlign={"center"} className={classes.root}>
        <Grid item>
          <StorageIcon />
          <br />
          StorageIcon
        </Grid>

        <Grid item>
          <RefreshIcon />
          <br />
          RefreshIcon
        </Grid>

        <Grid item>
          <ShareIcon />
          <br />
          ShareIcon
        </Grid>

        <Grid item>
          <FolderIcon />
          <br />
          FolderIcon
        </Grid>

        <Grid item>
          <EditIcon />
          <br />
          EditIcon
        </Grid>

        <Grid item>
          <SearchIcon />
          <br />
          SearchIcon
        </Grid>

        <Grid item>
          <ObjectBrowserFolderIcon />
          <br />
          ObjectBrowserFolderIcon
        </Grid>

        <Grid item>
          <RedoIcon />
          <br />
          RedoIcon
        </Grid>

        <Grid item>
          <DashboardIcon />
          <br />
          DashboardIcon
        </Grid>

        <Grid item>
          <ClustersIcon />
          <br />
          ClustersIcon
        </Grid>

        <Grid item>
          <MirroringIcon />
          <br />
          MirroringIcon
        </Grid>

        <Grid item>
          <ServiceAccountIcon />
          <br />
          ServiceAccountIcon
        </Grid>

        <Grid item>
          <ConfigurationsListIcon />
          <br />
          ConfigurationsListIcon
        </Grid>

        <Grid item>
          <WatchIcon />
          <br />
          WatchIcon
        </Grid>

        <Grid item>
          <HealIcon />
          <br />
          HealIcon
        </Grid>

        <Grid item>
          <OperatorLogo />
          <br />
          OperatorLogo
        </Grid>

        <Grid item>
          <DeleteIcon />
          <br />
          DeleteIcon
        </Grid>

        <Grid item>
          <ReportedUsageIcon />
          <br />
          ReportedUsageIcon
        </Grid>

        <Grid item>
          <PermissionIcon />
          <br />
          PermissionIcon
        </Grid>

        <Grid item>
          <AccountIcon />
          <br />
          AccountIcon
        </Grid>

        <Grid item>
          <DiagnosticIcon />
          <br />
          DiagnosticIcon
        </Grid>

        <Grid item>
          <TenantsOutlineIcon />
          <br />
          TenantsOutlineIcon
        </Grid>

        <Grid item>
          <HelpIcon />
          <br />
          HelpIcon
        </Grid>

        <Grid item>
          <DiagnosticsIcon />
          <br />
          DiagnosticsIcon
        </Grid>

        <Grid item>
          <ObjectBrowser1Icon />
          <br />
          ObjectBrowser1Icon
        </Grid>

        <Grid item>
          <WarpIcon />
          <br />
          WarpIcon
        </Grid>

        <Grid item>
          <CopyIcon />
          <br />
          CopyIcon
        </Grid>

        <Grid item>
          <ConsoleLogo />
          <br />
          ConsoleLogo
        </Grid>

        <Grid item>
          <TraceIcon />
          <br />
          TraceIcon
        </Grid>

        <Grid item>
          <AddIcon />
          <br />
          AddIcon
        </Grid>

        <Grid item>
          <LambdaNotificationsIcon />
          <br />
          LambdaNotificationsIcon
        </Grid>

        <Grid item>
          <BackSettingsIcon />
          <br />
          BackSettingsIcon
        </Grid>

        <Grid item>
          <LicenseIcon />
          <br />
          LicenseIcon
        </Grid>

        <Grid item>
          <RemoveIcon />
          <br />
          RemoveIcon
        </Grid>

        <Grid item>
          <AddFolderIcon />
          <br />
          AddFolderIcon
        </Grid>

        <Grid item>
          <IAMPoliciesIcon />
          <br />
          IAMPoliciesIcon
        </Grid>

        <Grid item>
          <UsersIcon />
          <br />
          UsersIcon
        </Grid>

        <Grid item>
          <EgressIcon />
          <br />
          EgressIcon
        </Grid>

        <Grid item>
          <DocumentationIcon />
          <br />
          DocumentationIcon
        </Grid>

        <Grid item>
          <TrashIcon />
          <br />
          TrashIcon
        </Grid>

        <Grid item>
          <DownloadIcon />
          <br />
          DownloadIcon
        </Grid>

        <Grid item>
          <AllBucketsIcon />
          <br />
          AllBucketsIcon
        </Grid>

        <Grid item>
          <SelectMultipleIcon />
          <br />
          SelectMultipleIcon
        </Grid>

        <Grid item>
          <GroupsIcon />
          <br />
          GroupsIcon
        </Grid>

        <Grid item>
          <TenantsIcon />
          <br />
          TenantsIcon
        </Grid>

        <Grid item>
          <UploadFile />
          <br />
          UploadFile
        </Grid>

        <Grid item>
          <CreateIcon />
          <br />
          CreateIcon
        </Grid>

        <Grid item>
          <SyncIcon />
          <br />
          SyncIcon
        </Grid>

        <Grid item>
          <LogoutIcon />
          <br />
          LogoutIcon
        </Grid>

        <Grid item>
          <HistoryIcon />
          <br />
          HistoryIcon
        </Grid>

        <Grid item>
          <BucketsIcon />
          <br />
          BucketsIcon
        </Grid>

        <Grid item>
          <ObjectBrowserIcon />
          <br />
          ObjectBrowserIcon
        </Grid>

        <Grid item>
          <SettingsIcon />
          <br />
          SettingsIcon
        </Grid>

        <Grid item>
          <UploadIcon />
          <br />
          UploadIcon
        </Grid>

        <Grid item>
          <ServiceAccountsIcon />
          <br />
          ServiceAccountsIcon
        </Grid>

        <Grid item>
          <LogsIcon />
          <br />
          LogsIcon
        </Grid>

        <Grid item>
          <ConsoleIcon />
          <br />
          ConsoleIcon
        </Grid>

        <Grid item>
          <ServersIcon />
          <br />
          ServersIcon
        </Grid>

        <Grid item>
          <DrivesIcon />
          <br />
          DrivesIcon
        </Grid>

        <Grid item>
          <TotalObjectsIcon />
          <br />
          TotalObjectsIcon
        </Grid>

        <Grid item>
          <CircleIcon />
          <br />
          CircleIcon
        </Grid>

        <Grid item>
          <PreviewIcon />
          <br />
          PreviewIcon
        </Grid>

        <Grid item>
          <LockIcon />
          <br />
          LockIcon
        </Grid>

        <Grid item>
          <VersionIcon />
          <br />
          VersionIcon
        </Grid>

        <Grid item>
          <FileLockIcon />
          <br />
          FileLockIcon
        </Grid>

        <Grid item>
          <FileXlsIcon />
          <br />
          FileXlsIcon
        </Grid>

        <Grid item>
          <FileZipIcon />
          <br />
          FileZipIcon
        </Grid>

        <Grid item>
          <FileCloudIcon />
          <br />
          FileCloudIcon
        </Grid>

        <Grid item>
          <FileMusicIcon />
          <br />
          FileMusicIcon
        </Grid>

        <Grid item>
          <FileConfigIcon />
          <br />
          FileConfigIcon
        </Grid>

        <Grid item>
          <FilePdfIcon />
          <br />
          FilePdfIcon
        </Grid>

        <Grid item>
          <FileFontIcon />
          <br />
          FileFontIcon
        </Grid>

        <Grid item>
          <FileLinkIcon />
          <br />
          FileLinkIcon
        </Grid>

        <Grid item>
          <FileImageIcon />
          <br />
          FileImageIcon
        </Grid>

        <Grid item>
          <FileWorldIcon />
          <br />
          FileWorldIcon
        </Grid>

        <Grid item>
          <FileBookIcon />
          <br />
          FileBookIcon
        </Grid>

        <Grid item>
          <FileMissingIcon />
          <br />
          FileMissingIcon
        </Grid>

        <Grid item>
          <FileCodeIcon />
          <br />
          FileCodeIcon
        </Grid>

        <Grid item>
          <FilePptIcon />
          <br />
          FilePptIcon
        </Grid>

        <Grid item>
          <FileDbIcon />
          <br />
          FileDbIcon
        </Grid>

        <Grid item>
          <FileTxtIcon />
          <br />
          FileTxtIcon
        </Grid>

        <Grid item>
          <FileVideoIcon />
          <br />
          FileVideoIcon
        </Grid>

        <Grid item>
          <ArrowRightIcon />
          <br />
          ArrowRightIcon
        </Grid>

        <Grid item>
          <CalendarIcon />
          <br />
          CalendarIcon
        </Grid>

        <Grid item>
          <UptimeIcon />
          <br />
          UptimeIcon
        </Grid>

        <Grid item>
          <LambdaIcon />
          <br />
          LambdaIcon
        </Grid>

        <Grid item>
          <TiersIcon />
          <br />
          TiersIcon
        </Grid>

        <Grid item>
          <OpenListIcon />
          <br />
          OpenListIcon
        </Grid>

        <Grid item>
          <ToolsIcon />
          <br />
          ToolsIcon
        </Grid>

        <Grid item>
          <RecoverIcon />
          <br />
          RecoverIcon
        </Grid>

        <Grid item>
          <PrometheusIcon />
          <br />
          PrometheusIcon
        </Grid>

        <Grid item>
          <NextArrowIcon />
          <br />
          NextArrowIcon
        </Grid>

        <Grid item>
          <DownloadStatIcon />
          <br />
          DownloadStatIcon
        </Grid>

        <Grid item>
          <UploadStatIcon />
          <br />
          UploadStatIcon
        </Grid>

        <Grid item>
          <ComputerLineIcon />
          <br />
          ComputerLineIcon
        </Grid>

        <Grid item>
          <JSONIcon />
          <br />
          JSONIcon
        </Grid>
        <Grid item>
          <WarnIcon />
          <br />
          WarnIcon
        </Grid>
      </Grid>
    </div>
  );
};

export default withStyles(styles)(IconsScreen);
