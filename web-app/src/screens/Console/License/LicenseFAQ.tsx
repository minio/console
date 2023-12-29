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
import styled from "styled-components";
import get from "lodash/get";

const LinkElement = styled.a(({ theme }) => ({
  color: get(theme, "signalColors.info", "#2781B0"),
  fontWeight: 600,
}));

const makeLink = (text: string, link: string) => {
  return (
    <LinkElement href={link} target={"_blank"}>
      {text}
    </LinkElement>
  );
};

const LicenseFAQ = () => {
  return (
    <Fragment>
      <h2>What is the GNU AGPL v3?</h2>
      <p>
        The GNU AGPL v3 is short for the "GNU Affero General Public License v3".
        It is a{" "}
        {makeLink(
          "FOSS",
          "https://en.wikipedia.org/wiki/Free_and_open-source_software",
        )}{" "}
        license certified by the{" "}
        {makeLink("Free Software Foundation", "https://www.fsf.org/")} and the
        Open Source Initiative. You can get a copy of the GNU AGPL v3 license
        with MinIO source code or at{" "}
        {makeLink(
          "https://www.gnu.org/licenses/agpl-3.0.en.html",
          "https://min.io/compliance?ref=con",
        )}
        .
      </p>
      <h2>What does it mean for me to comply with the GNU AGPL v3?</h2>
      <p>
        When you host or distribute MinIO over a network, the AGPL v3 applies to
        you. Any distribution or copying of MinIO software modified or not has
        to comply with the obligations specified in the AGPL v3 license. You
        must include the source code, full license text and the original
        copyright notice along with the object code.
      </p>

      <p>
        We recommend the{" "}
        {makeLink(
          "Free Software Foundation’s interpretation",
          "https://www.gnu.org/licenses/agpl-3.0.en.html",
        )}{" "}
        of the GNU AGPL v3 license.
      </p>
      <h2>Making combined or derivative works of MinIO</h2>
      <p>
        Creating combined or derivative works of MinIO requires all such works
        to be released under the same license.
      </p>
      <p>
        If MinIO source code is included in the same executable file, they are
        definitely combined in one program. If modules are designed to run
        linked together in a shared address space, that almost surely means
        combining them into one program.
      </p>
      <p>
        By contrast, pipes, sockets, RESTful APIs, and command-line arguments
        are communication mechanisms normally used between two separate
        programs. So when they are used for communication, the modules normally
        are separate programs. But if the semantics of the communication are
        intimate enough, exchanging complex internal data structures, that too
        could be a basis to consider the two parts as combined into a larger
        program.
      </p>

      <p>
        Merely aggregating MinIO software into your distribution does not
        constitute derivative works. For more information, please refer to the{" "}
        {makeLink(
          "GPL FAQ",
          "https://www.gnu.org/licenses/gpl-faq.en.html#MereAggregation",
        )}
        .
      </p>
      <p></p>

      <h2>Talking to your Legal Counsel</h2>
      <p>
        If you have questions, we recommend that you talk to your own attorney
        for legal advice. Purchasing a commercial license from MinIO removes the
        GNU AGPL v3 obligations from MinIO software.
      </p>
    </Fragment>
  );
};
export default LicenseFAQ;
