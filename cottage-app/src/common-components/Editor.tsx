import React, { useEffect, useMemo } from "react";
import StackblitzSDK from "@stackblitz/sdk";
import { Box } from "@mui/material";
import doesAirtableItemExist from "../utils/doesAirtableItemExist";

interface OwnProps {
  task?: any[];
  submission?: any[];
}

let editorInitialized = false;
window.StackblitzSDK = StackblitzSDK;

export default function Editor({ task, submission }: OwnProps) {
  const contents = doesAirtableItemExist(submission)
    ? JSON.parse(submission[0]["Contents"])
    : JSON.parse(task[0]["Contents"]);
  const dependencies =
    submission && submission.length > 0
      ? JSON.parse(submission[0]["Dependencies"])
      : JSON.parse(task[0]["Dependencies"]);

  useEffect(() => {
    async function initializeEditorWithContent() {
      const vm = ((window as any).stackblitzVM =
        await StackblitzSDK.embedProject(
          "editor",
          {
            files: contents,
            title: task[0]["Name"],
            description: "",
            template: "create-react-app",
            dependencies,
          },
          {
            openFile: task[0]["Open File Name"],
            height: window.innerHeight,
            forceEmbedLayout: false,
          }
        ));
    }

    async function initializeEditorForExistingSubmission() {
      const vm = ((window as any).stackblitzVM =
        await StackblitzSDK.embedProjectId(
          "editor",
          submission[0]["Stackblitz Project ID"],
          {
            height: window.innerHeight,
            forceEmbedLayout: false,
          }
        ));
    }

    async function initializeDefaultEditor() {
      const vm = ((window as any).stackblitzVM =
        await StackblitzSDK.embedProjectId("editor", "react-ts-bwmw61", {
          height: window.innerHeight,
        }));
    }

    if (
      doesAirtableItemExist(submission) &&
      submission[0]["Stackblitz Project ID"] &&
      !editorInitialized
    ) {
      initializeEditorForExistingSubmission();
      editorInitialized = true;
    } else if (doesAirtableItemExist(task) && !editorInitialized) {
      initializeEditorWithContent();
      editorInitialized = true;
    } else if (!editorInitialized) {
      initializeDefaultEditor();
      editorInitialized = true;
    }
  }, [task]);

  return (
    <Box
      sx={{
        position: "relative",
        background: "rgb(21,24,30)",
        overflow: "hidden",
      }}
    >
      <div style={{ position: "relative", overflow: "hidden" }}>
        <div id="editor"></div>
      </div>
    </Box>
  );
}
