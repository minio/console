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

import React from "react";
import get from "lodash/get";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { IAM_PAGES } from "../../../common/SecureComponent/permissions";

interface IDestinationButton {
  destinationType: string;
  srcImage: string;
  title: string;
}

const DestinationButtonBase = styled.button(({ theme }) => ({
  background: get(theme, "boxBackground", "#FFF"),
  border: `${get(theme, "borderColor", "#E2E2E2")} 1px solid`,
  borderRadius: 5,
  width: 250,
  height: 80,
  display: "flex",
  alignItems: "center",
  justifyContent: "start",
  marginBottom: 16,
  marginRight: 8,
  cursor: "pointer",
  overflow: "hidden",
  "&:hover": {
    backgroundColor: get(theme, "buttons.regular.hover.background", "#ebebeb"),
  },
  "& .imageContainer": {
    width: 80,
    "& .logoButton": {
      maxWidth: 46,
      maxHeight: 46,
      filter: "drop-shadow(1px 1px 8px #fff)",
    },
  },
  "& .lambdaNotifTitle": {
    color: get(theme, "buttons.callAction.enabled.background", "#07193E"),
    fontSize: 16,
    fontFamily: "Inter,sans-serif",
    paddingLeft: 18,
    fontWeight: "bold",
  },
}));

const DestinationButton = ({
  destinationType,
  srcImage,
  title,
}: IDestinationButton) => {
  const navigate = useNavigate();

  return (
    <DestinationButtonBase
      onClick={() => {
        navigate(`${IAM_PAGES.EVENT_DESTINATIONS_ADD}/${destinationType}`);
      }}
    >
      <span className={"imageContainer"}>
        <img src={srcImage} className={"logoButton"} alt={title} />
      </span>
      <span className={"lambdaNotifTitle"}>{title}</span>
    </DestinationButtonBase>
  );
};

export default DestinationButton;
