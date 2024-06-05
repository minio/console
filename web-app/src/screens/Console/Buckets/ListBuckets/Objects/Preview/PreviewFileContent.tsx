// This file is part of MinIO Console Server
// Copyright (c) 2021 MinIO, Inc.
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

import React, { Fragment, useCallback, useEffect, useState } from "react";
import { ProgressBar, Grid, Box, InformativeMessage } from "mds";
import get from "lodash/get";
import { AllowedPreviews, previewObjectType } from "../utils";
import { api } from "../../../../../../api";
import PreviewPDF from "./PreviewPDF";
import { downloadObject } from "../../../../ObjectBrowser/utils";
import { useAppDispatch } from "../../../../../../store";
import { BucketObject } from "../../../../../../api/consoleApi";

interface IPreviewFileProps {
  bucketName: string;
  actualInfo: BucketObject;
  isFullscreen?: boolean;
}

const PreviewFile = ({
  bucketName,
  actualInfo,
  isFullscreen = false,
}: IPreviewFileProps) => {
  const dispatch = useAppDispatch();

  const [loading, setLoading] = useState<boolean>(true);

  const [metaData, setMetaData] = useState<any>(null);
  const [isMetaDataLoaded, setIsMetaDataLoaded] = useState(false);

  const objectName = actualInfo?.name || "";

  const fetchMetadata = useCallback(() => {
    if (!isMetaDataLoaded) {
      api.buckets
        .getObjectMetadata(bucketName, {
          prefix: objectName,
          versionID: actualInfo.version_id || "",
        })
        .then((res) => {
          let metadata = get(res.data, "objectMetadata", {});
          setIsMetaDataLoaded(true);
          setMetaData(metadata);
        })
        .catch((err) => {
          console.error(
            "Error Getting Metadata Status: ",
            err,
            err?.detailedError,
          );
          setIsMetaDataLoaded(true);
        });
    }
  }, [bucketName, objectName, isMetaDataLoaded, actualInfo.version_id]);

  useEffect(() => {
    if (bucketName && objectName) {
      fetchMetadata();
    }
  }, [bucketName, objectName, fetchMetadata]);

  let path = "";

  if (actualInfo) {
    let basename = document.baseURI.replace(window.location.origin, "");
    path = `${window.location.origin}${basename}api/v1/buckets/${encodeURIComponent(bucketName)}/objects/download?preview=true&prefix=${encodeURIComponent(actualInfo.name || "")}`;
    if (actualInfo.version_id) {
      path = path.concat(`&version_id=${actualInfo.version_id}`);
    }
  }

  let objectType: AllowedPreviews = previewObjectType(metaData, objectName);

  const iframeLoaded = () => {
    setLoading(false);
  };

  return (
    <Fragment>
      {objectType !== "none" && loading && (
        <Grid item xs={12}>
          <ProgressBar />
        </Grid>
      )}
      {isMetaDataLoaded ? (
        <Box
          sx={{
            textAlign: "center",
            "& .iframeContainer": {
              border: "0px",
              flex: "1 1 auto",
              width: "100%",
              height: 250,
              backgroundColor: "transparent",
              borderRadius: 5,

              "&.image": {
                height: 500,
              },
              "&.audio": {
                height: 150,
              },
              "&.video": {
                height: 350,
              },
              "&.fullHeight": {
                height: "calc(100vh - 185px)",
              },
            },
            "& .iframeBase": {
              backgroundColor: "#fff",
            },
            "& .iframeHidden": {
              display: "none",
            },
          }}
        >
          {objectType === "video" && (
            <video
              style={{
                width: "auto",
                height: "auto",
                maxWidth: "calc(100vw - 100px)",
                maxHeight: "calc(100vh - 200px)",
              }}
              autoPlay={true}
              controls={true}
              muted={false}
              playsInline={true}
              onPlay={iframeLoaded}
            >
              <source src={path} type="video/mp4" />
            </video>
          )}
          {objectType === "audio" && (
            <audio
              style={{
                width: "100%",
                height: "auto",
              }}
              autoPlay={true}
              controls={true}
              muted={false}
              playsInline={true}
              onPlay={iframeLoaded}
            >
              <source src={path} type="audio/mpeg" />
            </audio>
          )}
          {objectType === "image" && (
            <img
              style={{
                width: "auto",
                height: "auto",
                maxWidth: "100vw",
                maxHeight: "100vh",
              }}
              src={path}
              alt={"preview"}
              onLoad={iframeLoaded}
            />
          )}
          {objectType === "pdf" && (
            <Fragment>
              <PreviewPDF
                path={path}
                onLoad={iframeLoaded}
                loading={loading}
                downloadFile={() =>
                  downloadObject(dispatch, bucketName, path, actualInfo)
                }
              />
            </Fragment>
          )}
          {objectType === "none" && (
            <div>
              <InformativeMessage
                message=" File couldn't be previewed using file extension or mime type. Please
            try Download instead"
                title="Preview unavailable"
                sx={{ margin: "15px 0" }}
              />
            </div>
          )}
          {objectType !== "none" &&
            objectType !== "video" &&
            objectType !== "audio" &&
            objectType !== "image" &&
            objectType !== "pdf" && (
              <div className={`iframeBase ${loading ? "iframeHidden" : ""}`}>
                <iframe
                  src={path}
                  title="File Preview"
                  allowTransparency
                  className={`iframeContainer ${
                    isFullscreen ? "fullHeight" : objectType
                  }`}
                  onLoad={iframeLoaded}
                >
                  File couldn't be loaded. Please try Download instead
                </iframe>
              </div>
            )}
        </Box>
      ) : null}
    </Fragment>
  );
};
export default PreviewFile;
