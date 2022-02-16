import { Box } from "@mui/material";
import {
  CallHomeFeatureIcon,
  DiagnosticsFeatureIcon,
  HelpIconFilled,
  PerformanceFeatureIcon,
} from "../../../icons";
import React from "react";

const FeatureItem = ({
  icon,
  description,
}: {
  icon: any;
  description: string;
}) => {
  return (
    <Box
      sx={{
        display: "flex",
        "& .min-icon": {
          marginRight: "10px",
          height: "23px",
          width: "23px",
          marginBottom: "10px",
        },
      }}
    >
      {icon}{" "}
      <div style={{ fontSize: "14px", fontStyle: "italic", color: "#5E5E5E" }}>
        {description}
      </div>
    </Box>
  );
};
const RegisterHelpBox = ({ hasMargin = true }: { hasMargin?: boolean }) => {
  return (
    <Box
      sx={{
        flex: 1,
        border: "1px solid #eaeaea",
        borderRadius: "2px",
        display: "flex",
        flexFlow: "column",
        padding: "20px",
        marginLeft: {
          xs: "0px",
          sm: "0px",
          md: hasMargin ? "30px" : "",
        },
        marginTop: {
          xs: "0px",
          sm: hasMargin ? "30px" : "",
        },
      }}
    >
      <Box
        sx={{
          fontSize: "16px",
          fontWeight: 600,
          display: "flex",
          alignItems: "center",
          marginBottom: "16px",

          "& .min-icon": {
            height: "21px",
            width: "21px",
            marginRight: "15px",
          },
        }}
      >
        <HelpIconFilled />
        <div>Why should I register?</div>
      </Box>
      <Box sx={{ fontSize: "14px", marginBottom: "15px" }}>
        Registering this cluster with the MinIO Subscription Network (SUBNET)
        provides the following benefits in addition to the commercial license
        and SLA backed support.
      </Box>

      <Box
        sx={{
          display: "flex",
          flexFlow: "column",
        }}
      >
        <FeatureItem
          icon={<CallHomeFeatureIcon />}
          description={`Call Home Monitoring`}
        />
        <FeatureItem
          icon={<DiagnosticsFeatureIcon />}
          description={`Health Diagnostics`}
        />
        <FeatureItem
          icon={<PerformanceFeatureIcon />}
          description={`Performance Analysis`}
        />
      </Box>
    </Box>
  );
};

export default RegisterHelpBox;
