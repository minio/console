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

import { IMenuItem } from "./Menu/types";
import { NavLink } from "react-router-dom";
import {
  adminUserPermissions,
  CONSOLE_UI_RESOURCE,
  IAM_PAGES,
  IAM_PAGES_PERMISSIONS,
  IAM_SCOPES,
  S3_ALL_RESOURCES,
} from "../../common/SecureComponent/permissions";
import {
  AccessMenuIcon,
  AccountsMenuIcon,
  AuditLogsMenuIcon,
  BucketsMenuIcon,
  DrivesMenuIcon,
  GroupsMenuIcon,
  HealthMenuIcon,
  IdentityMenuIcon,
  InspectMenuIcon,
  LogsMenuIcon,
  MetricsMenuIcon,
  MonitoringMenuIcon,
  PerformanceMenuIcon,
  ProfileMenuIcon,
  RegisterMenuIcon,
  SupportMenuIcon,
  TraceMenuIcon,
  UsersMenuIcon,
} from "../../icons/SidebarMenus";
import { hasPermission } from "../../common/SecureComponent";
import WatchIcon from "../../icons/WatchIcon";
import {
  ClustersIcon,
  DocumentationIcon,
  LambdaIcon,
  LicenseIcon,
  ObjectBrowserIcon,
  RecoverIcon,
  StorageIcon,
  TenantsOutlineIcon,
  TiersIcon,
} from "../../icons";
import SettingsIcon from "../../icons/SettingsIcon";
import React from "react";
import LicenseBadge from "./Menu/LicenseBadge";
import { LockOpen, Login } from "@mui/icons-material";

