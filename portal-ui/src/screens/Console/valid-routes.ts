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
  SupportMenuIcon,
  TraceMenuIcon,
  UsersMenuIcon,
} from "../../icons/SidebarMenus";
import { hasPermission } from "../../common/SecureComponent";
import WatchIcon from "../../icons/WatchIcon";
import RegisterMenuIcon from "../../icons/SidebarMenus/RegisterMenuIcon";
import {
  DocumentationIcon,
  LambdaIcon,
  LicenseIcon,
  TenantsOutlineIcon,
  TiersIcon,
} from "../../icons";
import SettingsIcon from "../../icons/SettingsIcon";
import React from "react";

export const validRoutes = (
  features: string[] | null | undefined,
  operatorMode: boolean
) => {
  const ldapIsEnabled = (features && features.includes("ldap-idp")) || false;
  let consoleMenus: IMenuItem[] = [
    {
      name: "Buckets",
      id: "buckets",
      component: NavLink,
      to: IAM_PAGES.BUCKETS,
      icon: BucketsMenuIcon,
      forceDisplay: true,
      children: [],
    },
    {
      name: "Identity",
      id: "identity",
      icon: IdentityMenuIcon,
      children: [
        {
          component: NavLink,
          id: "users",
          to: IAM_PAGES.USERS,
          customPermissionFnc: () =>
            hasPermission(CONSOLE_UI_RESOURCE, [IAM_SCOPES.ADMIN_LIST_USERS]) ||
            hasPermission(S3_ALL_RESOURCES, [IAM_SCOPES.ADMIN_CREATE_USER]),
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
          component: NavLink,
          id: "serviceaccounts",
          to: IAM_PAGES.ACCOUNT,
          name: "Service Accounts",
          icon: AccountsMenuIcon,
          forceDisplay: true,
        },
      ],
    },
    {
      name: "Access",
      component: NavLink,
      id: "access",
      to: IAM_PAGES.POLICIES,
      icon: AccessMenuIcon,
    },

    {
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
      name: "Support",
      id: "support",
      icon: SupportMenuIcon,
      children: [
        {
          name: "Register",
          id: "register",
          component: NavLink,
          icon: RegisterMenuIcon,
          to: IAM_PAGES.REGISTER_SUPPORT,
        },
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
          to: IAM_PAGES.TOOLS_INSPECT,
          icon: InspectMenuIcon,
          component: NavLink,
        },
      ],
    },
    {
      component: NavLink,
      to: IAM_PAGES.LICENSE,
      name: "License",
      id: "license",
      icon: LicenseIcon,
      forceDisplay: true,
    },
    {
      name: "Settings",
      id: "settings",
      icon: SettingsIcon,
      children: [
        {
          component: NavLink,
          to: IAM_PAGES.SETTINGS,
          name: "Configurations",
          id: "configurations",
          icon: SettingsIcon,
        },
        {
          component: NavLink,
          to: IAM_PAGES.NOTIFICATIONS_ENDPOINTS,
          name: "Notifications",
          icon: LambdaIcon,
          id: "lambda",
        },
        {
          component: NavLink,
          to: IAM_PAGES.TIERS,
          name: "Tiers",
          icon: TiersIcon,
          id: "tiers",
        },
      ],
    },
    {
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
        window.open("https://docs.min.io/?ref=con", "_blank");
      },
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
        window.open("https://docs.min.io/?ref=op", "_blank");
      },
    },
  ];

  const allowedItems = (operatorMode ? operatorMenus : consoleMenus).filter(
    (item: IMenuItem) => {
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
    }
  );
  return allowedItems;
};
