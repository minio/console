import React, { Fragment } from "react";

import { Box } from "@mui/material";
import { HelpIconFilled } from "../../../icons";

interface IContent {
  icon: React.ReactNode;
  text: string;
  iconDescription: string;
}

interface IAddIDPConfigurationHelpBoxProps {
  helpText: string;
  contents: IContent[];
}

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

const AddIDPConfigurationHelpBox = ({
  helpText,
  contents,
}: IAddIDPConfigurationHelpBoxProps) => {
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
          <Fragment>
            {content.icon && (
              <Box sx={{ paddingBottom: "20px" }}>
                <FeatureItem
                  icon={content.icon}
                  description={content.iconDescription}
                />
              </Box>
            )}
            <Box sx={{ paddingBottom: "20px" }}>{content.text}</Box>
          </Fragment>
        ))}
      </Box>
    </Box>
  );
};

export default AddIDPConfigurationHelpBox;
