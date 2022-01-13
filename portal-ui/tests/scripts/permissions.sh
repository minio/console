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
}

create_users() {
  mc admin user add minio bucketassignpolicy-$TIMESTAMP bucketassignpolicy
  mc admin user add minio bucketread-$TIMESTAMP bucketread
  mc admin user add minio bucketwrite-$TIMESTAMP bucketwrite
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
}

assign_policies() {
  mc admin policy set minio bucketassignpolicy-$TIMESTAMP user=bucketassignpolicy-$TIMESTAMP
  mc admin policy set minio bucketread-$TIMESTAMP user=bucketread-$TIMESTAMP
  mc admin policy set minio bucketwrite-$TIMESTAMP user=bucketwrite-$TIMESTAMP
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
}

remove_users() {
  mc admin user remove minio bucketassignpolicy-$TIMESTAMP
  mc admin user remove minio bucketread-$TIMESTAMP
  mc admin user remove minio bucketwrite-$TIMESTAMP
  mc admin user remove minio dashboard-$TIMESTAMP
  mc admin user remove minio diagnostics-$TIMESTAMP
  mc admin user remove minio groups-$TIMESTAMP
  mc admin user remove minio heal-$TIMESTAMP
  mc admin user remove minio iampolicies-$TIMESTAMP
  mc admin user remove minio logs-$TIMESTAMP
  mc admin user remove minio notificationendpoints-$TIMESTAMP
  mc admin user remove minio settings-$TIMESTAMP
  mc admin user remove minio tiers-$TIMESTAMP
  mc admin user remove minio trace-$TIMESTAMP
  mc admin user remove minio users-$TIMESTAMP
  mc admin user remove minio watch-$TIMESTAMP
}

remove_policies() {
  mc admin policy remove minio bucketassignpolicy-$TIMESTAMP
  mc admin policy remove minio bucketread-$TIMESTAMP
  mc admin policy remove minio bucketwrite-$TIMESTAMP
  mc admin policy remove minio dashboard-$TIMESTAMP
  mc admin policy remove minio diagnostics-$TIMESTAMP
  mc admin policy remove minio groups-$TIMESTAMP
  mc admin policy remove minio heal-$TIMESTAMP
  mc admin policy remove minio iampolicies-$TIMESTAMP
  mc admin policy remove minio logs-$TIMESTAMP
  mc admin policy remove minio notificationendpoints-$TIMESTAMP
  mc admin policy remove minio settings-$TIMESTAMP
  mc admin policy remove minio tiers-$TIMESTAMP
  mc admin policy remove minio trace-$TIMESTAMP
  mc admin policy remove minio users-$TIMESTAMP
  mc admin policy remove minio watch-$TIMESTAMP
}

cleanup() {
  remove_users
  remove_policies
  pkill console
  kill -9 `lsof -i:5005 -t`
}

__init__() {
  export TIMESTAMP=$(date "+%s")
  echo $TIMESTAMP > portal-ui/tests/constants/timestamp.txt
  export GOPATH=/tmp/gopath
  export PATH=${PATH}:${GOPATH}/bin

  go install github.com/minio/mc@latest

  add_alias

  create_policies
  create_users
  assign_policies
}

main() {
  (yarn start &> /dev/null) & (./console server &> /dev/null) & (testcafe "chrome:headless" portal-ui/tests/permissions/ -q --skip-js-errors)
  cleanup
}

( __init__ "$@" && main "$@" )