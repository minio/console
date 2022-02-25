//  This file is part of MinIO Console Server
//  Copyright (c) 2022 MinIO, Inc.
//
//  This program is free software: you can redistribute it and/or modify
//  it under the terms of the GNU Affero General Public License as published by
//  the Free Software Foundation, either version 3 of the License, or
//  (at your option) any later version.
//
//  This program is distributed in the hope that it will be useful,
//  but WITHOUT ANY WARRANTY; without even the implied warranty of
//  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
//  GNU Affero General Public License for more details.
//
//  You should have received a copy of the GNU Affero General Public License
//  along with this program.  If not, see <http://www.gnu.org/licenses/>.
import * as React from "react";
import history from "../../history";
import {
  ActionId,
  ActionImpl,
  KBarAnimator,
  KBarPortal,
  KBarPositioner,
  KBarProvider,
  KBarResults,
  KBarSearch,
  useMatches,
} from "kbar";
import Console from "./Console";
import { validRoutes } from "./valid-routes";
import { AppState } from "../../store";
import { connect } from "react-redux";
import { Action } from "kbar/lib/types";
import { Theme } from "@mui/material/styles";
import makeStyles from "@mui/styles/makeStyles";
import { BucketsIcon } from "../../icons";

const useStyles = makeStyles((theme: Theme) => ({
  resultItem: {
    display: "flex",
    gap: "8px",
    alignItems: "center",
    fontSize: 14,
    "& .min-icon": {
      color: theme.palette.primary.main,
      width: "18px",
      height: "18px",
    },
  },
}));

const searchStyle = {
  padding: "12px 16px",
  fontSize: "16px",
  width: "100%",
  boxSizing: "border-box" as React.CSSProperties["boxSizing"],
  outline: "none",
  border: "none",
  background: "transparent",
  color: "#111111",
};

const animatorStyle = {
  maxWidth: "600px",
  width: "100%",
  background: "white",
  color: "black",
  borderRadius: "8px",
  overflow: "hidden",
  boxShadow: "rgba(0, 0, 0, 0.2) 0px 6px 20px 0px",
};

const groupNameStyle = {
  padding: "8px 16px",
  fontSize: "10px",
  textTransform: "uppercase" as const,
  opacity: 0.5,
};

const ConsoleKBar = ({
  features,
  operatorMode,
}: {
  operatorMode: boolean;
  features: string[] | null;
}) => {
  // if we are hiding the menu also disable the k-bar so just return console
  if (features?.includes("hide-menu")) {
    return <Console />;
  }

  const allowedMenuItems = validRoutes(features, operatorMode);

  const initialActions = [];
  for (const i of allowedMenuItems) {
    if (i.children && i.children.length > 0) {
      for (const childI of i.children) {
        const a: Action = {
          id: `${childI.id}`,
          name: childI.name,
          section: i.name,
          perform: () => history.push(`${childI.to}`),
          icon: <childI.icon />,
        };
        initialActions.push(a);
      }
    } else {
      const a: Action = {
        id: `${i.id}`,
        name: i.name,
        section: "Navigation",
        perform: () => history.push(`${i.to}`),
        icon: <i.icon />,
      };
      initialActions.push(a);
    }
  }
  if (!operatorMode) {
    // Add additional actions
    const a: Action = {
      id: `create-bucket`,
      name: "Create Bucket",
      section: "Buckets",
      perform: () => history.push(`/add-bucket`),
      icon: <BucketsIcon />,
    };
    initialActions.push(a);
  }

  return (
    <KBarProvider
      options={{
        enableHistory: true,
      }}
      actions={initialActions}
    >
      <CommandBar />
      <Console />
    </KBarProvider>
  );
};

function CommandBar() {
  return (
    <KBarPortal>
      <KBarPositioner
        style={{ zIndex: 9999, backgroundColor: "rgb(33,33,33,0.5)" }}
      >
        <KBarAnimator style={animatorStyle}>
          <KBarSearch style={searchStyle} />
          <RenderResults />
        </KBarAnimator>
      </KBarPositioner>
    </KBarPortal>
  );
}

function RenderResults() {
  const { results, rootActionId } = useMatches();

  return (
    <KBarResults
      items={results}
      onRender={({ item, active }) =>
        typeof item === "string" ? (
          <div style={groupNameStyle}>{item}</div>
        ) : (
          <ResultItem
            action={item}
            active={active}
            currentRootActionId={`${rootActionId}`}
          />
        )
      }
    />
  );
}

const ResultItem = React.forwardRef(
  (
    {
      action,
      active,
      currentRootActionId,
    }: {
      action: ActionImpl;
      active: boolean;
      currentRootActionId: ActionId;
    },
    ref: React.Ref<HTMLDivElement>
  ) => {
    const classes = useStyles();
    const ancestors = React.useMemo(() => {
      if (!currentRootActionId) return action.ancestors;
      const index = action.ancestors.findIndex(
        (ancestor) => ancestor.id === currentRootActionId
      );
      // +1 removes the currentRootAction; e.g.
      // if we are on the "Set theme" parent action,
      // the UI should not display "Set theme… > Dark"
      // but rather just "Dark"
      return action.ancestors.slice(index + 1);
    }, [action.ancestors, currentRootActionId]);

    return (
      <div
        ref={ref}
        style={{
          padding: "12px 16px",
          background: active ? "#dddddd" : "transparent",
          borderLeft: `2px solid ${
            active ? "var(--foreground)" : "transparent"
          }`,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          cursor: "pointer",
        }}
      >
        <div className={classes.resultItem}>
          {action.icon && action.icon}
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div>
              {ancestors.length > 0 &&
                ancestors.map((ancestor) => (
                  <React.Fragment key={ancestor.id}>
                    <span
                      style={{
                        opacity: 0.5,
                        marginRight: 8,
                      }}
                    >
                      {ancestor.name}
                    </span>
                    <span
                      style={{
                        marginRight: 8,
                      }}
                    >
                      &rsaquo;
                    </span>
                  </React.Fragment>
                ))}
              <span>{action.name}</span>
            </div>
            {action.subtitle && (
              <span style={{ fontSize: 12 }}>{action.subtitle}</span>
            )}
          </div>
        </div>
        {action.shortcut?.length ? (
          <div
            aria-hidden
            style={{ display: "grid", gridAutoFlow: "column", gap: "4px" }}
          >
            {action.shortcut.map((sc) => (
              <kbd
                key={sc}
                style={{
                  padding: "4px 6px",
                  background: "rgba(0 0 0 / .1)",
                  borderRadius: "4px",
                  fontSize: 14,
                }}
              >
                {sc}
              </kbd>
            ))}
          </div>
        ) : null}
      </div>
    );
  }
);

const mapState = (state: AppState) => ({
  operatorMode: state.system.operatorMode,
  features: state.console.session.features,
});

const connector = connect(mapState, null);

export default connector(ConsoleKBar);
