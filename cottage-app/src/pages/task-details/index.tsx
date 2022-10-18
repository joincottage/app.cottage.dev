import React, { useEffect, useMemo, useReducer, useState } from "react";
import { Box, Button, Container, Divider, Typography } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import SaveIcon from "@mui/icons-material/Save";
// @ts-ignore
import { Helmet } from "react-helmet";
import Editor from "../../common-components/Editor";
import useMediaQuery from "@mui/material/useMediaQuery";
// @ts-ignore
import ImageFadeIn from "react-image-fade-in";
import OverviewModalButton from "../../common-components/OverviewModalButton";
import BasicTabs from "../../common-components/BasicTabs";
import LoadingButton from "@mui/lab/LoadingButton";
import RocketLaunchIcon from "@mui/icons-material/RocketLaunch";
import ConfirmationModal from "../../common-components/ConfirmationModal";
import useSubmission from "../../hooks/useSubmission";
import useTask from "../../hooks/useTask";
import axios from "axios";
import { API_BASE_URL } from "../../constants";
import { getJWTToken } from "@cottage-software-inc/client-library/lib/lib/helpers";
import useInterval from "../../hooks/useInterval";
import doesAirtableItemExist from "../../util/doesAirtableItemExist";

const params: Record<string, any> = new Proxy(
  new URLSearchParams(window.location.search),
  {
    get: (searchParams, prop) => searchParams.get(prop as string),
  }
);

const getLoggedInUserRecordID = () =>
  (window as any)?.logged_in_user?.airtable_record_id || "recdim56cUfKolPQd";

const updateSubmissionInAirtable = async (
  submissionRecordId: string,
  fields: Record<string, any>
): Promise<any> => {
  const response = await axios.patch(
    `${API_BASE_URL}/submissions?recordId=${submissionRecordId}&jwtToken=${getJWTToken()}`,
    {
      fields,
    }
  );

  return response.data;
};

const createSubmissionInAirtable = async (
  task: any,
  projectContents: string,
  isDraft: boolean,
  previewUrl?: string
): Promise<any> => {
  const response = await axios.post(
    `${API_BASE_URL}/submissions?jwtToken=${getJWTToken()}`,
    {
      fields: {
        Name: task[0]["Name"],
        Status: "Awaiting Review",
        Users: [getLoggedInUserRecordID()],
        Tasks: [task[0]["Record ID"]],
        Contents: projectContents,
        IsDraft: `${isDraft}`,
        "Stackblitz Project ID": previewUrl || "",
      },
    }
  );

  return response.data;
};

let submissionRecordId;

