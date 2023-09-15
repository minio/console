<!-- @format -->

# Changelog

## Release v0.39.0

Features:

- Migrated metrics page to mds
- Migrated Register page to mds


Bug Fix:

- Fixed LDAP configuration page issues
- Load available certificates in logout
- Updated dependencies & go version
- Fixed delete objects functionality

## Release v0.38.0

Features:

- Added extra information to Service Accounts page
- Updated Tiers, Site Replication, Speedtest, Heal & Watch pages components

Bug Fix:

- Fixed IDP expiry time errors
- Updated project Dependencies

## Release v0.37.0

Features:

- Updated Trace and Logs page components
- Updated Prometheus metrics

Bug Fix:

- Disabled input fields for Subscription features if MinIO is not registered

## Release v0.36.0

Features:

- Updated Settings page components

Bug Fix:

- Show LDAP Enabled value LDAP configuration
- Download multiple objects in same path as they were selected

## Release v0.35.1

Bug Fix:

- Change timestamp format for zip creation

## Release v0.35.0

Features:

- Add Exclude Folders and Exclude Prefixes during bucket creation
- Download multiple selected objects as zip and ignore deleted objects
- Updated Call Home, Inspet, Profile and Health components

Bug Fix:

- Remove extra white spaces for configuration strings
- Allow Create New Path in bucket view when having right permissions

## Release v0.34.0

Features:

- Updated Buckets components

Bug Fix:

- Fixed SUBNET Health report upload
- Updated Download Handler
- Fixes issue with rewind
- Avoid 1 hour expiration for IDP credentials

---

## Release v0.33.0

Features:

- Updated OpenID, LDAP components

Bug Fix:

- Fixed security issues
- Fixed navigation issues in Object Browser
- Fixed Dashboard metrics

---

## Release v0.32.0

Features:

- Updated Users and Groups components
- Added placeholder image for Help Menu

Bug Fix:

- Fixed memory leak in WebSocket API for Object Browser

---

## Release v0.31.0

**Breaking Changes:**

- **Removed support for Standalone Deployments**

Features:

- Updated way files are displayed in uploading component
- Updated Audit Logs and Policies components

Bug Fix:

- Fixed Download folders issue in Object Browser
- Added missing Notification Events (ILM & REPLICA) in Events Notification Page
- Fixed Security Vulnerability for `semver` dependency

---

## Release v0.30.0

Features:

- Added MinIO Console Help Menu
- Updated UI Menu components

Bug Fix:

- Disable the Upload button on Object Browser if the user is not allowed
- Fixed security vulnerability for `lestrrat-go/jwx` and `fast-xml-parser`
- Fixed bug on sub-paths for Object Browser
- Reduce the number of calls to `/session` API endpoint to improve performance
- Rolled back the previous change for the Share File feature to no longer ask for Service Account access keys
