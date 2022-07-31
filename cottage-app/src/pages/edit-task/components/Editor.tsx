import React, { useEffect } from "react";
import StackblitzSDK from "@stackblitz/sdk";
import { Box } from "@mui/material";

interface OwnProps {
  task?: any[];
}

export default function Editor({ task }: OwnProps) {
  useEffect(() => {
    async function initializeEditorWithContent() {
      const vm = ((window as any).stackblitzVM =
        await StackblitzSDK.embedProject(
          "editor",
          {
            files: JSON.parse(task[0]["Contents"]),
            title: task[0]["Name"],
            description: "",
            template: "create-react-app",
            dependencies: JSON.parse(task[0]["Dependencies"]),
          },
          {
            openFile: Object.keys(JSON.parse(task[0]["Contents"]))[0],
            height: window.innerHeight - 70,
          }
        ));
    }

    async function initializeDefaultEditor() {
      const vm = ((window as any).stackblitzVM =
        await StackblitzSDK.embedProjectId("editor", "react-ts-bwmw61", {
          height: window.innerHeight - 30,
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
      <div style={{ position: "relative", top: "-40px", overflow: "hidden" }}>
        <div id="editor"></div>
      </div>
    </Box>
  );
}
