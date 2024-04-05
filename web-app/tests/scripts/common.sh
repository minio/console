# This file is part of MinIO Console Server
# Copyright (c) 2022 MinIO, Inc.
# # This program is free software: you can redistribute it and/or modify
# it under the terms of the GNU Affero General Public License as published by
# the Free Software Foundation, either version 3 of the License, or
# (at your option) any later version.
# # This program is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
# GNU Affero General Public License for more details.
# # You should have received a copy of the GNU Affero General Public License
# along with this program.  If not, see <http://www.gnu.org/licenses/>.

add_alias() {
  for i in $(seq 1 4); do
    echo "... attempting to add alias $i"
    until (mc alias set minio http://127.0.0.1:9000 minioadmin minioadmin); do
      echo "...waiting... for 5secs" && sleep 5
    done
  done
}

create_policies() {
  mc admin policy create minio bucketassignpolicy-$TIMESTAMP web-app/tests/policies/bucketAssignPolicy.json
  mc admin policy create minio bucketread-$TIMESTAMP web-app/tests/policies/bucketRead.json
  mc admin policy create minio bucketwrite-$TIMESTAMP web-app/tests/policies/bucketWrite.json
  mc admin policy create minio bucketreadwrite-$TIMESTAMP web-app/tests/policies/bucketReadWrite.json
  mc admin policy create minio bucketcannottag-$TIMESTAMP web-app/tests/policies/bucketCannotTag.json
  mc admin policy create minio bucketspecific-$TIMESTAMP web-app/tests/policies/bucketSpecific.json
  mc admin policy create minio dashboard-$TIMESTAMP web-app/tests/policies/dashboard.json
  mc admin policy create minio diagnostics-$TIMESTAMP web-app/tests/policies/diagnostics.json
  mc admin policy create minio groups-$TIMESTAMP web-app/tests/policies/groups.json
  mc admin policy create minio iampolicies-$TIMESTAMP web-app/tests/policies/iamPolicies.json
  mc admin policy create minio logs-$TIMESTAMP web-app/tests/policies/logs.json
  mc admin policy create minio notificationendpoints-$TIMESTAMP web-app/tests/policies/notificationEndpoints.json
  mc admin policy create minio settings-$TIMESTAMP web-app/tests/policies/settings.json
  mc admin policy create minio tiers-$TIMESTAMP web-app/tests/policies/tiers.json
  mc admin policy create minio trace-$TIMESTAMP web-app/tests/policies/trace.json
  mc admin policy create minio users-$TIMESTAMP web-app/tests/policies/users.json
  mc admin policy create minio watch-$TIMESTAMP web-app/tests/policies/watch.json
  mc admin policy create minio bucketwriteprefixonlypolicy-$TIMESTAMP web-app/tests/policies/bucketWritePrefixOnlyPolicy.json
  mc admin policy create minio inspect-allowed-$TIMESTAMP web-app/tests/policies/inspect-allowed.json
  mc admin policy create minio inspect-not-allowed-$TIMESTAMP web-app/tests/policies/inspect-not-allowed.json
  mc admin policy create minio fix-prefix-policy-ui-crash-$TIMESTAMP web-app/tests/policies/fix-prefix-policy-ui-crash.json
  mc admin policy create minio delete-object-with-prefix-$TIMESTAMP web-app/tests/policies/deleteObjectWithPrefix.json
  mc admin policy create minio conditions-policy-$TIMESTAMP web-app/tests/policies/conditionsPolicy.json
  mc admin policy create minio conditions-policy-2-$TIMESTAMP web-app/tests/policies/conditionsPolicy2.json
  mc admin policy create minio conditions-policy-3-$TIMESTAMP web-app/tests/policies/conditionsPolicy3.json
  mc admin policy create minio conditions-policy-4-$TIMESTAMP web-app/tests/policies/conditionsPolicy4.json
  mc admin policy create minio rewind-allowed-$TIMESTAMP web-app/tests/policies/rewind-allowed.json
  mc admin policy create minio rewind-not-allowed-$TIMESTAMP web-app/tests/policies/rewind-not-allowed.json
}

create_users() {
  mc admin user add minio bucketassignpolicy-$TIMESTAMP bucketassignpolicy
  mc admin user add minio bucketread-$TIMESTAMP bucketread
  mc admin user add minio bucketwrite-$TIMESTAMP bucketwrite
  mc admin user add minio bucketreadwrite-$TIMESTAMP bucketreadwrite
  mc admin user add minio bucketobjecttags-$TIMESTAMP bucketobjecttags
  mc admin user add minio bucketcannottag-$TIMESTAMP bucketcannottag
  mc admin user add minio bucketspecific-$TIMESTAMP bucketspecific
  mc admin user add minio dashboard-$TIMESTAMP dashboard
  mc admin user add minio diagnostics-$TIMESTAMP diagnostics
  mc admin user add minio groups-$TIMESTAMP groups1234
  mc admin user add minio heal-$TIMESTAMP heal1234
  mc admin user add minio iampolicies-$TIMESTAMP iampolicies
  mc admin user add minio logs-$TIMESTAMP logs1234
  mc admin user add minio notificationendpoints-$TIMESTAMP notificationendpoints
  mc admin user add minio settings-$TIMESTAMP settings
  mc admin user add minio tiers-$TIMESTAMP tiers1234
  mc admin user add minio trace-$TIMESTAMP trace1234
  mc admin user add minio users-$TIMESTAMP users1234
  mc admin user add minio watch-$TIMESTAMP watch1234
  mc admin user add minio bucketwriteprefixonlypolicy-$TIMESTAMP bucketwriteprefixonlypolicy
  mc admin user add minio inspect-allowed-$TIMESTAMP insallowed1234
  mc admin user add minio inspect-not-allowed-$TIMESTAMP insnotallowed1234
  mc admin user add minio prefix-policy-ui-crash-$TIMESTAMP poluicrashfix1234
  mc admin user add minio delete-object-with-prefix-$TIMESTAMP deleteobjectwithprefix1234
  mc admin user add minio conditions-$TIMESTAMP conditions1234
  mc admin user add minio conditions-2-$TIMESTAMP conditions1234
  mc admin user add minio conditions-3-$TIMESTAMP conditions1234
  mc admin user add minio conditions-4-$TIMESTAMP conditions1234
  mc admin user add minio rewind-allowed-$TIMESTAMP rewindallowed1234
  mc admin user add minio rewind-not-allowed-$TIMESTAMP rewindnotallowed1234
}

create_buckets() {
  mc mb minio/testcafe && mc cp ./web-app/tests/uploads/test.txt minio/testcafe/write/test.txt
  mc mb minio/test && mc cp ./web-app/tests/uploads/test.txt minio/test/test.txt && mc cp ./web-app/tests/uploads/test.txt minio/test/digitalinsights/xref_cust_guid_actd-v1.txt && mc cp ./web-app/tests/uploads/test.txt minio/test/digitalinsights/test.txt
  mc mb minio/testcondition && mc cp ./web-app/tests/uploads/test.txt minio/testcondition/test.txt && mc cp ./web-app/tests2/uploads/test.txt minio/testcondition/firstlevel/xref_cust_guid_actd-v1.txt && mc cp ./web-app/tests/uploads/test.txt minio/testcondition/firstlevel/test.txt && mc cp ./web-app/tests/uploads/test.txt minio/testcondition/firstlevel/secondlevel/test.txt && mc cp ./web-app/tests/uploads/test.txt minio/testcondition/firstlevel/secondlevel/thirdlevel/test.txt
}

assign_policies() {
  mc admin policy attach minio bucketassignpolicy-$TIMESTAMP --user bucketassignpolicy-$TIMESTAMP
  mc admin policy attach minio bucketread-$TIMESTAMP --user bucketread-$TIMESTAMP
  mc admin policy attach minio bucketwrite-$TIMESTAMP --user bucketwrite-$TIMESTAMP
  mc admin policy attach minio bucketreadwrite-$TIMESTAMP --user bucketreadwrite-$TIMESTAMP
  mc admin policy attach minio bucketreadwrite-$TIMESTAMP --user bucketobjecttags-$TIMESTAMP
  mc admin policy attach minio bucketcannottag-$TIMESTAMP --user bucketcannottag-$TIMESTAMP
  mc admin policy attach minio bucketspecific-$TIMESTAMP --user bucketspecific-$TIMESTAMP
  mc admin policy attach minio dashboard-$TIMESTAMP --user dashboard-$TIMESTAMP
  mc admin policy attach minio diagnostics-$TIMESTAMP --user diagnostics-$TIMESTAMP
  mc admin policy attach minio groups-$TIMESTAMP --user groups-$TIMESTAMP
  mc admin policy attach minio heal-$TIMESTAMP --user heal-$TIMESTAMP
  mc admin policy attach minio iampolicies-$TIMESTAMP --user iampolicies-$TIMESTAMP
  mc admin policy attach minio logs-$TIMESTAMP --user logs-$TIMESTAMP
  mc admin policy attach minio notificationendpoints-$TIMESTAMP --user notificationendpoints-$TIMESTAMP
  mc admin policy attach minio settings-$TIMESTAMP --user settings-$TIMESTAMP
  mc admin policy attach minio tiers-$TIMESTAMP --user tiers-$TIMESTAMP
  mc admin policy attach minio trace-$TIMESTAMP --user trace-$TIMESTAMP
  mc admin policy attach minio users-$TIMESTAMP --user users-$TIMESTAMP
  mc admin policy attach minio watch-$TIMESTAMP --user watch-$TIMESTAMP
  mc admin policy attach minio bucketwriteprefixonlypolicy-$TIMESTAMP --user bucketwriteprefixonlypolicy-$TIMESTAMP
  mc admin policy attach minio inspect-allowed-$TIMESTAMP --user inspect-allowed-$TIMESTAMP
  mc admin policy attach minio inspect-not-allowed-$TIMESTAMP --user inspect-not-allowed-$TIMESTAMP
  mc admin policy attach minio delete-object-with-prefix-$TIMESTAMP --user delete-object-with-prefix-$TIMESTAMP
  mc admin policy attach minio conditions-policy-$TIMESTAMP --user conditions-$TIMESTAMP
  mc admin policy attach minio conditions-policy-2-$TIMESTAMP --user conditions-2-$TIMESTAMP
  mc admin policy attach minio conditions-policy-3-$TIMESTAMP --user conditions-3-$TIMESTAMP
  mc admin policy attach minio conditions-policy-4-$TIMESTAMP --user conditions-4-$TIMESTAMP
  mc admin policy attach minio rewind-allowed-$TIMESTAMP --user rewind-allowed-$TIMESTAMP
  mc admin policy attach minio rewind-not-allowed-$TIMESTAMP --user rewind-not-allowed-$TIMESTAMP
}
