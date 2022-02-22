import React, { Fragment, useEffect, useState } from "react";
import { Box, Button, DialogContentText } from "@mui/material";
import PageHeader from "../Common/PageHeader/PageHeader";
import PageLayout from "../Common/Layout/PageLayout";
import InputBoxWrapper from "../Common/FormComponents/InputBoxWrapper/InputBoxWrapper";
import FormSwitchWrapper from "../Common/FormComponents/FormSwitchWrapper/FormSwitchWrapper";
import { CopyIcon, FileBookIcon, PasswordKeyIcon } from "../../../icons";
import ModalWrapper from "../Common/ModalWrapper/ModalWrapper";
import { Theme } from "@mui/material/styles";
import createStyles from "@mui/styles/createStyles";
import {
  deleteDialogStyles,
  modalStyleUtils,
} from "../Common/FormComponents/common/styleLibrary";
import withStyles from "@mui/styles/withStyles";
import { setErrorSnackMessage } from "../../../actions";
import { connect } from "react-redux";
import HelpBox from "../../../common/HelpBox";
import {
  deleteCookie,
  getCookieValue,
  performDownload,
} from "../../../common/utils";
import DistributedOnly from "../Common/DistributedOnly/DistributedOnly";
import { AppState } from "../../../store";
import { InspectMenuIcon } from "../../../icons/SidebarMenus";

const styles = (theme: Theme) =>
  createStyles({
    switchLabel: {
      fontWeight: "normal",
    },
    ...deleteDialogStyles,
    ...modalStyleUtils,
  });

const KeyRevealer = ({ value }: { value: string }) => {
  const [shown, setShown] = React.useState(false);

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        flexFlow: {
          sm: "row",
          xs: "column",
        },
      }}
    >
      <InputBoxWrapper
        id="inspect-dec-key"
        name="inspect-dec-key"
        placeholder=""
        label=""
        type={shown ? "text" : "password"}
        onChange={() => {}}
        value={value}
        overlayIcon={<CopyIcon />}
        extraInputProps={{
          readOnly: true,
        }}
        overlayAction={() => navigator.clipboard.writeText(value)}
      />

      <Button
        sx={{
          marginLeft: "10px",
        }}
        variant="contained"
        onClick={() => setShown(!shown)}
      >
        Show/Hide
      </Button>
    </Box>
  );
};

const mapState = (state: AppState) => ({
  distributedSetup: state.system.distributedSetup,
});

const mapDispatchToProps = {
  setErrorSnackMessage,
};
const connector = connect(mapState, mapDispatchToProps);

