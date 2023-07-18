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
import { MenuItem, Paper, Tab, Tabs } from "@mui/material";
import HelpItem from "./HelpItem";
import {
  AlertCloseIcon,
  Box,
  Button,
  HelpIcon,
  HelpIconFilled,
  IconButton,
  MinIOTierIcon,
} from "mds";
import { useSelector } from "react-redux";
import { AppState, useAppDispatch } from "../../store";
import { TabPanel } from "../shared/tabs";
import { setHelpTabName } from "../../systemSlice";
import { DocItem } from "./HelpMenu.types";
import MoreLink from "../../common/MoreLink";
import ReactMarkdown from "react-markdown";

const HelpMenu = () => {
  const helpTopics = require("../Console/helpTopics.json");

  const [helpItems, setHelpItems] = useState<DocItem[]>([]);
  const [headerDocs, setHeaderDocs] = useState<string | null>(null);
  const [helpItemsVideo, setHelpItemsVideo] = useState<DocItem[]>([]);
  const [headerVideo, setHeaderVideo] = useState<string | null>(null);
  const [helpItemsBlog, setHelpItemsBlog] = useState<DocItem[]>([]);
  const [headerBlog, setHeaderBlog] = useState<string | null>(null);
  const [helpMenuOpen, setHelpMenuOpen] = useState<boolean>(false);

  const systemHelpName = useSelector(
    (state: AppState) => state.system.helpName,
  );

  const helpTabName = useSelector(
    (state: AppState) => state.system.helpTabName,
  );

  const toggleHelpMenu = () => {
    setHelpMenuOpen(!helpMenuOpen);
  };
  const dispatch = useAppDispatch();

  function useOutsideAlerter(ref: any) {
    useEffect(() => {
      function handleClickOutside(event: any) {
        if (ref.current && !ref.current.contains(event.target)) {
          setHelpMenuOpen(false);
        }
      }

      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [ref]);
  }

  const wrapperRef = useRef(null);
  useOutsideAlerter(wrapperRef);

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
    <React.Fragment>
      {headerDocs && (
        <div style={{ paddingLeft: 16, paddingRight: 16 }}>
          <div>
            <ReactMarkdown>{`${headerDocs}`}</ReactMarkdown>
          </div>
          <div style={{ borderBottom: "1px solid #dedede" }} />
        </div>
      )}
      {helpItems &&
        helpItems.map((aHelpItem, idx) => (
          <MenuItem value={`${idx}`} key={`help-item-${aHelpItem}`}>
            <HelpItem item={aHelpItem} displayImage={false} />
          </MenuItem>
        ))}
      <div style={{ padding: 16 }}>
        <MoreLink
          LeadingIcon={MinIOTierIcon}
          text={"Visit MinIO Documentation"}
          link={"https://docs.min.io/?ref=con"}
          color={"#C5293F"}
        />
      </div>
    </React.Fragment>
  );
  const helpContentVideo = (
    <React.Fragment>
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
          <MenuItem value={`${idx}`} key={`help-item-${aHelpItem}`}>
            <HelpItem item={aHelpItem} />
          </MenuItem>
        ))}
      <div style={{ padding: 16 }}>
        <MoreLink
          LeadingIcon={MinIOTierIcon}
          text={"Visit MinIO Videos"}
          link={"https://min.io/videos?ref=con"}
          color={"#C5293F"}
        />
      </div>
    </React.Fragment>
  );
  const helpContentBlog = (
    <React.Fragment>
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
          <MenuItem value={`${idx}`} key={`help-item-${aHelpItem}`}>
            <HelpItem item={aHelpItem} />
          </MenuItem>
        ))}
      <div style={{ padding: 16 }}>
        <MoreLink
          LeadingIcon={MinIOTierIcon}
          text={"Visit MinIO Blog"}
          link={"https://blog.min.io/?ref=con"}
          color={"#C5293F"}
        />
      </div>
    </React.Fragment>
  );

  function a11yProps(index: any) {
    return {
      id: `simple-tab-${index}`,
      "aria-controls": `simple-tabpanel-${index}`,
      style: {
        fontWeight: "bold",
      },
    };
  }

  return (
    <Fragment>
      {helpMenuOpen && (
        <div
          ref={wrapperRef}
          style={{
            position: "absolute",
            zIndex: "10",
            background: "#F7F7F7 0% 0% no-repeat padding-box",
            borderRadius: "4px",
            width: 754,
            boxShadow: "0px 0px 10px #0000001A",
            border: "1px solid #E5E5E5",
          }}
        >
          <Box>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
              }}
            >
              <div style={{ padding: 14 }}>
                <HelpIconFilled style={{ color: "#3874A6", width: 16 }} />
              </div>
              <div
                style={{
                  flexGrow: 1,
                }}
              >
                <Tabs
                  value={helpTabName}
                  onChange={(e: React.ChangeEvent<{}>, newValue: string) => {
                    dispatch(setHelpTabName(newValue));
                  }}
                  indicatorColor="primary"
                  textColor="primary"
                  aria-label="cluster-tabs"
                  variant="scrollable"
                  scrollButtons="auto"
                >
                  {helpItems.length !== 0 && (
                    <Tab
                      value={"docs"}
                      label="Documentation"
                      {...a11yProps(0)}
                    />
                  )}
                  {helpItemsVideo.length !== 0 && (
                    <Tab value={"video"} label="Video" {...a11yProps(1)} />
                  )}
                  {helpItemsBlog.length !== 0 && (
                    <Tab value={"blog"} label="Blog" {...a11yProps(2)} />
                  )}
                </Tabs>
              </div>
              <div style={{ padding: 10 }}>
                <IconButton
                  onClick={() => {
                    setHelpMenuOpen(false);
                  }}
                  size="small"
                >
                  <AlertCloseIcon style={{ color: "#919191", width: 12 }} />
                </IconButton>
              </div>
            </div>
            <Paper
              style={{
                maxHeight: 400,
                overflowY: "auto",
              }}
            >
              {helpItems.length !== 0 && (
                <TabPanel index={"docs"} value={helpTabName}>
                  {helpContent}
                </TabPanel>
              )}
              {helpItemsVideo.length !== 0 && (
                <TabPanel index={"video"} value={helpTabName}>
                  {helpContentVideo}
                </TabPanel>
              )}
              {helpItemsBlog.length !== 0 && (
                <TabPanel index={"blog"} value={helpTabName}>
                  {helpContentBlog}
                </TabPanel>
              )}
            </Paper>
          </Box>
        </div>
      )}
      <Button
        id={systemHelpName ?? "help_button"}
        icon={<HelpIcon />}
        onClick={toggleHelpMenu}
      ></Button>
    </Fragment>
  );
};

export default HelpMenu;
