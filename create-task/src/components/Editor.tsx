import React, { useEffect } from "react";
import StackblitzSDK from "@stackblitz/sdk";
import { Box } from "@mui/material";

interface OwnProps {
  task?: any[];
}

export default function Editor({ task }: OwnProps) {
  const contents =
    task && task[0]["Contents"] ? JSON.parse(task[0]["Contents"]) : {};
  useEffect(() => {
    async function initializeEditorWithContent() {
      const vm = ((window as any).stackblitzVM =
        await StackblitzSDK.embedProject(
          "editor",
          {
            files: contents,
            title: task ? task[0]["Name"] : "",
            description: "",
            template: "create-react-app",
            dependencies: task ? JSON.parse(task[0]["Dependencies"]) : {},
          },
          {
            openFile: task ? task[0]["Open File Name"] : undefined,
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

    if (task && task[0]["Contents"]) {
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
