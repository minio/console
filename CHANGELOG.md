<!-- @format -->

# Changelog

## Release v0.31.0

*Breaking Changes:*

- *Removed support for Standalone Deployments*

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
