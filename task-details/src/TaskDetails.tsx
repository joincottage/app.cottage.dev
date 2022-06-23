import React, { useEffect, useMemo, useReducer, useState } from "react";
import { Button, Container, Grid, Stack, Typography } from "@mui/material";
import useAirtable from "./hooks/useAirtable";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import Airtable from "airtable";
import SaveIcon from "@mui/icons-material/Save";
import RocketLaunchIcon from "@mui/icons-material/RocketLaunch";
import LoadingButton from "@mui/lab/LoadingButton";
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
import BasicTabs from "./components/BasicTabs";
import Editor from "./components/Editor";
import Overview from "./components/Overview";
import OverviewModalButton from "./components/OverviewModalButton";

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
                onClick={() => (window.location.href = "/")}
              >
                Cancel
              </Button>,
              <LoadingButton
                loading={formIsSubmitting}
                variant="outlined"
                color="info"
                onClick={onSubmit.bind(null, true)}
              >
                <SaveIcon sx={{ mr: 1 }} />
                Save Draft
              </LoadingButton>,
              <LoadingButton
                loading={false}
                variant="contained"
                onClick={onSubmit.bind(null, false)}
              >
                <RocketLaunchIcon sx={{ mr: 1 }} />
                SUBMIT SOLUTION
              </LoadingButton>,
            ]}
          />
        </Container>
      </LocalizationProvider>
    </AppDataContext.Provider>
  );
};

export default TaskDetails;
