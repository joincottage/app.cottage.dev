import React, { useEffect, useState } from "react";
import { Box, Button, Container, Stack, TextField } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import Airtable from "airtable";
import LoadingButton from "@mui/lab/LoadingButton";
import StackblitzSDK from "@stackblitz/sdk";
import { Helmet } from "react-helmet";
import { AppDataContext } from "../../AppContext";
import BasicTabs from "../BasicTabs";

const getLoggedInUserRecordID = () =>
  (window as any)?.logged_in_user?.airtable_record_id || "rec42IZUiZSfnHZvO";

const postTaskToAirtable = async (
  taskName: string,
  taskDescription: string,
  projectContents: string
): Promise<any> =>
  new Promise((resolve, reject) => {
    base("Tasks").create(
      [
        {
          fields: {
            Name: taskName,
            Description: taskDescription,
            Contents: projectContents,
            Status: "Todo",
            Requester: [getLoggedInUserRecordID()],
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

// tslint:disable-next-line: cyclomatic-complexity
const CreateTask = () => {
  const [taskName, setTaskName] = useState("");
  const [taskDescription, setTaskDescription] = useState("");

  const [formIsSubmitting, setFormIsSubmitting] = useState(false);

  const onSubmit = () => {
    async function submitForm() {
      setFormIsSubmitting(true);

      const projectContents = await (
        window as any
      ).stackblitzVM.getFsSnapshot();

      await postTaskToAirtable(
        taskName,
        taskDescription,
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
        await StackblitzSDK.embedProjectId("editor", "react-ts-bwmw61", {
          height: window.innerHeight - 70,
        }));
    }

    initializeEditor();
  }, []);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Helmet>
        <style>{`
          iframe { border: none; }
          .container { max-width: none !important; }
          #custom-code2 {
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
      <Container maxWidth={false} style={{ padding: 0 }}>
        <BasicTabs
          tabItems={[
            {
              label: "Editor",
              content: (
                <Box sx={{ position: "relative" }}>
                  <div id="editor"></div>
                </Box>
              ),
            },
            {
              label: "Overview",
              content: (
                <Stack spacing={2} pl={2}>
                  <TextField
                    required
                    label="Task Name"
                    value={taskName}
                    onChange={(e: any) => setTaskName(e.target.value)}
                  />
                  <TextField
                    required
                    multiline
                    rows={4}
                    label="Task Description"
                    value={taskDescription}
                    onChange={(e: any) => setTaskDescription(e.target.value)}
                  />
                </Stack>
              ),
            },
          ]}
          actions={[
            <Button
              variant="outlined"
              onClick={() => (window.location.href = "/")}
            >
              Cancel
            </Button>,
            <Button variant="outlined" onClick={() => {}}>
              Save Draft
            </Button>,
            <LoadingButton
              loading={formIsSubmitting}
              variant="contained"
              onClick={onSubmit}
            >
              Submit
            </LoadingButton>,
          ]}
        />
      </Container>
    </LocalizationProvider>
  );
};

export default CreateTask;
