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

import React, { Fragment } from "react";
import { AutoSizer } from "react-virtualized";
import createStyles from "@mui/styles/createStyles";
import withStyles from "@mui/styles/withStyles";

interface ISlideOptions {
  classes: any;
  slideOptions: any;
  currentSlide: number;
}

const styles = () =>
  createStyles({
    masterContainer: {
      overflowX: "hidden",
      overflowY: "auto",
    },
    sliderContainer: {
      width: "auto",
      transitionDuration: "0.3s",
      position: "relative",
    },
    slide: {
      float: "left",
    },
  });

const SlideOptions = ({
  classes,
  slideOptions,
  currentSlide,
}: ISlideOptions) => {
  return (
    <AutoSizer>
      {({ width, height }: any) => {
        const currentSliderPosition = currentSlide * width;
        const containerSize = width * slideOptions.length;
        return (
          <Fragment>
            <div className={classes.masterContainer} style={{ width, height }}>
              <div
                className={classes.sliderContainer}
                style={{
                  left: `-${currentSliderPosition}px`,
                  width: `${containerSize}px`,
                }}
              >
                {slideOptions.map((block: any, index: number) => {
                  return (
                    <div
                      className={classes.slide}
                      style={{ width }}
                      key={`slide-panel-${index.toString()}`}
                    >
                      {block}
                    </div>
                  );
                })}
              </div>
            </div>
          </Fragment>
        );
      }}
    </AutoSizer>
  );
};

export default withStyles(styles)(SlideOptions);
