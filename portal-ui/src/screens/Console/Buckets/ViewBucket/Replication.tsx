import React, { useState } from "react";
import ModalWrapper from "../../Common/ModalWrapper/ModalWrapper";
import { createStyles, Theme, withStyles } from "@material-ui/core/styles";
import { modalBasic } from "../../Common/FormComponents/common/styleLibrary";

interface IReplicationModal {
  open: boolean;
  closeModalAndRefresh: () => any;
  classes: any;
}

const styles = (theme: Theme) =>
  createStyles({
    errorBlock: {
      color: "red",
    },
    minTableHeader: {
      color: "#393939",
      "& tr": {
        "& th": {
          fontWeight: "bold",
        },
      },
    },
    buttonContainer: {
      textAlign: "right",
    },
    ...modalBasic,
  });

const Replication = ({
  open,
  closeModalAndRefresh,
  classes,
}: IReplicationModal) => {
  const [addError, setAddError] = useState("");
  return (
    <ModalWrapper
      modalOpen={open}
      onClose={() => {
        setAddError("");
        closeModalAndRefresh();
      }}
      title="Set Bucket Replication"
    >
      Bucket Replication
    </ModalWrapper>
  );
};

export default withStyles(styles)(Replication);
