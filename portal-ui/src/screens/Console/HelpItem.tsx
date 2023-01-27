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
import { Theme } from "@mui/material/styles";
import createStyles from "@mui/styles/createStyles";
import withStyles from "@mui/styles/withStyles";
import Grid from "@mui/material/Grid";
import ReactMarkdown from "react-markdown";

import {
  containerForHeader,
  formFieldStyles,
  modalStyleUtils,
  spacingUtils,
} from "../Console/Common/FormComponents/common/styleLibrary";

const styles = (theme: Theme) =>
  createStyles({
    ...modalStyleUtils,
    ...formFieldStyles,
    ...spacingUtils,
    ...containerForHeader,
  });

interface IHelpItemProps {
  classes: any;
  helpItemMarkdown?: string;
  helpTag?: string;
}

const HelpItem = ({ classes, helpTag }: IHelpItemProps) => {
  let helpTags = require("../Console/helpTags.json");
  if (helpTag && !helpTags[helpTag]) {
    helpTag = "help";
  }
  let helpString = helpTag
    ? helpTags[helpTag].toString()
    : helpTags["help"].toString();

  const linkURL = helpString.slice(
    helpString.indexOf("(") + 1,
    helpString.indexOf(")")
  );
  const imgURL = helpString.slice(0, helpString.indexOf("["));
  const altText = helpString.slice(
    helpString.indexOf("[") + 1,
    helpString.indexOf("]")
  );
  const markdownText = helpString.slice(helpString.indexOf("["));

  return (
    <Fragment>
      <Grid
        container
        alignItems={"center"}
        display={"flex"}
        color={"white"}
        zIndex="5"
      >
        <Grid item xs={4} width={50}>
          {linkURL && (
            <a href={linkURL} target="_blank" rel="noopener">
              {" "}
              <img src={imgURL} alt={altText} width="75" height="40" />
            </a>
          )}
        </Grid>
        <Grid
          item
          xs={8}
          width={200}
          style={{
            overflowWrap: "break-word",
          }}
        >
          <ReactMarkdown linkTarget="_blank" children={markdownText} />
        </Grid>
      </Grid>
    </Fragment>
  );
};

export default withStyles(styles)(HelpItem);