const Inspect = ({
  classes,
  setErrorSnackMessage,
  distributedSetup,
}: {
  classes: any;
  setErrorSnackMessage: any;
  distributedSetup: boolean;
}) => {
  const [volumeName, setVolumeName] = useState<string>("");
  const [inspectPath, setInspectPath] = useState<string>("");
  const [isEncrypt, setIsEncrypt] = useState<boolean>(true);

  const [decryptionKey, setDecryptionKey] = useState<string>("");

  const [insFileName, setInsFileName] = useState<string>("");

  const [isFormValid, setIsFormValid] = useState<boolean>(false);
  const [volumeError, setVolumeError] = useState<string>("");
  const [pathError, setPathError] = useState<string>("");

  /**
   * Validation Effect
   */
  useEffect(() => {
    let isVolValid;
    let isPathValid;

    isVolValid = volumeName.trim().length > 0;
    if (!isVolValid) {
      setVolumeError("This field is required");
    } else if (volumeName.slice(0, 1) === "/") {
      isVolValid = false;
      setVolumeError("Volume/Bucket name cannot start with /");
    }
    isPathValid = inspectPath.trim().length > 0;
    if (!inspectPath) {
      setPathError("This field is required");
    } else if (inspectPath.slice(0, 1) === "/") {
      isPathValid = false;
      setPathError("Path cannot start with /");
    }
    const isValid = isVolValid && isPathValid;

    if (isVolValid) {
      setVolumeError("");
    }
    if (isPathValid) {
      setPathError("");
    }

    setIsFormValid(isValid);
  }, [volumeName, inspectPath]);

  const makeRequest = async (url: string) => {
    return await fetch(url, { method: "GET" });
  };

  const performInspect = async () => {
    const file = encodeURIComponent(inspectPath);
    const volume = encodeURIComponent(volumeName);

    const urlOfInspectApi = `/api/v1/admin/inspect?volume=${volume}&file=${file}&encrypt=${isEncrypt}`;

    makeRequest(urlOfInspectApi)
      .then(async (res) => {
        if (!res.ok) {
          const resErr: any = await res.json();

          setErrorSnackMessage({
            errorMessage: resErr.message,
            detailedError: resErr.code,
          });
        }
        const blob: Blob = await res.blob();

        //@ts-ignore
        const filename = res.headers.get("content-disposition").split('"')[1];
        const decryptKey = getCookieValue(filename) || "";

        performDownload(blob, filename);
        setInsFileName(filename);
        setDecryptionKey(decryptKey);
      })
      .catch((err) => {
        setErrorSnackMessage(err);
      });
  };

  const resetForm = () => {
    setVolumeName("");
    setInspectPath("");
    setIsEncrypt(true);
  };

  const onCloseDecKeyModal = () => {
    deleteCookie(insFileName);
    setDecryptionKey("");
    resetForm();
  };

  return (
    <Fragment>
      <PageHeader label={"Inspect"} />
      <PageLayout>
        {!distributedSetup ? (
          <DistributedOnly
            iconComponent={<InspectMenuIcon />}
            entity={"Inspect"}
          />
        ) : (
          <Fragment>
            <Box
              sx={{
                border: "1px solid #eaeaea",
                padding: "25px",
              }}
            >
              <form
                noValidate
                autoComplete="off"
                onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
                  e.preventDefault();
                  performInspect();
                }}
              >
                <Box>
                  <InputBoxWrapper
                    id="inspect_volume"
                    name="inspect_volume"
                    extraInputProps={{
                      "data-test-id": "inspect_volume",
                    }}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      setVolumeName(e.target.value);
                    }}
                    label="Volume or Bucket Name"
                    value={volumeName}
                    error={volumeError}
                    required
                    placeholder={"test-bucket"}
                  />
                </Box>
                <Box
                  sx={{
                    marginTop: "15px",
                  }}
                >
                  <InputBoxWrapper
                    id="inspect_path"
                    name="inspect_path"
                    extraInputProps={{
                      "data-test-id": "inspect_path",
                    }}
                    error={pathError}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      setInspectPath(e.target.value);
                    }}
                    label="File or Path to inspect"
                    value={inspectPath}
                    required
                    placeholder={"test*/xl.meta"}
                  />
                </Box>
                <Box
                  sx={{
                    marginTop: "25px",
                  }}
                >
                  <FormSwitchWrapper
                    classes={{
                      inputLabel: classes.switchLabel,
                    }}
                    extraInputProps={{
                      "data-test-id": "inspect_encrypt",
                    }}
                    label="Encrypt"
                    indicatorLabels={["True", "False"]}
                    checked={isEncrypt}
                    value={"true"}
                    id="inspect_encrypt"
                    name="inspect_encrypt"
                    onChange={(e) => {
                      setIsEncrypt(!isEncrypt);
                    }}
                  />
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "flex-end",
                    marginTop: "55px",
                  }}
                >
                  <Button
                    sx={{
                      marginRight: "15px",
                    }}
                    type="button"
                    color="primary"
                    variant="outlined"
                    data-test-id="inspect-clear-button"
                    onClick={resetForm}
                  >
                    Clear
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    data-test-id="inspect-submit-button"
                    disabled={!isFormValid}
                  >
                    Inspect
                  </Button>
                </Box>
              </form>
            </Box>
            <Box
              sx={{
                marginTop: "55px",
              }}
            >
              <HelpBox
                title={"Inspect"}
                iconComponent={<FileBookIcon />}
                help={
                  <Fragment>
                    <Box
                      sx={{
                        marginTop: "15px",
                      }}
                    >
                      Inspect files on MinIO server
                    </Box>

                    <Box
                      sx={{
                        marginTop: "15px",
                        fontWeight: 500,
                      }}
                    >
                      Examples
                    </Box>

                    <Box
                      sx={{
                        display: "flex",
                        flexFlow: "column",
                        flex: "2",
                        marginTop: "15px",
                        "& .step-number": {
                          color: "#ffffff",
                          height: "25px",
                          width: "25px",
                          background: "#081C42",
                          marginRight: "10px",
                          textAlign: "center",
                          fontWeight: 600,
                          borderRadius: "50%",
                        },

                        "& .step-row": {
                          fontSize: "16px",
                          display: "flex",
                          marginTop: "15px",
                          marginBottom: "15px",
                        },

                        "& code": {
                          paddingLeft: "10px",
                          paddingRight: "10px",
                          paddingTop: "4px",
                          paddingBottom: "3px",
                          borderRadius: "2px",
                          backgroundColor: "#eaeaea",
                          color: "#082146",
                        },
                        "& .spacer": {
                          marginBottom: "5px",
                        },
                      }}
                    >
                      <Box>
                        <Box className="step-row">
                          <div className="step-text">
                            To Download 'xl.meta' for a specific object from all
                            the drives in a zip file:
                          </div>
                        </Box>

                        <Box
                          sx={{
                            flex: "1",
                            marginTop: "15px",
                            marginLeft: "35px",
                            "& input": {
                              color: "#737373",
                            },
                          }}
                        >
                          <Box>
                            <label>Volume/bucket Name :</label>{" "}
                            <code>test-bucket</code>
                            <div className="spacer" />
                            <label>Path : </label>
                            <code>test*/xl.meta</code>
                          </Box>
                        </Box>
                      </Box>

                      <Box>
                        <Box className="step-row">
                          <div className="step-text">
                            To Download all constituent parts for a specific
                            object, and optionally encrypt the downloaded zip:
                          </div>
                        </Box>

                        <Box
                          sx={{
                            flex: "1",
                            marginTop: "15px",
                            marginLeft: "35px",
                            "& input": {
                              color: "#737373",
                            },
                          }}
                        >
                          <Box>
                            <label>Volume/bucket Name : </label>
                            <code>test-bucket</code>
                            <div className="spacer" />
                            <label>Path :</label> <code>test*/*/part.*</code>
                          </Box>
                        </Box>
                      </Box>
                      <Box>
                        <Box className="step-row">
                          <div className="step-text">
                            To Download recursively all objects at a prefix.
                            <br />
                            NOTE: This can be an expensive operation use it with
                            caution.
                          </div>
                        </Box>

                        <Box
                          sx={{
                            flex: "1",
                            marginTop: "15px",
                            marginLeft: "35px",
                            "& input": {
                              color: "#737373",
                            },
                          }}
                        >
                          <Box>
                            <label>Volume/bucket Name : </label>
                            <code>test-bucket</code>
                            <div className="spacer" />
                            <label>Path :</label> <code>test/**</code>
                          </Box>
                        </Box>
                      </Box>
                    </Box>

                    <Box
                      sx={{
                        marginTop: "30px",
                      }}
                    >
                      You can learn more at our{" "}
                      <a
                        href="https://github.com/minio/minio/tree/master/docs/debugging?ref=con"
                        target="_blank"
                        rel="noreferrer"
                      >
                        documentation
                      </a>
                      .
                    </Box>
                  </Fragment>
                }
              />
            </Box>
          </Fragment>
        )}
        {decryptionKey ? (
          <ModalWrapper
            modalOpen={true}
            title="Inspect Decryption Key"
            onClose={onCloseDecKeyModal}
            titleIcon={<PasswordKeyIcon />}
          >
            <DialogContentText>
              <Box>
                This will be displayed only once. It cannot be recovered.
                <br />
                Use secure medium to share this key.
              </Box>
              <Box>
                <KeyRevealer value={decryptionKey} />
              </Box>
            </DialogContentText>
          </ModalWrapper>
        ) : null}
      </PageLayout>
    </Fragment>
  );
};

export default withStyles(styles)(connector(Inspect));
