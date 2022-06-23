import React, { useEffect, useState } from "react";
import useAirtable from "./hooks/useAirtable";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import Airtable from "airtable";
import { AppAction, AppState } from "./AppContext";
import { SET_SELECTED_TASKS } from "./actions/setSelectedTasks";
// @ts-ignore
import { Helmet } from "react-helmet";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import {
  Checkbox,
  Container,
  Divider,
  FormControl,
  FormControlLabel,
  FormGroup,
  Grid,
  Stack,
} from "@mui/material";
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";

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
  (window as any)?.logged_in_user?.airtable_record_id;

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
const TaskOverview = () => {
  const {
    data: task,
    error: taskError,
    loading: taskLoading,
  } = useAirtable({
    tableName: "Tasks",
    filterByFormula: `{Record ID} = '${params.recordId}'`,
  });

  const [checked, setChecked] = useState([]);

  const [acceptanceCriteria, setAcceptanceCriteria] = useState([]);
  useEffect(() => {
    if (task) {
      setAcceptanceCriteria(task[0]["Acceptance Criteria"].split(";"));
    }
  }, [task]);

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
        <Box
          sx={{
            position: "absolute" as "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            bgcolor: "background.paper",
            p: 4,
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Container maxWidth="lg">
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Typography variant="h6" sx={{ color: "text.primary" }}>
                  UX Design Images
                </Typography>
                <Stack sx={{ mt: 2 }}>
                  {task[0]["UX Design Images"].map((u: any) => (
                    <Zoom>
                      <img
                        alt={u.filename as string}
                        src={u.url}
                        width="375"
                        style={{ borderRadius: "0.5rem" }}
                      />
                    </Zoom>
                  ))}
                </Stack>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="h6" sx={{ color: "text.primary" }}>
                  Description
                </Typography>
                <Typography
                  variant="body1"
                  sx={{ color: "text.primary", mt: 2 }}
                >
                  {task[0].Description}
                </Typography>
                <Divider sx={{ mt: 2, mb: 2 }} />
                <Typography variant="h6" sx={{ color: "text.primary" }}>
                  Acceptance Criteria
                </Typography>
                <FormControl
                  component="fieldset"
                  variant="standard"
                  sx={{ mt: 1 }}
                >
                  <FormGroup>
                    {acceptanceCriteria.map(
                      (a) =>
                        a && (
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={checked.includes(a)}
                                onChange={() =>
                                  checked.includes(a)
                                    ? setChecked(checked.filter((c) => c !== a))
                                    : setChecked([...checked, a])
                                }
                                name={a}
                              />
                            }
                            label={a}
                            sx={{ color: "text.primary" }}
                          />
                        )
                    )}
                  </FormGroup>
                </FormControl>
              </Grid>
            </Grid>
          </Container>
        </Box>
      </Container>
    </LocalizationProvider>
  );
};

export default TaskOverview;
