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
import { t } from "i18next";
import React from "react";
import { useSelector } from "react-redux";
import { Box } from "@mui/material";
import CertificateIcon from "../../../../icons/CertificateIcon";
import { AppState } from "../../../../store";

const FeatureItem = ({
  icon,
  description,
}: {
  icon: any;
  description: string;
}) => {
  return (
    <Box
      sx={{
        display: "flex",
        "& .min-icon": {
          marginRight: "10px",
          height: "23px",
          width: "23px",
          marginBottom: "10px",
        },
      }}
    >
      {icon}{" "}
      <div style={{ fontSize: "14px", fontStyle: "italic", color: "#5E5E5E" }}>
        {description}
      </div>
    </Box>
  );
};
const TLSHelpBox = () => {
  const namespace = useSelector((state: AppState) => {
    return state.createTenant.fields.nameTenant.namespace || "<namespace>";
  });

  const tenantName = useSelector((state: AppState) => {
    return state.createTenant.fields.nameTenant.tenantName || "<tenant-name>";
  });

  return (
    <Box
      sx={{
        flex: 1,
        border: "1px solid #eaeaea",
        borderRadius: "2px",
        display: "flex",
        flexFlow: "column",
        padding: "20px",
        marginTop: {
          xs: "0px",
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexFlow: "column",
        }}
      >
        <FeatureItem
          icon={<CertificateIcon />}
          description={`${t("TLS Certificates Warning")}`}
        />
        <Box sx={{ fontSize: "14px", marginBottom: "15px" }}>
          {t("Automatic certificate generation is not enabled.")}
          <br />
          <br />
          {t("If you wish to continue only with")}
          <b>{t("custom certificates")}</b>
          {t(
            "make sure they are valid for the following internode hostnames, i.e.:"
          )}
          <br />
          <br />
          <div
            style={{ fontSize: "14px", fontStyle: "italic", color: "#5E5E5E" }}
          >
            {t("minio.")}
            {namespace}
            <br />
            {t("minio.")}
            {namespace}
            {t(".svc")}
            <br />
            {t("minio.")}
            {namespace}
            {t(".svc.<cluster domain>")}
            <br />
            *.{tenantName}
            {t("-hl.")}
            {namespace}
            {t(".svc.<cluster domain>")}
            <br />
            *.{namespace}
            {t(".svc.<cluster domain>")}
          </div>
          <br />
          {t("Replace")}
          <em>{t("<tenant-name>")}</em>, <em>{t("<namespace>")}</em>
          {t("and")}
          <em>{t("<cluster domain>")}</em>
          {t("with the actual values for your MinIO tenant.")}
          <br />
          <br />
          {t("You can learn more at our")}{" "}
          <a
            href="https://min.io/docs/minio/kubernetes/upstream/operations/network-encryption.html?ref=op#id5"
            target="_blank"
            rel="noreferrer"
          >
            {t("documentation")}
          </a>
          .
        </Box>
      </Box>
    </Box>
  );
};

export default TLSHelpBox;
