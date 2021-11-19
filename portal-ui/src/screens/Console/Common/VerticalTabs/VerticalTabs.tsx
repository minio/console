import React from "react";
import { Box, Tab, TabProps } from "@mui/material";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import withStyles from "@mui/styles/withStyles";
import { Theme, useTheme } from "@mui/material/styles";
import createStyles from "@mui/styles/createStyles";
import useMediaQuery from "@mui/material/useMediaQuery";

export type TabItemProps = {
  tabConfig: TabProps | any;
  content?: JSX.Element | JSX.Element[];
};

type VerticalTabsProps = {
  classes: any;
  children: TabItemProps[];
  selectedTab?: string;
  routes?: any;
  isRouteTabs?: boolean;
};

const styles = (theme: Theme) =>
  createStyles({
    tabsContainer: {
      display: "flex",
      height: "100%",
      width: "100%",
    },
    tabsHeaderContainer: {
      width: "300px",
      background: "#FBFAFA",
      borderRight: "1px solid #EAEAEA",
      "& .MuiTabs-root": {
        "& .MuiTabs-indicator": {
          display: "none",
        },
        "& .MuiTab-root": {
          display: "flex",
          flexFlow: "row",
          alignItems: "center",
          justifyContent: "flex-start",
          borderBottom: "1px solid #EAEAEA",
          "& .MuiSvgIcon-root": {
            marginRight: 8,
            marginBottom: 0,
          },
          "&.Mui-selected": {
            background: "#E5E5E5",
          },
        },

        "&. MuiTabs-scroller": {
          display: "none",
        },
      },
    },
    tabContentContainer: {
      width: "100%",
      "& .MuiTabPanel-root": {
        height: "100%",
      },
    },
    tabPanel: {
      height: "100%",
    },
    /*Below md breakpoint make it horizontal and style it for scrolling tabs*/
    "@media (max-width: 900px)": {
      tabsContainer: {
        flexFlow: "column",
        flexDirection: "column",
      },
      tabsHeaderContainer: {
        width: "100%",
        borderBottom: " 1px solid #EAEAEA",
        "& .MuiTabs-root .MuiTabs-scroller .MuiButtonBase-root": {
          borderBottom: " 0px",
        },
      },
    },
  });

const VerticalTabs = ({
  children,
  classes,
  selectedTab = "0",
  routes,
  isRouteTabs,
}: VerticalTabsProps) => {
  const [value, setValue] = React.useState(selectedTab);

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("md"));

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  const headerList: TabProps[] = [];
  const contentList: React.ReactNode[] = [];

  if (!children) return null;

  children.forEach((child) => {
    headerList.push(child.tabConfig);
    contentList.push(child.content);
  });

  return (
    <TabContext value={`${value}`}>
      <Box className={classes.tabsContainer}>
        <Box className={classes.tabsHeaderContainer}>
          <TabList
            onChange={handleChange}
            orientation={isSmallScreen ? "horizontal" : "vertical"}
            variant={isSmallScreen ? "scrollable" : "standard"}
            scrollButtons="auto"
            className={classes.tabList}
          >
            {headerList.map((item, index) => {
              if (item) {
                return (
                  <Tab
                    className={classes.tabHeader}
                    key={`v-tab-${index}`}
                    value={`${index}`}
                    {...item}
                    disableRipple
                    disableTouchRipple
                    focusRipple={true}
                  />
                );
              }
              return null;
            })}
          </TabList>
        </Box>

        <Box className={classes.tabContentContainer}>
          {!isRouteTabs
            ? contentList.map((item, index) => {
                return (
                  <TabPanel
                    classes={{ ...classes.tabPanel }}
                    key={`v-tab-p-${index}`}
                    value={`${index}`}
                  >
                    {item ? item : null}
                  </TabPanel>
                );
              })
            : null}
          {isRouteTabs ? (
            <div className={classes.tabPanel}>{routes}</div>
          ) : null}
        </Box>
      </Box>
    </TabContext>
  );
};

export default withStyles(styles)(VerticalTabs);
