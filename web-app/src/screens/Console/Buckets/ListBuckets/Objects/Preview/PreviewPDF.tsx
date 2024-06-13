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

import React, { Fragment, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { Box, Button, InformativeMessage } from "mds";

pdfjs.GlobalWorkerOptions.workerSrc = "./scripts/pdf.worker.min.mjs";

interface IPreviewPDFProps {
  path: string;
  loading: boolean;
  onLoad: () => void;
  downloadFile: () => void;
}

const PreviewPDF = ({
  path,
  loading,
  onLoad,
  downloadFile,
}: IPreviewPDFProps) => {
  const [errorState, setErrorState] = useState<boolean>(false);
  const [totalPages, setTotalPages] = useState<number>(0);

  if (!path) {
    return null;
  }

  const renderPages = totalPages > 5 ? 5 : totalPages;
  const arrayCreate = Array.from(Array(renderPages).keys());

  return (
    <Fragment>
      {errorState && totalPages === 0 && (
        <InformativeMessage
          variant={"error"}
          title={"Error"}
          message={
            <Fragment>
              File preview couldn't be displayed, Please try Download instead.
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  marginTop: 12,
                }}
              >
                <Button
                  id={"download-preview"}
                  onClick={downloadFile}
                  variant={"callAction"}
                >
                  Download File
                </Button>
              </Box>
            </Fragment>
          }
          sx={{ marginBottom: 10 }}
        />
      )}
      {!loading && !errorState && (
        <InformativeMessage
          variant={"warning"}
          title={"File Preview"}
          message={
            <Fragment>
              This is a File Preview for the first {arrayCreate.length} pages of
              the document, if you wish to work with the full document please
              download instead.
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  marginTop: 12,
                }}
              >
                <Button
                  id={"download-preview"}
                  onClick={downloadFile}
                  variant={"callAction"}
                >
                  Download File
                </Button>
              </Box>
            </Fragment>
          }
          sx={{ marginBottom: 10 }}
        />
      )}
      {!errorState && (
        <Box
          sx={{
            overflowY: "auto",
            "& .react-pdf__Page__canvas": {
              margin: "0 auto",
              backgroundColor: "transparent",
            },
          }}
        >
          <Document
            file={path}
            onLoadSuccess={({ _pdfInfo }) => {
              setTotalPages(_pdfInfo.numPages || 0);
              setErrorState(false);
              onLoad();
            }}
            onLoadError={(error) => {
              setErrorState(true);
              onLoad();
              console.error(error);
            }}
          >
            {arrayCreate.map((item) => (
              <Page
                pageNumber={item + 1}
                key={`render-page-${item}`}
                renderAnnotationLayer={false}
                renderTextLayer={false}
                renderForms={false}
              />
            ))}
          </Document>
        </Box>
      )}
    </Fragment>
  );
};

export default PreviewPDF;
