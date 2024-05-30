// This file is part of MinIO Console Server
// Copyright (c) 2023 MinIO, Inc.
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

import React, { Fragment, useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import styled from "styled-components";
import get from "lodash/get";
import {
  AlertCloseIcon,
  Box,
  Button,
  HelpIcon,
  HelpIconFilled,
  IconButton,
  MinIOTierIcon,
  TabItemProps,
  Tabs,
} from "mds";
import { useSelector } from "react-redux";
import { AppState, useAppDispatch } from "../../store";
import { setHelpTabName } from "../../systemSlice";
import { DocItem } from "./HelpMenu.types";
import HelpTipItem from "./HelpTipItem";
import MoreLink from "../../common/MoreLink";

const HelpMenuContainer = styled.div(({ theme }) => ({
  backgroundColor: get(theme, "bgColor", "#FFF"),
  position: "absolute",
  zIndex: "10",
  border: `${get(theme, "borderColor", "#E2E2E2")} 1px solid`,
  borderRadius: 4,
  boxShadow: "rgba(0, 0, 0, 0.1) 0px 0px 10px",
  width: 754,
  "& .tabsPanels": {
    padding: "15px 0 0",
  },
  "& .helpContainer": {
    maxHeight: 400,
    overflowY: "auto",
    "& .helpItemBlock": {
      padding: 5,
      "&:hover": {
        backgroundColor: get(
          theme,
          "buttons.regular.hover.background",
          "#E6EAEB",
        ),
      },
    },
  },
}));

const HelpTipTabs = () => {
  const helpTopics = require("../Console/helpTipTags.json");

  const [helpItems, setHelpItems] = useState<DocItem[]>([]);
  const [headerDocs, setHeaderDocs] = useState<string | null>(null);
  const [helpItemsVideo, setHelpItemsVideo] = useState<DocItem[]>([]);
  const [headerVideo, setHeaderVideo] = useState<string | null>(null);
  const [helpItemsBlog, setHelpItemsBlog] = useState<DocItem[]>([]);
  const [headerBlog, setHeaderBlog] = useState<string | null>(null);

  const systemHelpName = useSelector(
    (state: AppState) => state.system.helpName,
  );

  const helpTabName = useSelector(
    (state: AppState) => state.system.helpTabName,
  );

  const dispatch = useAppDispatch();

  useEffect(() => {
    let docsTotal = 0;
    let blogTotal = 0;
    let videoTotal = 0;
    if (helpTopics[systemHelpName]) {
      if (helpTopics[systemHelpName]["docs"]) {
        setHeaderDocs(helpTopics[systemHelpName]["docs"]["header"]);
        setHelpItems(helpTopics[systemHelpName]["docs"]["links"]);
        docsTotal = helpTopics[systemHelpName]["docs"]["links"].length;
      }

      if (helpTopics[systemHelpName]["blog"]) {
        setHeaderBlog(helpTopics[systemHelpName]["blog"]["header"]);
        setHelpItemsBlog(helpTopics[systemHelpName]["blog"]["links"]);
        blogTotal = helpTopics[systemHelpName]["blog"]["links"].length;
      }

      if (helpTopics[systemHelpName]["video"]) {
        setHeaderVideo(helpTopics[systemHelpName]["video"]["header"]);
        setHelpItemsVideo(helpTopics[systemHelpName]["video"]["links"]);
        videoTotal = helpTopics[systemHelpName]["video"]["links"].length;
      }

      let autoSelect = "docs";
      let hadToFlip = false;
      // if no docs, eval video o blog
      if (docsTotal === 0 && headerDocs === null && helpTabName === "docs") {
        // if no blog, default video?
        if (videoTotal !== 0 || headerVideo !== null) {
          autoSelect = "video";
        } else {
          autoSelect = "blog";
        }
        hadToFlip = true;
      }
      if (videoTotal === 0 && headerVideo === null && helpTabName === "video") {
        // if no blog, default video?
        if (docsTotal !== 0 || headerDocs !== null) {
          autoSelect = "docs";
        } else {
          autoSelect = "blog";
        }
        hadToFlip = true;
      }
      if (blogTotal === 0 && headerBlog === null && helpTabName === "blog") {
        // if no blog, default video?
        if (docsTotal !== 0 || headerDocs !== null) {
          autoSelect = "docs";
        } else {
          autoSelect = "video";
        }
        hadToFlip = true;
      }
      if (hadToFlip) {
        dispatch(setHelpTabName(autoSelect));
      }
    } else {
      setHelpItems(helpTopics["help"]["docs"]["links"]);
      setHelpItemsBlog([]);
      setHelpItemsVideo([]);
    }
  }, [
    systemHelpName,
    helpTabName,
    dispatch,
    helpTopics,
    headerBlog,
    headerDocs,
    headerVideo,
  ]);

  const helpContent = (
    <Box className={"helpContainer"}>
      {headerDocs && (
        <div style={{ paddingLeft: 1, paddingRight: 1 }}>
          <div>
            <ReactMarkdown>{`${headerDocs}`}</ReactMarkdown>
          </div>
          <div style={{ borderBottom: "1px solid #dedede" }} />
        </div>
      )}
      {helpItems &&
        helpItems.map((aHelpItem, idx) => (
          <Box className={"helpItemBlock"} key={`help-item-${aHelpItem}`}>
            <HelpTipItem item={aHelpItem} displayImage={false} />
          </Box>
        ))}
    </Box>
  );
  const helpContentVideo = (
    <Box className={"helpContainer"}>
      {headerVideo && (
        <Fragment>
          <div style={{ paddingLeft: 16, paddingRight: 16 }}>
            <ReactMarkdown>{`${headerVideo}`}</ReactMarkdown>
          </div>
          <div style={{ borderBottom: "1px solid #dedede" }} />
        </Fragment>
      )}
      {helpItemsVideo &&
        helpItemsVideo.map((aHelpItem, idx) => (
          <Box className={"helpItemBlock"} key={`help-item-${aHelpItem}`}>
            <HelpTipItem item={aHelpItem} />
          </Box>
        ))}
    </Box>
  );
  const helpContentBlog = (
    <Box className={"helpContainer"}>
      {headerBlog && (
        <Fragment>
          <div style={{ paddingLeft: 16, paddingRight: 16 }}>
            <ReactMarkdown>{`${headerBlog}`}</ReactMarkdown>
          </div>
          <div style={{ borderBottom: "1px solid #dedede" }} />
        </Fragment>
      )}
      {helpItemsBlog &&
        helpItemsBlog.map((aHelpItem, idx) => (
          <Box className={"helpItemBlock"} key={`help-item-${aHelpItem}`}>
            <HelpTipItem item={aHelpItem} />
          </Box>
        ))}
    </Box>
  );

  const constructHTTabs = () => {
    const helpMenuElements: TabItemProps[] = [];

    if (helpItems.length !== 0) {
      helpMenuElements.push({
        tabConfig: { label: "Documentation", id: "docs" },
        content: helpContent,
      });
    }

    if (helpItemsVideo.length !== 0) {
      helpMenuElements.push({
        tabConfig: { label: "Video", id: "video" },
        content: helpContentVideo,
      });
    }

    if (helpItemsBlog.length !== 0) {
      helpMenuElements.push({
        tabConfig: { label: "Blog", id: "blog" },
        content: helpContentBlog,
      });
    }

    return helpMenuElements;
  };

  /*


    helpMenuElements.push({
      tabConfig: { label: "💡", id: "icon" },
      content: <Fragment>
      You can choose to{" "}
      <a href="https://min.io/docs/minio/windows/administration/object-management/object-versioning.html#exclude-folders-from-versioning">
        exclude folders and prefixes
      </a>{" "}
      from versioning if Object Locking is not enabled.
      <br />
      MinIO requires versioning to support replication.
      <br />
      Objects in excluded prefixes do not replicate to any
      peer site or remote site.
    </Fragment>,
    });
<Tabs
            options={constructHTTabs()}
            currentTabOrPath={helpTabName}
            onTabClick={(item) => dispatch(setHelpTabName(item))}
            horizontalBarBackground
            horizontal
          />

           {
           thisStuff[0].map((aHelpItem, idx) => (
            <Box className={"helpItemBlock"} key={`help-item-${aHelpItem}`}>
              {aHelpItem.content}
            </Box>))
          }
   <a href={helpItemsBlog[0].url}> <h3>Blog</h3></a> 
       <a href={helpItemsVideo[0].url}> <h3>Video</h3></a>
  */

  return (
    <Fragment>
      <h1>💡</h1>
      <div>
        You can choose to exclude folders and prefixes from versioning if Object
        Locking is not enabled.
        <br />
        MinIO requires versioning to support replication.
        <br />
        Objects in excluded prefixes do not replicate to any peer site or remote
        site.
      </div>
      <a href="https://min.io/docs/minio/windows/administration/object-management/object-versioning.html#exclude-folders-from-versioning">
        {" "}
        <h3>Docs</h3>
      </a>
      <h3>Blog</h3>
      <div>
        {helpItemsBlog.map((aHelpItem, idx) => (
          <Box className={"helpItemBlock"} key={`help-item-${aHelpItem}`}>
            <HelpTipItem item={aHelpItem} />
          </Box>
        ))}
      </div>
    </Fragment>
  );
};

export default HelpTipTabs;
