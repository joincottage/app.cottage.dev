import React, { useEffect, useMemo, useReducer, useState } from "react";
import { Button, Container, Grid, Stack, Typography } from "@mui/material";
import { PlaceType } from "./components/GooglePlacesAutocomplete";
import useAirtable from "./hooks/useAirtable";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import Airtable from "airtable";
import moment from "moment";
import LoadingButton from "@mui/lab/LoadingButton";
import {
  AppAction,
  AppContext,
  AppDataContext,
  AppState,
  initialState,
} from "./AppContext";
import { SET_SELECTED_TASKS } from "./actions/setSelectedTasks";
import flatten from "lodash/flatten";
import StackblitzSDK from "@stackblitz/sdk";
// @ts-ignore
import { Helmet } from "react-helmet";

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

const postSubmissionToAirtable = async (
  task: any,
  projectContents: string
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
            "Stackblitz Project ID": task["Stackblitz Project ID"],
            Contents: projectContents,
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
const ReviewSubmission = () => {
  const {
    data: submission,
    error: submissionError,
    loading: submissionLoading,
  } = useAirtable({
    tableName: "Submissions",
    filterByFormula: `{Record ID} = '${params.recordId}'`,
  });

  const [selectedClient, setSelectedClient] = useState<any | null>(null);
  const [tripName, setTripName] = useState("");
  const [location, setLocation] = useState<PlaceType | null>(null);
  const [locationCoordinates, setLocationCoordinates] = useState(null);
  const [selectedTaskList, setSelectedTaskList] = useState<any[] | null>(null);
  const [departureDate, setDepartureDate] = useState<any | null>(null);
  const [returnDate, setReturnDate] = useState<any | null>(null);
  const [totalTravellerCount, setTotalTravellerCount] = useState(0);
  const [notes, setNotes] = useState("");

  const [formIsSubmitting, setFormIsSubmitting] = useState(false);

  // @ts-ignore
  const [state, dispatch] = useReducer(appReducer, initialState);
  const contextValue = useMemo(() => {
    return { state, dispatch };
  }, [state, dispatch]) as AppContext;

  const onSubmit = () => {
    async function submitForm() {
      setFormIsSubmitting(true);

      const projectContents = await (
        window as any
      ).stackblitzVM.getFsSnapshot();

      await postSubmissionToAirtable(
        submission[0],
        JSON.stringify(projectContents, null, 2)
      );

      setFormIsSubmitting(false);
      window.location.href = "/";
    }

    submitForm();
  };

  useEffect(() => {
    async function initializeEditor() {
      const vm = ((window as any).stackblitzVM =
        await StackblitzSDK.embedProject(
          "editor",
          {
            files: JSON.parse(submission[0]["Contents"]),
            title: submission[0]["Name"],
            description: "",
            template: "create-react-app",
          },
          {
            openFile: Object.keys(JSON.parse(submission[0]["Contents"]))[0],
            height: window.innerHeight - 70,
          }
        ));
    }

    if (submission) {
      initializeEditor();
    }
  }, [submission]);

  return submissionLoading ? null : (
    <AppDataContext.Provider value={contextValue}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Helmet>
          <style>{`
          iframe { border: none; }
          .container { max-width: none !important; }
          #custom-code1 { padding-top: 0 !important; padding-bottom: 0 !important; }
          .col-12 { padding: 0 !important; }
          `}</style>
        </Helmet>
        <Container maxWidth={false} style={{ padding: 0 }}>
          <Grid container spacing={2}>
            <Grid item xs={4}>
              <Stack spacing={2} pl={2}>
                <Typography variant="h6">{submission[0]["Name"]}</Typography>
                <Stack direction="row-reverse" spacing={2}>
                  <LoadingButton
                    loading={formIsSubmitting}
                    variant="contained"
                    onClick={onSubmit}
                  >
                    Save
                  </LoadingButton>
                  <Button
                    variant="outlined"
                    onClick={() => (window.location.href = "/onboarding")}
                  >
                    Cancel
                  </Button>
                </Stack>
              </Stack>
            </Grid>
            <Grid item xs={8} sx={{ position: "relative" }}>
              <div id="editor"></div>
            </Grid>
          </Grid>
        </Container>
      </LocalizationProvider>
    </AppDataContext.Provider>
  );
};

export default ReviewSubmission;
