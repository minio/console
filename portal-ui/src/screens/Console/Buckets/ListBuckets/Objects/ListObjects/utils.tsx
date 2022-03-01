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

import ObjectBrowserIcon from "../../../../../../icons/ObjectBrowserIcon";
import ObjectBrowserFolderIcon from "../../../../../../icons/ObjectBrowserFolderIcon";
import IconWithLabel from "./IconWithLabel";

const FileBookIcon = React.lazy(
  () => import("../../../../../../icons/FileBookIcon")
);
const FileCodeIcon = React.lazy(
  () => import("../../../../../../icons/FileCodeIcon")
);
const FileConfigIcon = React.lazy(
  () => import("../../../../../../icons/FileConfigIcon")
);
const FileDbIcon = React.lazy(
  () => import("../../../../../../icons/FileDbIcon")
);
const FileFontIcon = React.lazy(
  () => import("../../../../../../icons/FileFontIcon")
);
const FileImageIcon = React.lazy(
  () => import("../../../../../../icons/FileImageIcon")
);
const FileLockIcon = React.lazy(
  () => import("../../../../../../icons/FileLockIcon")
);
const FileMissingIcon = React.lazy(
  () => import("../../../../../../icons/FileMissingIcon")
);
const FileMusicIcon = React.lazy(
  () => import("../../../../../../icons/FileMusicIcon")
);
const FilePdfIcon = React.lazy(
  () => import("../../../../../../icons/FilePdfIcon")
);
const FilePptIcon = React.lazy(
  () => import("../../../../../../icons/FilePptIcon")
);
const FileTxtIcon = React.lazy(
  () => import("../../../../../../icons/FileTxtIcon")
);
const FileVideoIcon = React.lazy(
  () => import("../../../../../../icons/FileVideoIcon")
);
const FileXlsIcon = React.lazy(
  () => import("../../../../../../icons/FileXlsIcon")
);
const FileZipIcon = React.lazy(
  () => import("../../../../../../icons/FileZipIcon")
);

interface IExtToIcon {
  icon: any;
  extensions: string[];
}

export const extensionToIcon: IExtToIcon[] = [
  {
    icon: <FileVideoIcon />,
    extensions: ["mp4", "mov", "avi", "mpeg", "mpg"],
  },
  {
    icon: <FileMusicIcon />,
    extensions: ["mp3", "m4a", "aac"],
  },
  {
    icon: <FilePdfIcon />,
    extensions: ["pdf"],
  },
  {
    icon: <FilePptIcon />,
    extensions: ["ppt", "pptx"],
  },
  {
    icon: <FileXlsIcon />,
    extensions: ["xls", "xlsx"],
  },
  {
    icon: <FileLockIcon />,
    extensions: ["cer", "crt", "pem"],
  },
  {
    icon: <FileCodeIcon />,
    extensions: ["html", "xml", "css", "py", "go", "php", "cpp", "h", "java"],
  },
  {
    icon: <FileConfigIcon />,
    extensions: ["cfg", "yaml"],
  },
  {
    icon: <FileDbIcon />,
    extensions: ["sql"],
  },
  {
    icon: <FileFontIcon />,
    extensions: ["ttf", "otf"],
  },
  {
    icon: <FileTxtIcon />,
    extensions: ["txt"],
  },
  {
    icon: <FileZipIcon />,
    extensions: ["zip", "rar", "tar", "gz"],
  },
  {
    icon: <FileBookIcon />,
    extensions: ["epub", "mobi", "azw", "azw3"],
  },
  {
    icon: <FileImageIcon />,
    extensions: ["jpeg", "jpg", "gif", "tiff", "png", "heic", "dng"],
  },
];

export const displayFileIconName = (
  element: string,
  returnOnlyIcon: boolean = false
) => {
  let elementString = element;
  let icon = <ObjectBrowserIcon />;
  // Element is a folder
  if (element.endsWith("/")) {
    icon = <ObjectBrowserFolderIcon />;
    elementString = element.substr(0, element.length - 1);
  }

  const lowercaseElement = element.toLowerCase();
  for (const etc of extensionToIcon) {
    for (const ext of etc.extensions) {
      if (lowercaseElement.endsWith(`.${ext}`)) {
        icon = etc.icon;
      }
    }
  }

  if (!element.endsWith("/") && element.indexOf(".") < 0) {
    icon = <FileMissingIcon />;
  }

  const splitItem = elementString.split("/");

  if (returnOnlyIcon) {
    return icon;
  }

  return <IconWithLabel icon={icon} strings={splitItem} />;
};
