// This file is part of MinIO Console Server
// Copyright (c) 2020 MinIO, Inc.
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

import { render, fireEvent } from "@testing-library/react";
import AddBucket, { IAddBucketProps } from "../AddBucket";

// required as a workaround for https://github.com/testing-library/react-testing-library/issues/662
window.MutationObserver = require("mutation-observer");

function renderAddBucket(props: Partial<IAddBucketProps> = {}) {
  const defaultProps: IAddBucketProps = {
    closeModalAndRefresh() {
      return;
    },
    open: true,
    classes: {},
  };
  return render(<AddBucket {...defaultProps} {...props} />);
}

describe("<AddBucket />", () => {
  test("should display a blank add bucket form", async () => {
    const { findByTestId } = renderAddBucket();
    const addBucketForm = await findByTestId("add-bucket-form");
    expect(addBucketForm).toHaveTextContent("Bucket Name")
  });
  test("should display error", async () => {
    const { findByTestId } = renderAddBucket();
    const onSubmit = jest.fn();
    const bucketNameInput = await findByTestId("add-bucket-form-bucket-name-input");
    const submit = await findByTestId("add-bucket-submit-button");
    fireEvent.change(bucketNameInput, { target: { value: "test" } });
    fireEvent.click(submit);
    expect(onSubmit).toHaveBeenCalledWith("test");
  });
});