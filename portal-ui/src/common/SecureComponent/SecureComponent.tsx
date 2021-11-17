import React, { cloneElement } from "react";
import { store } from "../../store";
import { hasAccessToResource } from "./permissions";

export const hasPermission = (
  resource: string | undefined,
  scopes: string[],
  matchAll?: boolean
) => {
  if (!resource) {
    return false;
  }
  const state = store.getState();
  const sessionGrants = state.console.session.permissions;
  const resourceGrants =
    sessionGrants[resource] ||
    sessionGrants[`arn:aws:s3:::${resource}/*`] ||
    [];
  const globalGrants = sessionGrants["arn:aws:s3:::*"] || [];
  return hasAccessToResource(
    [...resourceGrants, ...globalGrants],
    scopes,
    matchAll
  );
};

interface ISecureComponentProps {
  errorProps?: any;
  RenderError?: any;
  matchAll?: boolean;
  children: any;
  scopes: string[];
  resource: string;
}

const SecureComponent = ({
  children,
  RenderError = () => <></>,
  errorProps = null,
  matchAll = false,
  scopes = [],
  resource,
}: ISecureComponentProps) => {
  const permissionGranted = hasPermission(resource, scopes, matchAll);
  // console.log("permissionGranted", permissionGranted);
  if (!permissionGranted && !errorProps) return <RenderError />;
  if (!permissionGranted && errorProps) {
    return cloneElement(children, { ...errorProps });
  }

  return <>{children}</>;
};

export default SecureComponent;
