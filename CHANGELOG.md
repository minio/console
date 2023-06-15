<!-- @format -->

# Changelog

## Release v0.30.0

Features:

- Added MinIO Console Help Menu
- Updated UI Menu components

Bug Fix:

- Disable Upload button on Object Browser if user not allowed
- Fixed security vulnerability for `lestrrat-go/jwx` and `fast-xml-parser`
- Fixed bug on sub-paths for Object Browser
- Reduce number of calls to `/session` api to improve performance
- Rolled back previous change for Share File feature to no longer ask for Service Account access keys
