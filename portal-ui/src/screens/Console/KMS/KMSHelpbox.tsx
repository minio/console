import React from "react";

import { Box } from "@mui/material";
import { HelpIconFilled } from "mds";

interface IKMSHelpBoxProps {
  helpText: string;
  contents: string[];
}

const KMSHelpBox = ({ helpText, contents }: IKMSHelpBoxProps) => {
  return (
    <Box
      sx={{
        flex: 1,
        border: "1px solid #eaeaea",
        borderRadius: "2px",
        display: "flex",
        flexFlow: "column",
        padding: "20px",
      }}
    >
      <Box
        sx={{
          fontSize: "16px",
          fontWeight: 600,
          display: "flex",
          alignItems: "center",
          marginBottom: "16px",
          paddingBottom: "20px",

          "& .min-icon": {
            height: "21px",
            width: "21px",
            marginRight: "15px",
          },
        }}
      >
        <HelpIconFilled />
        <div>{helpText}</div>
      </Box>
      <Box sx={{ fontSize: "14px", marginBottom: "15px" }}>
        {contents.map((content) => (
          <Box sx={{ paddingBottom: "20px" }}>{content}</Box>
        ))}
      </Box>
    </Box>
  );
};

export default KMSHelpBox;
