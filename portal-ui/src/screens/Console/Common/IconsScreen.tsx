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
  ArrowIcon,
  ArrowRightIcon,
  BackSettingsIcon,
  BucketsIcon,
  CalendarIcon,
  CircleIcon,
  ClustersIcon,
  CollapseIcon,
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
  LambdaBalloonIcon,
  LambdaIcon,
  LambdaNotificationsIcon,
  LicenseIcon,
  LockIcon,
  LogoutIcon,
  LogsIcon,
  MirroringIcon,
  MultipleBucketsIcon,
  NewAccountIcon,
  NextArrowIcon,
  ObjectBrowser1Icon,
  ObjectBrowserFolderIcon,
  ObjectBrowserIcon,
  ObjectManagerIcon,
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
  SpeedtestIcon,
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
  UploadFolderIcon,
  UploadIcon,
  UploadStatIcon,
  UptimeIcon,
  UsersIcon,
  VersionIcon,
  WarpIcon,
  WatchIcon,
} from "../../../icons";
import WarnIcon from "../../../icons/WarnIcon";
import JSONIcon from "../../../icons/JSONIcon";

interface IIconsScreenSimple {
  classes: any;
}

const styles = (theme: Theme) =>
  createStyles({
    ...containerForHeader(theme.spacing(4)),
    root: {
      fontSize: 12,
      wordWrap: "break-word",
    },
  });

