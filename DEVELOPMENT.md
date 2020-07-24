# LDAP authentication with Console

## Setup

Run openLDAP with docker.

```
$ docker run --rm -p 389:389 -p 636:636 --name my-openldap-container --detach osixia/openldap:1.3.0
```

Run the `billy.ldif` file using `ldapadd` command to create a new user and assign it to a group.

```
$ cat > billy.ldif << EOF
# LDIF fragment to create group branch under root
dn: uid=billy,dc=example,dc=org
uid: billy
cn: billy
sn: 3
objectClass: top
objectClass: posixAccount
objectClass: inetOrgPerson
loginShell: /bin/bash
homeDirectory: /home/billy
uidNumber: 14583102
gidNumber: 14564100
userPassword: {SSHA}j3lBh1Seqe4rqF1+NuWmjhvtAni1JC5A
mail: billy@example.org
gecos: Billy User
# Create base group
dn: ou=groups,dc=example,dc=org
objectclass:organizationalunit
ou: groups
description: generic groups branch
# create consoleAdmin group (this already exists on minio and have a policy of s3::*)
dn: cn=consoleAdmin,ou=groups,dc=example,dc=org
objectClass: top
objectClass: posixGroup
gidNumber: 678
# Assing group to new user
dn: cn=consoleAdmin,ou=groups,dc=example,dc=org
changetype: modify
add: memberuid
memberuid: billy
EOF

$ docker cp billy.ldif my-openldap-container:/container/service/slapd/assets/test/billy.ldif
$ docker exec my-openldap-container ldapadd -x -D "cn=admin,dc=example,dc=org" -w admin -f /container/service/slapd/assets/test/billy.ldif -H ldap://localhost -ZZ
```

Query the ldap server to check the user billy was created correctly and got assigned to the consoleAdmin group, you should get a list 
containing ldap users and groups.

```
$ docker exec my-openldap-container ldapsearch -x -H ldap://localhost -b dc=example,dc=org -D "cn=admin,dc=example,dc=org" -w admin
```

Query the ldap server again, this time filtering only for the user `billy`, you should see only 1 record.

```
$ docker exec my-openldap-container ldapsearch -x -H ldap://localhost -b uid=billy,dc=example,dc=org -D "cn=admin,dc=example,dc=org" -w admin
```

### Change the password for user billy

Set the new password for `billy` to `minio123` and enter `admin` as the default `LDAP Password` 

```
$ docker exec -it my-openldap-container /bin/bash
# ldappasswd -H ldap://localhost -x -D "cn=admin,dc=example,dc=org" -W -S "uid=billy,dc=example,dc=org"
New password:
Re-enter new password:
Enter LDAP Password:
```

### Add the consoleAdmin policy to user billy on MinIO
```
$ cat > consoleAdmin.json << EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": [
        "admin:*"
      ],
      "Effect": "Allow",
      "Sid": ""
    },
    {
      "Action": [
        "s3:*"
      ],
      "Effect": "Allow",
      "Resource": [
        "arn:aws:s3:::*"
      ],
      "Sid": ""
    }
  ]
}
EOF
$ mc admin policy add myminio consoleAdmin consoleAdmin.json
$ mc admin policy set myminio consoleAdmin user=billy
```

## Run MinIO

```
export MINIO_ACCESS_KEY=minio
export MINIO_SECRET_KEY=minio123
export MINIO_IDENTITY_LDAP_SERVER_ADDR='localhost:389'
export MINIO_IDENTITY_LDAP_USERNAME_FORMAT='uid=%s,dc=example,dc=org'
export MINIO_IDENTITY_LDAP_USERNAME_SEARCH_FILTER='(|(objectclass=posixAccount)(uid=%s))'
export MINIO_IDENTITY_LDAP_TLS_SKIP_VERIFY=on
export MINIO_IDENTITY_LDAP_SERVER_INSECURE=on
./minio server ~/Data
```

## Run Console

```
export CONSOLE_ACCESS_KEY=minio
export CONSOLE_SECRET_KEY=minio123
...
export CONSOLE_LDAP_ENABLED=on
./console server
```
