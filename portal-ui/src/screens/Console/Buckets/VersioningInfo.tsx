import React from "react";
import { Box } from "@mui/material";
import LabelWithIcon from "./BucketDetails/SummaryItems/LabelWithIcon";
import { DisabledIcon, EnabledIcon } from "mds";
import { BucketVersioningResponse } from "api/consoleApi";

const VersioningInfo = ({
  versioningState = {},
}: {
  versioningState?: BucketVersioningResponse;
}) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 2,
      }}
    >
      <Box sx={{ fontWeight: "medium", display: "flex", gap: 2 }}>
        {versioningState.excludeFolders ? (
          <LabelWithIcon
            icon={
              versioningState.excludeFolders ? (
                <EnabledIcon style={{ color: "green" }} />
              ) : (
                <DisabledIcon />
              )
            }
            label={
              <label style={{ textDecoration: "normal" }}>
                Exclude Folders
              </label>
            }
          />
        ) : null}
      </Box>
      {versioningState.excludedPrefixes?.length ? (
        <Box
          sx={{
            fontWeight: "medium",
            display: "flex",
            justifyItems: "end",
            placeItems: "flex-start",
            flexDirection: "column",
            gap: 1,
          }}
        >
          <Box>Excluded Prefixes :</Box>
          <div
            style={{
              maxHeight: "200px",
              overflowY: "auto",
              placeItems: "flex-start",
              justifyItems: "end",
              flexDirection: "column",
              display: "flex",
            }}
          >
            {versioningState.excludedPrefixes?.map((it) => (
              <div>
                <strong>{it.prefix}</strong>
              </div>
            ))}
          </div>
        </Box>
      ) : null}
    </Box>
  );
};

export default VersioningInfo;