const IconsScreen = ({ classes }: IIconsScreenSimple) => {
  return (
    <div className={classes.container}>
      <Grid container spacing={4} textAlign={"center"} className={classes.root}>
        <Grid item xs={3} sm={2} md={1}>
          <AccountIcon /> <br />
          AccountIcon
        </Grid>
        <Grid item xs={3} sm={2} md={1}>
          <AddFolderIcon /> <br />
          AddFolderIcon
        </Grid>
        <Grid item xs={3} sm={2} md={1}>
          <AddIcon /> <br />
          AddIcon
        </Grid>
        <Grid item xs={3} sm={2} md={1}>
          <AllBucketsIcon /> <br />
          AllBucketsIcon
        </Grid>
        <Grid item xs={3} sm={2} md={1}>
          <ArrowIcon /> <br />
          ArrowIcon
        </Grid>
        <Grid item xs={3} sm={2} md={1}>
          <ArrowRightIcon /> <br />
          ArrowRightIcon
        </Grid>
        <Grid item xs={3} sm={2} md={1}>
          <BackSettingsIcon /> <br />
          BackSettingsIcon
        </Grid>
        <Grid item xs={3} sm={2} md={1}>
          <BucketsIcon /> <br />
          BucketsIcon
        </Grid>
        <Grid item xs={3} sm={2} md={1}>
          <CalendarIcon /> <br />
          CalendarIcon
        </Grid>
        <Grid item xs={3} sm={2} md={1}>
          <CircleIcon /> <br />
          CircleIcon
        </Grid>
        <Grid item xs={3} sm={2} md={1}>
          <ClustersIcon /> <br />
          ClustersIcon
        </Grid>
        <Grid item xs={3} sm={2} md={1}>
          <CollapseIcon /> <br />
          CollapseIcon
        </Grid>
        <Grid item xs={3} sm={2} md={1}>
          <ComputerLineIcon /> <br />
          ComputerLineIcon
        </Grid>
        <Grid item xs={3} sm={2} md={1}>
          <ConfigurationsListIcon /> <br />
          ConfigurationsListIcon
        </Grid>
        <Grid item xs={3} sm={2} md={1}>
          <ConsoleIcon /> <br />
          ConsoleIcon
        </Grid>
        <Grid item xs={3} sm={2} md={1}>
          <ConsoleLogo /> <br />
          ConsoleLogo
        </Grid>
        <Grid item xs={3} sm={2} md={1}>
          <CopyIcon /> <br />
          CopyIcon
        </Grid>
        <Grid item xs={3} sm={2} md={1}>
          <CreateIcon /> <br />
          CreateIcon
        </Grid>
        <Grid item xs={3} sm={2} md={1}>
          <DashboardIcon /> <br />
          DashboardIcon
        </Grid>
        <Grid item xs={3} sm={2} md={1}>
          <DeleteIcon /> <br />
          DeleteIcon
        </Grid>
        <Grid item xs={3} sm={2} md={1}>
          <DiagnosticIcon /> <br />
          DiagnosticIcon
        </Grid>
        <Grid item xs={3} sm={2} md={1}>
          <DiagnosticsIcon /> <br />
          DiagnosticsIcon
        </Grid>
        <Grid item xs={3} sm={2} md={1}>
          <DocumentationIcon /> <br />
          DocumentationIcon
        </Grid>
        <Grid item xs={3} sm={2} md={1}>
          <DownloadIcon /> <br />
          DownloadIcon
        </Grid>
        <Grid item xs={3} sm={2} md={1}>
          <DownloadStatIcon /> <br />
          DownloadStatIcon
        </Grid>
        <Grid item xs={3} sm={2} md={1}>
          <DrivesIcon /> <br />
          DrivesIcon
        </Grid>
        <Grid item xs={3} sm={2} md={1}>
          <EditIcon /> <br />
          EditIcon
        </Grid>
        <Grid item xs={3} sm={2} md={1}>
          <EgressIcon /> <br />
          EgressIcon
        </Grid>
        <Grid item xs={3} sm={2} md={1}>
          <FileBookIcon /> <br />
          FileBookIcon
        </Grid>
        <Grid item xs={3} sm={2} md={1}>
          <FileCloudIcon /> <br />
          FileCloudIcon
        </Grid>
        <Grid item xs={3} sm={2} md={1}>
          <FileCodeIcon /> <br />
          FileCodeIcon
        </Grid>
        <Grid item xs={3} sm={2} md={1}>
          <FileConfigIcon /> <br />
          FileConfigIcon
        </Grid>
        <Grid item xs={3} sm={2} md={1}>
          <FileDbIcon /> <br />
          FileDbIcon
        </Grid>
        <Grid item xs={3} sm={2} md={1}>
          <FileFontIcon /> <br />
          FileFontIcon
        </Grid>
        <Grid item xs={3} sm={2} md={1}>
          <FileImageIcon /> <br />
          FileImageIcon
        </Grid>
        <Grid item xs={3} sm={2} md={1}>
          <FileLinkIcon /> <br />
          FileLinkIcon
        </Grid>
        <Grid item xs={3} sm={2} md={1}>
          <FileLockIcon /> <br />
          FileLockIcon
        </Grid>
        <Grid item xs={3} sm={2} md={1}>
          <FileMissingIcon /> <br />
          FileMissingIcon
        </Grid>
        <Grid item xs={3} sm={2} md={1}>
          <FileMusicIcon /> <br />
          FileMusicIcon
        </Grid>
        <Grid item xs={3} sm={2} md={1}>
          <FilePdfIcon /> <br />
          FilePdfIcon
        </Grid>
        <Grid item xs={3} sm={2} md={1}>
          <FilePptIcon /> <br />
          FilePptIcon
        </Grid>
        <Grid item xs={3} sm={2} md={1}>
          <FileTxtIcon /> <br />
          FileTxtIcon
        </Grid>
        <Grid item xs={3} sm={2} md={1}>
          <FileVideoIcon /> <br />
          FileVideoIcon
        </Grid>
        <Grid item xs={3} sm={2} md={1}>
          <FileWorldIcon /> <br />
          FileWorldIcon
        </Grid>
        <Grid item xs={3} sm={2} md={1}>
          <FileXlsIcon /> <br />
          FileXlsIcon
        </Grid>
        <Grid item xs={3} sm={2} md={1}>
          <FileZipIcon /> <br />
          FileZipIcon
        </Grid>
        <Grid item xs={3} sm={2} md={1}>
          <FolderIcon /> <br />
          FolderIcon
        </Grid>
        <Grid item xs={3} sm={2} md={1}>
          <GroupsIcon /> <br />
          GroupsIcon
        </Grid>
        <Grid item xs={3} sm={2} md={1}>
          <HealIcon /> <br />
          HealIcon
        </Grid>
        <Grid item xs={3} sm={2} md={1}>
          <HelpIcon /> <br />
          HelpIcon
        </Grid>
        <Grid item xs={3} sm={2} md={1}>
          <HistoryIcon /> <br />
          HistoryIcon
        </Grid>
        <Grid item xs={3} sm={2} md={1}>
          <IAMPoliciesIcon /> <br />
          IAMPoliciesIcon
        </Grid>
        <Grid item xs={3} sm={2} md={1}>
          <JSONIcon /> <br />
          JSONIcon
        </Grid>
        <Grid item xs={3} sm={2} md={1}>
          <LambdaBalloonIcon /> <br />
          LambdaBalloonIcon
        </Grid>
        <Grid item xs={3} sm={2} md={1}>
          <LambdaIcon /> <br />
          LambdaIcon
        </Grid>
        <Grid item xs={3} sm={2} md={1}>
          <LambdaNotificationsIcon /> <br />
          LambdaNotificationsIcon
        </Grid>
        <Grid item xs={3} sm={2} md={1}>
          <LicenseIcon /> <br />
          LicenseIcon
        </Grid>
        <Grid item xs={3} sm={2} md={1}>
          <LockIcon /> <br />
          LockIcon
        </Grid>
        <Grid item xs={3} sm={2} md={1}>
          <LogoutIcon /> <br />
          LogoutIcon
        </Grid>
        <Grid item xs={3} sm={2} md={1}>
          <LogsIcon /> <br />
          LogsIcon
        </Grid>
        <Grid item xs={3} sm={2} md={1}>
          <MirroringIcon /> <br />
          MirroringIcon
        </Grid>
        <Grid item xs={3} sm={2} md={1}>
          <MultipleBucketsIcon /> <br />
          MultipleBucketsIcon
        </Grid>
        <Grid item xs={3} sm={2} md={1}>
          <NewAccountIcon /> <br />
          NewAccountIcon
        </Grid>
        <Grid item xs={3} sm={2} md={1}>
          <NextArrowIcon /> <br />
          NextArrowIcon
        </Grid>
        <Grid item xs={3} sm={2} md={1}>
          <ObjectBrowser1Icon /> <br />
          ObjectBrowser1Icon
        </Grid>
        <Grid item xs={3} sm={2} md={1}>
          <ObjectBrowserFolderIcon /> <br />
          ObjectBrowserFolderIcon
        </Grid>
        <Grid item xs={3} sm={2} md={1}>
          <ObjectBrowserIcon /> <br />
          ObjectBrowserIcon
        </Grid>
        <Grid item xs={3} sm={2} md={1}>
          <ObjectManagerIcon /> <br />
          ObjectManagerIcon
        </Grid>
        <Grid item xs={3} sm={2} md={1}>
          <OpenListIcon /> <br />
          OpenListIcon
        </Grid>
        <Grid item xs={3} sm={2} md={1}>
          <OperatorLogo /> <br />
          OperatorLogo
        </Grid>
        <Grid item xs={3} sm={2} md={1}>
          <PermissionIcon /> <br />
          PermissionIcon
        </Grid>
        <Grid item xs={3} sm={2} md={1}>
          <PreviewIcon /> <br />
          PreviewIcon
        </Grid>
        <Grid item xs={3} sm={2} md={1}>
          <PrometheusIcon /> <br />
          PrometheusIcon
        </Grid>
        <Grid item xs={3} sm={2} md={1}>
          <RecoverIcon /> <br />
          RecoverIcon
        </Grid>
        <Grid item xs={3} sm={2} md={1}>
          <RedoIcon /> <br />
          RedoIcon
        </Grid>
        <Grid item xs={3} sm={2} md={1}>
          <RefreshIcon /> <br />
          RefreshIcon
        </Grid>
        <Grid item xs={3} sm={2} md={1}>
          <RemoveIcon /> <br />
          RemoveIcon
        </Grid>
        <Grid item xs={3} sm={2} md={1}>
          <ReportedUsageIcon /> <br />
          ReportedUsageIcon
        </Grid>
        <Grid item xs={3} sm={2} md={1}>
          <SearchIcon /> <br />
          SearchIcon
        </Grid>
        <Grid item xs={3} sm={2} md={1}>
          <SelectMultipleIcon /> <br />
          SelectMultipleIcon
        </Grid>
        <Grid item xs={3} sm={2} md={1}>
          <ServersIcon /> <br />
          ServersIcon
        </Grid>
        <Grid item xs={3} sm={2} md={1}>
          <ServiceAccountIcon /> <br />
          ServiceAccountIcon
        </Grid>
        <Grid item xs={3} sm={2} md={1}>
          <ServiceAccountsIcon /> <br />
          ServiceAccountsIcon
        </Grid>
        <Grid item xs={3} sm={2} md={1}>
          <SettingsIcon /> <br />
          SettingsIcon
        </Grid>
        <Grid item xs={3} sm={2} md={1}>
          <ShareIcon /> <br />
          ShareIcon
        </Grid>
        <Grid item xs={3} sm={2} md={1}>
          <SpeedtestIcon /> <br />
          SpeedtestIcon
        </Grid>
        <Grid item xs={3} sm={2} md={1}>
          <StorageIcon /> <br />
          StorageIcon
        </Grid>
        <Grid item xs={3} sm={2} md={1}>
          <SyncIcon /> <br />
          SyncIcon
        </Grid>
        <Grid item xs={3} sm={2} md={1}>
          <TenantsIcon /> <br />
          TenantsIcon
        </Grid>
        <Grid item xs={3} sm={2} md={1}>
          <TenantsOutlineIcon /> <br />
          TenantsOutlineIcon
        </Grid>
        <Grid item xs={3} sm={2} md={1}>
          <TiersIcon /> <br />
          TiersIcon
        </Grid>
        <Grid item xs={3} sm={2} md={1}>
          <ToolsIcon /> <br />
          ToolsIcon
        </Grid>
        <Grid item xs={3} sm={2} md={1}>
          <TotalObjectsIcon /> <br />
          TotalObjectsIcon
        </Grid>
        <Grid item xs={3} sm={2} md={1}>
          <TraceIcon /> <br />
          TraceIcon
        </Grid>
        <Grid item xs={3} sm={2} md={1}>
          <TrashIcon /> <br />
          TrashIcon
        </Grid>
        <Grid item xs={3} sm={2} md={1}>
          <UploadFile /> <br />
          UploadFile
        </Grid>
        <Grid item xs={3} sm={2} md={1}>
          <UploadFolderIcon /> <br />
          UploadFolderIcon
        </Grid>
        <Grid item xs={3} sm={2} md={1}>
          <UploadIcon /> <br />
          UploadIcon
        </Grid>
        <Grid item xs={3} sm={2} md={1}>
          <UploadStatIcon /> <br />
          UploadStatIcon
        </Grid>
        <Grid item xs={3} sm={2} md={1}>
          <UptimeIcon /> <br />
          UptimeIcon
        </Grid>
        <Grid item xs={3} sm={2} md={1}>
          <UsersIcon /> <br />
          UsersIcon
        </Grid>
        <Grid item xs={3} sm={2} md={1}>
          <VersionIcon /> <br />
          VersionIcon
        </Grid>
        <Grid item xs={3} sm={2} md={1}>
          <WarnIcon /> <br />
          WarnIcon
        </Grid>
        <Grid item xs={3} sm={2} md={1}>
          <WarpIcon /> <br />
          WarpIcon
        </Grid>
        <Grid item xs={3} sm={2} md={1}>
          <WatchIcon /> <br />
          WatchIcon
        </Grid>
      </Grid>
    </div>
  );
};

export default withStyles(styles)(IconsScreen);
