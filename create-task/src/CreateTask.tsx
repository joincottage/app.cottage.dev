import React, { useEffect, useMemo, useReducer, useState } from "react";
import { Box, Button, Container, Divider, Typography } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import SaveIcon from "@mui/icons-material/Save";
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
import useInterval from "./hooks/useInterval";
import useSubmission from "./hooks/useSubmission";
import useTask from "./hooks/useTask";
import axios from "axios";
import { API_BASE_URL } from "./constants";
import getJWTToken from "./util/getJWTToken";

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

const params: Record<string, any> = new Proxy(
  new URLSearchParams(window.location.search),
  {
    get: (searchParams, prop) => searchParams.get(prop as string),
  }
);

const getLoggedInUserRecordID = () =>
  (window as any)?.logged_in_user?.airtable_record_id || "recdim56cUfKolPQd";

const updateTaskInAirtable = async (
  task: any,
  projectContents: string,
  isDraft: boolean
): Promise<any> => {
  const response = await axios.patch(
    `${API_BASE_URL}/tasks?recordId=${
      task["Record ID"]
    }&jwtToken=${getJWTToken()}`,
    {
      fields: {
        Contents: projectContents,
        IsDraft: `${isDraft}`,
      },
    }
  );

  return response.data;
};

const createTaskInAirtable = async (
  projectContents: string,
  isDraft: boolean
): Promise<any> => {
  const response = await axios.post(
    `${API_BASE_URL}/tasks?jwtToken=${getJWTToken()}`,
    {
      fields: {
        Name: "",
        Status: "Todo",
        Requester: [getLoggedInUserRecordID()],
        Contents: projectContents,
        IsDraft: `${isDraft}`,
      },
    }
  );

  return response.data;
};

// tslint:disable-next-line: cyclomatic-complexity
const CreateTask = () => {
  const isScreenTooSmall = useMediaQuery("(max-width:800px)");

  const { data: task, loading: taskLoading } = useTask({
    recordId: params.recordId,
    loggedInUserRecordID: getLoggedInUserRecordID(),
  });

  const [draftIsBeingSaved, setDraftIsBeingSaved] = useState(false);
  const [taskIsBeingSubmitted, setTaskIsBeingSubmitted] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [newlyCreatedTask, setNewlyCreatedTask] = useState(null);

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

        await updateTaskInAirtable(
          task[0],
          JSON.stringify(projectContents, null, 2),
          true
        );

      // It's a bit jarring to see the loading spinner flash so quickly
      setTimeout(() => {
        setDraftIsBeingSaved(false);
      }, 2000);
    }

    saveDraft();
  };

  const onLaunchCompetition = async () => {
    if (!task) {
      console.error(
        "attempted to submit a competition when task does not exist"
      );
      return;
    }

    // @ts-ignore
    window.posthog.capture("clicked 'Launch Competition'", {
      taskRecordIdInAirtable: task[0]["Record ID"],
    });

    setTaskIsBeingSubmitted(true);

    const projectContents = await (window as any).stackblitzVM.getFsSnapshot();

    const taskToSubmit = task[0] || newlyCreatedTask;
    await updateTaskInAirtable(
      taskToSubmit,
      JSON.stringify(projectContents, null, 2),
      false
    );

    // It's a bit jarring to see the loading spinner flash so quickly
    await new Promise<void>((resolve) =>
      setTimeout(() => {
        setTaskIsBeingSubmitted(false);
        resolve();
      }, 2000)
    );
  };

  const SAVE_DRAFT_INTERVAL_MILLIS = 10000;
  useInterval(() => {
    onSaveDraft();
  }, SAVE_DRAFT_INTERVAL_MILLIS);

  if (isScreenTooSmall) {
    // @ts-ignore
    window.posthog.capture("cat-box");

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
                content: <Editor task={params.recordId ? task : null} />,
              },
            ]}
            leftActions={[<OverviewModalButton task={task[0]} />]}
            rightActions={[
              <Button
                variant="text"
                color="info"
                onClick={() => {
                  // @ts-ignore
                  window.posthog.capture("clicked cancel");

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
                  window.posthog.capture("clicked 'Save draft'");

                  onSaveDraft();
                }}
              >
                <SaveIcon sx={{ mr: 1 }} />
                Save Draft
              </LoadingButton>,
              <LoadingButton
                loading={false}
                variant="contained"
                onClick={() => {
                  setShowConfirmationModal(true);
                }}
              >
                <RocketLaunchIcon sx={{ mr: 1 }} />
                LAUNCH COMPETITION
              </LoadingButton>,
            ]}
          />
          <ConfirmationModal
            showModal={showConfirmationModal}
            onConfirm={onLaunchCompetition}
            loading={taskIsBeingSubmitted}
            onClose={() => setShowConfirmationModal(false)}
          />
        </Container>
      </LocalizationProvider>
    </AppDataContext.Provider>
  );
};

export default CreateTask;
