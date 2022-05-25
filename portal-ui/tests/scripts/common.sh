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
  mc admin policy add minio bucketassignpolicy-$TIMESTAMP portal-ui/tests/policies/bucketAssignPolicy.json
  mc admin policy add minio bucketread-$TIMESTAMP portal-ui/tests/policies/bucketRead.json
  mc admin policy add minio bucketwrite-$TIMESTAMP portal-ui/tests/policies/bucketWrite.json
  mc admin policy add minio bucketreadwrite-$TIMESTAMP portal-ui/tests/policies/bucketReadWrite.json
  mc admin policy add minio bucketcannottag-$TIMESTAMP portal-ui/tests/policies/bucketCannotTag.json
  mc admin policy add minio bucketspecific-$TIMESTAMP portal-ui/tests/policies/bucketSpecific.json
  mc admin policy add minio dashboard-$TIMESTAMP portal-ui/tests/policies/dashboard.json
  mc admin policy add minio diagnostics-$TIMESTAMP portal-ui/tests/policies/diagnostics.json
  mc admin policy add minio groups-$TIMESTAMP portal-ui/tests/policies/groups.json
  mc admin policy add minio heal-$TIMESTAMP portal-ui/tests/policies/heal.json
  mc admin policy add minio iampolicies-$TIMESTAMP portal-ui/tests/policies/iamPolicies.json
  mc admin policy add minio logs-$TIMESTAMP portal-ui/tests/policies/logs.json
  mc admin policy add minio notificationendpoints-$TIMESTAMP portal-ui/tests/policies/notificationEndpoints.json
  mc admin policy add minio settings-$TIMESTAMP portal-ui/tests/policies/settings.json
  mc admin policy add minio tiers-$TIMESTAMP portal-ui/tests/policies/tiers.json
  mc admin policy add minio trace-$TIMESTAMP portal-ui/tests/policies/trace.json
  mc admin policy add minio users-$TIMESTAMP portal-ui/tests/policies/users.json
  mc admin policy add minio watch-$TIMESTAMP portal-ui/tests/policies/watch.json
  mc admin policy add minio bucketwriteprefixonlypolicy-$TIMESTAMP portal-ui/tests/policies/bucketWritePrefixOnlyPolicy.json
  mc admin policy add minio inspect-allowed-$TIMESTAMP portal-ui/tests/policies/inspect-allowed.json
  mc admin policy add minio inspect-not-allowed-$TIMESTAMP portal-ui/tests/policies/inspect-not-allowed.json
  mc admin policy add minio fix-prefix-policy-ui-crash-$TIMESTAMP portal-ui/tests/policies/fix-prefix-policy-ui-crash.json
  mc admin policy add minio delete-object-with-prefix-$TIMESTAMP portal-ui/tests/policies/deleteObjectWithPrefix.json
  mc admin policy add minio conditions-policy-$TIMESTAMP portal-ui/tests/policies/conditionsPolicy.json
  mc admin policy add minio conditions-policy-2-$TIMESTAMP portal-ui/tests/policies/conditionsPolicy2.json
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
}

create_buckets() {
  mc mb minio/testcafe && mc cp ./portal-ui/tests/uploads/test.txt minio/testcafe/write/test.txt
  mc mb minio/test && mc cp ./portal-ui/tests/uploads/test.txt minio/test/test.txt && mc cp ./portal-ui/tests/uploads/test.txt minio/test/digitalinsights/xref_cust_guid_actd-v1.txt && mc cp ./portal-ui/tests/uploads/test.txt minio/test/digitalinsights/test.txt
  mc mb minio/testcondition && mc cp ./portal-ui/tests/uploads/test.txt minio/testcondition/test.txt && mc cp ./portal-ui/tests2/uploads/test.txt minio/testcondition/firstlevel/xref_cust_guid_actd-v1.txt && mc cp ./portal-ui/tests/uploads/test.txt minio/testcondition/firstlevel/test.txt && mc cp ./portal-ui/tests/uploads/test.txt minio/testcondition/firstlevel/secondlevel/test.txt && mc cp ./portal-ui/tests/uploads/test.txt minio/testcondition/firstlevel/secondlevel/thirdlevel/test.txt
}

assign_policies() {
  mc admin policy set minio bucketassignpolicy-$TIMESTAMP user=bucketassignpolicy-$TIMESTAMP
  mc admin policy set minio bucketread-$TIMESTAMP user=bucketread-$TIMESTAMP
  mc admin policy set minio bucketwrite-$TIMESTAMP user=bucketwrite-$TIMESTAMP
  mc admin policy set minio bucketreadwrite-$TIMESTAMP user=bucketreadwrite-$TIMESTAMP
  mc admin policy set minio bucketreadwrite-$TIMESTAMP user=bucketobjecttags-$TIMESTAMP
  mc admin policy set minio bucketcannottag-$TIMESTAMP user=bucketcannottag-$TIMESTAMP
  mc admin policy set minio bucketspecific-$TIMESTAMP user=bucketspecific-$TIMESTAMP
  mc admin policy set minio dashboard-$TIMESTAMP user=dashboard-$TIMESTAMP
  mc admin policy set minio diagnostics-$TIMESTAMP user=diagnostics-$TIMESTAMP
  mc admin policy set minio groups-$TIMESTAMP user=groups-$TIMESTAMP
  mc admin policy set minio heal-$TIMESTAMP user=heal-$TIMESTAMP
  mc admin policy set minio iampolicies-$TIMESTAMP user=iampolicies-$TIMESTAMP
  mc admin policy set minio logs-$TIMESTAMP user=logs-$TIMESTAMP
  mc admin policy set minio notificationendpoints-$TIMESTAMP user=notificationendpoints-$TIMESTAMP
  mc admin policy set minio settings-$TIMESTAMP user=settings-$TIMESTAMP
  mc admin policy set minio tiers-$TIMESTAMP user=tiers-$TIMESTAMP
  mc admin policy set minio trace-$TIMESTAMP user=trace-$TIMESTAMP
  mc admin policy set minio users-$TIMESTAMP user=users-$TIMESTAMP
  mc admin policy set minio watch-$TIMESTAMP user=watch-$TIMESTAMP
  mc admin policy set minio bucketwriteprefixonlypolicy-$TIMESTAMP user=bucketwriteprefixonlypolicy-$TIMESTAMP
  mc admin policy set minio inspect-allowed-$TIMESTAMP user=inspect-allowed-$TIMESTAMP
  mc admin policy set minio inspect-not-allowed-$TIMESTAMP user=inspect-not-allowed-$TIMESTAMP
  mc admin policy set minio delete-object-with-prefix-$TIMESTAMP user=delete-object-with-prefix-$TIMESTAMP
  mc admin policy set minio conditions-policy-$TIMESTAMP user=conditions-$TIMESTAMP
  mc admin policy set minio conditions-policy-2-$TIMESTAMP user=conditions-2-$TIMESTAMP
}