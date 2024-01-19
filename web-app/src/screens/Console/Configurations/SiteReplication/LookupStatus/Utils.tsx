import React from "react";
import { StatsResponseType } from "../SiteReplicationStatus";
import { Box } from "mds";

export function syncStatus(mismatch: boolean, set: boolean): string | boolean {
  if (!set) {
    return "";
  }
  return !mismatch;
}

export function isEntityNotFound(
  sites: Partial<StatsResponseType>,
  lookupList: Partial<StatsResponseType>,
  lookupKey: string,
) {
  const siteKeys: string[] = Object.keys(sites);
  return siteKeys.find((sk: string) => {
    // there is no way to find the type of this ! as it is an entry in the structure itself.
    // @ts-ignore
    const result: Record<string, any> = lookupList[sk] || {};
    return !result[lookupKey];
  });
}

export const EntityNotFound = ({
  entityType,
  entityValue,
}: {
  entityType: string;
  entityValue: string;
}) => {
  return (
    <Box
      sx={{
        marginTop: "45px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {entityType}:{" "}
      <Box sx={{ marginLeft: "5px", marginRight: "5px", fontWeight: 600 }}>
        {entityValue}
      </Box>{" "}
      not found.
    </Box>
  );
};
