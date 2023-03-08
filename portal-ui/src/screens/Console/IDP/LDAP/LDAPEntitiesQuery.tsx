// This file is part of MinIO Console Server
// Copyright (c) 2023 MinIO, Inc.
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU Affero General Public License for more details.
//
// You should have received a copy of the GNU Affero General Public License
// along with this program.  If not, see <http://www.gnu.org/licenses/>.

import React, { Fragment, useState } from "react";
import api from "../../../../common/api";
import { ErrorResponseHandler } from "../../../../common/types";
import { setErrorSnackMessage } from "../../../../systemSlice";
import { AppState, useAppDispatch } from "../../../../store";
import {
  AddIcon,
  Box,
  Button,
  Grid,
  InputBox,
  Loader,
  RemoveIcon,
  SectionTitle,
  UptimeIcon,
} from "mds";
import PolicySelectors from "../../Policies/PolicySelectors";
import { useSelector } from "react-redux";
import { LDAPEntitiesResponse } from "./types";
import { DateTime } from "luxon";

const LDAPEntitiesQuery = () => {
  const dispatch = useAppDispatch();

  const [loading, setLoading] = useState<boolean>(false);
  const [users, setUsers] = useState<string[]>([""]);
  const [groups, setGroups] = useState<string[]>([""]);
  const [results, setResults] = useState<LDAPEntitiesResponse | null>(null);

  const selectedPolicies = useSelector(
    (state: AppState) => state.createUser.selectedPolicies
  );

  const searchEntities = () => {
    setLoading(true);

    let data: any = {};

    let cleanPolicies = selectedPolicies.filter((pol) => pol !== "");
    let cleanUsers = users.filter((usr) => usr !== "");
    let cleanGroups = groups.filter((grp) => grp !== "");

    if (cleanPolicies.length > 0) {
      data["policies"] = cleanPolicies;
    }

    if (cleanUsers.length > 0) {
      data["users"] = cleanUsers;
    }

    if (cleanGroups.length > 0) {
      data["groups"] = cleanGroups;
    }

    api
      .invoke("POST", "/api/v1/ldap-entities", data)
      .then((result: LDAPEntitiesResponse) => {
        setResults(result);
        setLoading(false);
      })
      .catch((err: ErrorResponseHandler) => {
        dispatch(setErrorSnackMessage(err));
        setLoading(false);
      });
  };

  const alterUsersList = (addItem: boolean, index: number) => {
    if (addItem) {
      const alterUsers = [...users, ""];
      setUsers(alterUsers);

      return;
    }

    const filteredUsers = users.filter((_, indx) => indx !== index);

    setUsers(filteredUsers);
  };

  const alterGroupsList = (addItem: boolean, index: number) => {
    if (addItem) {
      const alterGroups = [...groups, ""];
      setGroups(alterGroups);

      return;
    }

    const filteredGroups = groups.filter((_, indx) => indx !== index);

    setGroups(filteredGroups);
  };

  return (
    <Box sx={{ marginTop: 15, paddingTop: 0 }} withBorders>
      <Grid container sx={{ marginTop: 5 }}>
        <Grid item sm={12} md={6} lg={5} sx={{ padding: 10, paddingTop: 0 }}>
          <SectionTitle separator>Query Filters</SectionTitle>

          <Box sx={{ padding: "0 10px" }}>
            <h4>Users</h4>
            <Box
              sx={{
                overflowY: "auto",
                minHeight: 220,
                maxHeight: 250,
                "& > div > div": {
                  width: "100%",
                },
              }}
            >
              {users.map((userDat, index) => {
                return (
                  <InputBox
                    id={`search-user-${index}`}
                    key={`search-user-${index}`}
                    value={userDat}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      const usersElements = [...users];
                      usersElements[index] = e.target.value;
                      setUsers(usersElements);
                    }}
                    overlayIcon={
                      users.length === index + 1 ? <AddIcon /> : <RemoveIcon />
                    }
                    overlayAction={() => {
                      alterUsersList(users.length === index + 1, index);
                    }}
                  />
                );
              })}
            </Box>

            <h4>Groups</h4>
            <Box
              sx={{
                overflowY: "auto",
                minHeight: 220,
                maxHeight: 250,
                "& > div > div": {
                  width: "100%",
                },
              }}
            >
              {groups.map((groupDat, index) => {
                return (
                  <InputBox
                    id={`search-group-${index}`}
                    key={`search-group-${index}`}
                    value={groupDat}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      const groupsElements = [...groups];
                      groupsElements[index] = e.target.value;
                      setGroups(groupsElements);
                    }}
                    overlayIcon={
                      groups.length === index + 1 ? <AddIcon /> : <RemoveIcon />
                    }
                    overlayAction={() => {
                      alterGroupsList(groups.length === index + 1, index);
                    }}
                  />
                );
              })}
            </Box>

            <h4>Policies</h4>
            <Box
              sx={{
                minHeight: 220,
                maxHeight: "calc(100vh - 740px)",
              }}
            >
              <PolicySelectors selectedPolicy={selectedPolicies} noTitle />
            </Box>
          </Box>
        </Grid>
        <Grid item sm={12} md={6} lg={7} sx={{ padding: 10, paddingTop: 0 }}>
          {loading ? (
            <Box sx={{ textAlign: "center" }}>
              <Loader />
            </Box>
          ) : (
            <Fragment>
              <SectionTitle
                separator
                sx={{ marginBottom: 15 }}
                actions={
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                      fontSize: 14,
                    }}
                  >
                    {results?.timestamp ? (
                      <Fragment>
                        <UptimeIcon
                          style={{ width: 18, height: 18, marginRight: 5 }}
                        />
                        {DateTime.fromISO(results.timestamp).toFormat(
                          "D HH:mm:ss"
                        )}
                      </Fragment>
                    ) : (
                      ""
                    )}
                  </Box>
                }
              >
                Results
              </SectionTitle>
              {results ? (
                <Box>
                  {!results.groups && !results.users && !results.policies && (
                    <Box sx={{ textAlign: "center" }}>
                      <h4>No Results Available</h4>
                    </Box>
                  )}
                  {!!results.groups && (
                    <Box className={"resultElement"}>
                      <SectionTitle separator sx={{ fontSize: 12 }}>
                        Group Mappings
                      </SectionTitle>
                      <Box sx={{ padding: "0 15px" }}>
                        {results.groups.map((groupData, index) => {
                          return (
                            <Fragment key={`policy-res-${index}`}>
                              <h4>{groupData.group}</h4>
                              {groupData.policies && (
                                <Fragment>
                                  Policies:
                                  <ul>
                                    {groupData.policies.map(
                                      (policy, index2) => (
                                        <li key={`policy-group-${index2}`}>
                                          {policy}
                                        </li>
                                      )
                                    )}
                                  </ul>
                                </Fragment>
                              )}
                            </Fragment>
                          );
                        })}
                      </Box>
                    </Box>
                  )}
                  {!!results.users && (
                    <Box className={"resultElement"}>
                      <SectionTitle separator sx={{ fontSize: 12 }}>
                        User Mappings
                      </SectionTitle>
                      <Box sx={{ padding: "0 15px" }}>
                        {results.users.map((groupData, index) => {
                          return (
                            <Fragment key={`users-res-${index}`}>
                              <h4>{groupData.user}</h4>
                              {groupData.policies && (
                                <Fragment>
                                  Policies:
                                  <ul>
                                    {groupData.policies.map(
                                      (policy, index2) => (
                                        <li key={`policy-users-${index2}`}>
                                          {policy}
                                        </li>
                                      )
                                    )}
                                  </ul>
                                </Fragment>
                              )}
                            </Fragment>
                          );
                        })}
                      </Box>
                    </Box>
                  )}
                  {!!results.policies && (
                    <Box className={"resultElement"}>
                      <SectionTitle separator sx={{ fontSize: 12 }}>
                        Policy Mappings
                      </SectionTitle>
                      <Box sx={{ padding: "0 15px" }}>
                        {results.policies.map((groupData, index) => {
                          return (
                            <Fragment key={`policy-map-${index}`}>
                              <h4>{groupData.policy}</h4>
                              {groupData.groups && (
                                <Fragment>
                                  Groups:
                                  <ul>
                                    {groupData.groups.map((group, index2) => (
                                      <li key={`policy-map-group-${index}`}>
                                        {group}
                                      </li>
                                    ))}
                                  </ul>
                                </Fragment>
                              )}
                              {groupData.users && (
                                <Fragment>
                                  Users:
                                  <ul>
                                    {groupData.users.map((user, index3) => (
                                      <li key={`policy-map-user-${index}`}>
                                        {user}
                                      </li>
                                    ))}
                                  </ul>
                                </Fragment>
                              )}
                            </Fragment>
                          );
                        })}
                      </Box>
                    </Box>
                  )}
                </Box>
              ) : (
                <Box sx={{ textAlign: "center" }}>No query results yet</Box>
              )}
            </Fragment>
          )}
        </Grid>
      </Grid>
      <Grid container>
        <Grid item xs={12} sx={{ display: "flex", justifyContent: "flex-end" }}>
          <Button
            id={"search-entity"}
            type={"button"}
            variant={"callAction"}
            onClick={searchEntities}
          >
            Search
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default LDAPEntitiesQuery;
