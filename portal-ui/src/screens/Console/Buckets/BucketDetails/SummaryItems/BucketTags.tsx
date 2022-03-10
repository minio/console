// This file is part of MinIO Console Server
// Copyright (c) 2022 MinIO, Inc.
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU Affero General Public License for more details.
//
// You should have received a copy of the GNU Affero General Public License
// along with this program.  If not, see <http://www.gnu.org/licenses/>.
import React, { useEffect, useState } from "react";
import { Bucket } from "../../../Watch/types";
import { ErrorResponseHandler } from "../../../../../common/types";
import useApi from "../../../Common/Hooks/useApi";
import { Box } from "@mui/material";
import { IAM_SCOPES } from "../../../../../common/SecureComponent/permissions";
import { SecureComponent } from "../../../../../common/SecureComponent";
import get from "lodash/get";
import Chip from "@mui/material/Chip";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import withSuspense from "../../../Common/Components/withSuspense";
import Loader from "../../../Common/Loader/Loader";

const AddBucketTagModal = withSuspense(
  React.lazy(() => import("../AddBucketTagModal"))
);
const DeleteBucketTagModal = withSuspense(
  React.lazy(() => import("../DeleteBucketTagModal"))
);

type BucketTagProps = {
  setErrorSnackMessage: (err: ErrorResponseHandler) => void;
  bucketName: string;
};

const BucketTags = ({ setErrorSnackMessage, bucketName }: BucketTagProps) => {
  const [tags, setTags] = useState<any>(null);
  const [tagModalOpen, setTagModalOpen] = useState<boolean>(false);
  const [tagKeys, setTagKeys] = useState<string[]>([]);
  const [selectedTag, setSelectedTag] = useState<string[]>(["", ""]);
  const [deleteTagModalOpen, setDeleteTagModalOpen] = useState<boolean>(false);

  const closeAddTagModal = (refresh: boolean) => {
    setTagModalOpen(false);
    if (refresh) {
      fetchTags();
    }
  };

  const deleteTag = (tagKey: string, tagLabel: string) => {
    setSelectedTag([tagKey, tagLabel]);
    setDeleteTagModalOpen(true);
  };

  const closeDeleteTagModal = (refresh: boolean) => {
    setDeleteTagModalOpen(false);

    if (refresh) {
      fetchTags();
    }
  };

  const onTagLoaded = (res: Bucket) => {
    if (res != null && res?.details != null) {
      setTags(res?.details?.tags);
      setTagKeys(Object.keys(res?.details?.tags));
    }
  };

  const onTagLoadFailed = (err: ErrorResponseHandler) => {
    setErrorSnackMessage(err);
  };

  const [isLoading, invokeTagsApi] = useApi(onTagLoaded, onTagLoadFailed);

  const fetchTags = () => {
    invokeTagsApi("GET", `/api/v1/buckets/${bucketName}`);
  };

  useEffect(() => {
    fetchTags();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bucketName]);

  return (
    <Box>
      {isLoading ? <Loader style={{ width: 16, height: 16 }} /> : null}
      <SecureComponent
        scopes={[IAM_SCOPES.S3_GET_BUCKET_TAGGING]}
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
              tagKeys.map((tagKey: any, index: any) => {
                const tag = get(tags, `${tagKey}`, "");
                if (tag !== "") {
                  return (
                    <SecureComponent
                      key={`chip-${index}`}
                      scopes={[IAM_SCOPES.S3_PUT_BUCKET_TAGGING]}
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
                          deleteTag(tagKey, tag);
                        }}
                      />
                    </SecureComponent>
                  );
                }
                return null;
              })}
          </Box>

          <SecureComponent
            scopes={[IAM_SCOPES.S3_PUT_BUCKET_TAGGING]}
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
              onClick={() => {
                setTagModalOpen(true);
              }}
            />
          </SecureComponent>
        </Box>
      </SecureComponent>

      {/** Modals **/}

      {tagModalOpen && (
        <AddBucketTagModal
          modalOpen={tagModalOpen}
          currentTags={tags}
          bucketName={bucketName}
          onCloseAndUpdate={closeAddTagModal}
        />
      )}
      {deleteTagModalOpen && (
        <DeleteBucketTagModal
          deleteOpen={deleteTagModalOpen}
          currentTags={tags}
          bucketName={bucketName}
          onCloseAndUpdate={closeDeleteTagModal}
          selectedTag={selectedTag}
        />
      )}
    </Box>
  );
};

export default BucketTags;
