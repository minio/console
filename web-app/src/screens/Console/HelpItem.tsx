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

import React, { Fragment } from "react";
import { DocItem } from "./HelpMenu.types";
import MoreLink from "../../common/MoreLink";
import placeholderImg from "../../placeholderimage.png";

interface IHelpItemProps {
  item: DocItem;
  displayImage?: boolean;
}

const HelpItem = ({ item, displayImage = true }: IHelpItemProps) => {
  return (
    <Fragment>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
        }}
      >
        {displayImage && (
          <div style={{ paddingLeft: 16 }}>
            <a href={item.url} target={"_blank"}>
              <img
                src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"
                alt={item.title}
                style={{
                  width: 208,
                  height: 116,
                  backgroundImage: `url(${item.img}), url(${placeholderImg})`,
                  backgroundPosition: "center center",
                  backgroundSize: "cover",
                  backgroundRepeat: "no-repeat",
                }}
              />
            </a>
          </div>
        )}
        <div style={{ flexGrow: 1, flexBasis: "auto", paddingLeft: 16 }}>
          <div
            style={{
              width: "100%",
              font: "normal normal bold 16px/28px Inter",
              whiteSpace: "pre-wrap",
            }}
          >
            {item.title}
          </div>
          <div
            style={{
              width: "100%",
              whiteSpace: "pre-line",
              lineHeight: "1.5em",
              height: "3em",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {item.body}
          </div>
          <MoreLink text={"Learn more"} link={item.url} color={"#3874A6"} />
        </div>
      </div>
    </Fragment>
  );
};

export default HelpItem;
