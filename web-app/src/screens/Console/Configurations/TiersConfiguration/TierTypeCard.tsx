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

import React from "react";
import styled from "styled-components";
import get from "lodash/get";

const TierButtonBase = styled.button(({ theme }) => ({
  background: get(theme, "boxBackground", "#FFF"),
  border: `${get(theme, "borderColor", "#E2E2E2")} 1px solid`,
  borderRadius: 5,
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
    "& .min-icon": {
      maxWidth: 46,
      maxHeight: 46,
    },
  },
  "& .tierNotifTitle": {
    color: get(theme, "buttons.callAction.enabled.background", "#07193E"),
    fontSize: 16,
    fontFamily: "Inter,sans-serif",
    paddingLeft: 18,
    fontWeight: "bold",
  },
}));

type TierTypeCardProps = {
  onClick: (name: string) => void;
  icon?: any;
  name: string;
};
const TierTypeCard = ({ onClick, icon, name }: TierTypeCardProps) => {
  return (
    <TierButtonBase
      onClick={() => {
        onClick(name);
      }}
    >
      <span className={"imageContainer"}>{icon}</span>
      <span className={"tierNotifTitle"}>{name}</span>
    </TierButtonBase>
  );
};

export default TierTypeCard;
