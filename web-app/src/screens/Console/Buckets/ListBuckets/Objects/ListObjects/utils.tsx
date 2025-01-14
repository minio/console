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

import {
  FileBookIcon,
  FileCodeIcon,
  FileConfigIcon,
  FileDbIcon,
  FileFontIcon,
  FileImageIcon,
  FileLockIcon,
  FileMissingIcon,
  FileMusicIcon,
  FileNonType,
  FilePdfIcon,
  FilePptIcon,
  FileTxtIcon,
  FileVideoIcon,
  FileXlsIcon,
  FileZipIcon,
  FolderBrowserIcon,
} from "mds";
import IconWithLabel from "./IconWithLabel";

interface IExtToIcon {
  icon: any;
  extensions: string[];
}

const extensionToIcon: IExtToIcon[] = [
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
    extensions: ["doc", "docx", "txt", "rtf"],
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
  returnOnlyIcon: boolean = false,
) => {
  let elementString = element;
  let icon = <FileNonType />;
  // Element is a folder
  if (element.endsWith("/")) {
    icon = <FolderBrowserIcon />;
    elementString = element.slice(0, -1);
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

export const sanitizeFilePath = (filePath: string) => {
  // Replace `./` at the start of the path or preceded by `/` - happens when drag drop upload of files (not folders !) in chrome
  return filePath.replace(/(^|\/)\.\//g, "/");
};