export const validRoutes = (
  features: string[] | null | undefined,
  operatorMode: boolean,
  directPVMode: boolean
) => {
  const ldapIsEnabled = (features && features.includes("ldap-idp")) || false;
  let consoleMenus: IMenuItem[] = [
    {
      group: "User",
      name: "Object Browser",
      id: "object-browser",
      component: NavLink,
      to: IAM_PAGES.OBJECT_BROWSER_VIEW,
      icon: ObjectBrowserIcon,
      forceDisplay: true,
      children: [],
    },
    {
      group: "User",
      component: NavLink,
      id: "nav-accesskeys",
      to: IAM_PAGES.ACCOUNT,
      name: "Access Keys",
      icon: AccountsMenuIcon,
      forceDisplay: true,
    },
    {
      group: "User",
      type: "item",
      component: NavLink,
      to: IAM_PAGES.DOCUMENTATION,
      name: "Documentation",
      icon: DocumentationIcon,
      forceDisplay: true,
      onClick: (
        e:
          | React.MouseEvent<HTMLLIElement>
          | React.MouseEvent<HTMLAnchorElement>
          | React.MouseEvent<HTMLDivElement>
      ) => {
        e.preventDefault();
        window.open(
          "https://min.io/docs/minio/linux/index.html?ref=con",
          "_blank"
        );
      },
    },
    {
      group: "Administrator",
      name: "Buckets",
      id: "buckets",
      component: NavLink,
      to: IAM_PAGES.BUCKETS,
      icon: BucketsMenuIcon,
      forceDisplay: true,
      children: [],
    },
    {
      group: "Administrator",
      name: "Identity",
      id: "identity",
      icon: IdentityMenuIcon,
      children: [
        {
          component: NavLink,
          id: "users",
          to: IAM_PAGES.USERS,
          customPermissionFnc: () =>
            hasPermission(CONSOLE_UI_RESOURCE, adminUserPermissions) ||
            hasPermission(S3_ALL_RESOURCES, adminUserPermissions) ||
            hasPermission(CONSOLE_UI_RESOURCE, [IAM_SCOPES.ADMIN_ALL_ACTIONS]),
          name: "Users",
          icon: UsersMenuIcon,
          fsHidden: ldapIsEnabled,
        },
        {
          component: NavLink,
          id: "groups",
          to: IAM_PAGES.GROUPS,
          name: "Groups",
          icon: GroupsMenuIcon,
          fsHidden: ldapIsEnabled,
        },
        {
          name: "Policies",
          component: NavLink,
          id: "policies",
          to: IAM_PAGES.POLICIES,
          icon: AccessMenuIcon,
        },
        {
          name: "OpenID",
          component: NavLink,
          id: "openID",
          to: IAM_PAGES.IDP_OPENID_CONFIGURATIONS,
          icon: LockOpen,
        },
        {
          name: "LDAP",
          component: NavLink,
          id: "ldap",
          to: IAM_PAGES.IDP_LDAP_CONFIGURATIONS,
          icon: Login,
        },
      ],
    },

    {
      group: "Administrator",
      name: "Monitoring",
      id: "tools",
      icon: MonitoringMenuIcon,
      children: [
        {
          name: "Metrics",
          id: "monitorMetrics",
          to: IAM_PAGES.DASHBOARD,
          icon: MetricsMenuIcon,
          component: NavLink,
        },
        {
          name: "Logs ",
          id: "monitorLogs",
          to: IAM_PAGES.TOOLS_LOGS,
          icon: LogsMenuIcon,
          component: NavLink,
        },
        {
          name: "Audit",
          id: "monitorAudit",
          to: IAM_PAGES.TOOLS_AUDITLOGS,
          icon: AuditLogsMenuIcon,
          component: NavLink,
        },
        {
          name: "Trace",
          id: "monitorTrace",
          to: IAM_PAGES.TOOLS_TRACE,
          icon: TraceMenuIcon,
          component: NavLink,
        },
        {
          name: "Watch",
          id: "watch",
          component: NavLink,
          icon: WatchIcon,
          to: IAM_PAGES.TOOLS_WATCH,
        },
        {
          name: "Drives",
          id: "monitorDrives",
          to: IAM_PAGES.TOOLS_HEAL,
          icon: DrivesMenuIcon,
          component: NavLink,
        },
      ],
    },
    {
      group: "Administrator",
      component: NavLink,
      to: IAM_PAGES.NOTIFICATIONS_ENDPOINTS,
      name: "Notifications",
      icon: LambdaIcon,
      id: "lambda",
    },
    {
      group: "Administrator",
      component: NavLink,
      to: IAM_PAGES.TIERS,
      name: "Tiers",
      icon: TiersIcon,
      id: "tiers",
    },
    {
      group: "Administrator",
      component: NavLink,
      to: IAM_PAGES.SITE_REPLICATION,
      name: "Site Replication",
      icon: RecoverIcon,
      id: "sitereplication",
    },
    {
      group: "Administrator",
      component: NavLink,
      to: IAM_PAGES.SETTINGS,
      name: "Settings",
      id: "configurations",
      icon: SettingsIcon,
    },
    {
      group: "Subscription",
      component: NavLink,
      to: IAM_PAGES.LICENSE,
      name: "License",
      id: "license",
      icon: LicenseIcon,
      badge: LicenseBadge,
      forceDisplay: true,
    },
    {
      group: "Subscription",
      name: "Support",
      id: "support",
      icon: SupportMenuIcon,
      children: [
        {
          name: "Health",
          id: "diagnostics",
          component: NavLink,
          icon: HealthMenuIcon,
          to: IAM_PAGES.TOOLS_DIAGNOSTICS,
        },
        {
          name: "Performance",
          id: "performance",
          component: NavLink,
          icon: PerformanceMenuIcon,
          to: IAM_PAGES.TOOLS_SPEEDTEST,
        },
        {
          name: "Profile",
          id: "profile",
          component: NavLink,
          icon: ProfileMenuIcon,
          to: IAM_PAGES.PROFILE,
        },

        // {
        //   name: "Call Home",
        //   id: "callhome",
        //   component: NavLink,
        //   icon: CallHomeMenuIcon,
        //   to: IAM_PAGES.CALL_HOME,
        // },
        {
          name: "Inspect",
          id: "inspectObjects",
          to: IAM_PAGES.SUPPORT_INSPECT,
          icon: InspectMenuIcon,
          component: NavLink,
        },
      ],
    },
  ];

  let operatorMenus: IMenuItem[] = [
    {
      group: "Operator",
      type: "item",
      id: "Tenants",
      component: NavLink,
      to: IAM_PAGES.TENANTS,
      name: "Tenants",
      icon: TenantsOutlineIcon,
      forceDisplay: true,
    },
    {
      group: "Operator",
      type: "item",
      id: "License",
      component: NavLink,
      to: IAM_PAGES.LICENSE,
      name: "License",
      icon: LicenseIcon,
      forceDisplay: true,
    },
    {
      group: "Operator",
      type: "item",
      id: "Register",
      component: NavLink,
      to: IAM_PAGES.REGISTER_SUPPORT,
      name: "Register",
      icon: RegisterMenuIcon,
      forceDisplay: true,
    },
    {
      group: "Operator",
      type: "item",
      id: "Documentation",
      component: NavLink,
      to: IAM_PAGES.DOCUMENTATION,
      name: "Documentation",
      icon: DocumentationIcon,
      forceDisplay: true,
      onClick: (
        e:
          | React.MouseEvent<HTMLLIElement>
          | React.MouseEvent<HTMLAnchorElement>
          | React.MouseEvent<HTMLDivElement>
      ) => {
        e.preventDefault();
        window.open(
          "https://min.io/docs/minio/linux/index.html?ref=op",
          "_blank"
        );
      },
    },
  ];

  let directPVMenus: IMenuItem[] = [
    {
      group: "Storage",
      type: "item",
      id: "StoragePVCs",
      component: NavLink,
      to: IAM_PAGES.DIRECTPV_STORAGE,
      name: "PVCs",
      icon: ClustersIcon,
      forceDisplay: true,
    },
    {
      name: "Drives",
      type: "item",
      id: "drives",
      component: NavLink,
      icon: DrivesMenuIcon,
      to: IAM_PAGES.DIRECTPV_DRIVES,
      forceDisplay: true,
    },
    {
      name: "Volumes",
      type: "item",
      id: "volumes",
      component: NavLink,
      icon: StorageIcon,
      to: IAM_PAGES.DIRECTPV_VOLUMES,
      forceDisplay: true,
    },
    {
      group: "DirectPV",
      type: "item",
      id: "License",
      component: NavLink,
      to: IAM_PAGES.LICENSE,
      name: "License",
      icon: LicenseIcon,
      forceDisplay: true,
    },
    {
      group: "DirectPV",
      type: "item",
      id: "Documentation",
      component: NavLink,
      to: IAM_PAGES.DOCUMENTATION,
      name: "Documentation",
      icon: DocumentationIcon,
      forceDisplay: true,
      onClick: (
        e:
          | React.MouseEvent<HTMLLIElement>
          | React.MouseEvent<HTMLAnchorElement>
          | React.MouseEvent<HTMLDivElement>
      ) => {
        e.preventDefault();
        window.open(
          "https://min.io/docs/minio/linux/index.html?ref=op",
          "_blank"
        );
      },
    },
  ];

  let menus = consoleMenus;

  if (directPVMode) {
    menus = directPVMenus;
  } else if (operatorMode) {
    menus = operatorMenus;
  }

  const allowedItems = menus.filter((item: IMenuItem) => {
    if (item.children && item.children.length > 0) {
      const c = item.children?.filter((childItem: IMenuItem) => {
        return (
          ((childItem.customPermissionFnc
            ? childItem.customPermissionFnc()
            : hasPermission(
                CONSOLE_UI_RESOURCE,
                IAM_PAGES_PERMISSIONS[childItem.to ?? ""]
              )) ||
            childItem.forceDisplay) &&
          !childItem.fsHidden
        );
      });
      return c.length > 0;
    }

    const res =
      ((item.customPermissionFnc
        ? item.customPermissionFnc()
        : hasPermission(
            CONSOLE_UI_RESOURCE,
            IAM_PAGES_PERMISSIONS[item.to ?? ""]
          )) ||
        item.forceDisplay) &&
      !item.fsHidden;
    return res;
  });
  return allowedItems;
};
