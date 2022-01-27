import React from "react";
import { IAM_SCOPES } from "../../../../../../common/SecureComponent/permissions";
import { Box } from "@mui/material";
import get from "lodash/get";
import SecureComponent from "../../../../../../common/SecureComponent/SecureComponent";
import Chip from "@mui/material/Chip";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";

const ObjectTags = ({
  tagKeys,
  bucketName,
  onDeleteTag,
  onAddTagClick,
  objectInfo,
}: {
  tagKeys: any;
  bucketName: string;
  onDeleteTag: (key: string, v: string) => void;
  onAddTagClick: () => void;
  objectInfo: any;
}) => {
  return (
    <React.Fragment>
      <SecureComponent
        scopes={[IAM_SCOPES.S3_GET_OBJECT_TAGGING]}
        resource={bucketName}
      >
        <Box
          sx={{
            display: "flex",
            flexFlow: "column",
          }}
        >
          <Box>
            {tagKeys &&
              tagKeys.map((tagKey: string, index: number) => {
                const tag = get(objectInfo, `tags.${tagKey}`, "");
                if (tag !== "") {
                  return (
                    <SecureComponent
                      key={`chip-${index}`}
                      scopes={[IAM_SCOPES.S3_DELETE_OBJECT_TAGGING]}
                      resource={bucketName}
                      matchAll
                      errorProps={{
                        deleteIcon: null,
                        onDelete: null,
                      }}
                    >
                      <Chip
                        style={{
                          textTransform: "none",
                          marginRight: "5px",
                        }}
                        size="small"
                        label={`${tagKey} : ${tag}`}
                        color="primary"
                        deleteIcon={<CloseIcon />}
                        onDelete={() => {
                          onDeleteTag(tagKey, tag);
                        }}
                      />
                    </SecureComponent>
                  );
                }
                return null;
              })}
          </Box>

          <SecureComponent
            scopes={[IAM_SCOPES.S3_PUT_OBJECT_TAGGING]}
            resource={bucketName}
            errorProps={{ disabled: true, onClick: null }}
          >
            <Chip
              style={{ maxWidth: 80, marginTop: "10px" }}
              icon={<AddIcon />}
              clickable
              size="small"
              label="Add tag"
              color="primary"
              variant="outlined"
              onClick={onAddTagClick}
            />
          </SecureComponent>
        </Box>
      </SecureComponent>
    </React.Fragment>
  );
};

export default ObjectTags;
