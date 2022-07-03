import React, { useEffect } from "react";
import StackblitzSDK from "@stackblitz/sdk";
import { Box } from "@mui/material";

interface OwnProps {
  task?: any[];
  submission?: any[];
}

export default function Editor({ task, submission }: OwnProps) {
  const contents =
    submission && submission.length > 0
      ? JSON.parse(submission[0]["Contents"])
      : JSON.parse(task[0]["Contents"]);
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
            dependencies: JSON.parse(task[0]["Dependencies"]),
          },
          {
            openFile: Object.keys(JSON.parse(task[0]["Contents"]))[1],
            height: window.innerHeight,
            forceEmbedLayout: true,
          }
        ));
    }

    async function initializeDefaultEditor() {
      const vm = ((window as any).stackblitzVM =
        await StackblitzSDK.embedProjectId("editor", "react-ts-bwmw61", {
          height: window.innerHeight,
        }));
    }

    if (task) {
      initializeEditorWithContent();
    } else {
      initializeDefaultEditor();
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
