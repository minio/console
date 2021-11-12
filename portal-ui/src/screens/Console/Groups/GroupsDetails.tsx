import React, { Fragment, useEffect, useState } from "react";
import PageHeader from "../Common/PageHeader/PageHeader";
import { Link, useParams } from "react-router-dom";
import { Theme } from "@mui/material/styles";
import createStyles from "@mui/styles/createStyles";
import {
  actionsTray,
  containerForHeader,
  searchField,
} from "../Common/FormComponents/common/styleLibrary";
import {
  setErrorSnackMessage,
  setModalErrorSnackMessage,
} from "../../../actions";
import { connect } from "react-redux";
import withStyles from "@mui/styles/withStyles";
import { Button, Grid, IconButton, Tooltip } from "@mui/material";
import ScreenTitle from "../Common/ScreenTitle/ScreenTitle";
import { DeleteIcon, IAMPoliciesIcon, UsersIcon } from "../../../icons";
import TableWrapper from "../Common/TableWrapper/TableWrapper";
import history from "../../../history";
import api from "../../../common/api";
import SetPolicy from "../Policies/SetPolicy";
import AddGroupMember from "./AddGroupMember";
import { ErrorResponseHandler } from "../../../common/types";
import DeleteGroup from "./DeleteGroup";
import VerticalTabs from "../Common/VerticalTabs/VerticalTabs";
import FormSwitchWrapper from "../Common/FormComponents/FormSwitchWrapper/FormSwitchWrapper";
import PageLayout from "../Common/Layout/PageLayout";
import BackLink from "../../../common/BackLink";
import PanelTitle from "../Common/PanelTitle/PanelTitle";

const styles = (theme: Theme) =>
  createStyles({
    pageContainer: {
      border: "1px solid #EAEAEA",
      width: "100%",
    },
    breadcrumLink: {
      textDecoration: "none",
      color: "black",
    },
    statusLabel: {
      fontSize: ".8rem",
      marginRight: ".5rem",
    },
    statusValue: {
      fontWeight: "bold",
      fontSize: ".9rem",
      marginRight: ".5rem",
    },
    ...actionsTray,
    ...searchField,
    ...containerForHeader(theme.spacing(4)),
  });

interface IGroupDetailsProps {
  classes: any;
  match: any;
  setErrorSnackMessage: typeof setErrorSnackMessage;
}

type DetailsHeaderProps = {
  classes: any;
};

type GroupInfo = {
  members?: any[];
  name?: string;
  policy?: string;
  status?: string;
};

export const formatPolicy = (policy: string = ""): string[] => {
  if (policy.length <= 0) return [];
  return policy.split(",");
};

export const getPoliciesAsString = (policies: string[]): string => {
  return policies.join(", ");
};

const GroupDetailsHeader = ({ classes }: DetailsHeaderProps) => {
  return (
    <PageHeader
      label={
        <Fragment>
          <Link to={"/groups"} className={classes.breadcrumLink}>
            Groups
          </Link>
        </Fragment>
      }
      actions={<React.Fragment />}
    />
  );
};

