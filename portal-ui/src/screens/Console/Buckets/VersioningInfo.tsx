import React from "react";
import { Box } from "@mui/material";
import { BucketVersioningInfo } from "./types";
import LabelWithIcon from "./BucketDetails/SummaryItems/LabelWithIcon";
import { DisabledIcon, EnabledIcon } from "mds";

const VersioningInfo = ({
  versioningState = {},
}: {
  versioningState?: BucketVersioningInfo;
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
        {versioningState.ExcludeFolders ? (
          <LabelWithIcon
            icon={
              versioningState.ExcludeFolders ? (
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
      {versioningState.ExcludedPrefixes?.length ? (
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
            {versioningState.ExcludedPrefixes?.map((it) => (
              <div>
                <strong>{it.Prefix}</strong>
              </div>
            ))}
          </div>
        </Box>
      ) : null}
    </Box>
  );
};

export default VersioningInfo;
