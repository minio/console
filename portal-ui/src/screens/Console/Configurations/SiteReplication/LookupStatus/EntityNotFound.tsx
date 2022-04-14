import React from "react";
import { Box } from "@mui/material";

const EntityNotFound = ({
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

export default EntityNotFound;
