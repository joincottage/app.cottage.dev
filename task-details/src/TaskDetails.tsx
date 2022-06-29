import React, { useMemo, useReducer, useState } from "react";
import { Box, Container, Divider, Typography } from "@mui/material";
import useAirtable from "./hooks/useAirtable";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
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
import ImageFadeIn from "react-image-fade-in";

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

const updateTaskInAirtable = async (
  task: any,
  projectContents: string,
  isDraft: boolean
): Promise<any> =>
  new Promise((resolve, reject) => {
    base("Tasks").update(
      [
        {
          id: params.recordId,
          fields: {
            Name: task["Name"],
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

  const {
    data: task,
    error: taskError,
    loading: taskLoading,
  } = useAirtable({
    tableName: "Tasks",
    filterByFormula: `{Record ID} = '${params.recordId}'`,
  });

  const [formIsSubmitting, setFormIsSubmitting] = useState(false);

  // @ts-ignore
  const [state, dispatch] = useReducer(appReducer, initialState);
  const contextValue = useMemo(() => {
    return { state, dispatch };
  }, [state, dispatch]) as AppContext;

  const onSubmit = (isDraft: boolean) => {
    async function submitForm() {
      setFormIsSubmitting(true);

      const projectContents = await (
        window as any
      ).stackblitzVM.getFsSnapshot();

      await updateTaskInAirtable(
        task[0],
        JSON.stringify(projectContents, null, 2),
        isDraft
      );

      setFormIsSubmitting(false);

      if (!isDraft) {
        window.location.href = "/";
      }
    }

    submitForm();
  };

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
          <Editor task={params.recordId ? task : null} />
        </Container>
      </LocalizationProvider>
    </AppDataContext.Provider>
  );
};

export default TaskDetails;
