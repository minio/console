import { Box } from "@mui/material";
import React from "react";

export function syncStatus(mismatch: boolean, set: boolean): string | boolean {
  if (!set) {
    return "";
  }
  return !mismatch;
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