// tslint:disable-next-line: cyclomatic-complexity
const TaskDetails = () => {
  const isScreenTooSmall = useMediaQuery("(max-width:800px)");
  const { data: task, loading: taskLoading } = useTask({
    recordId: params.recordId,
    loggedInUserRecordID: getLoggedInUserRecordID(),
  });
  const [draftIsBeingSaved, setDraftIsBeingSaved] = useState(false);
  const [solutionIsBeingSubmitted, setSolutionIsBeingSubmitted] =
    useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [newlyCreatedSubmission, setNewlyCreatedSubmission] = useState(null);

  const [oldPreviewUrl, setOldPreviewUrl] = useState(null);
  useInterval(() => {
    async function checkPreviewUrl() {
      if ((window as any).stackblitzVM) {
        const currentPreviewUrl = await (
          window as any
        ).stackblitzVM.preview.getUrl();

        if (currentPreviewUrl !== oldPreviewUrl) {
          console.log(
            `Detected previewUrl changed from ${oldPreviewUrl} to ${currentPreviewUrl}`
          );
          const projectId = currentPreviewUrl.slice(
            8,
            currentPreviewUrl.indexOf(".")
          );
          console.log(`Project ID extracted from previewUrl: ${projectId}`);
          setOldPreviewUrl(currentPreviewUrl);

          // if (submissionRecordId || doesAirtableItemExist(submission)) {
          //   console.log(
          //     `Updating previewUrl for submission ${
          //       submissionRecordId || submission[0]["Record ID"]
          //     }`
          //   );

          //   await updateSubmissionInAirtable(
          //     submissionRecordId || submission[0]["Record ID"],
          //     {
          //       "Stackblitz Project ID": projectId,
          //     }
          //   );
          // } else {
            console.log("Creating new submission");

            const projectContents = await (
              window as any
            ).stackblitzVM.getFsSnapshot();
            const responseData = await createSubmissionInAirtable(
              task,
              JSON.stringify(projectContents, null, 2),
              true,
              projectId
            );
            submissionRecordId = responseData["Record ID"];
          }
        // }
      }
    }
    checkPreviewUrl();
  }, 10000);

  // useEffect(() => {
  //   if (!taskLoading && !submissionLoading && submission.length === 0) {
  //     // @ts-ignore
  //     // window.posthog.capture("competition start", {
  //     //   taskRecordIdInAirtable: task[0]["Record ID"],
  //     // });
  //   }
  // }, [submissionLoading, taskLoading]);

  const onSaveDraft = () => {
    async function saveDraft() {
      setDraftIsBeingSaved(true);

      const projectContents = await (
        window as any
      ).stackblitzVM.getFsSnapshot();

      // const submissionToSave =
      //   (submission && submission[0]) || newlyCreatedSubmission;
      const submissionToSave = newlyCreatedSubmission;
      if (submissionToSave) {
        await updateSubmissionInAirtable(
          submissionToSave,
          JSON.stringify(projectContents, null, 2),
          true
        );
      } else {
        const response = await createSubmissionInAirtable(
          task[0],
          JSON.stringify(projectContents, null, 2),
          true
        );
        setNewlyCreatedSubmission(response);
      }

      // It's a bit jarring to see the loading spinner flash so quickly
      setTimeout(() => {
        setDraftIsBeingSaved(false);
      }, 2000);
    }

    saveDraft();
  };

  const onSubmitSolution = async () => {
    // @ts-ignore
    // window.posthog.capture("clicked 'Submit solution'", {
    //   taskRecordIdInAirtable: task[0]["Record ID"],
    // });

    setSolutionIsBeingSubmitted(true);

    const projectContents = await (window as any).stackblitzVM.getFsSnapshot();

    const submissionToSubmit = newlyCreatedSubmission;
    await updateSubmissionInAirtable(
      submissionToSubmit,
      JSON.stringify(projectContents, null, 2),
      false
    );

    // It's a bit jarring to see the loading spinner flash so quickly
    await new Promise<void>((resolve) =>
      setTimeout(() => {
        setSolutionIsBeingSubmitted(false);
        resolve();
      }, 2000)
    );
  };

  // Rather than render conditionally, show responsive screens as overlays so that code gets saved
  // if (
  //   submission &&
  //   submission.length > 0 &&
  //   submission[0].IsDraft === "false"
  // ) {
  //   return (
  //     <Container maxWidth="sm" sx={{ mt: 3 }}>
  //       <Box sx={{ p: 1, display: "flex", justifyContent: "center" }}>
  //         <Typography variant="h4">We respect the hustle</Typography>
  //       </Box>
  //       <Box sx={{ pl: 1, pr: 1 }}>
  //         <Typography variant="body1" gutterBottom sx={{ textAlign: "center" }}>
  //           ...but you've already submitted a solution for this competition.
  //         </Typography>
  //         <Typography variant="body1" gutterBottom sx={{ textAlign: "center" }}>
  //           Head back to the home page and get started on a competition that you
  //           haven't tried yet!
  //         </Typography>
  //       </Box>
  //     </Container>
  //   );
  // }

  return taskLoading ? null : (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Helmet>
        <style>{`
          iframe { border: none; }
          .container { max-width: none !important; }
          #custom-code1, #custom-code2, #custom-code3 {
            padding-top: 0 !important;
            padding-bottom: 0 !important;
            position: absolute;
            top: 0;
            bottom: 0;
            right: 0;
            left: 0;
          }
          .col-12 { padding: 0 !important; }
          `}</style>
      </Helmet>
      <Container
        maxWidth={false}
        style={{
          padding: 0,
          position: "absolute",
          top: 0,
          right: 0,
          left: 0,
          bottom: 0,
        }}
      >
        <BasicTabs
          tabItems={[
            {
              label: "Editor",
              content: (
                <Editor
                  task={params.recordId ? task : null}
                  submission={null}
                />
              ),
            },
          ]}
          leftActions={[<OverviewModalButton task={task[0]} />]}
          rightActions={[
            <Button
              variant="text"
              color="info"
              onClick={() => {
                // @ts-ignore
                //window.posthog.capture("clicked cancel");

                window.location.href = "/";
              }}
            >
              Cancel
            </Button>,
            <LoadingButton
              loading={draftIsBeingSaved}
              variant="outlined"
              color="info"
              onClick={() => {
                // @ts-ignore
                //window.posthog.capture("clicked 'Save draft'");

                onSaveDraft();
              }}
            >
              <SaveIcon sx={{ mr: 1 }} />
              Submit Draft
            </LoadingButton>,
            <LoadingButton
              loading={false}
              variant="contained"
              onClick={() => {
                setShowConfirmationModal(true);
              }}
            >
              <RocketLaunchIcon sx={{ mr: 1 }} />
              SUBMIT SOLUTION
            </LoadingButton>,
          ]}
        />
        <ConfirmationModal
          showModal={showConfirmationModal}
          onConfirm={onSubmitSolution}
          loading={solutionIsBeingSubmitted}
          onClose={() => setShowConfirmationModal(false)}
        />
        {isScreenTooSmall && (
          <Box
            sx={{
              position: "fixed",
              top: 0,
              bottom: 0,
              left: 0,
              right: 0,
              backgroundColor: "white",
            }}
          >
            <Container maxWidth="sm" sx={{ mt: 3 }}>
              <Box sx={{ p: 1, display: "flex", justifyContent: "center" }}>
                <Typography variant="h4">Aw shucks, fam.</Typography>
              </Box>
              <Box sx={{ pl: 1, pr: 1 }}>
                <Typography
                  variant="body1"
                  gutterBottom
                  sx={{ textAlign: "center" }}
                >
                  Your screen is too small for us to display the workspace for
                  this competition.
                </Typography>
                <Typography
                  variant="body1"
                  gutterBottom
                  sx={{ textAlign: "center" }}
                >
                  Try visiting this page on a laptop or desktop computer.
                </Typography>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  width: "100%",
                  mt: 3,
                  overflowX: "hidden",
                }}
              >
                <ImageFadeIn
                  height={300}
                  src={
                    "https://storage.googleapis.com/cottage-assets/cat-in-box-with-lid.webp"
                  }
                />
              </Box>
              <Box
                sx={{
                  mt: 1,
                  mb: 1,
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <Typography variant="caption" gutterBottom>
                  In the meantime, here is a cat trying to fit into a small box.
                </Typography>
              </Box>
            </Container>
          </Box>
        )}
      </Container>
    </LocalizationProvider>
  );
};

export default TaskDetails;
