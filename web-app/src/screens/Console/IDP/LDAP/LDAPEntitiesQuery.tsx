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
import {
  AddIcon,
  Box,
  Button,
  Grid,
  InputBox,
  Loader,
  RemoveIcon,
  SearchIcon,
  SectionTitle,
  TimeIcon,
} from "mds";
import { useSelector } from "react-redux";
import { DateTime } from "luxon";
import { api } from "api";
import { errorToHandler } from "api/errors";
import { LdapEntities } from "api/consoleApi";
import { setErrorSnackMessage } from "../../../../systemSlice";
import { AppState, useAppDispatch } from "../../../../store";
import LDAPResultsBlock from "./LDAPResultsBlock";
import PolicySelectors from "../../Policies/PolicySelectors";

const LDAPEntitiesQuery = () => {
  const dispatch = useAppDispatch();

  const [loading, setLoading] = useState<boolean>(false);
  const [users, setUsers] = useState<string[]>([""]);
  const [groups, setGroups] = useState<string[]>([""]);
  const [results, setResults] = useState<LdapEntities | null>(null);

  const selectedPolicies = useSelector(
    (state: AppState) => state.createUser.selectedPolicies,
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

    api.ldapEntities
      .getLdapEntities(data)
      .then((result) => {
        setResults(result.data);
        setLoading(false);
      })
      .catch((err) => {
        dispatch(setErrorSnackMessage(errorToHandler(err.error)));
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
    <Box sx={{ marginTop: 15, paddingTop: 0 }}>
      <Grid container sx={{ marginTop: 5 }}>
        <Grid item sm={12} md={6} lg={5} sx={{ padding: 10, paddingTop: 0 }}>
          <SectionTitle>Query Filters</SectionTitle>

          <Box
            sx={{
              padding: "0 10px",
              display: "flex",
              flexDirection: "column",
              gap: 40,
            }}
          >
            <Box sx={{ padding: "10px 26px" }} withBorders>
              <Box sx={{ display: "flex" }}>
                <h4 style={{ margin: 0, marginBottom: 10, fontSize: 14 }}>
                  Users
                </h4>
              </Box>
              <Box
                sx={{
                  overflowY: "auto",
                  minHeight: 50,
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
                        users.length === index + 1 ? (
                          <AddIcon />
                        ) : (
                          <RemoveIcon />
                        )
                      }
                      overlayAction={() => {
                        alterUsersList(users.length === index + 1, index);
                      }}
                    />
                  );
                })}
              </Box>
            </Box>
            <Box sx={{ padding: "10px 26px" }} withBorders>
              <h4 style={{ margin: 0, marginBottom: 10, fontSize: 14 }}>
                Groups
              </h4>
              <Box
                sx={{
                  overflowY: "auto",
                  minHeight: 50,
                  maxHeight: "calc(100vh - 340px)",
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
                        groups.length === index + 1 ? (
                          <AddIcon />
                        ) : (
                          <RemoveIcon />
                        )
                      }
                      overlayAction={() => {
                        alterGroupsList(groups.length === index + 1, index);
                      }}
                    />
                  );
                })}
              </Box>
            </Box>
            <Box sx={{ padding: "10px 26px" }} withBorders>
              <h4 style={{ margin: 0, marginBottom: 10, fontSize: 14 }}>
                Policies
              </h4>
              <Box
                sx={{
                  minHeight: 265,
                  maxHeight: "calc(100vh - 740px)",
                }}
              >
                <PolicySelectors selectedPolicy={selectedPolicies} noTitle />
              </Box>
            </Box>
          </Box>
        </Grid>
        <Grid
          item
          sm={12}
          md={6}
          lg={7}
          sx={{
            padding: 10,
            paddingTop: 0,
            display: "flex",
            flexDirection: "column",
          }}
        >
          {loading ? (
            <Box sx={{ textAlign: "center" }}>
              <Loader />
            </Box>
          ) : (
            <Fragment>
              <SectionTitle
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
                        <TimeIcon
                          style={{
                            width: 14,
                            height: 14,
                            marginRight: 5,
                            fill: "#BEBFBF",
                          }}
                        />
                        {DateTime.fromISO(results.timestamp).toFormat(
                          "D HH:mm:ss",
                        )}
                      </Fragment>
                    ) : (
                      ""
                    )}
                  </Box>
                }
              >
                Query Results
              </SectionTitle>
              {results ? (
                <Box
                  sx={{
                    backgroundColor: "#FBFAFA",
                    padding: "8px 22px",
                    flexGrow: 1,
                    overflowY: "auto",
                  }}
                >
                  {!results.groups && !results.users && !results.policies && (
                    <Box sx={{ textAlign: "center" }}>
                      <h4>No Results Available</h4>
                    </Box>
                  )}
                  {!!results.groups && (
                    <LDAPResultsBlock results={results} entityName={"Group"} />
                  )}
                  {!!results.users && (
                    <LDAPResultsBlock results={results} entityName={"User"} />
                  )}
                  {!!results.policies && (
                    <LDAPResultsBlock results={results} entityName={"Policy"} />
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
        <Grid
          item
          xs={12}
          sx={{
            display: "flex",
            justifyContent: "flex-start",
            marginTop: 45,
            padding: "0 20px",
          }}
        >
          <Button
            id={"search-entity"}
            type={"button"}
            variant={"callAction"}
            onClick={searchEntities}
            icon={<SearchIcon />}
          >
            Search
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default LDAPEntitiesQuery;
