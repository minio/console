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
import { Cell, Pie, PieChart } from "recharts";
import { CapacityValue, CapacityValues } from "./types";
import { niceBytesInt } from "../../../../common/utils";
import { CircleIcon } from "../../../../icons";

interface ITenantCapacity {
  totalCapacity: number;
  usedSpaceVariants: CapacityValues[];
  statusClass: string;
}

const TenantCapacity = ({
  totalCapacity,
  usedSpaceVariants,
  statusClass,
}: ITenantCapacity) => {
  const colors = [
    "#8dacd3",
    "#bca1ea",
    "#92e8d2",
    "#efc9ac",
    "#97f274",
    "#f7d291",
    "#71ACCB",
    "#f28282",
    "#e28cc1",
    "#2781B0",
  ];

  const totalUsedSpace = usedSpaceVariants.reduce((acc, currValue) => {
    return acc + currValue.value;
  }, 0);

  const emptySpace = totalCapacity - totalUsedSpace;

  let tiersList: CapacityValue[] = [];

  const standardTier = usedSpaceVariants.find(
    (tier) => tier.variant === "STANDARD"
  ) || {
    value: 0,
    variant: "empty",
  };

  if (usedSpaceVariants.length > 10) {
    const totalUsedByTiers = totalUsedSpace - standardTier.value;

    tiersList = [
      { value: totalUsedByTiers, color: "#2781B0", label: "Total Tiers Space" },
    ];
  } else {
    tiersList = usedSpaceVariants
      .filter((variant) => variant.variant !== "STANDARD")
      .map((variant, index) => {
        return {
          value: variant.value,
          color: colors[index],
          label: `Tier - ${variant.variant}`,
        };
      });
  }

  let standardTierColor = "#07193E";

  const usedPercentage = (standardTier.value * 100) / totalCapacity;

  if (usedPercentage >= 90) {
    standardTierColor = "#C83B51";
  } else if (usedPercentage >= 75) {
    standardTierColor = "#FFAB0F";
  }

  const plotValues: CapacityValue[] = [
    { value: emptySpace, color: "transparent", label: "Empty Space" },
    {
      value: standardTier.value,
      color: standardTierColor,
      label: "Used Space by Tenant",
    },
    ...tiersList,
  ];

  return (
    <div style={{ position: "relative", width: 110, height: 110 }}>
      <div
        style={{ position: "absolute", right: -5, top: 15, zIndex: 400 }}
        className={statusClass}
      >
        <CircleIcon
          style={{
            border: "#fff 2px solid",
            borderRadius: "100%",
            width: 20,
            height: 20,
          }}
        />
      </div>
      <span
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          fontWeight: "bold",
          color: "#000",
          fontSize: 12,
        }}
      >
        {!isNaN(totalUsedSpace) ? niceBytesInt(totalUsedSpace) : "N/A"}
      </span>
      <div>
        <PieChart width={110} height={110}>
          <Pie
            data={[{ value: 100 }]}
            cx={"50%"}
            cy={"50%"}
            dataKey="value"
            outerRadius={50}
            innerRadius={40}
            fill="#ededed"
            isAnimationActive={false}
            stroke={"none"}
          />
          <Pie
            data={plotValues}
            cx={"50%"}
            cy={"50%"}
            dataKey="value"
            outerRadius={50}
            innerRadius={40}
          >
            {plotValues.map((entry, index) => (
              <Cell key={`cellCapacity-${index}`} fill={entry.color} stroke={"none"} />
            ))}
          </Pie>
        </PieChart>
      </div>
    </div>
  );
};

export default TenantCapacity;
