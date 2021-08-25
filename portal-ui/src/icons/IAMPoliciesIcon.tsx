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

import React from "react";
import { SvgIcon } from "@material-ui/core";
import { IIcon } from "./props";
import { selected, unSelected } from "../screens/Console/Common/TableWrapper/TableActionIcons/common";

const IAMPoliciesIcon = ({ width = 24, active=false }: IIcon) => {
  return (
    <SvgIcon style={{ width: width, height: width }}>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 11.983 13.868">
        <path
          data-name="Trazado 339"
          d="M11.847 2.479a.671.671 0 00-.681-.633A7.235 7.235 0 016.425.266a.663.663 0 00-.864 0A7.232 7.232 0 01.822 1.849a.668.668 0 00-.687.637c-.1 2.548-.083 6.137 1.19 7.88a12.969 12.969 0 004.25 3.316.971.971 0 00.415.093.97.97 0 00.416-.094 12.806 12.806 0 004.25-3.315c1.274-1.75 1.29-5.339 1.191-7.887zm-1.84 7.407a12.116 12.116 0 01-3.943 3.062.173.173 0 01-.146 0 12.051 12.051 0 01-3.942-3.062C.758 8.217.876 4.159.934 2.646h.015a8.029 8.029 0 005.043-1.7 8.026 8.026 0 005.048 1.7h.01c.057 1.521.175 5.573-1.043 7.241z"
          fill={active ? selected : unSelected}
        />
        <path
          data-name="Trazado 339 - Contorno"
          d="M5.991.005a.769.769 0 01.5.185 7.141 7.141 0 004.553 1.557h.142a.774.774 0 01.763.729v.009c.1 2.559.082 6.171-1.21 7.94a12.908 12.908 0 01-4.288 3.346 1.064 1.064 0 01-.458.1 1.064 1.064 0 01-.457-.1 13.074 13.074 0 01-4.289-3.348C-.044 8.654-.061 5.043.038 2.48a.767.767 0 01.791-.733H.95A7.133 7.133 0 005.499.186a.762.762 0 01.492-.181zm5.052 1.943a7.343 7.343 0 01-4.682-1.6.569.569 0 00-.37-.138.562.562 0 00-.365.135A7.334 7.334 0 01.947 1.953h-.15a.566.566 0 00-.561.543c-.1 2.532-.083 6.1 1.17 7.816a12.849 12.849 0 004.212 3.284.875.875 0 00.745 0 12.68 12.68 0 004.211-3.283c1.255-1.719 1.27-5.285 1.171-7.818v-.008a.57.57 0 00-.562-.534h-.142zM5.992.822l.063.051a7.975 7.975 0 004.985 1.678h.106v.1a30.267 30.267 0 01-.043 3.577 7.631 7.631 0 01-1.019 3.726 12.229 12.229 0 01-3.981 3.093.274.274 0 01-.231 0 12.177 12.177 0 01-3.981-3.094C.62 8.212.778 4.026.83 2.653v-.1h.111A7.972 7.972 0 005.921.875zm4.961 1.929a8.172 8.172 0 01-4.961-1.672A8.17 8.17 0 011.03 2.751c-.128 3.591.217 5.973 1.026 7.081a11.948 11.948 0 003.9 3.031.074.074 0 00.062 0 12 12 0 003.9-3.03c.82-1.114 1.164-3.496 1.035-7.087z"
          fill={active ? selected : unSelected}
        />
        <path
          data-name="Trazado 340"
          d="M7.477 4.463l-.4-.2-.313-.157-.771-.386v.676l-.836.334.836-.334v-.681l-1.489.745v.526l-.275.11v1l.275.032v.439l.652-.065V9.46l.391.156v.63l.446.223V5.743l-.394.079v-.957l.394-.138.393.138v.956l-.393-.078v4.726l.446-.223v-.63l.739-.293v-.556l-.738.219v-.63l.739-.147v-.546l.3-.027v-.541h-.652v-.592l.3.03.35.035v-.526l.275.055v-1l-.275-.11zm.175.7v.807l-.155-.031-.12-.024v.538l-.24-.024-.3-.03-.11-.011v.8h.652v.349l-.212.019-.091.008v.555l-.659.131-.081.016v.847l.129-.038.609-.181v.354l-.676.268-.063.025v.637l-.245.122V5.859l.273.055.12.024v-.1l.343.069V4.724l-.391-.157-.27-.108-.076-.03v-.553l.625.312.314.157.349.174v.532l.063.025z"
          fill={active ? selected : unSelected}
        />
        <path
          data-name="Trazado 340 - Contorno"
          d="M5.892 3.556l.1.05.1-.05v.1l1.488.745v.52l.275.11v1.187l-.275-.055v.515l-.652-.065v.381h.652v.732l-.3.027v.536l-.739.147v.414l.737-.219v.758l-.739.293v.624l-.446.223v.1l-.1-.05-.1.05v-.1l-.446-.223v-.625l-.391-.156v-2.91l-.652.065v-.46l-.275-.032V5.034l.275-.11v-.52l1.489-.745zm0 .77V3.88l-1.289.645v.532l-.275.11v.841l.275.032v.417l.652-.065v3l.391.156v.636l.246.123V5.865l-.394.079V4.795l.594-.208v.07l.393.138v.945l.243.049v-.993l-.736-.294-.8.319-.074-.186zm1.388.26l-1.088-.544v.323l.283.113.454.182v1.373l-.343-.069v.1l-.394-.078v4.158l.045-.023v-.643l.74-.293v-.152l-.739.219V8.189l.74-.147v-.565l.3-.027v-.158h-.652V6.278l.652.066v-.549l.275.055v-.618l-.275-.109zm-1 .35l-.293-.1-.293.1V5.7l.193-.039v-.04l.1.02.1-.02v.04l.193.039z"
          fill={active ? selected : unSelected}
        />
      </svg>
    </SvgIcon>
  );
};

export default IAMPoliciesIcon;