const GroupsDetails = ({ classes }: IGroupDetailsProps) => {
  const [groupDetails, setGroupDetails] = useState<GroupInfo>({});

  /*Modals*/
  const [policyOpen, setPolicyOpen] = useState<boolean>(false);
  const [usersOpen, setUsersOpen] = useState<boolean>(false);
  const [deleteOpen, setDeleteOpen] = useState<boolean>(false);

  const { groupName = "" } = useParams<Record<string, string>>();

  const { members = [], policy = "", status: groupEnabled } = groupDetails;

  useEffect(() => {
    if (groupName) {
      fetchGroupInfo();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [groupName]);

  const groupPolicies = formatPolicy(policy);
  const isGroupEnabled = groupEnabled === "enabled";
  const memberActionText = members.length > 0 ? "Edit Members" : "Add Members";

  function fetchGroupInfo() {
    api
      .invoke("GET", `/api/v1/group?name=${encodeURI(groupName)}`)
      .then((res: any) => {
        setGroupDetails(res);
      })
      .catch((err) => {
        setModalErrorSnackMessage(err);
        setGroupDetails({});
      });
  }

  function toggleGroupStatus(nextStatus: boolean) {
    return api
      .invoke("PUT", `/api/v1/group?name=${encodeURI(groupName)}`, {
        group: groupName,
        members: members,
        status: nextStatus ? "enabled" : "disabled",
      })
      .then((res) => {
        fetchGroupInfo();
      })
      .catch((err: ErrorResponseHandler) => {
        setModalErrorSnackMessage(err);
      });
  }

  const groupsTabContent = (
    <React.Fragment>
      <div className={classes.actionsTray}>
        <PanelTitle>Members</PanelTitle>
        <Button
          variant="contained"
          color="primary"
          endIcon={<UsersIcon />}
          size="medium"
          onClick={() => {
            setUsersOpen(true);
          }}
        >
          {memberActionText}
        </Button>
      </div>

      <TableWrapper
        columns={[{ label: "Access Key", elementKey: "" }]}
        selectedItems={[]}
        isLoading={false}
        records={members}
        entityName="Users"
        idField=""
      />
    </React.Fragment>
  );

  const policiesTabContent = (
    <React.Fragment>
      <div className={classes.actionsTray}>
        <PanelTitle>Policies</PanelTitle>
        <Button
          variant="contained"
          color="primary"
          endIcon={<IAMPoliciesIcon />}
          size="medium"
          onClick={() => {
            setPolicyOpen(true);
          }}
        >
          Set Policies
        </Button>
      </div>

      <TableWrapper
        itemActions={[
          {
            type: "view",
            onClick: (policy) => {
              history.push(`/policies/${policy}`);
            },
          },
        ]}
        columns={[{ label: "Policy", elementKey: "" }]}
        isLoading={false}
        records={groupPolicies}
        entityName="Policies"
        idField=""
      />
    </React.Fragment>
  );
  return (
    <React.Fragment>
      <GroupDetailsHeader classes={classes} />
      <BackLink to={"/groups"} label={"Return to Groups"} />

      <PageLayout className={classes.pageContainer}>
        <Grid item xs={12}>
          <ScreenTitle
            icon={
              <Fragment>
                <UsersIcon width={40} />
              </Fragment>
            }
            title={groupName}
            subTitle={null}
            actions={
              <Fragment>
                <span className={classes.statusLabel}>Group Status:</span>
                <span className={classes.statusValue}>
                  {isGroupEnabled ? "Enabled" : "Disabled"}
                </span>
                <FormSwitchWrapper
                  indicatorLabels={["Enabled", "Disabled"]}
                  checked={isGroupEnabled}
                  value={"group_enabled"}
                  id="group-status"
                  name="group-status"
                  onChange={() => {
                    toggleGroupStatus(!isGroupEnabled);
                  }}
                  switchOnly
                />
                <Tooltip title="Delete User">
                  <IconButton
                    color="primary"
                    aria-label="Delete User"
                    component="span"
                    onClick={() => {
                      setDeleteOpen(true);
                    }}
                    size="large"
                  >
                    <DeleteIcon />
                  </IconButton>
                </Tooltip>
              </Fragment>
            }
          />
        </Grid>

        <Grid item xs={12}>
          <VerticalTabs>
            {{
              tabConfig: { label: "Members" },
              content: groupsTabContent,
            }}
            {{
              tabConfig: { label: "Policies" },
              content: policiesTabContent,
            }}
          </VerticalTabs>
        </Grid>
      </PageLayout>
      {/*Modals*/}
      {policyOpen ? (
        <SetPolicy
          open={policyOpen}
          selectedGroup={groupName}
          selectedUser={null}
          closeModalAndRefresh={() => {
            setPolicyOpen(false);
            fetchGroupInfo();
          }}
        />
      ) : null}

      {usersOpen ? (
        <AddGroupMember
          selectedGroup={groupName}
          onSaveClick={() => {}}
          title={memberActionText}
          groupStatus={groupEnabled}
          classes={classes}
          preSelectedUsers={members}
          open={usersOpen}
          onClose={() => {
            setUsersOpen(false);
            fetchGroupInfo();
          }}
        />
      ) : null}

      {deleteOpen && (
        <DeleteGroup
          deleteOpen={deleteOpen}
          selectedGroup={groupName}
          closeDeleteModalAndRefresh={(isDelSuccess: boolean) => {
            setDeleteOpen(false);
            if (isDelSuccess) {
              history.push("/groups");
            }
          }}
        />
      )}
      {/*Modals*/}
    </React.Fragment>
  );
};

const mapDispatchToProps = {
  setErrorSnackMessage,
};

const connector = connect(null, mapDispatchToProps);

export default withStyles(styles)(connector(GroupsDetails));
