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

import React, { Fragment } from "react";
import { Box, CollapseCaret, GroupsMenuIcon, SectionTitle } from "mds";
import { LdapEntities } from "api/consoleApi";

interface IResultBlock {
  entityName: "Group" | "User" | "Policy";
  results: LdapEntities;
}

interface IEntityResultName {
  name: string;
}

interface IEntityResultItem {
  blockName: "Policies" | "Groups" | "Users";
  results: string[];
}

const EntityResultTitle = ({ name }: IEntityResultName) => {
  return (
    <h4>
      <CollapseCaret style={{ transform: "rotateZ(90deg)" }} />
      {name}
    </h4>
  );
};

const EntityResultItems = ({ blockName, results }: IEntityResultItem) => {
  return (
    <Fragment>
      <strong>{blockName}:</strong>
      <ul>
        {results.map((res, index) => (
          <li key={`policy-${blockName}-${index}`}>{res}</li>
        ))}
      </ul>
    </Fragment>
  );
};

const LDAPResultsBlock = ({ entityName, results }: IResultBlock) => {
  let entityLength = 0;

  switch (entityName) {
    case "Group":
      entityLength = results.groups?.length || 0;
      break;
    case "Policy":
      entityLength = results.policies?.length || 0;
      break;
    case "User":
      entityLength = results.users?.length || 0;
      break;
  }

  return (
    <Box
      className={"resultElement"}
      sx={{
        marginTop: 50,
        "&:first-of-type": {
          marginTop: 0,
        },
      }}
    >
      <SectionTitle
        separator
        sx={{ fontSize: 12 }}
        icon={<GroupsMenuIcon style={{ width: 17, height: 17 }} />}
        actions={
          <Box sx={{ fontSize: 14 }}>
            <strong>{entityLength}</strong> Entit
            {entityLength === 1 ? "y" : "ies"} Found
          </Box>
        }
      >
        {entityName} Mappings
      </SectionTitle>
      <Box
        className={"resultsList"}
        sx={{
          h4: {
            borderBottom: "#e2e2e2 1px solid",
            padding: "12px 0",
            margin: 0,
            marginBottom: 15,
            display: "flex",
            alignItems: "center",
            "& svg": {
              marginRight: 10,
              fill: "#3C77A7",
            },
          },
        }}
      >
        {entityName === "Group" &&
          results.groups?.map((groupData, index) => {
            return (
              <Fragment key={`policy-res-${index}`}>
                <EntityResultTitle name={groupData.group || ""} />
                {groupData.policies && (
                  <EntityResultItems
                    blockName={"Policies"}
                    results={groupData.policies}
                  />
                )}
              </Fragment>
            );
          })}
        {entityName === "User" &&
          results.users?.map((groupData, index) => {
            return (
              <Fragment key={`users-res-${index}`}>
                <EntityResultTitle name={groupData.user || ""} />
                {groupData.policies && (
                  <EntityResultItems
                    blockName={"Policies"}
                    results={groupData.policies}
                  />
                )}
              </Fragment>
            );
          })}
        {entityName === "Policy" &&
          results.policies?.map((groupData, index) => {
            return (
              <Fragment key={`policy-map-${index}`}>
                <EntityResultTitle name={groupData.policy || ""} />
                {groupData.groups && (
                  <EntityResultItems
                    blockName={"Groups"}
                    results={groupData.groups}
                  />
                )}
                {groupData.users && (
                  <EntityResultItems
                    blockName={"Users"}
                    results={groupData.users}
                  />
                )}
              </Fragment>
            );
          })}
      </Box>
    </Box>
  );
};

export default LDAPResultsBlock;
