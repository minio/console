import { Box } from "@mui/material";
import {
  HelpIconFilled,
  AddMembersToGroupIcon,
  CreateUserIcon,
  ChangeAccessPolicyIcon,
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
const AddUserHelpBox = ({ hasMargin = true }: { hasMargin?: boolean }) => {
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
        <div>Learn more about the Users feature</div>
      </Box>
      <Box sx={{ fontSize: "14px", marginBottom: "15px" }}>
         A MinIO user consists of a unique access key (username)
                        and corresponding secret key (password). Clients must
                        authenticate their identity by specifying both a valid
                        access key (username) and the corresponding secret key
                        (password) of an existing MinIO user.
                        <br />
                        <br />
                        Each user can have one or more assigned policies that
                        explicitly list the actions and resources to which that
                        user has access. Users can also inherit policies from
                        the groups in which they have membership.
                        <br />
      </Box>

      <Box
        sx={{
          display: "flex",
          flexFlow: "column",
        }}
      >
        <FeatureItem
          icon={<CreateUserIcon />}
          description={`Create Users`}
        />
        <FeatureItem
          icon={<AddMembersToGroupIcon />}
          description={`Manage Groups`}
        />
        <FeatureItem
          icon={<ChangeAccessPolicyIcon />}
          description={`Assign Policies`}
        />
      </Box>
    </Box>
  );
};

export default AddUserHelpBox;
