import React, { useEffect, useMemo, useReducer, useState } from "react";
import { Box, Button, Container, Divider, Typography } from "@mui/material";
import useAirtable from "./hooks/useAirtable";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import SaveIcon from "@mui/icons-material/Save";
import Airtable from "airtable";
import {
  AppAction,
  AppContext,
  AppDataContext,
  AppState,
  initialState,
} from "./AppContext";
import { SET_SELECTED_TASKS } from "./actions/setSelectedTasks";
// @ts-ignore
import { Helmet } from "react-helmet";
import Editor from "./components/Editor";
import useMediaQuery from "@mui/material/useMediaQuery";
// @ts-ignore
import ImageFadeIn from "react-image-fade-in";
import OverviewModalButton from "./components/OverviewModalButton";
import BasicTabs from "./components/BasicTabs";
import LoadingButton from "@mui/lab/LoadingButton";
import RocketLaunchIcon from "@mui/icons-material/RocketLaunch";
import ConfirmationModal from "./components/ConfirmationModal";

function appReducer(state: AppState, action: AppAction) {
  switch (action.type) {
    case SET_SELECTED_TASKS:
      return {
        ...state,
        selectedTasks: action.payload.selectedTasks,
      };
    default:
      // TODO: report unknown action types as an error
      throw new Error(`Unrecognized action: ${action.type}`);
  }
}

const getLoggedInUserRecordID = () =>
  (window as any)?.logged_in_user?.airtable_record_id || "rec42IZUiZSfnHZvO";

const updateSubmissionInAirtable = async (
  submission: any,
  projectContents: string,
  isDraft: boolean
): Promise<any> =>
  new Promise((resolve, reject) => {
    base("Submissions").update(
      [
        {
          id: submission["Record ID"],
          fields: {
            Contents: projectContents,
            IsDraft: `${isDraft}`,
          },
        },
      ],
      function (err: any, records: any) {
        if (err) {
          console.error(err);
          reject(err);
          return;
        }
        resolve(records[0].fields);
      }
    );
  });

const createSubmissionInAirtable = async (
  task: any,
  projectContents: string,
  isDraft: boolean
): Promise<any> =>
  new Promise((resolve, reject) => {
    base("Submissions").create(
      [
        {
          fields: {
            Name: task["Name"],
            Status: "Awaiting Review",
            Users: [getLoggedInUserRecordID()],
            Tasks: [task["Record ID"]],
            Contents: projectContents,
            IsDraft: `${isDraft}`,
          },
        },
      ],
      function (err: any, records: any) {
        if (err) {
          console.error(err);
          reject(err);
          return;
        }
        resolve(records[0].fields);
      }
    );
  });

// FIXME: Move behind API to hide Airtable API key
const base = new Airtable({ apiKey: "keyk0tDEC8slUu1HI" }).base(
  "appk7ctplKKCsOhWQ"
);

const params: Record<string, any> = new Proxy(
  new URLSearchParams(window.location.search),
  {
    get: (searchParams, prop) => searchParams.get(prop as string),
  }
);

// tslint:disable-next-line: cyclomatic-complexity
const TaskDetails = () => {
  const isScreenTooSmall = useMediaQuery("(max-width:600px)");
  const { data: task, loading: taskLoading } = useAirtable({
    tableName: "Tasks",
    filterByFormula: `{Record ID} = '${params.recordId}'`,
  });
  const { data: submission } = useAirtable({
    tableName: "Submissions",
    filterByFormula: `AND({Record ID (from Users)} = '${getLoggedInUserRecordID()}', {Record ID (from Tasks)} = '${
      params.recordId
    }')`,
  });
  const [draftIsBeingSaved, setDraftIsBeingSaved] = useState(false);
  const [solutionIsBeingSubmitted, setSolutionIsBeingSubmitted] =
    useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [newlyCreatedSubmission, setNewlyCreatedSubmission] = useState(null);

  // @ts-ignore
  const [state, dispatch] = useReducer(appReducer, initialState);
  const contextValue = useMemo(() => {
    return { state, dispatch };
  }, [state, dispatch]) as AppContext;

  const onSaveDraft = () => {
    async function saveDraft() {
      setDraftIsBeingSaved(true);

      const projectContents = await (
        window as any
      ).stackblitzVM.getFsSnapshot();

      const submissionToSave = submission[0] || newlyCreatedSubmission;
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
    setSolutionIsBeingSubmitted(true);

    const projectContents = await (window as any).stackblitzVM.getFsSnapshot();

    const submissionToSubmit = submission[0] || newlyCreatedSubmission;
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

  const SAVE_DRAFT_INTERVAL_MILLIS = 60000;
  useEffect(() => {
    let intervalId: NodeJS.Timer;

    // I think the "task" variable gets captured in a closure when we
    // instantiate the setTimeout, thus making it "undefined" for all future
    // invocations. We fix this by only instantiating the setTimeout when
    // "task" is defined.
    if (task) {
      setTimeout(() => {
        intervalId = setInterval(() => {
          console.log("Saving draft...");
          onSaveDraft();
        }, SAVE_DRAFT_INTERVAL_MILLIS);
      }, SAVE_DRAFT_INTERVAL_MILLIS);
    }
    return () => clearInterval(intervalId);
  }, [task]);

  if (isScreenTooSmall) {
    return (
      <Container maxWidth="sm" sx={{ mt: 3 }}>
        <Box sx={{ p: 1, display: "flex", justifyContent: "center" }}>
          <Typography variant="h4">Aw shucks, fam.</Typography>
        </Box>
        <Box sx={{ pl: 1, pr: 1 }}>
          <Typography variant="body1" gutterBottom sx={{ textAlign: "center" }}>
            Your screen is too small for us to display the workspace for this
            competition.
          </Typography>
          <Typography variant="body1" gutterBottom sx={{ textAlign: "center" }}>
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
        <Box sx={{ mt: 1, mb: 1, display: "flex", justifyContent: "center" }}>
          <Typography variant="caption" gutterBottom>
            In the meantime, here is a cat trying to fit into a small box.
          </Typography>
        </Box>
      </Container>
    );
  }

  return taskLoading ? null : (
    <AppDataContext.Provider value={contextValue}>
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
                    submission={submission}
                  />
                ),
              },
            ]}
            leftActions={[<OverviewModalButton task={task[0]} />]}
            rightActions={[
              <Button
                variant="text"
                color="info"
                onClick={() => (window.location.href = "/")}
              >
                Cancel
              </Button>,
              <LoadingButton
                loading={draftIsBeingSaved}
                variant="outlined"
                color="info"
                onClick={onSaveDraft}
              >
                <SaveIcon sx={{ mr: 1 }} />
                Save Draft
              </LoadingButton>,
              <LoadingButton
                loading={false}
                variant="contained"
                onClick={() => setShowConfirmationModal(true)}
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
        </Container>
      </LocalizationProvider>
    </AppDataContext.Provider>
  );
};

export default TaskDetails;
